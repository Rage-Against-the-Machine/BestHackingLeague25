import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import MainLayout from './components/MainLayout';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ProductProvider>
        <MainLayout />
      </ProductProvider>
    </AuthProvider>
  );
};

export default App;