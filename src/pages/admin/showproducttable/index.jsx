import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseconfig';
import Swal from 'sweetalert2';
import { SlLike, SlDislike } from "react-icons/sl";
import { MdDeleteForever, MdEditRoad } from "react-icons/md";
import './index.css';

const Productmesa = () => {
  const [products, setProducts] = useState([]);
  const [editProductId, setEditProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const productsCollection = collection(db, 'productosmesa');

  const getProducts = async () => {
    const data = await getDocs(productsCollection);
    setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleEditClick = (product) => {
    setEditProductId(product.id);
    setEditedProduct({ ...product });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct({ ...editedProduct, [name]: value });
  };

  const handleSave = async (id) => {
    const productDoc = doc(db, 'productosmesa', id);
    await updateDoc(productDoc, editedProduct);
    setProducts(products.map((product) => 
      product.id === id ? { ...editedProduct, id } : product
    ));
    setEditProductId(null);
  };

  const handleDelete = (product) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Estás a punto de eliminar el producto: ${product.name}. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const productDoc = doc(db, 'productosmesa', product.id);
        deleteDoc(productDoc).then(() => {
          setProducts(products.filter((p) => p.id !== product.id));
          Swal.fire(
            'Eliminado!',
            `El producto ${product.name} ha sido eliminado.`,
            'success'
          );
        });
      }
    });
  };

  const handleDisable = async (product) => {
    const productDoc = doc(db, 'productosmesa', product.id);
    const updatedProduct = { ...product, disabled: !product.disabled };

    await updateDoc(productDoc, updatedProduct);

    setProducts(products.map((prod) => 
      prod.id === product.id ? updatedProduct : prod
    ));
  };

  const filteredProducts = products.filter((product) => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="productsContainer">
      <h2 className="productsTitle">Lista de Productos</h2>

      <div className="searchBar">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Ingredientes</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td>
                {editProductId === product.id ? (
                  <input
                    type="text"
                    name="name"
                    value={editedProduct.name || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  product.name
                )}
              </td>
              <td>
                {editProductId === product.id ? (
                  <input
                    type="text"
                    name="description"
                    value={editedProduct.description || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  product.description
                )}
              </td>
              <td>
                {editProductId === product.id ? (
                  <input
                    type="text"
                    name="category"
                    value={editedProduct.category || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  product.category
                )}
              </td>
              <td>
                {editProductId === product.id ? (
                  <input
                    type="number"
                    name="price"
                    value={editedProduct.price || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  `$${product.price}`
                )}
              </td>
              <td className="actionsColumn">
                {editProductId === product.id ? (
                  <>
                    <button className="saveButton" onClick={() => handleSave(product.id)}>
                      Guardar
                    </button>
                    <button className="cancelButton" onClick={() => setEditProductId(null)}>
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button className="editButton" onClick={() => handleEditClick(product)}>
                      <MdEditRoad />
                    </button>
                    <button className="deleteButton" onClick={() => handleDelete(product)}>
                      <MdDeleteForever />
                    </button>
                    <button 
                      className={`disableButton ${product.disabled ? 'disabled' : ''}`} 
                      onClick={() => handleDisable(product)}
                    >
                      {product.disabled ? <SlDislike /> : <SlLike />}
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Productmesa;
