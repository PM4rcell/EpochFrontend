import { useCallback, useState } from "react";
import { checkoutBooking } from "../api/booking";
import { useToken } from "../context/TokenContext";
import { fetchMe } from "../api/user";

export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any | null>(null);
  const { setUser } = useToken();

  const checkout = useCallback(async (bookingId: string | number) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await checkoutBooking(bookingId);
      setData(res);
      // Refresh the current user's cached profile after checkout succeeds.
      try {
        const me = await fetchMe();
        if (me) setUser(me);
      } catch (e) {
        // Ignore fetch errors; booking succeeded.
      }
      return res;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { checkout, loading, error, data } as const;
}
