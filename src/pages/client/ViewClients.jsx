import Productos from '../../components/products/show/ViewProducts';
import { Link } from 'react-router-dom';
import { db } from '../../firebase/firebaseconfig';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/authcontext';
import { CartContext } from '../../context/dataContext';
import { GiFullPizza } from "react-icons/gi";
import { TfiPanel } from "react-icons/tfi";
import './css/viewClients.css';

const ViewClients = () => {
  const { user } = useContext(AuthContext);
  const { getTotalQuantity } = useContext(CartContext); // Obtener función desde CartContext
  const [userData, setUserData] = useState(null);

  // Función para capitalizar la primera letra
  const capitalizeFirstLetter = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid) {
        const userDocRef = doc(db, 'Usuarios', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };
    fetchUserData();
  }, [user]);

  return (
    <>
      {user && user.email === 'admin@elgalponcito.com' && (
        <Link to="/admin">
          <button className="admin-icon"><TfiPanel /></button>
        </Link>
      )}
      <div className="view-clients-container">
        <header className="view-clients-header">
          <h1 className="welcome-message">
            Hola! {userData ? capitalizeFirstLetter(userData.nombre) : 'Cargando usuario...'}
          </h1>
          <Link to={'/cart'} className="pizza-icon">
            <GiFullPizza />
            {getTotalQuantity() > 0 && (
              <span className="product-count">{getTotalQuantity()}</span>
            )}
          </Link>
        </header>
        <main>
          <Productos />
        </main>
      </div>
    </>
  );
};

export default ViewClients;
