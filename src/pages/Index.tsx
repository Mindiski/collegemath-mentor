// Update this page (the content is just a fallback if you fail to update the page)

import { useState } from "react";
import { LevelSelector } from "@/components/LevelSelector";
import { DiagnosticQuiz } from "@/components/DiagnosticQuiz";
import { Dashboard } from "@/components/Dashboard";
import { ExerciseModule } from "@/components/ExerciseModule";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, Trophy, Users } from "lucide-react";

type AppState = "welcome" | "level-selection" | "quiz" | "dashboard" | "exercises";

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>("welcome");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [quizResults, setQuizResults] = useState<any>(null);

  const handleLevelSelect = (level: string) => {
    setSelectedLevel(level);
    setCurrentState("quiz");
  };

  const handleQuizComplete = (results: any) => {
    setQuizResults(results);
    setCurrentState("dashboard");
  };

  const handleStartExercises = () => {
    setCurrentState("exercises");
  };

  const handleBackToDashboard = () => {
    setCurrentState("dashboard");
  };

  if (currentState === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              MathMentor
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Ton assistant pédagogique personnalisé pour exceller en mathématiques
            </p>
            <p className="text-lg opacity-80 mb-12">
              Programme officiel • Tests adaptatifs • Suivi des progrès • Exercices interactifs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <BookOpen className="h-8 w-8 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Cours adaptés</h3>
              <p className="text-sm opacity-80">Programme officiel de l'Éducation nationale</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <Brain className="h-8 w-8 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">IA personnalisée</h3>
              <p className="text-sm opacity-80">Parcours adapté à ton niveau et tes besoins</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <Trophy className="h-8 w-8 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Progression</h3>
              <p className="text-sm opacity-80">Badges, points et suivi détaillé</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <Users className="h-8 w-8 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Accompagnement</h3>
              <p className="text-sm opacity-80">Pour élèves, parents et enseignants</p>
            </div>
          </div>

          <Button
            size="lg"
            onClick={() => setCurrentState("level-selection")}
            className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4 h-auto font-semibold"
          >
            Commencer mon parcours
          </Button>
        </div>
      </div>
    );
  }

  if (currentState === "level-selection") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LevelSelector onLevelSelect={handleLevelSelect} />
      </div>
    );
  }

  if (currentState === "quiz") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <DiagnosticQuiz level={selectedLevel} onComplete={handleQuizComplete} />
      </div>
    );
  }

  if (currentState === "dashboard") {
    return (
      <div className="min-h-screen bg-background">
        <Dashboard 
          studentData={quizResults} 
          onStartExercises={handleStartExercises}
        />
      </div>
    );
  }

  if (currentState === "exercises") {
    return (
      <div className="min-h-screen bg-background">
        <ExerciseModule 
          level={selectedLevel} 
          onBack={handleBackToDashboard}
        />
      </div>
    );
  }

  return null;
};

export default Index;
