import { useState, useEffect, useRef } from "react";

const navigationTabs = [
  { id: "home", label: "Home", active: true },
  {
    id: "ops-tech-101",
    label: "Ops & Tech 101",
    dropdown: ["Sub-Businesses", "O&T Leadership Principles", "Media Tech Program"],
  },
  { id: "onboarding", label: "Onboarding" },
  {
    id: "career-ownership",
    label: "Career Ownership",
    dropdown: [
      "3 Steps to Career Ownership",
      "Learning & Development Calendar",
      "NBCU Careers Pages",
      "Learning & Development Resources",
    ],
  },
  { id: "cameo", label: "Cameo" },
  {
    id: "feedback-performance",
    label: "Feedback & Performance",
    dropdown: [
      "Performance Management in O&T",
      "Goal Setting",
      "Feedback in O&T",
      "Performance Feedback Tool",
      "myFeedbackTool",
    ],
  },
  { id: "recognition", label: "Recognition" },
  { id: "getting-involved", label: "Getting Involved" },
  {
    id: "helpful-links",
    label: "Helpful Links",
    dropdown: [
      "HRConnection",
      "HRConnection UK",
      "Comcast NBCUniversal Listens",
      "NBCUNow",
      "Now Portal",
      "Education Assistance Program",
      "Study & Training Policy UK",
      "myWellbeing Hub",
      "Mental Wellbeing Hub UK",
      "Talent Lab On-Demand",
      "Sub-Business Sites",
    ],
  },
  { id: "site-feedback", label: "Site Feedback" },
];

export default function NavigationBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [visibleTabs, setVisibleTabs] = useState([]);
  const [overflowTabs, setOverflowTabs] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showOverflowMenu, setShowOverflowMenu] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleResize = () => {
      calculateTabOverflow();
    };

    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null);
        setShowOverflowMenu(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
        setShowOverflowMenu(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    calculateTabOverflow();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const calculateTabOverflow = () => {
    // For simplicity, show all tabs on large screens, hide last few on smaller screens
    const width = window.innerWidth;
    if (width >= 1600) {
      setVisibleTabs(navigationTabs);
      setOverflowTabs([]);
    } else if (width >= 1200) {
      setVisibleTabs(navigationTabs.slice(0, 8));
      setOverflowTabs(navigationTabs.slice(8));
    } else {
      setVisibleTabs(navigationTabs.slice(0, 5));
      setOverflowTabs(navigationTabs.slice(5));
    }
  };

  const handleTabClick = (tabId) => {
    const tab = navigationTabs.find((t) => t.id === tabId);
    if (tab?.dropdown) {
      setActiveDropdown(activeDropdown === tabId ? null : tabId);
    }
  };

  return (
    <nav className={`navigation-bar ${isScrolled ? "scrolled" : ""}`} ref={navRef}>
      <div className="nav-content">
        <div className="nav-logo">
          <img src="/assets/ot-logo.svg" alt="O&T Logo" />
        </div>

        <div className="nav-tabs">
          {visibleTabs.map((tab) => (
            <div key={tab.id} className="nav-tab-container">
              <button
                className={`nav-tab ${tab.active ? "active" : ""}`}
                onClick={() => handleTabClick(tab.id)}
              >
                {tab.label}
                {tab.dropdown && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M6 8L3 5h6z" />
                  </svg>
                )}
              </button>
              {tab.dropdown && activeDropdown === tab.id && (
                <div className="nav-dropdown">
                  {tab.dropdown.map((item, idx) => (
                    <a key={idx} href="#" className="dropdown-item">
                      {item}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          {overflowTabs.length > 0 && (
            <div className="nav-tab-container">
              <button
                className="nav-tab overflow-menu-btn"
                onClick={() => setShowOverflowMenu(!showOverflowMenu)}
                aria-label="More options"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <circle cx="4" cy="10" r="1.5" />
                  <circle cx="10" cy="10" r="1.5" />
                  <circle cx="16" cy="10" r="1.5" />
                </svg>
              </button>
              {showOverflowMenu && (
                <div className="nav-dropdown overflow-dropdown">
                  {overflowTabs.map((tab) => (
                    <a key={tab.id} href="#" className="dropdown-item">
                      {tab.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
