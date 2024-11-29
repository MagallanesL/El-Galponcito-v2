import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseconfig';
import { CartContext } from '../../../context/dataContext';
import './css/viewproducts.css';
import Swal from 'sweetalert2';

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('pizza'); // Establecer la categoría por defecto a "pizza"
  const [searchTerm, setSearchTerm] = useState('');
  const { cartItems, addToCart, addHalfToCart } = useContext(CartContext);

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
    const matchesCategory = product.category === category;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const isEnabled = product.disabled !== true;
    return matchesCategory && matchesSearch && isEnabled;
  });

  // Agregar al carrito
  const handleAddToCart = (product) => {
    if (product.category === '1/2 y 1/2') {
      addHalfToCart(product, product.price);
    } else {
      addToCart(product);
    }

    Swal.fire({
      title: `Elegiste  ${product.name}`,
      text: `Ahora te lo cocinamos!.`,
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
        <button onClick={() => setCategory('pizza')}>Pizzas</button>
        <button onClick={() => setCategory('sandwich')}>Sandwichs</button>
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
                  Lo quiero!
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
