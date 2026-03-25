import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, RotateCcw } from "lucide-react";
import type { PhotoLayout } from "@/hooks/usePhotobooth";

interface PreviewScreenProps {
  photos: string[];
  layout: PhotoLayout;
  onNext: () => void;
  onRetake: () => void;
}

const layoutGridClass: Record<PhotoLayout, string> = {
  "1x1": "grid-cols-1 max-w-xs",
  "2x1": "grid-cols-2 max-w-md",
  "2x2": "grid-cols-2 max-w-md",
  "strip": "grid-cols-1 max-w-[200px]",
};

export function PreviewScreen({ photos, layout, onNext, onRetake }: PreviewScreenProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen px-6 pt-20"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
    >
      <h2 className="text-4xl font-display font-bold text-foreground mb-2">Looking Great! ✨</h2>
      <p className="text-muted-foreground font-body mb-8">Here are your photos</p>

      <div
        className={`grid gap-2 w-full mx-auto mb-10 ${layoutGridClass[layout]}`}
      >
        {photos.map((photo, i) => (
          <motion.div
            key={i}
            className="rounded-2xl overflow-hidden shadow-playful border-2 border-card"
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: i * 0.15, type: "spring", stiffness: 200, damping: 20 }}
          >
            <img src={photo} alt={`Photo ${i + 1}`} className="w-full aspect-[4/3] object-cover" />
          </motion.div>
        ))}
      </div>

      <div className="flex gap-4">
        <Button variant="outline" size="lg" onClick={onRetake}>
          <RotateCcw className="w-5 h-5" /> Retake
        </Button>
        <Button variant="fun" size="lg" onClick={onNext}>
          Decorate <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
}
