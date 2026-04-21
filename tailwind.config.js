/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      colors: {
        videla: {
          navy: '#0A1628',
          blue: '#1B3A6B',
          gold: '#C9A84C',
          silver: '#8B9CB0',
          light: '#EEF2F7',
          accent: '#2563EB',
          success: '#059669',
          warning: '#D97706',
          danger: '#DC2626',
        }
      },
      backgroundImage: {
        'gradient-videla': 'linear-gradient(135deg, #0A1628 0%, #1B3A6B 50%, #0A1628 100%)',
        'gradient-gold': 'linear-gradient(135deg, #C9A84C, #E8C96E, #C9A84C)',
      }
    },
  },
  plugins: [],
}
