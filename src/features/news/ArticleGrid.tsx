import { useState } from "react";
import { motion } from "motion/react";
import { ArticleCard } from "./ArticleCard.tsx";
import { Button } from "../../components/ui/button";
import type { NewsCategory } from "./NewsPage";

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

export function ArticleGrid({ category, articles = [], loading = false, onArticleClick }: ArticleGridProps) {
  const [visibleCount, setVisibleCount] = useState(6);

  if (loading) return <p>Loading articles...</p>;
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
