import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './auth/Login/login';
import CartContent from './components/cart/cartContent/cartContent';
import CreateNew from './components/products/create/createNew';
import Admin from './pages/admin/dashboard/DashboardAdmin';
import ProductCreated from './pages/admin/ProductsCreated/productsCreated';
import ZoneCobertura from './pages/admin/Zone/CoverageZone';
import PlaceOrders from './pages/admin/PlaceOrders/PlaceOrders';
import Reports from './pages/admin/reports/reports';
import Stock from './pages/admin/stock/index';
import Table from './pages/admin/table/index';
import ProductTable from "./pages/admin/showproducttable/index";
import ViewClients from './pages/client/ViewClients';
import Deliverys from './pages/admin/Zone/deliverysCost/index';
import { CartProvider } from './context/dataContext';
import { AuthProvider } from './context/authcontext';
import ProtectedRoute from './routes/protectedRoute';

function App() {
  const adminEmail = "admin@elgalponcito.com";

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Ruta pública */}
            <Route path='/' element={<Login />} />

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
            <Route path="/stock" element={
              <ProtectedRoute adminEmail={adminEmail}>
                <Stock />
              </ProtectedRoute>
            } />
            <Route path="/table" element={
              <ProtectedRoute adminEmail={adminEmail}>
                <Table />
              </ProtectedRoute>
            } />
            <Route path="/producttable" element={
              <ProtectedRoute adminEmail={adminEmail}>
                <ProductTable />
              </ProtectedRoute>
            } />
            <Route path="/deliverys" element={
              <ProtectedRoute adminEmail={adminEmail}>
                <Deliverys />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
