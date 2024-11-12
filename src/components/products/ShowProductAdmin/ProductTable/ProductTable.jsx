// components/ProductTable.js
import styles from './ProductTable.module.css';

const ProductTable = ({ products, editProductId, editedProduct, onEditClick, onDeleteClick, onInputChange, onSaveClick, onCancelClick }) => {
  return (
    <table className={`${styles.productsTable} table table-striped`}>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Precio</th>
          <th>Categoría</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            {editProductId === product.id ? (
              <>
                <td>
                  <input 
                    type="text" 
                    name="name" 
                    value={editedProduct.name} 
                    onChange={onInputChange} 
                    className={styles.formControl}
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    name="description" 
                    value={editedProduct.description} 
                    onChange={onInputChange} 
                    className={styles.formControl}
                  />
                </td>
                <td>
                  <input 
                    type="number" 
                    name="price" 
                    value={editedProduct.price} 
                    onChange={onInputChange} 
                    className={styles.formControl}
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    name="category" 
                    value={editedProduct.category} 
                    onChange={onInputChange} 
                    className={styles.formControl}
                  />
                </td>
                <td>
                  <button className={styles.btnSave} onClick={() => onSaveClick(product.id)}>Guardar</button>
                  <button className={styles.btnCancel} onClick={onCancelClick}>Cancelar</button>
                </td>
              </>
            ) : (
              <>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>
                  <button className={styles.btnEdit} onClick={() => onEditClick(product)}>Editar</button>
                  <button className={styles.btnDelete} onClick={() => onDeleteClick(product.id)}>Eliminar</button>
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;
