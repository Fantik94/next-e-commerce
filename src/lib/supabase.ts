import { createClient } from '@supabase/supabase-js';

// Récupération des variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Validation des variables d'environnement
if (!supabaseUrl) {
  throw new Error('❌ NEXT_PUBLIC_SUPABASE_URL manquante dans .env.local');
}

if (!supabaseAnonKey) {
  throw new Error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY manquante dans .env.local');
}

// Création du client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Configuration de l'authentification
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // URL de redirection après authentification
    flowType: 'pkce', // Recommandé pour Next.js
  },
  // Configuration globale
  global: {
    headers: {
      'X-Client-Info': 'digitalfada-shop@1.0.0',
    },
  },
});

// Types pour l'authentification
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

// Types pour la base de données (à étendre plus tard)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>;
      };
      // À ajouter : products, orders, categories, etc.
    };
  };
}

// Client typé (à utiliser plus tard quand on aura les tables)
// export const supabaseTyped = createClient<Database>(supabaseUrl, supabaseAnonKey);

export default supabase;
