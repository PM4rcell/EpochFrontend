import { apiFetch } from "./fetch";

// Call server logout endpoint. Server may invalidate the token.
export async function logoutUser() {
  return apiFetch("/api/logout", { method: "POST" });
}
