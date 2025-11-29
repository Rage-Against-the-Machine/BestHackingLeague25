
import React from 'react';
import { Trophy, Star, TrendingUp } from 'lucide-react';

const RankingView: React.FC = () => {
  const rankingData = [
    { id: 1, name: 'Biedronka', location: 'ul. Marszałkowska 10', score: 98, saved: 1240 },
    { id: 2, name: 'Lidl', location: 'Al. Jerozolimskie 50', score: 95, saved: 980 },
    { id: 3, name: 'Lokalny Warzywniak', location: 'Rynek Główny 5', score: 92, saved: 450 },
    { id: 4, name: 'Carrefour', location: 'Złote Tarasy', score: 88, saved: 760 },
    { id: 5, name: 'Żabka', location: 'ul. Poznańska 3', score: 85, saved: 320 },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-4 animate-in slide-in-from-bottom-4 duration-500">
      
      <div className="bg-paper border-2 border-ink shadow-paper p-8 relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-accent text-white border-2 border-ink rounded-full mb-4 shadow-sm">
            <Trophy size={32} />
          </div>
          <h2 className="text-4xl font-serif font-black text-ink mb-2">Ranking Sklepów</h2>
          <p className="text-ink-light italic">Najlepsi ratownicy żywności w tym miesiącu</p>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 border-b-2 border-ink pb-2 text-xs font-bold uppercase tracking-widest text-ink-light mb-4 px-2">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-6">Sklep</div>
          <div className="col-span-3 text-right">Uratowane KG</div>
          <div className="col-span-2 text-right">Wynik</div>
        </div>

        {/* List */}
        <div className="space-y-3">
          {rankingData.map((store, index) => (
            <div key={store.id} className="grid grid-cols-12 gap-4 items-center p-3 border border-ink/10 hover:border-ink hover:bg-white transition-all group">
              
              {/* Rank */}
              <div className="col-span-1 text-center font-serif font-black text-2xl text-ink/20 group-hover:text-accent transition-colors">
                {index + 1}
              </div>

              {/* Store Info */}
              <div className="col-span-6">
                <div className="font-bold text-lg leading-none mb-1">{store.name}</div>
                <div className="text-xs text-ink-light flex items-center gap-1">
                   <MapPinIcon size={10} /> {store.location}
                </div>
              </div>

              {/* Stats */}
              <div className="col-span-3 text-right font-sans">
                <div className="font-bold">{store.saved} kg</div>
              </div>

              {/* Score */}
              <div className="col-span-2 text-right">
                <div className="inline-flex items-center gap-1 bg-ink text-paper px-2 py-1 text-sm font-bold">
                  <Star size={12} className="fill-current" />
                  {store.score}
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-4 border-t border-dashed border-ink/30 text-center text-xs text-ink-light flex items-center justify-center gap-2">
          <TrendingUp size={14} />
          Dane aktualizowane są raz dziennie na podstawie aktywności użytkowników.
        </div>
      </div>
    </div>
  );
};

// Helper icon
const MapPinIcon = ({ size }: { size: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

export default RankingView;
