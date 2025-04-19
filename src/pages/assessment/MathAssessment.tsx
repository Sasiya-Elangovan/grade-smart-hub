
import React from "react";
import { Calculator } from "lucide-react";
import { AssessmentLayout } from "@/components/assessment/AssessmentLayout";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MathAssessment = () => {
  return (
    <AssessmentLayout
      title="Math Evaluation"
      description="Assess mathematical problems and equations"
      icon={<Calculator className="h-6 w-6" />}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Assessment Title</Label>
          <Input id="title" placeholder="Enter a title for this assessment" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="instructions">Problem Description</Label>
          <Textarea 
            id="instructions" 
            placeholder="Describe the math problem in detail"
            rows={4}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="math-type">Problem Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="algebra">Algebra</SelectItem>
                <SelectItem value="calculus">Calculus</SelectItem>
                <SelectItem value="geometry">Geometry</SelectItem>
                <SelectItem value="statistics">Statistics</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty Level</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="equation">Equation or Problem</Label>
          <Textarea 
            id="equation" 
            placeholder="x² + 2x - 3 = 0"
            rows={3}
            className="font-mono"
          />
          <p className="text-xs text-muted-foreground">Use standard mathematical notation. LaTeX support coming soon.</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="solution">Solution (Optional)</Label>
          <Textarea 
            id="solution" 
            placeholder="x = 1 or x = -3"
            rows={4}
            className="font-mono"
          />
        </div>
        
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Grading Criteria</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="criteria-correctness" className="rounded border-gray-300" checked />
              <label htmlFor="criteria-correctness">Correctness (60%)</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="criteria-steps" className="rounded border-gray-300" checked />
              <label htmlFor="criteria-steps">Steps (20%)</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="criteria-formatting" className="rounded border-gray-300" checked />
              <label htmlFor="criteria-formatting">Formatting (20%)</label>
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

export default MathAssessment;
