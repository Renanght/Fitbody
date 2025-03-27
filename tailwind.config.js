/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        "rubik": ['Rubik-Regular', 'sans-serif'],
        "rubik-bold": ['Rubik-Bold', 'sans-serif'],
        "rubik-extrabold": ['Rubik-ExtraBold', 'sans-serif'],
        "rubik-medium": ['Rubik-Medium', 'sans-serif'],
        "rubik-semibold": ['Rubik-SemiBold', 'sans-serif'],
        "rubik-light": ['Rubik-Light', 'sans-serif'],
      },
      colors: {
        primary: {
          100: 'rgba(255, 255, 255, 0.09)',
          200: "#D9D9D9",
          300: "#1E1E1E",
        },
        secondary: {
          DEFAULT: "#E2F163",
        },
        terciary: {
          DEFAULT: "#B3A0FF"
        },
        accent: {
          100: "#FBFBFD",
        },
        black: {
          DEFAULT: "#000000",
          100: "#8C8E98",
          200: "#666876",
          300: "#191D31",
        },
        danger: "#F75555",
      },
    },
  },
  plugins: [],
}