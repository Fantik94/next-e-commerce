# 🖼️ Guide de gestion des images - Supabase Storage

## Vue d'ensemble

Ce guide explique comment gérer les images des produits avec Supabase Storage dans votre application e-commerce Next.js.

## 📁 Structure des images

### Organisation dans Supabase Storage

```
Bucket: products/
├── {product-id-1}/
│   ├── main.jpg          (image principale)
│   ├── 1.jpg            (image secondaire)
│   ├── 2.jpg            (image secondaire)
│   └── 3.jpg            (image secondaire)
├── {product-id-2}/
│   ├── main.jpg
│   ├── 1.jpg
│   └── 2.jpg
```

### Stockage dans la base de données

```sql
-- Table products
images: TEXT[] = [
  'products/{product-id}/main.jpg',
  'products/{product-id}/1.jpg',
  'products/{product-id}/2.jpg'
]
featured_image: TEXT = 'products/{product-id}/main.jpg'
```

## 🚀 Configuration

### 1. Créer le bucket Supabase

Exécutez le script `supabase/storage-setup.sql` dans votre console Supabase :

```sql
-- Créer le bucket products
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products', 
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
);
```

### 2. Configurer les politiques RLS

```sql
-- Images publiques
CREATE POLICY "Product images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'products');

-- Upload pour les admins
CREATE POLICY "Admins can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'products' AND auth.role() = 'service_role');
```

## 💻 Utilisation dans le code

### Composants disponibles

#### 1. ProductImage - Image simple

```tsx
import { ProductImage } from '@/components/ui/product-image';

<ProductImage
  src="products/product-id/main.jpg"
  alt="Nom du produit"
  width={400}
  height={300}
  options={{ size: 'medium' }}
/>
```

#### 2. ProductImageGallery - Galerie complète

```tsx
import { ProductImageGallery } from '@/components/ui/product-image';

<ProductImageGallery
  images={['products/id/main.jpg', 'products/id/1.jpg']}
  featuredImage="products/id/main.jpg"
  alt="Nom du produit"
  onImageClick={(index) => console.log('Image cliquée:', index)}
/>
```

### Options d'images

```tsx
interface ImageOptions {
  size?: 'thumbnail' | 'small' | 'medium' | 'large';
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  fit?: 'cover' | 'contain' | 'fill';
}

// Exemples d'utilisation
<ProductImage options={{ size: 'thumbnail' }} />  // 150x150
<ProductImage options={{ size: 'medium' }} />     // 600x600
<ProductImage options={{ width: 800, height: 600 }} />
```

### Utilitaires d'images

```tsx
import { 
  getImageUrl, 
  getProductImages, 
  getFeaturedImage 
} from '@/lib/image-utils';

// URL d'une image
const imageUrl = getImageUrl('products/id/main.jpg', { size: 'medium' });

// Toutes les images d'un produit
const productImages = getProductImages(product.images, { size: 'small' });

// Image principale
const featuredImage = getFeaturedImage(product.featuredImage, product.images);
```

## 📤 Upload d'images

### Interface d'upload (pour les admins)

```tsx
import { uploadProductImage } from '@/lib/image-utils';

const handleUpload = async (file: File, productId: string) => {
  const result = await uploadProductImage(productId, file, 'main.jpg');
  
  if (result.success) {
    console.log('Image uploadée:', result.path);
    // Mettre à jour la base de données
  } else {
    console.error('Erreur:', result.error);
  }
};
```

### Mise à jour de la base de données

```tsx
// Après upload, mettre à jour le produit
const { error } = await supabase
  .from('products')
  .update({
    images: [...product.images, result.path],
    featured_image: result.path
  })
  .eq('id', productId);
```

## 🎨 Optimisations

### 1. Lazy loading

Les images sont chargées de manière paresseuse par défaut :

```tsx
<ProductImage
  src={imagePath}
  alt={alt}
  loading="lazy" // Par défaut
  priority={false} // Pour les images importantes
/>
```

### 2. Tailles responsives

```tsx
<ProductImage
  src={imagePath}
  alt={alt}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### 3. Placeholders

Images de fallback automatiques :

```tsx
<ProductImage
  src={null} // Aucune image
  alt="Produit"
  fallback="/images/placeholder-product.jpg" // Optionnel
/>
```

## 🔧 Maintenance

### Vérifier l'existence d'une image

```tsx
import { checkImageExists } from '@/lib/image-utils';

const exists = await checkImageExists('products/id/main.jpg');
```

### Supprimer une image

```tsx
import { deleteProductImage } from '@/lib/image-utils';

const result = await deleteProductImage('products/id/main.jpg');
```

## 📱 Bonnes pratiques

### 1. Nommage des fichiers

- **Image principale** : `main.jpg`
- **Images secondaires** : `1.jpg`, `2.jpg`, `3.jpg`, etc.
- **Formats** : Préférer WebP pour la performance

### 2. Tailles recommandées

- **Thumbnail** : 150x150px (miniatures)
- **Small** : 300x300px (cartes produits)
- **Medium** : 600x600px (pages produits)
- **Large** : 1200x1200px (gros plans)

### 3. Compression

- **Qualité** : 80-85% pour les photos
- **Format** : WebP > JPEG > PNG
- **Taille max** : 10MB par image

## 🐛 Dépannage

### Images qui ne s'affichent pas

1. Vérifier les politiques RLS
2. Vérifier que le bucket est public
3. Vérifier l'URL générée
4. Vérifier les permissions

### Performance lente

1. Optimiser les tailles d'images
2. Utiliser le lazy loading
3. Préférer WebP
4. Mettre en cache les images

### Erreurs d'upload

1. Vérifier la taille du fichier (< 10MB)
2. Vérifier le format (JPEG, PNG, WebP)
3. Vérifier les permissions d'upload
4. Vérifier la connexion

## 📊 Monitoring

### Métriques à surveiller

- Temps de chargement des images
- Taux d'erreur d'images
- Utilisation du stockage
- Bande passante

### Logs utiles

```tsx
// Activer les logs de débogage
console.log('Image URL:', getImageUrl(imagePath));
console.log('Image exists:', await checkImageExists(imagePath));
```
