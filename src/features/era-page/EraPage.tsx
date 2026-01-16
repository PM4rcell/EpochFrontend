import { motion } from "motion/react";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { MovieCard } from "../../components/ui/movie-card";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { Button } from "../../components/ui/button";
import { ImageWithFallback } from "../../components/ImageWithFallback/ImageWithFallback";
import { useEra } from "../../context/EraContext";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Skeleton } from "../../components/ui/skeleton";
import { Spinner } from "../../components/ui/spinner";
import { usePagination } from "../../hooks/usePagination";
import { useMovieNavigationId } from "../../hooks/useMovieNavigationId";
import { Pagination } from "../../components/ui/pagination";


// Lightweight presentation metadata only (no movie lists)
const eraMeta: Record<string, any> = {
  "90s": { title: "Best of the 1990s", description: "Golden Age of Cinema", bgGradient: "from-slate-950 via-slate-900 to-slate-950", accentColor: "amber-500" },
  "2000s": { title: "Best of the 2000s", description: "The Digital Revolution", bgGradient: "from-slate-950 via-slate-900 to-slate-950", accentColor: "blue-400" },
  modern: { title: "Modern Cinema", description: "Today's Masterpieces", bgGradient: "from-slate-950 via-slate-900 to-slate-950", accentColor: "slate-300" },
};

export function EraPage() {
  const { era, setEra, lastClearedAt } = useEra();
  const navigate = useNavigate();
  const { eraId } = useParams<{ eraId?: string }>();
  const location = useLocation();

  const validEras = ["90s", "2000s", "modern"] as const;

  // Sync URL param into context (same logic as before)
  useEffect(() => {
    if (!eraId || !validEras.includes(eraId as any)) {
      navigate("/", { replace: true });
      return;
    }

    const RECENT_CLEAR_MS = 800;
    const wasRecentlyCleared = lastClearedAt && Date.now() - lastClearedAt < RECENT_CLEAR_MS;

    if (!wasRecentlyCleared && era !== eraId && location.pathname === `/${eraId}`) {
      setEra(eraId as any);
    }
  }, [eraId, setEra, navigate]);

  const currentEra = (era as string) ?? eraId;
  if (!currentEra) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">No era selected.</div>
    );
  }

  
  const eraNumericId = currentEra === "90s" ? 1 : currentEra === "2000s" ? 2 : currentEra === "modern" ? 3 : undefined;

  // Server-driven pagination: fetch pages from the API (6 per page)
  const { items: pageItems, currentPage, totalPages, loading: paginationLoading, hasFetched, error, setPage } = usePagination(eraNumericId, 6);

  const navigateToMovie = useMovieNavigationId();

  // Map API movie shape to MovieCard props for the current page
  const moviesForDisplay = (pageItems || []).map((m: any) => ({
    id: m.id,
    title: m.title || "Untitled",
    year: m.release_date ? new Date(m.release_date).getFullYear() : NaN,
    rating: typeof m.vote_avg === "number" ? m.vote_avg : 0,
    runtime: m.runtime_min ? `${m.runtime_min} min` : "",
    poster: (m as any).poster || (m as any).poster_path || "",
  }));

  // Prefer an explicitly featured movie on the current page; fall back to first item
  const featured = (pageItems || []).find((m: any) => m.is_featured === 1 || m.is_featured === true) || (pageItems && pageItems.length > 0 ? pageItems[0] : null);

  const meta = eraMeta[currentEra] ?? eraMeta.modern;

  const handleBack = () => {
    navigate("/", { replace: true });
    setEra(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className={`min-h-screen bg-linear-to-b ${meta.bgGradient} relative`}
    >
      {currentEra === "90s" && (
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('data:image/svg+xml;base64,...')]" />
      )}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
            initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
            animate={{ x: [null, Math.random() * window.innerWidth], y: [null, Math.random() * window.innerHeight] }}
            transition={{ duration: 10 + Math.random() * 20, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      <Navbar theme={currentEra as "90s" | "2000s" | "modern"} />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6 mb-8">
          <Button onClick={handleBack} variant="ghost" className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Eras
          </Button>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="container mx-auto px-6 mb-12">
          <h1 className={`text-${meta.accentColor} mb-2`}>{meta.title}</h1>
          <p className="text-slate-400">{meta.description}</p>
        </motion.div>

        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.1 }} className="lg:col-span-2 space-y-6">
            <h2 className="text-white mb-6">Featured Films</h2>
            {(!hasFetched || paginationLoading) ? (
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center text-center py-6">
                  <Spinner theme={currentEra as "90s" | "2000s" | "modern"} size="sm" />
                  <h3 className="mt-3 italic text-slate-400">Loading movies...</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="h-44 w-full rounded-lg" />
                      <div className="flex gap-2 items-center">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/4" />
                      </div>
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {error ? (
                    <p className="text-slate-400">Failed to load movies.</p>
                  ) : moviesForDisplay.length === 0 ? (
                    <p className="text-slate-400">No movies found.</p>
                  ) : (
                    moviesForDisplay.map((movie: any, index: number) => (
                      <motion.div key={movie.id ?? index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}>
                        <MovieCard {...movie} theme={currentEra as "90s" | "2000s" | "modern"} onClick={() => navigateToMovie(movie.id)} />
                      </motion.div>
                    ))
                  )}
                </div>
                {/* Pagination controls (6 items per page) - render immediately on load or while loading */}
                {(paginationLoading || totalPages > 1) && (
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
                )}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.2 }} className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className={`w-5 h-5 text-${meta.accentColor}`} />
              <h2 className="text-white">Highlight of the Week</h2>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} className="relative rounded-lg overflow-hidden group cursor-pointer">
              <div className="relative h-96">
                <ImageWithFallback src={(featured && ((featured as any).poster || (featured as any).poster_path)) || ""} alt={(featured && (featured.title || "")) || ""} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white mb-2">{(featured && featured.title) ?? meta.title}</h3>
                <p className="text-slate-400 mb-2">{featured && featured.release_date ? new Date(featured.release_date).getFullYear() : ""}</p>
                <motion.p initial={{ opacity: 0, y: 10 }} whileHover={{ opacity: 1, y: 0 }} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {(featured && featured.description) || meta.description}
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <Footer theme={currentEra as "90s" | "2000s" | "modern" | "default"} />
    </motion.div>
  );
}
