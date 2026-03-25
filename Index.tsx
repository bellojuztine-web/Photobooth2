import { usePhotobooth } from "@/hooks/usePhotobooth";
import { ProgressBar } from "@/components/photobooth/ProgressBar";
import { WelcomeScreen } from "@/components/photobooth/WelcomeScreen";
import { LayoutScreen } from "@/components/photobooth/LayoutScreen";
import { FilterScreen } from "@/components/photobooth/FilterScreen";
import { CaptureScreen } from "@/components/photobooth/CaptureScreen";
import { PreviewScreen } from "@/components/photobooth/PreviewScreen";
import { DecorateScreen } from "@/components/photobooth/DecorateScreen";
import { MessageScreen } from "@/components/photobooth/MessageScreen";
import { DownloadScreen } from "@/components/photobooth/DownloadScreen";
import { ThankYouScreen } from "@/components/photobooth/ThankYouScreen";
import { AnimatePresence } from "framer-motion";

const Index = () => {
  const pb = usePhotobooth();
  const { state, stepLabels, totalSteps } = pb;

  const renderStep = () => {
    switch (state.step) {
      case 0:
        return <WelcomeScreen key="welcome" onStart={pb.nextStep} />;
      case 1:
        return (
          <LayoutScreen
            key="layout"
            selected={state.layout}
            onSelect={pb.setLayout}
            onNext={pb.nextStep}
          />
        );
      case 2:
        return (
          <FilterScreen
            key="filter"
            selected={state.filter}
            onSelect={pb.setFilter}
            onNext={pb.nextStep}
            onBack={pb.prevStep}
          />
        );
      case 3:
        return (
          <CaptureScreen
            key="capture"
            filter={state.filter}
            photoCount={pb.getPhotoCount()}
            photos={state.photos}
            onCapture={pb.addPhoto}
            onNext={pb.nextStep}
            onBack={pb.prevStep}
            onClearPhotos={pb.clearPhotos}
          />
        );
      case 4:
        return (
          <PreviewScreen
            key="preview"
            photos={state.photos}
            layout={state.layout}
            onNext={pb.nextStep}
            onRetake={() => {
              pb.clearPhotos();
              pb.prevStep();
            }}
          />
        );
      case 5:
        return (
          <DecorateScreen
            key="decorate"
            selectedFrame={state.frame}
            onSelectFrame={pb.setFrame}
            onNext={pb.nextStep}
            onBack={pb.prevStep}
          />
        );
      case 6:
        return (
          <MessageScreen
            key="message"
            message={state.message}
            onChangeMessage={pb.setMessage}
            onNext={pb.nextStep}
            onBack={pb.prevStep}
          />
        );
      case 7:
        return (
          <DownloadScreen
            key="download"
            photos={state.photos}
            layout={state.layout}
            frame={state.frame}
            message={state.message}
            onNext={pb.nextStep}
          />
        );
      case 8:
        return <ThankYouScreen key="thankyou" onRestart={pb.reset} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ProgressBar currentStep={state.step} totalSteps={totalSteps} labels={stepLabels} />
      <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
    </div>
  );
};

export default Index;
