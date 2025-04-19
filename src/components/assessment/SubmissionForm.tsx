
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Code, PenTool, Calculator, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { FileUpload } from "./FileUpload";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface SubmissionFormProps {
  type: "text" | "code" | "handwriting" | "math";
  assessmentId: string;
  assessmentTitle: string;
  onSubmit?: (data: any) => void;
}

export function SubmissionForm({
  type,
  assessmentId,
  assessmentTitle,
  onSubmit
}: SubmissionFormProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [textSubmission, setTextSubmission] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("");
  const [codeSubmission, setCodeSubmission] = useState("");
  const [mathSolution, setMathSolution] = useState("");
  const [mathSteps, setMathSteps] = useState("");
  const [filePath, setFilePath] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to submit");
      return;
    }
    
    try {
      setLoading(true);
      
      let submissionContent;
      
      // Format submission content based on assessment type
      if (type === "text") {
        submissionContent = textSubmission;
      } else if (type === "code") {
        submissionContent = codeSubmission;
      } else if (type === "math") {
        submissionContent = JSON.stringify({
          solution: mathSolution,
          workSteps: mathSteps
        });
      } else if (type === "handwriting") {
        if (!filePath) {
          toast.error("Please upload an image of your handwritten work");
          setLoading(false);
          return;
        }
        submissionContent = notes;
      }
      
      // Create submission record
      const { data: submission, error: submissionError } = await supabase
        .from("submissions")
        .insert({
          assessment_id: assessmentId,
          user_id: user.id,
          content: submissionContent,
          file_path: filePath,
          language: type === "code" ? codeLanguage : null,
          status: "pending"
        })
        .select()
        .single();
      
      if (submissionError) throw submissionError;
      
      // Call the evaluation function to evaluate the submission
      const { error: functionError } = await supabase.functions.invoke("evaluate-assessment", {
        body: { submissionId: submission.id }
      });
      
      if (functionError) throw functionError;
      
      toast.success("Submission successful! Redirecting to results...");
      
      // Wait a moment for the evaluation to complete
      setTimeout(() => {
        navigate(`/assessment/result/${submission.id}`);
      }, 2000);
      
      if (onSubmit) {
        onSubmit(submission);
      }
      
    } catch (error: any) {
      console.error("Error submitting assessment:", error);
      toast.error(error.message || "Failed to submit assessment");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUploaded = (url: string) => {
    setFilePath(url);
    toast.success("File uploaded successfully");
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
      default:
        return <FileText className="h-5 w-5" />;
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
                value={textSubmission}
                onChange={(e) => setTextSubmission(e.target.value)}
                required
              />
            </div>
          </>
        );

      case "code":
        return (
          <>
            <div className="space-y-2 mb-4">
              <Label htmlFor="language">Language</Label>
              <Select value={codeLanguage} onValueChange={setCodeLanguage} required>
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
                value={codeSubmission}
                onChange={(e) => setCodeSubmission(e.target.value)}
                required
              />
            </div>
          </>
        );

      case "handwriting":
        return (
          <div className="space-y-4">
            <Label>Upload Handwritten Work</Label>
            <FileUpload 
              onFileUploaded={handleFileUploaded}
              acceptedFileTypes="image/*"
            />
            {filePath && (
              <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded text-sm text-green-700 dark:text-green-300">
                File uploaded successfully!
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="handwriting-notes">Additional Notes (Optional)</Label>
              <Textarea
                id="handwriting-notes"
                placeholder="Any clarifications about your submission..."
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
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
                value={mathSolution}
                onChange={(e) => setMathSolution(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Use standard mathematical notation. LaTeX support coming soon.</p>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="math-steps">Show Your Work (Optional)</Label>
              <Textarea
                id="math-steps"
                placeholder="Show the steps of your solution process..."
                rows={6}
                value={mathSteps}
                onChange={(e) => setMathSteps(e.target.value)}
              />
            </div>
          </>
        );
        
      default:
        return <p>Unsupported assessment type</p>;
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
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => navigate('/assessments')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit for Evaluation"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
