import React, { useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../../../firebase/firebaseconfig';
import Swal from 'sweetalert2';

const AddStock = () => {
  const checkAndHandleStock = async () => {
    try {
      // Obtener la fecha actual al inicio del día
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Establecer las horas en 00:00:00
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1); // Fecha del siguiente día al inicio

      const stockCollectionRef = collection(db, 'Stock');
      // Consulta para verificar si hay un documento entre las fechas de hoy y mañana
      const stockQuery = query(
        stockCollectionRef,
        where('createdAt', '>=', Timestamp.fromDate(today)),
        where('createdAt', '<', Timestamp.fromDate(tomorrow))
      );
      const stockSnapshot = await getDocs(stockQuery);

      if (stockSnapshot.empty) {
        Swal.fire({
          title: 'Stock diario no encontrado',
          text: 'Ingresa la cantidad de stock para el día de hoy.',
          icon: 'warning',
          input: 'number', // Input para número
          inputPlaceholder: 'Cantidad de stock',
          showCancelButton: true,
          confirmButtonText: 'Crear Stock',
          cancelButtonText: 'Continuar trabajando',
          inputValidator: (value) => {
            if (!value || value <= 0) {
              return 'Por favor, ingresa una cantidad válida de stock.';
            }
            return null;
          },
        }).then(async (result) => {
          if (result.isConfirmed && result.value) {
            
            await addDoc(stockCollectionRef, { 
              quantity: parseInt(result.value, 10), 
              createdAt: Timestamp.now(), 
            });
            Swal.fire('Stock creado', `Se registró ${result.value} como stock para hoy.`, 'success');
          }
        });
      } else {
        console.log('El stock para hoy ya está registrado.');
      }
    } catch (error) {
      console.error('Error verificando el stock diario:', error);
      Swal.fire('Error', 'Hubo un problema al verificar el Stock diario.', 'error');
    }
  };

  useEffect(() => {
    checkAndHandleStock();
  }, []);

  return ;
};

export default AddStock;
