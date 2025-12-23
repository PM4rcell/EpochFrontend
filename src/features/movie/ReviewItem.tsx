import { motion } from "motion/react";
import { StarRating } from "./StarRating.tsx";

interface ReviewItemProps {
  username: string;
  avatar?: string;
  rating: number;
  date: string;
  text: string;
  theme?: "90s" | "2000s" | "modern" | "default";
}

export function ReviewItem({ 
  username, 
  avatar, 
  rating, 
  date, 
  text, 
  theme = "default" 
}: ReviewItemProps) {
  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          border: "border-amber-600/10",
          avatarBg: "bg-amber-600/20",
        };
      case "2000s":
        return {
          border: "border-blue-500/10",
          avatarBg: "bg-blue-500/20",
        };
      case "modern":
        return {
          border: "border-slate-400/10",
          avatarBg: "bg-slate-400/20",
        };
      default:
        return {
          border: "border-amber-600/10",
          avatarBg: "bg-amber-600/20",
        };
    }
  };

  const colors = getThemeColors();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className={`
        bg-black/40 border rounded-xl p-5
        ${colors.border}
        shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]
      `}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className={`
          shrink-0 w-10 h-10 rounded-full overflow-hidden border border-slate-700/50
          ${colors.avatarBg}
          flex items-center justify-center
        `}>
          {avatar ? (
            <img src={avatar} alt={username} className="w-full h-full object-cover" />
          ) : (
            <span className="text-slate-400 uppercase">
              {username.charAt(0)}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Username and Rating Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <div className="flex items-center gap-3">
              <h4 className="text-slate-200">{username}</h4>
              <StarRating 
                rating={rating} 
                readonly 
                size="sm" 
                theme={theme}
              />
            </div>
            <span className="text-slate-500 text-sm">{date}</span>
          </div>

          {/* Review Text */}
          <p className="text-slate-300 leading-relaxed">
            {text}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
