import Productos from '../../components/products/show/ViewProducts';
import { Link } from 'react-router-dom';
import { db } from '../../firebase/firebaseconfig';
import { getDocs, collection } from 'firebase/firestore'; // getDocs para obtener todos los documentos
import { useEffect, useState } from 'react';
import { GiFullPizza } from "react-icons/gi";

const ViewClients = () => {
  // Inicializar el estado con un array vacío
  const [usuarios, setUsuarios] = useState([]);

  // Definir la función para obtener los clientes
  const getClients = async () => {
    // Especifica la colección de Firestore
    const UsuariosCollection = collection(db, 'Usuarios'); // Asegúrate de que el nombre coincida con tu colección
    const data = await getDocs(UsuariosCollection);
    // Mapea los documentos y establece el estado
    setUsuarios(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  // Ejecutar getClients cuando el componente se monte
  useEffect(() => {
    getClients();
  }, []);

  return (
    <div>
      {/* Accede a usuarios y muestra el nombre si existe */}
      <h1>Hola! {usuarios.length > 0 ? usuarios[0].nombre : 'Usuario'}</h1>
      <Link to={'/cart'}><GiFullPizza /></Link>
      <Productos />
    </div>
  );
};

export default ViewClients;
