import { generateEmbedding, cosineSimilarity } from "./embeddingService.js";
import { getEmbeddedResources } from "./embeddingCache.js";
import { mockResources } from "../data/mockResources.js";

/**
 * Simple keyword-based fallback when RAG is unavailable
 */
function findRelevantResourcesKeywordFallback(query, limit = 5) {
  const normalize = (text) => text.toLowerCase().trim();
  const normalizedQuery = normalize(query);
  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);

  const resourcesWithScores = mockResources.map((resource) => {
    let score = 0;
    const searchText = normalize([
      resource.title,
      resource.description,
      resource.category,
      ...resource.keywords,
      ...resource.steps,
    ].join(" "));

    // Exact phrase match in title
    if (normalize(resource.title).includes(normalizedQuery)) {
      score += 50;
    }

    // Exact phrase match in description
    if (normalize(resource.description).includes(normalizedQuery)) {
      score += 30;
    }

    // Keyword matches
    for (const keyword of resource.keywords) {
      if (normalizedQuery.includes(normalize(keyword))) {
        score += 20;
      }
    }

    // Token matches
    for (const token of queryTokens) {
      if (token.length > 2 && searchText.includes(token)) {
        score += 5;
      }
    }

    return {
      ...resource,
      score: score,
      similarity: score / 100, // Fake similarity for consistency
    };
  });

  return resourcesWithScores
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Find relevant resources using semantic search with vector embeddings (RAG)
 * Falls back to keyword matching if embeddings are unavailable
 * @param {string} query - User's question
 * @param {number} limit - Maximum number of results to return
 * @returns {Promise<Object[]>} - Relevant resources sorted by semantic similarity
 */
export async function findRelevantResources(query, limit = 5) {
  try {
    // Get pre-computed embeddings for all resources
    const embeddedResources = await getEmbeddedResources();

    // If no embeddings available, fall back to keyword matching
    if (!embeddedResources) {
      console.log("Using keyword-based fallback (RAG unavailable)");
      return findRelevantResourcesKeywordFallback(query, limit);
    }

    // Generate embedding for the user's query
    const queryEmbedding = await generateEmbedding(query);

    // Calculate cosine similarity between query and each resource
    const resourcesWithScores = embeddedResources.map((resource) => {
      const similarity = cosineSimilarity(queryEmbedding, resource.embedding);

      // Convert similarity (0-1) to score (0-100) for consistency
      const score = similarity * 100;

      return {
        id: resource.id,
        category: resource.category,
        title: resource.title,
        description: resource.description,
        keywords: resource.keywords,
        steps: resource.steps,
        links: resource.links,
        contacts: resource.contacts,
        score: score,
        similarity: similarity,
      };
    });

    // Sort by similarity (highest first) and return top results
    return resourcesWithScores
      .filter((resource) => resource.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  } catch (error) {
    console.error("Error in semantic search:", error);

    // Fall back to keyword matching
    console.log("Falling back to keyword matching due to error");
    return findRelevantResourcesKeywordFallback(query, limit);
  }
}

/**
 * Build fallback guidance when Claude API fails or returns invalid response
 * @param {string} question - Original user question
 * @param {Object[]} relevantResources - Retrieved resources
 * @returns {Object} - Fallback guidance object
 */
export function buildFallbackGuidance(question, relevantResources) {
  const topResource = relevantResources[0];

  if (!topResource) {
    return {
      answer:
        "I could not confidently match that request to a mock NBCU resource. Start with the IT Service Desk or HR Support depending on whether this is a systems or employee-services question.",
      nextSteps: [
        "Rephrase the question with the system name, task, or department if you know it.",
        "Check the HR portal for employee policy questions.",
        "Check the IT service catalog for access, software, device, or login issues.",
      ],
      resources: [
        { label: "HR Portal", url: "https://hr.nbcuni.com" },
        { label: "IT Service Catalog", url: "https://it.nbcuni.com/catalog" },
      ],
      confidence: "low",
      escalation: {
        contact: "IT Service Desk or HR Support",
        reason: "The prototype did not find a strong match in the mock resource set.",
      },
      source: "fallback",
      matchedResources: [],
    };
  }

  // Determine confidence based on semantic similarity score
  let confidence = "low";
  if (topResource.score >= 70) {
    confidence = "high";
  } else if (topResource.score >= 40) {
    confidence = "medium";
  }

  return {
    answer: `${topResource.title}: ${topResource.description}`,
    nextSteps: topResource.steps,
    resources: topResource.links,
    confidence: confidence,
    escalation: {
      contact: `${topResource.contacts[0].role} (${topResource.contacts[0].email})`,
      reason: "Escalate if you cannot access the linked portal or your request is blocked.",
    },
    source: "fallback",
    matchedResources: relevantResources.map(({ id, title, category, score, similarity }) => ({
      id,
      title,
      category,
      score: Math.round(score * 10) / 10, // Round to 1 decimal
      similarity: Math.round(similarity * 1000) / 1000, // Round to 3 decimals
    })),
    question,
  };
}
