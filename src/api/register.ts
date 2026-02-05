import { apiFetch } from "./fetch";

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}

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

