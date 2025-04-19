
import React from "react";
import { Code } from "lucide-react";
import { AssessmentLayout } from "@/components/assessment/AssessmentLayout";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CodeAssessment = () => {
  return (
    <AssessmentLayout
      title="Code Evaluation"
      description="Assess programming assignments and coding challenges"
      icon={<Code className="h-6 w-6" />}
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
            placeholder="Describe the coding problem in detail"
            rows={4}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="language">Programming Language</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="csharp">C#</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time-limit">Time Limit (seconds)</Label>
            <Input id="time-limit" type="number" placeholder="e.g., 5" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="test-cases">Test Cases</Label>
          <Textarea 
            id="test-cases" 
            placeholder="Input: [1, 2, 3]\nExpected Output: 6"
            rows={6}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sample-solution">Sample Solution (Optional)</Label>
          <Textarea 
            id="sample-solution" 
            placeholder="def solution(nums):\n    return sum(nums)"
            className="font-mono"
            rows={6}
          />
        </div>
        
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Grading Criteria</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="criteria-correctness" className="rounded border-gray-300" checked />
              <label htmlFor="criteria-correctness">Correctness (50%)</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="criteria-efficiency" className="rounded border-gray-300" checked />
              <label htmlFor="criteria-efficiency">Efficiency (20%)</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="criteria-output" className="rounded border-gray-300" checked />
              <label htmlFor="criteria-output">Output Match (20%)</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="criteria-edge" className="rounded border-gray-300" checked />
              <label htmlFor="criteria-edge">Edge Case Handling (10%)</label>
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

export default CodeAssessment;
