import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseconfig';
import moment from 'moment-timezone';
import Swal from 'sweetalert2';
import './stock.css';
import DashboardAdmin from '../dashboard/DashboardAdmin';

const Stock = () => {
  const [stockData, setStockData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const stockCollectionRef = collection(db, 'Stock');
        const stockSnapshot = await getDocs(stockCollectionRef);

        const stockList = stockSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            quantity: data.quantity,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt), // Convertir a Date correctamente
          };
        });

        const today = moment().startOf('day');

        const stockForToday = stockList.filter(item => {
          const createdAtLocal = moment(item.createdAt).tz('America/Argentina/Buenos_Aires', true);
          return createdAtLocal.isSameOrAfter(today);
        });

        stockForToday.sort((a, b) => b.createdAt - a.createdAt);
        setStockData(stockForToday);
      } catch (error) {
        console.error("Error al obtener el stock:", error);
      }
    };

    const fetchOrders = async () => {
      try {
        const ordersCollectionRef = collection(db, 'Pedidos');
        const q = query(ordersCollectionRef, where('status', '==', 'Enviado'));
        const ordersSnapshot = await getDocs(q);

        const ordersList = ordersSnapshot.docs.map(doc => doc.data());
        setOrdersData(ordersList);
      } catch (error) {
        console.error("Error al obtener los pedidos:", error);
      }
    };

    fetchStock();
    fetchOrders();
  }, []);

  const calculateStock = () => {
    let totalSold = 0;
    const today = moment().startOf('day');

    ordersData.forEach(order => {
      if (order.status === "Enviado") {
        const orderDate = moment(order.timestamp).tz('America/Argentina/Buenos_Aires', true);
        if (orderDate.isSameOrAfter(today)) {
          order.items.forEach(item => {
            totalSold += item.quantity;
          });
        }
      }
    });

    if (stockData.length > 0) {
      const totalStock = stockData.reduce((total, stockItem) => total + stockItem.quantity, 0);
      const remainingStock = totalStock - totalSold;

      // Mostrar alert si el stock restante es menor o igual a 10
      if (remainingStock <= 30) {
        Swal.fire({
          title: 'Atención',
          text: `Quedan ${remainingStock} unidades en stock.`,
          icon: 'warning',
        });
      }

      return remainingStock;
    }

    return 0;
  };

  return (
    <>
      <DashboardAdmin />
      <div className="stock-container">
        <h1 className="stock-title">Stock disponible</h1>
        {stockData.length > 0 ? (
          <div className="stock-details">
            <p><span>Stock del día:</span> {stockData.reduce((total, item) => total + item.quantity, 0)}</p>
            <p><span>Unidades vendidas:</span> {ordersData.reduce((total, order) => {
              if (order.status === "Enviado") {
                const orderDate = moment(order.timestamp).tz('America/Argentina/Buenos_Aires', true);
                const today = moment().startOf('day');
                if (orderDate.isSameOrAfter(today)) {
                  return total + order.items.reduce((subTotal, item) => subTotal + item.quantity, 0);
                }
              }
              return total;
            }, 0)}</p>
            <p><span>Stock restante:</span> {calculateStock()}</p>
          </div>
        ) : (
          <div className="no-stock">No hay stock disponible para hoy.</div>
        )}
      </div>
    </>
  );
};

export default Stock;
