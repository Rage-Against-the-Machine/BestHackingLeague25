
import React from 'react';
import { Product } from '../types';
import { Clock, MapPin, Store, Navigation, Hash } from 'lucide-react';

interface GazetkaCardProps {
  product: Product;
  distance?: number | null;
}

const GazetkaCard: React.FC<GazetkaCardProps> = ({ product, distance }) => {
  const expiry = new Date(product.expiryDate);
  const now = new Date();
  
  // Calculate difference in milliseconds
  const diffTime = expiry.getTime() - now.getTime();
  // Calculate hours for urgency logic
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  // Calculate days rounded up for display (e.g. 1.5 days -> 2 days left)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let urgencyColor = 'text-ink-light';
  let relativeDateText = '';

  // Logic for human-readable relative time
  if (diffHours < 0) {
     relativeDateText = 'Termin minął';
     urgencyColor = 'text-red-800 font-black';
  } else if (diffHours < 24) {
     relativeDateText = 'Tylko do dzisiaj';
     urgencyColor = 'text-red-600 font-bold';
  } else if (diffHours < 48) {
     relativeDateText = 'Do jutra';
     urgencyColor = 'text-orange-600 font-bold';
  } else {
     relativeDateText = `Jeszcze ${diffDays} dni`;
     urgencyColor = 'text-green-700 font-medium';
  }

  return (
    <div className="bg-paper border-b-2 border-r-2 border-ink p-4 relative hover:-translate-y-1 transition-transform duration-200 shadow-sm hover:shadow-paper group">
      
      {/* Newspaper Column Layout */}
      <div className="flex gap-4">
        
        {/* Left Column: Text Content */}
        <div className="flex-1">
          {/* Category Tag */}
          <span className="inline-block border-b border-ink/30 text-[10px] uppercase tracking-widest text-ink-light mb-1">
            {product.category}
          </span>

          {/* Title */}
          <h3 className="text-xl font-serif font-bold leading-tight text-ink mb-2">
            {product.name}
          </h3>

          {/* Price Block */}
          <div className="flex items-baseline gap-2 mb-3">
             <span className="text-2xl font-serif font-black text-accent">
              {product.discountPrice.toFixed(2)} zł
            </span>
            <span className="text-sm text-ink-light line-through decoration-1">
              {product.originalPrice.toFixed(2)} zł
            </span>
          </div>

          {/* Metadata */}
          <div className="space-y-1 text-xs font-sans text-ink-light border-l-2 border-ink/10 pl-2">
            <div className="flex items-center gap-1">
               <Store size={12} />
               <span className="font-bold text-ink uppercase">{product.storeName}</span>
            </div>
            
            <div className="flex items-center gap-1">
               <MapPin size={12} />
               <span className="truncate max-w-[120px]">{product.storeLocation}</span>
            </div>

            {/* Distance Indicator */}
            {distance !== undefined && distance !== null && (
              <div className="flex items-center gap-1 text-accent font-bold animate-in fade-in">
                 <Navigation size={12} className="fill-current" />
                 <span>{distance < 1 ? `${(distance * 1000).toFixed(0)} m` : `${distance.toFixed(1)} km`} stąd</span>
              </div>
            )}

             <div className="flex items-center gap-1 pt-1">
               <Clock size={12} className={urgencyColor} />
               <span className={`${urgencyColor} uppercase tracking-wide text-[10px]`}>
                 {relativeDateText}
               </span>
            </div>
            {product.quantity && (
              <div className="flex items-center gap-1">
                <Hash size={12} />
                <span className="uppercase tracking-wide text-[10px] font-bold">
                  {product.quantity} szt.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Stamp Image */}
        <div className="w-24 shrink-0 flex flex-col gap-2">
          <div className="aspect-square w-full border-2 border-ink p-1 bg-white rotate-2 shadow-sm group-hover:rotate-0 transition-all duration-300">
                          <img
                            src={product.imageUrl || undefined}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />          </div>
          <div className="text-center">
             <span className="bg-ink text-paper text-xs font-bold px-1 py-0.5">
               -{product.discountPercentage}%
             </span>
          </div>
        </div>

      </div>
    </div>
  );
};


export default GazetkaCard;
