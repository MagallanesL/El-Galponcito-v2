import { useState } from "react";
import { NavLink } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import { FaPizzaSlice, FaListAlt, FaMapMarkedAlt, FaShoppingCart, FaChartBar } from "react-icons/fa";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { FiMenu } from "react-icons/fi"; 
import Stock from "../../../components/stock/stock";

const DashboardAdmin = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div>
      <div className="hamburger-menu">
        <FiMenu size={30} color="#030303" onClick={toggleMenu} />
      </div>

      <Nav
        variant="tabs"
        className={`nav-tabs ${showMenu ? "show" : ""}`} // Mostrar/ocultar menú en pantallas pequeñas
        defaultActiveKey="/nuevoproducto"
      >
        <Nav.Item>
          <Nav.Link as={NavLink} to="/clients" onClick={() => setShowMenu(false)}>
            <RiMoneyDollarCircleLine style={{ marginRight: "8px" }} />
            Atencion
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/newproduct" onClick={() => setShowMenu(false)}>
            <FaPizzaSlice style={{ marginRight: "8px" }} />
            Crear productos
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/productcreated" onClick={() => setShowMenu(false)}>
            <FaListAlt style={{ marginRight: "8px" }} />
            Ver Productos
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/zona" onClick={() => setShowMenu(false)}>
            <FaMapMarkedAlt style={{ marginRight: "8px" }} />
            Zonas
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/placeorders" onClick={() => setShowMenu(false)}>
            <FaShoppingCart style={{ marginRight: "8px" }} />
            Pedidos
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/reports" onClick={() => setShowMenu(false)}>
            <FaChartBar style={{ marginRight: "8px" }} />
            Reportes
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <Stock />
    </div>
  );
};

export default DashboardAdmin;
