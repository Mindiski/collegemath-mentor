import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useGuestData, GuestProgress } from "@/hooks/useGuestData";
import { BookOpen, Trophy, Target, X } from "lucide-react";

interface GuestPromptProps {
  onClose: () => void;
}

export const GuestPrompt = ({ onClose }: GuestPromptProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { exitGuestMode } = useAuth();
  const { guestData, clearGuestData } = useGuestData();

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            guestProgress: guestData, // Save guest progress in metadata
          },
        },
      });

      if (error) {
        toast({
          title: "Erreur d'inscription",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Compte créé !",
          description: "Vérifiez votre email pour confirmer votre compte. Vos progrès ont été sauvegardés.",
        });
        clearGuestData();
        exitGuestMode();
        onClose();
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-2 right-2"
        >
          <X className="h-4 w-4" />
        </Button>
        
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sauvegardez vos progrès !</CardTitle>
          <CardDescription>
            Créez un compte pour ne pas perdre vos résultats
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-2">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">{guestData.exercisesCompleted}</div>
              <div className="text-xs text-muted-foreground">Exercices</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-2">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">{guestData.lessonsViewed}</div>
              <div className="text-xs text-muted-foreground">Leçons</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-2">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">{guestData.quizResults.length}</div>
              <div className="text-xs text-muted-foreground">Quiz</div>
            </div>
          </div>

          {guestData.selectedLevel && (
            <div className="text-center">
              <Badge variant="secondary">Niveau: {guestData.selectedLevel}</Badge>
            </div>
          )}

          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                type="text"
                placeholder="Votre nom complet"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre.email@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimum 6 caractères"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Création du compte..." : "Créer mon compte"}
              </Button>
              <Button type="button" variant="ghost" onClick={onClose} className="w-full">
                Continuer plus tard
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};