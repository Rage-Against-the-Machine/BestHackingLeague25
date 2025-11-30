# Aplikacja Frontendowa - BestHackingLeague25

To jest aplikacja frontendowa oparta na React, zbudowana z wykorzystaniem Vite i TypeScript. Została zaprojektowana w sposób modułowy i łatwy w utrzymaniu, z wyraźnym podziałem odpowiedzialności między poszczególnymi częściami.

## Użyte Technologie

*   **React**: Popularna biblioteka JavaScript do budowania interfejsów użytkownika. Pozwala na tworzenie interaktywnych i dynamicznych komponentów UI.
*   **Vite**: Nowoczesne narzędzie do budowania, które zapewnia błyskawiczny serwer deweloperski i optymalizuje kod do produkcji, co znacznie przyspiesza proces tworzenia aplikacji.
*   **TypeScript**: Nadzbiór JavaScriptu, który dodaje statyczne typowanie. Poprawia to jakość kodu, ułatwia jego refaktoryzację i wykrywanie błędów już na etapie pisania kodu.
*   **React Router DOM**: Biblioteka służąca do zarządzania routingiem (nawigacją) w aplikacji jednostronicowej (SPA). Pozwala na definiowanie ścieżek URL i renderowanie odpowiednich komponentów na podstawie bieżącego adresu.
*   **Context API**: Wbudowane w Reacta narzędzie do globalnego zarządzania stanem. Używane do udostępniania danych (np. danych uwierzytelniających użytkownika, listy produktów, listy zakupów) wielu komponentom bez konieczności przekazywania ich przez drzewo komponentów za pomocą `props`.
*   **Tailwind CSS**: Framework CSS, który dostarcza zestaw klas narzędziowych, pozwalających na szybkie i elastyczne stylowanie interfejsu użytkownika bezpośrednio w kodzie HTML/JSX.
*   **Leaflet**: Lekka biblioteka JavaScript do tworzenia interaktywnych map internetowych.
*   **Vitest**: Szybki framework do testowania jednostkowego i komponentowego, zaprojektowany z myślą o integracji z Vite.
*   **React Testing Library**: Zestaw narzędzi do testowania komponentów React, który promuje testowanie w sposób zbliżony do interakcji użytkownika z aplikacją.

## Struktura Aplikacji

-   `public/`: Ten katalog zawiera statyczne zasoby, które są serwowane bezpośrednio, takie jak `favicon.ico` (ikona strony).
-   `src/assets/`: Przechowuje zasoby specyficzne dla aplikacji, takie jak niestandardowe czcionki czy inne pliki multimedialne.
-   `src/components/`: Zawiera wielokrotnego użytku komponenty interfejsu użytkownika, które mogą być używane na różnych stronach aplikacji (np. `AuthPanel` do uwierzytelniania, `GazetkaCard` do wyświetlania ofert, `MainLayout` do ogólnego układu strony).
-   `src/contexts/`: Znajdują się tutaj dostawcy Context API, którzy zarządzają globalnym stanem aplikacji. Przykłady to `AuthContext` (stan uwierzytelnienia), `ProductContext` (dane o produktach) i `ShoppingListContext` (lista zakupów).
-   `src/pages/`: Ten katalog zawiera główne widoki i trasy aplikacji, odpowiadające poszczególnym stronom (np. `HomePage` to strona główna, `MapPage` wyświetla mapę, `StorePanelPage` to panel dla sklepów).
-   `src/services/`: Moduły odpowiedzialne za komunikację z zewnętrznymi API backendu. Oddziela logikę biznesową od warstwy prezentacji, np. `productService` do operacji na produktach, `userService` do zarządzania użytkownikami.
-   `src/types.ts`: Plik zawierający definicje typów TypeScript, które zapewniają spójność danych w całej aplikacji.
-   `vite.config.ts`: Plik konfiguracyjny dla Vite, zawierający ustawienia serwera deweloperskiego (np. proxy), integrację z wtyczkami (np. React) oraz konfigurację Vitest do testowania.
-   `package.json`: Plik manifestu projektu, który zawiera listę wszystkich zależności (bibliotek) oraz skrypty do uruchamiania różnych zadań (np. uruchamianie serwera deweloperskiego, budowanie aplikacji, uruchamianie testów).
-   `index.html`: Główny plik HTML aplikacji, do którego wstrzykiwany jest kod React.

## Rozpoczęcie Pracy

Aby uruchomić aplikację lokalnie, wykonaj następujące kroki:

1.  **Zainstaluj zależności:**
    ```bash
    npm install
    ```
    Ta komenda pobierze wszystkie biblioteki i pakiety potrzebne do działania projektu.

2.  **Uruchom serwer deweloperski:**
    ```bash
    npm run dev
    ```
    Spowoduje to uruchomienie serwera, który automatycznie odświeża aplikację podczas zmian w kodzie. Aplikacja będzie dostępna pod adresem `http://localhost:3000` (lub innym wskazanym w konsoli).

3.  **Uruchom testy:**
    ```bash
    npm test
    ```
    Ta komenda uruchomi wszystkie zdefiniowane testy jednostkowe i komponentowe, aby sprawdzić poprawność działania aplikacji.

