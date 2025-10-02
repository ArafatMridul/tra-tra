import { apiClient } from "./client";
import { JournalEntry, JournalCreatePayload } from "../types";

type JournalListResponse = {
  entries: JournalEntry[];
  countries: string[];
};

type JournalEntryResponse = {
  entry: JournalEntry;
};

export const journalApi = {
  async list() {
    const { data } = await apiClient.get<JournalListResponse>("/api/journal");
    return data;
  },
  async create(entry: JournalCreatePayload) {
    const { data } = await apiClient.post<JournalEntryResponse>("/api/journal", entry);
    return data.entry;
  },
  async update(id: number, payload: Partial<JournalEntry>) {
    const { data } = await apiClient.put<JournalEntryResponse>(`/api/journal/${id}`, payload);
    return data.entry;
  },
  async remove(id: number) {
    await apiClient.delete(`/api/journal/${id}`);
  },
};
