import { useEffect, useState, useContext } from "react";
import { db } from "../../../firebase/firebaseconfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { AuthContext } from "../../../context/authcontext";
import { CartContext } from "../../../context/dataContext";
import './cartcontent.css';

const CartContent = () => {
  const { user } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const [userData, setUserData] = useState(null);
  const [total, setTotal] = useState(0);
  const [deliveryOption, setDeliveryOption] = useState("retirar");
  const [address, setAddress] = useState("");
  const [methodPayment, setMethodPayment] = useState("efectivo"); 

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid) {
        const userDocRef = doc(db, "Usuarios", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };
    fetchUserData();
  }, [user]);

  // Calcular el total
  useEffect(() => {
    const calculateTotal = () => {
      const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
      setTotal(totalAmount);
    };
    calculateTotal();
  }, [cartItems]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Crear el objeto con la información del pedido
    const order = {
      userId: user.uid,
      userName: userData.nombre,
      userEmail: userData.email,
      userPhone: userData.telefono,
      items: cartItems,
      totalAmount: total,
      deliveryOption: deliveryOption,
      address: address,
      methodPayment: methodPayment, // Incluye el método de pago
      timestamp: new Date().toISOString()
    };

    // Enviar el pedido a Firebase
    const orderRef = doc(db, "Pedidos", user.uid + "_" + new Date().toISOString());
    setDoc(orderRef, order).then(() => {
      console.log("¡Pedido enviado con éxito! 🎉");
    }).catch((error) => {
      console.error("Oops, algo salió mal al enviar el pedido: ", error);
    });
  };

  if (!userData) return <p>Estamos cargando tus datos... ¡un momento! ⏳</p>;

  return (
    <div className="cartContainer">
      <div className="cartForm">
        <h2>¡Listo para tu pedido {userData.nombre}? 🛍️</h2>

        <div className="cartDetails">
          <h3 className="info-degustar">¡Veamos con qué te vas a degustar hoy!</h3>
          {cartItems.length === 0 ? (
            <p>Tu carrito está vacío... ¡Agrega productos para empezar! 🌟</p>
          ) : (
            <ul>
              {cartItems.map((item) => (
                <li key={item.id}>
                  {item.name} - ${item.price} x {item.quantity}
                </li>
              ))}
              <p><strong>Total: </strong>${total}</p>
            </ul>
          )}
        </div>
        <div className="deliveryOption">
          <form onSubmit={handleSubmit}>
            <div>
              <label>¿Cómo quieres recibirlo?</label>
              <select
                value={deliveryOption}
                onChange={(e) => setDeliveryOption(e.target.value)}
              >
                <option value="retirar">¡Voy a retirarlo en el lugar! 🎉</option>
                <option value="enviar">Envío a domicilio, ¡sí por favor! 🚚</option>
              </select>
            </div>
            {deliveryOption === "enviar" && (
              <div>
                <label>Dirección de envío</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
            )}
         <div>
  <label>¿Cómo deseas pagar?</label>
  <select
    value={methodPayment}
    onChange={(e) => setMethodPayment(e.target.value)}
  >
    <option value="efectivo">Efectivo</option>
    <option value="mercadoPago">Transferencia por Mercado Pago</option>
  </select>
</div>
{methodPayment === "mercadoPago" && (
  <p>
    <strong>Alias:</strong> 
    <span style={{ 
      color: "#ff5722", 
      fontWeight: "bold", 
      fontSize: "1.2em", 
      backgroundColor: "#fff5e1", 
      padding: "5px 10px", 
      borderRadius: "5px" 
    }}>
      alu.magallanes.mp
    </span>
  </p>
)}

            <button type="submit">¡Confirmar mi pedido! 🎯</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CartContent;
