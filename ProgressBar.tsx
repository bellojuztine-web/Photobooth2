import { motion } from "framer-motion";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export function ProgressBar({ currentStep, totalSteps, labels }: ProgressBarProps) {
  if (currentStep === 0 || currentStep === totalSteps - 1) return null;

  const progress = ((currentStep) / (totalSteps - 2)) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-6 pt-4 pb-2">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-body font-semibold text-muted-foreground">
            Step {currentStep} of {totalSteps - 2}
          </span>
          <span className="text-sm font-display font-medium text-primary">
            {labels[currentStep]}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full gradient-fun rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
          />
        </div>
      </div>
    </div>
  );
}
