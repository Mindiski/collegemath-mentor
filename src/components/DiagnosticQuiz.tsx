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
  // Questions 6ème
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
    question: "Combien vaut 2³ ?",
    options: ["6", "8", "9", "12"],
    correctAnswer: 1,
    explanation: "2³ = 2 × 2 × 2 = 8",
    level: "6ème"
  },
  {
    id: 4,
    question: "Le périmètre d'un carré de côté 5 cm est :",
    options: ["10 cm", "15 cm", "20 cm", "25 cm"],
    correctAnswer: 2,
    explanation: "Le périmètre d'un carré = 4 × côté = 4 × 5 = 20 cm",
    level: "6ème"
  },
  {
    id: 5,
    question: "La moyenne de 12, 16 et 20 est :",
    options: ["14", "16", "18", "20"],
    correctAnswer: 1,
    explanation: "Moyenne = (12 + 16 + 20) ÷ 3 = 48 ÷ 3 = 16",
    level: "6ème"
  },

  // Questions 5ème
  {
    id: 6,
    question: "Développer l'expression 3(x + 2) :",
    options: ["3x + 2", "3x + 6", "x + 6", "3x + 5"],
    correctAnswer: 1,
    explanation: "3(x + 2) = 3 × x + 3 × 2 = 3x + 6",
    level: "5ème"
  },
  {
    id: 7,
    question: "La probabilité de tirer un as dans un jeu de 32 cartes est :",
    options: ["1/8", "1/4", "4/32", "1/32"],
    correctAnswer: 0,
    explanation: "Il y a 4 as dans 32 cartes, donc P = 4/32 = 1/8",
    level: "5ème"
  },
  {
    id: 8,
    question: "L'aire d'un triangle de base 6 cm et de hauteur 4 cm est :",
    options: ["10 cm²", "12 cm²", "24 cm²", "48 cm²"],
    correctAnswer: 1,
    explanation: "Aire = (base × hauteur) ÷ 2 = (6 × 4) ÷ 2 = 12 cm²",
    level: "5ème"
  },
  {
    id: 9,
    question: "Quelle est la mesure de l'angle manquant dans un triangle ayant des angles de 60° et 45° ?",
    options: ["75°", "85°", "90°", "105°"],
    correctAnswer: 0,
    explanation: "Dans un triangle, la somme des angles = 180°. Donc 180° - 60° - 45° = 75°",
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
        // Quiz completed - just set the flag, completion screen will show
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

  // Quiz completion screen
  if (quizCompleted) {
    const correctAnswers = answers.reduce((count, answer, index) => {
      return answer === questions[index].correctAnswer ? count + 1 : count;
    }, 0);
    
    const results = {
      level,
      score: correctAnswers,
      total: questions.length,
      percentage: Math.round((correctAnswers / questions.length) * 100)
    };

    return (
      <div className="w-full max-w-2xl mx-auto p-6">
        <Card className="shadow-floating bg-gradient-card">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-success rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Test terminé !
            </h2>
            <div className="text-4xl font-bold mb-2 text-primary">
              {correctAnswers}/{questions.length}
            </div>
            <p className="text-muted-foreground mb-6">
              Tu as obtenu {results.percentage}% de bonnes réponses
            </p>
            <Button onClick={() => onComplete(results)} className="w-full mb-4">
              Voir mes résultats
            </Button>
            <Button variant="outline" onClick={handleRestart} className="w-full">
              Refaire le test
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const isCorrect = selectedAnswer === currentQ.correctAnswer;

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-primary">
            Test diagnostique - {level}
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