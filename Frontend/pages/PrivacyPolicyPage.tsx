import React from 'react';

const PrivacyPolicyPage = () => {
    return (
        <div className="max-w-4xl mx-auto mt-8 p-8 bg-paper border-2 border-ink shadow-paper">
            <h1 className="text-4xl font-serif font-black text-ink mb-4">Polityka Prywatności</h1>
            <div className="space-y-4 text-ink-light">
                <p>Data wejścia w życie: 30 listopada 2025</p>
                
                <h2 className="text-2xl font-bold text-ink mt-6">1. Wprowadzenie</h2>
                <p>Witamy w Gazetka. Szanujemy Twoją prywatność i zobowiązujemy się do jej ochrony. Niniejsza Polityka Prywatności wyjaśnia, w jaki sposób zbieramy, używamy, ujawniamy i chronimy Twoje dane.</p>

                <h2 className="text-2xl font-bold text-ink mt-6">2. Jakie dane zbieramy</h2>
                <p>Możemy zbierać następujące rodzaje informacji:</p>
                <ul className="list-disc list-inside">
                    <li>Dane osobowe, takie jak imię i nazwisko, adres e-mail, które podajesz podczas rejestracji.</li>
                    <li>Dane dotyczące lokalizacji, jeśli wyrazisz na to zgodę, w celu świadczenia usług opartych na lokalizacji.</li>
                    <li>Dane dotyczące użytkowania, takie jak informacje o tym, jak korzystasz z naszej aplikacji.</li>
                </ul>

                <h2 className="text-2xl font-bold text-ink mt-6">3. Jak wykorzystujemy Twoje dane</h2>
                <p>Wykorzystujemy zebrane dane w celu:</p>
                <ul className="list-disc list-inside">
                    <li>Świadczenia i ulepszania naszych usług.</li>
                    <li>Personalizacji Twojego doświadczenia.</li>
                    <li>Komunikacji z Tobą w sprawach dotyczących Twojego konta lub naszych usług.</li>
                </ul>

                <h2 className="text-2xl font-bold text-ink mt-6">4. Udostępnianie danych</h2>
                <p>Nie sprzedajemy ani nie wynajmujemy Twoich danych osobowych stronom trzecim. Możemy udostępniać Twoje dane zaufanym partnerom, którzy pomagają nam w prowadzeniu naszej działalności, pod warunkiem, że zgodzą się oni na zachowanie poufności tych informacji.</p>

                <h2 className="text-2xl font-bold text-ink mt-6">5. Bezpieczeństwo danych</h2>
                <p>Stosujemy odpowiednie środki bezpieczeństwa w celu ochrony Twoich danych osobowych przed nieautoryzowanym dostępem, zmianą, ujawnieniem lub zniszczeniem.</p>

                <h2 className="text-2xl font-bold text-ink mt-6">6. Twoje prawa</h2>
                <p>Masz prawo do dostępu, poprawiania lub usuwania swoich danych osobowych. Możesz również w dowolnym momencie wycofać zgodę na przetwarzanie danych.</p>

                <h2 className="text-2xl font-bold text-ink mt-6">7. Zmiany w polityce prywatności</h2>
                <p>Możemy od czasu do czasu aktualizować naszą Politykę Prywatności. O wszelkich zmianach będziemy informować, publikując nową wersję na tej stronie.</p>

                <h2 className="text-2xl font-bold text-ink mt-6">8. Kontakt</h2>
                <p>Jeśli masz jakiekolwiek pytania dotyczące niniejszej Polityki Prywatności, skontaktuj się z nami pod adresem: kontakt@gazetka.app</p>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
