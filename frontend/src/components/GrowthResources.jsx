import { useState } from "react";
import { growthResourcesData } from "../services/mockData.js";
import ResourceDetailModal from "./ResourceDetailModal.jsx";

export default function GrowthResources({ onEnroll }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);

  const getCardStyle = (index) => {
    if (hoveredIndex === null) {
      return { flexGrow: 1 };
    }

    if (index === hoveredIndex) {
      return { flexGrow: 1.1 };
    }

    // Calculate distance from hovered card
    const distance = Math.abs(index - hoveredIndex);
    const shrinkFactor = 1 - distance * 0.08;

    return { flexGrow: Math.max(shrinkFactor, 0.85) };
  };

  const handleCardClick = (resource) => {
    setSelectedResource(resource);
  };

  return (
    <>
      <section className="growth-resources">
        <h2 className="section-title">Growth Resources</h2>
        <div className="resources-grid">
          {growthResourcesData.map((resource, index) => (
            <button
              key={resource.id}
              className={`resource-card ${hoveredIndex === index ? "hovered" : ""}`}
              style={getCardStyle(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleCardClick(resource)}
            >
              <div
                className="resource-image"
                style={{ backgroundImage: `url(${resource.image})` }}
              />
              <div className="resource-title">{resource.title}</div>
            </button>
          ))}
        </div>
      </section>

      {selectedResource && (
        <ResourceDetailModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
          onEnroll={onEnroll}
        />
      )}
    </>
  );
}
