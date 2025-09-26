'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: 'user' | 'admin';
  
  // Informations personnelles e-commerce
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  
  // Adresse par défaut
  defaultAddress?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    isBilling: boolean;
  };
  
  // Préférences e-commerce
  newsletterSubscribed: boolean;
  marketingEmails: boolean;
  orderNotifications: boolean;
  languagePreference: 'fr' | 'en' | 'es' | 'de';
  currencyPreference: 'EUR' | 'USD' | 'GBP';
  
  // Informations de connexion
  authProvider: 'email' | 'google' | 'facebook' | 'apple';
  isOAuthUser: boolean;
  oauthProviderId?: string;
  
  // Préférences d'affichage
  themePreference: 'light' | 'dark' | 'system';
  
  // Informations de sécurité
  twoFactorEnabled: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  
  // Métadonnées
  lastLoginAt?: Date;
  lastOrderAt?: Date;
  totalOrders: number;
  totalSpent: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

interface AuthContextType {
  user: UserProfile | null;
  supabaseUser: SupabaseUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fonction pour récupérer le profil utilisateur depuis la table profiles
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Erreur lors de la récupération du profil:', error);
        return null;
      }

      return {
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        avatar: data.avatar_url,
        role: data.role,
        
        // Informations personnelles e-commerce
        phone: data.phone,
        dateOfBirth: data.date_of_birth ? new Date(data.date_of_birth) : undefined,
        gender: data.gender,
        
        // Adresse par défaut
        defaultAddress: data.default_address,
        
        // Préférences e-commerce
        newsletterSubscribed: data.newsletter_subscribed ?? false,
        marketingEmails: data.marketing_emails ?? false,
        orderNotifications: data.order_notifications ?? true,
        languagePreference: data.language_preference ?? 'fr',
        currencyPreference: data.currency_preference ?? 'EUR',
        
        // Informations de connexion
        authProvider: data.auth_provider ?? 'email',
        isOAuthUser: data.is_oauth_user ?? false,
        oauthProviderId: data.oauth_provider_id,
        
        // Préférences d'affichage
        themePreference: data.theme_preference ?? 'system',
        
        // Informations de sécurité
        twoFactorEnabled: data.two_factor_enabled ?? false,
        emailVerified: data.email_verified ?? false,
        phoneVerified: data.phone_verified ?? false,
        
        // Métadonnées
        lastLoginAt: data.last_login_at ? new Date(data.last_login_at) : undefined,
        lastOrderAt: data.last_order_at ? new Date(data.last_order_at) : undefined,
        totalOrders: data.total_orders ?? 0,
        totalSpent: data.total_spent ?? 0,
        
        // Timestamps
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
    } catch (error) {
      console.error('❌ Erreur inattendue:', error);
      return null;
    }
  };

  // Gestion des changements de session
  useEffect(() => {
    // Récupérer la session initiale
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Erreur lors de la récupération de la session:', error.message);
        } else if (session) {
          setSession(session);
          setSupabaseUser(session.user);
          
          // Récupérer le profil utilisateur
          const profile = await fetchUserProfile(session.user.id);
          setUser(profile);
        }
      } catch (error) {
        console.error('❌ Erreur inattendue:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event);
        setSession(session);
        setSupabaseUser(session?.user ?? null);
        
        if (session?.user) {
          // Récupérer le profil utilisateur
          const profile = await fetchUserProfile(session.user.id);
          setUser(profile);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Connexion avec email/mot de passe
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      console.log('✅ Connexion réussie !');
      return { success: true };
    } catch (error: any) {
      console.error('❌ Erreur de connexion:', error);
      return { success: false, error: 'Une erreur inattendue s\'est produite.' };
    } finally {
      setIsLoading(false);
    }
  };

  // Inscription avec email/mot de passe
  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      console.log('✅ Inscription réussie !');
      return { success: true };
    } catch (error: any) {
      console.error('❌ Erreur d\'inscription:', error);
      return { success: false, error: 'Une erreur inattendue s\'est produite.' };
    } finally {
      setIsLoading(false);
    }
  };

  // Connexion avec Google
  const loginWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('❌ Erreur de connexion Google:', error);
      return { success: false, error: 'Une erreur inattendue s\'est produite.' };
    }
  };

  // Déconnexion
  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Erreur lors de la déconnexion:', error);
      } else {
        console.log('✅ Déconnexion réussie !');
      }
    } catch (error) {
      console.error('❌ Erreur inattendue lors de la déconnexion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Réinitialisation du mot de passe
  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('❌ Erreur de réinitialisation:', error);
      return { success: false, error: 'Une erreur inattendue s\'est produite.' };
    }
  };

  // Mise à jour du profil
  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) {
      return { success: false, error: 'Utilisateur non connecté.' };
    }

    try {
      const updateData: any = {};
      
      // Mapper les champs du frontend vers la base de données
      if (data.firstName !== undefined) updateData.first_name = data.firstName;
      if (data.lastName !== undefined) updateData.last_name = data.lastName;
      if (data.avatar !== undefined) updateData.avatar_url = data.avatar;
      if (data.phone !== undefined) updateData.phone = data.phone;
      if (data.dateOfBirth !== undefined) updateData.date_of_birth = data.dateOfBirth?.toISOString().split('T')[0];
      if (data.gender !== undefined) updateData.gender = data.gender;
      if (data.defaultAddress !== undefined) updateData.default_address = data.defaultAddress;
      if (data.newsletterSubscribed !== undefined) updateData.newsletter_subscribed = data.newsletterSubscribed;
      if (data.marketingEmails !== undefined) updateData.marketing_emails = data.marketingEmails;
      if (data.orderNotifications !== undefined) updateData.order_notifications = data.orderNotifications;
      if (data.languagePreference !== undefined) updateData.language_preference = data.languagePreference;
      if (data.currencyPreference !== undefined) updateData.currency_preference = data.currencyPreference;
      if (data.themePreference !== undefined) updateData.theme_preference = data.themePreference;

      const { error } = await supabase
        .from('profiles')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      // Mettre à jour le state local
      setUser(prev => prev ? { ...prev, ...data, updatedAt: new Date() } : null);
      
      return { success: true };
    } catch (error: any) {
      console.error('❌ Erreur de mise à jour du profil:', error);
      return { success: false, error: 'Une erreur inattendue s\'est produite.' };
    }
  };

  const value: AuthContextType = {
    user,
    supabaseUser,
    session,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    loginWithGoogle,
    logout,
    resetPassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};