import { useState } from "react";
import { motion } from "motion/react";
import { StarRating } from "./StarRating.tsx";
import { Button } from "../../components/ui/button";

interface AddReviewCardProps {
  onSubmit?: (rating: number, text: string) => void;
  onCancel?: () => void;
  theme?: "90s" | "2000s" | "modern" | "default";
}

export function AddReviewCard({ 
  onSubmit, 
  onCancel, 
  theme = "default" 
}: AddReviewCardProps) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");

  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          border: "border-amber-600/20",
          focusBorder: "focus:border-amber-500/50",
          focusRing: "focus:ring-amber-500/20",
          button: "bg-amber-600 hover:bg-amber-500 text-black",
          buttonGlow: "hover:shadow-[0_0_24px_rgba(245,158,11,0.4)]",
        };
      case "2000s":
        return {
          border: "border-blue-500/20",
          focusBorder: "focus:border-blue-400/50",
          focusRing: "focus:ring-blue-400/20",
          button: "bg-blue-500 hover:bg-blue-400 text-white",
          buttonGlow: "hover:shadow-[0_0_24px_rgba(96,165,250,0.4)]",
        };
      case "modern":
        return {
          border: "border-slate-400/20",
          focusBorder: "focus:border-slate-300/50",
          focusRing: "focus:ring-slate-300/20",
          button: "bg-slate-300 hover:bg-slate-200 text-black",
          buttonGlow: "hover:shadow-[0_0_24px_rgba(226,232,240,0.4)]",
        };
      default:
        return {
          border: "border-amber-600/20",
          focusBorder: "focus:border-amber-500/50",
          focusRing: "focus:ring-amber-500/20",
          button: "bg-amber-600 hover:bg-amber-500 text-black",
          buttonGlow: "hover:shadow-[0_0_24px_rgba(245,158,11,0.4)]",
        };
    }
  };

  const colors = getThemeColors();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0 && text.trim()) {
      onSubmit?.(rating, text);
      setRating(0);
      setText("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        bg-black/60 border rounded-xl p-6 mb-6
        ${colors.border}
        shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
      `}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-slate-200">Your review</h3>

        {/* Star Rating */}
        <div>
          <label className="text-slate-400 text-sm mb-2 block">Rating</label>
          <StarRating 
            rating={rating} 
            onChange={setRating} 
            size="lg" 
            theme={theme}
          />
        </div>

        {/* Text Area */}
        <div>
          <label className="text-slate-400 text-sm mb-2 block">Review</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your thoughts about this movie..."
            rows={4}
            className={`
              w-full px-4 py-3 rounded-lg
              bg-black/40 border text-slate-200 placeholder:text-slate-600
              ${colors.border} ${colors.focusBorder}
              focus:ring-2 ${colors.focusRing}
              transition-all duration-200
              resize-none
              focus:outline-none
            `}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={rating === 0 || !text.trim()}
            className={`
              ${colors.button} ${colors.buttonGlow}
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            Post review
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              className="text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </motion.div>
  );
}
