import { motion } from "motion/react";
import {
  Ticket,
  Award,
  Bookmark,
  Star,
} from "lucide-react";
import { StatCard } from "./StatCard";
import { NextShowCard } from "./NextShowCard";
import { RecentActivityCard } from "./RecentActivityCard";
import { useTickets } from "../../hooks/useTickets";

interface OverviewContentProps {
  theme?: "90s" | "2000s" | "modern" | "default";
  onNavigate?: (page: any) => void;
}

export function OverviewContent({
  theme = "default",
  onNavigate,
}: OverviewContentProps) {
  const { tickets } = useTickets();
  let commentCount = 0;
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem("epoch_user") : null;
    const stored = raw ? JSON.parse(raw) : null;
    const comments = stored?.data?.comments ?? stored?.comments ?? [];
    commentCount = Array.isArray(comments) ? comments.length : 0;
  } catch {
    commentCount = 0;
  }

  const stats = [
    {
      icon: Ticket,
      label: "Tickets Booked",
      value: String( (typeof tickets !== 'undefined' && tickets) ? tickets.length : 0 ),
      description: "",
    },
    {
      icon: Award,
      label: "Badges Earned",
      value: "7",
      description: "2 until next tier",
    },
    {
      icon: Bookmark,
      label: "Watchlist",
      value: "18",
      description: "5 new releases",
    },
    {
      icon: Star,
      label: "Ratings Given",
      value: String(commentCount),
      description: "",
    },
  ];

  const nextShow = {
    title: "The Eternal Voyage",
    poster:
      "https://images.unsplash.com/photo-1574923930958-9b653a0e5148?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    date: "Friday, Nov 8",
    time: "7:30 PM",
    theater: "Cinema 1",
    seats: "E7, E8",
    format: "IMAX",
  };

  const recentActivities = [
    {
      type: "booking" as const,
      title: "Booked 2 tickets",
      movie: "Dune: Part Two",
      date: "2 days ago",
    },
    {
      type: "watchlist" as const,
      title: "Added to watchlist",
      movie: "The Grand Budapest Hotel",
      date: "3 days ago",
    },
    {
      type: "review" as const,
      title: "Rated 5 stars",
      movie: "Inception",
      date: "1 week ago",
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
        <NextShowCard
          show={nextShow}
          theme={theme}
          onNavigate={onNavigate}
        />
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-slate-300 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.4 + index * 0.1,
              }}
            >
              <RecentActivityCard
                activity={activity}
                theme={theme}
              />
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}