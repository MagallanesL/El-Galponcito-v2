import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseconfig";
import './CreateNew.css';
import DashBoardAdmin from '../../../pages/admin/dashboard/DashboardAdmin'

const CreateNew = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");

  const productsCollection = collection(db, 'productos');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación de campos
    if (!name || !description || !price || !quantity || !category) {
      alert("Por favor, completa todos los campos antes de enviar.");
      return;
    }

    // Agregar a Firestore si todos los campos están completos
    await addDoc(productsCollection, { 
      name, 
      description, 
      price: Number(price),  
      quantity: Number(quantity),
      category
    });

    // Resetear campos
    setName("");
    setDescription("");
    setPrice("");
    setQuantity("");
    setCategory("");
  };

  return (
     <>
     <DashBoardAdmin/>
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
              onChange={(e) => setCategory(e.target.value)} 
              required
              >
              <option value="">Seleccionar categoría</option>
              <option value="pizza">Pizza</option>
              <option value="sandwich">Sándwich</option>
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
