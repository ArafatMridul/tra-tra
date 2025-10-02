import { format } from "date-fns";
import { useJournalStore } from "../store/journalStore";
import { journalApi } from "../api/journal";
import { useState } from "react";

const EntryDetails = () => {
  const { selectedEntry, setSelectedEntry, setMapCenter, removeEntry } = useJournalStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!selectedEntry) {
    return (
      <div className="placeholder">
        <h2>No entry selected</h2>
        <p>Pick a city from the list to view its details or click the map to add a new memory.</p>
      </div>
    );
  }

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await journalApi.remove(selectedEntry.id);
      removeEntry(selectedEntry.id);
      setSelectedEntry(null);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Unable to delete entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="entry-details">
      <div className="entry-details-header">
        <div>
          <h2>{selectedEntry.title}</h2>
          <p className="subtitle">
            {selectedEntry.city}, {selectedEntry.country} · {format(new Date(selectedEntry.visitedDate), "MMM d, yyyy")}
          </p>
        </div>
        <button
          className="ghost"
          onClick={() => setMapCenter({ lat: selectedEntry.latitude, lng: selectedEntry.longitude })}
        >
          Center map
        </button>
      </div>
      {selectedEntry.description && <p className="entry-description">{selectedEntry.description}</p>}
      <div className="entry-meta-grid">
        {selectedEntry.companions && (
          <div>
            <span className="label">Travel companions</span>
            <p>{selectedEntry.companions}</p>
          </div>
        )}
        {selectedEntry.rating && (
          <div>
            <span className="label">Notes</span>
            <p>{selectedEntry.rating}</p>
          </div>
        )}
      </div>
      {error && <p className="error">{error}</p>}
      <button className="danger" onClick={handleDelete} disabled={loading}>
        {loading ? "Deleting..." : "Delete entry"}
      </button>
    </div>
  );
};

export default EntryDetails;
