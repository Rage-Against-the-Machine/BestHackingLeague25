import React, { useState } from 'react';
import { Product, RecipeResponse } from '../types';
import { generateZeroWasteRecipe } from '../services/geminiService';
import { ChefHat, Loader2, X, UtensilsCrossed } from 'lucide-react';

interface RecipeGeneratorProps {
  selectedProducts: Product[];
  onClose: () => void;
}

const RecipeGenerator: React.FC<RecipeGeneratorProps> = ({ selectedProducts, onClose }) => {
  const [recipe, setRecipe] = useState<RecipeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateZeroWasteRecipe(selectedProducts);
      setRecipe(result);
    } catch (e) {
      setError("Nie udało się wygenerować przepisu. Sprawdź klucz API lub spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-trigger on mount if not generated yet
  React.useEffect(() => {
    if (!recipe && !loading && !error) {
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-paper w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-ink shadow-paper relative flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b-2 border-ink bg-highlight flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-accent p-2 rounded-full border-2 border-ink text-white">
              <ChefHat size={24} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-ink">Szef Kuchni Gemini</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-ink hover:text-white transition-colors border-2 border-transparent hover:border-ink rounded">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 flex-grow">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 size={48} className="animate-spin text-accent" />
              <p className="text-lg font-serif italic text-ink-light">Analizuję składniki i wymyślam coś pysznego...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 font-bold mb-4">{error}</p>
              <button 
                onClick={handleGenerate}
                className="px-6 py-2 bg-white border-2 border-ink shadow-paper hover:shadow-paper-hover hover:-translate-y-0.5 transition-all font-bold"
              >
                Spróbuj ponownie
              </button>
            </div>
          )}

          {recipe && !loading && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center border-b-2 border-double border-ink/20 pb-6">
                <span className="inline-block px-3 py-1 border border-ink rounded-full text-xs uppercase tracking-widest mb-3 bg-white">
                  {recipe.difficulty} • {recipe.cookingTime}
                </span>
                <h3 className="text-4xl font-serif font-bold text-ink mb-2">{recipe.title}</h3>
                <p className="text-ink-light italic text-sm">Specjalnie dla Twoich produktów: {selectedProducts.map(p => p.name).join(', ')}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Ingredients Column */}
                <div className="md:col-span-1 bg-white p-4 border border-ink shadow-paper-sm rotate-1">
                  <h4 className="font-serif font-bold text-xl mb-4 border-b-2 border-accent pb-1 inline-block">Składniki</h4>
                  <ul className="space-y-2 text-sm font-sans">
                    {recipe.ingredients.map((ing, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-accent">•</span>
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions Column */}
                <div className="md:col-span-2">
                   <h4 className="font-serif font-bold text-xl mb-4 border-b-2 border-accent pb-1 inline-block">Przygotowanie</h4>
                   <div className="space-y-4 font-serif leading-relaxed text-ink">
                     {recipe.instructions.map((step, idx) => (
                       <div key={idx} className="flex gap-4">
                         <span className="font-bold text-4xl text-ink/10 -mt-2 select-none">{idx + 1}</span>
                         <p>{step}</p>
                       </div>
                     ))}
                   </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-yellow-50 border border-dashed border-ink text-center text-sm text-ink-light">
                 <UtensilsCrossed size={16} className="inline mr-2" />
                 Smacznego! Pamiętaj, że ratując jedzenie, ratujesz planetę.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeGenerator;
