import React from 'react';
import { Card, Accordion, DropdownButton, Dropdown } from 'react-bootstrap';

const OrderCard = ({ order, handleStatusChange, getStatusClass }) => {
  return (
    <Card key={order.id}>
      <Accordion.Item eventKey={String(order.orderNumber)}>
        <Accordion.Header>
          <Dropdown>
            <Dropdown.Toggle variant="secondary" id={`dropdown-status-${order.id}`} className={`mr-2 ${getStatusClass(order.status)}`}>
              {order.status || 'Pendiente'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="Pendiente" onClick={() => handleStatusChange(order.id, 'Pendiente')}>
                Pendiente
              </Dropdown.Item>
              <Dropdown.Item eventKey="Cocinando" onClick={() => handleStatusChange(order.id, 'Cocinando')}>
                Cocinando
              </Dropdown.Item>
              <Dropdown.Item eventKey="Enviado" onClick={() => handleStatusChange(order.id, 'Enviado')}>
                Enviado
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {order.orderNumber} # Pedido de: <strong>{order.userName}</strong> - Total: ${order.totalAmount}
          
        </Accordion.Header>
        <Accordion.Body>
          <p><strong>Teléfono:</strong> {order.userPhone}</p>
          <p><strong>Dirección:</strong> {order.address ?  order.address.split(',')[0] : 'Retira en local'}</p>
          <h5>Productos:</h5>
          <ul>
            {order.items?.map((item, idx) => (
              <li key={idx}>
                {item.category === "1/2 y 1/2"
                  ? `${item.half1.name} y ${item.half2.name}`
                  : item.name}
                - {item.quantity} unidad{item.quantity > 1 ? 'es' : ''}
              </li>
            ))}
          </ul>
        </Accordion.Body>
      </Accordion.Item>
    </Card>
  );
};

export default OrderCard;
