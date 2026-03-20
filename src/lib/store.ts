import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Re-export types from hooks for backward compatibility
export type { Product } from '@/hooks/use-products';
export type { FreightZone, Coupon, StoreSettings } from '@/hooks/use-settings';

export interface CartItem {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
  };
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  favorites: string[];
  addToCart: (product: CartItem['product']) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleFavorite: (productId: string) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      favorites: [],
      addToCart: (product) =>
        set((state) => {
          const existing = state.cart.find((item) => item.product.id === product.id);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { product, quantity: 1 }] };
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        })),
      updateCartQuantity: (productId, quantity) =>
        set((state) => ({
          cart: quantity <= 0
            ? state.cart.filter((item) => item.product.id !== productId)
            : state.cart.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item
              ),
        })),
      clearCart: () => set({ cart: [] }),
      toggleFavorite: (productId) =>
        set((state) => ({
          favorites: state.favorites.includes(productId)
            ? state.favorites.filter((id) => id !== productId)
            : [...state.favorites, productId],
        })),
    }),
    {
      name: 'as-acessorios-cart',
      version: 1,
    }
  )
);

// Legacy alias - components can import useStore for cart/favorites
export const useStore = useCartStore;
