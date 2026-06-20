"use client";

import React, { useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
    }
  }, [onCapture]);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "environment", // Use back camera on mobile
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black shadow-lg">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="w-full h-full object-cover"
        />
      </div>
      <Button
        onClick={capture}
        size="lg"
        className="rounded-full w-16 h-16 flex items-center justify-center shadow-xl"
      >
        <Camera className="w-8 h-8" />
      </Button>
    </div>
  );
};

export default CameraCapture;
