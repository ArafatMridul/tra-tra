import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import { journalApi } from "../api/journal";
import { useJournalStore } from "../store/journalStore";
import { JournalEntry, MapClickEvent } from "../types";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MapView = () => {
  const { entries, setEntries, mapCenter, setMapCenter, setSelectedEntry, setPendingEntry } = useJournalStore();

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const data = await journalApi.list();
        setEntries(data.entries, data.countries);
      } catch (error) {
        console.error("Failed to load journal entries", error);
      }
    };
    loadEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="map-wrapper">
      <MapContainer center={[mapCenter.lat, mapCenter.lng]} zoom={3} className="map">
        <MapCenterUpdater center={mapCenter} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
        <MapClickHandler
          onClick={async (event) => {
            setSelectedEntry(null);
            setMapCenter({ lat: event.lat, lng: event.lng });
            const enriched = await enrichLocation(event);
            setPendingEntry(enriched);
          }}
        />
        {entries.map((entry) => (
          <Marker
            key={entry.id}
            position={[entry.latitude, entry.longitude]}
            icon={markerIcon}
            eventHandlers={{
              click: () => {
                setSelectedEntry(entry);
                setMapCenter({ lat: entry.latitude, lng: entry.longitude });
              },
            }}
          >
            <Popup>
              <MarkerPopup entry={entry} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

const MapClickHandler = ({ onClick }: { onClick: (event: MapClickEvent) => void | Promise<void> }) => {
  useMapEvents({
    click: (event) => {
      onClick({ lat: event.latlng.lat, lng: event.latlng.lng });
    },
  });
  return null;
};

const MapCenterUpdater = ({ center }: { center: { lat: number; lng: number } }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([center.lat, center.lng], map.getZoom());
  }, [center, map]);
  return null;
};

const MarkerPopup = ({ entry }: { entry: JournalEntry }) => (
  <div className="marker-popup">
    <h3>{entry.title}</h3>
    <p>
      {entry.city}, {entry.country}
    </p>
    <p className="popup-date">Visited on {new Date(entry.visitedDate).toLocaleDateString()}</p>
    {entry.description && <p className="popup-description">{entry.description}</p>}
  </div>
);

const enrichLocation = async (event: MapClickEvent): Promise<MapClickEvent> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${event.lat}&lon=${event.lng}&format=json`,
      {
        headers: {
          "User-Agent": "tra-tra-travel-journal/1.0 (https://github.com/your-username/tra-tra)",
        },
      }
    );
    if (!response.ok) {
      return event;
    }
    const data = await response.json();
    return {
      ...event,
      city: data.address?.city || data.address?.town || data.address?.village || data.address?.hamlet,
      country: data.address?.country,
    };
  } catch (error) {
    console.warn("Failed to enrich location", error);
    return event;
  }
};

export default MapView;
