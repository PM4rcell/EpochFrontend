import { apiFetch } from "./fetch";

export interface CreateBookingBody {
  screening_id: number;
  ticket_type_id: number;
  seat_ids: number[];
  customer: {
    mode: "user" | "guest";
    email?: string;
  };
}

/**
 * lockBooking
 * - Sends a booking creation request to the API.
 * - Uses the centralized `apiFetch` so auth headers/timeouts are applied.
 * - Returns the parsed response from the server (expected to include booking id).
 */
export async function lockBooking(body: CreateBookingBody) {
  // Basic debug output to help trace booking attempts in dev console.
  // eslint-disable-next-line no-console
  console.debug("lockBooking ->", body);

  return apiFetch<any>("/api/bookings/lock", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/**
 * checkoutBooking
 * - Finalize/checkout a previously created booking on the server.
 * - Calls POST /api/bookings/{id}/checkout. No body required.
 * - `apiFetch` will include the current auth token when set via `setAuthToken()`.
 */
export async function checkoutBooking(bookingId: string | number) {
  return apiFetch<any>(`/api/bookings/${bookingId}/checkout`, {
    method: "POST",
  });
}
