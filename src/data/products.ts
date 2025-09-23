import { Product, Category } from '@/types';

// Données de test pour les catégories
export const categories: Category[] = [
  {
    id: '1',
    name: 'Électronique',
    slug: 'electronique',
    description: 'Smartphones, ordinateurs, accessoires tech',
    productCount: 45
  },
  {
    id: '2',
    name: 'Mode',
    slug: 'mode',
    description: 'Vêtements, chaussures, accessoires',
    productCount: 120
  },
  {
    id: '3',
    name: 'Maison & Jardin',
    slug: 'maison-jardin',
    description: 'Décoration, outils, mobilier',
    productCount: 78
  },
  {
    id: '4',
    name: 'Sport & Loisirs',
    slug: 'sport-loisirs',
    description: 'Équipements sportifs, jeux, outdoor',
    productCount: 56
  }
];

// Données de test pour les produits
export const products: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    description: 'Le dernier smartphone Apple avec puce A17 Pro, appareil photo 48MP et design en titane.',
    price: 1229,
    originalPrice: 1299,
    category: 'Électronique',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1592286526281-a6e1fc8b8ec0?w=500',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'
    ],
    stock: 15,
    rating: 4.8,
    reviewCount: 127,
    features: [
      'Puce A17 Pro',
      'Appareil photo 48MP',
      'Design en titane',
      'USB-C',
      'Action Button'
    ],
    isNew: true,
    isFeatured: true,
    createdAt: new Date('2024-09-15'),
    updatedAt: new Date('2024-09-20')
  },
  {
    id: '2',
    name: 'MacBook Air M3',
    description: 'Ordinateur portable ultraléger avec puce M3, écran Liquid Retina 13 pouces.',
    price: 1299,
    category: 'Électronique',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500'
    ],
    stock: 8,
    rating: 4.7,
    reviewCount: 89,
    features: [
      'Puce M3',
      'Écran 13 pouces',
      '18h d\'autonomie',
      '8GB RAM',
      'SSD 256GB'
    ],
    isFeatured: true,
    createdAt: new Date('2024-08-10'),
    updatedAt: new Date('2024-09-18')
  },
  {
    id: '3',
    name: 'AirPods Pro (2e génération)',
    description: 'Écouteurs sans fil avec réduction de bruit active et son spatial personnalisé.',
    price: 279,
    originalPrice: 329,
    category: 'Électronique',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=500',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500'
    ],
    stock: 25,
    rating: 4.6,
    reviewCount: 203,
    features: [
      'Réduction de bruit active',
      'Son spatial',
      'Résistance à l\'eau IPX4',
      '6h d\'écoute',
      'Boîtier MagSafe'
    ],
    isNew: false,
    isFeatured: false,
    createdAt: new Date('2024-07-22'),
    updatedAt: new Date('2024-09-10')
  },
  {
    id: '4',
    name: 'Sweat-shirt Premium',
    description: 'Sweat-shirt en coton bio, coupe décontractée, parfait pour toutes les saisons.',
    price: 89,
    category: 'Mode',
    brand: 'Urban Style',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'
    ],
    stock: 42,
    rating: 4.4,
    reviewCount: 67,
    features: [
      'Coton bio 100%',
      'Coupe décontractée',
      'Lavage machine',
      'Tailles XS à XXL',
      'Plusieurs coloris'
    ],
    isNew: false,
    isFeatured: false,
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2024-09-05')
  },
  {
    id: '5',
    name: 'Baskets Running Pro',
    description: 'Chaussures de course haute performance avec technologie d\'amortissement avancée.',
    price: 159,
    category: 'Sport & Loisirs',
    brand: 'SportTech',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500'
    ],
    stock: 18,
    rating: 4.9,
    reviewCount: 156,
    features: [
      'Technologie d\'amortissement',
      'Semelle anti-dérapante',
      'Mesh respirant',
      'Design ergonomique',
      'Garantie 2 ans'
    ],
    isNew: true,
    isFeatured: true,
    createdAt: new Date('2024-09-01'),
    updatedAt: new Date('2024-09-22')
  },
  {
    id: '6',
    name: 'Lampe Design LED',
    description: 'Lampe de bureau design avec éclairage LED variable, contrôle tactile et port USB.',
    price: 79,
    originalPrice: 99,
    category: 'Maison & Jardin',
    brand: 'LightCo',
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500'
    ],
    stock: 31,
    rating: 4.5,
    reviewCount: 94,
    features: [
      'LED économique',
      'Luminosité variable',
      'Contrôle tactile',
      'Port USB intégré',
      'Design minimaliste'
    ],
    isNew: false,
    isFeatured: false,
    createdAt: new Date('2024-05-20'),
    updatedAt: new Date('2024-08-30')
  }
];

// Fonction utilitaire pour obtenir les produits par catégorie
export const getProductsByCategory = (categorySlug: string): Product[] => {
  const category = categories.find(cat => cat.slug === categorySlug);
  if (!category) return [];
  
  return products.filter(product => 
    product.category.toLowerCase() === category.name.toLowerCase()
  );
};

// Fonction utilitaire pour obtenir un produit par ID
export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

// Fonction utilitaire pour rechercher des produits
export const searchProducts = (query: string): Product[] => {
  const searchTerm = query.toLowerCase();
  return products.filter(product =>
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.brand.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm)
  );
};

