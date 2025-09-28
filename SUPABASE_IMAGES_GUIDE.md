# 🖼️ Guide des images Supabase Storage - Organisation automatique

## Vue d'ensemble

Votre application récupère maintenant automatiquement toutes les images d'un produit depuis Supabase Storage, sans avoir besoin de les stocker dans la base de données !

## 📁 Structure des dossiers

### Organisation dans Supabase Storage

```
Bucket: products/
├── {product-id-1}/
│   ├── main.jpg          (image principale - optionnel)
│   ├── 1.jpg            (image secondaire)
│   ├── 2.jpg            (image secondaire)
│   ├── 3.jpg            (image secondaire)
│   └── photo.jpg        (n'importe quel nom)
├── {product-id-2}/
│   ├── main.jpg
│   ├── image1.jpg
│   └── product-photo.png
```

### Règles importantes

1. **Dossier = ID du produit** : Chaque produit a son propre dossier
2. **Noms libres** : Vous pouvez nommer vos images comme vous voulez
3. **Formats supportés** : JPG, JPEG, PNG, WebP, GIF, AVIF
4. **Image principale** : Si vous avez un fichier `main.jpg`, il sera utilisé comme image principale

## 🚀 Comment ça marche

### 1. Récupération automatique

L'application :
1. Liste tous les fichiers dans le dossier `{product-id}/`
2. Filtre seulement les fichiers images
3. Génère les URLs publiques automatiquement
4. Utilise `main.jpg` comme image principale si elle existe

### 2. Fallback intelligent

Si aucune image n'est trouvée dans le storage :
- Affiche un placeholder SVG élégant
- Utilise les images de la base de données (si elles existent)

## 📤 Upload d'images

### Via l'interface Supabase

1. Allez dans **Storage** > **products**
2. Créez un dossier avec l'ID de votre produit
3. Uploadez vos images dans ce dossier
4. Nommez l'image principale `main.jpg` (optionnel)

### Via le code (pour les admins)

```typescript
import { uploadProductImage } from '@/lib/image-utils';

// Upload d'une image
const result = await uploadProductImage(
  'product-id-123',  // ID du produit
  file,              // Fichier à uploader
  'main.jpg'         // Nom du fichier
);
```

## 🔧 Configuration requise

### 1. Bucket Supabase

Assurez-vous que le bucket `products` existe et est public :

```sql
-- Créer le bucket (si pas déjà fait)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products', 
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
);
```

### 2. Politiques RLS

```sql
-- Images publiques
CREATE POLICY "Product images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'products');
```

## 💻 Utilisation dans le code

### Hook pour récupérer les images

```typescript
import { useProductImages } from '@/hooks/useProductImages';

function ProductComponent({ productId }) {
  const { 
    images,           // Toutes les images
    featuredImage,    // Image principale
    loading,          // État de chargement
    error            // Erreur éventuelle
  } = useProductImages(productId);

  return (
    <div>
      {images.map((image, index) => (
        <img key={index} src={image} alt={`Image ${index + 1}`} />
      ))}
    </div>
  );
}
```

### Fonctions utilitaires

```typescript
import { 
  getProductImagesFromStorage,
  getFeaturedImageFromStorage 
} from '@/lib/image-utils';

// Récupérer toutes les images d'un produit
const images = await getProductImagesFromStorage('product-id');

// Récupérer l'image principale
const mainImage = await getFeaturedImageFromStorage('product-id');
```

## 📝 Exemples pratiques

### Exemple 1 : iPhone 15

```
Supabase Storage:
products/31954d1d-e1f2-46eb-ba0d-2a448f842191/
├── main.jpg          (iPhone de face)
├── 1.jpg            (iPhone de côté)
├── 2.jpg            (iPhone de dos)
└── 3.jpg            (iPhone avec accessoires)
```

**Résultat** : L'application affichera automatiquement ces 4 images, avec `main.jpg` comme image principale.

### Exemple 2 : T-shirt

```
Supabase Storage:
products/48288630-4f38-4b4e-96aa-adf1d56183cc/
├── tshirt-front.jpg
├── tshirt-back.jpg
└── tshirt-detail.jpg
```

**Résultat** : L'application affichera ces 3 images, avec la première comme image principale.

## 🎯 Avantages de cette approche

### ✅ **Simplicité**
- Pas besoin de gérer les URLs dans la base de données
- Upload direct dans le bon dossier
- Organisation claire et logique

### ✅ **Flexibilité**
- Ajoutez/supprimez des images sans toucher à la base
- Noms de fichiers libres
- Formats multiples supportés

### ✅ **Performance**
- Images servies directement par Supabase CDN
- Cache automatique
- Optimisation des tailles

### ✅ **Maintenance**
- Pas de synchronisation base/storage
- Gestion centralisée des images
- Backup automatique

## 🐛 Dépannage

### Images qui ne s'affichent pas

1. **Vérifiez le bucket** : Le bucket `products` existe-t-il ?
2. **Vérifiez les permissions** : Le bucket est-il public ?
3. **Vérifiez le dossier** : Le dossier a-t-il l'ID correct du produit ?
4. **Vérifiez les formats** : Les fichiers sont-ils des images valides ?

### Performance lente

1. **Optimisez les images** : Compressez avant l'upload
2. **Utilisez WebP** : Format plus léger
3. **Limitez la taille** : Max 10MB par image

### Erreurs d'upload

1. **Vérifiez la taille** : < 10MB par fichier
2. **Vérifiez le format** : JPG, PNG, WebP, etc.
3. **Vérifiez les permissions** : Droits d'upload

## 📊 Bonnes pratiques

### 1. Nommage des fichiers

- **Image principale** : `main.jpg` (recommandé)
- **Autres images** : Noms descriptifs (`front.jpg`, `back.jpg`, etc.)
- **Évitez** : Espaces et caractères spéciaux

### 2. Tailles recommandées

- **Image principale** : 1200x1200px minimum
- **Images secondaires** : 800x800px minimum
- **Format** : WebP > JPEG > PNG

### 3. Organisation

- **Un dossier par produit** : Toujours utiliser l'ID du produit
- **Images cohérentes** : Même style et qualité
- **Ordre logique** : `main.jpg` en premier

Votre système est maintenant complètement automatisé ! 🎉
