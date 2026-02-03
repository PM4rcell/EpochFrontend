// Minimal fetch wrapper for screenings — use centralized apiFetch so the
// configured `VITE_API_BASE` is respected (avoids accidentally hitting the
// frontend origin and receiving HTML responses).
import { apiFetch } from "./fetch";

export async function fetchScreenings(start_date: string) {
  const path = `/api/screenings?start_date=${encodeURIComponent(start_date)}`;
  // debug: show the path being requested
  // eslint-disable-next-line no-console
  console.debug("fetchScreenings -> path:", path);
  return apiFetch(path);
}
