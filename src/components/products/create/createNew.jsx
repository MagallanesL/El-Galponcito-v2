import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseconfig";
import './createNew.css';
import DashBoardAdmin from '../../../pages/admin/dashboard/DashboardAdmin'

const CreateNew = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  const productsCollection = collection(db, 'productosmesa');
  const productscolletionApp = collection(db, 'productos')

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validación de campos
    if (!name || !description || !price || !category) {
      alert("Por favor, completa todos los campos antes de enviar.");
      return;
    }
  
    try {
      // Agregar a la colección 'productosmesa'
      await addDoc(productsCollection, {
        name,
        description,
        price: Number(price),
        category
      });
  
      // Agregar a la colección 'productos'
      await addDoc(productscolletionApp, {
        name,
        description,
        price: Number(price),
        category
      });
  
      // Resetear campos
      setName("");
      setDescription("");
      setPrice("");
      setCategory("");
  
      alert("Producto agregado a ambas colecciones correctamente.");
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      alert("Hubo un error al agregar el producto. Intenta nuevamente.");
    }
  };
  
  return (
    <>
      <DashBoardAdmin />
      <div className="createNewComponentWrapper">
        <div className="createNewContainer">
          <h2 className="createNewTitle">¡Cocinar lo nuevo!</h2>
          <form className="createNewForm" onSubmit={handleSubmit}>
            <div className="formGroup">
              <label>Nombre:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="formGroup">
              <label>Ingredientes:</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="formGroup">
              <label>Precio:</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="formGroup">
              <label>Categoría:</label>
              <select
                value={category}
                onChange={(e) => {
                  const selectedValue = e.target.value.trim();
                 
                  setCategory(selectedValue);
                }}
                required
              >
                <option value="">Seleccionar categoría</option>
                <option value="pizza">Pizza</option>
                <option value="sandwich">Sándwich</option>
                <option value="1/2 y 1/2">Media y Media</option>
                <option value="bebidas">Bebidas</option>
              </select>

            </div>
            <button type="submit" className="createButton">Crear Producto</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateNew;
