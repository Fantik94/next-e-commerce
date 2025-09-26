'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Form, FormField, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { signInSchema, type SignInFormData, sanitizeInput } from '@/lib/auth-validation';
import { useAuth } from '@/hooks/useAuth';
import BackToHome from '@/components/ui/back-to-home';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { isAuthenticated, login, loginWithGoogle } = useAuth();
  const router = useRouter();

  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    
    try {
      const sanitizedEmail = sanitizeInput(data.email);
      const result = await login(sanitizedEmail, data.password);
      
      if (result.success) {
        // La redirection se fera automatiquement grâce à useEffect
        console.log('✅ Connexion réussie !');
      } else {
        // Afficher l'erreur (tu peux ajouter toast plus tard)
        console.error('❌ Erreur:', result.error);
        alert(result.error || 'Erreur de connexion');
      }
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
      alert('Une erreur inattendue s\'est produite.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await loginWithGoogle();
      
      if (result.success) {
        console.log('✅ Redirection vers Google...');
      } else {
        console.error('❌ Erreur Google:', result.error);
        alert(result.error || 'Erreur de connexion Google');
      }
    } catch (error) {
      console.error('❌ Erreur Google:', error);
      alert('Une erreur inattendue s\'est produite.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Bouton retour en haut à gauche */}
      <BackToHome />

      <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full">{/* Largeur réduite pour un meilleur équilibre */}

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
            <CardTitle className="text-2xl text-center">
              Connexion à <span className="text-primary">DigitalFADA</span>
            </CardTitle>
            <CardDescription className="text-center">
              Connectez-vous pour accéder à votre compte
            </CardDescription>
          </CardHeader>

          <CardContent>
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
                    />
                  </div>
                </FormControl>
                <FormMessage>{errors.email?.message}</FormMessage>
              </FormField>

              {/* Mot de passe */}
              <FormField>
                <FormLabel htmlFor="password" required>
                  Mot de passe
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...register('password')}
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Votre mot de passe"
                      className="pl-10 pr-10"
                      autoComplete="current-password"
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
                <FormMessage>{errors.password?.message}</FormMessage>
              </FormField>

              {/* Options */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={watch('rememberMe')}
                    onCheckedChange={(checked) => setValue('rememberMe', !!checked)}
                  />
                  <label 
                    htmlFor="rememberMe" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Se souvenir de moi
                  </label>
                </div>
                
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-primary hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              {/* Bouton de connexion */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Connexion...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Se connecter
                  </>
                )}
              </Button>

              {/* Séparateur */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    ou continuer avec
                  </span>
                </div>
              </div>

              {/* Connexion Google */}
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={handleGoogleSignIn}
              >
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuer avec Google
              </Button>
            </Form>

            {/* Lien vers inscription */}
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Pas encore de compte ? </span>
              <Link href="/register" className="text-primary hover:underline font-medium">
                Créer un compte
              </Link>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}
