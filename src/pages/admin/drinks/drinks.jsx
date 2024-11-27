import React, { useState, useEffect } from "react";
import DashboardAdmin from "../dashboard/DashboardAdmin";
import { db } from "../../../firebase/firebaseconfig";
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";
import { Table, Button, Form } from "react-bootstrap";

const Drinks = () => {
  const [drinks, setDrinks] = useState([]);
  const [newDrink, setNewDrink] = useState({ name: "", cost: "", category: "" });

  const drinksCollection = collection(db, "drinks");

  // Cargar productos al iniciar
  useEffect(() => {
    fetchDrinks();
  }, []);

  // Obtener productos de Firestore
  const fetchDrinks = async () => {
    const data = await getDocs(drinksCollection);
    setDrinks(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  // Agregar un nuevo producto
  const addDrink = async () => {
    if (!newDrink.name || !newDrink.cost || !newDrink.category) {
      alert("Por favor, llena todos los campos.");
      return;
    }
    const costNumber = parseFloat(newDrink.cost);
    if (isNaN(costNumber)) {
      alert("El costo debe ser un número.");
      return;
    }
    await addDoc(drinksCollection, {
      name: newDrink.name,
      cost: costNumber,
      category: newDrink.category,
      isActive: true,
    });
    setNewDrink({ name: "", cost: "", category: "" }); // Reiniciar el formulario
    fetchDrinks(); // Actualizar la lista
  };

  // Habilitar/Deshabilitar producto
  const toggleActiveStatus = async (id, isActive) => {
    const drinkDoc = doc(db, "drinks", id);
    await updateDoc(drinkDoc, { isActive: !isActive });
    fetchDrinks(); // Actualizar la lista
  };

  // Editar producto
  const updateDrink = async (id, field, value) => {
    const drinkDoc = doc(db, "drinks", id);
    await updateDoc(drinkDoc, { [field]: value });
    fetchDrinks(); // Actualizar la lista
  };

  return (
    <div>
      <DashboardAdmin />
      <div className="container mt-4">
        <h3>Agregar Bebida</h3>
        <div className="d-flex gap-3 mb-3">
          <Form.Control
            type="text"
            placeholder="Nombre"
            value={newDrink.name}
            onChange={(e) => setNewDrink({ ...newDrink, name: e.target.value })}
          />
          <Form.Control
            type="text"
            placeholder="Costo"
            value={newDrink.cost}
            onChange={(e) => setNewDrink({ ...newDrink, cost: e.target.value })}
          />
          <Form.Select
            value={newDrink.category}
            onChange={(e) => setNewDrink({ ...newDrink, category: e.target.value })}
          >
            <option value="">Selecciona una categoría</option>
            <option value="Cerveza">Cerveza</option>
            <option value="Vino">Vino</option>
            <option value="Whisky">Whisky</option>
            <option value="Gaseosas">Gaseosas</option>
            <option value="Agua">Agua</option>
          </Form.Select>
          <Button onClick={addDrink}>Agregar</Button>
        </div>

        <h3>Lista de Bebidas</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Costo</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {drinks.map((drink) => (
              <tr key={drink.id}>
                <td>
                  <Form.Control
                    type="text"
                    value={drink.name}
                    onChange={(e) => updateDrink(drink.id, "name", e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    value={drink.cost}
                    onChange={(e) => updateDrink(drink.id, "cost", parseFloat(e.target.value) || 0)}
                  />
                </td>
                <td>
                  <Form.Select
                    value={drink.category}
                    onChange={(e) => updateDrink(drink.id, "category", e.target.value)}
                  >
                    <option value="Cerveza">Cerveza</option>
                    <option value="Vino">Vino</option>
                    <option value="Whisky">Whisky</option>
                    <option value="Gaseosas">Gaseosas</option>
                    <option value="Agua">Agua</option>
                  </Form.Select>
                </td>
                <td>{drink.isActive ? "Habilitado" : "Deshabilitado"}</td>
                <td>
                  <Button
                    variant={drink.isActive ? "danger" : "success"}
                    onClick={() => toggleActiveStatus(drink.id, drink.isActive)}
                  >
                    {drink.isActive ? "Deshabilitar" : "Habilitar"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Drinks;
