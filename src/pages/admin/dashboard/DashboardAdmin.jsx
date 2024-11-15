import { NavLink } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';

const DashboardAdmin = () => {
  return (
    <div>
      <Nav variant="tabs" defaultActiveKey="/nuevoproducto">
        <Nav.Item>
          <Nav.Link
            as={NavLink}
            to="/newproduct"
          >
            Crear productos
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={NavLink}
            to="/productcreated"
          >
            Ver Productos
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={NavLink}
            to="/zona"
          >
            Zonas
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={NavLink}
            to="/placeorders"
          >
            Pedidos
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={NavLink}
            to="/reports"
          >
            Reportes
          </Nav.Link>
        </Nav.Item>
      </Nav>
      
    </div>
  );
};

export default DashboardAdmin;
