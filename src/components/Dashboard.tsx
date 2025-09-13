import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Target, 
  BookOpen, 
  TrendingUp, 
  Star,
  Award,
  Calendar,
  Zap
} from "lucide-react";

interface DashboardProps {
  studentData: {
    name: string;
    level: string;
    score: number;
    total: number;
    percentage: number;
  };
  onStartExercises: () => void;
}

const achievements = [
  { name: "Premier test", icon: Star, color: "bg-gradient-primary", earned: true },
  { name: "Persévérant", icon: Target, color: "bg-gradient-success", earned: false },
  { name: "Expert", icon: Trophy, color: "bg-gradient-creative", earned: false },
  { name: "Mentor", icon: Award, color: "bg-gradient-hero", earned: false },
];

const subjects = [
  { name: "Nombres et calculs", progress: 75, color: "bg-primary" },
  { name: "Géométrie", progress: 45, color: "bg-success" },
  { name: "Grandeurs et mesures", progress: 60, color: "bg-creative" },
  { name: "Organisation de données", progress: 30, color: "bg-warning" },
];

export function Dashboard({ studentData, onStartExercises }: DashboardProps) {
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-success";
    if (percentage >= 60) return "text-warning";
    return "text-destructive";
  };

  const getMotivationMessage = (percentage: number) => {
    if (percentage >= 80) return "Excellent travail ! Continue sur cette lancée.";
    if (percentage >= 60) return "Bon départ ! Tu peux encore progresser.";
    return "Pas de panique, l'entraînement va t'aider à progresser !";
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Tableau de bord - {studentData.level}
        </h1>
        <p className="text-muted-foreground">
          Suis tes progrès et découvre tes domaines d'excellence
        </p>
      </div>

      {/* Score Overview */}
      <Card className="shadow-card bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Résultat du test diagnostique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(studentData.percentage)}`}>
                {studentData.score}/{studentData.total}
              </div>
              <p className="text-sm text-muted-foreground">Questions correctes</p>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(studentData.percentage)}`}>
                {studentData.percentage}%
              </div>
              <p className="text-sm text-muted-foreground">Score global</p>
            </div>
            <div className="text-center">
              <Badge 
                variant={studentData.percentage >= 60 ? "default" : "secondary"}
                className="text-sm px-3 py-1"
              >
                {studentData.percentage >= 80 ? "Excellent" : studentData.percentage >= 60 ? "Bien" : "À améliorer"}
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">Niveau</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-accent/50 rounded-lg">
            <p className="text-sm font-medium text-center">
              {getMotivationMessage(studentData.percentage)}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress by Subject */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Progrès par domaine
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subjects.map((subject, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{subject.name}</span>
                  <span className="text-sm text-muted-foreground">{subject.progress}%</span>
                </div>
                <Progress value={subject.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Badges et réussites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement, index) => {
                const IconComponent = achievement.icon;
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      achievement.earned 
                        ? "bg-accent/50 shadow-sm" 
                        : "bg-muted/30 opacity-50"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full ${achievement.color} flex items-center justify-center`}>
                      <IconComponent className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{achievement.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {achievement.earned ? "Obtenu !" : "À débloquer"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Actions rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={onStartExercises}
              className="flex items-center gap-2 h-auto p-4"
            >
              <Target className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Commencer les exercices</div>
                <div className="text-xs opacity-90">Exercices adaptés à ton niveau</div>
              </div>
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
              <BookOpen className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Consulter les cours</div>
                <div className="text-xs text-muted-foreground">Fiches de révision</div>
              </div>
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
              <Calendar className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Planning d'étude</div>
                <div className="text-xs text-muted-foreground">Organise ton temps</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}