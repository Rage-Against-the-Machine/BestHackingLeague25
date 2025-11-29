
import React, { useState, useEffect } from 'react';
import MapView from '../components/MapView';
import { useProducts } from '../contexts/ProductContext';
import { useNavigate } from 'react-router-dom';

const MapPage = () => {
    const { products } = useProducts();
    const navigate = useNavigate();
    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [isLocating, setIsLocating] = useState(true);

    useEffect(() => {
        const success = (position: GeolocationPosition) => {
            setUserLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
            setIsLocating(false);
        };

        const error = () => {
            console.warn("Geolocation blocked/failed, using mock location.");
            setUserLocation({ lat: 52.2297, lng: 21.0122 }); 
            setIsLocating(false);
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            error();
        }
    }, []);

    const handleStoreSelect = (storeName: string) => {
        navigate(`/store/${storeName}`);
    };

    return (
        <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-highlight p-2 border-l-4 border-ink mb-4 inline-block transform -rotate-1">
                <h2 className="text-xl font-serif font-bold">Lokalizator Okazji</h2>
            </div>
            <p className="mb-2 text-sm text-ink-light">Kliknij na etykietę sklepu na mapie, aby zobaczyć aktualne promocje w tym miejscu.</p>
            <MapView
                products={products}
                userLocation={userLocation}
                onSelectStore={handleStoreSelect}
            />
        </div>
    );
};

export default MapPage;
