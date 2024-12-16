import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseconfig';
import { Accordion } from 'react-bootstrap';
import DashBoardAdmin from '../dashboard/DashboardAdmin';
import OrderCard from './orderCard/orderCard';
import './placeorders.css';

const orderCollection = collection(db, 'Pedidos');
const stockCollection = collection(db, 'Stock'); // Colección de stock

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

          const isInBusinessHours = (orderHour >= 09 && orderHour < 24) || (orderHour < 2);
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

      if (newStatus === 'Enviado') {
        await updateStockOnOrder(orderId); 
        printOrder(orderId); 
      }
    } catch (error) {
      console.error("Error al actualizar el estado del pedido:", error);
    }
  };

  const updateStockOnOrder = async (orderId) => {
    try {
      const orderDocRef = doc(db, 'Pedidos', orderId);
      const orderSnapshot = await getDoc(orderDocRef);
      const order = orderSnapshot.data();

      if (order && order.items) {
        for (const item of order.items) {
          const itemId = item.id; 
          const itemQuantity = item.quantity;

          const stockDocRef = doc(db, 'Stock', itemId);
          const stockSnapshot = await getDoc(stockDocRef);  
          const stockData = stockSnapshot.data();

          if (stockData) {
            const updatedQuantity = stockData.quantity - itemQuantity;

            // Verifica si hay suficiente stock
            if (updatedQuantity < 0) {
              console.error(`No hay suficiente stock para el producto ${itemId}`);
              return;
            }

            // Actualizar el stock
            await updateDoc(stockDocRef, { quantity: updatedQuantity });
            console.log(`Stock actualizado para el producto ${itemId}: nueva cantidad ${updatedQuantity}`);
          }
        }
      }
    } catch (error) {
      console.error("Error al actualizar el stock:", error);
    }
  };

  const printOrder = async (orderId) => {
    try {
      const orderDocRef = doc(db, 'Pedidos', orderId);
      const orderSnapshot = await getDoc(orderDocRef);
      const order = orderSnapshot.data();
  
      if (order) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
          <html>
            <head>
              <title>El Galponcito</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  font-size: 12px;
                  width: 47mm;
                  margin: 0;
                  padding: 0;
                  white-space: pre-wrap; /* Permite saltos de línea */
                }
                .order-header {
                  text-align: center;
                  margin-bottom: 10px;
                }
                .centered {
                  text-align: center;
                }
                .order-details, .order-items, .order-total, .order-delivery {
                  margin-bottom: 10px;
                }
                .order-items p {
                  margin: 0; /* Elimina márgenes innecesarios */
                }
              </style>
            </head>
            <body>
              <div class="order-header">
                <h3>El Galponcito</h3>
              </div>
              <div class="order-details">
                <p><strong>Cliente:</strong> ${order.userName}</p>
                <p><strong>Teléfono:</strong> ${order.userPhone}</p>
                <p><strong>Dirección:</strong> ${order.address ? order.address.split(',')[0] : 'Retira en local'}</p>
              </div>
              <div class="order-items">
                <h3 class="centered">Productos:</h3>
                ${order.items.map((item) => `
                  ${item.category === "1/2 y 1/2" 
                    ? `${item.half1.name} y ${item.half2.name}` 
                    : item.name} 
                  x${item.quantity} - $${item.totalPrice || item.price}\n
                `).join('')}
              </div>
              <div class="order-delivery">
                <p><strong>Costo de Envío:</strong> $${order.deliveryCost || '0'}</p>
              </div>
              <div class="order-total">
                <p><strong>Total:</strong> $${order.totalAmount}</p>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    } catch (error) {
      console.error("Error al imprimir el pedido:", error);
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
          filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              handleStatusChange={handleStatusChange}
              getStatusClass={getStatusClass}
            />
          ))
        ) : (
          <p>No hay pedidos para mostrar en este momento.</p>
        )}
      </Accordion>
    </div>
  );
};

export default PlaceOrders;
