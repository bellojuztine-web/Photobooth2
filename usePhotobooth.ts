import { useState, useCallback } from "react";

export type PhotoLayout = "1x1" | "2x1" | "2x2" | "strip";
export type PhotoFilter = "none" | "grayscale" | "sepia" | "warm" | "cool" | "vintage";

export interface PhotoboothState {
  step: number;
  layout: PhotoLayout;
  filter: PhotoFilter;
  photos: string[];
  sticker: string | null;
  frame: string | null;
  message: string;
}

const TOTAL_STEPS = 9;

const stepLabels = [
  "Welcome",
  "Layout",
  "Filter",
  "Capture",
  "Preview",
  "Decorate",
  "Message",
  "Download",
  "Thank You",
];

export function usePhotobooth() {
  const [state, setState] = useState<PhotoboothState>({
    step: 0,
    layout: "2x2",
    filter: "none",
    photos: [],
    sticker: null,
    frame: null,
    message: "",
  });

  const setStep = useCallback((step: number) => {
    setState((prev) => ({ ...prev, step }));
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => ({ ...prev, step: Math.min(prev.step + 1, TOTAL_STEPS - 1) }));
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => ({ ...prev, step: Math.max(prev.step - 1, 0) }));
  }, []);

  const setLayout = useCallback((layout: PhotoLayout) => {
    setState((prev) => ({ ...prev, layout }));
  }, []);

  const setFilter = useCallback((filter: PhotoFilter) => {
    setState((prev) => ({ ...prev, filter }));
  }, []);

  const addPhoto = useCallback((photo: string) => {
    setState((prev) => ({ ...prev, photos: [...prev.photos, photo] }));
  }, []);

  const clearPhotos = useCallback(() => {
    setState((prev) => ({ ...prev, photos: [] }));
  }, []);

  const setSticker = useCallback((sticker: string | null) => {
    setState((prev) => ({ ...prev, sticker }));
  }, []);

  const setFrame = useCallback((frame: string | null) => {
    setState((prev) => ({ ...prev, frame }));
  }, []);

  const setMessage = useCallback((message: string) => {
    setState((prev) => ({ ...prev, message }));
  }, []);

  const reset = useCallback(() => {
    setState({
      step: 0,
      layout: "2x2",
      filter: "none",
      photos: [],
      sticker: null,
      frame: null,
      message: "",
    });
  }, []);

  const getPhotoCount = useCallback(() => {
    switch (state.layout) {
      case "1x1": return 1;
      case "2x1": return 2;
      case "2x2": return 4;
      case "strip": return 3;
    }
  }, [state.layout]);

  return {
    state,
    stepLabels,
    totalSteps: TOTAL_STEPS,
    setStep,
    nextStep,
    prevStep,
    setLayout,
    setFilter,
    addPhoto,
    clearPhotos,
    setSticker,
    setFrame,
    setMessage,
    reset,
    getPhotoCount,
  };
}
