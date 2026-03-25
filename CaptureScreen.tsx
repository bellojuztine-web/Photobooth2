import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Camera, RotateCcw } from "lucide-react";
import type { PhotoFilter } from "@/hooks/usePhotobooth";

interface CaptureScreenProps {
  filter: PhotoFilter;
  photoCount: number;
  photos: string[];
  onCapture: (photo: string) => void;
  onNext: () => void;
  onBack: () => void;
  onClearPhotos: () => void;
}

const filterCSS: Record<PhotoFilter, string> = {
  none: "",
  grayscale: "grayscale(100%)",
  sepia: "sepia(80%)",
  warm: "saturate(130%) hue-rotate(-10deg)",
  cool: "saturate(110%) hue-rotate(20deg) brightness(105%)",
  vintage: "sepia(30%) contrast(110%) brightness(90%)",
};

export function CaptureScreen({
  filter,
  photoCount,
  photos,
  onCapture,
  onNext,
  onBack,
  onClearPhotos,
}: CaptureScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 640, height: 480 },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraReady(true);
        }
      } catch {
        setCameraError(true);
      }
    }
    startCamera();
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const takePhoto = useCallback(() => {
    if (countdown !== null) return;
    setCountdown(3);
    let count = 3;
    const interval = setInterval(() => {
      count--;
      if (count === 0) {
        clearInterval(interval);
        setCountdown(null);
        // Capture
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.filter = filterCSS[filter] || "none";
            ctx.drawImage(video, 0, 0);
            const dataUrl = canvas.toDataURL("image/png");
            onCapture(dataUrl);
          }
        }
      } else {
        setCountdown(count);
      }
    }, 1000);
  }, [countdown, filter, onCapture]);

  const remaining = photoCount - photos.length;
  const allCaptured = remaining <= 0;

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen px-6 pt-20"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
    >
      <h2 className="text-3xl font-display font-bold text-foreground mb-2">
        {allCaptured ? "All photos taken! 🎉" : `Photo ${photos.length + 1} of ${photoCount}`}
      </h2>
      <p className="text-muted-foreground font-body mb-6">
        {allCaptured ? "Looking great!" : "Get ready and smile!"}
      </p>

      <div className="relative w-full max-w-lg mx-auto mb-6">
        <div className="rounded-3xl overflow-hidden shadow-playful border-4 border-card bg-foreground/5 aspect-[4/3] relative">
          {cameraError ? (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <div className="text-center p-6">
                <p className="text-4xl mb-3">📷</p>
                <p className="font-display font-semibold text-foreground">Camera not available</p>
                <p className="text-sm text-muted-foreground font-body">Using demo mode instead</p>
              </div>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ filter: filterCSS[filter], transform: "scaleX(-1)" }}
            />
          )}

          <AnimatePresence>
            {countdown !== null && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-foreground/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.span
                  key={countdown}
                  className="text-8xl font-display font-bold text-primary-foreground drop-shadow-lg"
                  initial={{ scale: 2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {countdown}
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Thumbnails */}
      {photos.length > 0 && (
        <div className="flex gap-2 mb-6">
          {photos.map((photo, i) => (
            <motion.div
              key={i}
              className="w-16 h-16 rounded-xl overflow-hidden border-2 border-primary/30 shadow-card"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <img src={photo} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
            </motion.div>
          ))}
        </div>
      )}

      <div className="flex gap-4">
        {photos.length > 0 && !allCaptured && (
          <Button variant="outline" size="lg" onClick={() => { onClearPhotos(); }}>
            <RotateCcw className="w-5 h-5" /> Retake All
          </Button>
        )}
        {!allCaptured ? (
          <Button variant="fun" size="lg" onClick={cameraError ? () => {
            // Demo: generate a colored placeholder
            const c = document.createElement("canvas");
            c.width = 640; c.height = 480;
            const ctx = c.getContext("2d");
            if (ctx) {
              const hue = Math.floor(Math.random() * 360);
              ctx.fillStyle = `hsl(${hue}, 70%, 80%)`;
              ctx.fillRect(0, 0, 640, 480);
              ctx.font = "bold 60px sans-serif";
              ctx.fillStyle = "#fff";
              ctx.textAlign = "center";
              ctx.fillText(`📸 Photo ${photos.length + 1}`, 320, 260);
              onCapture(c.toDataURL("image/png"));
            }
          } : takePhoto} disabled={countdown !== null}>
            <Camera className="w-5 h-5" />
            {countdown !== null ? "Get Ready..." : "Take Photo"}
          </Button>
        ) : (
          <Button variant="fun" size="lg" onClick={onNext}>
            Continue ✨
          </Button>
        )}
      </div>
    </motion.div>
  );
}
