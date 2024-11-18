import { useEffect, useState, useContext } from "react";
import { db } from "../../../firebase/firebaseconfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { AuthContext } from "../../../context/authcontext";
import { CartContext } from "../../../context/dataContext";
import { useNavigate } from "react-router-dom"; // Para redirección
import Swal from "sweetalert2"; // Importar SweetAlert2
import './cartcontent.css';

const CartContent = () => {
  const { user } = useContext(AuthContext);
  const { cartItems, updateCart } = useContext(CartContext);
  const [userData, setUserData] = useState(null);
  const [total, setTotal] = useState(0);
  const [deliveryOption, setDeliveryOption] = useState("retirar");
  const [address, setAddress] = useState("");
  const [methodPayment, setMethodPayment] = useState("efectivo");
  const navigate = useNavigate(); // Hook para redirección

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

  useEffect(() => {
    const calculateTotal = () => {
      const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
      setTotal(totalAmount);
    };
    calculateTotal();
  }, [cartItems]);

  const increaseQuantity = (id) => {
    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updatedItems);
  };

  const decreaseQuantity = (id) => {
    const updatedItems = cartItems
      .map(item =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      )
      .filter(item => item.quantity > 0); 
    updateCart(updatedItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const order = {
      userId: user.uid,
      userName: userData.nombre,
      userEmail: userData.email,
      userPhone: userData.telefono,
      items: cartItems,
      totalAmount: total,
      deliveryOption: deliveryOption,
      address: address,
      methodPayment: methodPayment,
      timestamp: new Date().toISOString()
    };
  
    const orderRef = doc(db, "Pedidos", user.uid + "_" + new Date().toISOString());
    
    try {
      // Guardar el pedido en la base de datos
      await setDoc(orderRef, order);
  
      
      updateCart([]); 
  
      // Mostrar el Swal alert
      Swal.fire({
        title: "¡Pedido Confirmado! 🎉",
        text: "¡Gracias por elegirnos, tu pizza está en camino! 🍕🍕\nNos vemos pronto en el galpón más delicioso de la ciudad!",
        icon: "success",
        confirmButtonText: "¡Genial! 🍕",
        customClass: {
          confirmButton: 'swal-button'
        }
      }).then(() => {
        // Redirigir al cliente a la ruta de clientes
        navigate("/clients");
      });
  
    } catch (error) {
      Swal.fire({
        title: "¡Ups! Algo salió mal 😔",
        text: "Parece que hubo un error al enviar tu pedido. Por favor, intenta de nuevo.",
        icon: "error",
        confirmButtonText: "¡Lo intentaré de nuevo! 🔄"
      });
    }
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
                  <span>{item.name}</span> 
                  <span>${item.price}</span> 
                  <span>x {item.quantity}</span>
                  <div className="quantity-controls">
                    <button className="quantity-btn" onClick={() => decreaseQuantity(item.id)}>-</button>
                    <button className="quantity-btn" onClick={() => increaseQuantity(item.id)}>+</button>
                  </div>
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
              <label>¿Método de pago?</label>
              <select
                value={methodPayment}
                onChange={(e) => setMethodPayment(e.target.value)}
              >
                <option value="efectivo">Efectivo 💵</option>
                <option value="mercado_pago">Mercado Pago 💳</option>
              </select>
            </div>

            {methodPayment === "mercado_pago" && (
              <div className="alias-info">
                <p><strong>Alias: elGalponcito.mp</strong></p>
              </div>
            )}

            <button type="submit">¡Confirmar mi pedido! 🎯</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CartContent;
