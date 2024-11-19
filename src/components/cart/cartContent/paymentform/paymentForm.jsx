import React from "react";

const PaymentForm = ({ methodPayment, setMethodPayment }) => {
  return (
    <div>
      <label>Selecciona el método de pago:</label>
      <select
        name="methodPayment"
        value={methodPayment}
        onChange={(e) => setMethodPayment(e.target.value)}
      >
        <option value="efectivo">Efectivo</option>
        <option value="tarjeta">Tarjeta</option>
      </select>
    </div>
  );
};

export default PaymentForm;
