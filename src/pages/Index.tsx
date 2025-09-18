// Update this page (the content is just a fallback if you fail to update the page)

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { WelcomeHeader } from "@/components/WelcomeHeader";
import { LevelSelector } from "@/components/LevelSelector";
import { DiagnosticQuiz } from "@/components/DiagnosticQuiz";
import { Dashboard } from "@/components/Dashboard";
import { ExerciseModule } from "@/components/ExerciseModule";
import { ResultsModal } from "@/components/ResultsModal";
import { LogOut } from "lucide-react";

type AppState = "welcome" | "level-selection" | "quiz" | "results" | "dashboard" | "exercises";

const Index = () => {
  const { user, loading, signOut, isGuest, exitGuestMode } = useAuth();
  const navigate = useNavigate();
  const [currentState, setCurrentState] = useState<AppState>("welcome");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [quizResults, setQuizResults] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user && !isGuest) {
      navigate("/auth");
    }
  }, [user, loading, isGuest, navigate]);

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

  const handleSignOut = async () => {
    if (isGuest) {
      exitGuestMode();
    } else {
      await signOut();
    }
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Chargement...</div>
      </div>
    );
  }

  if (!user && !isGuest) {
    return null;
  }

  // Show sign-out button on all pages except welcome
  const showSignOutButton = currentState !== "welcome";

  if (currentState === "welcome") {
    return (
      <div className="relative">
        <div className="absolute top-4 right-4 z-50">
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            {isGuest ? "Quitter mode invité" : "Déconnexion"}
          </Button>
        </div>
        <WelcomeHeader onGetStarted={() => setCurrentState("level-selection")} />
      </div>
    );
  }

  if (currentState === "level-selection") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        {showSignOutButton && (
          <div className="absolute top-4 right-4 z-50">
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        )}
        <LevelSelector onLevelSelect={handleLevelSelect} />
      </div>
    );
  }

  if (currentState === "quiz") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        {showSignOutButton && (
          <div className="absolute top-4 right-4 z-50">
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        )}
        <DiagnosticQuiz level={selectedLevel} onComplete={handleQuizComplete} />
      </div>
    );
  }

  if (currentState === "results") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        {showSignOutButton && (
          <div className="absolute top-4 right-4 z-50">
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        )}
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
        {showSignOutButton && (
          <div className="absolute top-4 right-4 z-50">
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        )}
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
        {showSignOutButton && (
          <div className="absolute top-4 right-4 z-50">
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        )}
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
