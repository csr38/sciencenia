import React from 'react';
import '../styles/LoadingSpinner.css';

//Elemento de carga entre acciones
const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingSpinner;