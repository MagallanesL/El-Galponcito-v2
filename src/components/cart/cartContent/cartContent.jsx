import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../../../context/dataContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseconfig'; 

const CartContent = () => {
  const { cartItems } = useContext(CartContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [total, setTotal] = useState(0);

  const ordersCollection = collection(db, 'pedidos');

  // Calcular el total del carrito cuando cartItems cambia
  useEffect(() => {
    const calculateTotal = () => {
      const totalAmount = cartItems.reduce((acc, item) => acc + Number(item.price), 0);
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
      name: 'juanitos',
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
    <div>
      <h2>Carrito de Compras</h2>
      {cartItems.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.name} - ${item.price}
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${total}</p>
      <button onClick={handleSubmit}>Confirmar</button>
    </div>
  );
};

export default CartContent;
