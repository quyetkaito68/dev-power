/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        page: 'hsl(var(--color-bg))',
        surface: 'hsl(var(--color-surface))',
        elevated: 'hsl(var(--color-elevated))',
        muted: 'hsl(var(--color-muted))',
        border: 'hsl(var(--color-border))',
        'border-strong': 'hsl(var(--color-border-strong))',
        primary: 'hsl(var(--color-text))',
        secondary: 'hsl(var(--color-text-secondary))',
        'text-muted': 'hsl(var(--color-text-muted))',
        faint: 'hsl(var(--color-text-faint))',
        placeholder: 'hsl(var(--color-text-placeholder))',
      },
    },
  },
  plugins: [],
}
