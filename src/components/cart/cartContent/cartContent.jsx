import { useEffect, useState, useContext } from "react";
import { db } from "../../../firebase/firebaseconfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { AuthContext } from "../../../context/authcontext";
import { CartContext } from "../../../context/dataContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import CartSummary from "./cartSumary/cartSumary";
import DeliveryForm from "./deliverycart/deliverycart";
import PaymentForm from "./paymentform/paymentForm";
import CartEmpty from "./cartEmpty/cartEmpty";
import ObsOrder from "./ObsOrder/index";
import './cartcontent.css';

const CartContent = () => {
  const { user } = useContext(AuthContext);
  const { cartItems, updateCart } = useContext(CartContext);
  const [userData, setUserData] = useState(null);
  const [total, setTotal] = useState(0);
  const [deliveryOption, setDeliveryOption] = useState("retirar");
  const [address, setAddress] = useState("");
  const [methodPayment, setMethodPayment] = useState("efectivo");
  const [isAddressValid, setIsAddressValid] = useState(true);
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [obsOrder, setObsOrder] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [nameClient, setNameClient] = useState(""); // Estado para el nombre del cliente
  const navigate = useNavigate();

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
      const totalAmount = cartItems.reduce((acc, item) => {
        if (item.category === "1/2 y 1/2") {
          return acc + item.totalPrice * item.quantity;
        } else {
          return acc + item.price * item.quantity;
        }
      }, 0);
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
      .map(item => {
        if (item.id === id && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        if (item.id === id && item.quantity === 1) {
          return null;
        }
        return item;
      })
      .filter(item => item !== null);
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
      totalAmount: total + deliveryCost,
      deliveryOption: deliveryOption,
      address: address,
      methodPayment: methodPayment,
      timestamp: new Date().toISOString(),
      deliveryCost: deliveryCost,
      obs: obsOrder,
      selectedHour: selectedHour || "Cuando este listo", // Si no se selecciona una hora, se establece como "No especificado"
      nameClient: user.email === 'admin@elgalponcito.com' ? nameClient : userData.nombre, // Incluir el nombre del cliente si es admin
    };

    const orderRef = doc(db, "Pedidos", user.uid + "_" + new Date().toISOString());

    try {
      await setDoc(orderRef, order);
      updateCart([]);
      Swal.fire({
        title: "¡Pedido Confirmado! 🎉",
        text: "¡Gracias por elegirnos, Vamos a preparar tu pedido!",
        icon: "success",
        confirmButtonText: "¡Genial!",
      }).then(() => {
        navigate("/clients");
      });
    } catch (error) {
      Swal.fire({
        title: "¡Ups! Algo salió mal 😔",
        text: "Parece que hubo un error al enviar tu pedido. Por favor, intenta de nuevo.",
        icon: "error",
        confirmButtonText: "¡Lo intentaré de nuevo!",
      });
    }
  };

  if (!userData) return <p>Estamos cargando tus datos... ¡un momento! ⏳</p>;

  if (cartItems.length === 0) {
    return <CartEmpty />;
  }

  return (
    <div className="cartContainer">
      <div className="cartForm">
        <CartSummary
          cartItems={cartItems}
          total={total}
          deliveryCost={deliveryCost}
          increaseQuantity={increaseQuantity}
          decreaseQuantity={decreaseQuantity}
        />
        <DeliveryForm
          deliveryOption={deliveryOption}
          setDeliveryOption={setDeliveryOption}
          address={address}
          setAddress={setAddress}
          isAddressValid={isAddressValid}
          setIsAddressValid={setIsAddressValid}
          setDeliveryCost={setDeliveryCost}
          selectedHour={selectedHour}
          setSelectedHour={setSelectedHour}
        />
        <PaymentForm
          methodPayment={methodPayment}
          setMethodPayment={setMethodPayment}
        />
        {user.email === 'admin@elgalponcito.com' && (
          <div className="admin-name-client">
            <label htmlFor="nameClient">Nombre del Cliente:</label>
            <input
              type="text"
              id="nameClient"
              value={nameClient}
              onChange={(e) => setNameClient(e.target.value)}
            />
          </div>
        )}
        <div className="observations">
          <textarea
            id="obsOrder"
            placeholder="¿Alguna preferencia especial para tu pedido?"
            value={obsOrder}
            onChange={(e) => setObsOrder(e.target.value)}
          />
        </div>
        <button onClick={handleSubmit} disabled={!cartItems.length || !isAddressValid}>
          Confirmar Pedido
        </button>
      </div>
    </div>
  );
};

export default CartContent;
