import { useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import { motion } from "motion/react";
import { Navbar } from "../../components/layout/Navbar";
import { BookingStepper } from "./BookingStepper";
import { OrderSummary } from "./OrderSummary";
import { useEra } from "../../context/EraContext";
import { useLocation, useParams } from "react-router-dom";
import { useCheckout } from "../../hooks/useCheckout";
import { useNavigate } from "react-router-dom";
import type { LockBookingBooking } from "../../types";

interface PaymentPageProps {
  theme?: "90s" | "2000s" | "modern" | "default";
  onNavigate?: (page: any) => void;
  onBack?: () => void;
  onComplete?: () => void;
}

export function PaymentPage({
  theme = "default",
  onBack,
  onComplete,
}: PaymentPageProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { era } = useEra();
  const appliedTheme = era ?? theme;
  const location = useLocation();
  const params = useParams() as { bookingId?: string };
  const navigate = useNavigate();
  const { checkout } = useCheckout();

  // Read the locked booking from navigation state first, then session storage.
  let booking: LockBookingBooking | null = (location.state?.booking as LockBookingBooking | undefined) ?? null;
  if (!booking) {
    try {
      const raw = typeof window !== "undefined" ? sessionStorage.getItem("epoch:pendingBooking") : null;
      booking = raw ? (JSON.parse(raw) as LockBookingBooking) : null;
    } catch (e) {
      booking = null;
    }
  }

  // Use dayjs to normalize time strings to 24-hour `HH:mm`.
  const formatTimeTo24 = (t?: string | null) => {
    if (!t) return "";
    const s = String(t).trim();
    const timeMatch = s.match(/(\d{1,2}:\d{2}\s*(AM|PM)?)/i);
    const raw = timeMatch ? timeMatch[1] : s;
    // Try common time formats (with/without AM/PM)
    const parsed = dayjs(raw, ["h:mm A", "hh:mm A", "H:mm", "HH:mm", "h:mm"], true);
    if (parsed.isValid()) return parsed.format("HH:mm");
    return raw;
  };

  const movieData = booking
    ? {
        title: booking.screening?.movie_title ?? "",
        poster: booking.screening?.movie_poster ?? "",
        backdrop: booking.screening?.movie_poster ?? "",
        date: booking.screening?.date ?? "",
        time: formatTimeTo24(booking.screening?.time ?? ""),
        screeningType: booking.screening?.screeningType ?? "",
        venue: booking.screening?.auditorium ?? "",
      }
    : {
        title: "The Eternal Voyage",
        poster: "https://images.unsplash.com/photo-1574923930958-9b653a0e5148?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
        backdrop: "https://images.unsplash.com/photo-1639306406821-c45e6cd384e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920",
        date: "Friday, November 8, 2025",
        time: "7:30 PM",
        screeningType: "IMAX 3D",
        venue: "Epoch Cinema Downtown",
      };

  // Convert API tickets to summary seat rows.
  const selectedSeats = (booking?.tickets ?? []).map((ticket, idx) => ({
    id: idx,
    row: ticket.row,
    number: ticket.seat_number,
    price: Number(ticket.price ?? 0),
  }));

  // Backend may return "Adult"; UI label should be "Standard".
  const ticketTypeLabel = (() => {
    const raw = String(booking?.tickets?.[0]?.ticket_type ?? "").trim().toLowerCase();
    if (raw === "adult" || raw === "standard") return "Standard";
    if (raw === "student") return "Student";
    return "Standard";
  })();

  const subtotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const total = Number(booking?.total ?? 0) > 0 ? Number(booking?.total ?? 0) : subtotal;

  const handlePayment = async () => {
    // Determine bookingId to checkout
    const bookingId = params.bookingId ?? booking?.id ?? null;
    if (!bookingId) {
      // eslint-disable-next-line no-console
      console.warn("No bookingId available for checkout");
      return;
    }

    try {
      setIsProcessing(true);
      await checkout(bookingId);
      // navigate to checkout/ticket page; pass booking via state if available
      navigate(`/checkout/${bookingId}`, { state: { booking } });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("Checkout failed", err);
    } finally {
      setIsProcessing(false);
      if (onComplete) onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-black via-slate-950 to-black">
      <Navbar theme={appliedTheme} activePage="screenings"/>

      {/* Hero Header - Fixed height, clipped, no pointer blocking */}
      <div className="relative h-40 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-
        to-b from-black/60 via-black/80 to-black" />
        <img
          src={movieData.backdrop}
          alt={movieData.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-6 pb-6">
            <h1 className="text-white pointer-events-auto">{movieData.title}</h1>
          </div>
        </div>
      </div>

      {/* Stepper - Constrained height */}
      <BookingStepper
        activeStep="payment"
        completedSteps={["seats"]}
        theme={appliedTheme}
      />

      {/* Main Content - Extra bottom padding on mobile */}
      <div className="container mx-auto px-6 py-8 pb-32 lg:pb-8">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <OrderSummary
                posterUrl={movieData.poster}
                movieTitle={movieData.title}
                date={movieData.date}
                time={movieData.time}
                format={movieData.screeningType}
                screeningType={movieData.screeningType}
                ticketType={ticketTypeLabel}
                venue={movieData.venue}
                seats={selectedSeats ?? []}
                total={total}
                onBack={onBack}
                onPay={handlePayment}
                theme={appliedTheme}
                isProcessing={isProcessing}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA - Fixed height, safe area */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-22 bg-black/90 backdrop-blur-md border-t border-white/10 p-4 z-50 pointer-events-auto overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-sm">Total</span>
          <span
            className={`
            ${
              appliedTheme === "90s"
                ? "text-amber-500"
                : appliedTheme === "2000s"
                ? "text-blue-400"
                : appliedTheme === "modern"
                ? "text-slate-300"
                : "text-amber-500"
            }
          `}
          >
            ${total.toFixed(2)}
          </span>
        </div>
        <button
          onClick={handlePayment}
          disabled={isProcessing}
            className={`
            w-full py-3 rounded-lg transition-all duration-200
            ${
              appliedTheme === "90s"
                ? "bg-amber-600 hover:bg-amber-500"
                : appliedTheme === "2000s"
                ? "bg-blue-500 hover:bg-blue-400"
                : appliedTheme === "modern"
                ? "bg-slate-300 hover:bg-slate-200"
                : "bg-amber-600 hover:bg-amber-500"
            }
            text-black
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isProcessing ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
}