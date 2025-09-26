-- =====================================================
-- CORRECTION DU TRIGGER D'INSCRIPTION
-- =====================================================

-- 1. Supprimer l'ancien trigger et fonction
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Créer une nouvelle fonction simplifiée et robuste
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insérer le profil de base avec gestion d'erreurs
  INSERT INTO public.profiles (
    id, 
    email, 
    first_name, 
    last_name,
    auth_provider,
    is_oauth_user,
    email_verified
  )
  VALUES (
    NEW.id,
    NEW.email,
    -- Gestion sécurisée des métadonnées utilisateur
    COALESCE(
      NEW.raw_user_meta_data->>'first_name', 
      NEW.raw_user_meta_data->>'given_name',
      split_part(NEW.email, '@', 1) -- Fallback: partie avant @ de l'email
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'last_name', 
      NEW.raw_user_meta_data->>'family_name',
      '' -- Fallback: chaîne vide
    ),
    -- Détecter le provider de manière simple
    CASE 
      WHEN NEW.raw_user_meta_data->>'provider' = 'google' THEN 'google'
      WHEN NEW.raw_user_meta_data->>'provider' = 'facebook' THEN 'facebook'
      WHEN NEW.raw_user_meta_data->>'provider' = 'apple' THEN 'apple'
      ELSE 'email'
    END,
    -- Détecter si c'est OAuth
    CASE 
      WHEN NEW.raw_user_meta_data->>'provider' IN ('google', 'facebook', 'apple') THEN true
      ELSE false
    END,
    -- Email vérifié
    COALESCE(NEW.email_confirmed_at IS NOT NULL, false)
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- En cas d'erreur, logger et créer un profil minimal
    RAISE LOG 'Erreur création profil pour user %: %', NEW.id, SQLERRM;
    
    -- Tentative de création minimale
    INSERT INTO public.profiles (id, email, auth_provider, is_oauth_user)
    VALUES (NEW.id, NEW.email, 'email', false)
    ON CONFLICT (id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Recréer le trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- FONCTION DE TEST ET NETTOYAGE
-- =====================================================

-- Fonction pour nettoyer les utilisateurs en erreur (optionnel)
CREATE OR REPLACE FUNCTION public.cleanup_failed_users()
RETURNS void AS $$
BEGIN
  -- Supprimer les utilisateurs sans profil
  DELETE FROM auth.users 
  WHERE id NOT IN (SELECT id FROM public.profiles);
  
  RAISE NOTICE 'Nettoyage terminé';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- CORRECTION TERMINÉE
-- =====================================================
