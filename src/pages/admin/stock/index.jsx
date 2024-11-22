import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseconfig';
import './Stock.css';  // Importar el archivo de estilos

const Stock = () => {
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    // Función para obtener los datos de stock desde Firestore
    const fetchStock = async () => {
      try {
        // Obtener stock desde la colección "Stock"
        const stockCollectionRef = collection(db, 'Stock');
        const stockSnapshot = await getDocs(stockCollectionRef);
        
        const stockList = stockSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id, // ID del producto
            quantity: data.quantity, // Cantidad disponible
            createdAt: new Date(data.createdAt), // Convertir la fecha a un objeto Date
          };
        });

        // Ordenar los productos por fecha (de más reciente a más antiguo)
        stockList.sort((a, b) => b.createdAt - a.createdAt);

        setStockData(stockList); // Establecer el estado con los datos de stock
      } catch (error) {
        console.error("Error al obtener el stock:", error);
      }
    };

    // Llamada para obtener los datos de stock
    fetchStock();
  }, []);

  // Función para agrupar el stock por día
  const groupStockByDay = () => {
    const groupedByDay = {};

    stockData.forEach(item => {
      // Obtener la fecha del día sin la hora (para agrupar por fecha)
      const dateKey = item.createdAt.toISOString().slice(0, 10); // Formato YYYY-MM-DD

      // Si aún no existe una entrada para ese día, la creamos
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
    <div className="stock-container">
      <h1 className="stock-title">Stock por Día</h1>
      {Object.keys(groupedStock).length > 0 ? (
        <div className="stock-details">
          {Object.entries(groupedStock).map(([date, quantity]) => (
            <div key={date} className="stock-day">
              <p><strong>{date}</strong>: {quantity} unidades</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-stock">No hay stock disponible.</div>
      )}
    </div>
  );
};

export default Stock;
