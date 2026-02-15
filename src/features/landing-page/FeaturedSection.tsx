import { motion, useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { ArrowRight, Newspaper } from "lucide-react";
import { ImageWithFallback } from "../../components/ImageWithFallback/ImageWithFallback";
import { Skeleton } from "../../components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { useNews, type Article } from "../../hooks/useArticles";

interface FeaturedCard {
  id: string;
  type: "news" | "prize" | "event";
  title: string;
  description: string;
  image: string;
  icon: typeof Newspaper;
}

export function FeaturedSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { articles: allArticles } = useNews();
  const { loading } = useNews();
  const [randomArticles, setRandomArticles] = useState<Article[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (allArticles && allArticles.length > 0) {
      const shuffled = [...allArticles].sort(() => 0.5 - Math.random());
      setRandomArticles(shuffled.slice(0, 3));
    }
  }, [allArticles]);

  const cardsToShow: FeaturedCard[] = randomArticles.length > 0
    ? randomArticles.map((a) => ({ id: a.id, type: "news", title: a.title, description: a.excerpt, image: a.image, icon: Newspaper }))
    : [];

  return (
    <section
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
      style={{ background: "radial-gradient(circle at center, #1a1108 0%, #0C0C0C 60%, #0B0B0B 100%)" }}
    >
      {/* Fade transition divider */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-black to-transparent pointer-events-none" />

      <div className="container mx-auto px-6">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <motion.h2
            className="bg-linear-to-r from-amber-600 via-amber-400 to-slate-400 bg-clip-text text-transparent mb-4 relative inline-block"
            whileHover={{ filter: "drop-shadow(0 0 12px rgba(245,158,11,0.5))" }}
          >
            FEATURED NEWS
          </motion.h2>
          
          {/* Animated underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="h-px w-64 mx-auto bg-linear-to-r from-transparent via-slate-400 to-transparent"
          />
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {loading
            ? Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="group bg-[#101010] rounded-[20px] overflow-hidden border border-amber-500/20 shadow-[0_8px_20px_rgba(255,255,255,0.08)] transition-all duration-150">
                  <div className="relative h-48 overflow-hidden">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <div className="p-6">
                    <Skeleton className="h-5 w-3/4 mb-3" />
                    <Skeleton className="h-3 w-full mb-4" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-1/4" />
                      <Skeleton className="h-3 w-1/6" />
                    </div>
                  </div>
                </div>
              ))
            : cardsToShow.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{
                  duration: 0.3,
                  delay: 0.1 + index * 0.1,
                  ease: [0.65, 0, 0.35, 1],
                }}
                whileHover={{ scale: 1.03, y: -5 }}
                onClick={() => navigate(`/article/${card.id}`)}
                className="group bg-[#101010] rounded-[20px] overflow-hidden border border-amber-500/20 shadow-[0_8px_20px_rgba(255,255,255,0.08)] hover:border-amber-500/40 hover:shadow-[0_12px_30px_rgba(245,158,11,0.15)] transition-all duration-150 cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#101010] via-transparent to-transparent" />
                  
                  {/* Icon badge */}
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm border border-amber-500/30 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-amber-400" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <motion.h3
                    className="text-[#E0E0E0] mb-3 group-hover:text-white transition-colors duration-200"
                    whileHover={{ filter: "drop-shadow(0 0 8px rgba(245,158,11,0.3))" }}
                  >
                    {card.title}
                  </motion.h3>
                  
                  <p className="text-[#A0A0A0] mb-4 line-clamp-2">
                    {card.description}
                  </p>

                  {/* Learn More Link */}
                  <motion.div
                    className="flex items-center gap-2 text-amber-600 group-hover:text-amber-400 transition-colors duration-200"
                    whileHover={{ x: 5 }}
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
