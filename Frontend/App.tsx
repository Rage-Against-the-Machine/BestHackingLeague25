import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import { ShoppingListProvider } from './contexts/ShoppingListContext';
import MainLayout from './components/MainLayout';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ProductProvider>
        <ShoppingListProvider>
          <MainLayout />
        </ShoppingListProvider>
      </ProductProvider>
    </AuthProvider>
  );
};

export default App;