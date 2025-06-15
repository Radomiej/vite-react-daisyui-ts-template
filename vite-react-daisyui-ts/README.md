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

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.1.0
- **Build Tool**: Vite 6.3.5
- **Styling**: 
  - Tailwind CSS 4.1.10
  - daisyUI 5.0.43
- **Icons**: Lucide React 0.515.0
- **Language**: TypeScript 5.8.3
- **Linting**: ESLint 9.25.0

## 📁 Project Structure

```
src/
├── app/                   # App configuration and routing
├── assets/                # Static assets (images, fonts, etc.)
├── components/
│   └── ui/               # Reusable UI components
│       ├── Button.tsx     # Button component with variants
│       ├── Card.tsx       # Card component
│       ├── Input.tsx      # Form input component
│       └── Modal.tsx      # Modal dialog component
├── features/              # Feature-based modules
├── hooks/                 # Custom React hooks
│   └── useTheme.ts        # Theme management hook
├── styles/                # Global styles
│   └── index.css          # Tailwind and daisyUI imports
└── utils/                 # Utility functions
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

3. **Build for production**
   ```bash
   yarn build
   ```

4. **Preview production build**
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
