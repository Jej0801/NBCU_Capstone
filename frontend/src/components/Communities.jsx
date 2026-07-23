import { useState } from "react";
import { communitiesData } from "../services/mockData.js";
import CommunityDetailModal from "./CommunityDetailModal.jsx";

export default function Communities({ onJoin }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedCommunity, setSelectedCommunity] = useState(null);

  const getCardStyle = (index) => {
    if (hoveredIndex === null) {
      return { flexGrow: 1 };
    }

    if (index === hoveredIndex) {
      return { flexGrow: 1.15 };
    }

    // Calculate distance from hovered card
    const distance = Math.abs(index - hoveredIndex);
    const shrinkFactor = 1 - distance * 0.1;

    return { flexGrow: Math.max(shrinkFactor, 0.8) };
  };

  const handleCardClick = (community) => {
    setSelectedCommunity(community);
  };

  return (
    <>
      <section className="communities">
        <h2 className="section-title">Communities</h2>
        <div className="communities-grid">
          {communitiesData.map((community, index) => (
            <button
              key={community.id}
              className={`community-card ${hoveredIndex === index ? "hovered" : ""}`}
              style={getCardStyle(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleCardClick(community)}
            >
              <div
                className="community-image"
                style={{ backgroundImage: `url(${community.image})` }}
              />
              <div className="community-info">
                <div className="community-title">{community.title}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {selectedCommunity && (
        <CommunityDetailModal
          community={selectedCommunity}
          onClose={() => setSelectedCommunity(null)}
          onJoin={onJoin}
        />
      )}
    </>
  );
}
