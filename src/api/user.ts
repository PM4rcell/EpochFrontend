import { apiFetch } from "./fetch";

// Fetch current authenticated user's profile from the backend.
export async function fetchMe() {
  // apiFetch will include auth header when set via setAuthToken
  return apiFetch("/api/user/me");
}

// Payload accepted by updateMe. `avatar` may be a File for upload.
export type UpdateMePayload = {
  username?: string;
  email?: string;
  watchlist?: number[];
  avatar?: File | null;
  points?: number;
};

/**
 * updateMe
 * - PATCH /api/user/me
 * - Accepts JSON or multipart FormData when `avatar` is provided.
 * - Server-side must validate allowed fields and permissions (points only
 *   applied when requester is admin).
 */
export async function updateMe(payload: UpdateMePayload) {
  // If caller provided a File for `avatar`, send multipart/form-data so file
  // uploads work correctly. `apiFetch` supports FormData (it will avoid
  // JSON-stringifying FormData and won't set a Content-Type header).
  if (payload && payload.avatar instanceof File) {
    const form = new FormData();
    form.append("_method", "PATCH");
    if (typeof payload.username !== "undefined") form.append("username", payload.username);
    if (typeof payload.email !== "undefined") form.append("email", payload.email);
    if (Array.isArray(payload.watchlist)) {
      // backend may expect repeated fields or a JSON string; send repeated fields
      payload.watchlist.forEach((id) => form.append("watchlist[]", String(id)));
    }
    form.append("avatar", payload.avatar);
    if (typeof payload.points !== "undefined") form.append("points", String(payload.points));

    return apiFetch("/api/user/me", {
      method: "POST",
      body: form,
    });
  }

  // Otherwise send JSON body. `apiFetch` will JSON.stringify objects.
  const body: any = {};
  if (typeof payload.username !== "undefined") body.username = payload.username;
  if (typeof payload.email !== "undefined") body.email = payload.email;
  if (typeof payload.watchlist !== "undefined") body.watchlist = payload.watchlist;
  if (typeof payload.avatar !== "undefined") body.avatar = payload.avatar;
  if (typeof payload.points !== "undefined") body.points = payload.points;

  return apiFetch("/api/user/me", {
    method: "PATCH",
    body,
  });
}

export default {
  fetchMe,
  updateMe,
};
