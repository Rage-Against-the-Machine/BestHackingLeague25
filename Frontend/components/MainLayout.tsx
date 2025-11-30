
import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import HomePage from '../pages/HomePage';
import MapPage from '../pages/MapPage';
import RankingPage from '../pages/RankingPage';
import AuthPage from '../pages/AuthPage';
import StorePanelPage from '../pages/StorePanelPage';
import ClientPanelPage from '../pages/ClientPanelPage';
import StoreDetailsPage from '../pages/StoreDetailsPage';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage';
import { useShoppingList } from '../contexts/ShoppingListContext';
import ShoppingListPanel from './ShoppingListPanel';
import { 
  ShoppingBasket, ShoppingBag, User, LogOut, Map as MapIcon, ChevronDown, 
  LayoutDashboard, Trophy
} from 'lucide-react';

const Header = () => {
    const { userRole, userName, logout } = useAuth();
    const { shoppingList, setIsOpen: setShoppingListOpen } = useShoppingList();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
  
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
  
    const handleLogout = () => {
      logout();
      setIsMenuOpen(false);
      navigate('/');
    };
  
    return (
      <header className="px-4 max-w-7xl mx-auto relative z-40 bg-transparent">
        <div className="flex justify-between items-end pt-6 pb-4 border-b-4 border-double border-ink bg-transparent transition-all">
          <div className="flex flex-col md:flex-row items-end gap-4">
            <Link to="/" className="cursor-pointer">
              <div className="text-[10px] font-bold tracking-[0.4em] uppercase mb-1 text-ink-light pl-1">Gazetka</div>
              <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tighter leading-none">
                GAZETKA
              </h1>
            </Link>
            <div className="hidden md:flex flex-col items-start font-sans border-l-2 border-ink pl-3 mb-1">
              <span className="font-bold text-sm first-letter:uppercase leading-none">{new Date().toLocaleDateString('pl-PL', { weekday: 'long' })}</span>
              <span className="text-ink-light text-xs">{new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' })}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShoppingListOpen(true)}
              className="flex items-center gap-2 bg-transparent border-2 border-ink px-3 py-1.5 hover:bg-ink/5 transition-all relative"
            >
              <ShoppingBasket size={16} />
              {shoppingList.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {shoppingList.reduce((acc, item) => acc + item.purchaseQuantity, 0)}
                </span>
              )}
            </button>
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 bg-transparent border-2 border-ink px-3 py-1.5 hover:bg-ink/5 transition-all"
              >
                <User size={16} />
                <span className="font-bold text-xs uppercase tracking-wider hidden sm:inline">
                  {userRole === 'GUEST' ? 'Konto' : userName || userRole}
                </span>
                <ChevronDown size={14} className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-paper border-2 border-ink shadow-paper p-4 z-50">
                  {userRole === 'GUEST' ? (
                    <div className="space-y-3">
                      <Link to="/ranking" onClick={() => setIsMenuOpen(false)} className="w-full text-left px-2 py-1 hover:bg-black/5 rounded flex items-center gap-2 font-serif border-b border-ink/10 pb-2"><Trophy size={16} /> Ranking Sklepów</Link>
                      <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="w-full text-left px-3 py-2 bg-white border border-ink hover:bg-highlight text-sm font-bold flex items-center gap-2"><User size={16} /> Logowanie / Rejestracja</Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link to="/" onClick={() => setIsMenuOpen(false)} className="w-full text-left px-2 py-1 hover:bg-black/5 rounded flex items-center gap-2 font-serif"><ShoppingBag size={16} /> Gazetka</Link>
                      <Link to="/ranking" onClick={() => setIsMenuOpen(false)} className="w-full text-left px-2 py-1 hover:bg-black/5 rounded flex items-center gap-2 font-serif"><Trophy size={16} /> Ranking Sklepów</Link>
                      <Link to="/map" onClick={() => setIsMenuOpen(false)} className="w-full text-left px-2 py-1 hover:bg-black/5 rounded flex items-center gap-2 font-serif"><MapIcon size={16} /> Mapa Okazji</Link>
                      <Link to={userRole === 'STORE' ? "/store-panel" : "/panel"} onClick={() => setIsMenuOpen(false)} className="w-full text-left px-2 py-1 hover:bg-black/5 rounded flex items-center gap-2 font-serif">{userRole === 'CLIENT' ? <User size={16} /> : <LayoutDashboard size={16} />} {userRole === 'CLIENT' ? 'Moje Konto' : 'Panel Sklepu'}</Link>
                      <button onClick={handleLogout} className="w-full text-left px-2 py-1 text-red-600 hover:bg-red-50 rounded flex items-center gap-2 text-sm font-bold border-t border-ink/20 pt-2"><LogOut size={16} /> Wyloguj</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    );
}

const MainLayout = () => {
    return (
        <div className="min-h-screen text-ink pb-12">
            <Header />
            <ShoppingListPanel />
            <main className="max-w-7xl mx-auto px-4 mt-4">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/map" element={<MapPage />} />
                    <Route path="/ranking" element={<RankingPage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/panel" element={<ClientPanelPage />} />
                    <Route path="/store-panel" element={<StorePanelPage />} />
                    <Route path="/store/:storeName" element={<StoreDetailsPage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                </Routes>
            </main>
        </div>
    )
}
export default MainLayout;
