import { motion } from "motion/react";
import { CreditCard, Lock } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label";
import { useVerifyPaymentForm } from "../../hooks/useVerifyPaymentForm";

interface PaymentFormProps {
  theme?: "90s" | "2000s" | "modern" | "default";
  showEmailField?: boolean;
  onPay?: () => void;
  isProcessing?: boolean;
}

export function PaymentForm({
  theme = "default",
  showEmailField = false,
  onPay,
  isProcessing = false,
}: PaymentFormProps) {
  const colors = {
    accent: "text-[var(--theme-accent)]",
    border: "focus:border-[var(--theme-button-bg)] focus-visible:ring-[color:var(--theme-glow)]",
    button: "bg-[var(--theme-button-bg)] hover:bg-[var(--theme-button-hover)] text-black",
    glow: "hover:shadow-[0_8px_24px_var(--theme-glow)]",
  };
  const { formData, errors, isFormValid, handleChange, handleBlur, handlePayClick } = useVerifyPaymentForm({
    showEmailField,
    onPay,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      data-theme={theme}
      className="bg-black/40 border border-slate-700/50 rounded-lg p-6 space-y-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <CreditCard className={`w-5 h-5 ${colors.accent}`} />
        <h3 className="text-white">Payment Details</h3>
      </div>

      <div className="space-y-4">
        {/* Email (for guests) */}
        {showEmailField && (
          <div>
            <Label htmlFor="email" className="text-slate-400">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              aria-invalid={!!errors.email}
              className={`bg-slate-900/50 border-slate-700 text-slate-200 ${colors.border}`}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>
        )}

        {/* Name on card */}
        <div>
          <Label htmlFor="name" className="text-slate-400">
            Name on Card
          </Label>
          <Input
            id="name"
            name="cc-name"
            autoComplete="cc-name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            aria-invalid={!!errors.name}
            className={`bg-slate-900/50 border-slate-700 text-slate-200 ${colors.border}`}
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Card number */}
        <div>
          <Label htmlFor="cardNumber" className="text-slate-400">
            Card Number
          </Label>
          <Input
            id="cardNumber"
            name="cc-number"
            autoComplete="cc-number"
            inputMode="numeric"
            value={formData.cardNumber}
            onChange={(e) => handleChange("cardNumber", e.target.value)}
            onBlur={() => handleBlur("cardNumber")}
            aria-invalid={!!errors.cardNumber}
            className={`bg-slate-900/50 border-slate-700 text-slate-200 ${colors.border}`}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
          />
          {errors.cardNumber && (
            <p className="text-red-400 text-sm mt-1">{errors.cardNumber}</p>
          )}
        </div>

        {/* Expiry and CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expiry" className="text-slate-400">
              Expiry Date
            </Label>
            <Input
              id="expiry"
              name="cc-exp"
              autoComplete="cc-exp"
              inputMode="numeric"
              value={formData.expiry}
              onChange={(e) => handleChange("expiry", e.target.value)}
              onBlur={() => handleBlur("expiry")}
              aria-invalid={!!errors.expiry}
              className={`bg-slate-900/50 border-slate-700 text-slate-200 ${colors.border}`}
              placeholder="MM/YY"
              maxLength={5}
            />
            {errors.expiry && (
              <p className="text-red-400 text-sm mt-1">{errors.expiry}</p>
            )}
          </div>
          <div>
            <Label htmlFor="cvc" className="text-slate-400">
              CVC
            </Label>
            <Input
              id="cvc"
              name="cc-csc"
              autoComplete="cc-csc"
              inputMode="numeric"
              value={formData.cvc}
              onChange={(e) => handleChange("cvc", e.target.value)}
              onBlur={() => handleBlur("cvc")}
              aria-invalid={!!errors.cvc}
              className={`bg-slate-900/50 border-slate-700 text-slate-200 ${colors.border}`}
              placeholder="123"
              maxLength={4}
            />
            {errors.cvc && (
              <p className="text-red-400 text-sm mt-1">{errors.cvc}</p>
            )}
          </div>
        </div>

        {/* Country and ZIP */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="country" className="text-slate-400">
              Country
            </Label>
            <Input
              id="country"
              name="country"
              autoComplete="country-name"
              value={formData.country}
              onChange={(e) => handleChange("country", e.target.value)}
              onBlur={() => handleBlur("country")}
              aria-invalid={!!errors.country}
              className={`bg-slate-900/50 border-slate-700 text-slate-200 ${colors.border}`}
              placeholder="United States"
            />
            {errors.country && (
              <p className="text-red-400 text-sm mt-1">{errors.country}</p>
            )}
          </div>
          <div>
            <Label htmlFor="zip" className="text-slate-400">
              ZIP Code
            </Label>
            <Input
              id="zip"
              name="postal-code"
              autoComplete="postal-code"
              value={formData.zip}
              onChange={(e) => handleChange("zip", e.target.value)}
              onBlur={() => handleBlur("zip")}
              aria-invalid={!!errors.zip}
              className={`bg-slate-900/50 border-slate-700 text-slate-200 ${colors.border}`}
              placeholder="12345"
            />
            {errors.zip && (
              <p className="text-red-400 text-sm mt-1">{errors.zip}</p>
            )}
          </div>
        </div>
      </div>

      {onPay && (
        <div className="pt-2">
          <Button
            onClick={handlePayClick}
            disabled={isProcessing || !isFormValid}
            className={`
              w-full ${colors.button} ${colors.glow}
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-black border-t-transparent rounded-full"
                />
                Processing...
              </span>
            ) : (
              "Pay Now"
            )}
          </Button>
        </div>
      )}

      {/* Security note */}
      <div className="flex items-start gap-2 pt-4 border-t border-slate-700/50">
        <Lock className="w-4 h-4 text-slate-500 mt-0.5" />
        <p className="text-slate-500 text-sm">
          Your payment information is encrypted and secure.
        </p>
      </div>
    </motion.div>
  );
}
