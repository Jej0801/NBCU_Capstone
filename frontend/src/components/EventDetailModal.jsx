export default function EventDetailModal({ event, day, onClose, onRSVP }) {
  if (!event) return null;

  const handleRSVP = () => {
    onRSVP(event, day);
  };

  const handleCancelRSVP = () => {
    onRSVP(event, day, true);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content event-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" />
            <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" />
          </svg>
        </button>

        <div className="event-modal-header">
          <div className={`event-type-banner ${event.type}`}>
            {event.type === "recommend" ? "Recommended Event" : "Useful Event"}
          </div>
          <h2>{event.title}</h2>
          <div className="event-meta">
            <span>📅 July {day}, 2026</span>
            <span>🕐 {event.time}</span>
            <span>📍 {event.location}</span>
          </div>
        </div>

        <div className="event-modal-body">
          <div className="event-section">
            <h3>Description</h3>
            <p>{event.description}</p>
          </div>

          <div className="event-stats-grid">
            <div className="event-stat">
              <div className="stat-icon">👥</div>
              <div>
                <div className="stat-value">{event.attendees}</div>
                <div className="stat-label">Expected Attendees</div>
              </div>
            </div>
            <div className="event-stat">
              <div className="stat-icon">👤</div>
              <div>
                <div className="stat-value">{event.organizer}</div>
                <div className="stat-label">Organizer</div>
              </div>
            </div>
          </div>

          {event.agenda && (
            <div className="event-section">
              <h3>Agenda</h3>
              <ul className="event-list">
                {event.agenda.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {event.topics && (
            <div className="event-section">
              <h3>Topics</h3>
              <div className="tags-list">
                {event.topics.map((topic, idx) => (
                  <span key={idx} className="tag">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {event.projects && (
            <div className="event-section">
              <h3>Event Highlights</h3>
              <div className="event-highlights">
                <div className="highlight-item">
                  <strong>{event.projects}</strong> innovative projects on display
                </div>
                {event.awards && (
                  <div className="highlight-item">
                    <strong>Awards:</strong>
                    <ul className="awards-list">
                      {event.awards.map((award, idx) => (
                        <li key={idx}>🏆 {award}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {event.facilitator && (
            <div className="event-section">
              <h3>Facilitator</h3>
              <div className="facilitator-info">
                <div className="facilitator-avatar">{event.facilitator.charAt(0)}</div>
                <div>
                  <div className="facilitator-name">{event.facilitator}</div>
                  {event.materials && (
                    <div className="materials-note">
                      📎 Materials will be provided
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {event.materials && (
            <div className="event-section">
              <h3>Materials Included</h3>
              <div className="materials-list">
                {event.materials.map((material, idx) => (
                  <div key={idx} className="material-item">
                    📄 {material}
                  </div>
                ))}
              </div>
            </div>
          )}

          {event.activities && (
            <div className="event-section">
              <h3>Activities</h3>
              <div className="activities-grid">
                {event.activities.map((activity, idx) => (
                  <div key={idx} className="activity-card">
                    {activity}
                  </div>
                ))}
              </div>
            </div>
          )}

          {event.prizes && (
            <div className="event-section">
              <h3>Prizes</h3>
              <div className="prizes-list">
                {event.prizes.map((prize, idx) => (
                  <div key={idx} className="prize-item">
                    🎁 {prize}
                  </div>
                ))}
              </div>
            </div>
          )}

          {event.speakers && (
            <div className="event-section">
              <h3>Speakers</h3>
              <div className="speakers-list">
                {event.speakers.map((speaker, idx) => (
                  <div key={idx} className="speaker-tag">
                    {speaker}
                  </div>
                ))}
              </div>
            </div>
          )}

          {event.highlights && (
            <div className="event-section">
              <h3>Key Highlights</h3>
              <ul className="event-list">
                {event.highlights.map((highlight, idx) => (
                  <li key={idx}>{highlight}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="event-modal-actions">
            {event.rsvpStatus === "confirmed" ? (
              <>
                <div className="rsvp-confirmed">
                  ✓ You're registered for this event
                </div>
                <button className="cancel-rsvp-button" onClick={handleCancelRSVP}>
                  Cancel RSVP
                </button>
              </>
            ) : (
              <button className="rsvp-button-large" onClick={handleRSVP}>
                RSVP to Event
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
