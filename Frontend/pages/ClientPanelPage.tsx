import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, QrCode, Award } from 'lucide-react';
import QRCode from "react-qr-code";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { userService } from '../services/userService';
import { API_URL } from '../constants';

const ClientPanelPage = () => {
    const { userName } = useAuth();
    const [userPoints, setUserPoints] = useState<number | null>(null);
    const [qrCode, setQrCode] = useState<string>('');
    const qrCodeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (userName) {
                try {
                    const userData = await userService.getUser(userName);
                    setUserPoints(userData.points);
                    
                    const response = await fetch(`${API_URL}/generate-qr?username=${userName}`);
                    const qrData = await response.json();
                    setQrCode(qrData.code);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };

        fetchUserData();
    }, [userName]);

    const handlePrintQrCode = () => {
        if (qrCodeRef.current) {
            html2canvas(qrCodeRef.current, { scale: 4 }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const qrWidth = 60;
                const qrHeight = 60;
                const x = (pdfWidth - qrWidth) / 2;
                const y = (pdfHeight - qrHeight) / 2;
                pdf.addImage(imgData, 'PNG', x, y, qrWidth, qrHeight);
                pdf.save("kod-qr.pdf");
            });
        }
    };

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <div className="md:col-span-1 space-y-4">
                <div className="bg-paper border-2 border-ink p-6 shadow-paper text-center">
                    <div className="w-24 h-24 mx-auto bg-ink text-white rounded-full flex items-center justify-center mb-4 border-4 border-paper outline outline-2 outline-ink">
                        <User size={48} />
                    </div>
                    <h3 className="font-serif font-bold text-xl">{userName || 'Użytkownik'}</h3>
                    <p className="text-sm text-ink-light mb-4">Łowca Okazji</p>
                    
                    <div className="bg-white border border-ink p-4 mb-2">
                        {qrCode ? (
                            <div ref={qrCodeRef} style={{ width: 256, height: 256, margin: '0 auto' }}>
                                <QRCode
                                    size={256}
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                    value={qrCode}
                                    viewBox={`0 0 256 256`}
                                />
                            </div>
                        ) : (
                            <p>Ładowanie kodu QR...</p>
                        )}
                    </div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-ink/60 flex items-center justify-center gap-1">
                        <QrCode size={12} />
                        Zeskanuj przy kasie
                    </p>
                    <button 
                        onClick={handlePrintQrCode}
                        className="mt-4 bg-ink text-white font-bold py-2 px-4 rounded hover:bg-ink-light transition-colors"
                    >
                        Drukuj kod QR
                    </button>
                </div>
            </div>

            <div className="md:col-span-1 flex items-center justify-center">
                <div className="bg-accent text-white p-8 border-2 border-ink shadow-paper text-center">
                    <Award size={64} className="mx-auto mb-4" />
                    <h4 className="font-bold text-2xl mb-2">Twoje Punkty</h4>
                    <p className="text-5xl font-serif font-black">{userPoints !== null ? userPoints : '...'}</p>
                    <p className="text-sm opacity-80 mt-2">Zbieraj punkty i wymieniaj na nagrody!</p>
                </div>
            </div>
        </div>
    );
};

export default ClientPanelPage;
