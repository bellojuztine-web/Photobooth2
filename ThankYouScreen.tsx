import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ThankYouScreenProps {
  onRestart: () => void;
}

const confettiColors = [
  "hsl(340, 80%, 70%)",
  "hsl(200, 80%, 70%)",
  "hsl(280, 70%, 65%)",
  "hsl(45, 90%, 75%)",
  "hsl(150, 60%, 70%)",
  "hsl(25, 90%, 75%)",
];

export function ThankYouScreen({ onRestart }: ThankYouScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 relative overflow-hidden">
      {/* Confetti */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            background: confettiColors[i % confettiColors.length],
            left: `${Math.random() * 100}%`,
            top: -20,
          }}
          animate={{
            y: [0, window.innerHeight + 100],
            rotate: [0, 720],
            opacity: [1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeIn",
          }}
        />
      ))}

      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <motion.span
          className="text-8xl block mb-6"
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        >
          🎉
        </motion.span>

        <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-4">
          Thank You!
        </h1>
        <p className="text-xl font-body text-muted-foreground mb-12 max-w-md mx-auto">
          We hope you had an amazing time. Come back for more fun!
        </p>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="fun" size="xl" onClick={onRestart}>
            <RefreshCw className="w-6 h-6" /> Start Over
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
