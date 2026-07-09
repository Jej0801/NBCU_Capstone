export default function ConfidenceBadge({ confidence }) {
  const normalized = confidence || "low";
  return <span className={`confidence confidence-${normalized}`}>{normalized}</span>;
}
