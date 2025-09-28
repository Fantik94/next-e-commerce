-- =====================================================
-- CONFIGURATION SUPABASE STORAGE POUR LES PRODUITS
-- =====================================================

-- Créer un bucket pour les images de produits
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products', 
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
);

-- Politiques RLS pour le storage products
CREATE POLICY "Product images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'products');

-- Politique pour permettre l'upload d'images (pour les admins)
CREATE POLICY "Admins can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'products' 
    AND auth.role() = 'service_role'
  );

-- Politique pour permettre la mise à jour d'images (pour les admins)
CREATE POLICY "Admins can update product images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'products' 
    AND auth.role() = 'service_role'
  );

-- Politique pour permettre la suppression d'images (pour les admins)
CREATE POLICY "Admins can delete product images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'products' 
    AND auth.role() = 'service_role'
  );
