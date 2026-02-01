import { useState } from "react";
import { motion } from "motion/react";
import { Navbar } from "../../components/layout/Navbar";
import { BookingStepper } from "./BookingStepper";
import { PaymentForm } from "./PaymentForm";
import { OrderSummary } from "./OrderSummary";

interface PaymentPageProps {
  theme?: "90s" | "2000s" | "modern" | "default";
  onNavigate?: (page: any) => void;
  onBack?: () => void;
  onComplete?: () => void;
}

export function PaymentPage({
  theme = "default",
  onBack,
  onComplete,
}: PaymentPageProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const movieData = {
    title: "The Eternal Voyage",
    poster: "https://images.unsplash.com/photo-1574923930958-9b653a0e5148?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    backdrop: "https://images.unsplash.com/photo-1639306406821-c45e6cd384e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920",
    date: "Friday, November 8, 2025",
    time: "7:30 PM",
    format: "IMAX 3D",
    venue: "Epoch Cinema Downtown",
  };

  const selectedSeats = [
    { row: "D", number: 7, price: 15 },
    { row: "D", number: 8, price: 15 },
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      if (onComplete) {
        onComplete();
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-black via-slate-950 to-black">
      <Navbar theme={theme} activePage="screenings"/>

      {/* Hero Header - Fixed height, clipped, no pointer blocking */}
      <div className="relative h-40 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-
        to-b from-black/60 via-black/80 to-black" />
        <img
          src={movieData.backdrop}
          alt={movieData.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-6 pb-6">
            <h1 className="text-white pointer-events-auto">{movieData.title}</h1>
          </div>
        </div>
      </div>

      {/* Stepper - Constrained height */}
      <BookingStepper
        activeStep="payment"
        completedSteps={["seats"]}
        theme={theme}
      />

      {/* Main Content - Extra bottom padding on mobile */}
      <div className="container mx-auto px-6 py-8 pb-32 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
          {/* Left: Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PaymentForm theme={theme} showEmailField={true} />
          </motion.div>

          {/* Right: Order Summary */}
          <div>
            <OrderSummary
              posterUrl={movieData.poster}
              movieTitle={movieData.title}
              date={movieData.date}
              time={movieData.time}
              format={movieData.format}
              venue={movieData.venue}
              seats={selectedSeats}
              fees={2.5}
              taxes={0}
              onBack={onBack}
              onPay={handlePayment}
              theme={theme}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA - Fixed height, safe area */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-22 bg-black/90 backdrop-blur-md border-t border-white/10 p-4 z-50 pointer-events-auto overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-sm">Total</span>
          <span
            className={`
            ${
              theme === "90s"
                ? "text-amber-500"
                : theme === "2000s"
                ? "text-blue-400"
                : theme === "modern"
                ? "text-slate-300"
                : "text-amber-500"
            }
          `}
          >
            $32.50
          </span>
        </div>
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className={`
            w-full py-3 rounded-lg transition-all duration-200
            ${
              theme === "90s"
                ? "bg-amber-600 hover:bg-amber-500"
                : theme === "2000s"
                ? "bg-blue-500 hover:bg-blue-400"
                : theme === "modern"
                ? "bg-slate-300 hover:bg-slate-200"
                : "bg-amber-600 hover:bg-amber-500"
            }
            text-black
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isProcessing ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
}