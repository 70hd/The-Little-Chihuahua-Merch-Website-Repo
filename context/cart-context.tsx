"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';

interface CartItem {
  id: string;
  title: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
  image: string;
  imageAlt: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (size: string, title: string) => void;
  updateQuantity: (size: string, title: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = Cookies.get('cart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (error) {
        console.error('Failed to parse cart from cookies:', error);
      }
    }
  }, []);

  useEffect(() => {
    Cookies.set('cart', JSON.stringify(cartItems), { expires: 7 });
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      const existing = prev.find(p => p.id === item.id && p.size === item.size && p.color === item.color);
      if (existing) {
        
        return prev.map(p =>{
          console.log(p.quantity + item.quantity)
          return p.id === item.id  ? { ...p, quantity: p.quantity + item.quantity } : p
        }
          
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (size: string, title: string) => {
    const filteredCart = cartItems.filter(item => !(item.title === title && item.size === size));
    setCartItems(filteredCart);

  };

  const updateQuantity = (size: string, title: string, quantity: number) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.size === size && item.title === title) {
          return { ...item, quantity };
        }
        return item;
      })
    );
   
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};