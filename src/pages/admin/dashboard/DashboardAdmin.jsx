import { NavLink } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import { FaPizzaSlice, FaListAlt, FaMapMarkedAlt, FaShoppingCart, FaChartBar } from "react-icons/fa";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { GiTabletopPlayers } from "react-icons/gi";
import { TbReportSearch } from "react-icons/tb";
import './dashboardadmin.css';

const DashboardAdmin = () => {
  return (
    <div className="dashboard-container">
      <Nav variant="tabs" className="nav-tabs" defaultActiveKey="/nuevoproducto">
        <Nav.Item>
          <Nav.Link as={NavLink} to="/clients">
            <RiMoneyDollarCircleLine style={{ marginRight: "8px" }} />
            Atención
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
          <Nav.Link as={NavLink} to="/producttable">
            <FaChartBar style={{ marginRight: "8px" }} />
            Productos Mesa
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/stock">
            <TbReportSearch style={{ marginRight: "8px" }} />
            Stock
          </Nav.Link>
        </Nav.Item>
        {/* <Nav.Item>
          <Nav.Link as={NavLink} to="/drinks" >
            <GiTabletopPlayers style={{ marginRight: "8px" }} />
            Bebidas
          </Nav.Link>
        </Nav.Item> */}
        <Nav.Item>
          <Nav.Link as={NavLink} to="/table" disabled>
            <GiTabletopPlayers style={{ marginRight: "8px" }} />
            Mesas
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default DashboardAdmin;
