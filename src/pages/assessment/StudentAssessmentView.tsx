
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { SubmissionForm } from "@/components/assessment/SubmissionForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FeedbackResult } from "@/components/assessment/FeedbackResult";

const StudentAssessmentView = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("assessments")
          .select("*")
          .eq("id", id)
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
    
    if (id) {
      fetchAssessment();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!assessment) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Assessment Not Found</h2>
          <p className="text-muted-foreground mt-2">The assessment you're looking for doesn't exist.</p>
          <Button className="mt-4" onClick={() => navigate("/assessments")}>
            Back to Assessments
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Button 
        variant="outline" 
        className="mb-6"
        onClick={() => navigate("/assessments")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Assessments
      </Button>
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{assessment.title}</h1>
        {assessment.description && (
          <p className="text-muted-foreground">{assessment.description}</p>
        )}
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
          <CardDescription>Please read carefully before proceeding</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert">
            <p>{assessment.instructions || "Complete the assessment and submit your work for evaluation."}</p>
          </div>
        </CardContent>
      </Card>
      
      <SubmissionForm 
        type={assessment.type as any} 
        assessmentId={assessment.id}
        assessmentTitle={assessment.title}
      />
    </div>
  );
};

export default StudentAssessmentView;
