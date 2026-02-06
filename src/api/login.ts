import { apiFetch } from "./fetch";

export interface LoginPayload {
  email: string;
  password: string;
}

// Returns whatever the server responds with (commonly { token })
export async function loginUser(payload: LoginPayload) {
  return apiFetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
}
