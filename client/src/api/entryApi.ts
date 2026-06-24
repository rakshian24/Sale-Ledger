import { apiClient } from "./apiClient";
import type { DailyEntry, EntryPayload } from "../types/entry";

export const getEntries = async (month: number, year: number) => {
  const response = await apiClient<{ entries: DailyEntry[] }>(
    `/entries?month=${month}&year=${year}`
  );

  return response.entries;
};

export const createEntry = async (payload: EntryPayload) => {
  const response = await apiClient<{ entry: DailyEntry }>("/entries", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  return response.entry;
};

export const updateEntry = async (id: string, payload: EntryPayload) => {
  const response = await apiClient<{ entry: DailyEntry }>(`/entries/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });

  return response.entry;
};

export const deleteEntry = async (id: string) => {
  await apiClient<{ message: string }>(`/entries/${id}`, {
    method: "DELETE"
  });
};
