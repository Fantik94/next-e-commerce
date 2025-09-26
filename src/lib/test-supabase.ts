// Fichier de test pour vérifier la connexion Supabase
import { supabase } from './supabase';

export async function testSupabaseConnection() {
  try {
    console.log('🔍 Test de connexion Supabase...');
    
    // Test de base pour vérifier la connexion
    const { data, error } = await supabase
      .from('test')
      .select('*')
      .limit(1);
    
    if (error && error.code === '42P01') {
      // Table n'existe pas - c'est normal pour l'instant
      console.log('✅ Connexion Supabase réussie !');
      console.log('📋 Base de données prête (pas de tables pour l\'instant)');
      return { success: true, message: 'Connexion réussie' };
    }
    
    if (error) {
      console.error('❌ Erreur de connexion:', error);
      return { success: false, error };
    }
    
    console.log('✅ Connexion et données OK !');
    return { success: true, data };
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    return { success: false, error };
  }
}

// Test de l'authentification
export async function testSupabaseAuth() {
  try {
    console.log('🔐 Test du service d\'authentification...');
    
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Erreur auth:', error);
      return { success: false, error };
    }
    
    console.log('✅ Service d\'authentification opérationnel !');
    console.log('👤 Session actuelle:', data.session ? 'Connecté' : 'Non connecté');
    
    return { success: true, session: data.session };
    
  } catch (error) {
    console.error('❌ Erreur lors du test auth:', error);
    return { success: false, error };
  }
}
