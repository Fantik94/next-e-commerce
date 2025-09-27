-- =====================================================
-- CORRECTION DÉFINITIVE DU SYSTÈME D'INSCRIPTION
-- =====================================================

-- 1. Supprimer l'ancien trigger et fonction
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Créer une fonction ultra-robuste
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_first_name TEXT;
  user_last_name TEXT;
  user_provider TEXT;
  is_oauth BOOLEAN;
BEGIN
  -- Log pour débogage
  RAISE LOG 'Creating profile for user: % (email: %)', NEW.id, NEW.email;
  
  -- Extraction sécurisée des métadonnées
  BEGIN
    user_first_name := COALESCE(
      NEW.raw_user_meta_data->>'first_name',
      NEW.raw_user_meta_data->>'given_name',
      split_part(NEW.email, '@', 1)
    );
    
    user_last_name := COALESCE(
      NEW.raw_user_meta_data->>'last_name',
      NEW.raw_user_meta_data->>'family_name',
      ''
    );
    
    user_provider := COALESCE(
      NEW.raw_user_meta_data->>'provider',
      'email'
    );
    
    is_oauth := CASE 
      WHEN user_provider IN ('google', 'facebook', 'apple', 'github') THEN true
      ELSE false
    END;
    
  EXCEPTION WHEN OTHERS THEN
    -- En cas d'erreur dans l'extraction, utiliser des valeurs par défaut
    user_first_name := split_part(NEW.email, '@', 1);
    user_last_name := '';
    user_provider := 'email';
    is_oauth := false;
    
    RAISE LOG 'Error extracting metadata for user %, using defaults: %', NEW.id, SQLERRM;
  END;

  -- Insertion du profil avec gestion d'erreur
  BEGIN
    INSERT INTO public.profiles (
      id,
      email,
      first_name,
      last_name,
      auth_provider,
      is_oauth_user,
      email_verified,
      role,
      newsletter_subscribed,
      marketing_emails,
      order_notifications,
      language_preference,
      currency_preference,
      theme_preference,
      two_factor_enabled,
      total_orders,
      total_spent,
      created_at,
      updated_at
    ) VALUES (
      NEW.id,
      NEW.email,
      user_first_name,
      user_last_name,
      user_provider,
      is_oauth,
      COALESCE(NEW.email_confirmed_at IS NOT NULL, false),
      'user',
      false,
      false,
      true,
      'fr',
      'EUR',
      'system',
      false,
      0,
      0.0,
      NOW(),
      NOW()
    );
    
    RAISE LOG 'Profile created successfully for user: %', NEW.id;
    
  EXCEPTION WHEN unique_violation THEN
    -- Si le profil existe déjà, on met à jour
    UPDATE public.profiles 
    SET 
      email = NEW.email,
      first_name = user_first_name,
      last_name = user_last_name,
      auth_provider = user_provider,
      is_oauth_user = is_oauth,
      email_verified = COALESCE(NEW.email_confirmed_at IS NOT NULL, false),
      updated_at = NOW()
    WHERE id = NEW.id;
    
    RAISE LOG 'Profile updated for existing user: %', NEW.id;
    
  WHEN OTHERS THEN
    -- En cas d'erreur critique, on log mais on ne fait pas échouer l'inscription
    RAISE LOG 'Critical error creating profile for user %: % (SQLSTATE: %)', NEW.id, SQLERRM, SQLSTATE;
    
    -- Tentative de création minimale
    BEGIN
      INSERT INTO public.profiles (id, email, first_name, auth_provider, is_oauth_user, role)
      VALUES (NEW.id, NEW.email, user_first_name, 'email', false, 'user')
      ON CONFLICT (id) DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
      -- Si même ça échoue, on log et on continue
      RAISE LOG 'Even minimal profile creation failed for user %: %', NEW.id, SQLERRM;
    END;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Créer le trigger avec gestion d'erreur
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- 4. Fonction pour vérifier l'intégrité
CREATE OR REPLACE FUNCTION public.check_user_integrity()
RETURNS TABLE(
  total_auth_users bigint,
  total_profiles bigint,
  orphan_users bigint,
  duplicate_emails bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM auth.users)::bigint as total_auth_users,
    (SELECT COUNT(*) FROM public.profiles)::bigint as total_profiles,
    (SELECT COUNT(*) FROM auth.users au LEFT JOIN public.profiles p ON au.id = p.id WHERE p.id IS NULL)::bigint as orphan_users,
    (SELECT COUNT(*) - COUNT(DISTINCT email) FROM auth.users)::bigint as duplicate_emails;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Politique RLS pour éviter les doublons côté application
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politique pour empêcher les doublons d'email
CREATE OR REPLACE FUNCTION public.prevent_duplicate_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Vérifier s'il existe déjà un profil avec cet email
  IF EXISTS (SELECT 1 FROM public.profiles WHERE email = NEW.email AND id != NEW.id) THEN
    RAISE EXCEPTION 'Un compte avec cet email existe déjà';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour empêcher les doublons d'email
DROP TRIGGER IF EXISTS prevent_duplicate_email_trigger ON public.profiles;
CREATE TRIGGER prevent_duplicate_email_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_duplicate_email();

-- =====================================================
-- INSTRUCTIONS
-- =====================================================
-- 1. Exécuter ce script dans Supabase SQL Editor
-- 2. Puis exécuter cleanup-duplicate-users.sql pour nettoyer
-- 3. Tester une nouvelle inscription
