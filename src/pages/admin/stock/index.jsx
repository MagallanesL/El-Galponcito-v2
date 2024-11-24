import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseconfig';
import './Stock.css';  // Importar el archivo de estilos
import DashboardAdmin from '../dashboard/DashboardAdmin';

const Stock = () => {
  const [stockData, setStockData] = useState([]);
  const [stockUpdated, setStockUpdated] = useState({}); // Guardar stock actualizado

  useEffect(() => {
    // Función para obtener el stock del día actual
    const fetchStock = async () => {
      try {
        // Obtener stock desde la colección "Stock"
        const stockCollectionRef = collection(db, 'Stock');
        
        // Obtener la fecha actual en formato UTC
        const today = new Date();
        const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
        
        // Formatear la fecha UTC a solo año, mes y día (YYYY-MM-DD)
        const todayISO = todayUTC.toISOString().slice(0, 10); 

        const stockQuery = query(stockCollectionRef, where('createdAt', '>=', todayISO)); // Filtrar por fecha de hoy
        const stockSnapshot = await getDocs(stockQuery);

        const stockList = stockSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id, // ID del producto
            quantity: data.quantity, // Cantidad disponible
            createdAt: data.createdAt ? data.createdAt.toDate() : null, // Convertir `createdAt` si existe
          };
        });

        // Filtrar los datos sin fecha válida
        const validStockList = stockList.filter(item => item.createdAt);

        // Ordenar los productos por fecha (de más reciente a más antiguo)
        validStockList.sort((a, b) => b.createdAt - a.createdAt);

        setStockData(validStockList); // Establecer el estado con los datos de stock
      } catch (error) {
        console.error('Error al obtener el stock:', error);
      }
    };

    // Función para obtener los pedidos enviados del día actual
    const fetchOrders = async () => {
      try {
        // Obtener los pedidos desde la colección "Pedidos"
        const ordersCollectionRef = collection(db, 'Pedidos');
        
        // Obtener la fecha actual en formato UTC
        const today = new Date();
        const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
        
        // Formatear la fecha UTC a solo año, mes y día (YYYY-MM-DD)
        const todayISO = todayUTC.toISOString().slice(0, 10); 
        
        const ordersQuery = query(ordersCollectionRef, where('status', '==', 'Enviado'), where('timestamp', '>=', todayISO)); // Filtrar por estado y fecha
        const ordersSnapshot = await getDocs(ordersQuery);

        const orders = ordersSnapshot.docs.map(doc => doc.data());

        // Restar los productos vendidos de la fecha actual
        const updatedStock = { ...stockUpdated }; // Copiar el stock actual

        orders.forEach(order => {
          order.items.forEach(item => {
            const productId = item.id; // Obtener el ID del producto
            const productQuantity = item.quantity; // Obtener la cantidad de productos

            // Verificar si el producto ya está en el stock del día
            if (updatedStock[productId]) {
              updatedStock[productId] -= productQuantity; // Restar la cantidad vendida
            } else {
              updatedStock[productId] = -productQuantity; // Si no existe, inicializar con la cantidad negativa
            }
          });
        });

        setStockUpdated(updatedStock); // Actualizar el estado con el stock restado
      } catch (error) {
        console.error('Error al obtener los pedidos:', error);
      }
    };

    // Llamar a las funciones para obtener el stock y los pedidos
    fetchStock();
    fetchOrders();
  }, [stockUpdated]);

  // Función para agrupar el stock por día
  const groupStockByDay = () => {
    const groupedByDay = {};

    stockData.forEach(item => {
      if (!item.createdAt) return; // Ignorar elementos sin fecha

      // Obtener la fecha del día sin la hora (para agrupar por fecha)
      const dateKey = item.createdAt.toISOString().slice(0, 10); // Formato YYYY-MM-DD

      if (!groupedByDay[dateKey]) {
        groupedByDay[dateKey] = 0;
      }

      // Sumar la cantidad de productos en ese día
      groupedByDay[dateKey] += item.quantity;
    });

    return groupedByDay;
  };

  const groupedStock = groupStockByDay();

  return (
    <>
      <DashboardAdmin />
      <div className="stock-container">
        <h1 className="stock-title">Stock por Día</h1>
        {Object.keys(groupedStock).length > 0 ? (
          <div className="stock-details">
            {Object.entries(groupedStock).map(([date, quantity]) => (
              <div key={date} className="stock-day">
                <p>
                  <strong>{date}</strong>: {quantity} Masas
                </p>
              </div>
            ))}
            {/* Mostrar el stock actualizado después de restar los pedidos */}
            <div className="stock-updated">
              <h2>Stock actualizado (después de pedidos enviados)</h2>
              {Object.entries(stockUpdated).map(([productId, updatedQuantity]) => (
                <div key={productId}>
                  <p>
                    Producto ID: {productId} | Cantidad restante: {updatedQuantity}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-stock">No hay stock disponible.</div>
        )}
      </div>
    </>
  );
};

export default Stock;
