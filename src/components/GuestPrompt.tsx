import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Save, 
  Star, 
  TrendingUp, 
  Gift,
  ArrowRight,
  X
} from "lucide-react";

interface GuestPromptProps {
  onSignUp: () => void;
  onContinueAsGuest: () => void;
  trigger: 'quiz_complete' | 'exercise_complete' | 'dashboard_view';
}

export function GuestPrompt({ onSignUp, onContinueAsGuest, trigger }: GuestPromptProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const getPromptContent = () => {
    switch (trigger) {
      case 'quiz_complete':
        return {
          title: "Bravo ! 🎉 Créez votre compte pour sauvegarder vos résultats",
          description: "Vos progrès en mode invité ne sont pas sauvegardés. Créez un compte gratuit pour ne rien perdre",
          benefits: [
            "Sauvegarde automatique de tous vos progrès",
            "Accès aux statistiques détaillées",
            "Badges et récompenses personnalisés",
            "Recommandations IA personnalisées"
          ]
        };
      case 'exercise_complete':
        return {
          title: "Super travail ! 💪 Sauvegardez vos progrès",
          description: "Continuez à progresser sans perdre vos efforts. Créez votre compte Mathematica",
          benefits: [
            "Suivi détaillé de votre progression",
            "Exercices adaptés à votre niveau",
            "Tableau de bord personnalisé",
            "Synchronisation multi-appareils"
          ]
        };
      default:
        return {
          title: "Explorez tout Mathematica ! ✨",
          description: "Débloquez toutes les fonctionnalités avec un compte gratuit",
          benefits: [
            "Accès complet à tous les niveaux",
            "Suivi de progression avancé", 
            "Communauté d'apprentissage",
            "Support pédagogique"
          ]
        };
    }
  };

  const content = getPromptContent();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md shadow-floating animate-in fade-in-0 zoom-in-95 duration-300">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="absolute top-2 right-2 p-1 h-auto"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-mathematica flex items-center justify-center">
              <Gift className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl">{content.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            {content.description}
          </p>

          <div className="space-y-3">
            {content.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-gradient-primary flex-shrink-0" />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              <Star className="w-3 h-3 mr-1" />
              100% Gratuit
            </Badge>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={onSignUp}
              className="w-full"
              size="lg"
            >
              <User className="mr-2 h-4 w-4" />
              Créer mon compte gratuit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => {
                setIsVisible(false);
                onContinueAsGuest();
              }}
              className="w-full"
            >
              Continuer en mode invité
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}