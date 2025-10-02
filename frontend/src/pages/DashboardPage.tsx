import { useJournalStore } from "../store/journalStore";
import AppHeader from "../components/AppHeader";
import VisitedSidebar from "../components/VisitedSidebar";
import MapView from "../components/MapView";
import JournalForm from "../components/JournalForm";
import EntryDetails from "../components/EntryDetails";
import { useEffect, useState } from "react";

const DashboardPage = () => {
  const { setPendingEntry, pendingEntry } = useJournalStore();
  const [showMapHint, setShowMapHint] = useState(false);

  useEffect(() => {
    setPendingEntry(null);
    setShowMapHint(false);
  }, [setPendingEntry]);

  useEffect(() => {
    if (pendingEntry) {
      setShowMapHint(false);
    }
  }, [pendingEntry]);

  return (
    <div className="layout">
      <AppHeader />
      <div className="dashboard">
        <VisitedSidebar
          onAddNew={() => {
            setShowMapHint(true);
            setPendingEntry(null);
          }}
        />
        <main className="dashboard-main">
          <div className="map-panel">
            <MapView />
          </div>
          <div className="detail-panel">
            {pendingEntry ? (
              <JournalForm />
            ) : showMapHint ? (
              <div className="placeholder">
                <h2>Choose a location</h2>
                <p>Click on the map to start a new journal entry. We'll capture the coordinates and fill in the basics.</p>
              </div>
            ) : (
              <EntryDetails />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
