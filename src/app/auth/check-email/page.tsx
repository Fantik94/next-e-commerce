'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, RefreshCw, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

export default function CheckEmailPage() {
  const [isResending, setIsResending] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      // Ici on pourrait ajouter une fonction pour renvoyer l'email
      // Pour l'instant, on simule juste
      await new Promise(resolve => setTimeout(resolve, 2000));
      showSuccess('Email renvoyé !', 'Vérifiez votre boîte mail et vos spams.');
    } catch (error) {
      showError('Erreur', 'Impossible de renvoyer l\'email. Réessayez plus tard.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Mail className="h-16 w-16 text-blue-500" />
              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            Vérifiez votre email
          </CardTitle>
          <CardDescription className="text-base">
            Nous avons envoyé un lien de confirmation à votre adresse email.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">
              Prochaines étapes :
            </h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Ouvrez votre boîte mail</li>
              <li>Cherchez un email de DigitalFADA</li>
              <li>Cliquez sur le lien de confirmation</li>
              <li>Revenez ici pour vous connecter</li>
            </ol>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>💡 Astuce :</strong> Si vous ne voyez pas l'email, vérifiez votre dossier spam ou courrier indésirable.
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleResendEmail}
              disabled={isResending}
              variant="outline" 
              className="w-full"
            >
              {isResending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Renvoyer l'email
                </>
              )}
            </Button>

            <Button asChild className="w-full">
              <Link href="/login">
                J'ai confirmé mon email
              </Link>
            </Button>

            <Button variant="ghost" asChild className="w-full">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Vous avez des problèmes ? {' '}
              <Link href="/contact" className="text-primary hover:underline">
                Contactez-nous
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
