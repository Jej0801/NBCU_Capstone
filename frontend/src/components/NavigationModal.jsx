import { useState } from "react";
import { requestNavigationGuidance } from "../services/navigationAPI.js";
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

  async function handleQuestion(q) {
    const queryText = q || question;
    if (!queryText.trim()) return;

    setIsLoading(true);
    setError("");
    setQuestion(queryText);

    try {
      const guidance = await requestNavigationGuidance(queryText);
      setResult(guidance);
    } catch (requestError) {
      setResult(null);
      setError(
        requestError.response?.data?.error ||
          "The navigation service is unavailable. Confirm the backend is running on port 3000."
      );
    } finally {
      setIsLoading(false);
    }
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
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" />
              <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" />
            </svg>
          </button>
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
          {isLoading ? <LoadingState /> : result ? <AnswerPanel result={result} /> : null}
        </div>
      </div>
    </div>
  );
}
