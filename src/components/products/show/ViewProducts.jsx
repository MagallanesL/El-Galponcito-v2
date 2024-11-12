import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseconfig';
import { CartContext } from '../../../context/dataContext';

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);

  const productsCollection = collection(db, 'productos');

  const getProducts = async () => {
    const data = await getDocs(productsCollection);
    setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div>
      <h2>Lista de Productos</h2>
      <div>
        {products.map((product) => (
          <div key={product.id}>
            <img src={product.imageURL} alt={product.name} />
            <div>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>${product.price}</p>
              <button onClick={() => addToCart(product)}>
                Agregar al carrito
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewProducts;
