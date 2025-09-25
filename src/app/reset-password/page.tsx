'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Form, FormField, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { getPasswordStrength } from '@/lib/auth-validation';

// Schéma pour la réinitialisation du mot de passe
const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .max(128, 'Le mot de passe ne peut pas dépasser 128 caractères')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Le mot de passe doit contenir au moins : 1 minuscule, 1 majuscule, 1 chiffre et 1 caractère spécial'),
  
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');
  const passwordStrength = password ? getPasswordStrength(password) : null;

  // Vérifier la validité du token au chargement
  useEffect(() => {
    if (!token) {
      setIsValidToken(false);
      return;
    }

    // Simulation de vérification du token
    const verifyToken = async () => {
      try {
        // En réalité, ici on ferait un appel API pour vérifier le token
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Simulation: token invalide si il contient "invalid"
        if (token.includes('invalid')) {
          setIsValidToken(false);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du token:', error);
        setIsValidToken(false);
      }
    };

    verifyToken();
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    
    try {
      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Réinitialisation du mot de passe pour le token:', token);
      console.log('Nouveau mot de passe défini');
      
      // Marquer comme réinitialisé
      setIsPasswordReset(true);
      
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    router.push('/login');
  };

  // Token invalide ou manquant
  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gray-50 relative">
        <div className="absolute top-6 left-6 z-10">
          <Button variant="ghost" asChild>
            <Link href="/login">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la connexion
            </Link>
          </Button>
        </div>

        <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl w-full">
            <Card>
              <CardHeader className="space-y-1 pb-6">
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
                <CardTitle className="text-2xl text-center text-red-600">
                  Lien invalide
                </CardTitle>
                <CardDescription className="text-center">
                  Ce lien de réinitialisation est invalide ou a expiré.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Les liens de réinitialisation expirent après 1 heure pour des raisons de sécurité.
                  </p>
                  
                  <div className="space-y-3">
                    <Button className="w-full" asChild>
                      <Link href="/forgot-password">
                        Demander un nouveau lien
                      </Link>
                    </Button>
                    
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/login">
                        Retourner à la connexion
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="max-w-xl w-full">

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

            {!isPasswordReset ? (
              <>
                <CardTitle className="text-2xl text-center">
                  Nouveau mot de passe
                </CardTitle>
                <CardDescription className="text-center">
                  Choisissez un nouveau mot de passe sécurisé pour votre compte.
                </CardDescription>
              </>
            ) : (
              <>
                <CardTitle className="text-2xl text-center text-green-600">
                  Mot de passe mis à jour !
                </CardTitle>
                <CardDescription className="text-center">
                  Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent>
            {!isPasswordReset ? (
              <Form onSubmit={handleSubmit(onSubmit)}>
                
                {/* Nouveau mot de passe */}
                <FormField>
                  <FormLabel htmlFor="password" required>
                    Nouveau mot de passe
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...register('password')}
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Choisissez un mot de passe sécurisé"
                        className="pl-10 pr-10"
                        autoComplete="new-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  
                  {/* Indicateur de force du mot de passe */}
                  {password && passwordStrength && (
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Force du mot de passe :</span>
                        <span className={`font-medium ${
                          passwordStrength.score <= 2 ? 'text-red-500' :
                          passwordStrength.score <= 4 ? 'text-yellow-500' :
                          'text-green-500'
                        }`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${(passwordStrength.score / 7) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <FormMessage>{errors.password?.message}</FormMessage>
                </FormField>

                {/* Confirmation mot de passe */}
                <FormField>
                  <FormLabel htmlFor="confirmPassword" required>
                    Confirmer le mot de passe
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...register('confirmPassword')}
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirmez votre nouveau mot de passe"
                        className="pl-10 pr-10"
                        autoComplete="new-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage>{errors.confirmPassword?.message}</FormMessage>
                </FormField>

                {/* Bouton de réinitialisation */}
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Mise à jour...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Mettre à jour le mot de passe
                    </>
                  )}
                </Button>
              </Form>
            ) : (
              /* État après réinitialisation */
              <div className="space-y-6">
                {/* Icône de succès */}
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>

                {/* Message de succès */}
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Votre mot de passe a été mis à jour avec succès.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
                  </p>
                </div>

                {/* Bouton vers la connexion */}
                <Button 
                  className="w-full" 
                  onClick={handleGoToLogin}
                >
                  Se connecter maintenant
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}
