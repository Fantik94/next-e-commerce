'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import BackToHome from '@/components/ui/back-to-home';
import ProfileHeader from '@/components/profile/profile-header';
import ProfileContent from '@/components/profile/profile-content';

export default function ProfilePage() {
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
          <p className="text-muted-foreground">Chargement de votre profil...</p>
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
      <BackToHome href="/" label="Retour à l'accueil" />
      
      {/* Contenu principal */}
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
        <ProfileHeader />
        <ProfileContent />
      </div>
    </div>
  );
}