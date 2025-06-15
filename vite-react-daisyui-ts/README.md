# React + Vite + TypeScript + Tailwind CSS + daisyUI Starter

A modern React starter template with Vite, TypeScript, Tailwind CSS, and daisyUI, featuring a clean project structure and pre-configured tooling.

## 🚀 Features

- ⚡️ [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- ⚛️ [React 19](https://react.dev/) - The library for web and native user interfaces
- 🎨 [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- 🌼 [daisyUI](https://daisyui.com/) - The most popular component library for Tailwind CSS
- 📦 [TypeScript](https://www.typescriptlang.org/) - Static type checking
- 🛠️ [ESLint](https://eslint.org/) - Pluggable JavaScript linter
- 🎨 30+ daisyUI themes included
- 📱 Fully responsive design
- 🔥 Hot Module Replacement (HMR)
- 🔄 [Redux Toolkit](https://redux-toolkit.js.org/) - State management with TypeScript support
- 🦄 [@tanstack/react-query](https://tanstack.com/query/latest) – Data fetching & caching (v5.80.7)
- 🧪 Test frameworks: Vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, jsdom

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.1.0
- **Build Tool**: Vite 6.3.5
- **Styling**: 
  - Tailwind CSS 4.1.10
  - daisyUI 5.0.43
- **Icons**: Lucide React 0.515.0
- **Language**: TypeScript 5.8.3
- **State Management**: Redux Toolkit 2.2.1
- **Linting**: ESLint 9.25.0
- **Data Fetching**: @tanstack/react-query 5.80.7
- **Test frameworks**:
  - Vitest 3.2.3
  - @testing-library/react 16.3.0
  - @testing-library/jest-dom 6.6.3
  - @testing-library/user-event 14.6.1
  - jsdom 26.1.0

---


## 📁 Project Structure

```
src/
├── app/                   # App configuration and store
│   ├── hooks.ts           # Redux hooks with TypeScript types
│   └── store.ts           # Redux store configuration
├── assets/                # Static assets (images, fonts, etc.)
├── components/
│   └── ui/               # Reusable UI components
│       ├── Button.tsx     # Button component with variants
│       ├── Card.tsx       # Card component
│       ├── Input.tsx      # Form input component
│       └── Modal.tsx      # Modal dialog component
├── features/              # Feature-based modules
│   └── counter/          # Example counter feature
│       ├── Counter.tsx    # Counter component
│       └── counterSlice.ts # Counter slice with reducers
├── hooks/                 # Custom React hooks
│   └── useTheme.ts        # Theme management hook
├── styles/                # Global styles
│   └── index.css          # Tailwind and daisyUI imports
└── utils/                 # Utility functions
```

## 🛠 Using Redux

This template comes with Redux Toolkit pre-configured with TypeScript support. Here's how to use it in your components:

---

## 🦄 Wyłączanie konsoli Tango (React Query Devtools)

Aby wyłączyć konsolę Tango (React Query Devtools), usuń lub zakomentuj komponent `<ReactQueryDevtools />` w kodzie aplikacji. Możesz też warunkowo renderować devtools tylko w trybie deweloperskim:

```tsx
{import.meta.env.DEV && <ReactQueryDevtools />}
```

Jeśli nie chcesz dołączać devtools do buildu produkcyjnego, upewnij się, że kod z devtools nie trafia do bundle prod.

### Accessing State in Components

```tsx
import { useAppSelector } from './app/hooks';
import type { RootState } from './app/store';

function MyComponent() {
  // Select data from the Redux store
  const count = useAppSelector((state: RootState) => state.counter.value);
  
  return <div>Count: {count}</div>;
}
```

### Dispatching Actions

```tsx
import { useAppDispatch } from './app/hooks';
import { increment, decrement } from './features/counter/counterSlice';

function CounterControls() {
  const dispatch = useAppDispatch();
  
  return (
    <div>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
    </div>
  );
}
```

### Creating Slices

Create a new feature slice using `createSlice`:

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

interface MyState {
  // Define your state shape here
}

const initialState: MyState = {
  // Initial state
};

export const mySlice = createSlice({
  name: 'myFeature',
  initialState,
  reducers: {
    // Define your reducers here
  },
});

export const { /* exported actions */ } = mySlice.actions;
export default mySlice.reducer;
```

## 🎨 Custom Themes

### Using Built-in Themes

This project includes 30+ daisyUI themes. You can switch between them using the theme selector in the navbar.

### Creating a Custom Theme

1. **Add a new theme** in `tailwind.config.js`:

```js
// tailwind.config.js
module.exports = {
  // ...
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#570df8",
          "secondary": "#f000b8",
          "accent": "#1dcdbc",
          "neutral": "#2b3440",
          "base-100": "#ffffff",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
      // Include other themes if needed
      "light",
      "dark",
    ],
  },
}
```

2. **Apply your theme** in your component:

```tsx
// Set theme for the entire app
document.documentElement.setAttribute('data-theme', 'mytheme');

// Or for a specific section
<div data-theme="mytheme">
  {/* Your content */}
</div>
```

### Theme Configuration Options

You can customize various aspects of your theme:
- Colors (`primary`, `secondary`, `accent`, etc.)
- Spacing and typography
- Border radius
- Animation durations
- And more...

## 🚀 Getting Started

1. **Install dependencies**
   ```bash
   yarn install
   ```

2. **Start the development server**
   ```bash
   yarn dev
   ```

3. **Run tests (single run)**
   ```bash
   yarn test
   ```

4. **Run tests in watch mode**
   ```bash
   yarn test:watch
   ```

5. **Build for production**
   ```bash
   yarn build
   ```

6. **Preview production build**
   ```bash
   yarn preview
   ```

## 🔧 ESLint Configuration

This project uses ESLint with the following plugins:
- `@typescript-eslint` - TypeScript support
- `eslint-plugin-react-hooks` - React Hooks rules
- `eslint-plugin-react-refresh` - Support for React Refresh

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [daisyUI](https://daisyui.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [TanStack Query (React Query)](https://tanstack.com/query/latest)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [jsdom](https://github.com/jsdom/jsdom)
- [Lucide Icons](https://lucide.dev/)
