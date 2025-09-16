import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, Database, CheckCircle, AlertCircle } from 'lucide-react';

interface CompilationStats {
  resourcesFound: number;
  resourcesProcessed: number;
  newResources: number;
  updatedResources: number;
  processingTimeMs: number;
}

const ResourceCompiler = () => {
  const [isCompiling, setIsCompiling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState<CompilationStats | null>(null);
  const { toast } = useToast();

  const startCompilation = async () => {
    setIsCompiling(true);
    setProgress(10);
    setStats(null);

    try {
      toast({
        title: "Compilation démarrée",
        description: "L'agent IA recherche les dernières ressources éducatives...",
      });

      setProgress(30);

      const { data, error } = await supabase.functions.invoke('resource-compiler', {
        body: { action: 'compile' }
      });

      setProgress(80);

      if (error) {
        throw error;
      }

      if (data?.success) {
        setStats(data.stats);
        setProgress(100);
        toast({
          title: "Compilation réussie",
          description: `${data.stats.newResources} nouvelles ressources et ${data.stats.updatedResources} mises à jour trouvées.`,
        });
      } else {
        throw new Error(data?.error || 'Erreur inconnue');
      }

    } catch (error) {
      console.error('Erreur compilation:', error);
      toast({
        title: "Erreur de compilation",
        description: error.message || "Une erreur est survenue lors de la compilation.",
        variant: "destructive",
      });
      setProgress(0);
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Agent de Compilation des Ressources
        </CardTitle>
        <CardDescription>
          Cet agent IA recherche automatiquement les dernières ressources éducatives 
          (Eduscol, programmes officiels, évaluations nationales) pour maintenir 
          la base de données à jour.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col space-y-4">
          <Button 
            onClick={startCompilation}
            disabled={isCompiling}
            className="w-full"
            size="lg"
          >
            {isCompiling ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Compilation en cours...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Lancer la compilation
              </>
            )}
          </Button>

          {isCompiling && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground text-center">
                {progress < 30 && "Initialisation de l'agent IA..."}
                {progress >= 30 && progress < 80 && "Recherche et analyse des ressources..."}
                {progress >= 80 && "Finalisation et sauvegarde..."}
              </p>
            </div>
          )}

          {stats && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Résultats de la compilation
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Ressources trouvées:</span>
                  <span className="ml-2 text-blue-600">{stats.resourcesFound}</span>
                </div>
                <div>
                  <span className="font-medium">Ressources traitées:</span>
                  <span className="ml-2 text-blue-600">{stats.resourcesProcessed}</span>
                </div>
                <div>
                  <span className="font-medium">Nouvelles ressources:</span>
                  <span className="ml-2 text-green-600">{stats.newResources}</span>
                </div>
                <div>
                  <span className="font-medium">Ressources mises à jour:</span>
                  <span className="ml-2 text-orange-600">{stats.updatedResources}</span>
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Temps de traitement:</span>
                  <span className="ml-2 text-gray-600">{(stats.processingTimeMs / 1000).toFixed(2)}s</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-blue-800">Fonctionnement de l'agent:</p>
              <ul className="mt-1 space-y-1 text-blue-700">
                <li>• Analyse les sites officiels (Eduscol, Education.gouv.fr)</li>
                <li>• Utilise l'IA pour extraire et structurer le contenu pédagogique</li>
                <li>• Met à jour automatiquement la base de données</li>
                <li>• Garde un historique des ressources pour la génération de questions</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceCompiler;