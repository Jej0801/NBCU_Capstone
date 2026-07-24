import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "../prompts/systemPrompt.js";
import { buildFallbackGuidance } from "./retrievalService.js";
import { conversationManager } from "./conversationManager.js";

export async function getNavigationGuidance(question, relevantResources, sessionId = null) {
  if (!process.env.CLAUDE_API_KEY) {
    return buildFallbackGuidance(question, relevantResources);
  }

  try {
    const anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });

    // Build messages array with conversation history if available
    const messages = [];

    if (sessionId) {
      // Include recent conversation history for context
      const history = conversationManager.getHistory(sessionId, 3);
      messages.push(...history);
    }

    // Add current question
    messages.push({ role: "user", content: question });

    const response = await anthropic.messages.create({
      model: process.env.CLAUDE_MODEL || "claude-3-7-sonnet-20250219",
      max_tokens: parseInt(process.env.CLAUDE_MAX_TOKENS) || 1500,
      temperature: parseFloat(process.env.CLAUDE_TEMPERATURE) || 0.3,
      system: buildSystemPrompt(relevantResources),
      messages,
    });

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    const result = {
      ...parseClaudeJson(text, question, relevantResources),
      source: "claude",
      matchedResources: relevantResources.map(({ id, title, category, score }) => ({
        id,
        title,
        category,
        score,
      })),
    };

    // Store in conversation history if session exists
    if (sessionId) {
      conversationManager.addExchange(sessionId, question, result);
    }

    return result;
  } catch (error) {
    console.error("Claude API failed, using fallback guidance:", error.message);
    return {
      ...buildFallbackGuidance(question, relevantResources),
      source: "fallback-after-claude-error",
    };
  }
}

/**
 * Streaming version of navigation guidance
 */
export async function* getNavigationGuidanceStream(question, relevantResources, sessionId = null) {
  if (!process.env.CLAUDE_API_KEY) {
    yield {
      type: "complete",
      data: buildFallbackGuidance(question, relevantResources),
    };
    return;
  }

  try {
    const anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });

    // Build messages array with conversation history if available
    const messages = [];

    if (sessionId) {
      const history = conversationManager.getHistory(sessionId, 3);
      messages.push(...history);
    }

    messages.push({ role: "user", content: question });

    const stream = await anthropic.messages.stream({
      model: process.env.CLAUDE_MODEL || "claude-3-7-sonnet-20250219",
      max_tokens: parseInt(process.env.CLAUDE_MAX_TOKENS) || 1500,
      temperature: parseFloat(process.env.CLAUDE_TEMPERATURE) || 0.3,
      system: buildSystemPrompt(relevantResources),
      messages,
    });

    let accumulatedText = "";

    for await (const chunk of stream) {
      if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
        accumulatedText += chunk.delta.text;

        // Yield partial text updates
        yield {
          type: "delta",
          text: chunk.delta.text,
          accumulated: accumulatedText,
        };
      }
    }

    // Parse final response
    const result = {
      ...parseClaudeJson(accumulatedText, question, relevantResources),
      source: "claude-stream",
      matchedResources: relevantResources.map(({ id, title, category, score }) => ({
        id,
        title,
        category,
        score,
      })),
    };

    // Store in conversation history
    if (sessionId) {
      conversationManager.addExchange(sessionId, question, result);
    }

    // Yield complete response
    yield {
      type: "complete",
      data: result,
    };
  } catch (error) {
    console.error("Claude streaming failed:", error.message);
    yield {
      type: "complete",
      data: {
        ...buildFallbackGuidance(question, relevantResources),
        source: "fallback-after-stream-error",
      },
    };
  }
}

function parseClaudeJson(text, question, relevantResources) {
  try {
    const jsonText = extractJsonObject(text);
    const parsed = JSON.parse(jsonText);

    // Validate required fields
    const result = {
      answer: assertString(parsed.answer, "I found a likely navigation path for your question."),
      nextSteps: assertStringArray(parsed.nextSteps),
      resources: assertResources(parsed.resources),
      confidence: assertConfidence(parsed.confidence),
      escalation: assertEscalation(parsed.escalation, relevantResources),
      question,
    };

    // Additional validation: ensure we have meaningful content
    if (!result.answer || result.answer.length < 10) {
      throw new Error("Answer is too short or empty");
    }

    if (result.nextSteps.length === 0) {
      console.warn("No next steps provided, using defaults");
      result.nextSteps = generateDefaultNextSteps(relevantResources);
    }

    if (result.resources.length === 0 && relevantResources.length > 0) {
      console.warn("No resources returned, adding top relevant resource");
      result.resources = relevantResources[0].links.slice(0, 2);
    }

    return result;
  } catch (parseError) {
    console.error("Failed to parse Claude response:", parseError.message);
    console.error("Raw text:", text);

    // Return structured fallback
    return buildStructuredFallback(question, relevantResources, parseError);
  }
}

function generateDefaultNextSteps(relevantResources) {
  if (relevantResources.length > 0) {
    return relevantResources[0].steps.slice(0, 3);
  }
  return [
    "Contact the appropriate support team for assistance",
    "Check the HR or IT portal for relevant documentation",
    "Escalate to your manager if the issue persists",
  ];
}

function buildStructuredFallback(question, relevantResources, error) {
  const topResource = relevantResources[0];

  return {
    answer: topResource
      ? `Based on your question, ${topResource.title} may help. ${topResource.description}`
      : "I'm having trouble processing that request. Please rephrase your question or contact support.",
    nextSteps: topResource ? topResource.steps : generateDefaultNextSteps([]),
    resources: topResource ? topResource.links : [],
    confidence: "low",
    escalation: assertEscalation(null, relevantResources),
    question,
    parseError: error.message,
  };
}

function extractJsonObject(text) {
  const trimmed = text.trim();

  // Handle markdown code blocks
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }

  // Handle plain JSON
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }

  // Find JSON object in text
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error(
      "Claude response did not include a valid JSON object. Response might be incomplete or malformed."
    );
  }

  const extracted = trimmed.slice(firstBrace, lastBrace + 1);

  // Validate it's actually JSON
  try {
    JSON.parse(extracted);
    return extracted;
  } catch (e) {
    throw new Error(`Extracted text is not valid JSON: ${e.message}`);
  }
}

function assertString(value, fallback) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function assertStringArray(value) {
  return Array.isArray(value)
    ? value.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim())
    : [];
}

function assertResources(value) {
  return Array.isArray(value)
    ? value
        .filter((item) => item && typeof item.label === "string" && typeof item.url === "string")
        .map((item) => ({ label: item.label, url: item.url }))
    : [];
}

function assertConfidence(value) {
  return ["high", "medium", "low"].includes(value) ? value : "medium";
}

function assertEscalation(value, relevantResources) {
  if (value && typeof value.contact === "string" && typeof value.reason === "string") {
    return { contact: value.contact, reason: value.reason };
  }

  const contact = relevantResources[0]?.contacts?.[0];
  return contact
    ? {
        contact: `${contact.role} (${contact.email})`,
        reason: "Escalate if the recommended path does not resolve the request.",
      }
    : {
        contact: "IT Service Desk or HR Support",
        reason: "Escalate when the right system or ownership path is unclear.",
      };
}
