import { useState } from "react";
import { deleteComment } from "../api/comment";

export function useDeleteComment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | Error>(null);

  const remove = async (commentId: string | number, movie_id: string | number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteComment(commentId, movie_id,);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
}