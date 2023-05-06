/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'login-bgr-img': "url('assets/images/login-bgr.jpg')" 
      },
      colors: {
        'gray-custom': "#CCD1D1"
      }
    },
  },
  plugins: [],
}

