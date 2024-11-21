import React, { useEffect, useState } from 'react';
import DashboardAdmin from '../dashboard/DashboardAdmin';
import { db } from '../../../firebase/firebaseconfig';  
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';  
import Swal from 'sweetalert2'; // Importamos Swal para mostrar el mensaje


const CoverageZone = () => {
  const [zones, setZones] = useState([]); // Zonas cargadas de Firebase
  const [editZone, setEditZone] = useState(null); // Zona que se está editando
  const [newName, setNewName] = useState(""); // Nuevo nombre de la zona
  const [newDescription, setNewDescription] = useState(""); // Nueva descripción de la zona
  const [newCost, setNewCost] = useState(""); // Nuevo costo de la zona

  // Cargar las zonas desde Firebase
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'ZonasDelivery'));
        const loadedZones = [];
        querySnapshot.forEach((doc) => {
          loadedZones.push({ ...doc.data(), id: doc.id }); // Guardar también el id del documento
        });

        // Ordenar las zonas alfabéticamente por el nombre
        loadedZones.sort((a, b) => a.name.localeCompare(b.name));

        setZones(loadedZones);
      } catch (e) {
        console.error("Error al cargar las zonas desde Firebase: ", e);
      }
    };

    fetchZones(); 
  }, []);

  // Función para editar la zona en Firebase (nombre, descripción y costo)
  const handleEditZone = async (zoneId) => {
    if (newName !== "" && newDescription !== "" && newCost !== "") {
      try {
        const zoneRef = doc(db, 'ZonasDelivery', zoneId);
        await updateDoc(zoneRef, {
          name: newName,
          description: newDescription,
          cost: parseFloat(newCost)
        });

        // Actualizar el estado local directamente para evitar recargar zonas desde Firebase
        setZones((prevZones) =>
          prevZones.map((zone) =>
            zone.id === zoneId
              ? { ...zone, name: newName, description: newDescription, cost: parseFloat(newCost) }
              : zone
          )
        );

        // Mostrar mensaje de éxito con SweetAlert2
        Swal.fire({
          icon: 'success',
          title: 'Zona Actualizada',
          text: 'La zona se ha actualizado correctamente.',
          confirmButtonText: 'Aceptar'
        });

        setNewName(""); // Limpiar el campo de nombre
        setNewDescription(""); // Limpiar el campo de descripción
        setNewCost(""); // Limpiar el campo de costo
        setEditZone(null); // Desactivar el modo de edición
      } catch (error) {
        console.error("Error al actualizar la zona: ", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al actualizar la zona. Inténtalo nuevamente.',
          confirmButtonText: 'Aceptar'
        });
      }
    }
  };

  return (
    <>
      <DashboardAdmin />
      <div>
        {/* Mostrar la tabla con las zonas */}
        <table className="table">
          <thead>
            <tr>
              <th>Zona</th>
              <th>Descripcion</th>
              <th>Costo</th>
              <th>Accion</th>
            </tr>
          </thead>
          <tbody>
            {zones.length > 0 ? (
              zones.map((zone) => (
                <tr key={zone.id}>
                  <td>
                    {/* Si esta zona es la que estamos editando, mostrar un input */}
                    {editZone === zone.id ? (
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Nuevo Nombre"
                        className="form-control"
                      />
                    ) : (
                      zone.name
                    )}
                  </td>
                  <td>
                    {/* Si esta zona es la que estamos editando, mostrar un input */}
                    {editZone === zone.id ? (
                      <input
                        type="text"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        placeholder="Nueva Descripción"
                        className="form-control"
                      />
                    ) : (
                      zone.description
                    )}
                  </td>
                  <td>
                    {/* Si esta zona es la que estamos editando, mostrar un input */}
                    {editZone === zone.id ? (
                      <input 
                        type="number" 
                        value={newCost} 
                        onChange={(e) => setNewCost(e.target.value)} 
                        placeholder="Nuevo Costo" 
                        className="form-control"
                      />
                    ) : (
                      `$${zone.cost}`
                    )}
                  </td>
                  <td>
                    {/* Mostrar el botón de edición solo si no estamos editando esta zona */}
                    {editZone === zone.id ? (
                      <button 
                        onClick={() => handleEditZone(zone.id)} 
                        className="btn btn-success"
                      >
                        Guardar
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          setNewName(zone.name);
                          setNewDescription(zone.description);
                          setNewCost(zone.cost);
                          setEditZone(zone.id);
                        }} 
                        className="btn btn-primary"
                      >
                        Editar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No hay Zona Definida.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CoverageZone;
