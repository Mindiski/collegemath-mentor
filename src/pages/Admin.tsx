import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ResourceCompiler from '@/components/ResourceCompiler';
import AIQuestionGenerator from '@/components/AIQuestionGenerator';
import { useUserRole } from '@/hooks/useUserRole';
import { Settings, LogOut, Shield, Database, Brain, AlertTriangle } from 'lucide-react';

const Admin = () => {
  const { user, signOut } = useAuth();
  const { isAdmin, loading } = useUserRole();
  const [activeTab, setActiveTab] = useState('resources');

  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Show loading while checking role
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-8 w-8 text-primary mx-auto mb-2 animate-spin" />
          <p className="text-muted-foreground">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  // Check if user is admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
            <CardTitle>Accès Restreint</CardTitle>
            <CardDescription>
              Cette page est réservée aux administrateurs de la plateforme Mathematica.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Vous n'avez pas les permissions nécessaires pour accéder à cette section.
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => window.history.back()}>
                Retour
              </Button>
              <Button onClick={signOut}>
                Se déconnecter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Administration Mathematica</h1>
                <p className="text-sm text-muted-foreground">
                  Gestion des agents IA et des ressources éducatives
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Ressources
            </TabsTrigger>
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Générateur IA
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resources" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Agent de Compilation des Ressources</CardTitle>
                  <CardDescription>
                    Gérez la compilation automatique des ressources éducatives 
                    officielles (Eduscol, programmes, évaluations nationales).
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResourceCompiler />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="generator" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Générateur de Questions IA</CardTitle>
                  <CardDescription>
                    Testez et configurez l'agent IA qui génère des questions 
                    mathématiques adaptées basées sur les ressources officielles.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AIQuestionGenerator />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuration des Agents IA</CardTitle>
                  <CardDescription>
                    Paramètres et configuration des agents d'intelligence artificielle.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Agent de Compilation</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Recherche et compile automatiquement les ressources éducatives
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Dernière compilation:</span>
                          <span className="text-muted-foreground">Il y a 2 jours</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ressources actives:</span>
                          <span className="text-green-600">127</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Statut:</span>
                          <span className="text-green-600">Opérationnel</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Agent Générateur</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Génère des questions mathématiques en temps réel
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Questions générées:</span>
                          <span className="text-blue-600">1,247</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Taux de succès:</span>
                          <span className="text-green-600">98.5%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Statut:</span>
                          <span className="text-green-600">Opérationnel</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-3">Paramètres système</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between p-3 bg-muted rounded">
                        <div>
                          <span className="font-medium">Compilation automatique</span>
                          <p className="text-muted-foreground">Mise à jour hebdomadaire des ressources</p>
                        </div>
                        <div className="text-green-600">Activée</div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted rounded">
                        <div>
                          <span className="font-medium">Cache des questions</span>
                          <p className="text-muted-foreground">Optimisation des performances</p>
                        </div>
                        <div className="text-green-600">Activé</div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted rounded">
                        <div>
                          <span className="font-medium">Logs détaillés</span>
                          <p className="text-muted-foreground">Suivi des opérations IA</p>
                        </div>
                        <div className="text-green-600">Activés</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informations Système</CardTitle>
                  <CardDescription>
                    Statut et métriques de la plateforme MathMentor.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="font-bold text-2xl text-blue-600">12</div>
                      <div className="text-muted-foreground">Niveaux scolaires</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="font-bold text-2xl text-green-600">24</div>
                      <div className="text-muted-foreground">Thèmes mathématiques</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="font-bold text-2xl text-purple-600">127</div>
                      <div className="text-muted-foreground">Ressources actives</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;