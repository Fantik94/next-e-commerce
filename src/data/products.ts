import { Product, Category } from '@/types';

// Catégories multimédia et technologie
export const categories: Category[] = [
  {
    id: '1',
    name: 'Gaming',
    slug: 'gaming',
    description: 'Consoles, jeux vidéo et accessoires gaming',
    productCount: 6
  },
  {
    id: '2',
    name: 'Audio & Son',
    slug: 'audio-son',
    description: 'Écouteurs, casques, enceintes et systèmes audio',
    productCount: 5
  },
  {
    id: '3',
    name: 'Ordinateurs',
    slug: 'ordinateurs',
    description: 'PC fixes, portables et composants informatiques',
    productCount: 6
  },
  {
    id: '4',
    name: 'Smartphones & Tablettes',
    slug: 'smartphones-tablettes',
    description: 'Téléphones, tablettes et accessoires mobiles',
    productCount: 4
  },
  {
    id: '5',
    name: 'TV & Multimédia',
    slug: 'tv-multimedia',
    description: 'Télévisions, streaming et équipements home-cinéma',
    productCount: 3
  }
];

// Produits multimédia et technologie
export const products: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    description: 'Le dernier smartphone Apple avec puce A17 Pro, appareil photo 48MP et design en titane.',
    price: 1229,
    originalPrice: 1299,
    category: 'Smartphones & Tablettes',
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
    category: 'Ordinateurs',
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
    category: 'Audio & Son',
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
    name: 'PlayStation 5',
    description: 'Console de jeux nouvelle génération avec SSD ultra-rapide et manette DualSense.',
    price: 549,
    originalPrice: 599,
    category: 'Gaming',
    brand: 'Sony',
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500',
      'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=500'
    ],
    stock: 12,
    rating: 4.9,
    reviewCount: 345,
    features: [
      'SSD ultra-rapide',
      'Ray tracing',
      'Manette DualSense',
      '4K/120fps',
      'Audio 3D Tempest'
    ],
    isNew: false,
    isFeatured: true,
    createdAt: new Date('2024-08-15'),
    updatedAt: new Date('2024-09-20')
  },
  {
    id: '5',
    name: 'PC Gaming RTX 4070',
    description: 'PC gaming haute performance avec RTX 4070, processeur Intel i7 et 32GB RAM.',
    price: 1899,
    category: 'Ordinateurs',
    brand: 'ASUS',
    images: [
      'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=500',
      'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500'
    ],
    stock: 6,
    rating: 4.8,
    reviewCount: 89,
    features: [
      'RTX 4070 8GB',
      'Intel i7-13700K',
      '32GB DDR5',
      'SSD 1TB NVMe',
      'Wi-Fi 6E'
    ],
    isNew: true,
    isFeatured: true,
    createdAt: new Date('2024-09-01'),
    updatedAt: new Date('2024-09-22')
  },
  {
    id: '6',
    name: 'iPad Air M2',
    description: 'Tablette puissante avec puce M2, écran Liquid Retina 10,9 pouces et compatibilité Apple Pencil.',
    price: 699,
    category: 'Smartphones & Tablettes',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500'
    ],
    stock: 18,
    rating: 4.7,
    reviewCount: 156,
    features: [
      'Puce M2',
      'Écran 10,9 pouces',
      'Compatibilité Apple Pencil',
      'Touch ID',
      'USB-C'
    ],
    isNew: false,
    isFeatured: false,
    createdAt: new Date('2024-07-10'),
    updatedAt: new Date('2024-09-15')
  },
  {
    id: '7',
    name: 'Sony WH-1000XM5',
    description: 'Casque sans fil haut de gamme avec réduction de bruit leader du marché.',
    price: 349,
    originalPrice: 419,
    category: 'Audio & Son',
    brand: 'Sony',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500'
    ],
    stock: 24,
    rating: 4.8,
    reviewCount: 267,
    features: [
      'Réduction de bruit adaptée',
      '30h d\'autonomie',
      'Charge rapide',
      'Hi-Res Audio',
      'Multipoint Bluetooth'
    ],
    isNew: false,
    isFeatured: true,
    createdAt: new Date('2024-06-20'),
    updatedAt: new Date('2024-09-10')
  },
  {
    id: '8',
    name: 'Samsung OLED 55" 4K',
    description: 'Téléviseur OLED 55 pouces avec technologie Quantum Dot et Smart TV Tizen.',
    price: 1299,
    originalPrice: 1599,
    category: 'TV & Multimédia',
    brand: 'Samsung',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500',
      'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=500'
    ],
    stock: 8,
    rating: 4.6,
    reviewCount: 124,
    features: [
      'OLED 4K HDR',
      'Quantum Dot',
      'Smart TV Tizen',
      '120Hz VRR',
      'Assistant vocal'
    ],
    isNew: false,
    isFeatured: false,
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2024-08-30')
  },
  {
    id: '9',
    name: 'Nintendo Switch OLED',
    description: 'Console hybride avec écran OLED 7 pouces, dock amélioré et stockage 64GB.',
    price: 349,
    category: 'Gaming',
    brand: 'Nintendo',
    images: [
      'https://images.unsplash.com/photo-1606813907527-eb1c1cfc98b3?w=500',
      'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500'
    ],
    stock: 22,
    rating: 4.5,
    reviewCount: 198,
    features: [
      'Écran OLED 7 pouces',
      'Mode portable/TV',
      'Stockage 64GB',
      'Dock amélioré',
      'Joy-Con HD'
    ],
    isNew: false,
    isFeatured: false,
    createdAt: new Date('2024-04-12'),
    updatedAt: new Date('2024-09-05')
  },
  {
    id: '10',
    name: 'Enceinte JBL Charge 5',
    description: 'Enceinte Bluetooth portable étanche avec batterie 20h et fonction powerbank.',
    price: 179,
    originalPrice: 229,
    category: 'Audio & Son',
    brand: 'JBL',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500'
    ],
    stock: 35,
    rating: 4.4,
    reviewCount: 342,
    features: [
      'Bluetooth 5.1',
      'Étanche IP67',
      '20h d\'autonomie',
      'Fonction powerbank',
      'Son JBL Pro'
    ],
    isNew: false,
    isFeatured: false,
    createdAt: new Date('2024-03-28'),
    updatedAt: new Date('2024-08-15')
  },
  {
    id: '11',
    name: 'Xbox Series X',
    description: 'Console de jeux Microsoft avec processeur custom et compatibilité 4K 120fps.',
    price: 499,
    category: 'Gaming',
    brand: 'Microsoft',
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500',
      'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=500'
    ],
    stock: 10,
    rating: 4.8,
    reviewCount: 289,
    features: [
      'Processeur custom AMD',
      '4K 120fps',
      'SSD 1TB',
      'Rétrocompatibilité',
      'Quick Resume'
    ],
    isNew: false,
    isFeatured: false,
    createdAt: new Date('2024-07-05'),
    updatedAt: new Date('2024-09-12')
  },
  {
    id: '12',
    name: 'MacBook Pro M3 Pro',
    description: 'Ordinateur portable professionnel 14 pouces avec puce M3 Pro et écran Liquid Retina XDR.',
    price: 2499,
    category: 'Ordinateurs',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'
    ],
    stock: 5,
    rating: 4.9,
    reviewCount: 145,
    features: [
      'Puce M3 Pro',
      'Écran 14 pouces XDR',
      '18GB RAM',
      'SSD 512GB',
      '18h d\'autonomie'
    ],
    isNew: true,
    isFeatured: true,
    createdAt: new Date('2024-09-10'),
    updatedAt: new Date('2024-09-23')
  },
  {
    id: '13',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Smartphone premium avec S Pen intégré, caméra 200MP et écran Dynamic AMOLED 6,8 pouces.',
    price: 1299,
    originalPrice: 1419,
    category: 'Smartphones & Tablettes',
    brand: 'Samsung',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'
    ],
    stock: 14,
    rating: 4.7,
    reviewCount: 256,
    features: [
      'S Pen intégré',
      'Caméra 200MP',
      'Écran 6,8" Dynamic AMOLED',
      'Snapdragon 8 Gen 3',
      'Résistance IP68'
    ],
    isNew: true,
    isFeatured: false,
    createdAt: new Date('2024-09-18'),
    updatedAt: new Date('2024-09-24')
  },
  {
    id: '14',
    name: 'Bose QuietComfort 45',
    description: 'Casque sans fil avec réduction de bruit active primée et jusqu\'à 24h d\'autonomie.',
    price: 329,
    originalPrice: 379,
    category: 'Audio & Son',
    brand: 'Bose',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500'
    ],
    stock: 18,
    rating: 4.8,
    reviewCount: 189,
    features: [
      'Réduction de bruit Bose',
      '24h d\'autonomie',
      'Bluetooth 5.1',
      'Charge rapide 15min = 3h',
      'Assistant vocal'
    ],
    isNew: false,
    isFeatured: true,
    createdAt: new Date('2024-08-12'),
    updatedAt: new Date('2024-09-15')
  },
  {
    id: '15',
    name: 'Logitech MX Master 3S',
    description: 'Souris ergonomique sans fil avec capteur 8K DPI et boutons programmables.',
    price: 109,
    category: 'Ordinateurs',
    brand: 'Logitech',
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500'
    ],
    stock: 32,
    rating: 4.6,
    reviewCount: 145,
    features: [
      'Capteur 8K DPI',
      'Bluetooth & USB-C',
      '70 jours d\'autonomie',
      'Roue MagSpeed',
      'Compatible multi-OS'
    ],
    isNew: false,
    isFeatured: false,
    createdAt: new Date('2024-07-28'),
    updatedAt: new Date('2024-09-08')
  },
  {
    id: '16',
    name: 'LG OLED C3 65"',
    description: 'Téléviseur OLED 4K 65 pouces avec webOS, Dolby Vision IQ et HDMI 2.1.',
    price: 1799,
    originalPrice: 2199,
    category: 'TV & Multimédia',
    brand: 'LG',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500',
      'https://images.unsplash.com/photo-1461151304267-ef46e8efe395?w=500'
    ],
    stock: 6,
    rating: 4.9,
    reviewCount: 98,
    features: [
      'OLED 4K 65 pouces',
      'webOS Smart TV',
      'Dolby Vision IQ',
      'HDMI 2.1 VRR',
      'Magic Remote'
    ],
    isNew: false,
    isFeatured: true,
    createdAt: new Date('2024-06-08'),
    updatedAt: new Date('2024-09-20')
  },
  {
    id: '17',
    name: 'Steam Deck OLED',
    description: 'Console portable gaming avec écran OLED 7,4 pouces et SteamOS pour jouer partout.',
    price: 549,
    category: 'Gaming',
    brand: 'Valve',
    images: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500',
      'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=500'
    ],
    stock: 9,
    rating: 4.5,
    reviewCount: 167,
    features: [
      'Écran OLED 7,4 pouces',
      'SteamOS Linux',
      'Compatible PC gaming',
      'Stockage 512GB',
      'Dock optionnel'
    ],
    isNew: true,
    isFeatured: false,
    createdAt: new Date('2024-09-05'),
    updatedAt: new Date('2024-09-22')
  },
  {
    id: '18',
    name: 'Apple Watch Series 9',
    description: 'Montre connectée avec puce S9, écran Always-On et nouvelles fonctionnalités santé.',
    price: 449,
    category: 'Smartphones & Tablettes',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500',
      'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=500'
    ],
    stock: 22,
    rating: 4.6,
    reviewCount: 203,
    features: [
      'Puce S9 double-tap',
      'Écran Always-On',
      'Suivi santé avancé',
      'Résistance 50m',
      'watchOS 10'
    ],
    isNew: true,
    isFeatured: false,
    createdAt: new Date('2024-09-12'),
    updatedAt: new Date('2024-09-24')
  },
  {
    id: '19',
    name: 'Corsair K95 RGB Platinum',
    description: 'Clavier mécanique gaming RGB avec switches Cherry MX et touches macro dédiées.',
    price: 199,
    originalPrice: 249,
    category: 'Ordinateurs',
    brand: 'Corsair',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
      'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500'
    ],
    stock: 15,
    rating: 4.7,
    reviewCount: 134,
    features: [
      'Switches Cherry MX Speed',
      'RGB per-key',
      '6 touches macro G',
      'Repose-poignet détachable',
      'Logiciel iCUE'
    ],
    isNew: false,
    isFeatured: false,
    createdAt: new Date('2024-05-22'),
    updatedAt: new Date('2024-08-18')
  },
  {
    id: '20',
    name: 'Marshall Acton III',
    description: 'Enceinte Bluetooth vintage avec son signature Marshall et connectivité moderne.',
    price: 279,
    category: 'Audio & Son',
    brand: 'Marshall',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'
    ],
    stock: 11,
    rating: 4.5,
    reviewCount: 87,
    features: [
      'Son signature Marshall',
      'Bluetooth 5.2',
      'Design vintage iconique',
      'Égaliseur 3 bandes',
      '12h d\'autonomie'
    ],
    isNew: false,
    isFeatured: false,
    createdAt: new Date('2024-06-30'),
    updatedAt: new Date('2024-09-10')
  },
  {
    id: '21',
    name: 'ASUS ROG Strix 4080 Super',
    description: 'Carte graphique RTX 4080 Super avec refroidissement triple-ventilateur et RGB.',
    price: 1199,
    category: 'Ordinateurs',
    brand: 'ASUS',
    images: [
      'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500',
      'https://images.unsplash.com/photo-1518157372605-53386f04e187?w=500'
    ],
    stock: 4,
    rating: 4.8,
    reviewCount: 76,
    features: [
      'RTX 4080 Super 16GB',
      'Refroidissement triple-fan',
      'RGB Aura Sync',
      'Boost jusqu\'à 2640 MHz',
      'DLSS 3 & Ray Tracing'
    ],
    isNew: true,
    isFeatured: true,
    createdAt: new Date('2024-09-15'),
    updatedAt: new Date('2024-09-25')
  },
  {
    id: '22',
    name: 'Google Nest Hub Max',
    description: 'Écran connecté 10 pouces avec Assistant Google, caméra et contrôle domotique.',
    price: 229,
    originalPrice: 279,
    category: 'TV & Multimédia',
    brand: 'Google',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
      'https://images.unsplash.com/photo-1551808525-51a94da548ce?w=500'
    ],
    stock: 16,
    rating: 4.4,
    reviewCount: 112,
    features: [
      'Écran tactile 10 pouces',
      'Assistant Google intégré',
      'Caméra Nest',
      'Contrôle domotique',
      'YouTube & Netflix'
    ],
    isNew: false,
    isFeatured: false,
    createdAt: new Date('2024-04-18'),
    updatedAt: new Date('2024-08-25')
  },
  {
    id: '23',
    name: 'Razer DeathAdder V3 Pro',
    description: 'Souris gaming sans fil ultra-légère avec capteur Focus Pro 30K et switches optiques.',
    price: 149,
    category: 'Gaming',
    brand: 'Razer',
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
      'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=500'
    ],
    stock: 28,
    rating: 4.6,
    reviewCount: 198,
    features: [
      'Capteur Focus Pro 30K',
      'Switches optiques Gen-3',
      '90h d\'autonomie',
      'HyperSpeed Wireless',
      'Ergonomie parfaite'
    ],
    isNew: false,
    isFeatured: false,
    createdAt: new Date('2024-07-14'),
    updatedAt: new Date('2024-09-12')
  },
  {
    id: '24',
    name: 'Meta Quest 3',
    description: 'Casque VR standalone avec réalité mixte, résolution 4K+ et bibliothèque de jeux immense.',
    price: 549,
    category: 'Gaming',
    brand: 'Meta',
    images: [
      'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=500',
      'https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=500'
    ],
    stock: 7,
    rating: 4.7,
    reviewCount: 145,
    features: [
      'Réalité mixte couleur',
      'Résolution 4K+',
      'Snapdragon XR2 Gen 2',
      'Suivi des mains',
      'Meta Store intégré'
    ],
    isNew: true,
    isFeatured: true,
    createdAt: new Date('2024-09-08'),
    updatedAt: new Date('2024-09-23')
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

