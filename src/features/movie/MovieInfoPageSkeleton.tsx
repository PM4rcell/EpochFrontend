import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { Skeleton } from "../../components/ui/skeleton";
import { Spinner } from "../../components/ui/spinner";

export function MovieInfoPageSkeleton({ theme = "modern" }: { theme?: "90s" | "2000s" | "modern" }) {
  return (
    <div className="min-h-screen bg-linear-to-b from-black via-slate-950 to-black">
      <Navbar theme={theme} activePage="movies" />

      {/* Hero skeleton */}
      <div className="relative min-h-[75vh] overflow-hidden">
        <div className="absolute inset-0">
          <Skeleton className="w-full h-full" />
        </div>

        <div className="relative z-20 container mx-auto px-6 min-h-[75vh] flex flex-col justify-between pt-24 pb-12">
          <div className="flex items-start justify-between mb-8">
            <div className="w-32">
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="w-24">
              <Skeleton className="h-8 w-24" />
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-4xl">
            <Skeleton className="h-10 w-3/4 mb-8" />

            <div className="mb-8 flex items-center gap-6">
              <Skeleton className="w-20 h-20 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-1/3 mb-3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Content skeletons */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="flex flex-col items-center pointer-events-none">
          <div className="pointer-events-auto">
            <Spinner size="sm" />
          </div>
          <p className="mt-4 text-slate-400 pointer-events-none">Loading movie...</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div className="mb-6">
              <Skeleton className="h-6 w-40 mb-4" />
              <Skeleton className="h-40 w-full rounded-lg" />
            </div>

            <div>
              <Skeleton className="h-6 w-28 mb-4" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>

            <div>
              <Skeleton className="h-6 w-24 mb-4" />
              <div className="grid grid-cols-3 md:grid-cols-5 gap-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-28 w-full rounded-lg" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start space-y-4">
            <Skeleton className="h-6 w-32 mb-3" />
            <div className="hidden lg:flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-16 w-12 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 lg:hidden">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          </aside>
        </div>
      </div>

      <Footer theme={theme} />
    </div>
  );
}

export default MovieInfoPageSkeleton;
