import { apiFetch } from "./fetch";
import type { SeatApi } from "../types";

export async function fetchSeats(screeningId: string) {
  return apiFetch<SeatApi[]>(`/api/screenings/${screeningId}/seats`);
}
