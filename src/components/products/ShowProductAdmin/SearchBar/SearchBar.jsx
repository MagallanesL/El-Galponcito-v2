// components/SearchBar.js
import React from 'react';
import styles from './SearchBar.module.css';

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <input
      type="text"
      placeholder="Buscar productos..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      className={styles.searchInput}
    />
  );
};

export default SearchBar;
