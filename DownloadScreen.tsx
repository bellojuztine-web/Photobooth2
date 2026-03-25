import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, ChevronRight, Share2, QrCode, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import type { PhotoLayout } from "@/hooks/usePhotobooth";

interface DownloadScreenProps {
  photos: string[];
  layout: PhotoLayout;
  frame: string | null;
  message: string;
  onNext: () => void;
}

const frameEmojis: Record<string, string[]> = {
  hearts: ["💕", "❤️", "💖", "💗"],
  stars: ["⭐", "✨", "🌟", "💫"],
  flowers: ["🌸", "🌺", "🌷", "🌻"],
  party: ["🎉", "🎊", "🎈", "🥳"],
  rainbow: ["🌈", "🦄", "✨", "💜"],
};

export function DownloadScreen({ photos, layout, frame, message, onNext }: DownloadScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [compositeUrl, setCompositeUrl] = useState<string>("");
  const [blobUrl, setBlobUrl] = useState<string>("");
  const [showQR, setShowQR] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator.share === "function");
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const padding = 40;
    const gap = 10;
    const photoW = 300;
    const photoH = 225;

    let cols = 1, rows = 1;
    if (layout === "2x1") { cols = 2; rows = 1; }
    else if (layout === "2x2") { cols = 2; rows = 2; }
    else if (layout === "strip") { cols = 1; rows = 3; }

    const totalW = padding * 2 + cols * photoW + (cols - 1) * gap;
    const totalH = padding * 2 + rows * photoH + (rows - 1) * gap + (message ? 60 : 0);

    canvas.width = totalW;
    canvas.height = totalH;

    ctx.fillStyle = "#FFF5F9";
    ctx.roundRect(0, 0, totalW, totalH, 20);
    ctx.fill();

    const imgs = photos.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    Promise.all(imgs.map((img) => new Promise<void>((res) => {
      if (img.complete) { res(); return; }
      img.onload = () => res();
    }))).then(() => {
      imgs.forEach((img, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = padding + col * (photoW + gap);
        const y = padding + row * (photoH + gap);

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x, y, photoW, photoH, 12);
        ctx.clip();
        ctx.drawImage(img, x, y, photoW, photoH);
        ctx.restore();
      });

      if (frame && frameEmojis[frame]) {
        ctx.font = "28px sans-serif";
        const emojis = frameEmojis[frame];
        emojis.forEach((e, i) => {
          ctx.fillText(e, 8 + i * 30, 30);
          ctx.fillText(e, totalW - 120 + i * 30, totalH - 10);
        });
      }

      if (message) {
        ctx.font = "bold 20px sans-serif";
        ctx.fillStyle = "#6B21A8";
        ctx.textAlign = "center";
        ctx.fillText(message, totalW / 2, totalH - 20);
      }

      const dataUrl = canvas.toDataURL("image/png");
      setCompositeUrl(dataUrl);

      // Create blob URL for sharing
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setBlobUrl(url);
        }
      }, "image/png");
    });
  }, [photos, layout, frame, message]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.download = "photobooth.png";
    link.href = compositeUrl;
    link.click();
  };

  const handleShare = useCallback(async () => {
    if (!compositeUrl) return;
    try {
      const response = await fetch(compositeUrl);
      const blob = await response.blob();
      const file = new File([blob], "photobooth.png", { type: "image/png" });
      await navigator.share({
        title: "My Photobooth Photo 📸",
        text: "Check out my photobooth photos!",
        files: [file],
      });
    } catch {
      // User cancelled or share failed — fallback to download
      handleDownload();
    }
  }, [compositeUrl]);

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen px-6 pt-20 pb-10"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
    >
      <h2 className="text-4xl font-display font-bold text-foreground mb-2">Your Photo is Ready! 🎁</h2>
      <p className="text-muted-foreground font-body mb-8">Download, scan QR, or share your memories</p>

      <canvas ref={canvasRef} className="hidden" />

      {compositeUrl && (
        <motion.div
          className="rounded-3xl overflow-hidden shadow-playful border-4 border-card mb-8 max-w-md w-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <img src={compositeUrl} alt="Your photobooth result" className="w-full" />
        </motion.div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        <Button variant="fun" size="lg" onClick={handleDownload}>
          <Download className="w-5 h-5" /> Download
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => setShowQR(!showQR)}
          className={showQR ? "border-primary bg-primary/10" : ""}
        >
          <QrCode className="w-5 h-5" /> {showQR ? "Hide QR" : "QR Code"}
        </Button>
        {canShare && (
          <Button variant="secondary" size="lg" onClick={handleShare}>
            <Share2 className="w-5 h-5" /> Share
          </Button>
        )}
        <Button variant="secondary" size="lg" onClick={onNext}>
          Finish <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQR && blobUrl && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowQR(false)}
          >
            <motion.div
              className="bg-card rounded-3xl p-8 shadow-playful max-w-sm w-full text-center relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowQR(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-4">
                <span className="text-4xl">📱</span>
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                Scan to Download
              </h3>
              <p className="text-sm text-muted-foreground font-body mb-6">
                Point your phone camera at the QR code to save your photo
              </p>

              <div className="inline-block p-4 bg-background rounded-2xl shadow-card mb-4">
                <QRCodeSVG
                  value={blobUrl}
                  size={200}
                  bgColor="transparent"
                  fgColor="hsl(270, 40%, 20%)"
                  level="M"
                  includeMargin={false}
                />
              </div>

              <p className="text-xs text-muted-foreground font-body">
                💡 Tip: On mobile, you can also use the Share button for easier sharing!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
