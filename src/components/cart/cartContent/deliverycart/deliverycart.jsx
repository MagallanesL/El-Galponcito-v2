import React from "react";
import { FaMotorcycle, FaHome } from "react-icons/fa"; // Iconos de moto y casa

const DeliveryForm = ({ deliveryOption, setDeliveryOption, address, setAddress, isAddressValid }) => {
  return (
    <div>
      <label style={{ fontWeight: 'bold', fontSize: '16px' }}>¿Te lo llevamos a tu puerta? <FaMotorcycle style={{ color: '#FF6347' }} /></label>
      <select
        name="deliveryOption"
        value={deliveryOption}
        onChange={(e) => setDeliveryOption(e.target.value)}
        style={{ padding: '5px', fontSize: '14px' }}
      >
        <option value="retirar">🏠 ¡Retiro en el local! </option>
        <option value="enviar">🚚 ¡Envíamelo a mi casa! </option>
      </select>

      {deliveryOption === "enviar" && (
        <div style={{ marginTop: '10px' }}>
          <label style={{ fontSize: '14px' }}>¿Dónde te lo enviamos? <FaHome style={{ color: '#20B2AA' }} /></label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Ingresa tu dirección 🏡"
            style={{
              padding: '8px',
              width: '100%',
              fontSize: '14px',
              marginTop: '5px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DeliveryForm;
