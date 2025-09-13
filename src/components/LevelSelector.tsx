import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Trophy, Star, Target } from "lucide-react";

const levels = [
  {
    grade: "6ème",
    title: "Sixième",
    description: "Nombres entiers, fractions, géométrie de base",
    icon: BookOpen,
    color: "bg-gradient-primary",
  },
  {
    grade: "5ème", 
    title: "Cinquième",
    description: "Calcul littéral, triangles, probabilités",
    icon: Target,
    color: "bg-gradient-success",
  },
  {
    grade: "4ème",
    title: "Quatrième", 
    description: "Théorème de Pythagore, équations, statistiques",
    icon: Trophy,
    color: "bg-gradient-creative",
  },
  {
    grade: "3ème",
    title: "Troisième",
    description: "Fonctions, trigonométrie, brevet",
    icon: Star,
    color: "bg-gradient-hero",
  },
];

interface LevelSelectorProps {
  onLevelSelect: (level: string) => void;
}

export function LevelSelector({ onLevelSelect }: LevelSelectorProps) {
  const [selectedLevel, setSelectedLevel] = useState<string>("");

  const handleLevelClick = (grade: string) => {
    setSelectedLevel(grade);
    onLevelSelect(grade);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-4">
          Choisis ta classe
        </h2>
        <p className="text-muted-foreground text-lg">
          Sélectionne ton niveau pour commencer ton parcours personnalisé
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {levels.map((level) => {
          const IconComponent = level.icon;
          const isSelected = selectedLevel === level.grade;
          
          return (
            <Card
              key={level.grade}
              className={`cursor-pointer transition-all duration-300 hover:shadow-floating transform hover:-translate-y-1 ${
                isSelected ? "ring-2 ring-primary shadow-floating" : "shadow-card"
              }`}
              onClick={() => handleLevelClick(level.grade)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-lg ${level.color} flex items-center justify-center`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {level.title}
                    </h3>
                    <span className="text-sm font-medium text-primary">
                      {level.grade}
                    </span>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  {level.description}
                </p>
                <Button
                  variant={isSelected ? "default" : "outline"}
                  className="w-full"
                  size="sm"
                >
                  {isSelected ? "Sélectionné" : "Choisir ce niveau"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}