import { motion } from "motion/react";
import { Lock, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useResetPassword } from "../../hooks/useResetPassword";
import { motion as m } from "motion/react";

interface ResetPasswordPageProps {
  onNavigate?: (page: string) => void;
}

export function ResetPasswordPage({ onNavigate }: ResetPasswordPageProps) {
  const THEME = {
    primary: "from-amber-600 to-amber-500",
    border: "border-amber-500/50",
    glow: "shadow-[0_0_24px_rgba(245,158,11,0.3)]",
    hover: "hover:border-amber-500 hover:shadow-[0_0_16px_rgba(245,158,11,0.4)]",
    button: "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-600",
    buttonGlow: "shadow-[0_0_24px_rgba(245,158,11,0.4)] hover:shadow-[0_0_32px_rgba(245,158,11,0.6)]",
    focus: "focus:border-amber-500 focus:ring-amber-500/50",
    link: "text-amber-500 hover:text-amber-400",
  };

  const colors = THEME;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { resetPassword, loading, error: hookError, success } = useResetPassword();

  const location = useLocation();
  const { token } = useParams();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email") || "";

  // Password requirements
  const requirements = [
    { key: "length", text: "Must be at least 8 characters long", test: (pw: string) => pw.length >= 8 },
    { key: "upper", text: "Must contain an uppercase letter", test: (pw: string) => /[A-Z]/.test(pw) },
    { key: "lower", text: "Must contain a lowercase letter", test: (pw: string) => /[a-z]/.test(pw) },
    { key: "symbol", text: "Must contain a symbol", test: (pw: string) => /[^A-Za-z0-9]/.test(pw) },
    { key: "number", text: "Must contain a number", test: (pw: string) => /[0-9]/.test(pw) },
  ];
  const unmetRequirements = requirements.filter(r => !r.test(password));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (unmetRequirements.length > 0) {
      setError("Password does not meet all requirements.");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    await resetPassword({ token: token || "", email, password, password_confirmation: confirmPassword });
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-black via-slate-950 to-black flex items-center justify-center px-6 py-20">
      {/* Background ambient glow */}
      <div className={`fixed top-1/4 left-1/4 w-96 h-96 bg-linear-to-br ${colors.primary} opacity-10 rounded-full blur-[120px] pointer-events-none`} />
      <div className={`fixed bottom-1/4 right-1/4 w-96 h-96 bg-linear-to-br ${colors.primary} opacity-10 rounded-full blur-[120px] pointer-events-none`} />

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
          <h2 className="text-2xl font-bold mb-6 text-white">Reset Password</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-2">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-amber-500" size={20} />
              <input
                type="password"
                className={`w-full pl-10 pr-4 py-2 rounded-lg bg-black/60 border border-slate-700 focus:outline-none focus:ring-2 ring-offset-0 transition-all duration-300 hover:border-amber-500 focus:border-amber-500 text-white placeholder:text-slate-600`}
                autoComplete="new-password"
                placeholder="Enter new password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loading || success}
              />
            </div>
            <ul className="mt-2 ml-2 text-xs list-disc">
              {requirements.map(r => (
                <m.li
                  key={r.key}
                  initial={{ color: "#94a3b8" }}
                  animate={{ color: r.test(password) ? "#22c55e" : "#94a3b8" }}
                  transition={{ duration: 0.3 }}
                  className={r.test(password) ? "font-semibold" : ""}
                >
                  {r.text}
                </m.li>
              ))}
            </ul>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-amber-500" size={20} />
              <input
                type="password"
                className={`w-full pl-10 pr-4 py-2 rounded-lg bg-black/60 border border-slate-700 focus:outline-none focus:ring-2 ring-offset-0 transition-all duration-300 hover:border-amber-500 focus:border-amber-500 text-white placeholder:text-slate-600`}
                autoComplete="new-password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                disabled={loading || success}
              />
            </div>
            {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
            {hookError && <div className="text-red-500 text-xs mt-1">{hookError}</div>}
            {success && <div className="text-green-500 text-xs mt-1">Your password has been reset successfully.</div>}
          </div>
          {!success && (
            <button
              type="submit"
              className={`w-full mt-4 py-2 rounded-lg font-semibold text-white ${colors.button} ${colors.buttonGlow}`}
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          )}
        </form>
      </motion.div>
    </div>
  );
}
