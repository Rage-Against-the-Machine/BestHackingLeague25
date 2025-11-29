import React, {useState, useMemo, useRef, useEffect} from 'react';
import {Product, ProductCategory, ViewMode} from './types';
import {productService} from './services/productService'; // Import Service
import ProductCard from './components/ProductCard';
import MapView from './components/MapView';
import StorePanel from './components/StorePanel';
import RankingView from './components/RankingView';
import AuthPanel from './components/AuthPanel';
import {
    ShoppingBag, User, LogOut, Map as MapIcon, ChevronDown,
    LayoutDashboard, History, Trophy, QrCode, Navigation, Loader2,
    Filter, ArrowLeft, Store, Search, X,
    Milk, Croissant, Apple, Beef, CupSoda, Utensils, Package, LayoutGrid
} from 'lucide-react';

type UserRole = 'GUEST' | 'CLIENT' | 'STORE';
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

// Icon Mapping
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

const App: React.FC = () => {
    const [userRole, setUserRole] = useState<UserRole>('GUEST');
    const [userName, setUserName] = useState<string>('');
    const [currentView, setCurrentView] = useState<ViewMode>('BROWSE');

    // Data State
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(false);

    // UI State
    const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'ALL'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Geolocation & Filtering states
    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [sortMode, setSortMode] = useState<SortMode>('DEFAULT');
    const [distanceFilter, setDistanceFilter] = useState<DistanceFilter>('ALL');
    const [isLocating, setIsLocating] = useState(false);

    // Store Selection for Map View
    const [selectedStoreName, setSelectedStoreName] = useState<string | null>(null);

    // --- Data Loading ---
    const fetchProducts = async () => {
        setIsLoadingData(true);
        try {
            const data = await productService.getAllProducts();
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setIsLoadingData(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);
    // --------------------

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Trigger geolocation automatically when switching to MAP view
    useEffect(() => {
        if (currentView === 'MAP' && !userLocation && !isLocating) {
            handleToggleLocation();
        }
    }, [currentView]);

    const handleToggleLocation = () => {
        if (sortMode === 'DISTANCE' && userLocation && currentView !== 'MAP') {
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
            setUserLocation({lat: 52.2297, lng: 21.0122});
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

        // 2. Filter by Specific Store (if in Store Details View)
        if (currentView === 'STORE_DETAILS' && selectedStoreName) {
            list = list.filter(p => p.storeName === selectedStoreName);
        }

        // 3. Filter by Category
        if (selectedCategory !== 'ALL') {
            list = list.filter(p => p.category === selectedCategory);
        }

        // 4. Map with Distance (if location exists)
        const listWithDistance = list.map(p => {
            let distance = null;
            if (userLocation && p.coordinates) {
                distance = calculateDistance(
                    userLocation.lat, userLocation.lng,
                    p.coordinates.lat, p.coordinates.lng
                );
            }
            return {...p, distance};
        });

        let result = listWithDistance;

        if (currentView !== 'STORE_DETAILS') {
            // 5. Filter by Distance Range
            if (sortMode === 'DISTANCE' && distanceFilter !== 'ALL') {
                result = result.filter(p => p.distance !== null && p.distance <= distanceFilter);
            }

            // 6. Sort by Distance (if active)
            if (sortMode === 'DISTANCE' && userLocation) {
                result.sort((a, b) => {
                    if (a.distance === null) return 1;
                    if (b.distance === null) return -1;
                    return (a.distance as number) - (b.distance as number);
                });
            }
        }

        return result;
    }, [selectedCategory, products, userLocation, sortMode, distanceFilter, currentView, selectedStoreName, searchQuery]);

    // --- CRUD Operations connected to Service ---

    const handleAddProduct = async (newProduct: Product) => {
        try {
            await productService.addProduct(newProduct);
            await fetchProducts();
        } catch (e) {
            console.error("Add failed", e);
        }
    };

    const handleUpdateProduct = async (updatedProduct: Product) => {
        try {
            await productService.updateProduct(updatedProduct);
            await fetchProducts();
        } catch (e) {
            console.error("Update failed", e);
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        try {
            await productService.deleteProduct(productId);
            await fetchProducts();
        } catch (e) {
            console.error("Delete failed", e);
            // Even if delete fails (e.g. not found), we refresh to sync state
            await fetchProducts();
        }
    };

    // ---------------------------------

    const handleAuthNavigation = () => {
        setCurrentView('AUTH');
        setIsMenuOpen(false);
    };

    const handleAuthSuccess = (role: 'CLIENT' | 'STORE', name: string) => {
        setUserRole(role);
        setUserName(name);
        setCurrentView(role === 'CLIENT' ? 'MAP' : 'PANEL');
    };

    const handleLogout = () => {
        setUserRole('GUEST');
        setUserName('');
        setCurrentView('BROWSE');
        setIsMenuOpen(false);
        setUserLocation(null);
    };

    const handleViewChange = (view: ViewMode) => {
        setCurrentView(view);
        setIsMenuOpen(false);
        if (view !== 'STORE_DETAILS') {
            setSelectedStoreName(null);
        }
    };

    const handleStoreSelect = (storeName: string) => {
        setSelectedStoreName(storeName);
        setSelectedCategory('ALL');
        setCurrentView('STORE_DETAILS');
    };

    const myStoreProducts = useMemo(() => {
        if (userRole !== 'STORE') return [];
        // Strictly filter products by the logged-in store name
        return products.filter(p => p.storeName === userName);
    }, [products, userRole, userName]);

    return (
        <div className="min-h-screen text-ink pb-12">

            {/* Header Area */}
            <header className="px-4 max-w-7xl mx-auto relative z-40 bg-transparent">

                {/* Top Bar: Title & User */}
                <div
                    className="flex justify-between items-end pt-6 pb-4 border-b-4 border-double border-ink bg-transparent transition-all">
                    <div className="flex flex-col md:flex-row items-end gap-4">
                        <div onClick={() => setCurrentView('BROWSE')} className="cursor-pointer">
                            <div
                                className="text-[10px] font-bold tracking-[0.4em] uppercase mb-1 text-ink-light pl-1">Magazyn
                                Zero Waste
                            </div>
                            <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tighter leading-none">
                                GAZETKA
                            </h1>
                        </div>

                        {/* Date & Location */}
                        <div className="hidden md:flex flex-col items-start font-sans border-l-2 border-ink pl-3 mb-1">
                            <span
                                className="font-bold text-sm first-letter:uppercase leading-none">{new Date().toLocaleDateString('pl-PL', {weekday: 'long'})}</span>
                            <span className="text-ink-light text-xs">{new Date().toLocaleDateString('pl-PL', {
                                day: 'numeric',
                                month: 'long'
                            })}</span>
                        </div>
                    </div>

                    {/* User Menu */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-2 bg-transparent border-2 border-ink px-3 py-1.5 hover:bg-ink/5 transition-all"
                        >
                            <User size={16}/>
                            <span className="font-bold text-xs uppercase tracking-wider hidden sm:inline">
                {userRole === 'GUEST' ? 'Konto' : userName || userRole}
              </span>
                            <ChevronDown size={14}
                                         className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}/>
                        </button>
                        {isMenuOpen && (
                            <div
                                className="absolute right-0 top-full mt-2 w-64 bg-paper border-2 border-ink shadow-paper p-4 z-50">
                                {userRole === 'GUEST' ? (
                                    <div className="space-y-3">
                                        <button onClick={() => handleViewChange('RANKING')}
                                                className="w-full text-left px-2 py-1 hover:bg-black/5 rounded flex items-center gap-2 font-serif border-b border-ink/10 pb-2">
                                            <Trophy size={16}/> Ranking Sklepów
                                        </button>
                                        <button onClick={handleAuthNavigation}
                                                className="w-full text-left px-3 py-2 bg-white border border-ink hover:bg-highlight text-sm font-bold flex items-center gap-2">
                                            <User size={16}/> Logowanie / Rejestracja
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <button onClick={() => handleViewChange('BROWSE')}
                                                className="w-full text-left px-2 py-1 hover:bg-black/5 rounded flex items-center gap-2 font-serif">
                                            <ShoppingBag size={16}/> Gazetka
                                        </button>
                                        <button onClick={() => handleViewChange('RANKING')}
                                                className="w-full text-left px-2 py-1 hover:bg-black/5 rounded flex items-center gap-2 font-serif">
                                            <Trophy size={16}/> Ranking Sklepów
                                        </button>
                                        <button onClick={() => handleViewChange('MAP')}
                                                className="w-full text-left px-2 py-1 hover:bg-black/5 rounded flex items-center gap-2 font-serif">
                                            <MapIcon size={16}/> Mapa Okazji
                                        </button>
                                        <button onClick={() => handleViewChange('PANEL')}
                                                className="w-full text-left px-2 py-1 hover:bg-black/5 rounded flex items-center gap-2 font-serif">{userRole === 'CLIENT' ?
                                            <User size={16}/> : <LayoutDashboard
                                                size={16}/>} {userRole === 'CLIENT' ? 'Moje Konto' : 'Panel Sklepu'}</button>
                                        <button onClick={handleLogout}
                                                className="w-full text-left px-2 py-1 text-red-600 hover:bg-red-50 rounded flex items-center gap-2 text-sm font-bold border-t border-ink/20 pt-2">
                                            <LogOut size={16}/> Wyloguj
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation Strip (STICKY) */}
                {(currentView === 'BROWSE' || currentView === 'STORE_DETAILS') && (
                    <div className="sticky top-0 z-30 pt-4 pb-2 bg-transparent transition-all duration-300 mt-4">
                        <div className="flex items-center gap-2 relative py-4">

                            {/* Categories */}
                            <nav
                                className={`flex-1 flex gap-2 overflow-x-auto no-scrollbar py-4 -my-4 transition-all duration-300 origin-left ${isSearchOpen ? 'w-0 opacity-0 scale-x-0 overflow-hidden' : 'w-full opacity-100 scale-x-100'}`}>
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
                            <div
                                className={`flex items-center gap-2 transition-all duration-300 ${isSearchOpen ? 'flex-1' : ''}`}>

                                {/* Search */}
                                <div
                                    className={`flex items-center transition-all duration-300 relative ${isSearchOpen ? 'w-full' : 'w-auto'}`}>
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
                                                onClick={() => {
                                                    setIsSearchOpen(false);
                                                    setSearchQuery('');
                                                }}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-ink/10 rounded-full"
                                            >
                                                <X size={24}/>
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setIsSearchOpen(true)}
                                            className="h-20 w-20 flex flex-col items-center justify-center gap-1 bg-transparent border-2 border-ink hover:bg-ink/5 transition-all shadow-paper-sm relative overflow-hidden group"
                                        >
                                            <span className="text-[9px] font-bold uppercase z-10">Szukaj</span>
                                            <Search size={32} strokeWidth={1.5}
                                                    className="text-ink group-hover:scale-110 transition-transform"/>
                                        </button>
                                    )}
                                </div>

                                {/* Location Button */}
                                {currentView === 'BROWSE' && !isSearchOpen && (
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
                )}

            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 mt-4">

                {/* VIEW: AUTH */}
                {currentView === 'AUTH' && (
                    <AuthPanel onLoginSuccess={handleAuthSuccess}/>
                )}

                {/* VIEW: BROWSE */}
                {currentView === 'BROWSE' && (
                    <div className="animate-in fade-in duration-500">

                        {/* Loading State */}
                        {isLoadingData && (
                            <div className="flex justify-center py-12">
                                <Loader2 size={48} className="animate-spin text-ink-light"/>
                            </div>
                        )}

                        {!isLoadingData && sortMode === 'DISTANCE' && userLocation && (
                            <div className="mb-4 text-xs font-serif italic text-ink-light flex items-center gap-2">
                                <Filter size={12}/>
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
                            <div
                                className="text-center py-12 text-ink-light font-serif bg-transparent border border-dashed border-ink/20 p-8">
                                {searchQuery ? (
                                    <>
                                        <p className="text-lg font-bold mb-2">Nie znaleziono produktu
                                            "{searchQuery}"</p>
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
                )}

                {/* VIEW: RANKING */}
                {currentView === 'RANKING' && (
                    <RankingView/>
                )}

                {/* VIEW: MAP */}
                {currentView === 'MAP' && (
                    <div className="animate-in fade-in zoom-in-95 duration-500">
                        <div className="bg-highlight p-2 border-l-4 border-ink mb-4 inline-block transform -rotate-1">
                            <h2 className="text-xl font-serif font-bold">Lokalizator Okazji</h2>
                        </div>
                        <p className="mb-2 text-sm text-ink-light">Kliknij na etykietę sklepu na mapie, aby zobaczyć
                            aktualne promocje w tym miejscu.</p>
                        <MapView
                            products={products}
                            userLocation={userLocation}
                            onSelectStore={handleStoreSelect}
                        />
                    </div>
                )}

                {/* VIEW: STORE DETAILS */}
                {currentView === 'STORE_DETAILS' && selectedStoreName && (
                    <div className="animate-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center gap-4 mb-6">
                            <button
                                onClick={() => setCurrentView('MAP')}
                                className="bg-transparent border-2 border-ink p-2 hover:bg-ink hover:text-white transition-colors"
                            >
                                <ArrowLeft size={24}/>
                            </button>
                            <div>
                                <h2 className="text-3xl font-serif font-bold text-ink flex items-center gap-2">
                                    <Store size={32}/>
                                    {selectedStoreName}
                                </h2>
                                <p className="text-ink-light italic">Wszystkie produkty w tej lokalizacji</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {processedProducts.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    distance={product.distance}
                                />
                            ))}
                        </div>
                        {processedProducts.length === 0 && (
                            <div className="p-8 text-center border-2 border-dashed border-ink/20">
                                <p>Brak aktualnych promocji w tym sklepie dla wybranej kategorii.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* VIEW: PANEL (Store or Client) */}
                {currentView === 'PANEL' && (
                    <div className="animate-in slide-in-from-bottom-4 duration-500">

                        {userRole === 'STORE' ? (
                            <StorePanel
                                storeName={userName}
                                products={myStoreProducts}
                                onAddProduct={handleAddProduct}
                                onUpdateProduct={handleUpdateProduct}
                                onDeleteProduct={handleDeleteProduct}
                            />
                        ) : (
                            // Client Panel
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="md:col-span-1 space-y-4">
                                    <div className="bg-paper border-2 border-ink p-6 shadow-paper text-center">
                                        <div
                                            className="w-24 h-24 mx-auto bg-ink text-white rounded-full flex items-center justify-center mb-4 border-4 border-paper outline outline-2 outline-ink">
                                            <User size={48}/>
                                        </div>
                                        <h3 className="font-serif font-bold text-xl">{userName || 'Jan Kowalski'}</h3>
                                        <p className="text-sm text-ink-light mb-4">Łowca Okazji</p>

                                        <div className="bg-white border border-ink p-4 mb-2">
                                            <img
                                                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=USER-ID-12345"
                                                alt="Kod QR Użytkownika"
                                                className="w-full h-auto"
                                            />
                                        </div>
                                        <p className="text-[10px] uppercase font-bold tracking-widest text-ink/60 flex items-center justify-center gap-1">
                                            <QrCode size={12}/>
                                            Zeskanuj przy kasie
                                        </p>
                                    </div>
                                    <div className="bg-accent text-white p-4 border-2 border-ink shadow-paper">
                                        <h4 className="font-bold text-lg mb-1">Twój Portfel</h4>
                                        <p className="text-3xl font-serif font-black">15.20 zł</p>
                                        <p className="text-xs opacity-80">Zaoszczędzone w tym miesiącu</p>
                                    </div>
                                </div>

                                <div className="md:col-span-2 bg-paper border-2 border-ink shadow-paper p-8 relative">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                        <History size={120}/>
                                    </div>

                                    <h2 className="text-3xl font-serif font-bold mb-6 border-b-2 border-ink pb-4">Historia
                                        Uratowanych Produktów</h2>

                                    <div className="space-y-6">
                                        {[
                                            {date: '12 Paź 2023', items: ['Chleb Żytni', 'Jogurt Bio'], saved: 4.50},
                                            {date: '10 Paź 2023', items: ['Banany', 'Sok Pomarańczowy'], saved: 6.20},
                                        ].map((entry, idx) => (
                                            <div key={idx}
                                                 className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-dashed border-ink/30 pb-4">
                                                <div>
                                                    <div className="font-bold text-lg mb-1">{entry.date}</div>
                                                    <div
                                                        className="text-sm text-ink-light italic">{entry.items.join(', ')}</div>
                                                </div>
                                                <div className="mt-2 sm:mt-0 text-right">
                                                    <div
                                                        className="text-xs uppercase tracking-widest text-ink-light">Oszczędzono
                                                    </div>
                                                    <div
                                                        className="text-xl font-serif font-bold text-green-700">{entry.saved.toFixed(2)} zł
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

            </main>
        </div>
    );
};

export default App;
