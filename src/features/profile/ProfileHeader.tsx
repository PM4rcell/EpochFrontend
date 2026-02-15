import { motion } from "motion/react";
import { Edit2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { ImageWithFallback } from "../../components/ImageWithFallback/ImageWithFallback";

interface ProfileHeaderProps {
  theme?: "90s" | "2000s" | "modern" | "default";
  title?: string;
  subtitle?: string;
  avatar?: string | null;
  userId?: string | number | null;
}

export function ProfileHeader({ theme = "default", title, subtitle, avatar, userId }: ProfileHeaderProps) {
  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          accent: "text-amber-500",
          border: "border-amber-500/30",
          glow: "shadow-[0_0_20px_rgba(245,158,11,0.15)]",
          badgeBorder: "border-amber-500/50",
          badgeText: "text-amber-400",
          buttonHover: "hover:bg-amber-500/10 hover:border-amber-500/50",
        };
      case "2000s":
        return {
          accent: "text-blue-400",
          border: "border-blue-400/30",
          glow: "shadow-[0_0_20px_rgba(96,165,250,0.15)]",
          badgeBorder: "border-blue-400/50",
          badgeText: "text-blue-300",
          buttonHover: "hover:bg-blue-400/10 hover:border-blue-400/50",
        };
      case "modern":
        return {
          accent: "text-slate-300",
          border: "border-slate-400/30",
          glow: "shadow-[0_0_20px_rgba(226,232,240,0.15)]",
          badgeBorder: "border-slate-400/50",
          badgeText: "text-slate-200",
          buttonHover: "hover:bg-slate-400/10 hover:border-slate-400/50",
        };
      default:
        return {
          accent: "text-amber-500",
          border: "border-amber-500/30",
          glow: "shadow-[0_0_20px_rgba(245,158,11,0.15)]",
          badgeBorder: "border-amber-500/50",
          badgeText: "text-amber-400",
          buttonHover: "hover:bg-amber-500/10 hover:border-amber-500/50",
        };
    }
  };

  const colors = getThemeColors();

  // Prefer explicit `avatar` prop, otherwise try to read a poster URL from persisted user
  let storedPosterUrl: string | null = null;
  try {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("epoch_user");
      if (raw) {
        const su = JSON.parse(raw);
        storedPosterUrl = su?.data?.poster?.url || su?.data?.poster_url || su?.poster?.url || su?.poster || null;
      }
    }
  } catch {
    storedPosterUrl = null;
  }
  const avatarSrc = avatar ?? storedPosterUrl ?? "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="relative mb-6 sm:mb-8 overflow-hidden rounded-2xl"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient
      -to-br from-slate-900/80 via-black/60 to-black/80 backdrop-blur-sm" />
      <div className={`absolute inset-0 ${colors.glow} opacity-50`} />

      {/* Content */}
      <div className="relative px-6 sm:px-8 py-6 sm:py-8 border border-slate-800/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          {/* Avatar */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className={`rounded-full p-1 bg-linear-to-br from-slate-800 to-slate-900 ${colors.border} border-2`}
          >
            <Avatar className="w-16 h-16 sm:w-24 sm:h-24">
              <ImageWithFallback src={avatarSrc} alt={title || "Profile"} className="aspect-square size-full" />
              <AvatarFallback className="bg-slate-800 text-slate-300">{(title || "").split(" ").filter(Boolean).map(s => s[0]).slice(0,2).join("") || "U"}</AvatarFallback>
            </Avatar>
          </motion.div>

          {/* User info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
              <h1 className="text-white truncate">{title || "Profile"}</h1>
            </div>
            {subtitle ? <p className="text-slate-400">{subtitle}</p> : null}
            {userId ? (
              <p className="text-slate-500 text-sm mt-1">
                User ID: <span className="text-slate-300">{userId}</span>
              </p>
            ) : null}
          </div>

          {/* Edit button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="outline"
              className={`border-slate-700 bg-black/40 backdrop-blur-sm text-slate-300 ${colors.buttonHover} transition-all duration-250`}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Edit Profile</span>
              <span className="sm:hidden">Edit</span>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
