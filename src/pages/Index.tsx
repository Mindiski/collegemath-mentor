// Update this page (the content is just a fallback if you fail to update the page)

import { useState } from "react";
import { WelcomeHeader } from "@/components/WelcomeHeader";
import { LevelSelector } from "@/components/LevelSelector";
import { DiagnosticQuiz } from "@/components/DiagnosticQuiz";
import { Dashboard } from "@/components/Dashboard";
import { ExerciseModule } from "@/components/ExerciseModule";
import { ResultsModal } from "@/components/ResultsModal";

type AppState = "welcome" | "level-selection" | "quiz" | "results" | "dashboard" | "exercises";

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
    setCurrentState("results");
  };

  const handleViewDashboard = () => {
    setCurrentState("dashboard");
  };

  const handleRetakeQuiz = () => {
    setCurrentState("quiz");
  };

  const handleStartExercises = () => {
    setCurrentState("exercises");
  };

  const handleBackToDashboard = () => {
    setCurrentState("dashboard");
  };

  if (currentState === "welcome") {
    return <WelcomeHeader onGetStarted={() => setCurrentState("level-selection")} />;
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

  if (currentState === "results") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <ResultsModal 
          results={quizResults} 
          onContinue={handleViewDashboard}
          onRetake={handleRetakeQuiz}
        />
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
