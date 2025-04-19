
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Code, PenTool, Calculator } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SubmissionFormProps {
  type: "text" | "code" | "handwriting" | "math";
  assessmentTitle: string;
  onSubmit?: (data: any) => void;
}

export function SubmissionForm({
  type,
  assessmentTitle,
  onSubmit
}: SubmissionFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({});
    }
  };

  const renderIcon = () => {
    switch (type) {
      case "text":
        return <FileText className="h-5 w-5" />;
      case "code":
        return <Code className="h-5 w-5" />;
      case "handwriting":
        return <PenTool className="h-5 w-5" />;
      case "math":
        return <Calculator className="h-5 w-5" />;
    }
  };

  const renderFormFields = () => {
    switch (type) {
      case "text":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="text-submission">Your Answer</Label>
              <Textarea
                id="text-submission"
                placeholder="Enter your response here..."
                className="min-h-[200px]"
              />
            </div>
          </>
        );

      case "code":
        return (
          <>
            <div className="space-y-2 mb-4">
              <Label htmlFor="language">Language</Label>
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
              <Label htmlFor="code-submission">Your Code</Label>
              <Textarea
                id="code-submission"
                placeholder="Write or paste your code here..."
                className="min-h-[200px] font-mono"
              />
            </div>
          </>
        );

      case "handwriting":
        return (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="rounded-full bg-primary/10 p-3">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Upload Image</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Upload a clear image of your handwritten work
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Select File
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="handwriting-notes">Additional Notes (Optional)</Label>
              <Textarea
                id="handwriting-notes"
                placeholder="Any clarifications about your submission..."
                rows={4}
              />
            </div>
          </div>
        );

      case "math":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="math-submission">Your Solution</Label>
              <Textarea
                id="math-submission"
                placeholder="Enter your mathematical solution here..."
                className="min-h-[200px] font-mono"
              />
              <p className="text-xs text-muted-foreground">Use standard mathematical notation. LaTeX support coming soon.</p>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="math-steps">Show Your Work (Optional)</Label>
              <Textarea
                id="math-steps"
                placeholder="Show the steps of your solution process..."
                rows={6}
              />
            </div>
          </>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mb-6">
        <CardHeader className="pb-3 flex flex-row items-center space-y-0">
          <div className="mr-3 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            {renderIcon()}
          </div>
          <div>
            <CardTitle className="text-lg">{assessmentTitle}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Submit your response for evaluation
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {renderFormFields()}
          
          <div className="mt-6 flex justify-end space-x-2">
            <Button variant="outline" type="button">
              Save Draft
            </Button>
            <Button type="submit">
              Submit for Evaluation
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
