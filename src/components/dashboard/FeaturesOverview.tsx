
import React from "react";
import { FileText, Code, PenTool, Calculator, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Text-Based Evaluation",
    description: "Evaluate essays and text answers for content, grammar, structure and originality",
    icon: <FileText className="h-5 w-5" />,
    highlight: "Content relevance scoring with AI-based analysis"
  },
  {
    title: "Code Submission Grading",
    description: "Automatically grade coding assignments with execution, testing and feedback",
    icon: <Code className="h-5 w-5" />,
    highlight: "Runtime analysis and test case validation"
  },
  {
    title: "Handwriting Recognition",
    description: "Convert handwritten submissions to text and grade them automatically",
    icon: <PenTool className="h-5 w-5" />,
    highlight: "Accurate OCR with content extraction"
  },
  {
    title: "Math Problem Evaluation",
    description: "Grade mathematical solutions with step-by-step verification",
    icon: <Calculator className="h-5 w-5" />,
    highlight: "Symbolic solving and equation verification"
  }
];

export function FeaturesOverview() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold">AI-Powered Assessment Modules</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </div>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-md px-3 py-2 text-sm">
                <span className="font-medium">Key Feature:</span> {feature.highlight}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
