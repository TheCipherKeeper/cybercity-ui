/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cc: {
          bg: '#0b1120',
          panel: '#111827',
          border: '#1f2937',
          text: '#e5e7eb',
          muted: '#9ca3af',
          accent: '#3b82f6',
          accentHover: '#2563eb',
          danger: '#ef4444',
          warning: '#f59e0b',
          success: '#22c55e',
        },
      },
    },
  },
  plugins: [],
}
