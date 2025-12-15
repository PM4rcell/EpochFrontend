import { useState } from "react";
import { motion } from "motion/react";
import { ArticleCard } from "./ArticleCard.tsx";
import { Button } from "../../components/ui/button";
import type { NewsCategory } from "./NewsPage";

interface ArticleGridProps {
  theme?: "90s" | "2000s" | "modern" | "default";
  category: NewsCategory;
  onArticleClick?: (articleId: string) => void;
}

const allArticles = [
  {
    id: "1",
    title: "Epoch Introduces New Premium Seating Experience",
    excerpt: "Experience cinema like never before with our new luxury recliners and enhanced sound systems across all theaters.",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600&fit=crop",
    category: "announcements",
    tag: "Announcements",
    date: "Dec 3, 2024",
    readTime: "3 min",
  },
  {
    id: "2",
    title: "Holiday Film Festival Returns This December",
    excerpt: "Join us for a month-long celebration of classic holiday films, featuring restored 4K presentations and special guest appearances.",
    image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=600&fit=crop",
    category: "events",
    tag: "Events",
    date: "Dec 1, 2024",
    readTime: "4 min",
  },
  {
    id: "3",
    title: "Review: The Eternal Voyage Soars in IMAX",
    excerpt: "A breathtaking visual masterpiece that pushes the boundaries of cinematic storytelling. Our full review of this year's most anticipated release.",
    image: "https://images.unsplash.com/photo-1574923930958-9b653a0e5148?w=800&h=600&fit=crop",
    category: "reviews",
    tag: "Reviews",
    date: "Nov 30, 2024",
    readTime: "6 min",
  },
  {
    id: "4",
    title: "Behind the Curtain: How We Restored Cinema 1",
    excerpt: "Take an exclusive look at the year-long restoration project that brought our historic Cinema 1 back to its original 1950s glory.",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=600&fit=crop",
    category: "behind-the-scenes",
    tag: "Behind the Scenes",
    date: "Nov 28, 2024",
    readTime: "8 min",
  },
  {
    id: "5",
    title: "New Partnership with Classic Film Archive",
    excerpt: "We're excited to announce our collaboration with the National Film Archive to bring rare restored classics to Epoch screens.",
    image: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=800&h=600&fit=crop",
    category: "announcements",
    tag: "Announcements",
    date: "Nov 25, 2024",
    readTime: "5 min",
  },
  {
    id: "6",
    title: "90s Night: A Nostalgic Journey Through Cinema",
    excerpt: "Join us every Friday for 90s Night, featuring cult classics, forgotten gems, and the movies that defined a generation.",
    image: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=800&h=600&fit=crop",
    category: "events",
    tag: "Events",
    date: "Nov 22, 2024",
    readTime: "3 min",
  },
];

export function ArticleGrid({ theme = "default", category, onArticleClick }: ArticleGridProps) {
  const [visibleCount, setVisibleCount] = useState(6);

  const filteredArticles =
    category === "all"
      ? allArticles
      : allArticles.filter((article) => article.category === category);

  const visibleArticles = filteredArticles.slice(0, visibleCount);
  const hasMore = visibleCount < filteredArticles.length;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {visibleArticles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.35 + index * 0.05 }}
          >
            <ArticleCard
              article={article}
              theme={theme}
              onClick={() => onArticleClick?.(article.id)}
            />
          </motion.div>
        ))}
      </motion.div>

      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="mt-8 flex justify-center"
        >
          <Button
            variant="ghost"
            onClick={() => setVisibleCount(visibleCount + 6)}
            className="text-slate-400 hover:text-slate-300 border border-slate-700 hover:border-slate-600 bg-black/40 backdrop-blur-sm"
          >
            Load More
          </Button>
        </motion.div>
      )}
    </div>
  );
}
