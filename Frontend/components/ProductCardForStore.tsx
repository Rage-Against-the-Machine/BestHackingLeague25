
import React, { useState } from 'react';
import { Product } from '../types';
import { useShoppingList } from '../contexts/ShoppingListContext';
import { Plus, Minus, ShoppingCart, Clock, Hash } from 'lucide-react';

interface ProductCardForStoreProps {
    product: Product;
}

const ProductCardForStore: React.FC<ProductCardForStoreProps> = ({ product }) => {
    const { addProduct } = useShoppingList();
    const [quantity, setQuantity] = useState(1);
    
    const expiry = new Date(product.expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const handleQuantityChange = (amount: number) => {
        setQuantity(prev => Math.max(1, Math.min(product.quantity, prev + amount)));
    };

    const handleAddToList = () => {
        addProduct(product, quantity);
    };

    const discountPercentage = product.price_original > 0 
        ? Math.round(((product.price_original - product.price_users) / product.price_original) * 100)
        : 0;

    return (
        <div className="bg-paper border-b-2 border-r-2 border-ink p-4 relative flex flex-col h-full group">
            <div className="flex gap-4">
                <div className="flex-1">
                    <span className="inline-block border-b border-ink/30 text-[10px] uppercase tracking-widest text-ink-light mb-1">
                        {product.category}
                    </span>
                    <h3 className="text-xl font-serif font-bold leading-tight text-ink mb-2">
                        {product.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-2xl font-serif font-black text-accent">
                            {(product.discountPrice ?? 0).toFixed(2)} zł
                        </span>
                        <span className="text-sm text-ink-light line-through decoration-1">
                            {(product.originalPrice ?? 0).toFixed(2)} zł
                        </span>
                    </div>
                    <div className="space-y-1 text-xs font-sans text-ink-light border-l-2 border-ink/10 pl-2">
                        <div className="flex items-center gap-1">
                            <Clock size={12} />
                            <span className="uppercase tracking-wide text-[10px]">
                                Ważne jeszcze {diffDays} dni
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Hash size={12} />
                            <span className="uppercase tracking-wide text-[10px] font-bold">
                                {product.quantity} szt.
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-24 shrink-0 flex flex-col gap-2">
                    <div className="aspect-square w-full border-2 border-ink p-1 bg-white rotate-2 shadow-sm group-hover:rotate-0 transition-all duration-300">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    {discountPercentage > 0 && (
                        <div className="text-center">
                            <span className="bg-ink text-paper text-xs font-bold px-1 py-0.5">
                                -{discountPercentage}%
                            </span>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="flex-grow"></div>

            <div className="mt-4 pt-4 border-t-2 border-dashed border-ink/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <button onClick={() => handleQuantityChange(-1)} className="p-2 border-2 border-ink rounded-full w-10 h-10 flex items-center justify-center hover:bg-ink/10 transition-colors">
                        <Minus size={16} />
                    </button>
                    <input 
                        type="number" 
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Math.min(product.quantity, parseInt(e.target.value) || 1)))}
                        className="w-16 h-10 text-center font-bold border-2 border-ink bg-paper rounded-lg"
                        readOnly
                    />
                    <button onClick={() => handleQuantityChange(1)} className="p-2 border-2 border-ink rounded-full w-10 h-10 flex items-center justify-center hover:bg-ink/10 transition-colors">
                        <Plus size={16} />
                    </button>
                </div>

                <button 
                    onClick={handleAddToList}
                    className="w-full bg-ink text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-ink/80 transition-colors shadow-paper"
                >
                    <ShoppingCart size={16} />
                    Dodaj do listy
                </button>
            </div>
        </div>
    );
};

export default ProductCardForStore;

