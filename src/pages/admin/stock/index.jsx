import React, { useState, useEffect } from 'react'
import { getDocs, collection, query, orderBy, limit } from 'firebase/firestore'
import DashBoardAdmin from '../dashboard/DashboardAdmin'
import { db } from '../../../firebase/firebaseconfig'

import './Stock.css' 

const Stock = () => {
  const [stock, setStock] = useState(null)

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const stockQuery = query(
          collection(db, 'Stock'),
          orderBy('createdAt', 'desc'),
          limit(1)
        )

        const data = await getDocs(stockQuery)
        const stockData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

        if (stockData.length > 0) {
          setStock(stockData[0])
        } else {
          setStock(null)
        }
      } catch (error) {
        console.error('Error al obtener el stock:', error)
      }
    }

    fetchStock()
  }, [])

  return (
    <div>
          <DashBoardAdmin/>
    <div className="stock-container">
      <h2 className="stock-title">Último Stock Registrado</h2>
      {stock ? (
        <div className="stock-details">
          <p className="stock-date">Fecha: <span>{stock.date}</span></p>
          <p className="stock-quantity">Cantidad: <span>{stock.quantity}</span></p>
        </div>
      ) : (
        <p className="no-stock">No se encontró stock.</p>
      )}
    </div>
      </div>
  )
}

export default Stock
