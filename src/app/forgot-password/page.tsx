'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Form, FormField, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { 
  forgotPasswordSchema, 
  type ForgotPasswordFormData, 
  sanitizeInput 
} from '@/lib/auth-validation';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    
    try {
      const sanitizedEmail = sanitizeInput(data.email);
      
      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Demande de réinitialisation pour:', sanitizedEmail);
      
      // Marquer comme envoyé
      setIsEmailSent(true);
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    
    try {
      const email = getValues('email');
      const sanitizedEmail = sanitizeInput(email);
      
      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Renvoi de l\'email pour:', sanitizedEmail);
      
    } catch (error) {
      console.error('Erreur lors du renvoi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Bouton retour en haut à gauche */}
      <div className="absolute top-6 left-6 z-10">
        <Button variant="ghost" asChild>
          <Link href="/login">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la connexion
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full">

        <Card>
          <CardHeader className="space-y-1 pb-6">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <div className="relative w-12 h-12">
                <Image
                  src="/images/logo.png"
                  alt="DigitalFADA.shop Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {!isEmailSent ? (
              <>
                <CardTitle className="text-2xl text-center">
                  Mot de passe oublié ?
                </CardTitle>
                <CardDescription className="text-center">
                  Pas de problème ! Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </CardDescription>
              </>
            ) : (
              <>
                <CardTitle className="text-2xl text-center text-green-600">
                  Email envoyé !
                </CardTitle>
                <CardDescription className="text-center">
                  Nous avons envoyé un lien de réinitialisation à votre adresse email. Vérifiez votre boîte de réception.
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent>
            {!isEmailSent ? (
              <Form onSubmit={handleSubmit(onSubmit)}>
                
                {/* Email */}
                <FormField>
                  <FormLabel htmlFor="email" required>
                    Adresse email
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...register('email')}
                        id="email"
                        type="email"
                        placeholder="votre@email.com"
                        className="pl-10"
                        autoComplete="email"
                        autoFocus
                      />
                    </div>
                  </FormControl>
                  <FormMessage>{errors.email?.message}</FormMessage>
                </FormField>

                {/* Bouton d'envoi */}
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Envoyer le lien de réinitialisation
                    </>
                  )}
                </Button>
              </Form>
            ) : (
              /* État après envoi */
              <div className="space-y-6">
                {/* Icône de succès */}
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>

                {/* Email envoyé à */}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Email envoyé à :
                  </p>
                  <p className="font-medium text-gray-900">
                    {getValues('email')}
                  </p>
                </div>

                {/* Instructions */}
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>• Vérifiez votre boîte de réception</p>
                  <p>• Le lien est valide pendant 1 heure</p>
                  <p>• N'oubliez pas de vérifier vos spams</p>
                </div>

                {/* Boutons d'action */}
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleResendEmail}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Renvoi en cours...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Renvoyer l'email
                      </>
                    )}
                  </Button>

                  <Button variant="ghost" className="w-full" asChild>
                    <Link href="/login">
                      Retourner à la connexion
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            {/* Lien vers inscription (seulement si pas encore envoyé) */}
            {!isEmailSent && (
              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Pas encore de compte ? </span>
                <Link href="/register" className="text-primary hover:underline font-medium">
                  Créer un compte
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}
