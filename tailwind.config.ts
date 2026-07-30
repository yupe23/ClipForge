import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0F1115',
        surface: '#1A1D24',
        'surface-hover': '#22262F',
        'text-primary': '#E8E9ED',
        'text-secondary': '#8B8F9C',
        border: '#2A2E38',
        accent: '#4F6BFF',
        'accent-hover': '#6B84FF',
        success: '#3DD68C',
        warning: '#E8B849',
        error: '#E5484D',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        lg: '8px',
        xl: '12px',
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
    },
  },
  plugins: [],
};

export default config;
