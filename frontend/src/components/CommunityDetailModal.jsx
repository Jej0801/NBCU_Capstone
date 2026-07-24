export default function CommunityDetailModal({ community, onClose, onJoin }) {
  if (!community) return null;

  const handleJoin = () => {
    onJoin(community.fullName);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content community-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" />
            <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" />
          </svg>
        </button>

        <div className="community-modal-header">
          <div
            className="community-modal-image"
            style={{ backgroundImage: `url(${community.image})` }}
          />
          <div className="community-modal-title-section">
            <h2>{community.fullName}</h2>
            <p className="community-description">{community.description}</p>
          </div>
        </div>

        <div className="community-modal-body">
          <div className="community-stats-grid">
            <div className="stat-card">
              <div className="stat-number">{community.members}</div>
              <div className="stat-label">Members</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{community.founded}</div>
              <div className="stat-label">Founded</div>
            </div>
          </div>

          {community.nextEvent && (
            <div className="community-section highlight-section">
              <h3>🎉 Upcoming Event</h3>
              <div className="next-event-card">
                <div className="event-name">{community.nextEvent.title}</div>
                <div className="event-details">
                  <span>📅 {community.nextEvent.date}</span>
                  <span>👥 {community.nextEvent.attendees} registered</span>
                </div>
              </div>
            </div>
          )}

          <div className="community-section">
            <h3>Key Initiatives</h3>
            <div className="initiatives-list">
              {community.initiatives.map((initiative, idx) => (
                <div key={idx} className="initiative-item">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0zm-1.293 13.707l-3.5-3.5 1.414-1.414L9 11.172l4.793-4.793 1.414 1.414-6.5 6.5z" />
                  </svg>
                  <span>{initiative}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="community-section">
            <h3>Leadership Team</h3>
            <div className="leadership-list">
              {community.leadership.map((leader, idx) => (
                <div key={idx} className="leader-card">
                  <div className="leader-avatar">{leader.name.charAt(0)}</div>
                  <div>
                    <div className="leader-name">{leader.name}</div>
                    <div className="leader-role">{leader.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* YPN Specific Content */}
          {community.id === "ypn" && (
            <>
              <div className="community-section">
                <h3>Recent Posts</h3>
                <div className="posts-list">
                  {community.recentPosts.map((post, idx) => (
                    <div key={idx} className="post-card">
                      <div className="post-title">{post.title}</div>
                      <div className="post-meta">
                        <span>By {post.author}</span>
                        <span>❤️ {post.likes} likes</span>
                        <span>{post.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="community-section">
                <h3>Member Benefits</h3>
                <div className="benefits-grid">
                  {community.memberBenefits.map((benefit, idx) => (
                    <div key={idx} className="benefit-card">
                      ✨ {benefit}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* TECHWomen Specific Content */}
          {community.id === "techwomen" && (
            <>
              <div className="community-section">
                <h3>Our Impact</h3>
                <div className="achievements-list">
                  {community.achievements.map((achievement, idx) => (
                    <div key={idx} className="achievement-item">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 0l2.5 7.5h7.5l-6 4.5 2.5 7.5-6-4.5-6 4.5 2.5-7.5-6-4.5h7.5z" />
                      </svg>
                      <span>{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="community-section">
                <h3>Programs</h3>
                <div className="programs-grid">
                  <div className="program-card">
                    <div className="program-title">Mentorship</div>
                    <p>{community.programs.mentorship}</p>
                  </div>
                  <div className="program-card">
                    <div className="program-title">Workshops</div>
                    <p>{community.programs.workshops}</p>
                  </div>
                  <div className="program-card">
                    <div className="program-title">Scholarship</div>
                    <p>{community.programs.scholarship}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TalentLab Specific Content */}
          {community.id === "talentlab" && (
            <>
              <div className="community-section">
                <h3>By the Numbers</h3>
                <div className="stats-showcase">
                  <div className="showcase-stat">
                    <div className="showcase-number">{community.stats.projectsLaunched}</div>
                    <div className="showcase-label">Projects Launched</div>
                  </div>
                  <div className="showcase-stat">
                    <div className="showcase-number">{community.stats.participantSatisfaction}</div>
                    <div className="showcase-label">Satisfaction Rate</div>
                  </div>
                  <div className="showcase-stat">
                    <div className="showcase-number">{community.stats.skillsLearned}</div>
                    <div className="showcase-label">Skills Learned</div>
                  </div>
                  <div className="showcase-stat">
                    <div className="showcase-number">{community.stats.partnerships}</div>
                    <div className="showcase-label">Partnerships</div>
                  </div>
                </div>
              </div>

              <div className="community-section">
                <h3>Current Programs</h3>
                <div className="programs-list">
                  {community.currentInitiatives.map((initiative, idx) => (
                    <div key={idx} className="current-program-card">
                      <div className="program-header">
                        <div className="program-name">{initiative.name}</div>
                        <div className="program-duration">{initiative.duration}</div>
                      </div>
                      <div className="program-details">
                        <span>👥 {initiative.participants} participants</span>
                        <span>📅 Starts {initiative.startDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="community-section">
                <h3>What Alumni Say</h3>
                {community.alumni.map((alum, idx) => (
                  <div key={idx} className="testimonial">
                    <p className="testimonial-text">"{alum.quote}"</p>
                    <div className="testimonial-author">
                      <strong>{alum.name}</strong> - {alum.role}
                    </div>
                  </div>
                ))}
              </div>

              <div className="community-section">
                <h3>Resources Available</h3>
                <div className="community-resources-grid">
                  {community.resources.map((resource, idx) => (
                    <div key={idx} className="resource-badge">
                      📚 {resource}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="community-modal-actions">
            <button className="join-button-large" onClick={handleJoin}>
              Join {community.title}
            </button>
            <button className="secondary-button" onClick={onClose}>
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
