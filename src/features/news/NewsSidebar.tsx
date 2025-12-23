import { motion } from "motion/react";
import { TrendingUp, Calendar } from "lucide-react";
import { MiniArticleItem } from "./MiniArticleItem.tsx";
import { EventItem } from "./EventItem.tsx";
import { useEra } from "../../context/EraContext";

interface NewsSidebarProps {
  theme?: "90s" | "2000s" | "modern" | "default";
  onArticleClick?: (articleId: string) => void;
}

const trendingArticles = [
  {
    id: "trending-1",
    title: "The Evolution of IMAX Technology",
    readTime: "5 min",
  },
  {
    id: "trending-2",
    title: "Interview: Director's Vision Behind The Eternal Voyage",
    readTime: "8 min",
  },
  {
    id: "trending-3",
    title: "Top 10 Must-Watch Films This Season",
    readTime: "6 min",
  },
];

const upcomingEvents = [
  {
    id: "event-1",
    title: "Director Q&A: The Art of Storytelling",
    date: "Dec 15",
  },
  {
    id: "event-2",
    title: "Classic Film Marathon Weekend",
    date: "Dec 20",
  },
  {
    id: "event-3",
    title: "New Year's Eve Gala Screening",
    date: "Dec 31",
  },
];

export function NewsSidebar({ theme, onArticleClick }: NewsSidebarProps) {
  const { era } = useEra();
  const appliedTheme = theme ?? (era ?? "default");

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
          icon: "text-slate-400",
        };
      default:
        return {
          accent: "text-amber-500",
          icon: "text-amber-500",
        };
    }
  };

  const colors = getThemeColors();

  return (
    <div className="space-y-8">
      {/* Trending */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="rounded-2xl bg-linear-to-br from-slate-900/60 to-black/60 backdrop-blur-sm border border-slate-800/50 p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className={`w-5 h-5 ${colors.icon}`} />
          <h3 className={`${colors.accent}`}>Trending</h3>
        </div>
        <div className="space-y-3">
          {trendingArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.45 + index * 0.05 }}
            >
              <MiniArticleItem
                article={article}
                theme={theme}
                onClick={() => onArticleClick?.(article.id)}
              />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Coming Events */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="rounded-2xl bg-linear-to-br from-slate-900/60 to-black/60 backdrop-blur-sm border border-slate-800/50 p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar className={`w-5 h-5 ${colors.icon}`} />
          <h3 className={`${colors.accent}`}>Coming Events</h3>
        </div>
        <div className="space-y-3">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.55 + index * 0.05 }}
            >
              <EventItem event={event} theme={theme} />
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
