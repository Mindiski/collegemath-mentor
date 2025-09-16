import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Brain, Zap, BookOpen, Target } from 'lucide-react';

interface GeneratedQuestion {
  id: string;
  question_text: string;
  question_type: string;
  difficulty_level: number;
  correct_answer: string;
  possible_answers?: string[];
  explanation: string;
  metadata?: {
    keywords?: string[];
    difficulty_justification?: string;
  };
}

interface EducationLevel {
  id: string;
  name: string;
  description: string;
}

interface MathTopic {
  id: string;
  name: string;
  description: string;
  education_level_id: string;
}

const AIQuestionGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState([5]);
  const [questionType, setQuestionType] = useState<'multiple_choice' | 'open_ended' | 'calculation'>('multiple_choice');
  const [questionCount, setQuestionCount] = useState([1]);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  
  const [educationLevels, setEducationLevels] = useState<EducationLevel[]>([]);
  const [mathTopics, setMathTopics] = useState<MathTopic[]>([]);
  const [filteredTopics, setFilteredTopics] = useState<MathTopic[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    loadEducationData();
  }, []);

  useEffect(() => {
    if (selectedLevel) {
      const topics = mathTopics.filter(topic => topic.education_level_id === selectedLevel);
      setFilteredTopics(topics);
      setSelectedTopic('');
    }
  }, [selectedLevel, mathTopics]);

  const loadEducationData = async () => {
    try {
      const [levelsResponse, topicsResponse] = await Promise.all([
        supabase.from('education_levels').select('*').order('order_index'),
        supabase.from('math_topics').select('*')
      ]);

      if (levelsResponse.data) setEducationLevels(levelsResponse.data);
      if (topicsResponse.data) setMathTopics(topicsResponse.data);
    } catch (error) {
      console.error('Error loading education data:', error);
    }
  };

  const generateQuestions = async () => {
    if (!selectedLevel || !selectedTopic) {
      toast({
        title: "Paramètres manquants",
        description: "Veuillez sélectionner un niveau et un thème.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedQuestions([]);

    try {
      const levelName = educationLevels.find(l => l.id === selectedLevel)?.name;
      const topicName = mathTopics.find(t => t.id === selectedTopic)?.name;

      toast({
        title: "Génération en cours",
        description: `L'agent IA génère ${questionCount[0]} question(s) pour ${levelName} - ${topicName}...`,
      });

      const { data, error } = await supabase.functions.invoke('question-generator', {
        body: {
          educationLevel: levelName,
          topic: topicName,
          difficulty: difficulty[0],
          questionType,
          count: questionCount[0]
        }
      });

      if (error) {
        throw error;
      }

      if (data?.success) {
        setGeneratedQuestions(data.questions);
        toast({
          title: "Questions générées",
          description: `${data.questions.length} question(s) générée(s) avec succès.`,
        });
      } else {
        throw new Error(data?.error || 'Erreur inconnue');
      }

    } catch (error) {
      console.error('Erreur génération:', error);
      toast({
        title: "Erreur de génération",
        description: error.message || "Une erreur est survenue lors de la génération.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    const labels = {
      multiple_choice: 'QCM',
      open_ended: 'Question ouverte',
      calculation: 'Calcul'
    };
    return labels[type] || type;
  };

  const getDifficultyColor = (level: number) => {
    if (level <= 3) return 'bg-green-100 text-green-800';
    if (level <= 6) return 'bg-yellow-100 text-yellow-800';
    if (level <= 8) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Générateur de Questions IA
          </CardTitle>
          <CardDescription>
            Agent IA avancé qui génère des questions mathématiques adaptées au niveau 
            et aux ressources pédagogiques officielles les plus récentes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Niveau scolaire</label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un niveau" />
                </SelectTrigger>
                <SelectContent>
                  {educationLevels.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.name} - {level.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Thème mathématique</label>
              <Select value={selectedTopic} onValueChange={setSelectedTopic} disabled={!selectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un thème" />
                </SelectTrigger>
                <SelectContent>
                  {filteredTopics.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id}>
                      {topic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Difficulté: {difficulty[0]}/10
              </label>
              <Slider
                value={difficulty}
                onValueChange={setDifficulty}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type de question</label>
              <Select value={questionType} onValueChange={(value: any) => setQuestionType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple_choice">QCM</SelectItem>
                  <SelectItem value="open_ended">Question ouverte</SelectItem>
                  <SelectItem value="calculation">Calcul</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Nombre: {questionCount[0]}
              </label>
              <Slider
                value={questionCount}
                onValueChange={setQuestionCount}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          <Button 
            onClick={generateQuestions}
            disabled={isGenerating || !selectedLevel || !selectedTopic}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Zap className="mr-2 h-4 w-4 animate-pulse" />
                Génération en cours...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Générer les questions
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedQuestions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Questions générées
          </h3>
          
          {generatedQuestions.map((question, index) => (
            <Card key={question.id} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Question {index + 1}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      {getQuestionTypeLabel(question.question_type)}
                    </Badge>
                    <Badge className={getDifficultyColor(question.difficulty_level)}>
                      <Target className="w-3 h-3 mr-1" />
                      Niveau {question.difficulty_level}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Énoncé:</h4>
                  <p className="text-sm bg-gray-50 p-3 rounded">{question.question_text}</p>
                </div>

                {question.possible_answers && (
                  <div>
                    <h4 className="font-medium mb-2">Options:</h4>
                    <div className="space-y-1">
                      {question.possible_answers.map((answer, i) => (
                        <p key={i} className="text-sm pl-3">{answer}</p>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-2">Réponse correcte:</h4>
                  <p className="text-sm bg-green-50 p-2 rounded font-medium text-green-800">
                    {question.correct_answer}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Explication:</h4>
                  <p className="text-sm text-gray-700">{question.explanation}</p>
                </div>

                {question.metadata?.keywords && (
                  <div>
                    <h4 className="font-medium mb-2">Mots-clés:</h4>
                    <div className="flex flex-wrap gap-1">
                      {question.metadata.keywords.map((keyword, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIQuestionGenerator;