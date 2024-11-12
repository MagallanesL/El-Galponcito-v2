import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './auth/Login/login';
import CartContent from './components/cart/cartContent/cartContent';
import CreateNew from './components/products/create/createNew';
import Admin from './pages/admin/dashboard/DashboardAdmin';
import ProductCreated from './pages/admin/ProductsCreated/productsCreated';
import ZoneCobertura from './pages/admin/Zone/zoneCobert'
import PlaceOrders from './pages/admin/PlaceOrders/PlaceOrders';
import Reports from './pages/admin/reports/reports';
import ViewClients from './pages/client/ViewClients';
import { CartProvider } from './context/dataContext';

function App() {
  // Definimos los "future flags" de React Router
  const future = {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  };

  return (
    <CartProvider>
      <Router future={future}>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path="/clients" element={<ViewClients />} />
          <Route path='/cart' element={<CartContent />} />
          <Route path="/newproduct" element={<CreateNew />} />
          <Route path="/productcreated" element={<ProductCreated />} />
          <Route path="/zona" element={<ZoneCobertura />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/placeorders" element={<PlaceOrders />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>  
      </Router>
    </CartProvider>
  );
}

export default App;
