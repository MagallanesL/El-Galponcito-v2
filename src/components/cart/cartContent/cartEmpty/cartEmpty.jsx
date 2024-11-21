import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../firebase/firebaseconfig';
import './cartempty.css'; 
import { Link } from 'react-router-dom';

const CartEmpty = () => {
  const [productoRecomendado, setProductoRecomendado] = useState(null);

  useEffect(() => {
    const obtenerProductoAleatorio = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'productos'));
        const productos = querySnapshot.docs.map(doc => doc.data());

        const productoAleatorio = productos[Math.floor(Math.random() * productos.length)];
        setProductoRecomendado(productoAleatorio);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };

    obtenerProductoAleatorio();
  }, []);

  if (!productoRecomendado) {
    return <p>Cargando recomendación...</p>;
  }

  return (
    <div className="cartEmptyContainer">
      <div className="cartEmptyContent">
        <p>¡Aún no sabes qué comer? 😋</p>
        <p>
          Te recomiendo la <strong>{productoRecomendado.name}</strong>, ¡está ESPECTACULAR! 🍕
        </p>
        <Link to={'/clients'} className="cartEmptyButton">¡Voy a Elegir ya! 😋</Link>
      </div>
    </div>
  );
};

export default CartEmpty;
