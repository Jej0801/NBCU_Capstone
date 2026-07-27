import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { embedResources } from "./embeddingService.js";
import { mockResources } from "../data/mockResources.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_FILE = path.join(__dirname, "../data/embeddings-cache.json");

/**
 * Load embeddings from cache file
 * @returns {Object[]|null} - Cached resources with embeddings, or null if cache doesn't exist
 */
export function loadEmbeddingsCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, "utf8");
      const cache = JSON.parse(data);
      console.log(`Loaded ${cache.resources.length} embedded resources from cache`);
      return cache.resources;
    }
  } catch (error) {
    console.error("Error loading embeddings cache:", error);
  }
  return null;
}

/**
 * Save embeddings to cache file
 * @param {Object[]} embeddedResources - Resources with embeddings
 */
export function saveEmbeddingsCache(embeddedResources) {
  try {
    const cache = {
      generatedAt: new Date().toISOString(),
      model: "text-embedding-3-small",
      count: embeddedResources.length,
      resources: embeddedResources,
    };

    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf8");
    console.log(`Saved ${embeddedResources.length} embedded resources to cache`);
  } catch (error) {
    console.error("Error saving embeddings cache:", error);
  }
}

/**
 * Initialize embeddings - load from cache or generate new ones
 * @param {boolean} forceRegenerate - Force regeneration even if cache exists
 * @returns {Promise<Object[]|null>} - Resources with embeddings, or null if failed
 */
export async function initializeEmbeddings(forceRegenerate = false) {
  // Try to load from cache first
  if (!forceRegenerate) {
    const cached = loadEmbeddingsCache();
    if (cached && cached.length === mockResources.length) {
      return cached;
    }
  }

  // Generate new embeddings
  try {
    console.log("Generating fresh embeddings for all resources...");
    const embeddedResources = await embedResources(mockResources);

    // Save to cache
    saveEmbeddingsCache(embeddedResources);

    return embeddedResources;
  } catch (error) {
    console.error("Failed to generate embeddings:", error.message);
    console.warn("RAG will not be available. Please set OPENAI_API_KEY in .env file.");
    return null;
  }
}

/**
 * Get embeddings - lazy load from cache or generate if needed
 */
let cachedEmbeddings = null;

export async function getEmbeddedResources() {
  if (!cachedEmbeddings) {
    cachedEmbeddings = await initializeEmbeddings();
  }
  return cachedEmbeddings;
}
