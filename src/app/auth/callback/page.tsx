'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Erreur lors du callback:', error);
          router.push('/login?error=auth-callback-error');
          return;
        }

        if (data.session) {
          console.log('✅ Authentification réussie via OAuth !');
          router.push('/');
        } else {
          console.log('ℹ️ Aucune session trouvée');
          router.push('/login');
        }
      } catch (error) {
        console.error('❌ Erreur inattendue lors du callback:', error);
        router.push('/login?error=auth-callback-error');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Finalisation de la connexion...
        </h2>
        <p className="text-gray-600">
          Veuillez patienter pendant que nous vous connectons.
        </p>
      </div>
    </div>
  );
}
