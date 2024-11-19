import React from "react";

const CartSummary = ({ cartItems, total, increaseQuantity, decreaseQuantity }) => {
  return (
    <div className="cartDetails">
      <h3 className="info-degustar">¡Veamos con qué te vas a degustar hoy!</h3>
      {cartItems.length === 0 ? (
        <p>Tu carrito está vacío... ¡Agrega productos para empezar! 🌟</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              <span>{item.name}</span>
              <span>${item.price}</span>
              <span>x {item.quantity}</span>
              <div className="quantity-controls">
                <button className="quantity-btn" onClick={() => decreaseQuantity(item.id)}>-</button>
                <button className="quantity-btn" onClick={() => increaseQuantity(item.id)}>+</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="totalAmount">
        <strong>Total: </strong>${total}
      </div>
    </div>
  );
};

export default CartSummary;
