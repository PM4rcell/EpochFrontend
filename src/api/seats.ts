import { apiFetch } from "./fetch";

export interface SeatApi {
  row: string;
  number: number;
  status: "available" | "unavailable" | "selected";
}

export async function fetchSeats(screeningId: string) {
  return apiFetch<SeatApi[]>(`/api/screenings/${screeningId}/seats`);
}
