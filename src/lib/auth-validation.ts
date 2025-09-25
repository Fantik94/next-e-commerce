import { z } from 'zod';

// Schémas de validation pour l'authentification
export const signUpSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s-']+$/, 'Le prénom ne peut contenir que des lettres, espaces, tirets et apostrophes'),
  
  lastName: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s-']+$/, 'Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes'),
  
  email: z
    .string()
    .email('Adresse email invalide')
    .min(5, 'L\'email doit contenir au moins 5 caractères')
    .max(100, 'L\'email ne peut pas dépasser 100 caractères')
    .toLowerCase(),
  
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .max(128, 'Le mot de passe ne peut pas dépasser 128 caractères')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Le mot de passe doit contenir au moins : 1 minuscule, 1 majuscule, 1 chiffre et 1 caractère spécial'),
  
  confirmPassword: z.string(),
  
  acceptTerms: z
    .boolean()
    .refine(val => val === true, 'Vous devez accepter les conditions d\'utilisation'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export const signInSchema = z.object({
  email: z
    .string()
    .email('Adresse email invalide')
    .min(5, 'L\'email doit contenir au moins 5 caractères')
    .max(100, 'L\'email ne peut pas dépasser 100 caractères')
    .toLowerCase(),
  
  password: z
    .string()
    .min(1, 'Le mot de passe est requis')
    .max(128, 'Le mot de passe ne peut pas dépasser 128 caractères'),
  
  rememberMe: z.boolean().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email('Adresse email invalide')
    .min(5, 'L\'email doit contenir au moins 5 caractères')
    .max(100, 'L\'email ne peut pas dépasser 100 caractères')
    .toLowerCase(),
});

// Types TypeScript générés à partir des schémas
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// Fonction de nettoyage et sanitisation des données
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>\"']/g, '') // Supprime les caractères dangereux pour XSS
    .slice(0, 1000); // Limite la taille pour éviter les attaques DoS
}

// Fonction de validation de la force du mot de passe
export function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[@$!%*?&]/.test(password)) score++;
  if (password.length >= 16) score++;
  
  const strength = [
    { label: 'Très faible', color: 'bg-red-500' },
    { label: 'Faible', color: 'bg-orange-500' },
    { label: 'Moyen', color: 'bg-yellow-500' },
    { label: 'Fort', color: 'bg-blue-500' },
    { label: 'Très fort', color: 'bg-green-500' },
  ];
  
  const index = Math.min(Math.floor(score / 2), strength.length - 1);
  
  return {
    score,
    label: strength[index].label,
    color: strength[index].color,
  };
}
