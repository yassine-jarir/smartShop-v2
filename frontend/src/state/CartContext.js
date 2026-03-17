import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [promoCode, setPromoCode] = useState('');

  const addToCart = (product, quantity) => {
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantite: item.quantite + quantity }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        nom: product.nom,
        prixUnitaire: product.prixUnitaire,
        quantite: quantity,
        stockDisponible: product.stockDisponible,
      }]);
    }
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.productId === productId
          ? { ...item, quantite: quantity }
          : item
      ));
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setSelectedClient(null);
    setPromoCode('');
  };

  const value = {
    cart,
    selectedClient,
    promoCode,
    setSelectedClient,
    setPromoCode,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
