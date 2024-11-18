import { useState } from "react";
import { NavLink } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import { FaPizzaSlice, FaListAlt, FaMapMarkedAlt, FaShoppingCart, FaChartBar } from "react-icons/fa";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { FiMenu } from "react-icons/fi"; // Ícono de menú hamburguesa
import "./dashboardadmin.css";

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
        className={`nav-tabs ${showMenu ? "d-flex" : "d-none"}`} // Mostramos/ocultamos el menú
        defaultActiveKey="/nuevoproducto"
      >
        <Nav.Item>
          <Nav.Link as={NavLink} to="/clients">
            <RiMoneyDollarCircleLine style={{ marginRight: "8px" }} />
            Atencion
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/newproduct">
            <FaPizzaSlice style={{ marginRight: "8px" }} />
            Crear productos
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/productcreated">
            <FaListAlt style={{ marginRight: "8px" }} />
            Ver Productos
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/zona">
            <FaMapMarkedAlt style={{ marginRight: "8px" }} />
            Zonas
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/placeorders">
            <FaShoppingCart style={{ marginRight: "8px" }} />
            Pedidos
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/reports">
            <FaChartBar style={{ marginRight: "8px" }} />
            Reportes
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default DashboardAdmin;
