import { useState } from "react";

export default function SearchInput({ onSubmit, isLoading }) {
  const [question, setQuestion] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || isLoading) return;
    onSubmit(trimmedQuestion);
  }

  return (
    <form className="search-panel" onSubmit={handleSubmit}>
      <label htmlFor="question">What do you need help finding?</label>
      <div className="search-row">
        <input
          id="question"
          type="text"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask about onboarding, SAP, HR, IT access, equipment, or training"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !question.trim()}>
          {isLoading ? "Searching" : "Navigate"}
        </button>
      </div>
    </form>
  );
}
