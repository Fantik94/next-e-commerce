-- =====================================================
-- MISE À JOUR DES PRODUITS AVEC GESTION DES IMAGES
-- =====================================================

-- Mettre à jour les produits existants avec les chemins d'images
UPDATE "public"."products" 
SET 
  "images" = ARRAY[
    'products/31954d1d-e1f2-46eb-ba0d-2a448f842191/main.jpg',
    'products/31954d1d-e1f2-46eb-ba0d-2a448f842191/1.jpg',
    'products/31954d1d-e1f2-46eb-ba0d-2a448f842191/2.jpg',
    'products/31954d1d-e1f2-46eb-ba0d-2a448f842191/3.jpg'
  ],
  "featured_image" = 'products/31954d1d-e1f2-46eb-ba0d-2a448f842191/main.jpg'
WHERE "id" = '31954d1d-e1f2-46eb-ba0d-2a448f842191';

UPDATE "public"."products" 
SET 
  "images" = ARRAY[
    'products/48288630-4f38-4b4e-96aa-adf1d56183cc/main.jpg',
    'products/48288630-4f38-4b4e-96aa-adf1d56183cc/1.jpg',
    'products/48288630-4f38-4b4e-96aa-adf1d56183cc/2.jpg'
  ],
  "featured_image" = 'products/48288630-4f38-4b4e-96aa-adf1d56183cc/main.jpg'
WHERE "id" = '48288630-4f38-4b4e-96aa-adf1d56183cc';

-- Ajouter des produits avec images pour les tests
INSERT INTO "public"."products" ("id", "name", "description", "slug", "price", "compare_at_price", "cost_price", "sku", "barcode", "stock_quantity", "track_inventory", "allow_backorder", "weight", "dimensions", "category_id", "brand", "tags", "images", "featured_image", "is_active", "is_featured", "seo_title", "seo_description", "created_at", "updated_at") VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'MacBook Air M3', 'Ordinateur portable ultraléger avec puce M3', 'macbook-air-m3', '1299.00', '1399.00', null, 'MBA-M3-13', null, '25', 'true', 'false', '1.24', '{"length": 30.41, "width": 21.5, "height": 1.13}', '9ca7f702-be21-4e2e-9773-7ec2c7e62f3f', 'Apple', '["laptop", "macbook", "m3"]', '["products/550e8400-e29b-41d4-a716-446655440001/main.jpg", "products/550e8400-e29b-41d4-a716-446655440001/1.jpg", "products/550e8400-e29b-41d4-a716-446655440001/2.jpg"]', 'products/550e8400-e29b-41d4-a716-446655440001/main.jpg', 'true', 'true', 'MacBook Air M3 - Ordinateur portable Apple', 'Découvrez le MacBook Air M3, ordinateur portable ultraléger avec puce M3 et écran Liquid Retina 13 pouces.', '2025-09-26 15:51:40.787178+00', '2025-09-26 15:51:40.787178+00'),

('550e8400-e29b-41d4-a716-446655440002', 'AirPods Pro', 'Écouteurs sans fil avec réduction de bruit active', 'airpods-pro', '279.00', '329.00', null, 'APP-PRO-2', null, '75', 'true', 'false', '0.056', '{"length": 6.0, "width": 4.5, "height": 2.1}', '9ca7f702-be21-4e2e-9773-7ec2c7e62f3f', 'Apple', '["airpods", "wireless", "noise-cancelling"]', '["products/550e8400-e29b-41d4-a716-446655440002/main.jpg", "products/550e8400-e29b-41d4-a716-446655440002/1.jpg", "products/550e8400-e29b-41d4-a716-446655440002/2.jpg", "products/550e8400-e29b-41d4-a716-446655440002/3.jpg"]', 'products/550e8400-e29b-41d4-a716-446655440002/main.jpg', 'true', 'true', 'AirPods Pro - Écouteurs sans fil Apple', 'AirPods Pro avec réduction de bruit active et son spatial personnalisé.', '2025-09-26 15:51:40.787178+00', '2025-09-26 15:51:40.787178+00');
