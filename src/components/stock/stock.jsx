import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { db } from "../../firebase/firebaseconfig";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";

const Stock = () => {
  const [stockChecked, setStockChecked] = useState(false); 

  const stockCollection = collection(db, "Stock");

  // Función para agregar stock en Firebase
  const addStock = async (quantity) => {
    const date = new Date();
    const formattedDate = date.toISOString().split("T")[0]; 

    await addDoc(stockCollection, {
      quantity: quantity,
      createdAt: date.toISOString(), 
      date: formattedDate, // Solo fecha
    });

    Swal.fire("¡Stock registrado!", "Se ha guardado correctamente.", "success");
  };

  // Verificar si ya existe stock creado para el día
  const checkStockExists = async () => {
    const date = new Date().toISOString().split("T")[0]; // Fecha actual en formato YYYY-MM-DD
    const q = query(stockCollection, where("date", "==", date));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty; // Retorna `true` si ya existe un registro
  };

  // Mostrar alerta al iniciar sesión si no se ha creado stock
  useEffect(() => {
    const handleStockCheck = async () => {
      if (stockChecked) return; // Evitar que se ejecute varias veces

      const stockExists = await checkStockExists();

      if (!stockExists) {
        Swal.fire({
          title: "¿Ya creaste el stock?",
          text: "Se debe crear un stock diario para continuar.",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Sí, quiero crearlo",
          cancelButtonText: "No, continuar navegando",
          input: "number",
          inputPlaceholder: "Ingresa la cantidad",
          inputValidator: (value) => {
            if (!value || isNaN(value) || value <= 0) {
              return "Por favor ingresa una cantidad válida.";
            }
          },
        }).then((result) => {
          if (result.isConfirmed) {
            const quantity = parseInt(result.value, 10);
            addStock(quantity);
          }
        });
      }

      setStockChecked(true); // Marcar como revisado después de la verificación
    };

    handleStockCheck();
  }, [stockChecked]); // Solo ejecuta al cargar el componente

  return ;
};

export default Stock;
