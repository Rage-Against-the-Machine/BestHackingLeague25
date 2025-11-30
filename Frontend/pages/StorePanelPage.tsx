
import React from 'react';
import StorePanel from '../components/StorePanel';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';

const StorePanelPage = () => {
    const { user } = useAuth(); // Get the full user object
    const { products, addProduct, updateProduct, deleteProduct } = useProducts();

    // Filter products by storeId, ensuring user and storeId exist
    const myStoreProducts = products.filter(p => p.storeId === user?.storeId);

    if (!user || user.role !== 'STORE' || !user.storeId) {
        // Handle cases where user is not a store or storeId is missing
        return <div className="text-center p-4 text-red-500">Błąd: Brak dostępu do panelu sklepu lub brak ID sklepu.</div>;
    }

    return (
        <StorePanel 
            storeName={user.name} // Pass user's name as storeName
            products={myStoreProducts}
            onAddProduct={addProduct}
            onUpdateProduct={updateProduct}
            onDeleteProduct={deleteProduct}
        />
    );
};

export default StorePanelPage;
