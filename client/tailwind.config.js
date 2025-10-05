module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nasa-blue': '#0b3d91',
        'nasa-red': '#fc3d21',
        'space-black': '#0a0a0f',
        'space-gray': '#1a1a2e',
        'cosmic-purple': '#16213e',
        'starry-gold': '#e3b505',
        'nebula-teal': '#00b4d8',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}