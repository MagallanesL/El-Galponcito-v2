import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseconfig';
import { CartContext } from '../../../context/dataContext';
import './ViewProducts.css';

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { cartItems, addToCart } = useContext(CartContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [total, setTotal] = useState(0);

  const productsCollection = collection(db, 'productos');
  const ordersCollection = collection(db, 'pedidos');

  const getProducts = async () => {
    const data = await getDocs(productsCollection);
    setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    getProducts();
  }, []);

  // Filtrar productos por categoría y término de búsqueda
  const filteredProducts = products.filter((product) => {
    const matchesCategory = category === 'all' || product.category === category;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calcular el total del carrito cuando cartItems cambia
  useEffect(() => {
    const calculateTotal = () => {
      const totalAmount = cartItems.reduce((acc, item) => acc + Number(item.price) * (item.quantity || 1), 0);
      setTotal(totalAmount);
    };
    calculateTotal();
  }, [cartItems]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const items = cartItems.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1, 
    }));

    // Enviar la orden a Firestore
    await addDoc(ordersCollection, {
      name,
      email,
      phone,
      address,
      items,
      total,
      date: new Date(),
    });

    alert('Pedido confirmado');
  };

  return (
    <div className="productsPage">
      <h2>Lista de Productos</h2>

      {/* Buscador */}
      <div className="searchContainer">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="searchInput"
        />
      </div>

      {/* Menú de categorías */}
      <div className="categoryMenu">
        <button onClick={() => setCategory('all')}>Todos</button>
        <button onClick={() => setCategory('pizza')}>Pizzas</button>
        <button onClick={() => setCategory('sandwich')}>Sandwiches</button>
        <button onClick={() => setCategory('pizza')}>Media y Media</button>
      </div>

      {/* Contenedor de productos */}
      <div className="productsGrid">
        {filteredProducts.map((product) => (
          <div className="productCard" key={product.id}>
            <div className="productDetails">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className="productPrice">${product.price}</p>
              <div className="productButtons">
                <button onClick={() => addToCart(product)} className="addToCartButton">
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
