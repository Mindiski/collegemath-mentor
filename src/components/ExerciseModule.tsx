import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  CheckCircle, 
  Clock, 
  Star, 
  BookOpen, 
  Target,
  Award,
  ArrowLeft
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useGuestData } from "@/hooks/useGuestData";
import { GuestPrompt } from "./GuestPrompt";

interface Exercise {
  id: number;
  title: string;
  description: string;
  difficulty: "Facile" | "Moyen" | "Difficile";
  duration: string;
  points: number;
  completed: boolean;
  category: string;
}

const sampleExercises: Exercise[] = [
  {
    id: 1,
    title: "Calculs avec les nombres entiers",
    description: "Maîtrise les opérations de base avec les nombres entiers",
    difficulty: "Facile",
    duration: "10 min",
    points: 50,
    completed: false,
    category: "Nombres et calculs"
  },
  {
    id: 2,
    title: "Fractions : comparaison et ordre",
    description: "Apprends à comparer et ordonner les fractions",
    difficulty: "Moyen",
    duration: "15 min",
    points: 75,
    completed: true,
    category: "Nombres et calculs"
  },
  {
    id: 3,
    title: "Propriétés des triangles",
    description: "Découvre les différents types de triangles et leurs propriétés",
    difficulty: "Moyen",
    duration: "20 min",
    points: 80,
    completed: false,
    category: "Géométrie"
  },
  {
    id: 4,
    title: "Calcul du périmètre",
    description: "Calcule le périmètre de différentes figures géométriques",
    difficulty: "Facile",
    duration: "12 min",
    points: 60,
    completed: false,
    category: "Grandeurs et mesures"
  }
];

interface ExerciseModuleProps {
  level: string;
  onBack: () => void;
}

export function ExerciseModule({ level, onBack }: ExerciseModuleProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const [exercises] = useState<Exercise[]>(sampleExercises);
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);

  const { isGuestMode } = useAuth();
  const { saveGuestData } = useGuestData();

  const categories = ["Tous", ...Array.from(new Set(exercises.map(ex => ex.category)))];
  
  const filteredExercises = selectedCategory === "Tous" 
    ? exercises 
    : exercises.filter(ex => ex.category === selectedCategory);

  const completedCount = exercises.filter(ex => ex.completed).length;
  const totalPoints = exercises.filter(ex => ex.completed).reduce((sum, ex) => sum + ex.points, 0);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Facile": return "bg-success text-success-foreground";
      case "Moyen": return "bg-warning text-warning-foreground";
      case "Difficile": return "bg-destructive text-destructive-foreground";
      default: return "bg-secondary";
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "Facile": return "⭐";
      case "Moyen": return "⭐⭐";
      case "Difficile": return "⭐⭐⭐";
      default: return "⭐";
    }
  };

  const handleExerciseStart = (exerciseId: number) => {
    // Simulate exercise completion for demo
    if (isGuestMode) {
      saveGuestData({
        exercisesCompleted: Math.random() > 0.3 ? 1 : 0,
      });
      
      // Show guest prompt after completing 2-3 exercises
      const shouldShowPrompt = Math.random() > 0.4;
      if (shouldShowPrompt) {
        setShowGuestPrompt(true);
      }
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Exercices - {level}
          </h1>
          <p className="text-muted-foreground">
            Entraîne-toi avec des exercices adaptés à ton niveau
          </p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-success rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{completedCount}</p>
                <p className="text-sm text-muted-foreground">Exercices terminés</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-creative rounded-lg flex items-center justify-center">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalPoints}</p>
                <p className="text-sm text-muted-foreground">Points gagnés</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {Math.round((completedCount / exercises.length) * 100)}%
                </p>
                <p className="text-sm text-muted-foreground">Progression</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <Card className="shadow-card mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="font-medium">Filtrer par domaine :</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exercises Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((exercise) => (
          <Card 
            key={exercise.id} 
            className={`shadow-card hover:shadow-floating transition-all duration-300 hover:-translate-y-1 ${
              exercise.completed ? "ring-1 ring-success/20" : ""
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg leading-tight">
                  {exercise.title}
                </CardTitle>
                {exercise.completed && (
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {exercise.description}
              </p>
              
              <div className="flex items-center gap-2">
                <Badge className={getDifficultyColor(exercise.difficulty)}>
                  {getDifficultyIcon(exercise.difficulty)} {exercise.difficulty}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {exercise.category}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {exercise.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  {exercise.points} pts
                </div>
              </div>

              <Button 
                className="w-full"
                variant={exercise.completed ? "outline" : "default"}
                onClick={() => handleExerciseStart(exercise.id)}
              >
                <Play className="h-4 w-4 mr-2" />
                {exercise.completed ? "Refaire" : "Commencer"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun exercice trouvé</h3>
            <p className="text-muted-foreground">
              Aucun exercice ne correspond aux critères sélectionnés.
            </p>
          </CardContent>
        </Card>
      )}

      {showGuestPrompt && (
        <GuestPrompt onClose={() => setShowGuestPrompt(false)} />
      )}
    </div>
  );
}