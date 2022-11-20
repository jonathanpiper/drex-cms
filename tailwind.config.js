export default {
  plugins: [],
  theme: {
    extend: {
      spacing: {
        '9000': '96rem',
      }
    },
  },
  purge: ["./index.html", './src/**/*.{svelte,js,ts}'], // for unused CSS
  variants: {
    extend: {},
  },
  darkMode: false, // or 'media' or 'class'
}