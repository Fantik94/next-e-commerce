-- =====================================================
-- CONFIGURATION COMPLÈTE SUPABASE STORAGE
-- =====================================================

-- 1. Créer le bucket products
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products', 
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
) ON CONFLICT (id) DO NOTHING;

-- 2. Politiques RLS pour le storage products
-- Images publiques (lecture)
CREATE POLICY "Product images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'products');

-- Upload pour les admins (insertion)
CREATE POLICY "Admins can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'products' 
    AND (
      auth.role() = 'service_role' 
      OR auth.role() = 'admin'
    )
  );

-- Mise à jour pour les admins
CREATE POLICY "Admins can update product images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'products' 
    AND (
      auth.role() = 'service_role' 
      OR auth.role() = 'admin'
    )
  );

-- Suppression pour les admins
CREATE POLICY "Admins can delete product images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'products' 
    AND (
      auth.role() = 'service_role' 
      OR auth.role() = 'admin'
    )
  );

-- 3. Vérifier que le bucket existe
SELECT 
  id, 
  name, 
  public, 
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE name = 'products';

-- 4. Vérifier les politiques
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%product%';
