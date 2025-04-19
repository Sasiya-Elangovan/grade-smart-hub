
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { submissionId } = await req.json();

    if (!submissionId) {
      return new Response(
        JSON.stringify({ error: "Missing submission ID" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create a Supabase client with the Deno runtime
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the submission
    const { data: submission, error: submissionError } = await supabase
      .from("submissions")
      .select("*, assessments(*)")
      .eq("id", submissionId)
      .single();

    if (submissionError) {
      throw new Error(`Error fetching submission: ${submissionError.message}`);
    }

    // Perform the AI evaluation logic here
    // For demonstration, we'll simulate an evaluation with some delay
    console.log("Evaluating submission:", submissionId);
    console.log("Assessment type:", submission.assessments.type);
    console.log("Submission content:", submission.content);

    // Determine assessment type and criteria
    const assessmentType = submission.assessments.type;
    const criteria = submission.assessments.criteria || {};
    
    // Simulate evaluation delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create our evaluation result
    let score = 0;
    let criteriaScores = {};
    let feedback = {
      summary: "",
      details: "",
      improvements: ""
    };
    
    // Different evaluation logic based on assessment type
    if (assessmentType === "handwriting") {
      // Simulated handwriting assessment evaluation
      const ocrScore = Math.floor(Math.random() * 30) + 70; // 70-100
      const contentScore = Math.floor(Math.random() * 40) + 60; // 60-100
      const grammarScore = Math.floor(Math.random() * 50) + 50; // 50-100
      
      criteriaScores = {
        ocr: ocrScore,
        content: contentScore,
        grammar: grammarScore
      };
      
      score = Math.round((ocrScore + contentScore + grammarScore) / 3);
      
      feedback = {
        summary: `Overall handwriting evaluation score: ${score}%. The submission demonstrates ${score > 80 ? "excellent" : score > 65 ? "good" : "fair"} handwriting quality.`,
        details: `OCR accuracy was ${ocrScore}%, content accuracy was ${contentScore}%, and grammar correctness was ${grammarScore}%.`,
        improvements: score < 80 ? "Focus on maintaining consistent letter spacing and alignment. Practice writing more clearly and deliberately." : "Continue to practice your handwriting skills."
      };
    } else if (assessmentType === "math") {
      // Simulated math assessment evaluation
      const correctnessScore = Math.floor(Math.random() * 40) + 60;
      const workStepsScore = Math.floor(Math.random() * 30) + 70;
      
      criteriaScores = {
        correctness: correctnessScore,
        workSteps: workStepsScore
      };
      
      score = Math.round((correctnessScore + workStepsScore) / 2);
      
      feedback = {
        summary: `Overall math solution score: ${score}%. The solution is ${score > 80 ? "mostly correct" : score > 65 ? "partially correct" : "needs improvement"}.`,
        details: `Solution correctness: ${correctnessScore}%, work steps clarity: ${workStepsScore}%.`,
        improvements: score < 80 ? "Show your work more clearly and double-check your calculations." : "Great job showing your work!"
      };
    } else if (assessmentType === "code") {
      // Simulated code assessment evaluation
      const functionalityScore = Math.floor(Math.random() * 30) + 70;
      const readabilityScore = Math.floor(Math.random() * 20) + 80;
      const efficiencyScore = Math.floor(Math.random() * 40) + 60;
      
      criteriaScores = {
        functionality: functionalityScore,
        readability: readabilityScore,
        efficiency: efficiencyScore
      };
      
      score = Math.round((functionalityScore + readabilityScore + efficiencyScore) / 3);
      
      feedback = {
        summary: `Overall code quality score: ${score}%. The code is ${score > 80 ? "excellent" : score > 65 ? "good" : "needs improvement"}.`,
        details: `Functionality: ${functionalityScore}%, readability: ${readabilityScore}%, efficiency: ${efficiencyScore}%.`,
        improvements: score < 80 ? "Consider optimizing your algorithm and adding more comments." : "Well-structured code with good naming conventions."
      };
    } else {
      // Default text assessment evaluation
      const contentScore = Math.floor(Math.random() * 30) + 70;
      const grammarScore = Math.floor(Math.random() * 20) + 80;
      const structureScore = Math.floor(Math.random() * 25) + 75;
      
      criteriaScores = {
        content: contentScore,
        grammar: grammarScore,
        structure: structureScore
      };
      
      score = Math.round((contentScore + grammarScore + structureScore) / 3);
      
      feedback = {
        summary: `Overall text assessment score: ${score}%. The submission is ${score > 80 ? "excellent" : score > 65 ? "good" : "needs improvement"}.`,
        details: `Content: ${contentScore}%, grammar: ${grammarScore}%, structure: ${structureScore}%.`,
        improvements: score < 80 ? "Consider improving your argument structure and proofreading for grammar." : "Well-written with clear arguments and good flow."
      };
    }

    // Update the submission with evaluation results
    const { error: updateError } = await supabase
      .from("submissions")
      .update({
        score,
        criteria_scores: criteriaScores,
        feedback,
        status: "completed",
        updated_at: new Date().toISOString()
      })
      .eq("id", submissionId);

    if (updateError) {
      throw new Error(`Error updating submission: ${updateError.message}`);
    }

    console.log("Evaluation completed successfully");

    return new Response(
      JSON.stringify({ 
        success: true, 
        submissionId,
        score,
        criteria_scores: criteriaScores,
        feedback
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in evaluation function:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
