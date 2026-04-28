import { motion } from "motion/react";
import Cookies from "js-cookie";
import {
  Ticket,
  Heart,
  Bookmark,
  Star,
} from "lucide-react";
import { StatCard } from "./StatCard";
import { NextShowCard } from "./NextShowCard";
import { useTickets } from "../../hooks/useTickets";
import useUpcomingShow from "../../hooks/useUpcomingShow";
import useWatchlist, { type WatchlistEntry } from "../../hooks/useWatchlist";

interface OverviewContentProps {
  theme?: "90s" | "2000s" | "modern" | "default";
  onNavigate?: (page: any) => void;
}

export function OverviewContent({
  theme = "default",
  onNavigate,
}: OverviewContentProps) {
  const { tickets } = useTickets();
  const { watchlistItems } = useWatchlist();
  const { nextShow, hasUpcomingBooking } = useUpcomingShow();
  let commentCount = 0;
  try {
    const raw = typeof window !== "undefined" ? Cookies.get("epoch_user_profile") : null;
    const stored = raw ? JSON.parse(raw) : null;
    const comments = stored?.data?.comments ?? stored?.comments ?? [];
    commentCount = Array.isArray(comments) ? comments.length : 0;
  } catch {
    commentCount = 0;
  }

  // Calculate favorite era from watchlist based on release_date
  const getFavoriteEra = (items: WatchlistEntry[]): string => {
    if (items.length === 0) return "N/A";
    
    const eraCounts: Record<string, number> = {};
    
    items.forEach((item) => {
      const releaseDate = item.movie?.release_date;
      if (!releaseDate) return;
      
      const year = parseInt(releaseDate.split("-")[0], 10);
      let eraName: string;
      
      if (year >= 1990 && year < 2000) eraName = "90s";
      else if (year >= 2000 && year < 2010) eraName = "2000s";
      else eraName = "Modern";
      
      eraCounts[eraName] = (eraCounts[eraName] || 0) + 1;
    });
    
    const entries = Object.entries(eraCounts);
    if (entries.length === 0) return "N/A";
    
    const favorite = entries.reduce((a, b) => 
      a[1] > b[1] ? a : b
    );
    
    return favorite[0];
  };

  const favoriteEra = getFavoriteEra(watchlistItems);

  const stats = [
    {
      icon: Ticket,
      label: "Tickets Booked",
      value: String( (typeof tickets !== 'undefined' && tickets) ? tickets.length : 0 ),
      description: "",
    },
    {
      icon: Heart,
      label: "Favorite Era",
      value: favoriteEra,
      description: "",
    },
    {
      icon: Bookmark,
      label: "Watchlist",
      value: String(watchlistItems.length),
      description: "",
    },
    {
      icon: Star,
      label: "Ratings Given",
      value: String(commentCount),
      description: "",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.25 }}
      className="space-y-8 mt-6"
    >
      {/* Stats Grid */}
      <section>
        <h2 className="text-slate-300 mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.3 + index * 0.05,
              }}
            >
              <StatCard
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
                description={stat.description}
                theme={theme}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Next Show */}
      <section>
        <h2 className="text-slate-300 mb-4">Upcoming Show</h2>
        {hasUpcomingBooking ? (
          <NextShowCard
            show={nextShow}
            theme={theme}
            onNavigate={onNavigate}
          />
        ) : (
          <p className="text-slate-400">You have no upcoming bookings</p>
        )}
      </section>
    </motion.div>
  );
}