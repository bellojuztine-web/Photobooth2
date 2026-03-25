import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface DecorateScreenProps {
  selectedFrame: string | null;
  onSelectFrame: (frame: string | null) => void;
  onNext: () => void;
  onBack: () => void;
}

const frames = [
  { id: null, label: "None", emoji: "✖️" },
  { id: "hearts", label: "Hearts", emoji: "💕" },
  { id: "stars", label: "Stars", emoji: "⭐" },
  { id: "flowers", label: "Flowers", emoji: "🌸" },
  { id: "party", label: "Party", emoji: "🎉" },
  { id: "rainbow", label: "Rainbow", emoji: "🌈" },
];

export function DecorateScreen({ selectedFrame, onSelectFrame, onNext, onBack }: DecorateScreenProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen px-6 pt-20"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
    >
      <h2 className="text-4xl font-display font-bold text-foreground mb-2">Add Some Fun! 🎨</h2>
      <p className="text-muted-foreground font-body mb-10">Choose a frame or sticker theme</p>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 max-w-2xl w-full mb-12">
        {frames.map((frame) => (
          <motion.button
            key={frame.id ?? "none"}
            onClick={() => onSelectFrame(frame.id)}
            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center ${
              selectedFrame === frame.id
                ? "border-primary bg-primary/10 shadow-playful"
                : "border-border bg-card shadow-card hover:border-primary/40"
            }`}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-3xl mb-2">{frame.emoji}</span>
            <span className="text-sm font-display font-medium text-foreground">{frame.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="flex gap-4">
        <Button variant="outline" size="lg" onClick={onBack}>
          <ChevronLeft className="w-5 h-5" /> Back
        </Button>
        <Button variant="fun" size="lg" onClick={onNext}>
          Next <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
}
