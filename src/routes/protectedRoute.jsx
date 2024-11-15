import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/authcontext';

const ProtectedRoute = ({ children, adminEmail }) => {
  const { user } = useContext(AuthContext); // Obtener los datos del usuario desde el contexto

  if (!user) {
    // Si no hay usuario logueado, redirigir al login
    return <Navigate to="/" />;
  }

  if (adminEmail && user.email !== adminEmail) {
    // Si el usuario no es el admin, redirigir a acceso denegado o a donde desees
    return <Navigate to="/access-denied" />;
  }

  return children;  // Si el usuario está autenticado y es admin (si aplica), renderiza el componente
};

export default ProtectedRoute;
