import { useCallback, useState } from "react";
import { checkoutBooking } from "../api/booking";

export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any | null>(null);

  const checkout = useCallback(async (bookingId: string | number) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await checkoutBooking(bookingId);
      setData(res);
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
