import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, X, Star } from "lucide-react";
import { Navbar } from "../../components/layout/Navbar";
import { BackButton } from "../../components/ui/back-button.tsx";
import { Footer } from "../../components/layout/Footer";
import { MetaChip } from "./MetaChip";
import { RatingBadge } from "./RatingBadge.tsx";
import { CastItem } from "./CastItem";
import { GalleryThumb } from "./GalleryThumb";
import { SimilarCard } from "./SimilarCard";
import { SimilarCardCompact } from "./SimilarCardCompact";
import { ReviewItem } from "./ReviewItem.tsx";
import { AddReviewCard } from "./AddReviewCard";
import { CTAButton } from "./CTAButton";
import { Button } from "../../components/ui/button";

interface MovieInfoPageProps {
  theme?: "90s" | "2000s" | "modern" | "default";
  onBack?: () => void;
  onNavigate?: (page: "home" | "screenings" | "movies" | "news" | "era") => void;
}

// Mock data
const movieData = {
  title: "The Eternal Voyage",
  year: 2024,
  runtime: "2h 28min",
  director: "Sofia Mendez",
  genres: ["Sci-Fi", "Drama", "Adventure"],
  rating: 8.4,
  quality: "4K UHD",
  backdrop: "https://images.unsplash.com/photo-1574923930958-9b653a0e5148?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920",
  synopsis: "In a distant future where humanity has scattered across the stars, a lone astronaut discovers an ancient signal that could reunite the fragmented colonies or tear them apart forever. A breathtaking journey through space and time that questions what it means to be human.",
  cast: [
    {
      name: "Elena Torres",
      character: "Captain Aurora",
      image: "https://images.unsplash.com/photo-1530983822321-fcac2d3c0f06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    },
    {
      name: "Marcus Chen",
      character: "Dr. Kai",
      image: "https://images.unsplash.com/photo-1530983822321-fcac2d3c0f06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    },
    {
      name: "Amara Johnson",
      character: "Navigator Zara",
      image: "https://images.unsplash.com/photo-1530983822321-fcac2d3c0f06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    },
    {
      name: "Kai Nakamura",
      character: "Engineer Ryo",
      image: "https://images.unsplash.com/photo-1530983822321-fcac2d3c0f06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    },
    {
      name: "Lena Volkov",
      character: "Commander Irina",
      image: "https://images.unsplash.com/photo-1530983822321-fcac2d3c0f06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    },
  ],
  gallery: [
    {
      url: "https://images.unsplash.com/photo-1695114584354-13e1910d491b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      alt: "Scene 1",
    },
    {
      url: "https://images.unsplash.com/photo-1706701490905-7ceb096b5058?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      alt: "Scene 2",
    },
    {
      url: "https://images.unsplash.com/photo-1574923930958-9b653a0e5148?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      alt: "Scene 3",
    },
  ],
  userReviews: [
    {
      username: "Sarah Mitchell",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100",
      rating: 5,
      date: "2 days ago",
      text: "A mesmerizing visual spectacle that redefines space cinema. The performances are stellar and the cinematography is breathtaking. Every frame feels like a work of art.",
    },
    {
      username: "James Carter",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100",
      rating: 4,
      date: "5 days ago",
      text: "Thought-provoking and beautifully crafted. A must-see for sci-fi enthusiasts. The story takes some unexpected turns that kept me engaged throughout.",
    },
    {
      username: "Maria Rodriguez",
      rating: 5,
      date: "1 week ago",
      text: "Absolutely stunning! The world-building is incredible and the emotional depth caught me completely off guard. This is what sci-fi should be.",
    },
    {
      username: "Alex Kim",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100",
      rating: 4,
      date: "1 week ago",
      text: "Great visual effects and a compelling narrative. Some pacing issues in the middle act, but overall a fantastic experience that I'd recommend.",
    },
  ],
  reviewStats: {
    average: 4.5,
    total: 128,
  },
  similarMovies: [
    {
      title: "Interstellar",
      year: 2014,
      rating: 8.6,
      era: "2010s",
      image: "https://images.unsplash.com/photo-1659835347242-97835d671db7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    },
    {
      title: "Arrival",
      year: 2016,
      rating: 7.9,
      era: "2010s",
      image: "https://images.unsplash.com/photo-1710429112585-68a9c850a8a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    },
    {
      title: "Gravity",
      year: 2013,
      rating: 7.7,
      era: "2010s",
      image: "https://images.unsplash.com/photo-1643677841226-d6427625f118?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    },
    {
      title: "The Martian",
      year: 2015,
      rating: 8.0,
      era: "2010s",
      image: "https://images.unsplash.com/photo-1745564371387-7707cc41e958?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    },
    {
      title: "Blade Runner 2049",
      year: 2017,
      rating: 8.0,
      era: "2010s",
      image: "https://images.unsplash.com/photo-1659835347242-97835d671db7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    },
    {
      title: "Ad Astra",
      year: 2019,
      rating: 6.5,
      era: "2010s",
      image: "https://images.unsplash.com/photo-1710429112585-68a9c850a8a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    },
  ],
};

export function MovieInfoPage({ theme = "default", onBack, onNavigate }: MovieInfoPageProps) {
  const [showTrailer, setShowTrailer] = useState(false);
  const [isLoggedIn] = useState(true); // Simulate logged-in state
  const [reviews, setReviews] = useState(movieData.userReviews);

  const handleReviewSubmit = (rating: number, text: string) => {
    const newReview = {
      username: "You",
      rating,
      date: "Just now",
      text,
    };
    setReviews([newReview, ...reviews]);
  };

  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          playButton: "bg-amber-600 hover:bg-amber-500 border-amber-500",
          playGlow: "hover:shadow-[0_0_40px_rgba(245,158,11,0.6)]",
        };
      case "2000s":
        return {
          playButton: "bg-blue-500 hover:bg-blue-400 border-blue-400",
          playGlow: "hover:shadow-[0_0_40px_rgba(96,165,250,0.6)]",
        };
      case "modern":
        return {
          playButton: "bg-slate-300 hover:bg-slate-200 border-slate-200",
          playGlow: "hover:shadow-[0_0_40px_rgba(226,232,240,0.6)]",
        };
      default:
        return {
          playButton: "bg-amber-600 hover:bg-amber-500 border-amber-500",
          playGlow: "hover:shadow-[0_0_40px_rgba(245,158,11,0.6)]",
        };
    }
  };

  const colors = getThemeColors();

  return (
    <div className="min-h-screen bg-linear-to-b from-black via-slate-950 to-black">
      <Navbar theme={theme} activePage="movies"/>

      {/* Hero Section */}
      <div className="relative min-h-[75vh] overflow-hidden">
        {/* Backdrop */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/70 to-black z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] z-10" />
          <img
            src={movieData.backdrop}
            alt={movieData.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="relative z-20 container mx-auto px-6 min-h-[75vh] flex flex-col justify-between pt-24 pb-12">
          {/* Back button and quality badge */}
          <div className="flex items-start justify-between mb-8">
            <BackButton onBack={onBack || (() => {})} theme={theme} />
            <MetaChip label={movieData.quality} variant="quality" theme={theme} />
          </div>

          {/* Title and Play Button */}
          <div className="flex-1 flex flex-col justify-center max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-white mb-8"
            >
              {movieData.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="mb-8"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTrailer(true)}
                className={`
                  w-20 h-20 rounded-full border-2 flex items-center justify-center
                  ${colors.playButton} ${colors.playGlow}
                  transition-all duration-200
                `}
              >
                <Play className="w-8 h-8 text-black fill-black ml-1" />
              </motion.button>
            </motion.div>

            {/* Meta Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-wrap items-center gap-3 mb-6"
            >
              <MetaChip label={movieData.year.toString()} theme={theme} />
              <MetaChip label={movieData.runtime} theme={theme} />
              <MetaChip label={`Dir: ${movieData.director}`} theme={theme} />
              {movieData.genres.map((genre) => (
                <MetaChip key={genre} label={genre} theme={theme} />
              ))}
              <RatingBadge rating={movieData.rating} theme={theme} />
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <CTAButton 
                onClick={() => onNavigate?.("screenings")} 
                theme={theme}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Synopsis */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-white mb-4">Synopsis</h2>
              <div className="bg-black/40 border border-slate-700/30 rounded-lg p-6">
                <p className="text-slate-300 leading-relaxed">
                  {movieData.synopsis}
                </p>
              </div>
            </motion.section>

            {/* Cast */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-white mb-6">Cast</h2>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-6">
                {movieData.cast.map((member, index) => (
                  <CastItem
                    key={index}
                    {...member}
                    theme={theme}
                  />
                ))}
              </div>
            </motion.section>

            {/* Reviews */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-white">Reviews</h2>
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className={`w-4 h-4 ${
                      theme === "90s" 
                        ? "text-amber-500 fill-amber-500" 
                        : theme === "2000s"
                        ? "text-blue-400 fill-blue-400"
                        : theme === "modern"
                        ? "text-slate-300 fill-slate-300"
                        : "text-amber-500 fill-amber-500"
                    }`} />
                    <span className={
                      theme === "90s" 
                        ? "text-amber-400" 
                        : theme === "2000s"
                        ? "text-blue-300"
                        : theme === "modern"
                        ? "text-slate-200"
                        : "text-amber-400"
                    }>
                      {movieData.reviewStats.average.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{movieData.reviewStats.total} reviews</span>
                </div>
              </div>

              {/* Add Review Form (Logged in users) */}
              {isLoggedIn && (
                <AddReviewCard
                  onSubmit={handleReviewSubmit}
                  theme={theme}
                />
              )}

              {/* Reviews List */}
              <div className="space-y-3">
                {reviews.slice(0, 4).map((review, index) => (
                  <ReviewItem
                    key={index}
                    {...review}
                    theme={theme}
                  />
                ))}
              </div>

              {/* See All Reviews Link */}
              {reviews.length > 4 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    mt-4 w-full py-3 px-4 rounded-lg border
                    bg-black/40 text-slate-300 hover:text-white
                    ${theme === "90s" 
                      ? "border-amber-600/30 hover:border-amber-500/50 hover:bg-amber-600/10" 
                      : theme === "2000s"
                      ? "border-blue-500/30 hover:border-blue-400/50 hover:bg-blue-500/10"
                      : theme === "modern"
                      ? "border-slate-400/30 hover:border-slate-300/50 hover:bg-slate-400/10"
                      : "border-amber-600/30 hover:border-amber-500/50 hover:bg-amber-600/10"
                    }
                    transition-all duration-200
                  `}
                >
                  See all {reviews.length} reviews
                </motion.button>
              )}

              {/* Guest State - Login Prompt */}
              {!isLoggedIn && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`
                    bg-black/60 border rounded-xl p-6 text-center
                    ${theme === "90s" 
                      ? "border-amber-600/20" 
                      : theme === "2000s"
                      ? "border-blue-500/20"
                      : theme === "modern"
                      ? "border-slate-400/20"
                      : "border-amber-600/20"
                    }
                  `}
                >
                  <p className="text-slate-400 mb-4">Want to share your thoughts?</p>
                  <Button
                    className={`
                      ${theme === "90s" 
                        ? "bg-amber-600 hover:bg-amber-500 text-black" 
                        : theme === "2000s"
                        ? "bg-blue-500 hover:bg-blue-400 text-white"
                        : theme === "modern"
                        ? "bg-slate-300 hover:bg-slate-200 text-black"
                        : "bg-amber-600 hover:bg-amber-500 text-black"
                      }
                    `}
                  >
                    Log in to leave a review
                  </Button>
                </motion.div>
              )}
            </motion.section>

            {/* Gallery */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-white mb-6">Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {movieData.gallery.map((image, index) => (
                  <GalleryThumb
                    key={index}
                    image={image.url}
                    alt={image.alt}
                    theme={theme}
                  />
                ))}
              </div>
            </motion.section>
          </div>

          {/* Sidebar - Similar Movies */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-700/30">
                <h2 className="text-white">Similar movies</h2>
              </div>
              
              {/* Desktop: Compact vertical stack */}
              <div className="hidden lg:flex flex-col gap-2 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {movieData.similarMovies.map((movie, index) => (
                  <SimilarCardCompact
                    key={index}
                    {...movie}
                    theme={theme}
                    onClick={() => console.log("Navigate to movie:", movie.title)}
                  />
                ))}
              </div>

              {/* Mobile: 2-column grid */}
              <div className="grid grid-cols-2 gap-3 lg:hidden">
                {movieData.similarMovies.map((movie, index) => (
                  <SimilarCard
                    key={index}
                    {...movie}
                    theme={theme}
                    onClick={() => console.log("Navigate to movie:", movie.title)}
                  />
                ))}
              </div>
            </div>
          </motion.aside>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 flex justify-center"
        >
          <CTAButton 
            onClick={() => onNavigate?.("screenings")} 
            theme={theme}
            label="Book tickets now"
          />
        </motion.div>
      </div>

      <Footer theme={theme} />

      {/* Trailer Modal */}
      <AnimatePresence>
        {showTrailer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-lg"
            onClick={() => setShowTrailer(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
              className="relative w-full max-w-4xl mx-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setShowTrailer(false)}
                className="absolute -top-12 right-0 text-white hover:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400/50 rounded p-2"
              >
                <X className="w-8 h-8" />
              </button>

              {/* Video placeholder */}
              <div className="aspect-video bg-black rounded-lg overflow-hidden border border-slate-700/50">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">Trailer would play here</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mt-6">
                <Button className={`flex-1 ${colors.playButton}`}>
                  Watch Trailer
                </Button>
                <Button variant="outline" className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-700/20">
                  Add to Watchlist
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky CTA - Desktop only */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="hidden lg:block fixed bottom-8 right-8 z-40"
      >
        <CTAButton 
          onClick={() => onNavigate?.("screenings")} 
          theme={theme}
          label="View schedules"
        />
      </motion.div>
    </div>
  );
}