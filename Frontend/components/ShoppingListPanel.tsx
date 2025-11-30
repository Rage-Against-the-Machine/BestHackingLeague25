
import React from 'react';
import { useShoppingList } from '../contexts/ShoppingListContext';
import { ShoppingBasket, X, Trash2, Plus, Minus, FileDown, Mail } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ShoppingListPanel = () => {
    const { isOpen, setIsOpen, shoppingList, updateProductQuantity, removeProduct, clearList } = useShoppingList();

    const handleGeneratePdf = () => {
        const doc = new jsPDF();
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.text("Lista Zakupów", 105, 20, { align: 'center' });
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Data: ${new Date().toLocaleDateString('pl-PL')}`, 105, 26, { align: 'center' });

        const tableColumn = ["Lp.", "Nazwa Produktu", "Ilość", "Cena jedn.", "Suma"];
        const tableRows: any[] = [];
        let totalSum = 0;

        shoppingList.forEach((item, index) => {
            const itemSum = (item.discountPrice ?? 0) * item.purchaseQuantity;
            totalSum += itemSum;
            const productData = [
                index + 1,
                item.name,
                item.purchaseQuantity,
                `${(item.discountPrice ?? 0).toFixed(2)} zł`,
                `${itemSum.toFixed(2)} zł`
            ];
            tableRows.push(productData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 35,
            theme: 'grid',
            headStyles: {
                fillColor: [41, 41, 41],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
            },
            styles: {
                font: 'helvetica',
                cellPadding: 3,
            },
        });

        const finalY = (doc as any).lastAutoTable.finalY || 80;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`Łączna kwota: ${totalSum.toFixed(2)} zł`, 105, finalY + 15, { align: 'center' });

        doc.save('lista-zakupow.pdf');
    };

    const handleSendEmail = () => {
        const subject = `Lista Zakupów - ${new Date().toLocaleDateString('pl-PL')}`;
        let body = "Cześć,\n\nOto Twoja lista zakupów:\n\n";
        body += "-----------------------------------\n";
        let totalSum = 0;

        shoppingList.forEach((item, index) => {
            const itemSum = (item.discountPrice ?? 0) * item.purchaseQuantity;
            totalSum += itemSum;
            body += `${index + 1}. ${item.name}\n`;
            body += `   Ilość: ${item.purchaseQuantity}\n`;
            body += `   Cena: ${(item.discountPrice ?? 0).toFixed(2)} zł\n`;
            body += `   Suma: ${itemSum.toFixed(2)} zł\n`;
            body += "-----------------------------------\n";
        });

        body += `\nŁĄCZNIE: ${totalSum.toFixed(2)} zł\n\n`;
        body += "Miłych zakupów!\n";

        const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
    };
		
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)}>
            <div 
                className="fixed top-0 right-0 h-full w-full max-w-md bg-paper border-l-4 border-ink shadow-2xl z-50 flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* ... (header and list items JSX) */}
                <div className="flex justify-between items-center p-4 border-b-4 border-double border-ink">
                    <h2 className="text-2xl font-serif font-bold flex items-center gap-2">
                        <ShoppingBasket size={24} />
                        Lista Zakupów
                    </h2>
                    <button onClick={() => setIsOpen(false)} className="p-2 border-2 border-ink hover:bg-ink/10">
                        <X size={24} />
                    </button>
                </div>
                <div className="flex-grow p-4 overflow-y-auto">
                    {shoppingList.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-ink-light">
                            <ShoppingBasket size={64} className="mb-4" />
                            <p className="font-serif font-bold text-lg">Twoja lista jest pusta</p>
                            <p className="text-sm">Dodaj produkty ze sklepu, aby je tu zobaczyć.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {shoppingList.map(item => (
                                <div key={item.id} className="flex items-center justify-between p-3 border-2 border-ink bg-white shadow-sm">
                                    <div className="flex-grow pr-2">
                                        <p className="font-bold font-serif text-lg">{item.name}</p>
                                        <p className="text-sm font-bold text-accent">{(item.discountPrice ?? 0).toFixed(2)} zł</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => updateProductQuantity(item.id, item.purchaseQuantity - 1)} className="p-1 border-2 border-ink w-8 h-8 flex items-center justify-center hover:bg-ink/10 transition-colors">
                                            <Minus size={16} />
                                        </button>
                                        <span className="font-bold font-serif text-lg w-8 text-center">{item.purchaseQuantity}</span>
                                        <button onClick={() => updateProductQuantity(item.id, item.purchaseQuantity + 1)} className="p-1 border-2 border-ink w-8 h-8 flex items-center justify-center hover:bg-ink/10 transition-colors">
                                            <Plus size={16} />
                                        </button>
                                        <button onClick={() => removeProduct(item.id)} className="text-red-600 p-1 hover:bg-red-50 ml-2">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {shoppingList.length > 0 && (
                    <div className="p-4 border-t-4 border-double border-ink space-y-4 bg-paper">
                        <div className="p-3 border-2 border-dashed border-ink/20">
                            <div className="flex justify-between items-center font-serif">
                                <span className="text-ink-light">Łączny koszt:</span>
                                <span className="font-bold text-xl text-accent">
                                    {shoppingList.reduce((acc, item) => acc + (item.discountPrice ?? 0) * item.purchaseQuantity, 0).toFixed(2)} zł
                                </span>
                            </div>
                            <div className="flex justify-between items-center font-serif mt-1">
                                <span className="text-green-700">Oszczędzasz:</span>
                                <span className="font-bold text-lg text-green-700">
                                    {shoppingList.reduce((acc, item) => acc + ((item.originalPrice ?? 0) - (item.discountPrice ?? 0)) * item.purchaseQuantity, 0).toFixed(2)} zł
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={handleGeneratePdf}
                                className="w-full bg-ink text-white font-bold py-2.5 px-4 flex items-center justify-center gap-2 hover:bg-ink/80 transition-colors shadow-paper border-2 border-ink"
                            >
                                <FileDown size={18} />
                                PDF
                            </button>
                            <button 
                                onClick={handleSendEmail}
                                className="w-full bg-ink text-white font-bold py-2.5 px-4 flex items-center justify-center gap-2 hover:bg-ink/80 transition-colors shadow-paper border-2 border-ink"
                            >
                                <Mail size={18} />
                                E-mail
                            </button>
                        </div>
                        <button 
                            onClick={clearList}
                            className="w-full bg-paper text-red-600 font-bold py-2 px-4 border-2 border-red-500 hover:bg-red-50 transition-colors"
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
