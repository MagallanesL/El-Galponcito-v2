import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, updateDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseconfig';
import { Accordion, Card, DropdownButton, Dropdown } from 'react-bootstrap';
import DashBoardAdmin from '../dashboard/DashboardAdmin';
import './placeorders.css';

const orderCollection = collection(db, 'Pedidos');
const PlaceOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentDate, setCurrentDate] = useState('');

  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    setCurrentDate(`${day}/${month}/${year}`);
  };

  const getOrdersPlace = async () => {
    try {
      const orderCollectionRef = collection(db, "Pedidos");
      const data = await getDocs(orderCollectionRef);
      const ordersData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      console.log("Datos obtenidos de Firestore:", ordersData);
      setOrders(ordersData);

      const filtered = ordersData.filter((order) => {
        const orderTimestamp = order.timestamp;

        if (orderTimestamp) {
          const orderDate = new Date(orderTimestamp);
          if (isNaN(orderDate)) {
            console.error(`Timestamp inválido para el pedido ${order.id}`);
            return false;
          }
          const orderHour = orderDate.getHours();
          const orderDay = orderDate.toLocaleDateString();

          const isInBusinessHours = (orderHour >= 13 && orderHour <= 23) || orderHour < 2;
          const isToday = orderDay === new Date().toLocaleDateString();

          return isToday && isInBusinessHours;
        }

        return false;
      });

      const ordersWithNumber = filtered.map((order, index) => ({
        ...order,
        orderNumber: index + 1,
      }));

      const sortedOrders = ordersWithNumber.sort((a, b) => {
        const orderPriority = { 'Pendiente': 0, 'Cocinando': 1, 'Enviado': 2 };
        return orderPriority[a.status] - orderPriority[b.status];
      });

      setFilteredOrders(sortedOrders);

    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
    }
  };

  useEffect(() => {
    getCurrentDate();
    getOrdersPlace();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderDocRef = doc(db, 'Pedidos', orderId);
      await updateDoc(orderDocRef, { status: newStatus });
      console.log(`Estado del pedido ${orderId} actualizado a: ${newStatus}`);
    } catch (error) {
      console.error("Error al actualizar el estado del pedido:", error);
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setFilteredOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    updateOrderStatus(orderId, newStatus);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pendiente':
        return 'btn-warning';
      case 'Cocinando':
        return 'btn-info';
      case 'Enviado':
        return 'btn-success';
      default:
        return 'btn-secondary';
    }
  };

  return (
    <div className="container mt-4">
      <DashBoardAdmin />
      <h3>Pedidos {currentDate}</h3>
      <Accordion defaultActiveKey="0">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, index) => (
            <Card key={order.id}>
              <Accordion.Item eventKey={String(index)}>
                <Accordion.Header>
                  {/* Aquí utilizamos directamente el Dropdown y evitamos el botón extra */}
                  <Dropdown>
                    <Dropdown.Toggle variant="secondary" id={`dropdown-status-${order.id}`} className={`mr-2 ${getStatusClass(order.status)}`}>
                      {order.status || 'Pendiente'}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item eventKey="Pendiente" onClick={() => handleStatusChange(order.id, 'Pendiente')}>
                        Pendiente
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="Cocinando" onClick={() => handleStatusChange(order.id, 'Cocinando')}>
                        Cocinando
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="Enviado" onClick={() => handleStatusChange(order.id, 'Enviado')}>
                        Enviado
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  {order.orderNumber} # Pedido de - <strong>{order.userName}</strong> - Total: ${order.totalAmount}
                </Accordion.Header>
                <Accordion.Body>
                  <p><strong>Teléfono:</strong> {order.userPhone}</p>
                  <p><strong>Dirección:</strong> {order.address ? order.address : 'Retira en local'}</p>

                  <h5>Productos:</h5>
                  <ul>
                    {order.items?.map((item, idx) => (
                      <li key={idx}>
                        {item.name} - {item.quantity} unidad{item.quantity > 1 ? 'es' : ''}
                      </li>
                    ))}
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            </Card>
          ))
        ) : (
          <p>No hay pedidos para mostrar en este momento.</p>
        )}
      </Accordion>
    </div>
  );
};

export default PlaceOrders;
