import React from "react";

const CartSummary = ({ cartItems, total, deliveryCost, increaseQuantity, decreaseQuantity }) => {
  // Calcular el total incluyendo el costo del delivery
  const totalWithDelivery = total + (deliveryCost || 0);

  // Crear un item de delivery si hay un costo de envío
  const deliveryItem = deliveryCost
    ? { id: 'delivery', name: 'Delivery', price: deliveryCost, quantity: 1 }
    : null;

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
          {deliveryItem && (
            <li key={deliveryItem.id}>
              <span>{deliveryItem.name}</span>
              <span>${deliveryItem.price.toFixed(2)}</span>
              <span>x {deliveryItem.quantity}</span>
            </li>
          )}
        </ul>
      )}
      <div className="totalAmount">
        <strong>Total: ${totalWithDelivery.toFixed(2)} </strong>
      </div>
    </div>
  );
};

export default CartSummary;
