/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: 'inherit',
            h1: {
              fontWeight: '700',
              fontSize: '2.25rem',
              marginTop: '2rem',
              marginBottom: '1rem',
            },
            h2: {
              fontWeight: '600',
              fontSize: '1.875rem',
              marginTop: '1.5rem',
              marginBottom: '0.75rem',
            },
            h3: {
              fontWeight: '600',
              fontSize: '1.5rem',
              marginTop: '1.25rem',
              marginBottom: '0.5rem',
            },
            h4: {
              fontWeight: '600',
              fontSize: '1.25rem',
              marginTop: '1rem',
              marginBottom: '0.5rem',
            },
            code: {
              backgroundColor: 'rgba(175, 184, 193, 0.2)',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontSize: '0.9em',
            },
            'code::before': {
              content: 'none',
            },
            'code::after': {
              content: 'none',
            },
            pre: {
              backgroundColor: '#1e293b',
              borderRadius: '0.5rem',
              padding: '1rem',
              overflowX: 'auto',
              margin: '1rem 0',
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: 0,
              borderRadius: 0,
            },
            a: {
              color: '#3b82f6',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            blockquote: {
              borderLeft: '4px solid #e2e8f0',
              paddingLeft: '1rem',
              fontStyle: 'italic',
              color: '#64748b',
              margin: '1.5rem 0',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  darkMode: 'class',
}
