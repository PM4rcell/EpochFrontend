import { apiFetch } from "./fetch";

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// Sends a registration POST to the backend. Returns parsed response or throws on error.
export async function registerUser(payload: RegisterPayload) {
  return apiFetch<any>(`/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
