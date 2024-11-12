// components/ProductCategory.js
import React from 'react';
import ProductTable from '../ProductTable/ProductTable';
import styles from './ProductCategory.module.css';

const ProductCategory = ({ title, products, ...props }) => {
  return (
    <div>
      <h3 className={styles.categoryTitle}>{title}</h3>
      <ProductTable products={products} {...props} />
    </div>
  );
};

export default ProductCategory;
