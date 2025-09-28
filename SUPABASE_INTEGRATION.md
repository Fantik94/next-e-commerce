# Intégration Supabase - Guide d'utilisation

## Vue d'ensemble

Ce projet Next.js e-commerce a été intégré avec Supabase pour gérer les données de produits et catégories. Les données mockées ont été remplacées par des données réelles provenant de votre base de données Supabase.

## Structure des données

### Tables Supabase

1. **categories** - Catégories de produits
2. **products** - Produits du catalogue

### Schéma des données

#### Catégories
- `id` (UUID) - Identifiant unique
- `name` (TEXT) - Nom de la catégorie
- `description` (TEXT) - Description de la catégorie
- `slug` (TEXT) - Slug URL unique
- `image_url` (TEXT) - URL de l'image de la catégorie
- `is_active` (BOOLEAN) - Statut actif/inactif
- `sort_order` (INTEGER) - Ordre d'affichage

#### Produits
- `id` (UUID) - Identifiant unique
- `name` (TEXT) - Nom du produit
- `description` (TEXT) - Description du produit
- `slug` (TEXT) - Slug URL unique
- `price` (DECIMAL) - Prix du produit
- `compare_at_price` (DECIMAL) - Prix barré (promotion)
- `stock_quantity` (INTEGER) - Quantité en stock
- `category_id` (UUID) - Référence vers la catégorie
- `brand` (TEXT) - Marque du produit
- `images` (TEXT[]) - Tableau d'URLs d'images
- `featured_image` (TEXT) - Image principale
- `is_active` (BOOLEAN) - Statut actif/inactif
- `is_featured` (BOOLEAN) - Produit mis en avant

## Fichiers créés/modifiés

### Nouveaux fichiers

1. **`src/lib/supabase-data.ts`** - Services pour récupérer les données Supabase
2. **`src/hooks/useSupabaseData.tsx`** - Hooks React pour utiliser les données
3. **`supabase/insert-sample-data.sql`** - Script d'insertion des données d'exemple

### Fichiers modifiés

1. **`src/app/page.tsx`** - Page d'accueil utilisant les données Supabase
2. **`src/app/products/page.tsx`** - Page catalogue utilisant les données Supabase
3. **`src/app/products/[id]/page.tsx`** - Page détail produit utilisant les données Supabase
4. **`src/data/products.ts`** - Fichier de données mockées (maintenant vide)

## Utilisation

### Hooks disponibles

```typescript
// Récupérer toutes les catégories
const { categories, loading, error } = useCategories();

// Récupérer une catégorie par slug
const { category, loading, error } = useCategory('electronique');

// Récupérer tous les produits
const { products, loading, error } = useProducts(limit, offset);

// Récupérer un produit par ID
const { product, loading, error } = useProduct(productId);

// Récupérer un produit par slug
const { product, loading, error } = useProductBySlug('iphone-15');

// Récupérer les produits par catégorie
const { products, loading, error } = useProductsByCategory('electronique', limit, offset);

// Rechercher des produits
const { products, loading, error } = useSearchProducts('iPhone', limit);

// Récupérer les produits mis en avant
const { products, loading, error } = useFeaturedProducts(limit);
```

### Services directs

```typescript
import { 
  getCategories, 
  getProducts, 
  getProductById,
  searchProducts 
} from '@/lib/supabase-data';

// Utilisation côté serveur ou dans des fonctions utilitaires
const categories = await getCategories();
const products = await getProducts(50, 0);
```

## Configuration requise

### Variables d'environnement

Assurez-vous que ces variables sont définies dans votre fichier `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Base de données

1. Exécutez le script `supabase/schema.sql` pour créer les tables
2. Exécutez le script `supabase/insert-sample-data.sql` pour insérer les données d'exemple

## Fonctionnalités

### Gestion des états
- **Loading** : Indicateurs de chargement automatiques
- **Error** : Gestion d'erreurs avec messages utilisateur
- **Empty states** : Gestion des états vides

### Recherche et filtrage
- Recherche textuelle en temps réel
- Filtrage par catégorie, marque, prix, etc.
- Tri par nom, prix, date, popularité

### Performance
- Pagination des résultats
- Debouncing de la recherche
- Mise en cache des requêtes

## Personnalisation

### Ajouter de nouveaux champs

1. Modifiez le schéma Supabase
2. Mettez à jour les types TypeScript dans `src/lib/supabase-data.ts`
3. Modifiez les fonctions de transformation si nécessaire

### Ajouter de nouvelles requêtes

1. Créez la fonction dans `src/lib/supabase-data.ts`
2. Créez le hook correspondant dans `src/hooks/useSupabaseData.tsx`
3. Utilisez le hook dans vos composants

## Dépannage

### Erreurs communes

1. **Variables d'environnement manquantes** : Vérifiez votre fichier `.env.local`
2. **Erreurs de connexion** : Vérifiez votre URL Supabase
3. **Permissions RLS** : Vérifiez les politiques de sécurité Supabase
4. **Types TypeScript** : Vérifiez que les types correspondent au schéma

### Logs de débogage

Les erreurs sont automatiquement loggées dans la console. Activez les logs détaillés en mode développement.

## Support

Pour toute question ou problème :
1. Vérifiez les logs de la console
2. Consultez la documentation Supabase
3. Vérifiez la configuration de votre base de données
