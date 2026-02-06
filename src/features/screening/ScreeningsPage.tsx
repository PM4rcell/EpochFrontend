import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "motion/react";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { WeekStrip } from "./WeekStrip";
import { FilmRow } from "./FilmRow";
import { Separator } from "../../components/ui/separator";
import { useEra } from "../../context/EraContext";
import { useScreenings } from "../../hooks/useScreenings";

interface ScreeningsPageProps {
  onBack?: () => void;
  onNavigate?: (page: "home" | "screenings" | "movies" | "news" | "era" | "search") => void;
  onMovieClick?: (movieId: string) => void;
  onSearchSubmit?: (query: string) => void;
}

const generateWeekDays = (weekOffset = 0) => {
  const start = new Date();
  start.setDate(start.getDate() + weekOffset * 7);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return {
      day: dayNames[d.getDay()],
      date: d.getDate(),
      month: monthNames[d.getMonth()],
      isToday: new Date().toDateString() === d.toDateString(),
      iso: d.toISOString().slice(0, 10),
    };
  });
};


export function ScreeningsPage({ onNavigate, onMovieClick, onSearchSubmit }: ScreeningsPageProps) {
  const { era } = useEra();
  const theme = era || "default"; // a context alapján
  const [weekOffset, setWeekOffset] = useState(0);
  const days = useMemo(() => generateWeekDays(weekOffset), [weekOffset]);
  const [selectedDate, setSelectedDate] = useState(days[0].iso);
  const [isSticky, setIsSticky] = useState(false);

  const weekStripRef = useRef<HTMLDivElement>(null);
  const stickyTriggerRef = useRef<HTMLDivElement>(null);

  // days are memoized above

  useEffect(() => {
    const handleScroll = () => {
      if (stickyTriggerRef.current) {
        const rect = stickyTriggerRef.current.getBoundingClientRect();
        setIsSticky(rect.top <= 80);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: screenings = [], loading } = useScreenings(selectedDate);
  const visible = screenings; // hook already returns date-filtered items

  const [isSelectingDate, setIsSelectingDate] = useState(false);
  // ignore clicks on the already-selected day to avoid re-triggering load
  const handleSelectDate = (d: string) => {
    if (d === selectedDate) return;
    setSelectedDate(d);
    setIsSelectingDate(true);
  };
  useEffect(() => { if (!loading) setIsSelectingDate(false); }, [loading]);
  const effectiveLoading = loading || isSelectingDate;

  return (
    <div className="min-h-screen bg-linear-to-b from-black via-slate-950 to-black">
      <Navbar
        theme={theme}
        activePage="screenings"
        onMovieClick={onMovieClick}
        onSearchSubmit={onSearchSubmit}
      />

      <div className="pt-24 pb-24">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-white mb-2">Screenings</h1>
              <p className="text-slate-400">Book your cinematic experience</p>
            </div>
          </div>

          {/* Sticky trigger */}
          <div ref={stickyTriggerRef} />
        </div>

        {/* Week Strip */}
        <div
          ref={weekStripRef}
          className={`${isSticky ? "fixed top-20 left-0 right-0 z-40" : "relative"}`}
        >
          <WeekStrip days={days} selectedDate={selectedDate} onSelectDate={handleSelectDate}
            onPrevWeek={() => setWeekOffset((p) => p - 1)} onNextWeek={() => setWeekOffset((p) => p + 1)}
            isSticky={isSticky} theme={theme} />
        </div>

        {/* Films List */}
        <div className={`container mx-auto px-6 ${isSticky ? "mt-24" : "mt-8"}`}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.1 }}>
            {effectiveLoading ? (
              <div className="text-center py-20"><p className="text-slate-400">Loading…</p></div>
            ) : (() => {

              // base: only keep items with a movie + start time
              const list = visible.filter((s: any) => s?.movie && s?.start_time);

              // map UI era -> movie.era.name variants, then filter
              const eraMap: Record<string, string> = { "90s": "90s", "2000s": "00s", modern: "nowdays" };
              const eraFiltered = era
                ? list.filter((s: any) => {
                    const movieEra = s.movie?.era?.name ?? s.movie?.era;
                    return movieEra === (eraMap[era] ?? era);
                  })
                : list;

              if (!eraFiltered.length) return <div className="text-center py-20"><p className="text-slate-400">No movies found for this day.</p></div>;

              return eraFiltered.map((s: any, i: number) => {
                const m = s.movie;
                const time = new Date(s.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                return (
                  <div key={`${m.id}-${i}`}>
                    <FilmRow
                      title={m.title}
                      ageRating=""
                      runtime={`${m.runtime_min} min`}
                      genre=""
                      rating={m.vote_avg || 0}
                      poster={m.poster || ""}
                      formats={[{ format: s.language?.name || "Original", times: [{ time, available: true, screeningId: s.id }] }]}
                      activeDays={[(s.start_day || "").slice(0, 3)]}
                      theme={theme}
                      delay={i * 0.08}
                      onTimeSelect={() => onNavigate?.("booking-seats" as any)}
                    />
                    {i < eraFiltered.length - 1 && <Separator className="my-12 bg-slate-700/10" />}
                  </div>
                );
              });
            })()}
          </motion.div>
        </div>
      </div>

      <Footer theme={theme} />
    </div>
  );
}
