module.exports = {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundColor: "var(--background-color)",
      colors: {
        primary: {
          // 100: "#E0FBFC",
          // 200: "#CEEDF4",
          // 300: "#BCDEEB",
          // 400: "#98C1D9",
          // 500: "#6B8EAD",
          // 600: "#3D5A80",
          // 700: "#242F57",
          // 800: "#181942",
          // 900: "#0B032D",
          light: "#F2F2F2",
          DEFAULT: "#BFBFBF",
          dark: "#808080",
        },

        // secondary: {
        //   DEFAULT: "#f79256",
        //   light: "#FDE8D1",
        //   dark: "#B08970",
        //   contrastText: "#FFF",
        // },

        grayscale: {
          white: "#FFFFFF",
          light: "#F2F2F2",
          DEFAULT: "#BFBFBF",
          dark: "#808080",
          black: "#000000",
        },

        "blue-darkest": "var(--blue-darkest)",
        "blue-darker": "var(--blue-darker)",
        "blue-dark": "var(--blue-dark)",
        "blue-light": "var(--blue-light)",
        "gray-darkest": "var(--gray-darkest)",
        "gray-darker": "var(--gray-darker)",
        "gray-dark": "var(--gray-dark)",
        "gray-light": "var(--gray-light)",
        "gray-background": "var(--gray-background)",
      },
      backgroundImage: {
        login:
          "url('https://images.pexels.com/photos/2116721/pexels-photo-2116721.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')",
      },
    },
  },
  plugins: [],
};
