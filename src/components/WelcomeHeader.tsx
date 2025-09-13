import { Button } from "@/components/ui/button";
import { BookOpen, Brain, Trophy, Users, ArrowRight } from "lucide-react";
import heroImage from "@/assets/math-hero.jpg";

interface WelcomeHeaderProps {
  onGetStarted: () => void;
}

export function WelcomeHeader({ onGetStarted }: WelcomeHeaderProps) {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center relative overflow-hidden">
      {/* Background Hero Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/90">
            MathMentor
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 font-medium">
            Ton assistant pédagogique personnalisé pour exceller en mathématiques
          </p>
          <p className="text-lg opacity-80 mb-12 max-w-2xl mx-auto">
            Programme officiel • Tests adaptatifs • Suivi des progrès • Exercices interactifs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <BookOpen className="h-8 w-8 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Cours adaptés</h3>
            <p className="text-sm opacity-80">Programme officiel de l'Éducation nationale</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <Brain className="h-8 w-8 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">IA personnalisée</h3>
            <p className="text-sm opacity-80">Parcours adapté à ton niveau et tes besoins</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <Trophy className="h-8 w-8 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Progression</h3>
            <p className="text-sm opacity-80">Badges, points et suivi détaillé</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <Users className="h-8 w-8 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Accompagnement</h3>
            <p className="text-sm opacity-80">Pour élèves, parents et enseignants</p>
          </div>
        </div>

        <Button
          size="lg"
          onClick={onGetStarted}
          className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4 h-auto font-semibold shadow-floating hover:shadow-success transition-all duration-300 hover:scale-105"
        >
          Commencer mon parcours
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 text-center opacity-90">
          <div>
            <div className="text-3xl font-bold mb-2">100+</div>
            <div className="text-sm">Exercices disponibles</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">4</div>
            <div className="text-sm">Niveaux couverts</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">95%</div>
            <div className="text-sm">Taux de réussite</div>
          </div>
        </div>
      </div>
    </div>
  );
}