// Types principaux pour notre e-commerce

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // Prix barré pour les promos
  category: string;
  brand: string;
  images: string[];
  featuredImage?: string; // Image principale
  stock: number;
  rating: number;
  reviewCount: number;
  features: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  addresses: Address[];
  createdAt: Date;
}

export interface Address {
  id: string;
  type: 'billing' | 'shipping';
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  createdAt: Date;
}

// Types pour les filtres de recherche
export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface SearchParams {
  query?: string;
  filters: ProductFilters;
  sortBy: 'name' | 'price' | 'rating' | 'newest' | 'popular';
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

