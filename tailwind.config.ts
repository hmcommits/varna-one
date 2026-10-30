import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        varna: {
          green: '#1a2e1a',
          cream: '#e8d5b7',
          bg: '#faf8f4',
          ticker: '#f0ece4',
          red: '#e05c4b',
          orange: '#d4650a',
        }
      }
    },
  },
  plugins: [],
}

export default config
