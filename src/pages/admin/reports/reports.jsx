import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import {db} from '../../../firebase/firebaseconfig'; 
import DashboardAdmin from '../dashboard/DashboardAdmin';

const Reports = () => {
  const [orders, setOrders] = useState([]);
  const [salesData, setSalesData] = useState({});
  const [reportType, setReportType] = useState('daily'); // Puede ser 'daily', 'weekly', o 'monthly'

  // Cargar los pedidos desde Firebase
  useEffect(() => {
    const fetchOrders = async () => {
      const pedidosCollection = collection(db, 'Pedidos');
      const pedidoSnapshot = await getDocs(pedidosCollection);
      const pedidosList = pedidoSnapshot.docs.map(doc => doc.data());
      setOrders(pedidosList);
    };

    fetchOrders();
  }, []);

  // Procesar los datos de ventas
  useEffect(() => {
    if (orders.length > 0) {
      processSalesData();
    }
  }, [orders, reportType]);

  const processSalesData = () => {
    const sales = {};
  
    // Iteramos sobre los pedidos
    orders.forEach(order => {
      // Cambiar la condición para considerar tanto "Entregado" como "Enviado"
      if (order.orderStatus === 'Entregado' || order.orderStatus === 'Enviado') { 
        const date = new Date(order.date.seconds * 1000); // Firebase usa un timestamp en segundos
        const formattedDate = getFormattedDate(date);
  
        if (!sales[formattedDate]) {
          sales[formattedDate] = {
            totalPizzas: 0,
            totalSanguchitos: 0,
            products: {}
          };
        }
  
        // Procesamos los items del pedido
        order.items.forEach(item => {
          if (item.name.toLowerCase().includes('pizza')) {
            sales[formattedDate].totalPizzas += item.quantity;
          }
          if (item.name.toLowerCase().includes('sanguchito')) {
            sales[formattedDate].totalSanguchitos += item.quantity;
          }
  
          if (!sales[formattedDate].products[item.name]) {
            sales[formattedDate].products[item.name] = 0;
          }
          sales[formattedDate].products[item.name] += item.quantity;
        });
      }
    });
  
    setSalesData(sales);
  };
  

  // Función para obtener la fecha según el tipo de reporte
  const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if (reportType === 'daily') {
      return `${year}-${month}-${day}`; // Formato: 2024-11-15
    }
    if (reportType === 'weekly') {
      const week = Math.ceil((day + 1) / 7); // Estimación de la semana
      return `${year}-W${week}`; // Formato: 2024-W3
    }
    if (reportType === 'monthly') {
      return `${year}-${month}`; // Formato: 2024-11
    }
  };

  // Cambiar el tipo de reporte (diario, semanal, mensual)
  const handleReportChange = (e) => {
    setReportType(e.target.value);
  };

  return (
    <>
      <DashboardAdmin />
      <div className="container mt-4">
        <h3>Reporte de Ventas</h3>

        {/* Selector de tipo de reporte */}
        <select onChange={handleReportChange} value={reportType}>
          <option value="daily">Diario</option>
          <option value="weekly">Semanal</option>
          <option value="monthly">Mensual</option>
        </select>

        {Object.keys(salesData).length > 0 ? (
          <div>
            {Object.keys(salesData).map((date) => (
              <div key={date}>
                <h4>Fecha: {date}</h4>
                <p><strong>Total Pizzas Vendidas:</strong> {salesData[date].totalPizzas}</p>
                <p><strong>Total Sanguchitos Vendidos:</strong> {salesData[date].totalSanguchitos}</p>

                <h5>Productos más vendidos:</h5>
                <ul>
                  {Object.keys(salesData[date].products)
                    .sort((a, b) => salesData[date].products[b] - salesData[date].products[a])
                    .map((productName) => (
                      <li key={productName}>
                        {productName}: {salesData[date].products[productName]} unidades
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay datos de ventas disponibles.</p>
        )}
      </div>
    </>
  );
};

export default Reports;
