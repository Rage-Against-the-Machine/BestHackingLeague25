
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { ProductCategory } from '../types';
import ProductCardForStore from '../components/ProductCardForStore';
import { Store, ArrowLeft, Search, X, Package, Milk, Croissant, Apple, Beef, CupSoda, Utensils, LayoutGrid } from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
    'ALL': LayoutGrid,
    [ProductCategory.DAIRY]: Milk,
    [ProductCategory.BAKERY]: Croissant,
    [ProductCategory.FRUIT_VEG]: Apple,
    [ProductCategory.MEAT]: Beef,
    [ProductCategory.DRINKS]: CupSoda,
    [ProductCategory.READY_MEAL]: Utensils,
    [ProductCategory.OTHER]: Package
};

const StoreDetailsPage = () => {
    const { storeName } = useParams<{ storeName: string }>();
    const navigate = useNavigate();
    const { products } = useProducts();

    const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'ALL'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    const storeProducts = useMemo(() => products.filter(p => p.storeName === storeName), [products, storeName]);

    const filteredProducts = useMemo(() => {
        let list = [...storeProducts];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            list = list.filter(p => p.name.toLowerCase().includes(query));
        }

        if (selectedCategory !== 'ALL') {
            list = list.filter(p => p.category === selectedCategory);
        }

        return list;
    }, [storeProducts, searchQuery, selectedCategory]);

    return (
        <div className="animate-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/map')}
                        className="bg-transparent border-2 border-ink p-2 hover:bg-ink hover:text-white transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-ink flex items-center gap-2">
                            <Store size={32} />
                            {storeName}
                        </h2>
                        <p className="text-ink-light italic">Wszystkie produkty w tej lokalizacji</p>
                    </div>
                </div>
                <div className="relative">
                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-light" />
                    <input
                        type="text"
                        placeholder="Szukaj w sklepie..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-64 bg-paper border-2 border-ink pl-10 pr-4 py-2 text-lg font-serif focus:outline-none placeholder:text-ink-light/50"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-ink/10 rounded-full"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-4">
                {['ALL', ...Object.values(ProductCategory)].map((cat) => {
                    const Icon = CATEGORY_ICONS[cat] || Package;
                    const isActive = cat === selectedCategory;
                    return (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat as any)}
                            className={`shrink-0 px-4 py-2 flex items-center justify-center gap-2 border-2 transition-all duration-200 ${isActive ? 'bg-ink text-white' : 'bg-paper text-ink hover:bg-ink/5'}`}
                        >
                            <Icon size={16} />
                            <span className="text-sm font-bold">
                                {cat === 'ALL' ? 'Wszystkie' : cat}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                    <ProductCardForStore 
                        key={product.id} 
                        product={product} 
                    />
                ))}
            </div>
            {filteredProducts.length === 0 && (
                <div className="p-8 text-center border-2 border-dashed border-ink/20 col-span-full">
                    <p className="font-serif">Nie znaleziono produktów spełniających kryteria.</p>
                </div>
            )}
        </div>
    );
};

export default StoreDetailsPage;
