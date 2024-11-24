import { NavLink } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import { FaPizzaSlice, FaListAlt, FaMapMarkedAlt, FaShoppingCart, FaChartBar } from "react-icons/fa";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { GiTabletopPlayers } from "react-icons/gi";
import { TbReportSearch } from "react-icons/tb";
import StockDiary from '../dashboard/addStock/addStock'
import './dashboardadmin.css'

const DashboardAdmin = () => {
  return (
    <div className="dashboard-container">
      <Nav variant="tabs" className="nav-tabs" defaultActiveKey="/nuevoproducto">
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
        <Nav.Item>
          <Nav.Link as={NavLink} to="/stock">
            <TbReportSearch style={{ marginRight: "8px" }} />
            Stock
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
      <Nav.Link as={NavLink} to="/table" className="disabled" aria-disabled="true">
      <GiTabletopPlayers style={{ marginRight: "8px" }} />
             Mesas
       </Nav.Link>
        </Nav.Item>
      </Nav>

      <StockDiary/>
    </div>
  );
};

export default DashboardAdmin;
