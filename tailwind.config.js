/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          green: '#00ff88',
          cyan: '#00ffff',
          magenta: '#ff00ff',
          pink: '#ff0066',
          orange: '#ffaa00'
        }
      },
      boxShadow: {
        'neon-green': '0 0 20px rgba(0, 255, 136, 0.6)',
        'neon-cyan': '0 0 20px rgba(0, 255, 255, 0.6)',
        'neon-magenta': '0 0 20px rgba(255, 0, 255, 0.6)',
      },
      animation: {
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}