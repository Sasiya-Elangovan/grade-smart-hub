
import React, { useState } from "react";
import { Calculator } from "lucide-react";
import { AssessmentLayout } from "@/components/assessment/AssessmentLayout";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const MathAssessment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [equation, setEquation] = useState("");
  const [solution, setSolution] = useState("");
  const [mathType, setMathType] = useState<string | undefined>();
  const [difficulty, setDifficulty] = useState<string | undefined>();
  const [criteria, setCriteria] = useState({
    correctness: true,
    steps: true,
    formatting: true
  });

  const handleCheckboxChange = (criterionName: keyof typeof criteria) => {
    setCriteria(prev => ({
      ...prev,
      [criterionName]: !prev[criterionName]
    }));
  };

  const calculateWeights = () => {
    const enabledCriteria = Object.values(criteria).filter(Boolean).length;
    return {
      correctness: criteria.correctness ? Math.round(60 / enabledCriteria) : 0,
      steps: criteria.steps ? Math.round(20 / enabledCriteria) : 0,
      formatting: criteria.formatting ? Math.round(20 / enabledCriteria) : 0
    };
  };

  const handleCreateAssessment = async () => {
    if (!title) {
      toast.error("Please enter a title for the assessment");
      return;
    }
    
    if (!equation) {
      toast.error("Please enter an equation or problem");
      return;
    }
    
    if (!mathType) {
      toast.error("Please select a problem type");
      return;
    }
    
    if (!difficulty) {
      toast.error("Please select a difficulty level");
      return;
    }
    
    try {
      setLoading(true);
      
      const weights = calculateWeights();
      
      const criteriaData = [
        { name: "Correctness", weight: weights.correctness, enabled: criteria.correctness },
        { name: "Steps", weight: weights.steps, enabled: criteria.steps },
        { name: "Formatting", weight: weights.formatting, enabled: criteria.formatting }
      ];
      
      const { data, error } = await supabase.from("assessments").insert({
        title,
        description: `Math assessment: ${title}`,
        type: "math",
        instructions,
        created_by: user?.id,
        criteria: {
          problemType: mathType,
          difficulty,
          equation,
          solution,
          criteriaList: criteriaData
        }
      }).select();
      
      if (error) throw error;
      
      toast.success("Assessment created successfully!");
      navigate(`/assessments`);
    } catch (error: any) {
      console.error("Error creating assessment:", error);
      toast.error(error.message || "Failed to create assessment");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    if (title) {
      toast.success("Assessment saved as draft");
    } else {
      toast.error("Please enter a title before saving");
    }
  };

  return (
    <AssessmentLayout
      title="Math Evaluation"
      description="Assess mathematical problems and equations"
      icon={<Calculator className="h-6 w-6" />}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Assessment Title</Label>
          <Input 
            id="title" 
            placeholder="Enter a title for this assessment" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="instructions">Problem Description</Label>
          <Textarea 
            id="instructions" 
            placeholder="Describe the math problem in detail"
            rows={4}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="math-type">Problem Type</Label>
            <Select value={mathType} onValueChange={setMathType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="algebra">Algebra</SelectItem>
                <SelectItem value="calculus">Calculus</SelectItem>
                <SelectItem value="geometry">Geometry</SelectItem>
                <SelectItem value="statistics">Statistics</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty Level</Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="equation">Equation or Problem</Label>
          <Textarea 
            id="equation" 
            placeholder="x² + 2x - 3 = 0"
            rows={3}
            className="font-mono"
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Use standard mathematical notation. LaTeX support coming soon.</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="solution">Solution (Optional)</Label>
          <Textarea 
            id="solution" 
            placeholder="x = 1 or x = -3"
            rows={4}
            className="font-mono"
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
          />
        </div>
        
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Grading Criteria</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="criteria-correctness" 
                className="rounded border-gray-300" 
                checked={criteria.correctness}
                onChange={() => handleCheckboxChange("correctness")}
              />
              <label htmlFor="criteria-correctness">Correctness (60%)</label>
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="criteria-steps" 
                className="rounded border-gray-300" 
                checked={criteria.steps}
                onChange={() => handleCheckboxChange("steps")}
              />
              <label htmlFor="criteria-steps">Steps (20%)</label>
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="criteria-formatting" 
                className="rounded border-gray-300" 
                checked={criteria.formatting}
                onChange={() => handleCheckboxChange("formatting")}
              />
              <label htmlFor="criteria-formatting">Formatting (20%)</label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={handleSaveDraft}
            disabled={loading}
          >
            Save as Draft
          </Button>
          <Button 
            onClick={handleCreateAssessment}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Assessment"}
          </Button>
        </div>
      </div>
    </AssessmentLayout>
  );
};

export default MathAssessment;
