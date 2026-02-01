import { useState } from "react";
import { motion } from "motion/react";
import { CreditCard, Lock } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";

interface PaymentFormProps {
  theme?: "90s" | "2000s" | "modern" | "default";
  showEmailField?: boolean;
}

export function PaymentForm({ theme = "default", showEmailField = false }: PaymentFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    email: "",
    country: "",
    zip: "",
    saveCard: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          accent: "text-amber-500",
          border: "focus:border-amber-600",
        };
      case "2000s":
        return {
          accent: "text-blue-400",
          border: "focus:border-blue-500",
        };
      case "modern":
        return {
          accent: "text-slate-300",
          border: "focus:border-slate-400",
        };
      default:
        return {
          accent: "text-amber-500",
          border: "focus:border-amber-600",
        };
    }
  };

  const colors = getThemeColors();

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user types
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
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
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
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
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
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
            value={formData.cardNumber}
            onChange={(e) => handleChange("cardNumber", e.target.value)}
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
              value={formData.expiry}
              onChange={(e) => handleChange("expiry", e.target.value)}
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
              value={formData.cvc}
              onChange={(e) => handleChange("cvc", e.target.value)}
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
              value={formData.country}
              onChange={(e) => handleChange("country", e.target.value)}
              className={`bg-slate-900/50 border-slate-700 text-slate-200 ${colors.border}`}
              placeholder="United States"
            />
          </div>
          <div>
            <Label htmlFor="zip" className="text-slate-400">
              ZIP Code
            </Label>
            <Input
              id="zip"
              value={formData.zip}
              onChange={(e) => handleChange("zip", e.target.value)}
              className={`bg-slate-900/50 border-slate-700 text-slate-200 ${colors.border}`}
              placeholder="12345"
            />
          </div>
        </div>

        {/* Save card checkbox */}
        <div className="flex items-center gap-2 pt-2">
          <Checkbox
            id="saveCard"
            checked={formData.saveCard}
            onCheckedChange={(checked) => handleChange("saveCard", checked as boolean)}
          />
          <Label htmlFor="saveCard" className="text-slate-400 cursor-pointer">
            Save card for future purchases
          </Label>
        </div>
      </div>

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
