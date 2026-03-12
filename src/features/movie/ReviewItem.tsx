import { motion } from "motion/react";
import { StarRating } from "./StarRating.tsx";
import { Trash } from "lucide-react";
import { useDeleteComment } from "../../hooks/useDeleteComment";

interface ReviewItemProps {
  username: string;
  avatar?: string;
  rating: number;
  date: string;
  text: string;
  theme?: "90s" | "2000s" | "modern" | "default";
  userId?: string | number;
  commentId?: string | number;
  movie_id?: string | number;
}

export function ReviewItem({ 
  username, 
  avatar, 
  rating, 
  date, 
  text, 
  theme = "default",
  userId,
  commentId,
  movie_id,

}: ReviewItemProps) {
  // Minimal: get current user id from localStorage
  let isOwn = false;
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem("epoch_user") : null;
    if (raw) {
      const me = JSON.parse(raw);
      const myId = me?.data?.id ?? me?.id;
      isOwn = myId && userId && String(myId) === String(userId);
    }
  } catch {}
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
  const { remove, loading } = useDeleteComment();

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
        <div className="flex-1 min-w-0 relative">
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
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-sm">{date}</span>
              {isOwn && commentId && (
                <button
                  title="Delete review"
                  className="ml-2 cursor-pointer text-red-500 hover:text-red-700 flex items-center disabled:opacity-50"
                  onClick={async () => {
                    if (window.confirm("Are you sure you want to delete this review?")) {
                      await remove(commentId, movie_id!);
                      window.location.reload();
                    }
                  }}
                  disabled={loading}
                  type="button"
                >
                  <Trash className="w-4 h-4" />
                </button>
              )}
            </div>
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
