// Hook that encapsulates fetching logic for eras
// API era type for resolving keys
import type { Era as ApiEra } from "../../api/eras";
// Motion library for simple entrance/hover animations
import { motion } from "motion/react";
import { Spinner } from "../../components/ui/spinner";
// Local image assets used for the era cards' backgrounds
import img90s from "../../assets/img/90s_era.jpg";
import img2000s from "../../assets/img/2000s_era.jpg";
import imgModern from "../../assets/img/modern_era.jpg";

// Props: parent provides a callback to be called with the chosen era key
interface EraSelectorProps {
  onSelectEra: (eraId: string) => void;
  eras?: ApiEra[]; // optional: allow parent to provide fetched eras
  loading?: boolean;
  error?: Error | null;
}

// EraSelector: fetches era records from the API and renders animated cards.
// Visual presentation (images, glow, title) comes from a local `meta` map,
// while the server controls which eras are available and their identifiers.
export function EraSelector({ onSelectEra, eras = [], loading = false, error = null }: EraSelectorProps) {
  // Presentation logic only; data may be provided by parent (LandingPage)
  // or omitted for standalone usage.
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Spinner size="sm" />
        <p className="mt-3 italic text-slate-400 text-center">Loading eras...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center py-12">
        <p className="italic text-slate-400 text-center">Failed to load eras.</p>
      </div>
    );

  // Presentation metadata for each canonical era key.
  // This maps the frontend key ("90s"/"2000s"/"modern") to images,
  // display titles and subtle hover glow styles.
  const meta: Record<string, any> = {
    "90s": {
      title: "1990s",
      movie: "Titanic (1997)",
      image: img90s,
      glow: "hover:shadow-[0_20px_60px_-15px_rgba(245,158,11,0.4)]",
      glowColor: "rgba(245,158,11,0.3)",
    },
    "2000s": {
      title: "2000s",
      movie: "Avatar (2009)",
      image: img2000s,
      glow: "hover:shadow-[0_20px_60px_-15px_rgba(96,165,250,0.4)]",
      glowColor: "rgba(96,165,250,0.3)",
    },
    modern: {
      title: "Modern",
      movie: "F1 (2025)",
      image: imgModern,
      glow: "hover:shadow-[0_20px_60px_-15px_rgba(226,232,240,0.4)]",
      glowColor: "rgba(226,232,240,0.3)",
    },
  };

  // Converts a fetched Era object into one of the canonical frontend keys
  // ("90s", "2000s", "modern"). This function is intentionally
  // permissive to tolerate API naming variations (e.g. "00s", "nowdays").
  const resolveEraKey = (era: ApiEra) => {
    // prefer `id` if it's a known string, otherwise infer from `name`
    const candidates = [era.id, era.name].filter(Boolean) as string[];
    for (const c of candidates) {
      const s = String(c).toLowerCase();
      if (s.includes("90")) return "90s";
      if (s.includes("2000") || s === "00s" || s.includes("00s") || s === "00") return "2000s";
      // handle API spellings like "nowdays" / "nowday" / "now"
      if (s.includes("now") || s.includes("nowday") || s.includes("nowdays") || s.includes("modern" ) || s.includes("202")) return "modern";
      if (s === "90s" || s === "2000s" || s === "modern") return s;
    }
    return "modern";
  };
  // Build an ordered, deduplicated list of era keys for rendering.
  // - Map each fetched era to a canonical key with `resolveEraKey`.
  // - Deduplicate using a Set (API may return multiple records that
  //   resolve to the same visual era).
  // - Enforce the desired visual order: 90s, 2000s, modern.
  const fetchedKeys = eras.map(resolveEraKey);
  const uniqueKeys = Array.from(new Set(fetchedKeys));
  const desiredOrder = ["90s", "2000s", "modern"] as const;
  const displayKeys = desiredOrder.filter((k) => uniqueKeys.includes(k));

  return (
    <div className="container mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
      {displayKeys.map((eraKey, index) => {
        const e = meta[eraKey] || meta.modern;
        return (
          <motion.div
            key={eraKey}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -10 }}
            onClick={() => onSelectEra(eraKey)}
            className={`relative overflow-hidden rounded-2xl cursor-pointer group ${e.glow} transition-all duration-300`}
            style={{ clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)" }}
          >

            {/* Image container: covers the card and provides the background image */}
            <div className="relative h-125 overflow-hidden">
              <motion.img src={e.image} alt={e.title} className="w-full h-full object-cover" whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }} />
              {/* Dark gradient to improve text contrast */}
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
              {/* Hover radial glow overlay (uses era-specific color) */}
              <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `radial-gradient(circle at center, ${e.glowColor} 0%, transparent 70%)` }} />
            </div>

            {/* Text overlay: era title and a featured movie */}
            <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
              <motion.h3 className="text-white tracking-wider mb-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 + 0.2 }}>{e.title}</motion.h3>
              <motion.p className="text-slate-400" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 + 0.3 }}>{e.movie}</motion.p>
            </div>

            {/* Small decorative indicator that animates on hover */}
            <motion.div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
          </motion.div>
        );
      })}
    </div>
  );
}
