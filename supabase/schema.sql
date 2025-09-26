-- =====================================================
-- SCHEMA DE BASE DE DONNÉES - DIGITALFADA.SHOP
-- =====================================================

-- Extension pour les UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: profiles (extension de auth.users)
-- =====================================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  
  -- Informations personnelles e-commerce
  phone TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  
  -- Adresse par défaut
  default_address JSONB, -- {street, city, postal_code, country, is_billing}
  
  -- Préférences e-commerce
  newsletter_subscribed BOOLEAN DEFAULT false,
  marketing_emails BOOLEAN DEFAULT false,
  order_notifications BOOLEAN DEFAULT true,
  language_preference TEXT DEFAULT 'fr' CHECK (language_preference IN ('fr', 'en', 'es', 'de')),
  currency_preference TEXT DEFAULT 'EUR' CHECK (currency_preference IN ('EUR', 'USD', 'GBP')),
  
  -- Informations de connexion
  auth_provider TEXT DEFAULT 'email' CHECK (auth_provider IN ('email', 'google', 'facebook', 'apple')),
  is_oauth_user BOOLEAN DEFAULT false,
  oauth_provider_id TEXT, -- ID du provider OAuth
  
  -- Préférences d'affichage
  theme_preference TEXT DEFAULT 'system' CHECK (theme_preference IN ('light', 'dark', 'system')),
  
  -- Informations de sécurité
  two_factor_enabled BOOLEAN DEFAULT false,
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  
  -- Métadonnées
  last_login_at TIMESTAMPTZ,
  last_order_at TIMESTAMPTZ,
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0.00,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX profiles_email_idx ON public.profiles(email);
CREATE INDEX profiles_role_idx ON public.profiles(role);
CREATE INDEX profiles_auth_provider_idx ON public.profiles(auth_provider);
CREATE INDEX profiles_last_login_idx ON public.profiles(last_login_at);

-- =====================================================
-- TABLE: user_addresses (adresses multiples)
-- =====================================================
CREATE TABLE public.user_addresses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT DEFAULT 'shipping' CHECK (type IN ('shipping', 'billing', 'both')),
  is_default BOOLEAN DEFAULT false,
  
  -- Informations adresse
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company TEXT,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  state_province TEXT,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'FR',
  
  -- Contact
  phone TEXT,
  
  -- Métadonnées
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX user_addresses_user_id_idx ON public.user_addresses(user_id);
CREATE INDEX user_addresses_type_idx ON public.user_addresses(type);
CREATE INDEX user_addresses_is_default_idx ON public.user_addresses(is_default);

-- =====================================================
-- TABLE: categories
-- =====================================================
CREATE TABLE public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX categories_slug_idx ON public.categories(slug);
CREATE INDEX categories_parent_id_idx ON public.categories(parent_id);
CREATE INDEX categories_is_active_idx ON public.categories(is_active);

-- =====================================================
-- TABLE: products
-- =====================================================
CREATE TABLE public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  compare_at_price DECIMAL(10,2) CHECK (compare_at_price >= 0),
  cost_price DECIMAL(10,2) CHECK (cost_price >= 0),
  sku TEXT UNIQUE,
  barcode TEXT,
  stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
  track_inventory BOOLEAN DEFAULT true,
  allow_backorder BOOLEAN DEFAULT false,
  weight DECIMAL(8,2),
  dimensions JSONB, -- {length, width, height}
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  brand TEXT,
  tags TEXT[],
  images TEXT[], -- URLs des images
  featured_image TEXT,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX products_slug_idx ON public.products(slug);
CREATE INDEX products_category_id_idx ON public.products(category_id);
CREATE INDEX products_sku_idx ON public.products(sku);
CREATE INDEX products_is_active_idx ON public.products(is_active);
CREATE INDEX products_is_featured_idx ON public.products(is_featured);
CREATE INDEX products_price_idx ON public.products(price);

-- =====================================================
-- TABLE: orders
-- =====================================================
CREATE TABLE public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
  tax_amount DECIMAL(10,2) DEFAULT 0 CHECK (tax_amount >= 0),
  shipping_amount DECIMAL(10,2) DEFAULT 0 CHECK (shipping_amount >= 0),
  discount_amount DECIMAL(10,2) DEFAULT 0 CHECK (discount_amount >= 0),
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
  currency TEXT DEFAULT 'EUR',
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method TEXT,
  shipping_address JSONB, -- Adresse de livraison
  billing_address JSONB, -- Adresse de facturation
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX orders_user_id_idx ON public.orders(user_id);
CREATE INDEX orders_order_number_idx ON public.orders(order_number);
CREATE INDEX orders_status_idx ON public.orders(status);
CREATE INDEX orders_payment_status_idx ON public.orders(payment_status);
CREATE INDEX orders_created_at_idx ON public.orders(created_at);

-- =====================================================
-- TABLE: order_items
-- =====================================================
CREATE TABLE public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
  product_snapshot JSONB, -- Snapshot du produit au moment de la commande
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX order_items_order_id_idx ON public.order_items(order_id);
CREATE INDEX order_items_product_id_idx ON public.order_items(product_id);

-- =====================================================
-- FONCTIONS DE MISE À JOUR DES TIMESTAMPS
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour les timestamps
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_addresses_updated_at BEFORE UPDATE ON public.user_addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FONCTION POUR GÉRER LES PROFILS UTILISATEURS
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  provider_name TEXT;
  is_oauth BOOLEAN := false;
BEGIN
  -- Déterminer le provider d'authentification
  SELECT providers[1] INTO provider_name 
  FROM (
    SELECT array_agg(provider) as providers 
    FROM jsonb_each_text(NEW.app_metadata->'providers') 
    WHERE value IS NOT NULL
  ) sub;
  
  -- Si pas de provider spécifique, regarder dans user_metadata
  IF provider_name IS NULL THEN
    provider_name := COALESCE(NEW.raw_user_meta_data->>'provider', 'email');
  END IF;
  
  -- Déterminer si c'est OAuth
  IF provider_name IN ('google', 'facebook', 'apple', 'github') THEN
    is_oauth := true;
  END IF;
  
  INSERT INTO public.profiles (
    id, 
    email, 
    first_name, 
    last_name,
    auth_provider,
    is_oauth_user,
    oauth_provider_id,
    email_verified
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', NEW.raw_user_meta_data->>'given_name'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', NEW.raw_user_meta_data->>'family_name'),
    COALESCE(provider_name, 'email'),
    is_oauth,
    CASE WHEN is_oauth THEN NEW.raw_user_meta_data->>'sub' ELSE NULL END,
    COALESCE(NEW.email_confirmed_at IS NOT NULL, false)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement un profil
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- POLITIQUES DE SÉCURITÉ (RLS)
-- =====================================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Politiques pour profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Politiques pour user_addresses
CREATE POLICY "Users can view their own addresses" ON public.user_addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own addresses" ON public.user_addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own addresses" ON public.user_addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own addresses" ON public.user_addresses FOR DELETE USING (auth.uid() = user_id);

-- Politiques pour categories (lecture publique)
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (is_active = true);

-- Politiques pour products (lecture publique)
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (is_active = true);

-- Politiques pour orders
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques pour order_items
CREATE POLICY "Users can view their order items" ON public.order_items 
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  ));

-- =====================================================
-- CONFIGURATION SUPABASE STORAGE
-- =====================================================

-- Créer un bucket pour les avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Politiques RLS pour le storage avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- =====================================================
-- DONNÉES DE TEST (OPTIONNEL)
-- =====================================================

-- Catégories de test
INSERT INTO public.categories (name, description, slug) VALUES
('Électronique', 'Produits électroniques et gadgets', 'electronique'),
('Vêtements', 'Mode et accessoires', 'vetements'),
('Maison & Jardin', 'Articles pour la maison et le jardin', 'maison-jardin');

-- Produits de test
INSERT INTO public.products (name, description, slug, price, category_id, stock_quantity) VALUES
('iPhone 15', 'Dernier smartphone Apple', 'iphone-15', 999.00, (SELECT id FROM public.categories WHERE slug = 'electronique'), 50),
('T-shirt Basic', 'T-shirt en coton bio', 't-shirt-basic', 29.99, (SELECT id FROM public.categories WHERE slug = 'vetements'), 100);