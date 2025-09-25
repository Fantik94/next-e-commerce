'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CartItem, Cart, Product } from '@/types';
import { useLoading } from './useLoading';

// Actions pour le reducer
type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity?: number; selectedSize?: string; selectedColor?: string } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: Cart };

// State initial du panier
const initialCart: Cart = {
  items: [],
  total: 0,
  itemCount: 0
};

// Fonction pour calculer le total et le nombre d'articles
const calculateCartTotals = (items: CartItem[]): { total: number; itemCount: number } => {
  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
};

// Reducer pour gérer les actions du panier
const cartReducer = (state: Cart, action: CartAction): Cart => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity = 1, selectedSize, selectedColor } = action.payload;
      
      // Chercher si le produit est déjà dans le panier avec les mêmes options
      const existingItemIndex = state.items.findIndex(
        item => 
          item.product.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Mettre à jour la quantité
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Ajouter un nouvel article
        const newItem: CartItem = {
          product,
          quantity,
          selectedSize,
          selectedColor
        };
        newItems = [...state.items, newItem];
      }

      const { total, itemCount } = calculateCartTotals(newItems);
      return { items: newItems, total, itemCount };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.product.id !== action.payload.productId);
      const { total, itemCount } = calculateCartTotals(newItems);
      return { items: newItems, total, itemCount };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Si la quantité est 0 ou négative, supprimer l'article
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { productId } });
      }

      const newItems = state.items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      );

      const { total, itemCount } = calculateCartTotals(newItems);
      return { items: newItems, total, itemCount };
    }

    case 'CLEAR_CART': {
      return initialCart;
    }

    case 'LOAD_CART': {
      return action.payload;
    }

    default:
      return state;
  }
};

// Interface du contexte
interface CartContextType {
  cart: Cart;
  addItem: (product: Product, quantity?: number, selectedSize?: string, selectedColor?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
}

// Création du contexte
const CartContext = createContext<CartContextType | undefined>(undefined);

// Hook pour utiliser le contexte
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Provider du contexte
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);

  // Charger le panier depuis le localStorage au montage
  useEffect(() => {
    const savedCart = localStorage.getItem('nextcommerce-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
      }
    }
  }, []);

  // Sauvegarder le panier dans le localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('nextcommerce-cart', JSON.stringify(cart));
  }, [cart]);

  // Fonctions du contexte
  const addItem = (
    product: Product, 
    quantity = 1, 
    selectedSize?: string, 
    selectedColor?: string
  ) => {
    dispatch({ 
      type: 'ADD_ITEM', 
      payload: { product, quantity, selectedSize, selectedColor } 
    });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const isInCart = (productId: string): boolean => {
    return cart.items.some(item => item.product.id === productId);
  };

  const getItemQuantity = (productId: string): number => {
    const item = cart.items.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  const value: CartContextType = {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
