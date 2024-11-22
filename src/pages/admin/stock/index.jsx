import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseconfig'; 


const updateStockAfterOrder = async (order) => {
  try {
    // Para cada item del pedido
    for (const item of order.items) {
      const productId = item.id;
      const quantityOrdered = item.quantity;

      // Buscar el producto en la colección de productos
      const productRef = doc(db, 'Productos', productId);
      const productSnapshot = await getDoc(productRef);

      if (productSnapshot.exists()) {
        const productData = productSnapshot.data();
        const currentStock = productData.stock; // Asegúrate de que 'stock' sea el campo correcto en tu colección de productos

        if (currentStock >= quantityOrdered) {
          // Actualizar el stock
          const newStock = currentStock - quantityOrdered;
          await updateDoc(productRef, { stock: newStock });
          console.log(`Stock actualizado para el producto ${productData.name}: ${newStock} unidades restantes.`);
        } else {
          console.log(`No hay suficiente stock para el producto ${item.name}.`);
        }
      } else {
        console.log(`Producto con id ${productId} no encontrado.`);
      }
    }
  } catch (error) {
    console.error("Error al actualizar el stock:", error);
  }
};
