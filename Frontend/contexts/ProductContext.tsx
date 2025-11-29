
import React, { createContext, useState, useContext, ReactNode, FC, useEffect, useCallback } from 'react';
import { Product } from '../types';
import { productService } from '../services/productService';

interface ProductContextType {
    products: Product[];
    isLoading: boolean;
    fetchProducts: () => Promise<void>;
    addProduct: (product: Product) => Promise<void>;
    updateProduct: (product: Product) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await productService.getAllProducts();
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addProduct = async (product: Product) => {
        await productService.addProduct(product);
        await fetchProducts();
    };

    const updateProduct = async (product: Product) => {
        await productService.updateProduct(product);
        await fetchProducts();
    };

    const deleteProduct = async (id: string) => {
        await productService.deleteProduct(id);
        await fetchProducts();
    };

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const value = {
        products,
        isLoading,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};
