export default function ResourceDetailModal({ resource, onClose, onEnroll }) {
  if (!resource) return null;

  const handleEnroll = () => {
    onEnroll(resource.title);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content resource-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" />
            <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" />
          </svg>
        </button>

        <div className="resource-modal-header">
          <div
            className="resource-modal-image"
            style={{ backgroundImage: `url(${resource.image})` }}
          />
          <div className="resource-modal-title-section">
            <h2>{resource.title}</h2>
            <p className="resource-description">{resource.description}</p>
          </div>
        </div>

        <div className="resource-modal-body">
          {/* Media Tech Program Details */}
          {resource.id === "mta" && (
            <>
              <div className="resource-stats">
                <div className="stat-card">
                  <div className="stat-number">{resource.participants}</div>
                  <div className="stat-label">Participants</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{resource.completionRate}%</div>
                  <div className="stat-label">Completion Rate</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{resource.duration}</div>
                  <div className="stat-label">Duration</div>
                </div>
              </div>

              <div className="resource-section">
                <h3>Program Topics</h3>
                <div className="tags-list">
                  {resource.topics.map((topic, idx) => (
                    <span key={idx} className="tag">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="resource-section">
                <h3>Instructors</h3>
                <div className="instructors-list">
                  {resource.instructors.map((instructor, idx) => (
                    <div key={idx} className="instructor-card">
                      <div className="instructor-avatar">
                        {instructor.name.charAt(0)}
                      </div>
                      <div>
                        <div className="instructor-name">{instructor.name}</div>
                        <div className="instructor-role">{instructor.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="resource-section">
                <h3>What Graduates Say</h3>
                {resource.testimonials.map((testimonial, idx) => (
                  <div key={idx} className="testimonial">
                    <p className="testimonial-text">"{testimonial.text}"</p>
                    <div className="testimonial-author">
                      <strong>{testimonial.author}</strong> - {testimonial.role}
                    </div>
                  </div>
                ))}
              </div>

              <div className="resource-cta">
                <div className="next-cohort">
                  <strong>Next Cohort Starts:</strong> {resource.nextCohort}
                </div>
                <button className="cta-button" onClick={handleEnroll}>
                  Apply Now
                </button>
              </div>
            </>
          )}

          {/* Cameo Details */}
          {resource.id === "cameo" && (
            <>
              <div className="resource-stats">
                <div className="stat-card">
                  <div className="stat-number">{resource.totalMentors}</div>
                  <div className="stat-label">Available Mentors</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{resource.activeSessions}</div>
                  <div className="stat-label">Active Sessions</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{resource.avgRating}★</div>
                  <div className="stat-label">Average Rating</div>
                </div>
              </div>

              <div className="resource-section">
                <h3>Mentorship Categories</h3>
                <div className="tags-list">
                  {resource.categories.map((category, idx) => (
                    <span key={idx} className="tag">
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              <div className="resource-section">
                <h3>Featured Mentors</h3>
                <div className="mentors-list">
                  {resource.featuredMentors.map((mentor, idx) => (
                    <div key={idx} className="mentor-card">
                      <div className="mentor-info">
                        <div className="mentor-name">{mentor.name}</div>
                        <div className="mentor-title">{mentor.title}</div>
                      </div>
                      <div className="mentor-availability">{mentor.availability}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="resource-cta">
                <div className="upcoming-info">
                  <strong>{resource.upcomingSessions}</strong> sessions available this week
                </div>
                <button className="cta-button" onClick={handleEnroll}>
                  Book a Session
                </button>
              </div>
            </>
          )}

          {/* Learning & Development Calendar Details */}
          {resource.id === "ld" && (
            <>
              <div className="resource-stats">
                <div className="stat-card">
                  <div className="stat-number">{resource.totalCourses}</div>
                  <div className="stat-label">Total Courses</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{resource.thisMonthEvents}</div>
                  <div className="stat-label">This Month</div>
                </div>
              </div>

              <div className="resource-section">
                <h3>Popular Topics</h3>
                <div className="tags-list">
                  {resource.popularTopics.map((topic, idx) => (
                    <span key={idx} className="tag">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="resource-section">
                <h3>Upcoming Highlights</h3>
                <div className="courses-list">
                  {resource.upcomingHighlights.map((course, idx) => (
                    <div key={idx} className="course-card">
                      <div className="course-header">
                        <div className="course-title">{course.title}</div>
                        <div className="seats-badge">{course.seatsLeft} seats left</div>
                      </div>
                      <div className="course-details">
                        <div className="course-datetime">
                          📅 {course.date} • 🕐 {course.time}
                        </div>
                        <div className="course-instructor">
                          👤 {course.instructor}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="resource-section">
                <h3>Available Certifications</h3>
                <div className="tags-list">
                  {resource.certifications.map((cert, idx) => (
                    <span key={idx} className="tag cert-tag">
                      🏆 {cert}
                    </span>
                  ))}
                </div>
              </div>

              <div className="resource-cta">
                <button className="cta-button" onClick={handleEnroll}>
                  Browse All Courses
                </button>
              </div>
            </>
          )}

          {/* myFeedback Details */}
          {resource.id === "feedback" && (
            <>
              <div className="resource-stats">
                <div className="stat-card">
                  <div className="stat-number">{resource.feedbackGiven}</div>
                  <div className="stat-label">Feedback Given</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{resource.feedbackReceived}</div>
                  <div className="stat-label">Feedback Received</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{resource.avgResponseTime}</div>
                  <div className="stat-label">Avg Response</div>
                </div>
              </div>

              <div className="resource-section">
                <h3>Key Features</h3>
                <div className="features-list">
                  {resource.features.map((feature, idx) => (
                    <div key={idx} className="feature-item">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0zm-1.293 13.707l-3.5-3.5 1.414-1.414L9 11.172l4.793-4.793 1.414 1.414-6.5 6.5z" />
                      </svg>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="resource-section">
                <h3>Recent Feedback</h3>
                <div className="feedback-list">
                  {resource.recentFeedback.map((feedback, idx) => (
                    <div key={idx} className={`feedback-card ${feedback.type}`}>
                      <div className="feedback-header">
                        <span className="feedback-type-badge">{feedback.type}</span>
                        <span className="feedback-date">{feedback.date}</span>
                      </div>
                      <div className="feedback-from">From: {feedback.from}</div>
                      <p className="feedback-snippet">{feedback.snippet}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="resource-section">
                <h3>Upcoming Reviews</h3>
                <div className="reviews-list">
                  {resource.upcomingReviews.map((review, idx) => (
                    <div key={idx} className="review-card">
                      <div className="review-type">{review.type}</div>
                      <div className="review-meta">
                        <span>Due: {review.dueDate}</span>
                        <span className={`status-badge ${review.status}`}>
                          {review.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="resource-cta">
                <button className="cta-button" onClick={handleEnroll}>
                  Open myFeedback
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
