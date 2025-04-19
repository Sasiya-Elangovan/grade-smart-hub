
import React from "react";
import { FileText, Code, PenTool, Calculator, BookOpen, Sparkles } from "lucide-react";
import { ModuleCard } from "@/components/assessment/ModuleCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { FeaturesOverview } from "@/components/dashboard/FeaturesOverview";
import { FeedbackResult } from "@/components/assessment/FeedbackResult";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NewAssessmentModal } from "@/components/assessment/NewAssessmentModal";

const Dashboard = () => {
  const demoFeedback = {
    title: "Sample Essay Evaluation",
    overallScore: 85,
    criteria: [
      { name: "Content Relevance", score: 36, weight: 40, maxScore: 40 },
      { name: "Grammar", score: 17, weight: 20, maxScore: 20 },
      { name: "Structure", score: 16, weight: 20, maxScore: 20 },
      { name: "Originality", score: 16, weight: 20, maxScore: 20 },
    ],
    feedback: [
      { 
        type: "positive" as const, 
        content: "Excellent argument structure with well-supported claims and clear thesis statement."
      },
      {
        type: "improvement" as const, 
        content: "Some paragraphs could be more concise. Focus on tightening up your supporting points."
      },
      {
        type: "suggestion" as const, 
        content: "Consider incorporating more counterarguments to strengthen your overall position."
      }
    ]
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome to GradeSmartAI, your AI-powered assessment platform.
          </p>
        </div>
        <NewAssessmentModal />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Assessments"
          value="12"
          description="Up 8% from last month"
          icon={<BookOpen className="h-4 w-4" />}
        />
        <StatCard
          title="Pending Reviews"
          value="5"
          description="Down 2% from last month"
          icon={<FileText className="h-4 w-4" />}
        />
        <StatCard
          title="Average Score"
          value="85%"
          description="Up 3% from last month"
          icon={<Calculator className="h-4 w-4" />}
        />
        <StatCard
          title="Time Saved"
          value="24h"
          description="Using AI grading this month"
          icon={<Code className="h-4 w-4" />}
        />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Assessment Modules</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <ModuleCard
            title="Text Evaluation"
            description="Grade essays and text answers"
            icon={<FileText className="h-6 w-6" />}
            href="/assessment/text"
          />
          <ModuleCard
            title="Code Grading"
            description="Analyze and grade coding assignments"
            icon={<Code className="h-6 w-6" />}
            href="/assessment/code"
          />
          <ModuleCard
            title="Handwriting"
            description="Convert and grade handwritten submissions"
            icon={<PenTool className="h-6 w-6" />}
            href="/assessment/handwriting"
          />
          <ModuleCard
            title="Math Problems"
            description="Evaluate mathematical solutions"
            icon={<Calculator className="h-6 w-6" />}
            href="/assessment/math"
          />
        </div>
      </div>
      
      <FeaturesOverview />
      
      <div>
        <h3 className="text-xl font-semibold mb-4">Sample Result</h3>
        <Card className="p-6">
          <FeedbackResult {...demoFeedback} />
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
