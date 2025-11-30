
import React, { useState, useEffect } from 'react';
import { Trophy, Star, TrendingUp, Loader2 } from 'lucide-react';
import { RankingEntry } from '../types';
import { rankingService } from '../services/rankingService';

const RankingView: React.FC = () => {
  const [rankingData, setRankingData] = useState<RankingEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const data = await rankingService.getRanking();
        setRankingData(data);
      } catch (error) {
        console.error("Failed to fetch ranking:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRanking();
  }, []);

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
          <div className="col-span-3 text-right">Uratowane</div>
          <div className="col-span-2 text-right">Wynik</div>
        </div>

        {/* List or Loader */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={48} className="animate-spin text-ink-light" />
          </div>
        ) : (
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
                  <div className="font-bold">{store.saved}</div>
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
        )}

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

