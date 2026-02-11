import { apiFetch } from "./fetch";

// Fetch current authenticated user's profile from the backend.
export async function fetchMe() {
  // apiFetch will include auth header when set via setAuthToken
  return apiFetch("/api/user/me");
}

export default {
  fetchMe,
};
