// pages/ShowProductAdmin.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseconfig';
import ProductCategory from './ProductCategory/ProductCategory';
import SearchBar from './SearchBar/SearchBar';
import styles from './ShowProductAdmin.module.css';

const ShowProductAdmin = () => {
  const [products, setProducts] = useState([]);
  const [editProductId, setEditProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const productsCollection = collection(db, 'productos');

  const getProducts = async () => {
    const data = await getDocs(productsCollection);
    setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleEditClick = (product) => {
    setEditProductId(product.id);
    setEditedProduct(product);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct({ ...editedProduct, [name]: value });
  };

  const handleSave = async (id) => {
    const productDoc = doc(db, 'productos', id);
    await updateDoc(productDoc, editedProduct);
    setProducts(products.map((product) => 
      product.id === id ? { ...editedProduct, id } : product
    ));
    setEditProductId(null);
  };

  const handleDelete = async (id) => {
    const productDoc = doc(db, 'productos', id);
    await deleteDoc(productDoc);
    setProducts(products.filter((product) => product.id !== id));
  };

  // Filtrar productos según la categoría y el término de búsqueda
  const filteredProducts = products.filter((product) => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const pizzas = filteredProducts.filter(product => product.category === 'pizza');
  const sandwiches = filteredProducts.filter(product => product.category === 'sandwich');

  return (
    <div className={styles.productsContainer}>
      <h2 className={styles.productsTitle}>Lista de Productos</h2>

      {/* Barra de búsqueda */}
      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {/* Categorías de productos */}
      <ProductCategory
        title="Pizzas"
        products={pizzas}
        editProductId={editProductId}
        editedProduct={editedProduct}
        onEditClick={handleEditClick}
        onDeleteClick={handleDelete}
        onInputChange={handleInputChange}
        onSaveClick={handleSave}
        onCancelClick={() => setEditProductId(null)}
      />

      <ProductCategory
        title="Sandwich"
        products={sandwiches}
        editProductId={editProductId}
        editedProduct={editedProduct}
        onEditClick={handleEditClick}
        onDeleteClick={handleDelete}
        onInputChange={handleInputChange}
        onSaveClick={handleSave}
        onCancelClick={() => setEditProductId(null)}
      />
    </div>
  );
};

export default ShowProductAdmin;
