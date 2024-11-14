import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseconfig';
import { Accordion, Card, Button } from 'react-bootstrap';
import DashBoardAdmin from '../dashboard/DashboardAdmin';

const orderCollection = collection(db, 'pedidos');

const PlaceOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentDate, setCurrentDate] = useState('');

  // Obtener la fecha actual en formato 'dd/mm/yyyy'
  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    setCurrentDate(`${day}/${month}/${year}`);
  };

  // Obtener los pedidos
  const getOrdersPlace = async () => {
    const data = await getDocs(orderCollection);
    const ordersData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setOrders(ordersData);

    // Filtrar pedidos por fecha y horario
    const filtered = ordersData.filter((order) => {
      const orderTimestamp = order.date;

      // Comprobar si el campo 'date' existe y tiene un 'seconds' (timestamp de Firestore)
      if (orderTimestamp && orderTimestamp.seconds) {
        const orderDate = new Date(orderTimestamp.seconds * 1000); // Convertir timestamp a fecha
        const orderHour = orderDate.getHours();
        const orderDay = orderDate.toLocaleDateString(); // Obtener solo la fecha (sin hora)

        // El negocio abre de 6 p.m. a 2 a.m. (de la noche, lo cual incluye el cambio de fecha)
        const isInBusinessHours = (orderHour >= 18 || orderHour < 2); // 18 es 6 p.m., 2 es 2 a.m.

        // Solo mostrar los pedidos del día y dentro del horario de apertura
        const isToday = orderDay === new Date().toLocaleDateString(); // Verificar si el pedido es del día de hoy

        return isToday && isInBusinessHours;
      }

      // Si no hay timestamp, no filtramos por fecha y horario
      return false;
    });

    setFilteredOrders(filtered);
  };

  useEffect(() => {
    getCurrentDate(); // Obtener la fecha actual
    getOrdersPlace(); // Obtener y filtrar los pedidos
  }, []);

  return (
    <div className="container mt-4">
      <DashBoardAdmin/>
      <h3>Pedidos {currentDate}</h3> 
      <Accordion defaultActiveKey="0">
    {filteredOrders.map((order, index) => (
      <Card key={order.id}>
        <Accordion.Item eventKey={String(index)}>
          <Accordion.Header> 
            Pedido de {order.name} - Total: ${order.total}
          </Accordion.Header>
          <Accordion.Body> 
            <p><strong>Teléfono:</strong> {order.phone}</p>
            <p><strong>Dirección:</strong> {order.address}</p>
            <h5>Items:</h5>
            <ul>
              {order.items?.map((item, idx) => (
                <li key={item.id}>
                  {item.name} - {item.quantity} unidad{item.quantity > 1 ? 'es' : ''}
                </li>
              ))}
            </ul>
          </Accordion.Body>
        </Accordion.Item>
      </Card>
    ))}
  </Accordion>
    </div>
  );
};

export default PlaceOrders;
