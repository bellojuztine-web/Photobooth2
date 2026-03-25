import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface MessageScreenProps {
  message: string;
  onChangeMessage: (msg: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function MessageScreen({ message, onChangeMessage, onNext, onBack }: MessageScreenProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen px-6 pt-20"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
    >
      <h2 className="text-4xl font-display font-bold text-foreground mb-2">Add a Message 💬</h2>
      <p className="text-muted-foreground font-body mb-10">Write something fun or memorable!</p>

      <div className="w-full max-w-md mb-10">
        <textarea
          value={message}
          onChange={(e) => onChangeMessage(e.target.value)}
          placeholder="Having the best time! 🎉"
          maxLength={100}
          className="w-full h-32 p-4 rounded-2xl border-2 border-border bg-card text-foreground font-body text-lg resize-none focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-card placeholder:text-muted-foreground"
        />
        <p className="text-right text-sm text-muted-foreground font-body mt-2">
          {message.length}/100
        </p>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" size="lg" onClick={onBack}>
          <ChevronLeft className="w-5 h-5" /> Back
        </Button>
        <Button variant="fun" size="lg" onClick={onNext}>
          {message.trim() ? "Next" : "Skip"} <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
}
