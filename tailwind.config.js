module.exports = {
  purge: ['./src/**/*.html', './src/**/*.ts'],
  darkMode: 'class',
  theme: {
    extend: {
      colors:{
        neutral_gray: {
          black: "#000000",
          100: "#161616",
          90: "#262626",
          80: "#393939",
          70: "#525252",
          60: "#6F6F6F",
          50: "#8D8D8D",
          40: "#A8A8A8",
          30: "#C6C6C6",
          20: "#E0E0E0",
          10: "#F4F4F4",
          white: "#FFFFFF"
        },
        orange_core:{
          100: "#421A00",
          90: "#6B2A00",
          80: "#9E3E00",
          70: "#CC5000",
          60: "#F66100",
          50: "#FF9047",
          40: "#FFAF7A",
          30: "#FFCAA8",
          20: "#FFE3D1",
          10: "#FFF3EB"
        },
        alert_light:{
          60: "#FB6060",
          50: "#24A148",
          40: "#66A6FF",
          30: "#F1C21B"
        },
        alert_dark:{
          60: "#DA1E28",
          50: "#1F7A3D",
          40: "#0F62FE",
          30: "#806A00"
        },
        status:{
          firmado: "#00E573",
          pendiente: "#FFCC33",
          errado: "#FF0055",
          expirado: "#00D4FF",
          cancelado: "#8080B2"
        },
      },
      opacity: ['disabled'],
    },
    fontFamily: {
      'rubik': ['Rubik']
    },
    screens: {
      'sm': '320px',
      'md': '672px',
      'lg': '1056px',
    },
  },
  variants: {
    extend:{
      textAlign: ['hover', 'focus'],
      pointerEvents: ['hover', 'focus']
    }
  },

  plugins: [],
};
