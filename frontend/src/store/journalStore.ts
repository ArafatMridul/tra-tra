import { create } from "zustand";
import { JournalEntry, MapClickEvent } from "../types";

interface JournalState {
  entries: JournalEntry[];
  countries: string[];
  selectedCountry: string | null;
  selectedEntry: JournalEntry | null;
  mapCenter: { lat: number; lng: number };
  pendingEntry: MapClickEvent | null;
  setEntries: (entries: JournalEntry[], countries: string[]) => void;
  setSelectedCountry: (country: string | null) => void;
  setSelectedEntry: (entry: JournalEntry | null) => void;
  setMapCenter: (center: { lat: number; lng: number }) => void;
  setPendingEntry: (event: MapClickEvent | null) => void;
  addEntry: (entry: JournalEntry) => void;
  updateEntry: (entry: JournalEntry) => void;
  removeEntry: (id: number) => void;
}

export const useJournalStore = create<JournalState>((set) => ({
  entries: [],
  countries: [],
  selectedCountry: null,
  selectedEntry: null,
  mapCenter: { lat: 20, lng: 0 },
  pendingEntry: null,
  setEntries: (entries, countries) => set({ entries, countries: [...countries].sort() }),
  setSelectedCountry: (selectedCountry) => set({ selectedCountry }),
  setSelectedEntry: (selectedEntry) => set({ selectedEntry, pendingEntry: null }),
  setMapCenter: (mapCenter) => set({ mapCenter }),
  setPendingEntry: (pendingEntry) => set({ pendingEntry, selectedEntry: null }),
  addEntry: (entry) =>
    set((state) => {
      const countries = new Set(state.countries);
      countries.add(entry.country);
      return {
        entries: [entry, ...state.entries],
        countries: Array.from(countries).sort(),
        pendingEntry: null,
      };
    }),
  updateEntry: (entry) =>
    set((state) => ({
      entries: state.entries.map((item) => (item.id === entry.id ? entry : item)),
      selectedEntry: entry,
    })),
  removeEntry: (id) =>
    set((state) => {
      const entries = state.entries.filter((entry) => entry.id !== id);
      const countries = Array.from(new Set(entries.map((entry) => entry.country))).sort();
      return {
        entries,
        countries,
        selectedEntry: state.selectedEntry?.id === id ? null : state.selectedEntry,
      };
    }),
}));
