import { motion } from "motion/react";
import { useState } from "react";
import { Mail, Lock, LogIn, ChevronLeft } from "lucide-react";
import { useLogin } from "../../hooks/useLogin";

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

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

  const { login, loading, error: loginError } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    try {
      await login({ email, password });
      onNavigate("");
    } catch (err) {
      // error stored in hook; leave UI to render it
      // eslint-disable-next-line no-console
      console.error("Login failed", err);
    }
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
        <div className="mb-6">
          <motion.button
            onClick={() => window.history.back()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 text-slate-400 hover:text-white focus:outline-none"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </motion.button>
        </div>
        {/* Card */}
        <div className="bg-black/60 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.35, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
              className="inline-flex items-center justify-center mb-4"
            >
              <div className={`p-4 rounded-full bg-linear-to-br ${colors.primary} ${colors.glow}`}>
                <LogIn className="w-8 h-8 text-black" />
              </div>
            </motion.div>
            <h1 className="text-white mb-2">Welcome Back</h1>
            <p className="text-slate-400 text-sm">Sign in to continue your journey</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {loginError && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mb-2"
              >
                {((loginError as any)?.data && ((loginError as any).data.message || JSON.stringify((loginError as any).data))) || (loginError as any).message || "Login failed"}
              </motion.p>
            )}
            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-slate-300 text-sm font-light mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  placeholder="you@example.com"
                  className={`w-full bg-slate-900/50 border ${errors.email ? 'border-red-500/50' : 'border-slate-700'} ${colors.focus} rounded-lg px-12 py-3 text-white placeholder:text-slate-600 transition-all duration-300 ${colors.hover} focus:outline-none focus:ring-2 ring-offset-0`}
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs mt-2"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-slate-300 text-sm font-light mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  placeholder="••••••••"
                  className={`w-full bg-slate-900/50 border ${errors.password ? 'border-red-500/50' : 'border-slate-700'} ${colors.focus} rounded-lg px-12 py-3 text-white placeholder:text-slate-600 transition-all duration-300 ${colors.hover} focus:outline-none focus:ring-2 ring-offset-0`}
                />
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs mt-2"
                >
                  {errors.password}
                </motion.p>
              )}
              {/* Forgot password link */}
              <div className="flex justify-end mt-2">
                <motion.button
                  onClick={() => onNavigate("")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`${colors.link} font-medium transition-colors duration-200 focus:outline-none focus:underline text-sm`}
                >
                  Forgot Password?
                </motion.button>
              </div>
            </div>

            {/* Submit button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className={`w-full ${colors.button} ${colors.buttonGlow} text-black font-medium py-3.5 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 ${colors.focus} ring-offset-2 ring-offset-black ${loading ? 'opacity-60 pointer-events-none' : ''}`}
            >
              {loading ? "Signing In..." : "Sign In"}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black px-4 text-slate-500 tracking-wider">New to Epoch?</span>
            </div>
          </div>

          {/* Sign up link */}
          <div className="text-center">
            <p className="text-slate-400 text-sm">
              Don't have an account?{" "}
              <motion.button
                onClick={() => onNavigate("register")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`${colors.link} font-medium transition-colors duration-200 focus:outline-none focus:underline`}
              >
                Sign Up
              </motion.button>
            </p>
          </div>
        </div>

        {/* Footer text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.3 }}
          className="text-center text-slate-600 text-xs mt-6"
        >
          By continuing, you agree to Epoch's Terms of Service and Privacy Policy
        </motion.p>
      </motion.div>
    </div>
  );
}
