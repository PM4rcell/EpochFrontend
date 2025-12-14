import { motion } from "motion/react";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { MovieCard } from "../../components/ui/movie-card";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { Button } from "../../components/ui/button";
import { ImageWithFallback } from "../../components/ImageWithFallback/ImageWithFallback";
import { useEra } from "../../context/EraContext";

const eraData = {
  "90s": {
    title: "Best of the 1990s",
    description: "Golden Age of Cinema",
    bgGradient: "from-slate-950 via-slate-900 to-slate-950",
    accentColor: "amber-500",
    movies: [
      {
        title: "Titanic",
        year: 1997,
        rating: 4.5,
        runtime: "3h 14min",
        poster: "https://images.unsplash.com/photo-1697205946449-089739881fed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      },
      // további filmek...
    ],
    featured: {
      title: "Titanic",
      year: 1997,
      description: "Experience the epic romance and tragedy that captivated audiences worldwide.",
      poster: "https://images.unsplash.com/photo-1697205946449-089739881fed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    },
  },
  "2000s": {
    title: "Best of the 2000s",
    description: "The Digital Revolution",
    bgGradient: "from-slate-950 via-slate-900 to-slate-950",
    accentColor: "blue-400",
    movies: [
      {
        title: "Avatar",
        year: 2009,
        rating: 4.6,
        runtime: "2h 42min",
        poster: "https://images.unsplash.com/photo-1533408944756-4950754f3ebc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      },

      // további filmek...
    ],
    featured: {
      title: "Avatar",
      year: 2009,
      description: "Journey to Pandora in James Cameron's groundbreaking visual spectacle.",
      poster: "https://images.unsplash.com/photo-1533408944756-4950754f3ebc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    },
  },
  modern: {
    title: "Modern Cinema",
    description: "Today's Masterpieces",
    bgGradient: "from-slate-950 via-slate-900 to-slate-950",
    accentColor: "slate-300",
    movies: [
      {
        title: "F1",
        year: 2025,
        rating: 4.7,
        runtime: "2h 20min",
        poster: "https://images.unsplash.com/photo-1721490645563-8e87725bbfa4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      },
      // további filmek...
    ],
    featured: {
      title: "F1",
      year: 2025,
      description: "Experience the adrenaline and drama of Formula 1 racing in this thrilling cinematic journey.",
      poster: "https://images.unsplash.com/photo-1721490645563-8e87725bbfa4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    },
  },
};

export function EraPage() {
  const { era, setEra } = useEra();

  if (!era) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        No era selected.
      </div>
    );
  }

  const data = eraData[era];

  const handleBack = () => setEra(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className={`min-h-screen bg-gradient-to-b ${data.bgGradient} relative`}
    >
      {/* Film grain overlay for 90s */}
      {era === "90s" && (
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('data:image/svg+xml;base64,...')]" />
      )}

      {/* Particle effect */}
      {(
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
      )}

      <Navbar theme={era}/>

      <div className="pt-24 pb-12">
        {/* Back button */}
        <div className="container mx-auto px-6 mb-8">
          <Button onClick={handleBack} variant="ghost" className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Eras
          </Button>
        </div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="container mx-auto px-6 mb-12">
          <h1 className={`text-${data.accentColor} mb-2`}>{data.title}</h1>
          <p className="text-slate-400">{data.description}</p>
        </motion.div>

        {/* Two column layout */}
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.1 }} className="lg:col-span-2 space-y-6">
            <h2 className="text-white mb-6">Featured Films</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.movies.map((movie, index) => (
                <motion.div key={movie.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}>
                  <MovieCard {...movie} theme={era} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.2 }} className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className={`w-5 h-5 text-${data.accentColor}`} />
              <h2 className="text-white">Highlight of the Week</h2>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} className="relative rounded-lg overflow-hidden group cursor-pointer">
              <div className="relative h-96">
                <ImageWithFallback src={data.featured.poster} alt={data.featured.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white mb-2">{data.featured.title}</h3>
                <p className="text-slate-400 mb-2">{data.featured.year}</p>
                <motion.p initial={{ opacity: 0, y: 10 }} whileHover={{ opacity: 1, y: 0 }} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {data.featured.description}
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <Footer theme={era} />
    </motion.div>
  );
}
