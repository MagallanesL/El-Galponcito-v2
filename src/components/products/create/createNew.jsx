import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseconfig";

const CreateNew = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");

  const productsCollection = collection(db, 'productos');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(productsCollection, { 
      name, 
      description, 
      price: Number(price),  
      quantity: Number(quantity),
      category
    });
    
    setName("");
    setDescription("");
    setPrice("");
    setQuantity("");
    setCategory("");
  };

  return (
    <div>
      <h2>Crear Nuevo Producto</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Descripción:</label>
          <input 
            type="text" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Precio:</label>
          <input 
            type="number" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Cantidad:</label>
          <input 
            type="number" 
            value={quantity} 
            onChange={(e) => setQuantity(e.target.value)} 
            required 
          />
        </div>
        <div>
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
        <button type="submit">Crear Producto</button>
      </form>
    </div>
  );
};

export default CreateNew;
