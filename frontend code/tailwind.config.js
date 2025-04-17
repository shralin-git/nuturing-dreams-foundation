/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors:{
        // pink
        mainFont:'#733c71',
        mainFontHover:'#471646',
        cardColor:'#8f758f'
        // blue
        // mainFont:'#063970',
        // mainFontHover:'#084dbd'
        
      }
    },
    screens: {
      'xs': '350px',
      'md': '760px',
      'lg': '900px',
      'xg': '1380px',
    },
  },
  plugins: [],
}

