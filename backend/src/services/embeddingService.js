import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const EMBEDDING_MODEL = "text-embedding-3-small";

/**
 * Generate an embedding vector for a given text
 * @param {string} text - The text to embed
 * @returns {Promise<number[]>} - The embedding vector
 */
export async function generateEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
      encoding_format: "float",
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
}

/**
 * Generate embeddings for multiple texts in a batch
 * @param {string[]} texts - Array of texts to embed
 * @returns {Promise<number[][]>} - Array of embedding vectors
 */
export async function generateEmbeddingsBatch(texts) {
  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: texts,
      encoding_format: "float",
    });

    return response.data.map((item) => item.embedding);
  } catch (error) {
    console.error("Error generating batch embeddings:", error);
    throw error;
  }
}

/**
 * Calculate cosine similarity between two vectors
 * @param {number[]} vecA - First vector
 * @param {number[]} vecB - Second vector
 * @returns {number} - Cosine similarity score (0 to 1)
 */
export function cosineSimilarity(vecA, vecB) {
  if (vecA.length !== vecB.length) {
    throw new Error("Vectors must have the same length");
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    magnitudeA += vecA[i] * vecA[i];
    magnitudeB += vecB[i] * vecB[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Create a searchable text representation of a resource for embedding
 * @param {Object} resource - The resource object
 * @returns {string} - Combined text for embedding
 */
export function createResourceText(resource) {
  const parts = [
    resource.title,
    resource.description,
    resource.category,
  ];

  // Add steps if available
  if (resource.steps && resource.steps.length > 0) {
    parts.push(resource.steps.join(" "));
  }

  // Add keywords if available
  if (resource.keywords && resource.keywords.length > 0) {
    parts.push(resource.keywords.join(" "));
  }

  return parts.filter(Boolean).join(" | ");
}

/**
 * Generate embeddings for all resources
 * @param {Object[]} resources - Array of resource objects
 * @returns {Promise<Object[]>} - Resources with embeddings added
 */
export async function embedResources(resources) {
  console.log(`Generating embeddings for ${resources.length} resources...`);

  // Create searchable text for each resource
  const resourceTexts = resources.map(createResourceText);

  // Generate embeddings in batch
  const embeddings = await generateEmbeddingsBatch(resourceTexts);

  // Add embeddings to resources
  const embeddedResources = resources.map((resource, index) => ({
    ...resource,
    embedding: embeddings[index],
    embeddedText: resourceTexts[index],
  }));

  console.log("Embeddings generated successfully");
  return embeddedResources;
}
