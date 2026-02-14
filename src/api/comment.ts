import { apiFetch } from "./fetch";

export interface CommentPayload {
  text: string;
  rating: number;
}

/**
 * postComment
 * - POST a new comment for the given movieId.
 * - Body: { text: string, rating: number }
 */
export async function postComment(movieId: number | string, body: CommentPayload, signal?: AbortSignal): Promise<any> {
  const data = await apiFetch<any>(`/api/movies/${movieId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });

  // API may return the created comment directly or wrap it in `data`/`comment`.
  if (data && (data.comment || data.data)) return data.comment ?? data.data;
  return data;
}

export default postComment;
