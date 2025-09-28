'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/useToast';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔄 Traitement du callback OAuth...');
        
        // Attendre un peu pour laisser Supabase traiter l'URL automatiquement
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Maintenant récupérer la session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Erreur lors du callback:', error);
          showError('Erreur d\'authentification', 'Une erreur s\'est produite lors de la connexion.');
          router.push('/login?error=auth-callback-error');
          return;
        }

        if (data.session) {
          console.log('✅ Authentification réussie via OAuth !');
          showSuccess('Connexion réussie !', 'Vous êtes maintenant connecté avec Google.');
          
          // Redirection immédiate
          router.push('/');
        } else {
          console.log('ℹ️ Aucune session trouvée, attente de l\'événement auth...');
          
          // Écouter les changements d'authentification
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
              console.log('🔄 Auth state change dans callback:', event);
              
              if (event === 'SIGNED_IN' && session) {
                console.log('✅ Connexion détectée via auth state change !');
                showSuccess('Connexion réussie !', 'Vous êtes maintenant connecté avec Google.');
                subscription.unsubscribe();
                router.push('/');
              } else if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
                console.log('❌ Échec de la connexion');
                subscription.unsubscribe();
                router.push('/login');
              }
            }
          );
          
          // Timeout de sécurité
          setTimeout(() => {
            subscription.unsubscribe();
            console.log('⏰ Timeout du callback, redirection vers login');
            router.push('/login');
          }, 10000);
        }
      } catch (error) {
        console.error('❌ Erreur inattendue lors du callback:', error);
        showError('Erreur d\'authentification', 'Une erreur inattendue s\'est produite.');
        router.push('/login?error=auth-callback-error');
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [router, showSuccess, showError]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {isProcessing ? 'Finalisation de la connexion...' : 'Redirection en cours...'}
        </h2>
        <p className="text-gray-600">
          {isProcessing 
            ? 'Veuillez patienter pendant que nous vous connectons avec Google.' 
            : 'Vous allez être redirigé dans un instant.'
          }
        </p>
      </div>
    </div>
  );
}
