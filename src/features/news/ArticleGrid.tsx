import { useState } from "react";
import { motion } from "motion/react";
import { Spinner } from "../../components/ui/spinner";
import { Skeleton } from "../../components/ui/skeleton";
import { ArticleCard } from "./ArticleCard.tsx";
import { Button } from "../../components/ui/button";
import type { NewsCategory } from "./NewsPage";
import { useEra } from "../../context/EraContext";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  tag: string;
  date: string;
  readTime: string;
  category?: string;
}

interface ArticleGridProps {
  theme?: "90s" | "2000s" | "modern" | "default";
  category: NewsCategory;
  articles?: Article[];
  loading?: boolean;
  error?: Error | null;
  onArticleClick?: (articleId: string) => void;
}

export function ArticleGrid({ theme = "default", category, articles = [], loading = false, onArticleClick }: ArticleGridProps) {
  const [visibleCount, setVisibleCount] = useState(6);
  const { era: currentEra } = useEra();
  const spinnerTheme = ((currentEra as "90s" | "2000s" | "modern") ?? (theme === "default" ? "modern" : (theme as "90s" | "2000s" | "modern"))) as "90s" | "2000s" | "modern";

  if (loading)
    return (
      <div className="py-8 relative">
        <div className="flex flex-col items-center justify-center mb-6">
          <Spinner theme={spinnerTheme} size="sm" />
          <p className="mt-3 italic text-slate-400 text-center">Loading articles...</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-44 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-1/4" />
                <Skeleton className="h-3 w-1/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  if ((arguments[0] as ArticleGridProps).error) return <p>Failed to load articles.</p>;

  const filteredArticles =
    category === "all"
      ? articles
      : articles.filter((article) => article.category === category);

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
