
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.23.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { submissionId } = await req.json()

    if (!submissionId) {
      return new Response(
        JSON.stringify({ error: 'submissionId is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch submission details
    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .select('*, assessments(*)')
      .eq('id', submissionId)
      .single()

    if (submissionError || !submission) {
      return new Response(
        JSON.stringify({ error: 'Submission not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Update status to processing
    await supabase
      .from('submissions')
      .update({ status: 'grading' })
      .eq('id', submissionId)

    // Extract data for evaluation
    const assessment = submission.assessments
    const content = typeof submission.content === 'string' ? JSON.parse(submission.content) : submission.content
    const criteriaList = assessment.criteria.criteriaList || []

    // Simulate AI evaluation - In a real application, this would use OpenAI or another AI service
    const evaluationResults = simulateAIEvaluation(content, assessment.criteria)

    // Update submission with results
    const { error: updateError } = await supabase
      .from('submissions')
      .update({
        status: 'completed',
        score: evaluationResults.overallScore,
        feedback: evaluationResults.feedback,
        criteria_scores: evaluationResults.criteriaScores
      })
      .eq('id', submissionId)

    if (updateError) {
      throw updateError
    }

    return new Response(
      JSON.stringify({ success: true, results: evaluationResults }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in evaluate-assessment function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

// Simulate AI evaluation - In a real implementation, this would use OpenAI or another AI model
function simulateAIEvaluation(content: any, criteria: any) {
  // Generate random scores for each criterion
  const criteriaScores: Record<string, number> = {
    correctness: Math.floor(Math.random() * 30) + 70, // 70-100
    steps: Math.floor(Math.random() * 40) + 60,       // 60-100
    formatting: Math.floor(Math.random() * 20) + 80   // 80-100
  }

  // Calculate overall score
  const overallScore = Math.round(
    (criteriaScores.correctness * 0.6) +
    (criteriaScores.steps * 0.2) +
    (criteriaScores.formatting * 0.2)
  )

  // Generate feedback
  const feedback = {
    summary: "Good work on this math problem.",
    details: "Your solution approach was generally correct. The equation was properly solved.",
    improvements: "Consider showing more intermediate steps in your work to demonstrate your full understanding."
  }

  // If there's a model solution to compare
  if (criteria.solution && content.solution) {
    // In a real implementation, we'd compare the model solution with the student's solution
    // For now, we just include it in the feedback
    feedback.details += " Your solution closely matches the expected result."
  }

  return {
    overallScore,
    criteriaScores,
    feedback
  }
}
