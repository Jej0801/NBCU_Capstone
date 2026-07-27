export default function Header() {
  return (
    <header className="main-header">
      <div className="header-left">
        <button className="waffle-menu" aria-label="App launcher">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <rect x="2" y="2" width="4" height="4" rx="1" />
            <rect x="8" y="2" width="4" height="4" rx="1" />
            <rect x="14" y="2" width="4" height="4" rx="1" />
            <rect x="2" y="8" width="4" height="4" rx="1" />
            <rect x="8" y="8" width="4" height="4" rx="1" />
            <rect x="14" y="8" width="4" height="4" rx="1" />
            <rect x="2" y="14" width="4" height="4" rx="1" />
            <rect x="8" y="14" width="4" height="4" rx="1" />
            <rect x="14" y="14" width="4" height="4" rx="1" />
          </svg>
        </button>
        <div className="header-branding">
          <span className="brand-nbcu">NBCU</span>
          <span className="brand-divider">|</span>
          <span className="brand-sharepoint">SharePoint</span>
        </div>
      </div>

      <div className="header-center">
        <div className="search-bar-placeholder">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="7" cy="7" r="5" />
            <line x1="11" y1="11" x2="15" y2="15" />
          </svg>
          <span>Search this site</span>
        </div>
      </div>

      <div className="header-right">
        <button className="user-profile" aria-label="User profile">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
          </svg>
        </button>
      </div>
    </header>
  );
}
