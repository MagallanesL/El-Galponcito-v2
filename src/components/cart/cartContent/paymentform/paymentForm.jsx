import React, { useState } from "react";
import { FaClipboard } from "react-icons/fa"; // Icono para copiar el alias

const PaymentForm = ({ methodPayment, setMethodPayment }) => {
  const [aliasCopied, setAliasCopied] = useState(false);
  
  const handleCopyAlias = () => {
    navigator.clipboard.writeText('elgalponcito.vm');
    setAliasCopied(true);
    setTimeout(() => setAliasCopied(false), 2000); // Resetear el mensaje después de 2 segundos
  };

  return (
    <div className="paymentForm">
      <label style={{ fontWeight: 'bold', fontSize: '16px' }}>¿Cómo lo querés abonar? 💳</label>
      <select
        name="methodPayment"
        value={methodPayment}
        onChange={(e) => setMethodPayment(e.target.value)}
        className="paymentMethodInput"
      >
        <option value="efectivo">💸 Efectivo</option>
        <option value="tarjeta">💳 Mercado Pago</option>
      </select>

      {methodPayment === "tarjeta" && (
        <div className="paymentAlias">
          <label style={{ fontSize: '14px' }}>Alias de Mercado Pago:</label>
          <div className="aliasContainer">
            <span className="aliasText">elgalponcito.vm</span>
            <FaClipboard 
              className="copyIcon"
              onClick={handleCopyAlias}
              title="Copiar Alias"
            />
            {aliasCopied && <span className="copiedMessage">¡Copiado!</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;
