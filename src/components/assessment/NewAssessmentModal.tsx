
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Code, PenTool, Calculator } from "lucide-react";
import { Card } from "@/components/ui/card";

interface AssessmentTypeOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
}

export function NewAssessmentModal() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const assessmentTypes: AssessmentTypeOption[] = [
    {
      id: "text",
      title: "Text Evaluation",
      description: "Grade essays and text answers",
      icon: <FileText className="h-6 w-6" />,
      route: "/assessment/text"
    },
    {
      id: "code",
      title: "Code Grading",
      description: "Analyze and grade coding assignments",
      icon: <Code className="h-6 w-6" />,
      route: "/assessment/code"
    },
    {
      id: "handwriting",
      title: "Handwriting",
      description: "Convert and grade handwritten submissions",
      icon: <PenTool className="h-6 w-6" />,
      route: "/assessment/handwriting"
    },
    {
      id: "math",
      title: "Math Problems",
      description: "Evaluate mathematical solutions",
      icon: <Calculator className="h-6 w-6" />,
      route: "/assessment/math"
    }
  ];

  const handleCreate = () => {
    if (selectedType) {
      const selected = assessmentTypes.find(type => type.id === selectedType);
      if (selected) {
        navigate(selected.route);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create New Assessment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create New Assessment</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {assessmentTypes.map((type) => (
            <Card 
              key={type.id}
              className={`p-4 cursor-pointer transition-all ${
                selectedType === type.id ? 'border-primary ring-1 ring-primary' : ''
              }`}
              onClick={() => setSelectedType(type.id)}
            >
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-primary/10 p-2">
                  {type.icon}
                </div>
                <div>
                  <h3 className="font-medium">{type.title}</h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <DialogFooter className="flex justify-between">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleCreate} disabled={!selectedType}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
