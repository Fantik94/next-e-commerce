-- =====================================================
-- NETTOYAGE DES UTILISATEURS EN DOUBLE
-- =====================================================

-- 1. Voir les utilisateurs sans profil (orphelins)
SELECT 
  au.id,
  au.email,
  au.created_at,
  au.email_confirmed_at,
  CASE WHEN p.id IS NULL THEN 'ORPHELIN' ELSE 'OK' END as status
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
ORDER BY au.created_at DESC;

-- 2. Compter les doublons par email
SELECT 
  au.email,
  COUNT(*) as count,
  array_agg(au.id) as user_ids,
  array_agg(au.created_at) as created_dates
FROM auth.users au
GROUP BY au.email
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- =====================================================
-- NETTOYAGE AUTOMATIQUE
-- =====================================================

-- 3. Fonction pour nettoyer les utilisateurs orphelins
CREATE OR REPLACE FUNCTION public.cleanup_orphan_users()
RETURNS TABLE(deleted_count integer, deleted_emails text[]) AS $$
DECLARE
  deleted_count integer := 0;
  deleted_emails text[] := '{}';
  user_record record;
BEGIN
  -- Supprimer les utilisateurs sans profil (sauf les plus récents par email)
  FOR user_record IN 
    SELECT DISTINCT ON (au.email) 
      au.id, 
      au.email,
      au.created_at
    FROM auth.users au
    LEFT JOIN public.profiles p ON au.id = p.id
    WHERE p.id IS NULL
    ORDER BY au.email, au.created_at ASC -- Garder le plus ancien
  LOOP
    -- Supprimer les doublons plus récents pour cet email
    DELETE FROM auth.users 
    WHERE email = user_record.email 
      AND id != user_record.id
      AND id NOT IN (SELECT id FROM public.profiles);
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    IF deleted_count > 0 THEN
      deleted_emails := array_append(deleted_emails, user_record.email);
    END IF;
  END LOOP;

  RETURN QUERY SELECT deleted_count, deleted_emails;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Fonction pour créer les profils manquants
CREATE OR REPLACE FUNCTION public.create_missing_profiles()
RETURNS TABLE(created_count integer, created_emails text[]) AS $$
DECLARE
  created_count integer := 0;
  created_emails text[] := '{}';
  user_record record;
BEGIN
  FOR user_record IN 
    SELECT au.id, au.email, au.raw_user_meta_data
    FROM auth.users au
    LEFT JOIN public.profiles p ON au.id = p.id
    WHERE p.id IS NULL
  LOOP
    -- Créer le profil manquant
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
      user_record.id,
      user_record.email,
      COALESCE(
        user_record.raw_user_meta_data->>'first_name', 
        user_record.raw_user_meta_data->>'given_name',
        split_part(user_record.email, '@', 1)
      ),
      COALESCE(
        user_record.raw_user_meta_data->>'last_name', 
        user_record.raw_user_meta_data->>'family_name',
        ''
      ),
      CASE 
        WHEN user_record.raw_user_meta_data->>'provider' = 'google' THEN 'google'
        ELSE 'email'
      END,
      CASE 
        WHEN user_record.raw_user_meta_data->>'provider' = 'google' THEN true
        ELSE false
      END,
      false
    );
    
    created_count := created_count + 1;
    created_emails := array_append(created_emails, user_record.email);
  END LOOP;

  RETURN QUERY SELECT created_count, created_emails;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- INSTRUCTIONS D'UTILISATION
-- =====================================================

-- Pour voir l'état actuel :
-- SELECT * FROM public.cleanup_orphan_users();

-- Pour créer les profils manquants :
-- SELECT * FROM public.create_missing_profiles();

-- Pour voir les statistiques après nettoyage :
-- SELECT 
--   (SELECT COUNT(*) FROM auth.users) as total_users,
--   (SELECT COUNT(*) FROM public.profiles) as total_profiles,
--   (SELECT COUNT(*) FROM auth.users au LEFT JOIN public.profiles p ON au.id = p.id WHERE p.id IS NULL) as orphan_users;
