import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QuestionRequest {
  educationLevel: string;
  topic: string;
  difficulty: number;
  questionType: 'multiple_choice' | 'open_ended' | 'calculation';
  count: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!openAIApiKey || !supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body: QuestionRequest = await req.json();

    console.log('Question generation request:', body);

    // Validate request
    if (!body.educationLevel || !body.topic || !body.difficulty || !body.questionType) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: educationLevel, topic, difficulty, questionType',
        success: false
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get education level and topic from database
    const { data: level } = await supabase
      .from('education_levels')
      .select('*')
      .eq('name', body.educationLevel)
      .single();

    const { data: topic } = await supabase
      .from('math_topics')
      .select('*')
      .eq('name', body.topic)
      .eq('education_level_id', level?.id)
      .single();

    if (!level) {
      return new Response(JSON.stringify({ 
        error: `Education level '${body.educationLevel}' not found`,
        success: false
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get relevant educational resources
    const { data: resources } = await supabase
      .from('educational_resources')
      .select('*')
      .eq('education_level_id', level.id)
      .eq('topic_id', topic?.id)
      .eq('is_current', true)
      .limit(5);

    console.log(`Found ${resources?.length || 0} relevant resources`);

    // Prepare context from educational resources
    const resourceContext = resources?.map(r => `
Titre: ${r.title}
Contenu: ${r.content.substring(0, 500)}...
Source: ${r.source_type}
`).join('\n---\n') || '';

    // Generate questions using AI
    const questionTypeInstructions = {
      multiple_choice: 'Génère des questions à choix multiples avec 4 options (A, B, C, D). Une seule réponse correcte.',
      open_ended: 'Génère des questions ouvertes nécessitant une réponse rédigée et un raisonnement.',
      calculation: 'Génère des exercices de calcul avec étapes de résolution détaillées.'
    };

    const prompt = `En tant qu'expert en éducation mathématique française, génère ${body.count || 1} question(s) de mathématiques de qualité pour le niveau ${body.educationLevel} sur le thème "${body.topic}".

Niveau de difficulté: ${body.difficulty}/10
Type de question: ${body.questionType}
Instructions spécifiques: ${questionTypeInstructions[body.questionType]}

Contexte éducatif basé sur les ressources officielles:
${resourceContext}

Critères obligatoires:
- Conforme aux programmes officiels français
- Adapté au niveau cognitif des élèves de ${body.educationLevel}
- Questions progressives et pédagogiques
- Explanations claires et détaillées
- Utilise un vocabulaire mathématique approprié

Format JSON de réponse:
{
  "questions": [
    {
      "question_text": "Énoncé de la question...",
      "correct_answer": "Réponse correcte",
      "possible_answers": ["A) ...", "B) ...", "C) ...", "D) ..."], // Pour multiple_choice uniquement
      "explanation": "Explication détaillée de la solution avec étapes...",
      "keywords": ["mot-clé1", "mot-clé2"],
      "difficulty_justification": "Justification du niveau de difficulté..."
    }
  ]
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { 
            role: 'system', 
            content: `Tu es un enseignant expert en mathématiques dans le système éducatif français. Tu maîtrises parfaitement les programmes scolaires de tous les niveaux et tu crées des questions pédagogiques de haute qualité, adaptées à chaque niveau scolaire.`
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices[0].message.content;
    
    console.log('AI Response received:', content.substring(0, 200) + '...');

    try {
      const generatedData = JSON.parse(content);
      const generatedQuestions = [];

      // Process and save each question
      for (const questionData of generatedData.questions) {
        const questionRecord = {
          question_text: questionData.question_text,
          question_type: body.questionType,
          difficulty_level: body.difficulty,
          education_level_id: level.id,
          topic_id: topic?.id || null,
          correct_answer: questionData.correct_answer,
          possible_answers: questionData.possible_answers || null,
          explanation: questionData.explanation,
          source_resources: resources?.map(r => r.id) || [],
          generated_by: 'question_generator_ai',
          metadata: {
            keywords: questionData.keywords || [],
            difficulty_justification: questionData.difficulty_justification,
            generation_context: {
              education_level: body.educationLevel,
              topic: body.topic,
              resources_used: resources?.length || 0
            }
          }
        };

        // Save question to database
        const { data: savedQuestion, error: saveError } = await supabase
          .from('generated_questions')
          .insert([questionRecord])
          .select()
          .single();

        if (saveError) {
          console.error('Error saving question:', saveError);
          throw saveError;
        }

        generatedQuestions.push(savedQuestion);
        console.log(`Question saved with ID: ${savedQuestion.id}`);
      }

      return new Response(JSON.stringify({
        success: true,
        questions: generatedQuestions,
        metadata: {
          education_level: body.educationLevel,
          topic: body.topic,
          difficulty: body.difficulty,
          question_type: body.questionType,
          resources_used: resources?.length || 0,
          generated_at: new Date().toISOString()
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.log('Raw AI Response:', content);
      
      return new Response(JSON.stringify({ 
        error: 'Failed to parse AI response',
        success: false,
        debug: content.substring(0, 500)
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in question-generator:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});