import React, { createContext, useState } from 'react';

// Crear el contexto del carrito
export const CartContext = createContext();

// Proveedor del contexto
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Función para agregar un producto al carrito
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingProduct = prevItems.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  // Función para actualizar el carrito, para aumentar o disminuir la cantidad
  const updateCart = (updatedItems) => {
    setCartItems(updatedItems);
  };

  // Función para obtener la cantidad total de productos en el carrito
  const getTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateCart, getTotalQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
