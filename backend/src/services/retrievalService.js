import { mockResources } from "../data/mockResources.js";

const normalize = (value) => value.toLowerCase().replace(/[^\w\s-]/g, " ");

// Common synonyms for better matching
const SYNONYMS = {
  paycheck: ["salary", "pay", "payment", "compensation", "direct deposit"],
  password: ["login", "credentials", "access", "sign in", "authentication"],
  benefits: ["insurance", "healthcare", "health", "medical", "dental", "vision"],
  expense: ["reimbursement", "receipt", "spending", "cost"],
  onboarding: ["new hire", "orientation", "getting started", "first day"],
  equipment: ["device", "laptop", "computer", "hardware", "monitor"],
  software: ["application", "app", "program", "tool", "system"],
  training: ["learning", "course", "education", "development"],
};

export function findRelevantResources(query, limit = 5) {
  const normalizedQuery = normalize(query);
  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);
  const expandedTokens = expandWithSynonyms(queryTokens);

  return mockResources
    .map((resource) => ({
      ...resource,
      score: calculateRelevanceScore(normalizedQuery, queryTokens, expandedTokens, resource),
    }))
    .filter((resource) => resource.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function expandWithSynonyms(tokens) {
  const expanded = new Set(tokens);

  for (const token of tokens) {
    for (const [key, synonyms] of Object.entries(SYNONYMS)) {
      if (token === key || synonyms.includes(token)) {
        expanded.add(key);
        synonyms.forEach(syn => expanded.add(syn));
      }
    }
  }

  return Array.from(expanded);
}

function calculateRelevanceScore(query, queryTokens, expandedTokens, resource) {
  const searchableText = normalize(
    [
      resource.category,
      resource.title,
      resource.description,
      ...resource.keywords,
      ...resource.steps,
    ].join(" ")
  );

  let score = 0;

  // Exact phrase match in title (highest priority)
  if (normalize(resource.title).includes(query)) {
    score += 25;
  }

  // Exact phrase match in description
  if (normalize(resource.description).includes(query)) {
    score += 15;
  }

  // Keyword matching (high priority)
  for (const keyword of resource.keywords) {
    const normalizedKeyword = normalize(keyword).trim();
    if (normalizedKeyword && query.includes(normalizedKeyword)) {
      // Multi-word keywords are more specific
      score += normalizedKeyword.includes(" ") ? 20 : 12;
    }
  }

  // Category matching
  if (normalize(resource.category).includes(query)) {
    score += 10;
  }

  // Token matching with position weighting (early tokens more important)
  for (let i = 0; i < queryTokens.length; i++) {
    const token = queryTokens[i];
    if (token.length > 2 && searchableText.includes(token)) {
      // Earlier tokens get slightly higher weight
      const positionWeight = Math.max(1, 3 - i * 0.5);
      score += positionWeight;
    }
  }

  // Synonym and expanded token matching
  for (const token of expandedTokens) {
    if (token.length > 2 && !queryTokens.includes(token) && searchableText.includes(token)) {
      score += 4; // Bonus for synonym matches
    }
  }

  // Title token matching (individual words in title)
  const titleTokens = normalize(resource.title).split(/\s+/);
  for (const queryToken of queryTokens) {
    if (queryToken.length > 2 && titleTokens.includes(queryToken)) {
      score += 8;
    }
  }

  // Steps matching (indicates procedural relevance)
  let stepMatches = 0;
  for (const step of resource.steps) {
    const normalizedStep = normalize(step);
    for (const token of queryTokens) {
      if (token.length > 2 && normalizedStep.includes(token)) {
        stepMatches++;
      }
    }
  }
  score += Math.min(stepMatches * 2, 10); // Cap step bonus at 10

  // Penalize very low scores to filter noise
  if (score < 3) {
    return 0;
  }

  return score;
}

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

  return {
    answer: `${topResource.title}: ${topResource.description}`,
    nextSteps: topResource.steps,
    resources: topResource.links,
    confidence: topResource.score >= 18 ? "high" : "medium",
    escalation: {
      contact: `${topResource.contacts[0].role} (${topResource.contacts[0].email})`,
      reason: "Escalate if you cannot access the linked portal or your request is blocked.",
    },
    source: "fallback",
    matchedResources: relevantResources.map(({ id, title, category, score }) => ({
      id,
      title,
      category,
      score,
    })),
    question,
  };
}
