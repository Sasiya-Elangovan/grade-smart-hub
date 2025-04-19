
import React from "react";
import { PenTool, Upload } from "lucide-react";
import { AssessmentLayout } from "@/components/assessment/AssessmentLayout";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const HandwritingAssessment = () => {
  return (
    <AssessmentLayout
      title="Handwriting Evaluation"
      description="Convert and assess handwritten submissions using OCR"
      icon={<PenTool className="h-6 w-6" />}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Assessment Title</Label>
          <Input id="title" placeholder="Enter a title for this assessment" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="instructions">Instructions</Label>
          <Textarea 
            id="instructions" 
            placeholder="Provide detailed instructions for students"
            rows={4}
          />
        </div>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="rounded-full bg-primary/10 p-3">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Upload Template</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Upload a template file that students should use for their handwritten submissions
            </p>
            <Button variant="outline" size="sm" className="mt-2">
              Select File
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="model-answer">Model Answer (Optional)</Label>
          <Textarea 
            id="model-answer" 
            placeholder="Provide an ideal answer to help calibrate the AI grading"
            rows={6}
          />
        </div>
        
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Grading Criteria</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="criteria-ocr" className="rounded border-gray-300" checked />
              <label htmlFor="criteria-ocr">OCR Accuracy (30%)</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="criteria-content" className="rounded border-gray-300" checked />
              <label htmlFor="criteria-content">Content (50%)</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="criteria-grammar" className="rounded border-gray-300" checked />
              <label htmlFor="criteria-grammar">Grammar (20%)</label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline">Save as Draft</Button>
          <Button>Create Assessment</Button>
        </div>
      </div>
    </AssessmentLayout>
  );
};

export default HandwritingAssessment;
