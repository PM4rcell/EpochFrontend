import { useState, useEffect } from "react";
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
import useComment from "../../hooks/useComment";
import { CTAButton } from "./CTAButton";
import { Button } from "../../components/ui/button";
import { useMovie } from "../../hooks/useMovie";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner } from "../../components/ui/spinner";
import MovieInfoPageSkeleton from "./MovieInfoPageSkeleton";
import { useSimilarMovies } from "../../hooks/useSimilarMovies";
import { useMovieNavigationId } from "../../hooks/useMovieNavigationId";
import { useEra } from "../../context/EraContext";



export function MovieInfoPage({ onBack, onNavigate }: { onBack?: () => void; onNavigate?: (route: string) => void }) {
  const { movieId } = useParams<{ movieId?: string }>();
  const navigate = useNavigate();

  const { movie: movieData, loading, error } = useMovie<any>(movieId ?? null);
  const { setEra } = useEra();

  const [showTrailer, setShowTrailer] = useState(false);
  const [isLoggedIn] = useState(true); // Simulate logged-in state
  const [reviews, setReviews] = useState<any[]>([]);
  const [showAllReviews, setShowAllReviews] = useState(false);


  

  const { submit: submitComment, loading: commentLoading } = useComment();

  const handleReviewSubmit = async (rating: number, text: string) => {
    const getLocalUsername = () => {
      try {
        if (typeof window === "undefined") return "You";
        const raw = localStorage.getItem("epoch_user");
        if (!raw) return "You";
        const me = JSON.parse(raw);
        return me?.data?.username ?? me?.username ?? "You";
      } catch {
        return "You";
      }
    };

    const newReview = {
      username: getLocalUsername(),
      rating,
      date: "Just now",
      text,
    };

    // Optimistic update
    setReviews([newReview, ...reviews]);

    try {
      const id = m?.id ?? movieId ?? null;
      if (!id) throw new Error("Missing movie id");
      await submitComment(id, { text, rating });
    } catch (err) {
      // Revert optimistic update on error
      setReviews((prev) => prev.filter((r) => r !== newReview));
      // eslint-disable-next-line no-console
      console.error("Failed to post review", err);
    }
  };

  // Resolve the visual era/theme key from the API-provided era record
  const resolveEraKey = (era: any) => {
    if (!era) return "modern";
    const candidates = [era.id, era.name, era.slug].filter(Boolean) as string[];
    for (const c of candidates) {
      const s = String(c).toLowerCase();
      if (s.includes("90")) return "90s";
      if (s.includes("2000") || s === "00s" || s.includes("00s") || s === "00") return "2000s";
      if (s.includes("now") || s.includes("nowday") || s.includes("modern")) return "modern";
      if (s === "90s" || s === "00s" || s === "modern") return s as any;
    }
    return "modern";
  };

  // Normalize wrapper shapes: API returns data inside a `data` field or directly
  const m: any = movieData ? (movieData.data ?? movieData.movie ?? movieData) : null;

  // Derive theme from the movie's era; this will re-run when `m` updates
  const theme = m ? resolveEraKey(m.era) : "modern";

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
      default:
        return {
          playButton: "bg-slate-300 hover:bg-slate-200 border-slate-200",
          playGlow: "hover:shadow-[0_0_40px_rgba(226,232,240,0.6)]",
        };
    }
  };

  const colors = getThemeColors();

  // (m is defined above)

  // Map era_id to era string: 1 = "90s", 2 = "2000s", 3 = "modern"
  const mapEraIdToEra = (eraId: number | undefined | null): "90s" | "2000s" | "modern" | null => {
    if (eraId === 1) return "90s";
    if (eraId === 2) return "2000s";
    if (eraId === 3) return "modern";
    return null;
  };

  // Set era context when movie loads
  useEffect(() => {
    if (m) {
      const eraId = m.era_id ?? m.era?.id;
      const era = mapEraIdToEra(eraId);
      if (era) {
        setEra(era);
      }
    }
  }, [m, setEra]);

  useEffect(() => {
    if (m && Array.isArray(m.comments)) setReviews(m.comments);
    else setReviews([]);
  }, [m]);

  // Similar movies
  const { items: similarItems, loading: similarLoading } = useSimilarMovies(m?.id ?? movieId ?? null);
  const navigateToMovie = useMovieNavigationId();

  // Show loading skeleton if loading OR if we have a movieId but no data yet (initial state)
  if (loading || (movieId && !movieData && !error)) {
    return <MovieInfoPageSkeleton theme={theme} />;
  }

  if (error || !movieData)
    return (
      <div className="min-h-screen bg-linear-to-b from-black via-slate-950 to-black">
        <Navbar theme={theme} activePage="movies" />
        <div className="container mx-auto px-6 py-32">
          <p className="text-center text-slate-400">Failed to load movie.</p>
        </div>
        <Footer theme={theme} />
      </div>
    );
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
            src={m?.poster?.url || m?.poster?.src || m?.poster || ""}
            alt={m?.title || ""}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="relative z-20 container mx-auto px-6 min-h-[75vh] flex flex-col justify-between pt-24 pb-12">
          {/* Back button and quality badge */}
            <div className="flex items-start justify-between mb-8">
            <BackButton onBack={onBack} theme={theme} />
            <MetaChip label={m?.age_rating || m?.quality || ""} variant="quality" theme={theme} />
          </div>

          {/* Title and Play Button */}
          <div className="flex-1 flex flex-col justify-center max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-white mb-8"
            >
              {m?.title}
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
              <MetaChip label={m?.release_date ? new Date(m.release_date).getFullYear().toString() : ""} theme={theme} />
              <MetaChip label={m?.runtime_min ? `${m.runtime_min} min` : ""} theme={theme} />
              <MetaChip label={`Dir: ${m?.director?.name || m?.director || ""}`} theme={theme} />
              {(m?.genres || []).map((genre: any) => (
                <MetaChip key={genre.id || genre} label={genre.name || genre} theme={theme} />
              ))}
              <RatingBadge rating={m?.vote_avg ?? 0} theme={theme} />
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <CTAButton
                onClick={() => {
                  // prefer parent handler, otherwise use router navigate
                  if (onNavigate) return onNavigate("/screenings");
                  navigate("/screenings");
                }}
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
                  {m?.description}
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
                {(m?.cast || []).map((member: any, index: number) => (
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
                      {(m?.vote_avg ?? 0).toFixed(1)}
                    </span>
                  </div>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{(m?.comments || []).length} reviews</span>
                </div>
              </div>

              {/* Add Review Form (Logged in users) */}
              {isLoggedIn && (
                <AddReviewCard
                  onSubmit={handleReviewSubmit}
                  theme={theme}
                  isSubmitting={commentLoading}
                />
              )}

              {/* Reviews List */}
              <div className="space-y-3">
                {(showAllReviews ? reviews : reviews.slice(0, 4)).map((review, index) => (
                  <ReviewItem
                    key={index}
                    username={review.user?.username || review.username || review.name || "Guest"}
                    rating={review.rating ?? review.score ?? 0}
                    date={review.created_at || review.date || ""}
                    text={review.text || review.body || ""}
                    theme={theme}
                  />
                ))}
              </div>

              {/* See All Reviews Link */}
              {reviews.length > 4 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAllReviews((s) => !s)}
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
                  {showAllReviews ? `Show less` : `See all ${reviews.length} reviews`}
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
                {(m?.gallery || []).map((image: any, index: number) => (
                  <GalleryThumb
                    key={index}
                    image={image.url || image.path || image}
                    alt={image.alt || image.title || m?.title}
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
              
              {/*Desktop: Compact vertical stack*/}
              <div className="hidden lg:flex flex-col gap-2 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {similarLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <Spinner size="sm" theme={theme} />
                  </div>
                ) : (similarItems && similarItems.length > 0) ? (
                  (similarItems || []).map((movie, index) => (
                    <SimilarCardCompact
                      key={movie.id ?? index}
                      title={movie.title || "Untitled"}
                      year={movie.release_date ? new Date(movie.release_date).getFullYear() : NaN}
                      image={(movie as any).poster?.url || (movie as any).poster || (movie as any).poster_path || ""}
                      rating={typeof movie.vote_avg === "number" ? movie.vote_avg : undefined}
                      era={String(movie.era_id ??  "")}
                      theme={theme}
                      onClick={() => navigateToMovie(movie.id)}
                    />
                  ))
                ) : (
                  <div className="p-4">
                    <p className="text-slate-400">No similar movies found</p>
                  </div>
                )}
              </div>

              {/* Mobile: 2-column grid */}
              <div className="grid grid-cols-2 gap-3 lg:hidden">
                {similarLoading ? (
                  <div className="col-span-2 flex items-center justify-center p-4">
                    <Spinner size="sm" theme={theme} />
                  </div>
                ) : (similarItems && similarItems.length > 0) ? (
                  (similarItems || []).map((movie, index) => (
                    <SimilarCard
                      key={movie.id ?? index}
                      title={movie.title || "Untitled"}
                      year={movie.release_date ? new Date(movie.release_date).getFullYear() : NaN}
                      image={(movie as any).poster?.url || (movie as any).poster || (movie as any).poster_path || ""}
                      theme={theme}
                      onClick={() => navigateToMovie(movie.id)}
                    />
                  ))
                ) : (
                  <div className="col-span-2 p-4">
                    <p className="text-slate-400">No similar movies found</p>
                  </div>
                )}
              </div>
            </div>
          </motion.aside>
        </div>
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
    </div>
  );
}