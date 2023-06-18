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
        'gray-custom': "#CCD1D1",
        'blue-custom': "#1890FF",
        'b-custom': "#ced4da",
        'icon-custom': "#6c757d",
        'primary-clr': "#3B82F6"
      }
    },
  },
  plugins: [],
}

