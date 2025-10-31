/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFAFA',
        surface: '#FFFFFF',
        accent: '#ec4899',
        'accent-light': '#fce7f3',
        'text-primary': '#1f2937',
        'text-secondary': '#6b7280',
        border: '#e5e7eb',
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
