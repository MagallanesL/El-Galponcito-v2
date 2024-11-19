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
import './cartcontent.css';
import * as turf from '@turf/turf';
import zonesData from '../../../pages/admin/Zone/CoverageZone.json';

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

  // Procesamos las zonas geográficas fuera de useEffect para no procesarlas cada vez que se renderiza.
  const geoJSONZones = zonesData.map(zone => {
    const coordinates = zone.polygon
      .replace("POLYGON ((", "")
      .replace("))", "")
      .split(", ")
      .map(coord => {
        const [lng, lat] = coord.split(" ");
        return [parseFloat(lng), parseFloat(lat)];
      });
    return {
      ...zone,
      coordinates,
    };
  });

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

  const geocodeAddress = async (address) => {
    if (address.length < 4) {  // Evitar geocodificación con direcciones muy cortas
      return null;
    }
    const apiKey = import.meta.env.VITE_HERE_API_KEY;
    const geocodeUrl = `https://geocode.search.hereapi.com/v1/geocode?q=${address}&apiKey=${apiKey}`;
  
    try {
      const response = await fetch(geocodeUrl);
      const data = await response.json();
  
      if (data.items && data.items.length > 0) {
        const { lat, lng } = data.items[0].position;
        return { lat, lng };
      } else {
        throw new Error("No se pudo geocodificar la dirección.");
      }
    } catch (error) {
      console.error("Error al geocodificar la dirección:", error);
      return null;
    }
  };
  
  
  // Este effect ahora está encargado de la geocodificación y la validación de la dirección
  useEffect(() => {
    const checkAddressValidity = async () => {
      if (address.length > 3) {  // Validar solo si la dirección tiene más de 3 caracteres
        const coordinates = await geocodeAddress(address);
        if (coordinates) {
          const { lat, lng } = coordinates;
  
          // Aquí calculas la distancia entre la dirección ingresada y las coordenadas de Villa Mercedes
          const distance = turf.distance(
            turf.point([lng, lat]),
            turf.point([-65.4265, -33.6594]) // Coordenadas de Villa Mercedes
          );
  
          if (distance > 10) { // Distancia mayor a 10 km, por ejemplo
            setIsAddressValid(false);
            Swal.fire({
              title: "¡Dirección fuera de zona permitida! 😔",
              text: "La dirección proporcionada está fuera del área de cobertura.",
              icon: "error",
              confirmButtonText: "Entendido",
            });
          } else {
            setIsAddressValid(true);
          }
        } else {
          setIsAddressValid(false);
          Swal.fire({
            title: "¡Error al geocodificar la dirección! 😔",
            text: "No se pudo geocodificar la dirección proporcionada. Intenta con otro formato.",
            icon: "error",
            confirmButtonText: "Entendido",
          });
        }
      }
    };
  
    checkAddressValidity();
  }, [address]);
  
  
  const isAddressInDeliveryZone = (lat, lng) => {
    // Aquí puedes verificar si las coordenadas de la dirección están dentro de la zona de cobertura
    return geoJSONZones.some(zone => {
      const from = turf.point([lng, lat]);
      const polygon = turf.polygon([zone.coordinates]);
      return turf.booleanPointInPolygon(from, polygon);
    });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (deliveryOption === "enviar") {
      const coordinates = await geocodeAddress(address);
      if (coordinates) {
        const { lat, lng } = coordinates;
        const isInZone = isAddressInDeliveryZone(lat, lng);

        if (!isInZone) {
          setIsAddressValid(false);
          Swal.fire({
            title: "¡Dirección fuera de zona de envío! 😔",
            text: "La dirección proporcionada no está dentro de las zonas de envío disponibles.",
            icon: "error",
            confirmButtonText: "Entendido",
          });
          return;
        }
      }
    }

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
