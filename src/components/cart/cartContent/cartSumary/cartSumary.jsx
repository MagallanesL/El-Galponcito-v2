import React from "react";

const CartSummary = ({ cartItems, total, increaseQuantity, decreaseQuantity }) => {
  return (
    <div className="cartDetails">
      <h3 className="info-degustar">¡Veamos con qué te vas a degustar hoy!</h3>
      {cartItems.length === 0 ? (
        <p>Tu carrito está vacío... ¡Agrega productos para empezar! 🌟</p>
      ) : (
        <ul>
          {cartItems.map((item, index) => (
            <li key={item.id || index}>
              <span>
                {item.category === "1/2 y 1/2"
                  ? `${item.half1.name} y ${item.half2.name}`
                  : item.name}
              </span>
              <span>${item.totalPrice || item.price}</span>
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
