import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const Maps = ({ pois }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyC3XXouXHdG915GRpcHKaAmWclocRjSct4",
    libraries: ["drawing"], // Asegúrate de incluir la biblioteca de dibujo
  });

  const [rectangles, setRectangles] = useState([]);
  const mapRef = useRef(null);
  const drawingManagerRef = useRef(null);

  useEffect(() => {
    if (isLoaded && mapRef.current) {
      const map = mapRef.current;
      const drawingManager = new window.google.maps.drawing.DrawingManager({
        drawingMode: window.google.maps.drawing.OverlayType.RECTANGLE,
        drawingControl: true,
        drawingControlOptions: {
          position: window.google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [window.google.maps.drawing.OverlayType.RECTANGLE],
        },
        rectangleOptions: {
          strokeColor: '#0c4cb3',
          strokeOpacity: 1,
          strokeWeight: 3,
          fillColor: '#3b82f6',
          fillOpacity: 0.3,
        },
      });

      drawingManager.setMap(map);
      drawingManagerRef.current = drawingManager;

      window.google.maps.event.addListener(drawingManager, 'rectanglecomplete', (rectangle) => {
        setRectangles((current) => [...current, rectangle]);
      });
    }
  }, [isLoaded]);

  if (!isLoaded) return <div>Loading...</div>;

  const handleMapLoad = (map) => {
    // Se ejecuta cuando el mapa se carga completamente
    console.log('Centro del mapa:', map.getCenter().toJSON());
    mapRef.current = map;
  };

  const handleMapClick = (e) => {
    // Captura las coordenadas al hacer clic en el mapa
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    console.log(`Coordenadas clickeadas: Latitud ${lat}, Longitud ${lng}`);
  };

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100vw', height: '100vh' }}
      center={{ lat: -33.6744, lng: -65.4578 }}
      zoom={13}
      onLoad={handleMapLoad}
      onClick={handleMapClick}
    >
      {rectangles.map((rectangle, index) => (
        <div key={index}>
          <Rectangle
            bounds={rectangle.getBounds().toJSON()}
            options={{
              strokeColor: '#0c4cb3',
              strokeOpacity: 1,
              strokeWeight: 3,
              fillColor: '#3b82f6',
              fillOpacity: 0.3,
            }}
          />
        </div>
      ))}
      {pois && pois.map((poi) => (
        <Marker key={poi.key} position={poi.location} />
      ))}
    </GoogleMap>
  );
};

export default Maps;
