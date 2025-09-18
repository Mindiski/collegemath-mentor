import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Star, 
  Target, 
  TrendingUp, 
  BookOpen,
  ArrowRight,
  RotateCcw
} from "lucide-react";

interface ResultsModalProps {
  results: {
    level: string;
    score: number;
    total: number;
    percentage: number;
  };
  onContinue: () => void;
  onRetake: () => void;
}

export function ResultsModal({ results, onContinue, onRetake }: ResultsModalProps) {
  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 80) return { level: "Excellent", color: "success", icon: Trophy };
    if (percentage >= 60) return { level: "Bien", color: "primary", icon: Star };
    if (percentage >= 40) return { level: "Correct", color: "warning", icon: Target };
    return { level: "À améliorer", color: "destructive", icon: TrendingUp };
  };

  const performance = getPerformanceLevel(results.percentage);
  const PerformanceIcon = performance.icon;

  const getRecommendations = (percentage: number) => {
    if (percentage >= 80) {
      return [
        "Tu maîtrises bien les bases ! Continue sur cette lancée.",
        "Essaie des exercices plus complexes pour te perfectionner.",
        "Tu pourrais aider tes camarades qui ont plus de difficultés."
      ];
    } else if (percentage >= 60) {
      return [
        "Bon travail ! Quelques révisions t'aideront à progresser.",
        "Concentre-toi sur les domaines où tu as eu des difficultés.",
        "Pratique régulièrement pour consolider tes acquis."
      ];
    } else if (percentage >= 40) {
      return [
        "C'est un bon début ! Ne te décourage pas.",
        "Revois les notions de base avec les fiches de cours.",
        "Commence par des exercices faciles pour prendre confiance."
      ];
    } else {
      return [
        "Pas de panique ! Tout le monde apprend à son rythme.",
        "Commence par revoir les cours et les exemples.",
        "Demande de l'aide à ton professeur ou tes parents si nécessaire."
      ];
    }
  };

  const recommendations = getRecommendations(results.percentage);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl shadow-floating animate-in fade-in-0 zoom-in-95 duration-300">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-${performance.color} flex items-center justify-center`}>
              <PerformanceIcon className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Test terminé !
            </h2>
            <p className="text-muted-foreground">
              Voici tes résultats pour le niveau {results.level}
            </p>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {results.score}/{results.total}
              </div>
              <p className="text-sm text-muted-foreground">Questions correctes</p>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold text-${performance.color} mb-2`}>
                {results.percentage}%
              </div>
              <p className="text-sm text-muted-foreground">Score global</p>
            </div>
            <div className="text-center">
              <Badge 
                variant={results.percentage >= 60 ? "default" : "secondary"}
                className="text-lg px-4 py-2 mb-2"
              >
                {performance.level}
              </Badge>
              <p className="text-sm text-muted-foreground">Niveau atteint</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progression</span>
              <span className="text-sm text-muted-foreground">{results.percentage}%</span>
            </div>
            <Progress value={results.percentage} className="h-3" />
          </div>

          {/* Recommendations */}
          <Card className="bg-accent/50 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Recommandations personnalisées</h3>
              </div>
              <ul className="space-y-2">
                {recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              onClick={onRetake}
              className="flex items-center gap-2 flex-1"
            >
              <RotateCcw className="h-4 w-4" />
              Refaire le test
            </Button>
            <Button
              onClick={onContinue}
              className="flex items-center gap-2 flex-1"
            >
              Accéder au tableau de bord
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}