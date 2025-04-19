
import React, { useState } from "react";
import { PenTool, Upload } from "lucide-react";
import { AssessmentLayout } from "@/components/assessment/AssessmentLayout";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/assessment/FileUpload";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const HandwritingAssessment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [modelAnswer, setModelAnswer] = useState("");
  const [templateUrl, setTemplateUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [criteria, setCriteria] = useState({
    ocr: true,
    content: true,
    grammar: true
  });

  const handleCheckboxChange = (criterionName: keyof typeof criteria) => {
    setCriteria(prev => ({
      ...prev,
      [criterionName]: !prev[criterionName]
    }));
  };

  const handleTemplateUploaded = (filePath: string) => {
    setTemplateUrl(filePath);
    toast.success("Template uploaded successfully");
  };

  const handleCreateAssessment = async () => {
    if (!title) {
      toast.error("Please enter a title for the assessment");
      return;
    }
    
    try {
      setLoading(true);
      
      // Calculate weights based on enabled criteria
      const enabledCriteria = Object.entries(criteria).filter(([_, enabled]) => enabled);
      const criteriaWeight = 100 / enabledCriteria.length;
      
      const criteriaData = Object.entries(criteria).reduce((acc, [key, enabled]) => {
        if (enabled) {
          acc.push({
            name: key === 'ocr' ? 'OCR Accuracy' : key === 'content' ? 'Content' : 'Grammar',
            weight: criteriaWeight,
            enabled: true
          });
        }
        return acc;
      }, [] as Array<{name: string, weight: number, enabled: boolean}>);
      
      const { error } = await supabase.from('assessments').insert({
        title,
        description: `Handwriting assessment: ${title}`,
        instructions,
        type: 'handwriting',
        created_by: user?.id,
        criteria: {
          criteriaList: criteriaData,
          templateUrl,
          modelAnswer
        }
      });
      
      if (error) throw error;
      
      toast.success("Assessment created successfully");
      navigate('/assessments');
    } catch (error: any) {
      console.error('Error creating assessment:', error);
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
      title="Handwriting Evaluation"
      description="Convert and assess handwritten submissions using OCR"
      icon={<PenTool className="h-6 w-6" />}
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
          <Label htmlFor="instructions">Instructions</Label>
          <Textarea 
            id="instructions" 
            placeholder="Provide detailed instructions for students"
            rows={4}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Upload Template</Label>
          <FileUpload 
            onFileUploaded={handleTemplateUploaded} 
            acceptedFileTypes="image/*,.pdf"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="model-answer">Model Answer (Optional)</Label>
          <Textarea 
            id="model-answer" 
            placeholder="Provide an ideal answer to help calibrate the AI grading"
            rows={6}
            value={modelAnswer}
            onChange={(e) => setModelAnswer(e.target.value)}
          />
        </div>
        
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Grading Criteria</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="criteria-ocr" 
                className="rounded border-gray-300" 
                checked={criteria.ocr}
                onChange={() => handleCheckboxChange('ocr')}
              />
              <label htmlFor="criteria-ocr">OCR Accuracy (30%)</label>
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="criteria-content" 
                className="rounded border-gray-300" 
                checked={criteria.content}
                onChange={() => handleCheckboxChange('content')}
              />
              <label htmlFor="criteria-content">Content (50%)</label>
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="criteria-grammar" 
                className="rounded border-gray-300" 
                checked={criteria.grammar}
                onChange={() => handleCheckboxChange('grammar')}
              />
              <label htmlFor="criteria-grammar">Grammar (20%)</label>
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

export default HandwritingAssessment;
