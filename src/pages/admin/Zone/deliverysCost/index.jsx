import React, { useEffect, useState } from 'react';
import { db } from '../../../../firebase/firebaseconfig';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import AdminDashboard from '../../dashboard/DashboardAdmin';
import { MdDeleteForever, MdEditRoad } from "react-icons/md";
import './delivery.css'; 

const DeliveryCost = () => {
  const [zones, setZones] = useState([]);
  const [editingZoneId, setEditingZoneId] = useState(null);
  const [editingCost, setEditingCost] = useState('');
  const [editingName, setEditingName] = useState('');

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

  const handleEdit = (id, name, cost) => {
    setEditingZoneId(id);
    setEditingName(name);
    setEditingCost(cost);
  };

  const handleSave = async (id) => {
    const zoneRef = doc(db, 'deliveryZones', id);
    try {
      await updateDoc(zoneRef, { name: editingName, cost: parseFloat(editingCost) });
      setZones(zones.map(zone => (zone.id === id ? { ...zone, name: editingName, cost: parseFloat(editingCost) } : zone)));
      setEditingZoneId(null);
      setEditingName('');
      setEditingCost('');
    } catch (error) {
      console.error('Error al actualizar la zona:', error);
    }
  };

  const handleDelete = async (id) => {
    const zoneRef = doc(db, 'deliveryZones', id);
    try {
      await deleteDoc(zoneRef);
      setZones(zones.filter(zone => zone.id !== id));
    } catch (error) {
      console.error('Error al eliminar la zona:', error);
    }
  };

  return (
    <div>
      <AdminDashboard />
      
      <table className="deliveryTable">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Costo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {zones.map(zone => (
            <tr key={zone.id}>
              <td>
                {editingZoneId === zone.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="deliveryInput"
                  />
                ) : (
                  zone.name
                )}
              </td>
              <td>
                {editingZoneId === zone.id ? (
                  <input
                    type="number"
                    value={editingCost}
                    onChange={(e) => setEditingCost(e.target.value)}
                    className="deliveryInput"
                  />
                ) : (
                  zone.cost
                )}
              </td>
              <td>
                {editingZoneId === zone.id ? (
                  <button onClick={() => handleSave(zone.id)} className="deliveryBtnSave">Guardar</button>
                ) : (
                  <button onClick={() => handleEdit(zone.id, zone.name, zone.cost)} className="deliveryBtnEdit"><MdEditRoad/></button>
                )}
                <button onClick={() => handleDelete(zone.id)} className="deliveryBtnDelete">< MdDeleteForever/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryCost;
