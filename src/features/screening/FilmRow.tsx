import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { Star } from "lucide-react";
import { ImageWithFallback } from "../../components/ImageWithFallback/ImageWithFallback.tsx";
import { FormatTag } from "./FormatTag.tsx";
import { TimePill } from "./TimePill.tsx";

interface Showtime {
  time: string;
  available: boolean;
  screeningId?: string | number;
}

interface FormatShowtimes {
  format: string;
  times: Showtime[];
}

interface FilmRowProps {
  title: string;
  ageRating: string;
  runtime: string;
  genre: string;
  rating: number;
  poster: string;
  formats: FormatShowtimes[];
  onTimeSelect?: (format: string, time: string) => void;
  theme?: "90s" | "2000s" | "modern" | "default";
  delay?: number;
}

export function FilmRow({
  title,
  ageRating,
  runtime,
  genre,
  rating,
  poster,
  formats,
  
  onTimeSelect,
  theme = "default",
  delay = 0,
}: FilmRowProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [activeFormat, setActiveFormat] = useState<string>(formats[0]?.format || "");

  const handleTimeClick = (format: string, time: string) => {
    setSelectedTime(`${format}-${time}`);
    onTimeSelect?.(format, time);
  };

  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          dot: "bg-amber-500",
          border: "border-amber-500/30",
          shadow: "shadow-[0_4px_20px_rgba(245,158,11,0.15)]",
          glow: "group-hover:shadow-[0_8px_30px_rgba(245,158,11,0.25)]",
        };
      case "2000s":
        return {
          dot: "bg-blue-400",
          border: "border-blue-400/30",
          shadow: "shadow-[0_4px_20px_rgba(96,165,250,0.15)]",
          glow: "group-hover:shadow-[0_8px_30px_rgba(96,165,250,0.25)]",
        };
      case "modern":
        return {
          dot: "bg-slate-300",
          border: "border-slate-300/30",
          shadow: "shadow-[0_4px_20px_rgba(226,232,240,0.15)]",
          glow: "group-hover:shadow-[0_8px_30px_rgba(226,232,240,0.25)]",
        };
      default:
        return {
          dot: "bg-amber-500",
          border: "border-amber-500/30",
          shadow: "shadow-[0_4px_20px_rgba(245,158,11,0.15)]",
          glow: "group-hover:shadow-[0_8px_30px_rgba(245,158,11,0.25)]",
        };
    }
  };

  const colors = getThemeColors();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.28,
        delay: delay,
        ease: [0.65, 0, 0.35, 1],
      }}
      className="group"
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Poster and Info */}
        <div className="flex gap-4 lg:w-100">
          {/* Poster */}
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className={`shrink-0 w-30 h-45 rounded-lg overflow-hidden border ${colors.border} ${colors.shadow} ${colors.glow} transition-all duration-200`}
          >
            <ImageWithFallback
              src={poster}
              alt={title}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Info */}
          <div className="flex-1 flex flex-col justify-between py-1">
            <div>
              <h3 className="text-white mb-1">
                {title} {ageRating && <span className="text-slate-500">{ageRating}</span>}
              </h3>
              <p className="text-slate-400 mb-3">
                {runtime} • {genre}
              </p>

              {/* Days indicator removed; showtimes now rendered as time pills */}
            </div>

            {/* IMDb Rating */}
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800/50 border border-slate-700/50 w-fit">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span className="text-xs text-slate-300">{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Right: Formats and Showtimes */}
        <div className="flex-1">
          {/* Format tabs */}
          <div className="flex gap-2 mb-4">
            {formats.map((format) => (
              <FormatTag
                key={format.format}
                label={format.format}
                isActive={activeFormat === format.format}
                onClick={() => setActiveFormat(format.format)}
                theme={theme}
              />
            ))}
          </div>

          {/* Time pills */}
          <div className="flex flex-wrap gap-3">
            {formats
              .find((f) => f.format === activeFormat)
              ?.times.map((showtime) => {
                const timeKey = `${activeFormat}-${showtime.time}`;
                return (
                  <TimePill
                    key={timeKey}
                    time={showtime.time}
                    isActive={selectedTime === timeKey}
                    isSoldOut={!showtime.available}
                    onClick={() => handleTimeClick(activeFormat, showtime.time)}
                    screeningId={showtime.screeningId}
                    theme={theme}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
