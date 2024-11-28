import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prevItems,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  const addHalfToCart = (half, price) => {
    setCartItems((prevItems) => {
      const existingPizza = prevItems.find((item) => item.category === "1/2 y 1/2" && !item.half2);

      if (existingPizza) {
        return prevItems.map((item) =>
          item === existingPizza
            ? {
                ...item,
                half2: half,
                totalPrice: item.totalPrice + price,
              }
            : item
        );
      }

      return [
        ...prevItems,
        {
          category: "1/2 y 1/2",
          half1: half,
          half2: null,
          totalPrice: price,
          quantity: 1,
        },
      ];
    });
  };

  const getTotalQuantity = () => {
    return cartItems.reduce((total, item) => {
      if (item.category === "1/2 y 1/2") {
        return total + item.quantity;
      } else {
        return total + item.quantity;
      }
    }, 0);
  };
  
  const updateCart = (updatedItems) => {
    setCartItems(updatedItems);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        addHalfToCart,
        updateCart,
        getTotalQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
