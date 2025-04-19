
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calculator, Check, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

const StudentMathSubmission = () => {
  const { id: assessmentId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [assessment, setAssessment] = useState<any>(null);
  const [solution, setSolution] = useState("");
  const [workSteps, setWorkSteps] = useState("");

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const { data, error } = await supabase
          .from("assessments")
          .select("*")
          .eq("id", assessmentId)
          .single();

        if (error) throw error;
        setAssessment(data);
      } catch (error: any) {
        console.error("Error fetching assessment:", error);
        toast.error("Failed to load assessment");
      } finally {
        setLoading(false);
      }
    };

    if (assessmentId) {
      fetchAssessment();
    }
  }, [assessmentId]);

  const handleSubmit = async () => {
    if (!solution.trim()) {
      toast.error("Please enter your solution");
      return;
    }

    try {
      setSubmitting(true);
      
      const { data, error } = await supabase.from("submissions").insert({
        assessment_id: assessmentId,
        user_id: user?.id,
        content: JSON.stringify({
          solution,
          workSteps
        }),
        status: "pending"
      });

      if (error) throw error;
      
      // Start the evaluation process
      await evaluateSubmission(assessmentId as string);
      
      toast.success("Submission sent for evaluation");
      navigate("/assessments");
    } catch (error: any) {
      console.error("Error submitting solution:", error);
      toast.error(error.message || "Failed to submit solution");
    } finally {
      setSubmitting(false);
    }
  };

  const evaluateSubmission = async (assessmentId: string) => {
    try {
      // This would typically call an edge function to evaluate the solution using AI
      // For now, we'll simulate the evaluation process
      
      // In a real implementation, you would:
      // 1. Call an edge function that uses AI to evaluate the math solution
      // 2. The edge function would update the submission with the score and feedback
      
      // Simulating the process for now
      setTimeout(async () => {
        const { data: submissions } = await supabase
          .from("submissions")
          .select("id")
          .eq("assessment_id", assessmentId)
          .eq("user_id", user?.id)
          .order("created_at", { ascending: false })
          .limit(1);
          
        if (submissions && submissions.length > 0) {
          const submissionId = submissions[0].id;
          
          // Simulate AI evaluation
          await supabase
            .from("submissions")
            .update({
              status: "completed",
              score: Math.floor(Math.random() * 40) + 60, // Random score between 60 and 100
              feedback: {
                summary: "Good work on this math problem.",
                details: "Your solution is correct and well-formatted.",
                improvements: "Consider showing more intermediate steps in your work."
              },
              criteria_scores: {
                correctness: Math.floor(Math.random() * 20) + 80,
                steps: Math.floor(Math.random() * 30) + 70,
                formatting: Math.floor(Math.random() * 20) + 80
              }
            })
            .eq("id", submissionId);
        }
      }, 3000);
    } catch (error) {
      console.error("Error evaluating submission:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Assessment not found</h2>
        <p className="text-muted-foreground mt-2">The requested assessment does not exist</p>
        <Button className="mt-4" onClick={() => navigate("/assessments")}>
          Back to Assessments
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Calculator className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{assessment.title}</h1>
          <p className="text-muted-foreground">{assessment.description}</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Problem</CardTitle>
          <CardDescription>Read the instructions carefully</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Instructions</h3>
            <p>{assessment.instructions}</p>
          </div>
          
          <div className="mt-4">
            <h3 className="font-medium mb-2">Equation</h3>
            <div className="bg-muted p-4 rounded-md font-mono">
              {assessment.criteria.equation}
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              <strong>Problem Type:</strong> {assessment.criteria.problemType.charAt(0).toUpperCase() + assessment.criteria.problemType.slice(1)}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Difficulty:</strong> {assessment.criteria.difficulty.charAt(0).toUpperCase() + assessment.criteria.difficulty.slice(1)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Solution</CardTitle>
          <CardDescription>Provide your answer to the problem</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="solution">Final Answer</Label>
            <Textarea
              id="solution"
              placeholder="Enter your solution here..."
              rows={3}
              className="font-mono"
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="work-steps">Show Your Work (Optional)</Label>
            <Textarea
              id="work-steps"
              placeholder="Show the steps you took to solve this problem..."
              rows={6}
              value={workSteps}
              onChange={(e) => setWorkSteps(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Showing your work helps with more accurate evaluation</p>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button 
              onClick={handleSubmit} 
              disabled={submitting}
              className="flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Submit Solution
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentMathSubmission;
