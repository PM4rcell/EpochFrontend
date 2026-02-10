import { useState, useCallback } from "react";
import { lockBooking, type CreateBookingBody } from "../api/booking";

export function useLockBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);

  const lock = useCallback(async (body: CreateBookingBody) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await lockBooking(body);
      setData(res);
      return res;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { lock, loading, error, data } as const;
}
