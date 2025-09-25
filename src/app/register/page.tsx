'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, User, UserPlus, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Form, FormField, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { 
  signUpSchema, 
  type SignUpFormData, 
  sanitizeInput, 
  getPasswordStrength 
} from '@/lib/auth-validation';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { isAuthenticated } = useAuth();
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
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const password = watch('password');
  const passwordStrength = password ? getPasswordStrength(password) : null;

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    
    try {
      const sanitizedData = {
        firstName: sanitizeInput(data.firstName),
        lastName: sanitizeInput(data.lastName),
        email: sanitizeInput(data.email),
        password: data.password,
        acceptTerms: data.acceptTerms,
      };
      
      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Inscription simulée:', sanitizedData);
      router.push('/login?message=account-created');
      
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    console.log('Inscription Google simulée');
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Bouton retour en haut à gauche */}
      <div className="absolute top-6 left-6 z-10">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full">{/* Encore plus large pour un meilleur équilibre */}

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
              Rejoignez <span className="text-primary">DigitalFADA</span>
            </CardTitle>
            <CardDescription className="text-center">
              Créez votre compte pour découvrir nos produits tech
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form onSubmit={handleSubmit(onSubmit)}>
              
              {/* Prénom et Nom */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{/* Responsive sur mobile */}
                <FormField>
                  <FormLabel htmlFor="firstName" required>
                    Prénom
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...register('firstName')}
                        id="firstName"
                        type="text"
                        placeholder="John"
                        className="pl-10"
                        autoComplete="given-name"
                      />
                    </div>
                  </FormControl>
                  <FormMessage>{errors.firstName?.message}</FormMessage>
                </FormField>

                <FormField>
                  <FormLabel htmlFor="lastName" required>
                    Nom
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...register('lastName')}
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        className="pl-10"
                        autoComplete="family-name"
                      />
                    </div>
                  </FormControl>
                  <FormMessage>{errors.lastName?.message}</FormMessage>
                </FormField>
              </div>

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
                      placeholder="Choisissez un mot de passe"
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
                      placeholder="Confirmez votre mot de passe"
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

              {/* Conditions d'utilisation */}
              <FormField>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="acceptTerms"
                    checked={watch('acceptTerms')}
                    onCheckedChange={(checked) => setValue('acceptTerms', !!checked)}
                    className="mt-1"
                  />
                  <div className="text-sm">
                    <label htmlFor="acceptTerms" className="cursor-pointer text-muted-foreground">
                      J'accepte les{' '}
                      <Link href="/terms" className="text-primary hover:underline">
                        conditions d'utilisation
                      </Link>{' '}
                      et la{' '}
                      <Link href="/privacy" className="text-primary hover:underline">
                        politique de confidentialité
                      </Link>
                    </label>
                  </div>
                </div>
                <FormMessage>{errors.acceptTerms?.message}</FormMessage>
              </FormField>

              {/* Bouton d'inscription */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Création en cours...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Créer mon compte
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
                    ou s'inscrire avec
                  </span>
                </div>
              </div>

              {/* Inscription Google */}
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={handleGoogleSignUp}
              >
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                S'inscrire avec Google
              </Button>
            </Form>

            {/* Lien vers connexion */}
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Vous avez déjà un compte ? </span>
              <Link href="/login" className="text-primary hover:underline font-medium">
                Se connecter
              </Link>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}
