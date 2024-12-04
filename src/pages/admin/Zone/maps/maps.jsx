import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, FeatureGroup, Marker, Popup, Polygon } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { db } from '../../../../firebase/firebaseconfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const Maps = () => {
  const position = [-33.6783, -65.4608]; // Coordenadas de Villa Mercedes, San Luis, Argentina
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

  const _onCreated = async (e) => {
    const layer = e.layer;
    const shape = layer.toGeoJSON();

    const centroid = calculateCentroid(shape.geometry.coordinates[0]);

    const flattenedCoordinates = shape.geometry.coordinates[0].map(coord => ({
      lat: coord[1],
      lng: coord[0],
    }));

    const zoneName = `Zona ${zones.length + 1}`;

    // Guardar la zona en Firebase
    try {
      const docRef = await addDoc(collection(db, 'deliveryZones'), {
        name: zoneName,
        shape: {
          type: shape.type,
          coordinates: flattenedCoordinates,
        },
        centroid,
        cost: 0,
      });

      // Agregar la zona y su centroide al estado
      setZones((prevZones) => [
        ...prevZones,
        { id: docRef.id, name: zoneName, shape: { type: shape.type, coordinates: flattenedCoordinates }, centroid, cost: 0 },
      ]);

    
    } catch (error) {
      console.error('Error al guardar la zona en Firebase:', error);
    }
  };

  const calculateCentroid = (coordinates) => {
    const x = coordinates.reduce((sum, coord) => sum + coord[0], 0) / coordinates.length;
    const y = coordinates.reduce((sum, coord) => sum + coord[1], 0) / coordinates.length;
    return [y, x]; // Leaflet usa [lat, lng]
  };

  return (
    <MapContainer center={position} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={_onCreated}
          draw={{
            rectangle: false,
            polyline: false,
            circle: false,
            circlemarker: false,
            marker: false,
          }}
        />
        {zones.map((zone) => (
          <React.Fragment key={zone.id}>
            {zone.shape && zone.shape.coordinates && (
              <Polygon positions={zone.shape.coordinates.map(coord => [coord.lat, coord.lng])} />
            )}
            <Marker position={zone.centroid}>
              <Popup>
                {zone.name}
              </Popup>
            </Marker>
          </React.Fragment>
        ))}
      </FeatureGroup>
    </MapContainer>
  );
};

export default Maps;
