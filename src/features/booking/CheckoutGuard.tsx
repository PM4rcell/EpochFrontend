import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TicketPage } from "./TicketPage";

export default function CheckoutGuard() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    if (!bookingId) {
      setAllowed(false);
      return;
    }
    try {
      const raw = typeof window !== "undefined" ? sessionStorage.getItem("epoch:pendingBooking") : null;
      const stored = raw ? JSON.parse(raw) : null;
      const storedId = stored?.id ?? stored?.booking_id ?? null;
      if (storedId && String(storedId) === String(bookingId)) {
        setAllowed(true);
      } else {
        setAllowed(false);
      }
    } catch (e) {
      setAllowed(false);
    }
  }, [bookingId]);

  useEffect(() => {
    if (allowed === false) {
      // If booking not present, redirect to home (or payments) — choose home for safety.
      navigate("/", { replace: true });
    }
  }, [allowed, navigate]);

  if (allowed === null) return null;
  if (!allowed) return null;

  return <TicketPage />;
}
