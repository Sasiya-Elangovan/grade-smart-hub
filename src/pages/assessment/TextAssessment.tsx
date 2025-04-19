
import React from "react";
import { FileText } from "lucide-react";
import { AssessmentLayout } from "@/components/assessment/AssessmentLayout";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TextAssessment = () => {
  return (
    <AssessmentLayout
      title="Text Evaluation"
      description="Assess essays, short answers and text submissions using AI"
      icon={<FileText className="h-6 w-6" />}
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="assessment-type">Assessment Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="essay">Essay</SelectItem>
                <SelectItem value="short-answer">Short Answer</SelectItem>
                <SelectItem value="analysis">Analysis</SelectItem>
                <SelectItem value="summary">Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="word-limit">Word Limit</Label>
            <Input id="word-limit" type="number" placeholder="e.g., 500" />
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
              <input type="checkbox" id="criteria-content" className="rounded border-gray-300" checked />
              <label htmlFor="criteria-content">Content Relevance (40%)</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="criteria-grammar" className="rounded border-gray-300" checked />
              <label htmlFor="criteria-grammar">Grammar (20%)</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="criteria-structure" className="rounded border-gray-300" checked />
              <label htmlFor="criteria-structure">Structure (20%)</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="criteria-originality" className="rounded border-gray-300" checked />
              <label htmlFor="criteria-originality">Originality (20%)</label>
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

export default TextAssessment;
