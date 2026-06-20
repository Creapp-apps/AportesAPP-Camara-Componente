"use client";

import React, { useState } from "react";
import CameraCapture from "@/components/CameraCapture";
import ResultsForm from "@/components/ResultsForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Camera, RefreshCw, FileText } from "lucide-react";

interface ExtractedData {
  [key: string]: any;
}

export default function ScannerPage() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = (imageSrc: string) => {
    setCapturedImage(imageSrc);
    setError(null);
  };

  const handleExtract = async () => {
    if (!capturedImage) return;

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: capturedImage }),
      });

      if (!response.ok) {
        throw new Error("Failed to extract data. Please try again.");
      }

      const data = await response.json();
      setExtractedData(data);
    } catch (err: any) {
      setError(err.message || "An error occurred during extraction.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setCapturedImage(null);
    setExtractedData(null);
    setError(null);
  };

  const handleSave = (updatedData: ExtractedData) => {
    console.log("Saved Data:", updatedData);
    alert("Data saved successfully! (Check console)");
    handleReset();
  };

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Retirement Scanner PoC
          </h1>
          <p className="text-slate-500">
            Capture contribution forms and extract data automatically.
          </p>
        </header>

        {error && (
          <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-sm font-medium border border-destructive/20">
            {error}
          </div>
        )}

        {!capturedImage && !extractedData && (
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Step 1: Capture Document
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CameraCapture onCapture={handleCapture} />
            </CardContent>
          </Card>
        )}

        {capturedImage && !extractedData && (
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Step 2: Review & Extract
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black shadow-md">
                <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
              </div>

              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={handleReset}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retake
                </Button>
                <Button onClick={handleExtract} disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    "Start Extraction"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {extractedData && (
          <ResultsForm
            data={extractedData}
            onSave={handleSave}
            onReset={handleReset}
            isProcessing={isProcessing}
          />
        )}
      </div>
    </main>
  );
}
