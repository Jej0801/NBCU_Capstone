// In-memory conversation storage (in production, use Redis or database)
const conversations = new Map();

// Configuration
const MAX_HISTORY_LENGTH = 10; // Keep last 10 exchanges
const CONVERSATION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export class ConversationManager {
  constructor() {
    // Cleanup old conversations periodically
    setInterval(() => this.cleanup(), 5 * 60 * 1000); // Every 5 minutes
  }

  /**
   * Get or create a conversation session
   */
  getConversation(sessionId) {
    if (!conversations.has(sessionId)) {
      conversations.set(sessionId, {
        id: sessionId,
        messages: [],
        createdAt: Date.now(),
        lastAccessedAt: Date.now(),
      });
    }

    const conversation = conversations.get(sessionId);
    conversation.lastAccessedAt = Date.now();
    return conversation;
  }

  /**
   * Add a message exchange to conversation history
   */
  addExchange(sessionId, userQuestion, assistantResponse) {
    const conversation = this.getConversation(sessionId);

    // Add user message
    conversation.messages.push({
      role: "user",
      content: userQuestion,
      timestamp: Date.now(),
    });

    // Add assistant message
    conversation.messages.push({
      role: "assistant",
      content: JSON.stringify({
        answer: assistantResponse.answer,
        confidence: assistantResponse.confidence,
        resources: assistantResponse.resources,
      }),
      timestamp: Date.now(),
    });

    // Trim history to max length (keep most recent)
    if (conversation.messages.length > MAX_HISTORY_LENGTH * 2) {
      conversation.messages = conversation.messages.slice(-MAX_HISTORY_LENGTH * 2);
    }

    return conversation;
  }

  /**
   * Get conversation history formatted for Claude API
   */
  getHistory(sessionId, includeLastN = 3) {
    const conversation = this.getConversation(sessionId);

    // Return last N exchanges (user + assistant pairs)
    const messagesToInclude = includeLastN * 2;
    return conversation.messages.slice(-messagesToInclude);
  }

  /**
   * Get conversation context summary
   */
  getContextSummary(sessionId) {
    const conversation = this.getConversation(sessionId);

    if (conversation.messages.length === 0) {
      return null;
    }

    const recentQuestions = conversation.messages
      .filter((msg) => msg.role === "user")
      .slice(-3)
      .map((msg) => msg.content);

    return {
      hasHistory: conversation.messages.length > 0,
      exchangeCount: Math.floor(conversation.messages.length / 2),
      recentQuestions,
    };
  }

  /**
   * Clear a conversation
   */
  clearConversation(sessionId) {
    conversations.delete(sessionId);
  }

  /**
   * Cleanup expired conversations
   */
  cleanup() {
    const now = Date.now();
    const expired = [];

    for (const [sessionId, conversation] of conversations.entries()) {
      if (now - conversation.lastAccessedAt > CONVERSATION_TIMEOUT) {
        expired.push(sessionId);
      }
    }

    expired.forEach((sessionId) => conversations.delete(sessionId));

    if (expired.length > 0) {
      console.log(`Cleaned up ${expired.length} expired conversation(s)`);
    }
  }

  /**
   * Get stats (for monitoring)
   */
  getStats() {
    return {
      activeConversations: conversations.size,
      totalMessages: Array.from(conversations.values()).reduce(
        (sum, conv) => sum + conv.messages.length,
        0
      ),
    };
  }
}

// Singleton instance
export const conversationManager = new ConversationManager();
