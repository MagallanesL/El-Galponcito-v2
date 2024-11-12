import Productos from '../../components/products/show/ViewProducts'
import { Link } from 'react-router-dom';

const ViewClients = () => {
 
  return (
    <div>            
     <h1>cliente</h1>
     <Link to={'/cart'}>Pa! el Lobby</Link>
     <Productos/>
    </div>
  );
};

export default ViewClients;
