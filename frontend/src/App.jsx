import { useState } from "react";
import AnswerPanel from "./components/AnswerPanel.jsx";
import EmptyState from "./components/EmptyState.jsx";
import LoadingState from "./components/LoadingState.jsx";
import SearchInput from "./components/SearchInput.jsx";
import SuggestedQuestions from "./components/SuggestedQuestions.jsx";
import { requestNavigationGuidance } from "./services/navigationAPI.js";

export default function App() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleQuestion(question) {
    setIsLoading(true);
    setError("");

    try {
      const guidance = await requestNavigationGuidance(question);
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

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">NBCUniversal Prototype</p>
          <h1>AI Navigation Assistant</h1>
          <p className="hero-copy">
            A guided search layer for employees moving through enterprise systems, onboarding,
            SAP workflows, HR resources, IT access, and support paths.
          </p>
        </div>
        <div className="status-grid" aria-label="Prototype capabilities">
          <span>Claude API ready</span>
          <span>Mock resources</span>
          <span>Fallback answers</span>
        </div>
      </section>

      <section className="workspace">
        <div className="left-panel">
          <SearchInput onSubmit={handleQuestion} isLoading={isLoading} />
          <SuggestedQuestions onSelect={handleQuestion} isLoading={isLoading} />
        </div>

        <div className="right-panel">
          {error && <div className="error-banner">{error}</div>}
          {isLoading ? <LoadingState /> : result ? <AnswerPanel result={result} /> : <EmptyState />}
        </div>
      </section>
    </main>
  );
}
