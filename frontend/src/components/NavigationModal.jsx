import { useState, useRef, useEffect } from "react";
import {
  requestNavigationGuidance,
  requestNavigationGuidanceStream,
  clearSession,
} from "../services/navigationAPI.js";

const suggestedQuestions = [
  "How do I complete onboarding?",
  "Where do I request software access?",
  "How do I update direct deposit?",
  "Who do I contact for equipment issues?",
];

export default function NavigationModal({ onClose, embedded = false }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // {role: 'user'|'assistant', content, ...}
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const chatThreadRef = useRef(null);
  const [useStreaming] = useState(true);

  // Auto-scroll chat thread to bottom when new messages arrive
  useEffect(() => {
    if (chatThreadRef.current) {
      chatThreadRef.current.scrollTop = chatThreadRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  async function handleSubmit(e) {
    e?.preventDefault();
    const queryText = input.trim();
    if (!queryText) return;

    // Add user message
    const userMessage = { role: "user", content: queryText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError("");

    try {
      if (useStreaming) {
        let streamingMessage = { role: "assistant", content: "", isStreaming: true };
        setMessages((prev) => [...prev, streamingMessage]);

        await requestNavigationGuidanceStream(
          queryText,
          (delta) => {
            // Update the streaming message in place
            setMessages((prev) => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1] = {
                ...streamingMessage,
                rawText: delta.accumulated,
              };
              return newMessages;
            });
          },
          (completeData) => {
            // Replace streaming message with complete response
            setMessages((prev) => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1] = {
                role: "assistant",
                content: completeData,
                isStreaming: false,
              };
              return newMessages;
            });
            setIsLoading(false);
          },
          (streamError) => {
            console.error("Streaming error:", streamError);
            setError("I encountered an error. Please try rephrasing, or contact IT Support.");
            setMessages((prev) => prev.slice(0, -1)); // Remove streaming message
            setIsLoading(false);
          }
        );
      } else {
        const guidance = await requestNavigationGuidance(queryText);
        setMessages((prev) => [...prev, { role: "assistant", content: guidance }]);
        setIsLoading(false);
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          "I couldn't find that — try rephrasing, or contact IT Support."
      );
      setIsLoading(false);
    }
  }

  function handleChipClick(chipText) {
    setInput(chipText);
    // Auto-submit
    const fakeEvent = { preventDefault: () => {} };
    setTimeout(() => {
      handleSubmit(fakeEvent);
    }, 100);
  }

  function handleNewChat() {
    clearSession();
    setMessages([]);
    setInput("");
    setError("");
    setIsLoading(false);
  }

  const hasMessages = messages.length > 0;

  // Widget content (shared between modal and embedded modes)
  const widgetContent = (
    <div className={embedded ? "atlas-widget-embedded" : "atlas-widget"} onClick={(e) => e.stopPropagation()}>
      {/* Close button - only show in modal mode */}
      {!embedded && onClose && (
        <button className="atlas-close-btn" onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" />
            <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" />
          </svg>
        </button>
      )}

      {/* Header - visible when no messages or collapsed after messages start */}
      {!hasMessages && (
        <div className="atlas-header">
          <h1 className="atlas-title">Ask Atlas</h1>
          <p className="atlas-subtitle">What do you need help finding?</p>
        </div>
      )}

      {/* Suggested question chips - only shown in idle state */}
      {!hasMessages && !isLoading && (
        <div className="atlas-chips-container">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              className="atlas-chip"
              onClick={() => handleChipClick(q)}
              disabled={isLoading}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Chat thread - message history */}
      {hasMessages && (
        <div className="atlas-chat-thread" ref={chatThreadRef} aria-live="polite">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`atlas-message ${msg.role === "user" ? "atlas-message-user" : "atlas-message-assistant"}`}
            >
              {msg.role === "user" ? (
                <div className="atlas-message-bubble-user">{msg.content}</div>
              ) : (
                <div className="atlas-message-bubble-assistant">
                  {msg.isStreaming ? (
                    <div className="atlas-streaming-text">{msg.rawText || "Atlas is thinking..."}</div>
                  ) : (
                    <div className="atlas-response-content">
                      <div className="atlas-answer">{msg.content.answer}</div>
                      {msg.content.nextSteps && msg.content.nextSteps.length > 0 && (
                        <div className="atlas-next-steps">
                          <strong>Next steps:</strong>
                          <ol>
                            {msg.content.nextSteps.map((step, i) => (
                              <li key={i}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      )}
                      {msg.content.resources && msg.content.resources.length > 0 && (
                        <div className="atlas-resources">
                          {msg.content.resources.map((res, i) => (
                            <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="atlas-resource-link">
                              {res.label} →
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator when waiting for response */}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="atlas-message atlas-message-assistant">
              <div className="atlas-message-bubble-assistant">
                <div className="atlas-loading">Atlas is thinking...</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="atlas-error-banner">
          {error}
        </div>
      )}

      {/* New chat button - shown when conversation is active */}
      {hasMessages && (
        <button className="atlas-new-chat-btn" onClick={handleNewChat} title="Start new conversation">
          New Chat
        </button>
      )}

      {/* Input field - always at bottom */}
      <form className="atlas-input-form" onSubmit={handleSubmit}>
        <label htmlFor="atlas-input" className="atlas-input-label">
          Type your question
        </label>
        <div className="atlas-input-wrapper">
          <input
            id="atlas-input"
            type="text"
            className="atlas-input"
            placeholder="Type your question here…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            autoFocus={!hasMessages}
          />
          <button
            type="submit"
            className="atlas-send-btn"
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );

  // Return embedded or modal version
  if (embedded) {
    return widgetContent;
  }

  return (
    <div className="atlas-modal-overlay" onClick={onClose}>
      {widgetContent}
    </div>
  );
}
