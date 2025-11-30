
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../types';

export interface ShoppingListItem extends Product {
    purchaseQuantity: number;
}

interface ShoppingListContextType {
    shoppingList: ShoppingListItem[];
    addProduct: (product: Product, quantity: number) => void;
    updateProductQuantity: (productId: number, newQuantity: number) => void;
    removeProduct: (productId: number) => void;
    clearList: () => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);

export const useShoppingList = () => {
    const context = useContext(ShoppingListContext);
    if (!context) {
        throw new Error('useShoppingList must be used within a ShoppingListProvider');
    }
    return context;
};

interface ShoppingListProviderProps {
    children: ReactNode;
}

export const ShoppingListProvider = ({ children }: ShoppingListProviderProps) => {
    const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const addProduct = (product: Product, quantity: number) => {
        setShoppingList(prevList => {
            const existingProduct = prevList.find(item => item.id === product.id);
            if (existingProduct) {
                const newQuantity = Math.min(existingProduct.purchaseQuantity + quantity, product.quantity);
                return prevList.map(item =>
                    item.id === product.id ? { ...item, purchaseQuantity: newQuantity } : item
                );
            } else {
                const newQuantity = Math.min(quantity, product.quantity);
                return [...prevList, { ...product, purchaseQuantity: newQuantity }];
            }
        });
        setIsOpen(true);
    };

    const updateProductQuantity = (productId: number, newQuantity: number) => {
        setShoppingList(prevList => {
            const productToUpdate = prevList.find(item => item.id === productId);
            if (productToUpdate) {
                const cappedQuantity = Math.max(0, Math.min(newQuantity, productToUpdate.quantity));
                if (cappedQuantity === 0) {
                    return prevList.filter(item => item.id !== productId);
                }
                return prevList.map(item =>
                    item.id === productId ? { ...item, purchaseQuantity: cappedQuantity } : item
                );
            }
            return prevList;
        });
    };

    const removeProduct = (productId: number) => {
        setShoppingList(prevList => prevList.filter(item => item.id !== productId));
    };

    const clearList = () => {
        setShoppingList([]);
    };

    const value = {
        shoppingList,
        addProduct,
        updateProductQuantity,
        removeProduct,
        clearList,
        isOpen,
        setIsOpen,
    };

    return (
        <ShoppingListContext.Provider value={value}>
            {children}
        </ShoppingListContext.Provider>
    );
};
