import { useCallback, useState } from "react";
import postComment, { type CommentPayload } from "../api/comment";

export function useComment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = useCallback(
    async (movieId: number | string | null | undefined, payload: CommentPayload) => {
      if (!movieId) throw new Error("movieId is required");
      setLoading(true);
      setError(null);
      try {
        const res = await postComment(movieId, payload);
        setLoading(false);
        return res;
      } catch (err: any) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
        throw err;
      }
    },
    []
  );

  return { submit, loading, error } as const;
}

export default useComment;
