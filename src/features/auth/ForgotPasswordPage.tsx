import { motion } from "motion/react";
import { ChevronLeft, Mail } from "lucide-react";
import { useState } from "react";
import { useSendResetEmail } from "../../hooks/useSendResetEmail";

interface ForgotPasswordPageProps {
  onNavigate?: (page: string) => void;
}

export function ForgotPasswordPage({onNavigate}: ForgotPasswordPageProps) {
  const THEME = {
    primary: "from-amber-600 to-amber-500",
    border: "border-amber-500/50",
    glow: "shadow-[0_0_24px_rgba(245,158,11,0.3)]",
    hover:
      "hover:border-amber-500 hover:shadow-[0_0_16px_rgba(245,158,11,0.4)]",
    button:
      "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-600",
    buttonGlow:
      "shadow-[0_0_24px_rgba(245,158,11,0.4)] hover:shadow-[0_0_32px_rgba(245,158,11,0.6)]",
    focus: "focus:border-amber-500 focus:ring-amber-500/50",
    link: "text-amber-500 hover:text-amber-400",
  };

  const colors = THEME;

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { sendResetEmail, loading, error: hookError, success } = useSendResetEmail();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError("Email is required");
      return;
    }
    await sendResetEmail(email);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-black via-slate-950 to-black flex items-center justify-center px-6 py-20">
      {/* Background ambient glow */}
      <div
        className={`fixed top-1/4 left-1/4 w-96 h-96 bg-linear-to-br ${colors.primary} opacity-10 rounded-full blur-[120px] pointer-events-none`}
      />
      <div
        className={`fixed bottom-1/4 right-1/4 w-96 h-96 bg-linear-to-br ${colors.primary} opacity-10 rounded-full blur-[120px] pointer-events-none`}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
        className="w-full max-w-md relative z-10"
      >
         <button
          className={`mb-6 flex items-center gap-2 text-sm ${colors.link}`}
          onClick={() => onNavigate && onNavigate("")}
        >
          <ChevronLeft size={18} /> Back to Home
        </button>
        <form
          onSubmit={handleSubmit}
          className="bg-black/60 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 md:p-10"
        >
          <h2 className="text-md font-bold mb-6 text-white">
            Forgot your password? No worries.
             <br /> <br />
            Enter your email address and we'll
            send you a link to create a new one.
          </h2>
          <div className="mb-4">
            <div className="relative">
              <Mail
                className="absolute left-3 top-3 text-amber-500"
                size={20}
              />
              <input
                type="email"
                className={`w-full pl-10 pr-4 py-2 rounded-lg bg-black/60 border border-slate-700 focus:outline-none focus:ring-2 ring-offset-0 transition-all duration-300 hover:border-amber-500 focus:border-amber-500 text-white placeholder:text-slate-600`}
                autoComplete="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading || success}
              />
            </div>
            {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
            {hookError && <div className="text-red-500 text-xs mt-1">{hookError}</div>}
            {success && <div className="text-green-500 text-xs mt-1">Reset email sent! Check your inbox.</div>}
          </div>
          {!success && (
            <button
              type="submit"
              className={`w-full mt-4 py-2 rounded-lg font-semibold text-white ${colors.button} ${colors.buttonGlow}`}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Email"}
            </button>
          )}
        </form>
      </motion.div>
    </div>
  );
}
