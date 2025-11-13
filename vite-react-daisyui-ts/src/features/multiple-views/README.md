# Multiple Views Feature

## Opis

Feature `multiple-views` umożliwia wyświetlanie wielu widoków/aplikacji jednocześnie w układzie grid. Każdy widok jest izolowany w osobnym iframe, co pozwala na:

- **Testowanie multiplayer** - uruchamianie wielu instancji tej samej aplikacji
- **Gry Phaser** - testowanie wielu instancji gier Phaser jednocześnie
- **React aplikacje** - izolowane instancje React aplikacji
- **Responsywny grid** - dynamiczna zmiana liczby kolumn i widoków

## Struktura

```
src/features/multiple-views/
├── MultiViewGrid.tsx           # Główny komponent
├── components/
│   ├── ViewContainer.tsx       # Kontener dla pojedynczego widoku
│   ├── ControlPanel.tsx        # Panel kontrolny (input, suwaki, przyciski)
│   └── DebugPanel.tsx          # Panel debugowania
├── types/
│   └── view.types.ts           # Definicje typów TypeScript
├── index.ts                    # Eksporty publiczne
└── README.md                   # Ta dokumentacja
```

## Użycie

### Podstawowe użycie

```tsx
import { MultiViewGrid } from '@/features/multiple-views';

export const MyPage = () => {
  return <MultiViewGrid />;
};
```

### Komponenty

#### MultiViewGrid
Główny komponent zarządzający wszystkimi widokami.

**Props:** Brak - komponent zarządza stanem wewnętrznie

**Funkcjonalność:**
- Zarządzanie listą widoków
- Kontrola liczby widoków i kolumn grid
- Obsługa operacji na widokach (dodaj, usuń, przeładuj, duplikuj)

#### ViewContainer
Kontener dla pojedynczego widoku z iframe.

**Props:**
```typescript
interface ViewContainerProps {
  view: ViewInstance;
  onRemove: (id: string) => void;
  onReload: (id: string) => void;
  onDuplicate: (id: string) => void;
}
```

**Funkcjonalność:**
- Wyświetlanie iframe z zawartością
- Obsługa ładowania i błędów
- Przyciski do zarządzania widokiem (przeładuj, duplikuj, usuń, otwórz w nowej karcie)

#### ControlPanel
Panel kontrolny z inputami i suwakami.

**Funkcjonalność:**
- Input do podania URL/ścieżki
- Suwak do kontroli liczby widoków (1-12)
- Suwak do kontroli kolumn grid (1-4)
- Przyciski akcji (Run, Dodaj widok, Wyczyść wszystko, Debug)

#### DebugPanel
Panel do debugowania i inspekcji widoków.

**Funkcjonalność:**
- Wyświetlanie listy wszystkich widoków
- Wyświetlanie JSON danych każdego widoku
- Kopiowanie danych do schowka

## Typy

```typescript
interface ViewInstance {
  id: string;                    // Unikalny identyfikator
  url: string;                   // URL lub ścieżka do strony
  title: string;                 // Tytuł widoku
  isActive: boolean;             // Status aktywności
  createdAt: string;             // Czas utworzenia (ISO string)
  reloadKey?: number;            // Klucz do wymuszenia przeładowania
}
```

## Cechy

### Izolacja iframe

Każdy widok jest renderowany w osobnym iframe z odpowiednimi atrybutami sandbox:

```html
<iframe
  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
  src={url}
/>
```

**Sandbox flags:**
- `allow-scripts` - pozwala na wykonywanie skryptów
- `allow-same-origin` - pozwala na dostęp do same-origin zasobów
- `allow-forms` - pozwala na wysyłanie formularzy
- `allow-popups` - pozwala na otwieranie popup'ów

### Responsywny grid

Grid automatycznie dostosowuje się do liczby kolumn:

```tsx
<div
  className="grid gap-4"
  style={{
    gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
  }}
>
  {/* Widoki */}
</div>
```

### Zarządzanie stanem

Komponenty używają React hooks do zarządzania stanem:

- `useState` - zarządzanie widokami, URL, liczba kolumn
- `useCallback` - optymalizacja funkcji callback'ów
- `useRef` - dostęp do elementów iframe

## Best Practices

### Dla testowania multiplayer

1. Otwórz tę samą aplikację w wielu widokach
2. Użyj DevTools aby monitorować komunikację między widokami
3. Symuluj opóźnienia sieciowe za pomocą DevTools Network tab

### Dla gier Phaser

1. Każda instancja Phaser powinna mieć unikalny kontener DOM
2. Upewnij się, że gry są prawidłowo niszczone przy odmontowywaniu
3. Rozważ ograniczenie liczby aktywnych gier ze względu na wydajność

### Dla React aplikacji

1. Każda aplikacja powinna być self-contained
2. Unikaj globalnych zmiennych stanu
3. Używaj iframe do izolacji CSS i JavaScript

## Wydajność

### Rekomendacje

- Maksymalnie 4-6 widoków jednocześnie dla optymalnej wydajności
- Używaj `loading="lazy"` dla iframe'ów spoza ekranu
- Monitoruj zużycie pamięci w DevTools

### Optymalizacja

```tsx
// Przeładuj tylko widoczne widoki
const visibleViews = views.filter(view => isInViewport(view.id));
```

## Troubleshooting

### Widok nie ładuje się

1. Sprawdź konsolę DevTools dla błędów CORS
2. Upewnij się, że URL jest poprawny
3. Sprawdź atrybuty sandbox - mogą blokować zasoby

### Niska wydajność

1. Zmniejsz liczbę aktywnych widoków
2. Sprawdź zużycie pamięci w DevTools
3. Wyłącz Debug Panel jeśli nie jest potrzebny

### Komunikacja między widokami

Użyj `postMessage` API:

```typescript
// Wysłanie wiadomości do iframe
iframe.contentWindow.postMessage({ type: 'action', data: {} }, '*');

// Odbieranie wiadomości
window.addEventListener('message', (event) => {
  if (event.data.type === 'action') {
    // Obsługa wiadomości
  }
});
```

## Przyszłe ulepszenia

- [ ] Drag & drop do zmiany kolejności widoków
- [ ] Zapisywanie konfiguracji w localStorage
- [ ] Nagrywanie i odtwarzanie sesji
- [ ] Integracja z DevTools
- [ ] Wsparcie dla Web Workers
- [ ] Synchronizacja stanu między widokami

## Referencje

- [React iframes best practices](https://blog.logrocket.com/best-practices-react-iframes/)
- [Phaser multiple instances](https://phaser.io/examples/v3/view/game-config/multiple-game-instances)
- [postMessage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
