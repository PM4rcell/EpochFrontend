import { apiFetch } from "./fetch";
import type { RegisterPayload } from "../types";

// Sends a registration POST to the backend. Returns parsed response or throws on error.
export async function registerUser(payload: { username: string; email: string; password: string; password_confirmation: string; }) {
  return apiFetch('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload),
  });
}

