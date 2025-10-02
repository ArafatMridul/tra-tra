import classNames from "classnames";
import { format } from "date-fns";
import { useJournalStore } from "../store/journalStore";

interface VisitedSidebarProps {
  onAddNew: () => void;
}

const VisitedSidebar = ({ onAddNew }: VisitedSidebarProps) => {
  const { entries, selectedEntry, setSelectedEntry, selectedCountry, setSelectedCountry, countries, setPendingEntry } =
    useJournalStore();

  const filteredEntries = selectedCountry ? entries.filter((entry) => entry.country === selectedCountry) : entries;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Visited places</h2>
        <button
          type="button"
          className="primary small"
          onClick={() => {
            setSelectedEntry(null);
            setPendingEntry(null);
            onAddNew();
          }}
        >
          + New entry
        </button>
      </div>
      <div className="country-filter">
        <button className={classNames({ active: selectedCountry === null })} onClick={() => setSelectedCountry(null)}>
          All countries
        </button>
        {countries.map((country) => (
          <button key={country} className={classNames({ active: selectedCountry === country })} onClick={() => setSelectedCountry(country)}>
            {country}
          </button>
        ))}
      </div>
      <div className="sidebar-content">
        {filteredEntries.length === 0 ? (
          <p className="empty">Click anywhere on the map to add your first memory.</p>
        ) : (
          <ul className="entry-list">
            {filteredEntries.map((entry) => (
              <li
                key={entry.id}
                className={classNames("entry-item", { selected: selectedEntry?.id === entry.id })}
                onClick={() => setSelectedEntry(entry)}
              >
                <h3>{entry.city}</h3>
                <p className="entry-meta">
                  {entry.country} · {format(new Date(entry.visitedDate), "MMM d, yyyy")}
                </p>
                {entry.description && <p className="entry-description">{entry.description}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
};

export default VisitedSidebar;
