import React, { useState, useMemo } from 'react';
import { Product, ProductCategory } from '../types';
import { useProducts } from '../contexts/ProductContext';
import ProductCard from '../components/ProductCard';
import { Loader2, Filter, Navigation, Search, X, Package, Milk, Croissant, Apple, Beef, CupSoda, Utensils, LayoutGrid } from 'lucide-react';

type SortMode = 'DEFAULT' | 'DISTANCE';
type DistanceFilter = 'ALL' | 1 | 2 | 5 | 10;

// Helper: Calculate distance between two coords in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

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

const HomePage = () => {
    const { products, isLoading: isLoadingData } = useProducts();
    const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'ALL'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    
    // Geolocation & Filtering states
    const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
    const [sortMode, setSortMode] = useState<SortMode>('DEFAULT');
    const [distanceFilter, setDistanceFilter] = useState<DistanceFilter>('ALL');
    const [isLocating, setIsLocating] = useState(false);

    const handleToggleLocation = () => {
        if (sortMode === 'DISTANCE' && userLocation) {
          setSortMode('DEFAULT');
          setDistanceFilter('ALL');
          return;
        }
    
        setIsLocating(true);
    
        const success = (position: GeolocationPosition) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setSortMode('DISTANCE');
          setIsLocating(false);
        };
    
        const error = () => {
          console.warn("Geolocation blocked/failed, using mock location.");
          setUserLocation({ lat: 52.2297, lng: 21.0122 }); 
          setSortMode('DISTANCE');
          setIsLocating(false);
        };
    
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(success, error);
        } else {
          error();
        }
    };

    const processedProducts = useMemo(() => {
        let list = [...products];

        // 1. Search Filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            list = list.filter(p => p.name.toLowerCase().includes(query));
        }

        // 2. Filter by Category
        if (selectedCategory !== 'ALL') {
            list = list.filter(p => p.category === selectedCategory);
        }

        // 3. Map with Distance (if location exists)
        const listWithDistance = list.map(p => {
            let distance = null;
            if (userLocation && p.coordinates) {
                distance = calculateDistance(
                    userLocation.lat, userLocation.lng,
                    p.coordinates.lat, p.coordinates.lng
                );
            }
            return { ...p, distance };
        });

        let result = listWithDistance;

        // 4. Filter by Distance Range
        if (sortMode === 'DISTANCE' && distanceFilter !== 'ALL') {
            result = result.filter(p => p.distance !== null && p.distance <= distanceFilter);
        }

        // 5. Sort by Distance (if active)
        if (sortMode === 'DISTANCE' && userLocation) {
            result.sort((a, b) => {
                if (a.distance === null) return 1;
                if (b.distance === null) return -1;
                return (a.distance as number) - (b.distance as number);
            });
        }

        return result;
    }, [selectedCategory, products, userLocation, sortMode, distanceFilter, searchQuery]);

    return (
        <>
        <div className="sticky top-0 z-30 pt-4 pb-2 bg-transparent transition-all duration-300 mt-4">
            <div className="flex items-center gap-2 relative py-4">
              
              {/* Categories */}
              <nav className={`flex-1 flex gap-2 overflow-x-auto no-scrollbar py-4 -my-4 transition-all duration-300 origin-left ${isSearchOpen ? 'w-0 opacity-0 scale-x-0 overflow-hidden' : 'w-full opacity-100 scale-x-100'}`}>
                {['ALL', ...Object.values(ProductCategory)].map((cat) => {
                  const Icon = CATEGORY_ICONS[cat] || Package;
                  const isActive = (cat === 'ALL' && selectedCategory === 'ALL') || selectedCategory === cat;
                  
                  return (
                    <button 
                      key={cat}
                      onClick={() => setSelectedCategory(cat as any)}
                      className={`
                        shrink-0 h-20 min-w-[90px] px-2 py-2 flex flex-col items-center justify-center gap-1
                        border-2 transition-all duration-200 group relative overflow-hidden
                        ${isActive 
                          ? 'bg-white border-accent text-accent shadow-[4px_4px_0px_0px_rgba(217,78,51,0.5)] -translate-y-1' 
                          : 'bg-transparent border-ink text-ink hover:bg-ink/5 hover:shadow-paper-sm'
                        }
                      `}
                    >
                      <span className="text-[9px] font-bold uppercase tracking-wider text-center leading-tight z-10">
                        {cat === 'ALL' ? 'Wszystkie' : cat}
                      </span>
                      <div className="flex items-center justify-center">
                        <Icon 
                          size={32}
                          strokeWidth={isActive ? 2 : 1.5} 
                          className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} 
                        />
                      </div>
                    </button>
                  );
                })}
              </nav>

              {/* Right Tools */}
              <div className={`flex items-center gap-2 transition-all duration-300 ${isSearchOpen ? 'flex-1' : ''}`}>
                
                {/* Search */}
                <div className={`flex items-center transition-all duration-300 relative ${isSearchOpen ? 'w-full' : 'w-auto'}`}>
                  {isSearchOpen ? (
                     <div className="relative w-full animate-in fade-in slide-in-from-right-4">
                       <input
                        autoFocus
                        type="text"
                        placeholder="Szukaj produktu..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-20 bg-paper/90 border-2 border-ink px-4 text-xl font-serif focus:outline-none placeholder:text-ink-light/30 shadow-paper"
                      />
                      <button 
                        onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-ink/10 rounded-full"
                      >
                        <X size={24} />
                      </button>
                     </div>
                  ) : (
                    <button 
                      onClick={() => setIsSearchOpen(true)}
                      className="h-20 w-20 flex flex-col items-center justify-center gap-1 bg-transparent border-2 border-ink hover:bg-ink/5 transition-all shadow-paper-sm relative overflow-hidden group"
                    >
                      <span className="text-[9px] font-bold uppercase z-10">Szukaj</span>
                      <Search size={32} strokeWidth={1.5} className="text-ink group-hover:scale-110 transition-transform" />
                    </button>
                  )}
                </div>

                {/* Location Button */}
                {!isSearchOpen && (
                  <button 
                    onClick={handleToggleLocation}
                    className={`h-20 w-20 flex flex-col items-center justify-center gap-1 border-2 transition-all shadow-paper-sm bg-transparent relative overflow-hidden group ${sortMode === 'DISTANCE' ? 'bg-accent text-white border-accent' : 'border-ink text-ink hover:bg-ink/5'}`}
                  >
                     <span className="text-[9px] font-bold uppercase text-center leading-none z-10">
                      {sortMode === 'DISTANCE' ? 'Blisko' : 'Mapa'}
                    </span>
                    <div className="flex items-center justify-center">
                      {isLocating ? (
                        <Loader2 size={32} className="animate-spin"/> 
                      ) : (
                        <Navigation 
                          size={32} 
                          strokeWidth={1.5} 
                          className={`group-hover:scale-110 transition-transform ${sortMode === 'DISTANCE' ? "fill-white text-white" : "text-ink"}`} 
                        />
                      )}
                    </div>
                  </button>
                )}
              </div>

            </div>
          </div>
          <div className="animate-in fade-in duration-500">
             
             {/* Loading State */}
             {isLoadingData && (
               <div className="flex justify-center py-12">
                 <Loader2 size={48} className="animate-spin text-ink-light" />
               </div>
             )}

             {!isLoadingData && sortMode === 'DISTANCE' && userLocation && (
               <div className="mb-4 text-xs font-serif italic text-ink-light flex items-center gap-2">
                 <Filter size={12} />
                 Filtrowanie po odległości: 
                 <select 
                    value={distanceFilter} 
                    onChange={(e) => setDistanceFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value) as any)}
                    className="ml-2 bg-transparent border-b border-ink font-bold focus:outline-none"
                 >
                   <option value="ALL">Wszystkie</option>
                   <option value="1">&lt; 1 km</option>
                   <option value="2">&lt; 2 km</option>
                   <option value="5">&lt; 5 km</option>
                   <option value="10">&lt; 10 km</option>
                 </select>
               </div>
             )}
            
            {!isLoadingData && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {processedProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    distance={product.distance}
                  />
                ))}
              </div>
            )}

            {!isLoadingData && processedProducts.length === 0 && (
              <div className="text-center py-12 text-ink-light font-serif bg-transparent border border-dashed border-ink/20 p-8">
                {searchQuery ? (
                  <>
                    <p className="text-lg font-bold mb-2">Nie znaleziono produktu "{searchQuery}"</p>
                    <p className="text-sm">Spróbuj wpisać inną nazwę.</p>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-bold mb-2">Brak produktów w gazetce.</p>
                    <p className="text-sm">Jesteś sklepem? Zaloguj się i dodaj pierwsze oferty!</p>
                  </>
                )}
              </div>
            )}
          </div>
        </>
    );
};

export default HomePage;