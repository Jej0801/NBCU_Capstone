import ConfidenceBadge from "./ConfidenceBadge.jsx";

export default function AnswerPanel({ result }) {
  if (!result) return null;

  return (
    <article className="answer-panel">
      <div className="answer-header">
        <div>
          <p className="eyebrow">Navigation Result</p>
          <h2>{result.answer}</h2>
        </div>
        <ConfidenceBadge confidence={result.confidence} />
      </div>

      <section>
        <h3>Next Steps</h3>
        <ol className="step-list">
          {(result.nextSteps || []).map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section>
        <h3>Resources</h3>
        <div className="resource-list">
          {(result.resources || []).map((resource) => (
            <a href={resource.url} key={`${resource.label}-${resource.url}`} target="_blank" rel="noreferrer">
              <span>{resource.label}</span>
              <small>{resource.url}</small>
            </a>
          ))}
        </div>
      </section>

      {result.escalation && (
        <section className="escalation">
          <h3>Escalation</h3>
          <p>
            <strong>{result.escalation.contact}</strong>
          </p>
          <p>{result.escalation.reason}</p>
        </section>
      )}

      {result.matchedResources?.length > 0 && (
        <footer className="matches">
          <span>Matched mock resources:</span>
          {result.matchedResources.slice(0, 3).map((resource) => (
            <span key={resource.id}>{resource.title}</span>
          ))}
        </footer>
      )}
    </article>
  );
}
