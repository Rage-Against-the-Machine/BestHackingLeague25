
import React from 'react';
import { useShoppingList } from '../contexts/ShoppingListContext';
import { ShoppingBasket, X, Trash2, Plus, Minus, FileDown } from 'lucide-react';
import jsPDF from 'jspdf';

const ShoppingListPanel = () => {
    const { isOpen, setIsOpen, shoppingList, updateProductQuantity, removeProduct, clearList } = useShoppingList();

    const handleGeneratePdf = () => {
        const doc = new jsPDF();
        doc.setFont("helvetica", "bold");
        doc.text("Lista Zakupów", 20, 20);
        doc.setFont("helvetica", "normal");
        
        let y = 30;
        shoppingList.forEach((item, index) => {
            const line = `${index + 1}. ${item.name} - Ilość: ${item.purchaseQuantity}`;
            doc.text(line, 20, y);
            y += 10;
        });

        doc.save('lista-zakupow.pdf');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)}>
            <div 
                className="fixed top-0 right-0 h-full w-full max-w-md bg-paper border-l-2 border-ink shadow-2xl z-50 flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b-2 border-ink">
                    <h2 className="text-2xl font-serif font-bold flex items-center gap-2">
                        <ShoppingBasket size={24} />
                        Lista Zakupów
                    </h2>
                    <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-ink/10 rounded-full">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-grow p-4 overflow-y-auto">
                    {shoppingList.length === 0 ? (
                        <p className="text-center text-ink-light mt-8">Twoja lista jest pusta.</p>
                    ) : (
                        <div className="space-y-4">
                            {shoppingList.map(item => (
                                <div key={item.id} className="flex items-center justify-between p-2 border-b border-ink/20">
                                    <div className="flex-grow pr-2">
                                        <p className="font-bold">{item.name}</p>
                                        <p className="text-sm font-serif font-bold text-accent">{(item.discountPrice ?? 0).toFixed(2)} zł</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => updateProductQuantity(item.id, item.purchaseQuantity - 1)} className="p-1 border-2 border-ink rounded-full w-8 h-8 flex items-center justify-center hover:bg-ink/10 transition-colors">
                                            <Minus size={16} />
                                        </button>
                                        <span className="font-bold w-8 text-center">{item.purchaseQuantity}</span>
                                        <button onClick={() => updateProductQuantity(item.id, item.purchaseQuantity + 1)} className="p-1 border-2 border-ink rounded-full w-8 h-8 flex items-center justify-center hover:bg-ink/10 transition-colors">
                                            <Plus size={16} />
                                        </button>
                                        <button onClick={() => removeProduct(item.id)} className="text-red-600 p-1 hover:bg-red-50 rounded-full">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {shoppingList.length > 0 && (
                    <div className="p-4 border-t-2 border-ink space-y-2">
                         <button 
                            onClick={handleGeneratePdf}
                            className="w-full bg-ink text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-ink/80 transition-colors shadow-paper"
                        >
                            <FileDown size={18} />
                            Pobierz jako PDF
                        </button>
                        <button 
                            onClick={clearList}
                            className="w-full bg-transparent text-red-600 font-bold py-2 px-4 rounded-lg border-2 border-red-600 hover:bg-red-50 transition-colors"
                        >
                            Wyczyść listę
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShoppingListPanel;
