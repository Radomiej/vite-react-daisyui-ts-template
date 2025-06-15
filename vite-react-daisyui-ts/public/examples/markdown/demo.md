# Markdown & Mermaid Demo

To jest przykładowy plik markdown z obsługą:

- **Podstawowe formatowanie**
- Bloki kodu TypeScript
- Diagramy Mermaid

---

## Kod TypeScript

```typescript
function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

## Diagram Mermaid

```mermaid
flowchart TD
  A[Start] --> B{Is it working?}
  B -- Yes --> C[Great!]
  B -- No --> D[Debug]
  D --> B
```

## Link

[Przejdź do Google](https://google.com)
