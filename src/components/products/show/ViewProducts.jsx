import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseconfig';
import { CartContext } from '../../../context/dataContext';  // Asegúrate de que sea el contexto correcto
import './ViewProducts.css';
import Swal from 'sweetalert2';

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { cartItems, addToCart } = useContext(CartContext);  // Usamos el contexto para agregar productos al carrito

  const productsCollection = collection(db, 'productos');

  const getProducts = async () => {
    const data = await getDocs(productsCollection);
    setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    getProducts();
  }, []);

  // Filtrar productos
  const filteredProducts = products.filter((product) => {
    const matchesCategory = category === 'all' || product.category === category;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Agregar al carrito
  const handleAddToCart = (product) => {
    addToCart(product);

    Swal.fire({
      title: 'Producto agregado',
      text: `${product.name} ha sido agregado al carrito.`,
      icon: 'success',
      confirmButtonText: 'Continuar'
    });
  };

  return (
    <div className="productsPage">
      <h2>Lista de Productos</h2>
      <div className="searchContainer">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="searchInput"
        />
      </div>
      <div className="categoryMenu">
        <button onClick={() => setCategory('all')}>Todos</button>
        <button onClick={() => setCategory('pizza')}>Pizzas</button>
        <button onClick={() => setCategory('sandwich')}>Sandwiches</button>
        <button onClick={() => setCategory('1/2 y 1/2')}>Media y Media</button>
      </div>
      <div className="productsGrid">
        {filteredProducts.map((product) => (
          <div className="productCard" key={product.id}>
            <div className="productDetails">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className="productPrice">${product.price}</p>
              <div className="productButtons">
                <button onClick={() => handleAddToCart(product)} className="addToCartButton">
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewProducts;
