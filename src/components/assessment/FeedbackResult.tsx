
import React from "react";
import { CheckCircle, AlertCircle, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface CriteriaScoreProps {
  name: string;
  score: number;
  weight: number;
  maxScore: number;
}

const CriteriaScore = ({ name, score, weight, maxScore }: CriteriaScoreProps) => {
  const percentage = (score / maxScore) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-sm font-medium">{name} ({weight}%)</span>
        <span className="text-sm font-medium">{score}/{maxScore}</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};

interface FeedbackItemProps {
  type: "positive" | "improvement" | "suggestion";
  content: string;
}

const FeedbackItem = ({ type, content }: FeedbackItemProps) => {
  const getIcon = () => {
    switch (type) {
      case "positive":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "improvement":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "suggestion":
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case "positive":
        return "Strengths";
      case "improvement":
        return "Areas for Improvement";
      case "suggestion":
        return "Suggestion";
    }
  };

  return (
    <div className={cn(
      "flex items-start gap-3 rounded-lg p-3",
      type === "positive" && "bg-green-50 dark:bg-green-950/20",
      type === "improvement" && "bg-amber-50 dark:bg-amber-950/20",
      type === "suggestion" && "bg-blue-50 dark:bg-blue-950/20"
    )}>
      {getIcon()}
      <div>
        <p className="font-medium">{getTitle()}</p>
        <p className="text-sm mt-1">{content}</p>
      </div>
    </div>
  );
};

interface FeedbackResultProps {
  title: string;
  overallScore: number;
  criteria: {
    name: string;
    score: number;
    weight: number;
    maxScore: number;
  }[];
  feedback: {
    type: "positive" | "improvement" | "suggestion";
    content: string;
  }[];
  details?: React.ReactNode;
}

export function FeedbackResult({
  title,
  overallScore,
  criteria,
  feedback,
  details,
}: FeedbackResultProps) {
  // Calculate score color based on overall score
  const getScoreColor = () => {
    if (overallScore >= 80) return "text-green-500";
    if (overallScore >= 60) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
              <span className="text-sm font-medium text-muted-foreground">Overall Score</span>
              <span className={cn("text-4xl font-bold mt-2", getScoreColor())}>
                {overallScore}%
              </span>
            </div>
            
            <div className="md:col-span-2 space-y-4">
              {criteria.map((item, index) => (
                <CriteriaScore key={index} {...item} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Feedback</h3>
        <div className="space-y-3">
          {feedback.map((item, index) => (
            <FeedbackItem key={index} {...item} />
          ))}
        </div>
      </div>

      {details && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="details">
            <AccordionTrigger>Detailed Analysis</AccordionTrigger>
            <AccordionContent className="pt-4">
              {details}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}
