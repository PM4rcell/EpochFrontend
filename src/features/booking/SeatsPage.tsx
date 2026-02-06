import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Navbar } from "../../components/layout/Navbar";
import { BookingStepper } from "./BookingStepper";
import { PosterSummary } from "./PosterSummary";
import { SeatMap } from "./SeatMap";
import { ShowInfo } from "./ShowInfo";
import { useParams } from "react-router-dom";
import { useSeats } from "../../hooks/useSeats";
import { useToken } from "../../context/TokenContext";
import { Spinner } from "../../components/ui/spinner";

interface SeatsPageProps {
  theme?: "90s" | "2000s" | "modern" | "default";
  onNavigate?: (page: any) => void;
  onNext?: () => void;
  onCancel?: () => void;
}

type SeatStatus = "available" | "reserved" | "selected";

interface Seat {
  row: string;
  number: number;
  status: SeatStatus;
}

export function SeatsPage({
  theme = "default",
  onNext,
  onCancel,
}: SeatsPageProps) {
  const { screeningId } = useParams<{ screeningId: string }>();

  const { seats: fetchedSeats, loading, error } = useSeats(screeningId ?? null);
  const [seats, setSeats] = useState<Seat[]>(() => []);
  const [selectedSeats, setSelectedSeats] = useState<
    Array<{ row: string; number: number; price: number }>
  >([]);

  const { token } = useToken();

  const movieData = {
    title: "The Eternal Voyage",
    poster:
      "https://images.unsplash.com/photo-1574923930958-9b653a0e5148?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    backdrop:
      "https://images.unsplash.com/photo-1639306406821-c45e6cd384e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920",
    date: "Friday, November 8, 2025",
    time: "7:30 PM",
    format: "IMAX 3D",
    venue: "Epoch Cinema Downtown",
  };

  const handleSeatClick = (row: string, number: number) => {
    const seatIndex = seats.findIndex((s) => s.row === row && s.number === number);
    if (seatIndex === -1) return;

    const seat = seats[seatIndex];
    if (seat.status === "reserved") return;

    const newSeats = [...seats];

    if (seat.status === "available") {
      newSeats[seatIndex] = { ...seat, status: "selected" };
      setSelectedSeats([...selectedSeats, { row, number, price: 15 }]);
    } else {
      newSeats[seatIndex] = { ...seat, status: "available" };
      setSelectedSeats(selectedSeats.filter((s) => !(s.row === row && s.number === number)));
    }

    setSeats(newSeats);
  };

  const handleRemoveSeat = (row: string, number: number) => {
    handleSeatClick(row, number);
  };

  // Synchronize fetched seats into local state when available
  // Keep local selection modifications separate from the fetched shape.
  // Convert API seats to local `Seat` shape if necessary.
  useEffect(() => {
    if (!fetchedSeats) return;
    // API may return either an array or a wrapped object { data: [...] }.
    let array: any = fetchedSeats;
    if (!Array.isArray(array) && array && Array.isArray(array.data)) {
      array = array.data;
    }
    if (!Array.isArray(array)) {
      // Unexpected shape: log and use empty list to avoid runtime errors.
      // eslint-disable-next-line no-console
      console.warn("SeatsPage: unexpected fetchedSeats shape", fetchedSeats);
      setSeats([]);
      return;
    }
    const normalized = array.map((s: any) => ({ row: s.row, number: s.number, status: s.status }));
    setSeats(normalized);
  }, [fetchedSeats]);

  return (
    <div className="min-h-screen bg-linear-to-b from-black via-slate-950 to-black">
      <Navbar
        theme={theme}
        activePage="screenings"
      />

      {!token && (
        <div className="container mx-auto px-6 py-4">
          <div className="bg-amber-600/10 border border-amber-600/20 text-amber-300 rounded-md px-4 py-2 text-sm">
            Please log in to book a ticket
          </div>
        </div>
      )}

      {/* Hero Header - Fixed height, clipped, no pointer blocking */}
      <div className="relative h-40 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/80 to-black z-10" />
        <img
          src={movieData.backdrop}
          alt={movieData.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-end z-20 pointer-events-none">
          <div className="container mx-auto px-6 pb-6">
            <h1 className="text-white pointer-events-auto">
              {movieData.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Stepper - Constrained height, clipped */}
      <BookingStepper activeStep="seats" theme={theme} />

      {/* Main Content - Extra bottom padding on mobile for sticky bar */}
      <div className="container mx-auto px-6 py-8 pb-32 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_280px] gap-6">
          {/* Left: Poster & Summary */}
          <div className="order-2 lg:order-1">
            <PosterSummary
              posterUrl={movieData.poster}
              movieTitle={movieData.title}
              selectedSeats={selectedSeats}
              onRemoveSeat={handleRemoveSeat}
              onCancel={onCancel || (() => {})}
              onNext={onNext || (() => {})}
              canProceed={Boolean(token)}
              theme={theme}
            />
          </div>

          {/* Center: Seat Map - Fully interactive, no blockers */}
          <div className="order-1 lg:order-2 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-black/40 border border-slate-700/50 rounded-lg p-4 md:p-8 overflow-x-auto relative z-10"
            >
                {loading ? (
                  <div className="w-full flex items-center justify-center py-12">
                    <Spinner size="md" theme={theme === "default" ? "modern" : (theme as any)} />
                  </div>
                ) : error ? (
                  <div className="w-full text-center py-8 text-slate-400">
                    <p>Failed to load seats.</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-3 px-3 py-1 rounded bg-white/5"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <SeatMap
                    seats={seats}
                    onSeatClick={handleSeatClick}
                    theme={theme}
                  />
                )}
            </motion.div>
          </div>

          {/* Right: Show Info */}
          <div className="order-3">
            <ShowInfo
              date={movieData.date}
              time={movieData.time}
              format={movieData.format}
              venue={movieData.venue}
              theme={theme}
            />
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA - Fixed height, safe area, no seat blocking */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-22 bg-black/90 backdrop-blur-md border-t border-white/10 p-4 z-50 pointer-events-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-sm">
            {selectedSeats.length} seat
            {selectedSeats.length !== 1 ? "s" : ""} selected
          </span>
          <span
            className={`
            ${
              theme === "90s"
                ? "text-amber-500"
                : theme === "2000s"
                  ? "text-blue-400"
                  : theme === "modern"
                    ? "text-slate-300"
                    : "text-amber-500"
            }
          `}
          >
            ${(selectedSeats.length * 15).toFixed(2)}
          </span>
        </div>
        <button
          onClick={() => { if (!token) return; onNext?.(); }}
          disabled={!token || selectedSeats.length === 0}
          className={`
            w-full py-3 rounded-lg transition-all duration-200
            ${
              theme === "90s"
                ? "bg-amber-600 hover:bg-amber-500"
                : theme === "2000s"
                  ? "bg-blue-500 hover:bg-blue-400"
                  : theme === "modern"
                    ? "bg-slate-300 hover:bg-slate-200"
                    : "bg-amber-600 hover:bg-amber-500"
            }
            text-black
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          Next
        </button>
      </div>
    </div>
  );
}