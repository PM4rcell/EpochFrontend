import { apiFetch } from "./fetch";
import type { CommentPayload } from "../types";

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

export async function deleteComment(comment_id: number | string, movieId: number | string, signal?: AbortSignal): Promise<void> {
  await apiFetch(`/api/movies/${movieId}/comments`, {
    method: "DELETE",
    signal,
    body: JSON.stringify({ comment_id }),
  });
}

export default postComment;
