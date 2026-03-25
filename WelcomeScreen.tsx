import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 relative overflow-hidden">
      {/* Floating decorative bubbles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-20"
          style={{
            width: 40 + i * 30,
            height: 40 + i * 30,
            background: `hsl(${[340, 200, 280, 150, 45, 25][i]} 80% 75%)`,
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}

      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
      >
        <motion.div
          className="mx-auto mb-8 w-28 h-28 rounded-3xl gradient-fun flex items-center justify-center shadow-playful"
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Camera className="w-14 h-14 text-primary-foreground" />
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-4 tracking-tight">
          Say Cheese! 📸
        </h1>
        <p className="text-xl font-body text-muted-foreground mb-12 max-w-md mx-auto">
          Strike a pose, pick your style, and take home unforgettable memories!
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="fun"
            size="xl"
            onClick={onStart}
            className="animate-pulse-glow"
          >
            <Camera className="w-7 h-7" />
            Start Photo Session
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
