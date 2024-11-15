import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './auth/Login/login';
import CartContent from './components/cart/cartContent/cartContent';
import CreateNew from './components/products/create/createNew';
import Admin from './pages/admin/dashboard/DashboardAdmin';
import ProductCreated from './pages/admin/ProductsCreated/productsCreated';
import ZoneCobertura from './pages/admin/Zone/zoneCobert';
import PlaceOrders from './pages/admin/PlaceOrders/PlaceOrders';
import Reports from './pages/admin/reports/reports';
import ViewClients from './pages/client/ViewClients';
import { CartProvider } from './context/dataContext';
import { AuthProvider } from './context/authcontext';
import ProtectedRoute from './routes/protectedRoute';

function App() {
  const adminEmail = "admin@elgalponcito.com";  // Podrías obtener esto desde el contexto de autenticación.

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Ruta pública */}
            <Route path='/' element={<Login />} />

            {/* Rutas protegidas para usuarios autenticados */}
            <Route path="/clients" element={
              <ProtectedRoute>
                <ViewClients />
              </ProtectedRoute>
            } />
            <Route path='/cart' element={
              <ProtectedRoute>
                <CartContent />
              </ProtectedRoute>
            } />

            {/* Rutas protegidas solo para el admin */}
            <Route path="/newproduct" element={
              <ProtectedRoute adminEmail={adminEmail}>
                <CreateNew />
              </ProtectedRoute>
            } />
            <Route path="/productcreated" element={
              <ProtectedRoute adminEmail={adminEmail}>
                <ProductCreated />
              </ProtectedRoute>
            } />
            <Route path="/zona" element={
              <ProtectedRoute adminEmail={adminEmail}>
                <ZoneCobertura />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute adminEmail={adminEmail}>
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="/placeorders" element={
              <ProtectedRoute adminEmail={adminEmail}>
                <PlaceOrders />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute adminEmail={adminEmail}>
                <Reports />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
