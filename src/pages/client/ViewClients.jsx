import Productos from '../../components/products/show/ViewProducts';
import { Link } from 'react-router-dom';
import { db } from '../../firebase/firebaseconfig';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/authcontext'; // Asegúrate de importar tu contexto de autenticación
import { GiFullPizza } from "react-icons/gi";

const ViewClients = () => {
  const { user } = useContext(AuthContext); // Obtén el usuario logueado del contexto
  const [userData, setUserData] = useState(null);

  // Obtener datos del usuario logueado desde Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid) {
        const userDocRef = doc(db, 'Usuarios', user.uid); // Asegúrate de que el nombre de la colección sea correcto
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <div>
      {/* Mostrar el nombre del usuario logueado si está disponible */}
      <h1>Hola! {userData ? userData.nombre : 'Cargando usuario...'}!</h1>
      <Link to={'/cart'}><GiFullPizza /></Link>
      <Productos />
    </div>
  );
};

export default ViewClients;
