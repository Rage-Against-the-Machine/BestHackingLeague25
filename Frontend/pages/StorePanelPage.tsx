
import React from 'react';
import StorePanel from '../components/StorePanel';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';

const StorePanelPage = () => {
    const { userName } = useAuth();
    const { products, addProduct, updateProduct, deleteProduct } = useProducts();

    const myStoreProducts = products.filter(p => p.storeName === userName);

    return (
        <StorePanel 
            storeName={userName}
            products={myStoreProducts}
            onAddProduct={addProduct}
            onUpdateProduct={updateProduct}
            onDeleteProduct={deleteProduct}
        />
    );
};

export default StorePanelPage;
