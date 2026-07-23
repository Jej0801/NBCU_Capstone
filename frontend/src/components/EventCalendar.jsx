import { useState } from "react";
import { eventsData } from "../services/mockData.js";
import EventDetailModal from "./EventDetailModal.jsx";

export default function EventCalendar({ onRSVP }) {
  const [events, setEvents] = useState(eventsData);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const today = 23; // July 23, 2026
  const daysInMonth = 31;
  const firstDayOfWeek = 2; // July 1, 2026 is a Tuesday (0=Sun, 1=Mon, 2=Tue)

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const calendarDays = [];
  // Add empty cells for days before the 1st
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  // Add the actual days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const handleEventClick = (event, day) => {
    setSelectedEvent(event);
    setSelectedDay(day);
  };

  const handleRSVP = (event, day, isCancel = false) => {
    const updatedEvents = { ...events };
    if (updatedEvents[day]) {
      updatedEvents[day] = {
        ...updatedEvents[day],
        rsvpStatus: isCancel ? null : "confirmed",
      };
      setEvents(updatedEvents);
      onRSVP(event.title, isCancel);
    }
    setSelectedEvent(null);
    setSelectedDay(null);
  };

  return (
    <>
      <section className="event-calendar">
        <div className="calendar-header">
          <h2 className="section-title">Events</h2>
          <div className="calendar-month">July 2026</div>
        </div>

        <div className="calendar-legend">
          <div className="legend-item">
            <div className="legend-color recommend"></div>
            <span>Recommend</span>
          </div>
          <div className="legend-item">
            <div className="legend-color useful"></div>
            <span>Useful</span>
          </div>
        </div>

        <div className="calendar-grid">
          <div className="calendar-weekdays">
            {days.map((day) => (
              <div key={day} className="weekday">
                {day}
              </div>
            ))}
          </div>

          <div className="calendar-days">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`calendar-day ${day === today ? "today" : ""} ${day === null ? "empty" : ""}`}
              >
                {day && (
                  <>
                    <div className="day-number">{day}</div>
                    {events[day] && (
                      <div
                        className={`event-card ${events[day].type} ${events[day].rsvpStatus === "confirmed" ? "rsvp-confirmed" : ""}`}
                        onClick={() => handleEventClick(events[day], day)}
                      >
                        <div className="event-title">{events[day].title}</div>
                        <button className="rsvp-button">
                          {events[day].rsvpStatus === "confirmed" ? "✓ RSVP'd" : "RSVP"}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          day={selectedDay}
          onClose={() => {
            setSelectedEvent(null);
            setSelectedDay(null);
          }}
          onRSVP={handleRSVP}
        />
      )}
    </>
  );
}
