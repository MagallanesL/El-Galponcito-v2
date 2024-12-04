import React, { useState, useEffect } from "react";
import { FaMotorcycle, FaHome } from "react-icons/fa"; // Iconos de moto y casa
import * as turf from '@turf/turf';
import { db } from '../../../../firebase/firebaseconfig';
import { collection, getDocs } from 'firebase/firestore';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { LoadScript } from '@react-google-maps/api';

const DeliveryForm = ({ deliveryOption, setDeliveryOption, address, setAddress, isAddressValid, setIsAddressValid, setDeliveryCost }) => {
  const [zones, setZones] = useState([]);

  useEffect(() => {
    const fetchZones = async () => {
      const querySnapshot = await getDocs(collection(db, 'deliveryZones'));
      const zonesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setZones(zonesData);

    };

    fetchZones();
  }, []);

  const isPointInPolygon = (point, polygon) => {
    const pointFeature = turf.point([point.lng, point.lat]);
    const polygonFeature = turf.polygon([polygon.coordinates.map(coord => [coord.lng, coord.lat])]);
    const isInside = turf.booleanPointInPolygon(pointFeature, polygonFeature);
  
    return isInside;
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
      throw new Error('Dirección fuera de las zonas de cobertura');
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleAddressChange = (address) => {
    setAddress(address);
    setIsAddressValid(true); // Resetear el estado de validación al cambiar la dirección
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
      setDeliveryCost(0); // Resetear el costo de envío si se elige retirar en el local
      setIsAddressValid(true); // Resetear el estado de validación
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_API_MAP_KEY}
      libraries={["places"]}
    >
      <div>
        <label style={{ fontWeight: 'bold', fontSize: '16px' }}>¿Te lo llevamos a tu puerta? <FaMotorcycle style={{ color: '#FF6347' }} /></label>
        <select
          name="deliveryOption"
          value={deliveryOption}
          onChange={handleDeliveryOptionChange}
          style={{ padding: '5px', fontSize: '14px' }}
        >
          <option value="retirar">🏠 ¡Retiro en el local! </option>
          <option value="enviar">🚚 ¡Envíamelo a mi casa! </option>
        </select>

        {deliveryOption === "enviar" && (
          <div style={{ marginTop: '10px' }}>
            <label style={{ fontSize: '14px' }}>¿Dónde te lo enviamos? <FaHome style={{ color: '#20B2AA' }} /></label>
            <PlacesAutocomplete
              value={address}
              onChange={handleAddressChange}
              onSelect={handleSelect}
              searchOptions={{
                componentRestrictions: { country: 'ar' }, // Restringir a Argentina
                location: new window.google.maps.LatLng(-33.6783, -65.4608), // Coordenadas de Villa Mercedes
                radius: 2000, // Radio de búsqueda en metros
              }}
            >
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div>
                  <input
                    {...getInputProps({
                      placeholder: 'Ingresa tu dirección 🏡',
                      className: 'location-search-input',
                    })}
                    style={{
                      padding: '8px',
                      width: '100%',
                      fontSize: '14px',
                      marginTop: '5px',
                      borderRadius: '4px',
                      border: '1px solid #ccc'
                    }}
                  />
                  <div className="autocomplete-dropdown-container">
                    {loading && <div>Loading...</div>}
                    {suggestions.map((suggestion, index) => {
                      const className = suggestion.active
                        ? 'suggestion-item--active'
                        : 'suggestion-item';
                      const style = suggestion.active
                        ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                        : { backgroundColor: '#ffffff', cursor: 'pointer' };

                      return (
                        <div
                          key={index} // Pasar la prop `key` directamente
                          {...getSuggestionItemProps(suggestion, {
                            className,
                            style,
                          })}
                        >
                          <span>{suggestion.description}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </PlacesAutocomplete>
            {!isAddressValid && address && <p style={{ color: 'red' }}>Dirección fuera de las zonas de cobertura</p>}
          </div>
        )}
      </div>
    </LoadScript>
  );
};

export default DeliveryForm;
