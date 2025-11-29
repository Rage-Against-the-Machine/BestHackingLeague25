
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, QrCode, History } from 'lucide-react';

const ClientPanelPage = () => {
    const { userName } = useAuth();

    return (
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-4">
                <div className="bg-paper border-2 border-ink p-6 shadow-paper text-center">
                    <div className="w-24 h-24 mx-auto bg-ink text-white rounded-full flex items-center justify-center mb-4 border-4 border-paper outline outline-2 outline-ink">
                        <User size={48} />
                    </div>
                    <h3 className="font-serif font-bold text-xl">{userName || 'Jan Kowalski'}</h3>
                    <p className="text-sm text-ink-light mb-4">Łowca Okazji</p>
                    
                    <div className="bg-white border border-ink p-4 mb-2">
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=USER-ID-${userName}`}
                            alt="Kod QR Użytkownika"
                            className="w-full h-auto"
                        />
                    </div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-ink/60 flex items-center justify-center gap-1">
                        <QrCode size={12} />
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
                    <History size={120} />
                </div>
                
                <h2 className="text-3xl font-serif font-bold mb-6 border-b-2 border-ink pb-4">Historia Uratowanych Produktów</h2>
                
                <div className="space-y-6">
                    {[
                        { date: '12 Paź 2023', items: ['Chleb Żytni', 'Jogurt Bio'], saved: 4.50 },
                        { date: '10 Paź 2023', items: ['Banany', 'Sok Pomarańczowy'], saved: 6.20 },
                    ].map((entry, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-dashed border-ink/30 pb-4">
                            <div>
                                <div className="font-bold text-lg mb-1">{entry.date}</div>
                                <div className="text-sm text-ink-light italic">{entry.items.join(', ')}</div>
                            </div>
                            <div className="mt-2 sm:mt-0 text-right">
                                <div className="text-xs uppercase tracking-widest text-ink-light">Oszczędzono</div>
                                <div className="text-xl font-serif font-bold text-green-700">{entry.saved.toFixed(2)} zł</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ClientPanelPage;
