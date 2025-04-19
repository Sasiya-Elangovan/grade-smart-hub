
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Code, 
  PenTool, 
  Calculator,
  Plus,
  Search,
  Clock,
  Check,
  X,
  Calendar,
  AlignJustify
} from "lucide-react";
import { NewAssessmentModal } from "@/components/assessment/NewAssessmentModal";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { formatDistanceToNow } from "date-fns";

const AllAssessments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch assessments
        const { data: assessmentsData, error: assessmentsError } = await supabase
          .from("assessments")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (assessmentsError) throw assessmentsError;
        
        // Fetch user's submissions
        const { data: submissionsData, error: submissionsError } = await supabase
          .from("submissions")
          .select(`*, assessments(*)`)
          .eq("user_id", user?.id)
          .order("created_at", { ascending: false });
        
        if (submissionsError) throw submissionsError;
        
        setAssessments(assessmentsData || []);
        setSubmissions(submissionsData || []);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load assessments");
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchData();
    }
  }, [user]);

  const getTypeIcon = (type: string) => {
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
        return <AlignJustify className="h-5 w-5" />;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case "grading":
        return <Badge className="bg-yellow-500 flex items-center gap-1"><Clock className="h-3 w-3" /> Grading</Badge>;
      case "completed":
        return <Badge className="bg-green-500 flex items-center gap-1"><Check className="h-3 w-3" /> Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredAssessments = assessments.filter(assessment =>
    assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assessment.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredSubmissions = submissions.filter(submission =>
    submission.assessments.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    submission.assessments.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTakeAssessment = (assessment: any) => {
    navigate(`/assessment/${assessment.type}/${assessment.id}`);
  };
  
  const handleViewResult = (submission: any) => {
    navigate(`/assessment/result/${submission.id}`);
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Assessments</h1>
          <p className="text-muted-foreground">Create and manage your assessments</p>
        </div>
        <NewAssessmentModal />
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assessments..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="available">
        <TabsList className="mb-4 grid grid-cols-2">
          <TabsTrigger value="available">Available Assessments</TabsTrigger>
          <TabsTrigger value="submissions">My Submissions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="available">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredAssessments.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No assessments available</h3>
              <p className="text-muted-foreground">Create a new assessment to get started</p>
              <NewAssessmentModal />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAssessments.map((assessment) => (
                <Card key={assessment.id} className="transition-shadow hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {getTypeIcon(assessment.type)}
                      </div>
                      <Badge variant="outline" className="capitalize">{assessment.type}</Badge>
                    </div>
                    <CardTitle className="mt-2">{assessment.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-2">{assessment.description}</p>
                    <div className="mt-4 flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDistanceToNow(new Date(assessment.created_at), { addSuffix: true })}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Button 
                      className="w-full" 
                      onClick={() => handleTakeAssessment(assessment)}
                    >
                      Take Assessment
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="submissions">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No submissions yet</h3>
              <p className="text-muted-foreground">Take an assessment to see your results here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSubmissions.map((submission) => (
                <Card key={submission.id} className="transition-shadow hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {getTypeIcon(submission.assessments.type)}
                      </div>
                      {getStatusBadge(submission.status)}
                    </div>
                    <CardTitle className="mt-2">{submission.assessments.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <p className="text-muted-foreground">Submitted</p>
                      <p className="text-sm">
                        {formatDistanceToNow(new Date(submission.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    
                    {submission.status === "completed" && (
                      <div className="mt-2 flex justify-between items-center">
                        <p className="text-muted-foreground">Score</p>
                        <p className="text-lg font-bold">{submission.score}%</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Button 
                      className="w-full" 
                      onClick={() => handleViewResult(submission)}
                      disabled={submission.status !== "completed"}
                      variant={submission.status === "completed" ? "default" : "outline"}
                    >
                      {submission.status === "completed" ? "View Results" : "Awaiting Evaluation"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AllAssessments;
