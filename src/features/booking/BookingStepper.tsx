import { motion } from "motion/react";
import { Check } from "lucide-react";

type Step = "seats" | "payment" | "tickets";

interface BookingStepperProps {
  activeStep: Step;
  completedSteps?: Step[];
  theme?: "90s" | "2000s" | "modern" | "default";
  onStepClick?: (step: Step) => void;
}

const steps = [
  { id: "seats" as Step, label: "Choose Your Place", number: 1 },
  { id: "payment" as Step, label: "Payment", number: 2 },
  { id: "tickets" as Step, label: "Done", number: 3 },
];

export function BookingStepper({ 
  activeStep, 
  completedSteps = [], 
  theme = "default",
  onStepClick 
}: BookingStepperProps) {
  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          active: "text-amber-500 border-amber-600",
          completed: "bg-amber-600 border-amber-600",
          inactive: "text-slate-400 border-slate-700",
          underline: "bg-gradient-to-r from-amber-600 to-amber-400",
        };
      case "2000s":
        return {
          active: "text-blue-400 border-blue-500",
          completed: "bg-blue-500 border-blue-500",
          inactive: "text-slate-400 border-slate-700",
          underline: "bg-gradient-to-r from-blue-500 to-blue-400",
        };
      case "modern":
        return {
          active: "text-slate-300 border-slate-400",
          completed: "bg-slate-400 border-slate-400",
          inactive: "text-slate-400 border-slate-700",
          underline: "bg-gradient-to-r from-slate-400 to-slate-300",
        };
      default:
        return {
          active: "text-amber-500 border-amber-600",
          completed: "bg-amber-600 border-amber-600",
          inactive: "text-slate-400 border-slate-700",
          underline: "bg-gradient-to-r from-amber-600 to-amber-400",
        };
    }
  };

  const colors = getThemeColors();

  const getStepState = (stepId: Step) => {
    if (completedSteps.includes(stepId)) return "completed";
    if (stepId === activeStep) return "active";
    return "inactive";
  };

  return (
    <div className="sticky top-16 z-40 h-17 bg-black/90 backdrop-blur-md border-b border-white/10 shadow-lg overflow-hidden">
      <div className="container mx-auto px-6 h-full">
        <div className="flex items-center justify-center md:justify-start gap-8 py-4 overflow-x-auto h-full">
          {steps.map((step, index) => {
            const state = getStepState(step.id);
            const isCompleted = state === "completed";
            const isActive = state === "active";
            const canClick = isCompleted || onStepClick;

            return (
              <div key={step.id} className="flex items-center gap-8">
                <motion.button
                  onClick={() => canClick && onStepClick?.(step.id)}
                  whileHover={canClick ? { scale: 1.02 } : {}}
                  className={`
                    flex items-center gap-3 relative
                    ${canClick ? "cursor-pointer" : "cursor-default"}
                    focus:outline-none focus:ring-2 focus:ring-slate-400/50 rounded px-2 py-1
                  `}
                  disabled={!canClick}
                >
                  {/* Step number/check */}
                  <div
                    className={`
                      w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm
                      transition-all duration-250
                      ${
                        isCompleted
                          ? `${colors.completed} text-black`
                          : isActive
                          ? `${colors.active} bg-transparent`
                          : `${colors.inactive} bg-transparent`
                      }
                    `}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span>{step.number}</span>
                    )}
                  </div>

                  {/* Step label */}
                  <span
                    className={`
                      text-sm whitespace-nowrap transition-colors duration-200
                      ${isActive ? colors.active : colors.inactive}
                    `}
                  >
                    {step.label}
                  </span>

                  {/* Active underline */}
                  {isActive && (
                    <motion.div
                      layoutId={`stepper-active-${theme}`}
                      className={`absolute -bottom-4 left-0 right-0 h-0.5 ${colors.underline}`}
                      transition={{ duration: 0.25, ease: [0.65, 0, 0.35, 1] }}
                    />
                  )}
                </motion.button>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div
                    className={`hidden md:block w-16 h-0.5 ${
                      completedSteps.includes(step.id)
                        ? colors.underline
                        : "bg-slate-700"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}