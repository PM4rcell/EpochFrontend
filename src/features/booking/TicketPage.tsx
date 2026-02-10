import { motion } from "motion/react";
import { CheckCircle } from "lucide-react";
import { Navbar } from "../../components/layout/Navbar";
import { BookingStepper } from "./BookingStepper";
import { Button } from "../../components/ui/button";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEra } from "../../context/EraContext";

interface TicketsPageProps {
  theme?: "90s" | "2000s" | "modern" | "default";
  onNavigate?: (page: any) => void;
  onDone?: () => void;
}

export function TicketPage({ theme = "default", onNavigate, onDone }: TicketsPageProps) {
  const { era } = useEra();
  const appliedTheme = era ?? theme;
  const location = useLocation();
  const params = useParams() as { bookingId?: string };
  const navigate = useNavigate();

  // Resolve bookingId from navigation state, route param, or sessionStorage
  let bookingId: string | null = (location.state as any)?.booking?.id ?? params.bookingId ?? null;
  if (!bookingId) {
    try {
      const raw = typeof window !== "undefined" ? sessionStorage.getItem("epoch:pendingBooking") : null;
      const stored = raw ? JSON.parse(raw) : null;
      bookingId = stored?.id ?? stored?.booking_id ?? null;
    } catch {}
  }
  const movieData = {
    title: "The Eternal Voyage",
    backdrop: "https://images.unsplash.com/photo-1639306406821-c45e6cd384e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920",
  };

  const getThemeColors = () => {
    switch (appliedTheme) {
      case "90s":
        return {
          accent: "text-amber-500",
          icon: "text-amber-500",
        };
      case "2000s":
        return {
          accent: "text-blue-400",
          icon: "text-blue-400",
        };
      case "modern":
        return {
          accent: "text-slate-300",
          icon: "text-slate-300",
        };
      default:
        return {
          accent: "text-amber-500",
          icon: "text-amber-500",
        };
    }
  };

  const colors = getThemeColors();

  const clearPendingBooking = () => {
    try {
      if (typeof window !== "undefined") sessionStorage.removeItem("epoch:pendingBooking");
    } catch {}
  };
  return (
    <div className="min-h-screen bg-linear-to-b from-black via-slate-950 to-black">
      <Navbar theme={appliedTheme} activePage="screenings"/>

      {/* Hero Header - Compact */}
      <div className="relative h-40 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/80 to-black" />
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

      {/* Stepper */}
      <BookingStepper
        activeStep="tickets"
        completedSteps={["seats", "payment"]}
        theme={appliedTheme}
      />

      {/* Main Content - Centered Success Message */}
      <div className="container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring", bounce: 0.4 }}
            className="mb-8 inline-block"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className={`absolute inset-0 ${colors.icon.replace('text-', 'bg-')} opacity-20 blur-2xl rounded-full`} />
              <CheckCircle className={`w-24 h-24 ${colors.icon} relative`} />
            </div>
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <h2 className={`text-white mb-4`}>
              Booking Successful!
            </h2>
            <p className="text-slate-400 text-lg mb-8">
              Your tickets are ready. You can view and manage them in your profile page.
            </p>
              {/* Booking ID display */}
              {bookingId && (
                <div className="mb-6">
                  <p className="text-slate-400">Your booking ID: <span className="text-white">{bookingId}</span></p>
                </div>
              )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={() => navigate("/profile")}
              className={`
                ${
                  appliedTheme === "90s"
                    ? "bg-amber-600 hover:bg-amber-500"
                    : appliedTheme === "2000s"
                    ? "bg-blue-500 hover:bg-blue-400"
                    : appliedTheme === "modern"
                    ? "bg-slate-300 hover:bg-slate-200"
                    : "bg-amber-600 hover:bg-amber-500"
                }
                text-black transition-all duration-200
              `}
            >
              View My Tickets
            </Button>
            <Button
              onClick={() => { clearPendingBooking(); onDone?.(); navigate("/"); }}
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-700/20"
            >
              Back to Home
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
