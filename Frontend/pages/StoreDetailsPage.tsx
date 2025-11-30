
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import GazetkaCard from '../components/GazetkaCard';
import { Store, ArrowLeft } from 'lucide-react';

const StoreDetailsPage = () => {
    const { storeName } = useParams<{ storeName: string }>();
    const navigate = useNavigate();
    const { products } = useProducts();

    const storeProducts = products.filter(p => p.storeName === storeName);

    return (
        <div className="animate-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-4 mb-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {storeProducts.map(product => (
                    <GazetkaCard 
                        key={product.id} 
                        product={product} 
                    />
                ))}
            </div>
            {storeProducts.length === 0 && (
                <div className="p-8 text-center border-2 border-dashed border-ink/20">
                    <p>Brak aktualnych promocji w tym sklepie.</p>
                </div>
            )}
        </div>
    );
};

export default StoreDetailsPage;
