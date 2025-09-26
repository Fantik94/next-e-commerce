'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import BackToHome from '@/components/ui/back-to-home';
import AvatarUpload from '@/components/profile/avatar-upload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AvatarPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Rediriger si non connecté
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirection en cours
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Bouton retour */}
      <BackToHome href="/profile" label="Retour au profil" />
      
      {/* Contenu principal */}
      <div className="mx-auto max-w-2xl px-4 py-16">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Photo de profil</CardTitle>
            <CardDescription>
              Ajoutez ou modifiez votre photo de profil. 
              Elle sera visible sur votre profil et vos commandes.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex justify-center">
            <AvatarUpload size="lg" showUploadText={true} />
          </CardContent>
        </Card>

        {/* Conseils */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">💡 Conseils pour une bonne photo :</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Utilisez une photo récente et claire</li>
            <li>• Centrez votre visage dans l'image</li>
            <li>• Évitez les photos floues ou sombres</li>
            <li>• Format carré recommandé</li>
            <li>• Taille maximale : 5MB</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
