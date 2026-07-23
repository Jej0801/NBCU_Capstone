import { useState } from "react";
import Header from "./components/Header.jsx";
import NavigationBar from "./components/NavigationBar.jsx";
import GrowthResources from "./components/GrowthResources.jsx";
import EventCalendar from "./components/EventCalendar.jsx";
import Communities from "./components/Communities.jsx";
import NavigationModal from "./components/NavigationModal.jsx";
import Toast from "./components/Toast.jsx";
import { toastMessages } from "./services/mockData.js";

export default function App() {
  const [showNavigationModal, setShowNavigationModal] = useState(false);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleEnroll = (programName) => {
    showToast(toastMessages.enrollProgram(programName), "success");
  };

  const handleRSVP = (eventName, isCancel = false) => {
    if (isCancel) {
      showToast(toastMessages.rsvpCancel(eventName), "info");
    } else {
      showToast(toastMessages.rsvpSuccess(eventName), "success");
    }
  };

  const handleJoinCommunity = (communityName) => {
    showToast(toastMessages.joinCommunity(communityName), "success");
  };

  return (
    <div className="app-container">
      <Header onSearchClick={() => setShowNavigationModal(true)} />
      <NavigationBar />

      <main className="main-content">
        <section className="content-wrapper">
          <h1 className="page-title">Growth Engine</h1>

          <GrowthResources onEnroll={handleEnroll} />

          <div className="events-communities-grid">
            <EventCalendar onRSVP={handleRSVP} />
            <Communities onJoin={handleJoinCommunity} />
          </div>
        </section>
      </main>

      {showNavigationModal && (
        <NavigationModal onClose={() => setShowNavigationModal(false)} />
      )}

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}
