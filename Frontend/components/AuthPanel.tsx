
import React, { useState } from 'react';
import { User, Store, ArrowRight, Lock, Mail, MapPin, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

type AuthMode = 'LOGIN' | 'REGISTER';
type Role = 'CLIENT' | 'STORE';

export const AuthPanel: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [role, setRole] = useState<Role>('CLIENT');
  const [error, setError] = useState<string | null>(null);

  const { login, register, isLoading } = useAuth();

  // Form States
  const [usernameOrName, setUsernameOrName] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // User name or Store name
  const [latitude, setLatitude] = useState(''); // Store latitude
  const [longitude, setLongitude] = useState(''); // Store longitude

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (mode === 'LOGIN') {
        await login(usernameOrName, password, role); // email is now treated as username for login
      } else {
        if (role === 'STORE') {
          await register(name, password, role, `${latitude},${longitude}`);
        } else {
          await register(name, password, role, undefined, email); // Pass email for client registration
        }
      }
    } catch (err: any) {
      setError(err.message || "Wystąpił błąd autoryzacji.");
    }
  };



  return (
    <div className="max-w-md mx-auto mt-8 animate-in slide-in-from-bottom-8 duration-500">
      
      {/* Paper Container */}
      <div className="bg-paper border-2 border-ink shadow-paper relative overflow-hidden">
        
        {/* Decorative Header Strip */}
        <div className="h-2 bg-ink w-full"></div>
        
        <div className="p-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-black text-ink mb-2">
              {mode === 'LOGIN' ? 'Witaj ponownie' : 'Dołącz do nas'}
            </h2>
            <p className="text-ink-light text-sm italic">
              {mode === 'LOGIN' 
                ? 'Zaloguj się, aby ratować żywność.' 
                : 'Utwórz konto i zacznij działać z Gazetką.'}
            </p>
          </div>

          {/* Mode Switcher (Login / Register) */}
          <div className="flex border-2 border-ink mb-6">
            <button 
              type="button"
              onClick={() => { setMode('LOGIN'); setError(null); }}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${mode === 'LOGIN' ? 'bg-ink text-paper' : 'bg-transparent text-ink hover:bg-ink/5'}`}
            >
              Logowanie
            </button>
            <button 
              type="button"
              onClick={() => { setMode('REGISTER'); setError(null); }}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${mode === 'REGISTER' ? 'bg-ink text-paper' : 'bg-transparent text-ink hover:bg-ink/5'}`}
            >
              Rejestracja
            </button>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2 font-bold animate-in fade-in">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Role Selection (Visible for Login) */}
            {mode === 'LOGIN' && (
                <div className="grid grid-cols-2 gap-4 mb-6 animate-in fade-in">
                <div 
                    onClick={() => setRole('CLIENT')}
                    className={`cursor-pointer border-2 p-4 flex flex-col items-center justify-center transition-all ${role === 'CLIENT' ? 'border-accent bg-white shadow-paper-sm -translate-y-1' : 'border-ink/20 text-ink-light hover:border-ink'}`}
                >
                    <User size={32} className={`mb-2 ${role === 'CLIENT' ? 'text-accent' : 'text-ink-light'}`} />
                    <span className={`text-xs font-bold uppercase ${role === 'CLIENT' ? 'text-accent' : ''}`}>Klient</span>
                </div>
                <div 
                    onClick={() => setRole('STORE')}
                    className={`cursor-pointer border-2 p-4 flex flex-col items-center justify-center transition-all ${role === 'STORE' ? 'border-accent bg-white shadow-paper-sm -translate-y-1' : 'border-ink/20 text-ink-light hover:border-ink'}`}
                >
                    <Store size={32} className={`mb-2 ${role === 'STORE' ? 'text-accent' : 'text-ink-light'}`} />
                    <span className={`text-xs font-bold uppercase ${role === 'STORE' ? 'text-accent' : ''}`}>Sklep</span>
                </div>
                </div>
            )}
            
            {/* Role Selection (Visible for Register) */}
            {mode === 'REGISTER' && (
                <div className="grid grid-cols-2 gap-4 mb-6 animate-in fade-in">
                <div 
                    onClick={() => setRole('CLIENT')}
                    className={`cursor-pointer border-2 p-4 flex flex-col items-center justify-center transition-all ${role === 'CLIENT' ? 'border-accent bg-white shadow-paper-sm -translate-y-1' : 'border-ink/20 text-ink-light hover:border-ink'}`}
                >
                    <User size={32} className={`mb-2 ${role === 'CLIENT' ? 'text-accent' : 'text-ink-light'}`} />
                    <span className={`text-xs font-bold uppercase ${role === 'CLIENT' ? 'text-accent' : ''}`}>Klient</span>
                </div>
                <div 
                    onClick={() => setRole('STORE')}
                    className={`cursor-pointer border-2 p-4 flex flex-col items-center justify-center transition-all ${role === 'STORE' ? 'border-accent bg-white shadow-paper-sm -translate-y-1' : 'border-ink/20 text-ink-light hover:border-ink'}`}
                >
                    <Store size={32} className={`mb-2 ${role === 'STORE' ? 'text-accent' : 'text-ink-light'}`} />
                    <span className={`text-xs font-bold uppercase ${role === 'STORE' ? 'text-accent' : ''}`}>Sklep</span>
                </div>
                </div>
            )}

            {/* Dynamic Fields based on Mode/Role */}
            {mode === 'REGISTER' && (
              <div className="animate-in fade-in slide-in-from-top-2">
                 <div className="relative mb-4">
                  <div className="absolute left-3 top-3 text-ink-light"><User size={20} /></div>
                  <input 
                    type="text" 
                    placeholder={role === 'CLIENT' ? "Nazwa Użytkownika" : "Nazwa Sklepu"}
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-ink p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-accent font-sans"
                  />
                </div>
                {role === 'STORE' && (
                   <>
                   <div className="relative mb-4">
                    <div className="absolute left-3 top-3 text-ink-light"><MapPin size={20} /></div>
                    <input 
                      type="number" 
                      placeholder="Szerokość geograficzna (np. 52.2)"
                      required
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      className="w-full bg-white border border-ink p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-accent font-sans"
                    />
                  </div>
                  <div className="relative mb-4">
                    <div className="absolute left-3 top-3 text-ink-light"><MapPin size={20} /></div>
                    <input 
                      type="number" 
                      placeholder="Długość geograficzna (np. 21.0)"
                      required
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      className="w-full bg-white border border-ink p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-accent font-sans"
                    />
                  </div>
                  </>
                )}
              </div>
            )}

            {/* Standard Fields */}
            {(mode === 'LOGIN' || (mode === 'REGISTER' && role === 'CLIENT')) && (
              <div className="relative">
                <div className="absolute left-3 top-3 text-ink-light"><User size={20} /></div> {/* Changed Mail to User icon */}
                <input 
                  type="text" // Changed type to text
                  placeholder={
                    mode === 'LOGIN' 
                      ? (role === 'CLIENT' ? "Nazwa Użytkownika" : "Nazwa Sklepu") 
                      : "Adres E-mail" // Keep email for client registration as it is for now
                  }
                  required
                  value={usernameOrName} // Changed value
                  onChange={(e) => setUsernameOrName(e.target.value)} // Changed onChange
                  className="w-full bg-white border border-ink p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-accent font-sans"
                />
              </div>
            )}

            <div className="relative">
              <div className="absolute left-3 top-3 text-ink-light"><Lock size={20} /></div>
              <input 
                type="password" 
                placeholder="Hasło"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-ink p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-accent font-sans"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-ink text-white py-4 mt-6 font-bold uppercase tracking-widest hover:bg-accent transition-colors flex items-center justify-center gap-2 shadow-paper hover:shadow-paper-hover hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Przetwarzanie...' : (
                <>
                  {mode === 'LOGIN' ? 'Zaloguj się' : 'Zarejestruj się'}
                  <ArrowRight size={20} />
                </>
              )}
            </button>

          </form>



        </div>
        
        {/* Footer info */}
        <div className="bg-highlight p-4 text-center border-t border-ink text-xs text-ink-light">
          Zapoznaj się z naszą <Link to="/privacy-policy" className="underline">polityką prywatności</Link>.
        </div>

      </div>
    </div>
  );
};


