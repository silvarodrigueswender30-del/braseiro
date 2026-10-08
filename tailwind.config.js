/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        carvao: 'var(--carvao, #14100D)',
        creme: 'var(--creme, #F5E6D0)',
        brasa: 'var(--brasa, #E8832A)',
        'vermelho-terra': 'var(--vermelho-terra, #B8352B)',
        'azul-mar': 'var(--azul-mar, #2F6FA8)',
        noite: 'var(--noite)',
        'madeira-esc': 'var(--madeira-esc)',
        madeira: 'var(--madeira)',
        luz: 'var(--luz)',
        rua: 'var(--rua)',
        terracota: 'var(--terracota)',
        turquesa: 'var(--turquesa)',
        verde: 'var(--verde)',
        vermelho: 'var(--vermelho)',
        azul: 'var(--azul)',
        'ouro-pedra': 'var(--ouro-pedra)',
      },
      fontFamily: {
        display: ['var(--font-display)', '"Fraunces"', 'Georgia', 'serif'],
        text: ['var(--font-text)', '"Instrument Sans"', 'system-ui', 'sans-serif'],
        ui: ['var(--font-text)', '"Instrument Sans"', 'system-ui', 'sans-serif'],
        condensed: ['"Barlow Condensed"', 'sans-serif'],
        serif: ['"Fraunces"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      borderRadius: {
        card: '10px',
      },
    },
  },
  plugins: [],
}
