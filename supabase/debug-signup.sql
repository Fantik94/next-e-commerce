-- =====================================================
-- DIAGNOSTIC DU PROBLÈME D'INSCRIPTION
-- =====================================================

-- 1. Vérifier l'état des triggers
SELECT 
  trigger_name,
  event_manipulation,
  action_timing,
  action_statement,
  action_condition
FROM information_schema.triggers 
WHERE event_object_table = 'users' 
  AND trigger_schema = 'auth';

-- 2. Vérifier l'état des fonctions
SELECT 
  routine_name,
  routine_type,
  routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name LIKE '%user%';

-- 3. Vérifier les utilisateurs récents
SELECT 
  au.id,
  au.email,
  au.created_at,
  au.email_confirmed_at,
  au.raw_user_meta_data,
  p.id as profile_id,
  p.first_name,
  p.last_name
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
ORDER BY au.created_at DESC
LIMIT 10;

-- 4. Vérifier les logs (si disponibles)
-- SELECT * FROM auth.audit_log_entries 
-- WHERE created_at > NOW() - INTERVAL '1 hour'
-- ORDER BY created_at DESC;

-- 5. Test de création de profil manuel
-- Remplace 'test-user-id' par un vrai ID d'utilisateur sans profil
/*
INSERT INTO public.profiles (
  id, 
  email, 
  first_name, 
  last_name,
  auth_provider,
  is_oauth_user
) VALUES (
  'test-user-id',
  'test@example.com',
  'Test',
  'User',
  'email',
  false
);
*/

-- 6. Fonction de test du trigger
CREATE OR REPLACE FUNCTION public.test_trigger_function()
RETURNS void AS $$
BEGIN
  RAISE NOTICE 'Test du trigger - fonction accessible';
  
  -- Test d'insertion dans profiles
  BEGIN
    INSERT INTO public.profiles (
      id, 
      email, 
      first_name, 
      last_name,
      auth_provider,
      is_oauth_user
    ) VALUES (
      gen_random_uuid(),
      'trigger-test@example.com',
      'Trigger',
      'Test',
      'email',
      false
    );
    
    RAISE NOTICE 'Test d''insertion réussi';
    
    -- Nettoyer le test
    DELETE FROM public.profiles WHERE email = 'trigger-test@example.com';
    
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Erreur lors du test: % %', SQLSTATE, SQLERRM;
  END;
END;
$$ LANGUAGE plpgsql;

-- Exécuter le test
SELECT public.test_trigger_function();

-- =====================================================
-- INSTRUCTIONS
-- =====================================================
-- 1. Exécute ce script dans Supabase SQL Editor
-- 2. Regarde les résultats pour identifier le problème
-- 3. Si le trigger n'existe pas, exécute fix-signup-final.sql
