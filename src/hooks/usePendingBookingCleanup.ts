import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// Clears `epoch:pendingBooking` when the user navigates away from the
// booking flow routes (seats, payment, ticket/checkout).
export default function usePendingBookingCleanup() {
  const location = useLocation();
  const prevPath = useRef(location.pathname);

  const isBookingRoute = (path: string) => /^\/(booking|payment|checkout)(\/|$)/.test(path);

  useEffect(() => {
    const prev = prevPath.current;
    const curr = location.pathname;

    // If we were on a booking route and now moved elsewhere, clear pending booking
    try {
      if (isBookingRoute(prev) && !isBookingRoute(curr)) {
        if (typeof window !== "undefined") sessionStorage.removeItem("epoch:pendingBooking");
      }
    } catch {}

    prevPath.current = curr;
  }, [location.pathname]);
}
