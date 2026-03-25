import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import type { PhotoFilter } from "@/hooks/usePhotobooth";

interface FilterScreenProps {
  selected: PhotoFilter;
  onSelect: (filter: PhotoFilter) => void;
  onNext: () => void;
  onBack: () => void;
}

const filters: { id: PhotoFilter; label: string; css: string; emoji: string }[] = [
  { id: "none", label: "Normal", css: "", emoji: "🌟" },
  { id: "grayscale", label: "B&W", css: "grayscale(100%)", emoji: "🖤" },
  { id: "sepia", label: "Sepia", css: "sepia(80%)", emoji: "📜" },
  { id: "warm", label: "Warm", css: "saturate(130%) hue-rotate(-10deg)", emoji: "☀️" },
  { id: "cool", label: "Cool", css: "saturate(110%) hue-rotate(20deg) brightness(105%)", emoji: "❄️" },
  { id: "vintage", label: "Vintage", css: "sepia(30%) contrast(110%) brightness(90%)", emoji: "📷" },
];

export function FilterScreen({ selected, onSelect, onNext, onBack }: FilterScreenProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen px-6 pt-20"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
    >
      <h2 className="text-4xl font-display font-bold text-foreground mb-2">Pick a Filter</h2>
      <p className="text-muted-foreground font-body mb-10">Add some flair to your photos!</p>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 max-w-2xl w-full mb-12">
        {filters.map((filter) => (
          <motion.button
            key={filter.id}
            onClick={() => onSelect(filter.id)}
            className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center ${
              selected === filter.id
                ? "border-primary bg-primary/10 shadow-playful"
                : "border-border bg-card shadow-card hover:border-primary/40"
            }`}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            <div
              className="w-16 h-16 rounded-xl mb-2 bg-gradient-to-br from-pastel-pink to-pastel-blue flex items-center justify-center text-2xl"
              style={{ filter: filter.css }}
            >
              {filter.emoji}
            </div>
            <p className="text-sm font-display font-medium text-foreground">{filter.label}</p>
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
