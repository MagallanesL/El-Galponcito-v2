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
    
    console.log("CartItems before decrease:", cartItems);
  
  
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
  
    console.log("Updated Items after decrease:", updatedItems);
  
   
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
      timestamp: new Date().toISOString(),
    };

    const orderRef = doc(db, "Pedidos", user.uid + "_" + new Date().toISOString());

    try {
      await setDoc(orderRef, order);
      updateCart([]);
      Swal.fire({
        title: "¡Pedido Confirmado! 🎉",
        text: "¡Gracias por elegirnos, tu pizza está en camino! 🍕🍕\nNos vemos pronto en el galpón más delicioso de la ciudad!",
        icon: "success",
        confirmButtonText: "¡Genial! 🍕",
      }).then(() => {
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

  // Si el carrito está vacío, renderiza CartEmpty
  if (cartItems.length === 0) {
    return <CartEmpty />;
  }

  return (
    <div className="cartContainer">
      <div className="cartForm">
        <CartSummary
          cartItems={cartItems}
          total={total}
          increaseQuantity={increaseQuantity}
          decreaseQuantity={decreaseQuantity}
        />
        <DeliveryForm
          deliveryOption={deliveryOption}
          setDeliveryOption={setDeliveryOption}
          address={address}
          setAddress={setAddress}
          isAddressValid={isAddressValid}
        />
        <PaymentForm
          methodPayment={methodPayment}
          setMethodPayment={setMethodPayment}
        />
        <button onClick={handleSubmit}>Confirmar Pedido</button>
      </div>
    </div>
  );
};

export default CartContent;
