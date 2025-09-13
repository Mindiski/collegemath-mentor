import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from "lucide-react";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  level: string;
}

const sampleQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Quel est le résultat de 15 + 7 × 3 ?",
    options: ["66", "36", "45", "22"],
    correctAnswer: 1,
    explanation: "Il faut d'abord faire la multiplication : 7 × 3 = 21, puis l'addition : 15 + 21 = 36",
    level: "6ème"
  },
  {
    id: 2,
    question: "Quelle fraction est équivalente à 0,25 ?",
    options: ["1/2", "1/4", "2/5", "3/8"],
    correctAnswer: 1,
    explanation: "0,25 = 25/100 = 1/4 après simplification",
    level: "6ème"
  },
  {
    id: 3,
    question: "Dans un triangle rectangle, si un côté mesure 3 cm et l'autre 4 cm, quelle est la longueur de l'hypoténuse ?",
    options: ["5 cm", "7 cm", "12 cm", "25 cm"],
    correctAnswer: 0,
    explanation: "D'après le théorème de Pythagore : 3² + 4² = 9 + 16 = 25, donc √25 = 5 cm",
    level: "4ème"
  }
];

interface DiagnosticQuizProps {
  level: string;
  onComplete: (results: any) => void;
}

export function DiagnosticQuiz({ level, onComplete }: DiagnosticQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const questions = sampleQuestions.filter(q => q.level === level).slice(0, 5);
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers, selectedAnswer];
      setAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowExplanation(false);
      } else {
        // Quiz completed
        setQuizCompleted(true);
        const correctAnswers = newAnswers.reduce((count, answer, index) => {
          return answer === questions[index].correctAnswer ? count + 1 : count;
        }, 0);
        
        onComplete({
          level,
          score: correctAnswers,
          total: questions.length,
          percentage: Math.round((correctAnswers / questions.length) * 100)
        });
      }
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setShowExplanation(false);
    setQuizCompleted(false);
  };

  if (questions.length === 0) {
    return <div>Aucune question disponible pour ce niveau.</div>;
  }

  const currentQ = questions[currentQuestion];
  const isCorrect = selectedAnswer === currentQ.correctAnswer;

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-primary">
            Test diagnostic - {level}
          </h2>
          <span className="text-sm text-muted-foreground">
            {currentQuestion + 1} / {questions.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">
            {currentQ.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-6">
            {currentQ.options.map((option, index) => (
              <Button
                key={index}
                variant={
                  selectedAnswer === index
                    ? isCorrect
                      ? "default"
                      : "destructive"
                    : "outline"
                }
                className="w-full justify-start text-left"
                onClick={() => handleAnswerSelect(index)}
                disabled={showExplanation}
              >
                <div className="flex items-center gap-3">
                  {showExplanation && (
                    <>
                      {index === currentQ.correctAnswer ? (
                        <CheckCircle className="h-4 w-4 text-success" />
                      ) : selectedAnswer === index ? (
                        <XCircle className="h-4 w-4 text-destructive" />
                      ) : null}
                    </>
                  )}
                  {option}
                </div>
              </Button>
            ))}
          </div>

          {showExplanation && (
            <div className={`p-4 rounded-lg mb-4 ${
              isCorrect ? "bg-success/10 border border-success/20" : "bg-destructive/10 border border-destructive/20"
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
                <span className="font-medium">
                  {isCorrect ? "Bonne réponse !" : "Pas tout à fait..."}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {currentQ.explanation}
              </p>
            </div>
          )}

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleRestart}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Recommencer
            </Button>
            
            {showExplanation && (
              <Button onClick={handleNextQuestion} className="flex items-center gap-2">
                {currentQuestion < questions.length - 1 ? "Question suivante" : "Terminer"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}