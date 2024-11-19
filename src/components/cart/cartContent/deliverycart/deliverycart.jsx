import React from "react";

const DeliveryForm = ({ deliveryOption, setDeliveryOption, address, setAddress, isAddressValid }) => {
  return (
    <div>
      <label>¿Quieres que te lo enviemos?</label>
      <select
        name="deliveryOption"
        value={deliveryOption}
        onChange={(e) => setDeliveryOption(e.target.value)}
      >
        <option value="retirar">Retiro en tienda</option>
        <option value="enviar">Envío a domicilio</option>
      </select>

      {deliveryOption === "enviar" && (
        <div>
          <label>Dirección de envío:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Ingresa tu dirección"
          />
          {!isAddressValid && <p style={{ color: "red" }}>Dirección fuera de zona de envío.</p>}
        </div>
      )}
    </div>
  );
};

export default DeliveryForm;
