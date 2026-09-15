/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        abb: {
          red: {
            DEFAULT: '#FF000F',
            dark: '#CC000C',
            light: '#FFF1F2',
            border: '#FFA3A8',
          },
          charcoal: '#181B1F',
          dark: '#12151A',
          steel: '#2D3239',
          muted: '#5A626E',
          border: '#E2E6EA',
          borderDark: '#CED4DA',
          bg: '#F8F9FA',
          card: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: [
          '"ABBVoice"',
          '"ABB Voice"',
          '"Plus Jakarta Sans"',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        display: [
          'Syncopate',
          '"Space Grotesk"',
          '"ABBVoice"',
          '"Plus Jakarta Sans"',
          'sans-serif',
        ],
        outrun: [
          'Syncopate',
          '"Space Grotesk"',
          'sans-serif',
        ],
        mono: ['"JetBrains Mono"', 'SFMono-Regular', 'Consolas', 'Menlo', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '2px',
        sm: '1px',
        md: '3px',
        lg: '4px',
      },
      boxShadow: {
        industrial: '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'industrial-md': '0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
