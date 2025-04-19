
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Award, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

const AssessmentResult = () => {
  const { id: submissionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState<any>(null);
  const [assessment, setAssessment] = useState<any>(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const { data, error } = await supabase
          .from("submissions")
          .select(`*, assessments(*)`)
          .eq("id", submissionId)
          .single();

        if (error) throw error;
        
        setSubmission(data);
        setAssessment(data.assessments);
      } catch (error: any) {
        console.error("Error fetching submission:", error);
        toast.error("Failed to load assessment result");
      } finally {
        setLoading(false);
      }
    };

    if (submissionId) {
      fetchSubmission();
    }
  }, [submissionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!submission || !assessment) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Result not found</h2>
        <p className="text-muted-foreground mt-2">The requested assessment result does not exist</p>
        <Button className="mt-4" onClick={() => navigate("/assessments")}>
          Back to Assessments
        </Button>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return "bg-green-600";
    if (score >= 70) return "bg-blue-600";
    if (score >= 50) return "bg-yellow-600";
    return "bg-red-600";
  };

  const parseContent = () => {
    try {
      return JSON.parse(submission.content);
    } catch (e) {
      return { solution: submission.content, workSteps: "" };
    }
  };

  const content = parseContent();

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <Button 
        variant="outline" 
        className="mb-6"
        onClick={() => navigate("/assessments")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Assessments
      </Button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{assessment.title}</h1>
          <p className="text-muted-foreground">{assessment.description}</p>
        </div>
        <div className="flex items-center">
          <Award className="h-8 w-8 text-primary mr-2" />
          <span className={`text-3xl font-bold ${getScoreColor(submission.score)}`}>
            {submission.score}%
          </span>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Evaluation Results</CardTitle>
          <CardDescription>AI assessment of your solution</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Overall Score</h3>
            <div className="flex items-center space-x-4">
              <Progress 
                value={submission.score} 
                className={`h-2 ${getProgressColor(submission.score)}`}
              />
              <span className="font-medium">{submission.score}%</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">Criteria Scores</h3>
            {submission.criteria_scores && Object.entries(submission.criteria_scores).map(([key, score]: [string, any]) => (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="capitalize">{key}</span>
                  <span className="font-medium">{score}%</span>
                </div>
                <Progress 
                  value={score} 
                  className={`h-2 ${getProgressColor(score)}`}
                />
              </div>
            ))}
          </div>
          
          <div className="space-y-3">
            <h3 className="font-medium">Feedback</h3>
            {submission.feedback && (
              <>
                <div className="bg-muted p-4 rounded-md">
                  <p className="font-medium">Summary</p>
                  <p>{submission.feedback.summary}</p>
                </div>
                
                <div className="bg-muted p-4 rounded-md">
                  <p className="font-medium">Details</p>
                  <p>{submission.feedback.details}</p>
                </div>
                
                {submission.feedback.improvements && (
                  <div className="bg-muted p-4 rounded-md">
                    <p className="font-medium">Areas for Improvement</p>
                    <p>{submission.feedback.improvements}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Submission</CardTitle>
          <CardDescription>Your solution to the problem</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Problem</h3>
            <div className="bg-muted p-4 rounded-md font-mono">
              {assessment.criteria.equation}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Your Solution</h3>
            <div className="bg-muted p-4 rounded-md font-mono">
              {content.solution}
            </div>
          </div>
          
          {content.workSteps && (
            <div>
              <h3 className="font-medium mb-2">Your Work Steps</h3>
              <div className="bg-muted p-4 rounded-md whitespace-pre-wrap">
                {content.workSteps}
              </div>
            </div>
          )}
          
          {assessment.criteria.solution && (
            <div>
              <h3 className="font-medium mb-2">Correct Solution</h3>
              <div className="bg-muted p-4 rounded-md font-mono">
                {assessment.criteria.solution}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AssessmentResult;
