'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/useToast';

type ConfirmationState = 'loading' | 'success' | 'error' | 'expired' | 'already_confirmed';

export default function ConfirmEmailPage() {
  const [state, setState] = useState<ConfirmationState>('loading');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Récupérer les paramètres de l'URL
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        console.log('🔄 Confirmation email - Paramètres:', { token, type });

        if (!token || !type) {
          setState('error');
          setMessage('Lien de confirmation invalide. Paramètres manquants.');
          return;
        }

        if (type !== 'signup') {
          setState('error');
          setMessage('Type de confirmation non supporté.');
          return;
        }

        // Vérifier et confirmer l'email avec Supabase
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup'
        });

        console.log('📊 Résultat confirmation:', { data, error });

        if (error) {
          console.error('❌ Erreur confirmation:', error);
          
          if (error.message.includes('expired')) {
            setState('expired');
            setMessage('Le lien de confirmation a expiré. Veuillez vous inscrire à nouveau.');
          } else if (error.message.includes('already_confirmed')) {
            setState('already_confirmed');
            setMessage('Votre email est déjà confirmé. Vous pouvez vous connecter.');
          } else {
            setState('error');
            setMessage(error.message || 'Erreur lors de la confirmation de l\'email.');
          }
          return;
        }

        if (data.user) {
          console.log('✅ Email confirmé avec succès pour:', data.user.email);
          setState('success');
          setMessage('Votre email a été confirmé avec succès !');
          showSuccess('Email confirmé !', 'Votre compte est maintenant actif. Bienvenue !');
          
          // Redirection automatique après 3 secondes
          setTimeout(() => {
            router.push('/');
          }, 3000);
        } else {
          setState('error');
          setMessage('Aucune donnée utilisateur retournée.');
        }

      } catch (error: any) {
        console.error('❌ Erreur inattendue lors de la confirmation:', error);
        setState('error');
        setMessage('Une erreur inattendue s\'est produite.');
      }
    };

    confirmEmail();
  }, [searchParams, router, showSuccess, showError]);

  const getIcon = () => {
    switch (state) {
      case 'loading':
        return <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case 'already_confirmed':
        return <CheckCircle className="h-16 w-16 text-blue-500" />;
      case 'error':
      case 'expired':
        return <XCircle className="h-16 w-16 text-red-500" />;
      default:
        return <Mail className="h-16 w-16 text-gray-400" />;
    }
  };

  const getTitle = () => {
    switch (state) {
      case 'loading':
        return 'Confirmation en cours...';
      case 'success':
        return 'Email confirmé !';
      case 'already_confirmed':
        return 'Email déjà confirmé';
      case 'expired':
        return 'Lien expiré';
      case 'error':
        return 'Erreur de confirmation';
      default:
        return 'Confirmation d\'email';
    }
  };

  const getActions = () => {
    switch (state) {
      case 'success':
        return (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center">
              Redirection automatique dans 3 secondes...
            </p>
            <Button asChild className="w-full">
              <Link href="/">
                Aller à l'accueil
              </Link>
            </Button>
          </div>
        );
      
      case 'already_confirmed':
        return (
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/login">
                Se connecter
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Link>
            </Button>
          </div>
        );
      
      case 'expired':
        return (
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/register">
                S'inscrire à nouveau
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/login">
                Se connecter
              </Link>
            </Button>
          </div>
        );
      
      case 'error':
        return (
          <div className="space-y-3">
            <Button variant="outline" asChild className="w-full">
              <Link href="/register">
                Réessayer l'inscription
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Link>
            </Button>
          </div>
        );
      
      case 'loading':
      default:
        return (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Veuillez patienter pendant la vérification...
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            {getIcon()}
          </div>
          <CardTitle className="text-2xl font-bold">
            {getTitle()}
          </CardTitle>
          <CardDescription className="text-base">
            {message}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {getActions()}
        </CardContent>
      </Card>
    </div>
  );
}
