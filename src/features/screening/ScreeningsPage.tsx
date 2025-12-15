import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { motion } from "motion/react";
import { Search } from "lucide-react";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { FilterTabs } from "./FilterTabs";
import { WeekStrip } from "./WeekStrip";
import { FilmRow } from "./FilmRow";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";
import { useEra } from "../../context/EraContext";

interface ScreeningsPageProps {
  onBack?: () => void;
  onNavigate?: (page: "home" | "screenings" | "movies" | "news" | "era" | "search") => void;
  onMovieClick?: (movieId: string) => void;
  onSearchSubmit?: (query: string) => void;
}

// Mock data
const filterTabs = ["All films", "2D", "3D", "IMAX", "IMAX 3D", "4DX"];

const generateWeekDays = (weekOffset: number = 0) => {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() + weekOffset * 7);

  const days = [];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    const isToday = 
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    days.push({
      day: dayNames[date.getDay()],
      date: date.getDate(),
      month: monthNames[date.getMonth()],
      isToday,
    });
  }

  return days;
};

// Mock films
const films = [
  {
    title: "Mortal Engines",
    ageRating: "16+",
    runtime: "2h 8min",
    genre: "Action, Adventure",
    rating: 6.1,
    poster: "https://images.unsplash.com/photo-1745564371387-7707cc41e958?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    formats: [
      {
        format: "2D",
        times: [
          { time: "11:30 am", available: true },
          { time: "5:00 pm", available: true },
          { time: "7:45 pm", available: true },
          { time: "9:45 pm", available: false },
        ],
      },
      {
        format: "3D",
        times: [
          { time: "1:15 pm", available: true },
          { time: "6:30 pm", available: true },
          { time: "10:15 pm", available: true },
        ],
      },
      {
        format: "IMAX",
        times: [
          { time: "12:00 pm", available: true },
          { time: "8:30 pm", available: true },
        ],
      },
    ],
    activeDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  },
  // ... további filmek ugyanígy
];

export function ScreeningsPage({ onNavigate, onMovieClick, onSearchSubmit }: ScreeningsPageProps) {
  const { era } = useEra();
  const theme = era || "default"; // a context alapján

  const [activeTab, setActiveTab] = useState("All films");
  const [weekOffset, setWeekOffset] = useState(0);
  const initialDays = generateWeekDays(0);
  const [days, setDays] = useState(initialDays);
  const [selectedDate, setSelectedDate] = useState(`${initialDays[0].month}-${initialDays[0].date}`);
  const [isSticky, setIsSticky] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const weekStripRef = useRef<HTMLDivElement>(null);
  const stickyTriggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDays(generateWeekDays(weekOffset));
  }, [weekOffset]);

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

  const filteredFilms = films.filter((film) => {
    if (searchQuery && !film.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !film.genre.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (activeTab === "All films") return true;
    return film.formats.some((f) => f.format === activeTab);
  });

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

            {/* Search */}
            <div className="relative w-80 hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                type="text"
                placeholder="Search films, genres, formats…"
                value={searchQuery}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black/40 border-slate-700/50 text-slate-300 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6">
            <FilterTabs
              tabs={filterTabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              theme={theme}
            />
          </div>

          {/* Sticky trigger */}
          <div ref={stickyTriggerRef} />
        </div>

        {/* Week Strip */}
        <div
          ref={weekStripRef}
          className={`${isSticky ? "fixed top-20 left-0 right-0 z-40" : "relative"}`}
        >
          <WeekStrip
            days={days}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onPrevWeek={() => setWeekOffset((prev) => prev - 1)}
            onNextWeek={() => setWeekOffset((prev) => prev + 1)}
            isSticky={isSticky}
            theme={theme}
          />
        </div>

        {/* Films List */}
        <div className={`container mx-auto px-6 ${isSticky ? "mt-24" : "mt-8"}`}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.1 }}>
            {filteredFilms.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-slate-400">No films found matching your criteria.</p>
              </div>
            ) : (
              filteredFilms.map((film, index) => (
                <div key={film.title}>
                  <FilmRow
                    {...film}
                    theme={theme}
                    delay={index * 0.08}
                    onTimeSelect={(format, time) => {
                      console.log(`Selected: ${film.title} - ${format} - ${time}`);
                      if (onNavigate) {
                        onNavigate("booking-seats" as any);
                      }
                    }}
                  />
                  {index < filteredFilms.length - 1 && (
                    <Separator className="my-12 bg-slate-700/10" />
                  )}
                </div>
              ))
            )}
          </motion.div>
        </div>
      </div>

      <Footer theme={theme} />
    </div>
  );
}
