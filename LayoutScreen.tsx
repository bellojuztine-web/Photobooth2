import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import type { PhotoLayout } from "@/hooks/usePhotobooth";

interface LayoutScreenProps {
  selected: PhotoLayout;
  onSelect: (layout: PhotoLayout) => void;
  onNext: () => void;
}

const layouts: { id: PhotoLayout; label: string; icon: React.ReactNode; desc: string }[] = [
  {
    id: "1x1",
    label: "Single",
    desc: "1 photo",
    icon: (
      <div className="w-full h-full rounded-xl bg-primary/20 border-2 border-primary/40" />
    ),
  },
  {
    id: "2x1",
    label: "Duo",
    desc: "2 photos",
    icon: (
      <div className="w-full h-full grid grid-cols-2 gap-1">
        <div className="rounded-lg bg-secondary/40 border-2 border-secondary/60" />
        <div className="rounded-lg bg-secondary/40 border-2 border-secondary/60" />
      </div>
    ),
  },
  {
    id: "2x2",
    label: "Classic",
    desc: "4 photos",
    icon: (
      <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg bg-accent/30 border-2 border-accent/50" />
        ))}
      </div>
    ),
  },
  {
    id: "strip",
    label: "Strip",
    desc: "3 photos",
    icon: (
      <div className="w-full h-full grid grid-rows-3 gap-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-lg bg-pastel-yellow/50 border-2 border-pastel-yellow" />
        ))}
      </div>
    ),
  },
];

export function LayoutScreen({ selected, onSelect, onNext }: LayoutScreenProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen px-6 pt-20"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
    >
      <h2 className="text-4xl font-display font-bold text-foreground mb-2">Choose Your Layout</h2>
      <p className="text-muted-foreground font-body mb-10">How many photos do you want?</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl w-full mb-12">
        {layouts.map((layout) => (
          <motion.button
            key={layout.id}
            onClick={() => onSelect(layout.id)}
            className={`p-4 rounded-2xl border-3 transition-all ${
              selected === layout.id
                ? "border-primary bg-primary/10 shadow-playful"
                : "border-border bg-card shadow-card hover:border-primary/40"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-full aspect-square mb-3 p-2">{layout.icon}</div>
            <p className="font-display font-semibold text-foreground">{layout.label}</p>
            <p className="text-sm text-muted-foreground font-body">{layout.desc}</p>
          </motion.button>
        ))}
      </div>

      <Button variant="fun" size="lg" onClick={onNext}>
        Next <ChevronRight className="w-5 h-5" />
      </Button>
    </motion.div>
  );
}
