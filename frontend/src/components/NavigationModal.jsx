import { useState } from "react";
import {
  requestNavigationGuidance,
  requestNavigationGuidanceStream,
  clearSession,
} from "../services/navigationAPI.js";
import AnswerPanel from "./AnswerPanel.jsx";
import LoadingState from "./LoadingState.jsx";

const suggestedQuestions = [
  "How do I submit my performance review?",
  "Where can I find IT support?",
  "How do I access learning resources?",
  "What are the career development programs?",
];

export default function NavigationModal({ onClose }) {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [useStreaming] = useState(true); // Enable streaming by default

  async function handleQuestion(q) {
    const queryText = q || question;
    if (!queryText.trim()) return;

    setIsLoading(true);
    setError("");
    setQuestion(queryText);
    setStreamingText("");

    try {
      if (useStreaming) {
        // Use streaming for real-time responses
        await requestNavigationGuidanceStream(
          queryText,
          (delta) => {
            // Update streaming text as it arrives
            setStreamingText(delta.accumulated);
          },
          (completeData) => {
            // Set final result when complete
            setResult(completeData);
            setStreamingText("");
            setIsLoading(false);
          },
          (streamError) => {
            // Handle streaming errors
            console.error("Streaming error:", streamError);
            setResult(null);
            setError(
              "Streaming failed. Please try again or contact support if the issue persists."
            );
            setStreamingText("");
            setIsLoading(false);
          }
        );
      } else {
        // Use standard non-streaming request
        const guidance = await requestNavigationGuidance(queryText);
        setResult(guidance);
        setIsLoading(false);
      }
    } catch (requestError) {
      setResult(null);
      setError(
        requestError.response?.data?.error ||
          "The navigation service is unavailable. Confirm the backend is running on port 3000."
      );
      setIsLoading(false);
    }
  }

  function handleClearSession() {
    clearSession();
    setResult(null);
    setQuestion("");
    setError("");
    setStreamingText("");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    handleQuestion();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>AI Navigation Assistant</h2>
            <p className="modal-subtitle">
              Ask questions about NBCU resources, processes, and tools
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {result && (
              <button
                className="clear-session-btn"
                onClick={handleClearSession}
                title="Start new conversation"
                style={{
                  padding: "6px 12px",
                  fontSize: "13px",
                  background: "#f0f0f0",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                New Chat
              </button>
            )}
            <button className="modal-close" onClick={onClose} aria-label="Close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" />
                <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>

        <form className="modal-search" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ask a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isLoading}
            autoFocus
          />
          <button type="submit" disabled={isLoading || !question.trim()}>
            Search
          </button>
        </form>

        {!result && !isLoading && (
          <div className="modal-suggestions">
            <p className="suggestions-label">Suggested questions:</p>
            <div className="suggestions-grid">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  className="suggestion-chip-modal"
                  onClick={() => handleQuestion(q)}
                  disabled={isLoading}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="modal-results">
          {error && <div className="error-banner">{error}</div>}
          {streamingText && (
            <div
              className="streaming-preview"
              style={{
                padding: "16px",
                background: "#f9f9f9",
                borderRadius: "8px",
                marginTop: "16px",
                fontFamily: "monospace",
                fontSize: "13px",
                whiteSpace: "pre-wrap",
                color: "#666",
              }}
            >
              <div style={{ marginBottom: "8px", fontWeight: "bold", color: "#333" }}>
                Streaming response...
              </div>
              {streamingText}
            </div>
          )}
          {isLoading && !streamingText ? (
            <LoadingState />
          ) : result ? (
            <AnswerPanel result={result} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
