"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category?: string;
  size?: string;
  color?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (id: string, size?: string, color?: string) => void;
  updateQuantity: (
    id: string,
    quantity: number,
    size?: string,
    color?: string
  ) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (
    item: Omit<CartItem, "quantity">,
    quantity: number = 1
  ) => {
    setCart((prev) => {
      // Find existing item with same id, size, and color
      const existingItem = prev.find(
        (i) =>
          i._id === item._id && i.size === item.size && i.color === item.color
      );
      if (existingItem) {
        return prev.map((i) =>
          i._id === item._id && i.size === item.size && i.color === item.color
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const removeFromCart = (id: string, size?: string, color?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(item._id === id && item.size === size && item.color === color)
      )
    );
  };

  const updateQuantity = (
    id: string,
    quantity: number,
    size?: string,
    color?: string
  ) => {
    if (quantity <= 0) {
      removeFromCart(id, size, color);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item._id === id && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
