<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" class="logo" width="120"/>

# Przeciąganie między wieloma kontenerami w dnd-kit - Kompletny przewodnik w stylu Trello

Implementacja systemu **drag \& drop w stylu Trello** z użyciem dnd-kit wymaga kilku kluczowych komponentów i najlepszych praktyk. Oto szczegółowy przewodnik z kompletnym kodem demonstracyjnym.

## 📦 Wymagane pakiety

Aby stworzyć funkcjonalną tablicę Kanban z wieloma kontenerami, zainstaluj te pakiety[^1][^2]:

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```


## 🏗️ Architektura rozwiązania

### 1. Struktura danych

**Najlepszą praktyką** jest organizowanie danych w formacie, który ułatwia zarządzanie taskami między kolumnami[^3][^4]:

```typescript
interface Task {
  id: string;
  content: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}
```


### 2. Konfiguracja DndContext

Główny kontekst aplikacji musi być skonfigurowany z odpowiednimi **sensorami** i **algorytmem wykrywania kolizji**[^5][^6]:

```typescript
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: { distance: 8 }
  }),
  useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates
  })
);

<DndContext
  sensors={sensors}
  collisionDetection={closestCenter}
  onDragStart={handleDragStart}
  onDragOver={handleDragOver}
  onDragEnd={handleDragEnd}
>
```


### 3. Algorytmy wykrywania kolizji

**dnd-kit oferuje kilka algorytmów**[^5][^7]:

- **`closestCenter`** - zalecany dla list sortowanych, mniej wymagający
- **`closestCorners`** - bardziej precyzyjny, analizuje wszystkie rogi
- **`rectIntersection`** - domyślny, wymaga bezpośredniego kontaktu prostokątów

Dla tablic Kanban **`closestCenter` jest najlepszym wyborem**[^6][^8].

## 🎯 Implementacja SortableContext dla każdej kolumny

**Każda kolumna musi mieć osobny SortableContext**[^9][^10]:

```typescript
<SortableContext
  id={column.id}
  items={column.tasks.map(task => task.id)}
  strategy={verticalListSortingStrategy}
>
  {/* Renderowanie tasków */}
</SortableContext>
```

**Ważne zasady**[^9]:

- Prop `items` musi być posortowany w tej samej kolejności co renderowane elementy
- Każdy task używa `useSortable` z unikalnym ID
- Strategia `verticalListSortingStrategy` jest optymalna dla pionowych list


## 👻 DragOverlay - implementacja ghosta

**DragOverlay zapewnia płynny efekt przeciągania**[^11][^12]:

```typescript
const [activeTask, setActiveTask] = useState<Task | null>(null);

// W handleDragStart
const task = findTaskById(active.id as string);
setActiveTask(task);

// Renderowanie overlay
{createPortal(
  <DragOverlay>
    {activeTask ? (
      <SortableItem 
        id={activeTask.id} 
        content={activeTask.content}
        isDragOverlay
      />
    ) : null}
  </DragOverlay>,
  document.body
)}
```

**Najlepsze praktyki dla DragOverlay**[^11]:

- **Pozostawiaj zamontowany przez cały czas** - potrzebny do animacji drop
- **Renderuj poza normalnym przepływem dokumentu** - używaj `createPortal`
- **Dodaj specjalne style** dla efektu wizualnego (cień, rotacja)


## 🔄 Obsługa zdarzeń przeciągania

### onDragStart

```typescript
const handleDragStart = (event: DragStartEvent) => {
  setActiveId(event.active.id as string);
  const task = findTaskById(event.active.id as string);
  setActiveTask(task);
};
```


### onDragOver - kluczowe dla przełączania między kolumnami

```typescript
const handleDragOver = (event: DragOverEvent) => {
  const { active, over } = event;
  if (!over) return;

  const activeColumn = findColumnByTaskId(active.id);
  const overColumn = findColumnByTaskId(over.id) || findColumnById(over.id);

  if (activeColumn?.id === overColumn?.id) return;

  // Przeniesienie elementu między kolumnami
  setColumns(prevColumns => {
    // Logika przenoszenia...
  });
};
```


### onDragEnd - finalizacja

```typescript
const handleDragEnd = (event: DragEndEvent) => {
  setActiveId(null);
  setActiveTask(null);
  
  // Sortowanie w tej samej kolumnie
  if (activeColumn.id === overColumn.id) {
    setColumns(columns => 
      columns.map(column => ({
        ...column,
        tasks: arrayMove(column.tasks, activeIndex, overIndex)
      }))
    );
  }
};
```


## 🎨 Stylowanie i efekty wizualne

```css
.task-item {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 12px;
  cursor: grab;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s;
}

.drag-overlay {
  transform: rotate(5deg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
```


## ⚡ Najlepsze praktyki i optymalizacje

### 1. **Unikaj zmiany stanu podczas onDragOver**

Choć jest to wymagane dla efektu preview, może powodować problemy z wydajnością[^8]. Rozważ użycie `useMemo` dla ciężkich obliczeń.

### 2. **Strategia renderowania**

```typescript
const style = {
  transform: CSS.Transform.toString(transform),
  transition,
  opacity: isDragging ? 0.5 : 1,
};
```


### 3. **Sensory i aktywacja**

```typescript
useSensor(PointerSensor, {
  activationConstraint: { distance: 8 } // Zapobiega przypadkowym przeciągnięciom
})
```


### 4. **Wsparcie dla dostępności**

- **Keyboard sensor** dla użytkowników używających klawiatury[^13]
- **ARIA attributes** są dodawane automatycznie przez dnd-kit
- **Screen reader announcements** działają out-of-the-box


## 🔧 Rozwiązywanie problemów

### Problem: Nieskończone re-renderowanie

**Przyczyna**: Zbyt częste wywołania `setState` w `onDragOver`[^8]
**Rozwiązanie**: Użyj bardziej precyzyjnego algorytmu wykrywania kolizji lub custom collision detection

### Problem: Nieprawidłowe pozycjonowanie

**Przyczyna**: Items w `SortableContext` nie są posortowane zgodnie z renderowaniem[^9]
**Rozwiązanie**: Upewnij się, że `items` prop odpowiada kolejności renderowania

### Problem: Brak smooth animations

**Przyczyna**: Brak `DragOverlay` lub jego nieprawidłowa implementacja[^11]
**Rozwiązanie**: Zawsze używaj `DragOverlay` dla przeciągania między kontenerami

## 📚 Przydatne zasoby

Kompletne przykłady implementacji znajdziesz w:

- **Oficjalna dokumentacja**: [dndkit.com](https://dndkit.com)[^1]
- **GitHub examples**: Społeczność tworzy liczne przykłady Kanban boards[^14][^15]
- **YouTube tutorials**: Szczegółowe przewodniki video[^16][^17][^18]

Ten przewodnik zapewnia solidne fundamenty do budowy zaawansowanych interfejsów drag \& drop w stylu Trello z użyciem dnd-kit, zachowując najwyższą jakość kodu i user experience.

<div style="text-align: center">⁂</div>

[^1]: https://dndkit.com

[^2]: https://dev.to/kelseyroche/a-beginners-guide-to-drag-and-drop-with-dnd-kit-in-react-5hfe

[^3]: https://app.studyraid.com/en/read/12149/389987/multiple-list-synchronization

[^4]: https://www.chetanverma.com/blog/how-to-create-an-awesome-kanban-board-using-dnd-kit

[^5]: https://www.youtube.com/watch?v=OKLst5Jgazc

[^6]: https://github.com/clauderic/dnd-kit/issues/73

[^7]: https://blog.csdn.net/q553866469/article/details/143741680

[^8]: https://docs.dndkit.com/api-documentation/context-provider

[^9]: https://docs.dndkit.com/presets/sortable/sortable-context

[^10]: https://next.dndkit.com/legacy/api-documentation/context-provider/collision-detection-algorithms

[^11]: https://next.dndkit.com/legacy/api-documentation/draggable/drag-overlay.md

[^12]: https://app.studyraid.com/en/read/12149/389970/custom-drag-overlay-creation

[^13]: https://stackoverflow.com/questions/78266598/dnd-kit-how-to-introduce-delay-in-collision-detection-for-swappable-grid

[^14]: https://github.com/Muhammad-Faizan-Tariq/kanban-board-react-dnd-kit

[^15]: https://blog.logrocket.com/build-kanban-board-dnd-kit-react/

[^16]: https://www.youtube.com/watch?v=RG-3R6Pu_Ik

[^17]: https://www.youtube.com/watch?v=IZ3w2PNh-hE

[^18]: https://www.youtube.com/watch?v=GEaRjSpgycg

[^19]: https://www.youtube.com/watch?v=dL5SOdgMbRY

[^20]: https://dev.to/arshadayvid/how-to-implement-drag-and-drop-in-react-using-dnd-kit-204h

[^21]: https://stackoverflow.com/questions/76468883/how-do-i-make-multiple-sortable-containers-with-dnd-kit/78707665

[^22]: https://www.cnblogs.com/xuLessReigns/articles/18068995

[^23]: https://www.reddit.com/r/reactjs/comments/16ogvr6/nested_sortable_lists_multiple_containers_with/

[^24]: https://github.com/clauderic/dnd-kit/issues/1188

[^25]: https://github.com/tisdadd/configured-dnd-context

[^26]: https://docs.dndkit.com/api-documentation/modifiers

[^27]: https://github.com/clauderic/dnd-kit/issues/624

[^28]: https://blog.csdn.net/sunzhen15896/article/details/139417131

[^29]: https://www.youtube.com/watch?v=ZALLXGVc_HU

[^30]: https://docs.dndkit.com/presets/sortable

[^31]: https://gist.github.com/StevenACoffman/41fee08e8782b411a4a26b9700ad7af5

[^32]: https://github.com/clauderic/dnd-kit/discussions/1111

[^33]: https://stackoverflow.com/questions/76468883/how-do-i-make-multiple-sortable-containers-with-dnd-kit

[^34]: https://www.youtube.com/watch?v=ecKw7FfikwI

[^35]: https://codesandbox.io/s/react-dndkit-multiple-containers-6wydy9

[^36]: https://www.youtube.com/watch?v=wmk50PEsVrs

[^37]: https://codesandbox.io/s/dnd-kit-kanban-board-hk79fp

[^38]: https://codesandbox.io/examples/package/@dnd-kit/sortable

[^39]: https://codesandbox.io/s/dnd-kit-kanban-board-1df69n

[^40]: https://docs.dndkit.com

[^41]: https://github.com/digitalmonad/trello-clone-dnd

[^42]: https://www.youtube.com/watch?v=aK2PD_REk7A

[^43]: https://github.com/clauderic/dnd-kit/issues/45

[^44]: https://github.com/marconunnari/trello-clone

[^45]: https://www.reddit.com/r/react/comments/1g8h39z/building_a_draganddrop_kanban_board_with_react/

[^46]: https://github.com/clauderic/dnd-kit/issues/735

[^47]: https://www.youtube.com/watch?v=narpWceQDAU

[^48]: https://docs.dndkit.com/api-documentation/context-provider/collision-detection-algorithms

[^49]: https://stackoverflow.com/questions/78045437/weird-infinite-rerender-behaviour-with-nested-dndkit-sortablecontext

[^50]: https://stackoverflow.com/questions/55713463/is-there-any-react-dnd-library-with-no-center-point-of-drag

[^51]: https://docs.dndkit.cn/yu-zhi-neng-li/sortable/sortable-context

[^52]: https://app.studyraid.com/en/read/12149/389990/custom-collision-detection-algorithms

[^53]: https://app.studyraid.com/en/read/12149/389952/key-components-of-dnd-kit-architecture

[^54]: https://github.com/clauderic/dnd-kit/issues/43

[^55]: https://next.dndkit.com/legacy/presets/sortable/sortable-context

