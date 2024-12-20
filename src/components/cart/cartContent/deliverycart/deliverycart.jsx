import React, { useState, useEffect } from "react";
import { FaMotorcycle, FaHome } from "react-icons/fa";
import * as turf from "@turf/turf";
import { db } from "../../../../firebase/firebaseconfig";
import { collection, getDocs, addDoc } from "firebase/firestore";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { LoadScript } from "@react-google-maps/api";
import './css/deliveryForm.css'; // Asegúrate de importar el archivo CSS

const DeliveryForm = ({
  deliveryOption,
  setDeliveryOption,
  address,
  setAddress,
  isAddressValid,
  setIsAddressValid,
  setDeliveryCost,
  hoursOfDelivery,
  setHoursOfDelivery,
  selectedHour,
  setSelectedHour,
}) => {
  const [zones, setZones] = useState([]);
  const [isHourEditable, setIsHourEditable] = useState(false);
  const [isHourValid, setIsHourValid] = useState(true);

  useEffect(() => {
    const fetchZones = async () => {
      const querySnapshot = await getDocs(collection(db, "deliveryZones"));
      const zonesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setZones(zonesData);
    };

    fetchZones();
  }, []);

  const isPointInPolygon = (point, polygon) => {
    const pointFeature = turf.point([point.lng, point.lat]);
    const polygonFeature = turf.polygon([polygon.coordinates.map((coord) => [coord.lng, coord.lat])]);
    return turf.booleanPointInPolygon(pointFeature, polygonFeature);
  };

  const getDeliveryCost = async (address, zones) => {
    try {
      const results = await geocodeByAddress(address);
      const latLng = await getLatLng(results[0]);
      const coordinates = { lat: latLng.lat, lng: latLng.lng };

      for (const zone of zones) {
        if (isPointInPolygon(coordinates, zone.shape)) {
          return zone.cost;
        }
      }
      throw new Error("Dirección fuera de las zonas de cobertura");
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleAddressChange = async (address) => {
    setAddress(address);
    setIsAddressValid(true);
    if (deliveryOption === "enviar") {
      const cost = await getDeliveryCost(address, zones);
      setIsAddressValid(cost !== null);
    }
  };

  const handleSelect = async (address) => {
    setAddress(address);
    if (deliveryOption === "enviar") {
      const cost = await getDeliveryCost(address, zones);
      setDeliveryCost(cost);
      setIsAddressValid(cost !== null);
    }
  };

  const handleDeliveryOptionChange = (e) => {
    const option = e.target.value;
    setDeliveryOption(option);
    if (option === "retirar") {
      setDeliveryCost(0);
      setIsAddressValid(true);
    }
  };

  const handleHourChange = (e) => {
    const newHour = e.target.value;
    if (newHour < currentTime()) {
      setIsHourValid(false);
    } else {
      setIsHourValid(true);
    }
    setSelectedHour(newHour);
  };

  const currentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const toggleHourEditable = () => {
    setIsHourEditable(!isHourEditable);
    if (!isHourEditable) {
      setSelectedHour("");
    }
  };

  const sendOrderToFirebase = async () => {
    const hourToSend = selectedHour === "Cuando esté listo, envíalo" ? "13:13" : selectedHour;
    if (!hourToSend) {
      console.error("La hora no es válida");
      return;
    }

    if (!isHourValid) {
      console.error("La hora seleccionada no es válida");
      return;
    }

    const orderData = {
      deliveryOption,
      address,
      deliveryCost: deliveryOption === "enviar" ? deliveryCost : 0,
      selectedHour: hourToSend,
      timestamp: new Date(),
    };

    try {
      await addDoc(collection(db, "orders"), orderData);
    } catch (error) {
      console.error("Error al enviar el pedido:", error);
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_API_MAP_KEY}
      libraries={["places"]}
    >
      <div className="deliveryForm">
        <label style={{ fontWeight: "bold", fontSize: "16px" }}>
          ¿Te lo llevamos a tu puerta? <FaMotorcycle style={{ color: "#FF6347" }} />
        </label>
        <select
          name="deliveryOption"
          value={deliveryOption}
          onChange={handleDeliveryOptionChange}
          style={{ padding: "5px", fontSize: "14px" }}
        >
          <option value="retirar">🏠 ¡Retiro en el local! </option>
          <option value="enviar">🚚 ¡Envíamelo a mi casa! </option>
        </select>

        {deliveryOption === "enviar" && (
          <div className="addressInput">
            <label style={{ fontSize: "14px" }}>
              ¿Dónde te lo enviamos? <FaHome style={{ color: "#20B2AA" }} />
            </label>
            <PlacesAutocomplete
              value={address}
              onChange={handleAddressChange}
              onSelect={handleSelect}
              searchOptions={{
                types: ["address"],
                componentRestrictions: { country: "ar" },
                location: new window.google.maps.LatLng(-33.6770, -65.4462),
                radius: 5000,
              }}
            >
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div>
                  <input
                    {...getInputProps({
                      placeholder: "Ingresa tu dirección 🏡",
                      className: "location-search-input",
                    })}
                    style={{
                      padding: "8px",
                      width: "100%",
                      fontSize: "14px",
                      marginTop: "5px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <div className="autocomplete-dropdown-container">
                    {loading && <div>Loading...</div>}
                    {suggestions.map((suggestion, index) => {
                      const className = suggestion.active
                        ? "suggestion-item--active"
                        : "suggestion-item";
                      const style = suggestion.active
                        ? { backgroundColor: "#fafafa", cursor: "pointer" }
                        : { backgroundColor: "#ffffff", cursor: "pointer" };

                      const matchedText = suggestion.description.includes(address)
                        ? suggestion.description
                        : address;

                      return (
                        <div
                          key={index}
                          {...getSuggestionItemProps(suggestion, {
                            className,
                            style,
                          })}
                        >
                          <span>{matchedText}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </PlacesAutocomplete>
            {!isAddressValid && address && (
              <p style={{ color: "red" }}>Dirección fuera de las zonas de cobertura</p>
            )}
          </div>
        )}

        <div className="hourSelection">
          <label style={{ fontSize: "14px" }}>Te enviamos el pedido:</label>
          <div className="hourSelectionContainer">
            <div className="selectedHourText">
              <span style={{ fontWeight: "bold", fontSize: "16px" }}>{selectedHour}</span>
            </div>
            <button onClick={toggleHourEditable} className="hourSelectionButton">
              {isHourEditable ? "Cancelar" : "Elegir horario"}
            </button>
            {isHourEditable && (
              <input
                type="time"
                value={selectedHour}
                onChange={handleHourChange}
                className="hourSelectionInput"
              />
            )}
          </div>
        </div>
      </div>
    </LoadScript>
  );
};

export default DeliveryForm;
