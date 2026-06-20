"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RotateCcw, CheckCircle2 } from "lucide-react";

interface ExtractedData {
  [key: string]: any;
}

interface ResultsFormProps {
  data: ExtractedData;
  onSave: (updatedData: ExtractedData) => void;
  onReset: () => void;
  isProcessing: boolean;
}

const ResultsForm: React.FC<ResultsFormProps> = ({ data, onSave, onReset, isProcessing }) => {
  const [formData, setFormData] = React.useState<ExtractedData>(data);

  React.useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          Extracted Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key} className="capitalize">
                  {key.replace(/_/g, " ")}
                </Label>
                <Input
                  id={key}
                  value={(value as string) || ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={`Enter ${key}...`}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onReset}
              disabled={isProcessing}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            <Button type="submit" disabled={isProcessing}>
              Confirm & Save
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ResultsForm;
