import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useGuestData } from "@/hooks/useGuestData";
import { GuestPrompt } from "./GuestPrompt";
import { useNavigate } from "react-router-dom";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  level: string;
}

const sampleQuestions: QuizQuestion[] = [
  // Questions 6ème - Focus spécifique selon knowledge
  {
    id: 1,
    question: "🔢 Quel est le résultat de 15 + 7 × 3 ?",
    options: ["66", "36", "45", "22"],
    correctAnswer: 1,
    explanation: "🎯 Il faut d'abord faire la multiplication : 7 × 3 = 21, puis l'addition : 15 + 21 = 36. C'est la règle de priorité des opérations !",
    level: "6ème"
  },
  {
    id: 2,
    question: "📐 Quelle fraction est équivalente à 0,25 ?",
    options: ["1/2", "1/4", "2/5", "3/8"],
    correctAnswer: 1,
    explanation: "✨ 0,25 = 25/100 = 1/4 après simplification. Tu divises numérateur et dénominateur par 25 !",
    level: "6ème"
  },
  {
    id: 3,
    question: "⚡ Combien vaut 2³ ?",
    options: ["6", "8", "9", "12"],
    correctAnswer: 1,
    explanation: "🚀 2³ = 2 × 2 × 2 = 8. L'exposant 3 signifie qu'on multiplie 2 par lui-même 3 fois !",
    level: "6ème"
  },
  {
    id: 4,
    question: "📏 Le périmètre d'un carré de côté 5 cm est :",
    options: ["10 cm", "15 cm", "20 cm", "25 cm"],
    correctAnswer: 2,
    explanation: "🎨 Le périmètre d'un carré = 4 × côté = 4 × 5 = 20 cm. Tu additionnes les 4 côtés égaux !",
    level: "6ème"
  },
  {
    id: 5,
    question: "🌟 Combien y a-t-il de millimètres dans 3,5 centimètres ?",
    options: ["35 mm", "350 mm", "3,5 mm", "0,35 mm"],
    correctAnswer: 0,
    explanation: "💡 1 cm = 10 mm, donc 3,5 cm = 3,5 × 10 = 35 mm. Multiplier par 10 décale la virgule !",
    level: "6ème"
  },

  // Questions 5ème
  {
    id: 6,
    question: "Calculer : (-3) × (+5)",
    options: ["-15", "+15", "-8", "+8"],
    correctAnswer: 0,
    explanation: "(-3) × (+5) = -15 (règle des signes : négatif × positif = négatif)",
    level: "5ème"
  },
  {
    id: 7,
    question: "Simplifier la fraction 12/18 :",
    options: ["2/3", "3/4", "4/6", "6/9"],
    correctAnswer: 0,
    explanation: "12/18 = (12÷6)/(18÷6) = 2/3 (on divise par le PGCD qui est 6)",
    level: "5ème"
  },
  {
    id: 8,
    question: "L'aire d'un triangle de base 6 cm et hauteur 4 cm est :",
    options: ["10 cm²", "12 cm²", "24 cm²", "48 cm²"],
    correctAnswer: 1,
    explanation: "Aire triangle = (base × hauteur) ÷ 2 = (6 × 4) ÷ 2 = 12 cm²",
    level: "5ème"
  },
  {
    id: 9,
    question: "Convertir 2,5 heures en minutes :",
    options: ["125 min", "150 min", "250 min", "25 min"],
    correctAnswer: 1,
    explanation: "2,5 h = 2 h + 0,5 h = 120 min + 30 min = 150 min",
    level: "5ème"
  },
  {
    id: 10,
    question: "Résoudre : 2x + 5 = 13",
    options: ["x = 3", "x = 4", "x = 6", "x = 9"],
    correctAnswer: 1,
    explanation: "2x + 5 = 13 ⟹ 2x = 13 - 5 = 8 ⟹ x = 8 ÷ 2 = 4",
    level: "5ème"
  },

  // Questions 4ème
  {
    id: 11,
    question: "Dans un triangle rectangle, si un côté mesure 3 cm et l'autre 4 cm, quelle est la longueur de l'hypoténuse ?",
    options: ["5 cm", "7 cm", "12 cm", "25 cm"],
    correctAnswer: 0,
    explanation: "D'après le théorème de Pythagore : 3² + 4² = 9 + 16 = 25, donc √25 = 5 cm",
    level: "4ème"
  },
  {
    id: 12,
    question: "Résoudre l'équation : 3x - 7 = 2x + 5",
    options: ["x = 12", "x = 6", "x = -2", "x = 2"],
    correctAnswer: 0,
    explanation: "3x - 7 = 2x + 5 ⟹ 3x - 2x = 5 + 7 ⟹ x = 12",
    level: "4ème"
  },
  {
    id: 13,
    question: "La médiane de la série 5, 8, 12, 15, 20 est :",
    options: ["8", "12", "15", "20"],
    correctAnswer: 1,
    explanation: "La médiane est la valeur du milieu quand les données sont ordonnées : 12",
    level: "4ème"
  },
  {
    id: 14,
    question: "Le volume d'un cube d'arête 3 cm est :",
    options: ["9 cm³", "18 cm³", "27 cm³", "36 cm³"],
    correctAnswer: 2,
    explanation: "Volume du cube = arête³ = 3³ = 27 cm³",
    level: "4ème"
  },
  {
    id: 15,
    question: "Factoriser l'expression : x² - 9",
    options: ["(x - 3)²", "(x + 3)²", "(x - 3)(x + 3)", "x(x - 9)"],
    correctAnswer: 2,
    explanation: "x² - 9 = x² - 3² = (x - 3)(x + 3) (identité remarquable a² - b²)",
    level: "4ème"
  },

  // Questions 3ème
  {
    id: 16,
    question: "Résoudre l'équation : x² - 5x + 6 = 0",
    options: ["x = 2 ou x = 3", "x = 1 ou x = 6", "x = -2 ou x = -3", "x = 0 ou x = 5"],
    correctAnswer: 0,
    explanation: "x² - 5x + 6 = (x - 2)(x - 3) = 0, donc x = 2 ou x = 3",
    level: "3ème"
  },
  {
    id: 17,
    question: "Dans un triangle rectangle, sin(30°) = ?",
    options: ["1/2", "√2/2", "√3/2", "1"],
    correctAnswer: 0,
    explanation: "sin(30°) = 1/2 (valeur trigonométrique remarquable)",
    level: "3ème"
  },
  {
    id: 18,
    question: "L'image de 2 par la fonction f(x) = 3x - 1 est :",
    options: ["5", "6", "7", "8"],
    correctAnswer: 0,
    explanation: "f(2) = 3 × 2 - 1 = 6 - 1 = 5",
    level: "3ème"
  },
  {
    id: 19,
    question: "Le volume d'une sphère de rayon 3 cm est (π ≈ 3,14) :",
    options: ["36π cm³", "12π cm³", "108π cm³", "84π cm³"],
    correctAnswer: 0,
    explanation: "Volume sphère = (4/3)πr³ = (4/3)π × 3³ = (4/3)π × 27 = 36π cm³",
    level: "3ème"
  },
  {
    id: 20,
    question: "La forme développée de (2x + 3)² est :",
    options: ["4x² + 9", "4x² + 6x + 9", "4x² + 12x + 9", "2x² + 12x + 9"],
    correctAnswer: 2,
    explanation: "(2x + 3)² = (2x)² + 2(2x)(3) + 3² = 4x² + 12x + 9",
    level: "3ème"
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
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);
  
  const { isGuest } = useAuth();
  const { saveGuestData } = useGuestData();
  const navigate = useNavigate();

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
        // Quiz terminé
        setQuizCompleted(true);
      }
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setShowExplanation(false);
    setQuizCompleted(false);
    setShowGuestPrompt(false);
  };

  const handleGuestSignUp = () => {
    navigate("/auth");
  };

  const handleGuestContinue = () => {
    setShowGuestPrompt(false);
    const correctAnswers = answers.reduce((count, answer, index) => {
      return answer === questions[index].correctAnswer ? count + 1 : count;
    }, 0);
    const score = correctAnswers;
    const percentage = Math.round((score / questions.length) * 100);
    
    onComplete({
      level,
      score,
      total: questions.length,
      percentage,
      name: "Invité"
    });
  };

  if (questions.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6">
        <Card className="shadow-card">
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Aucune question disponible</h3>
            <p className="text-muted-foreground">
              Aucune question n'est disponible pour ce niveau pour le moment.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showGuestPrompt) {
    return (
      <GuestPrompt
        trigger="quiz_complete"
        onSignUp={handleGuestSignUp}
        onContinueAsGuest={handleGuestContinue}
      />
    );
  }

  // Écran de fin de quiz
  if (quizCompleted) {
    const correctAnswers = answers.reduce((count, answer, index) => {
      return answer === questions[index].correctAnswer ? count + 1 : count;
    }, 0);
    const score = correctAnswers;
    const percentage = Math.round((score / questions.length) * 100);

    // Gérer les utilisateurs invités
    if (isGuest) {
      const results = {
        level,
        score,
        total: questions.length,
        percentage,
        name: "Invité"
      };
      saveGuestData({
        quizResults: [results],
        selectedLevel: level
      });
      setShowGuestPrompt(true);
      return null;
    }

    const results = {
      level,
      score,
      total: questions.length,
      percentage,
      name: "Élève"
    };

    return (
      <div className="w-full max-w-2xl mx-auto p-6">
        <Card className="shadow-floating">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-mathematica flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Quiz terminé ! 🎉</h3>
              <p className="text-muted-foreground">
                Tu as répondu à {score} questions sur {questions.length}
              </p>
            </div>

            <div className="mb-6">
              <div className="text-4xl font-bold text-primary mb-2">
                {percentage}%
              </div>
              <Badge variant={percentage >= 60 ? "default" : "secondary"} className="text-lg px-4 py-2">
                {percentage >= 80 ? "Excellent !" : 
                 percentage >= 60 ? "Bien joué !" : 
                 percentage >= 40 ? "Pas mal !" : "Continue tes efforts !"}
              </Badge>
            </div>

            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={handleRestart}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Recommencer
              </Button>
              <Button onClick={() => onComplete(results)}>
                <ArrowRight className="mr-2 h-4 w-4" />
                Voir les résultats
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const isCorrectAnswer = selectedAnswer === currentQ.correctAnswer;

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Test Mathematica - {level}
              <Badge variant="secondary" className="ml-2">
                Quest Mode
              </Badge>
            </CardTitle>
          </div>
          <Progress value={progress} className="mb-2" />
          <p className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} sur {questions.length}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {currentQ.question}
            </h3>
            <div className="grid gap-3">
              {currentQ.options.map((option, index) => {
                let buttonVariant: "default" | "outline" | "secondary" = "outline";
                let className = "";
                
                if (selectedAnswer === index) {
                  if (isCorrectAnswer) {
                    buttonVariant = "default";
                    className = "bg-success text-success-foreground border-success";
                  } else {
                    buttonVariant = "secondary";
                    className = "bg-destructive text-destructive-foreground border-destructive";
                  }
                } else if (showExplanation && index === currentQ.correctAnswer) {
                  buttonVariant = "default";
                  className = "bg-success text-success-foreground border-success";
                }

                return (
                  <Button
                    key={index}
                    variant={buttonVariant}
                    className={`justify-start h-auto p-4 text-left ${className}`}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showExplanation}
                  >
                    <span className="mr-3 font-semibold">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                    {showExplanation && selectedAnswer === index && (
                      <span className="ml-auto">
                        {isCorrectAnswer ? (
                          <CheckCircle className="h-5 w-5 text-success" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive" />
                        )}
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>

          {showExplanation && (
            <div className="bg-accent/50 p-4 rounded-lg border">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                {isCorrectAnswer ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
                {isCorrectAnswer ? "Bravo ! ✨" : "Pas tout à fait... 🤔"}
              </h4>
              <p className="text-sm">{currentQ.explanation}</p>
            </div>
          )}

          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {currentQuestion + 1}/{questions.length}
              </Badge>
            </div>
            <Button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
            >
              {currentQuestion === questions.length - 1 ? "Terminer" : "Suivant"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}