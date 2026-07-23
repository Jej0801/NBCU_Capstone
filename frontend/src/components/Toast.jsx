import { useEffect } from "react";

export default function Toast({ message, type = "success", onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        <div className="toast-icon">
          {type === "success" && (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0zm-1.293 13.707l-3.5-3.5 1.414-1.414L9 11.172l4.793-4.793 1.414 1.414-6.5 6.5z" />
            </svg>
          )}
          {type === "error" && (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0zm1 14H9v-2h2v2zm0-4H9V6h2v4z" />
            </svg>
          )}
          {type === "info" && (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0zm1 15H9V9h2v6zm0-8H9V5h2v2z" />
            </svg>
          )}
        </div>
        <p className="toast-message">{message}</p>
      </div>
      <button className="toast-close" onClick={onClose} aria-label="Close notification">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M12.5 3.5L8 8l4.5 4.5-1 1L7 9l-4.5 4.5-1-1L6 8 1.5 3.5l1-1L7 7l4.5-4.5z" />
        </svg>
      </button>
    </div>
  );
}
