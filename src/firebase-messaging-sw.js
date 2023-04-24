importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js');


firebase.initializeApp({
  apiKey: "AIzaSyBYCvmgD_N8kUGYHN6Vnh7mNMxwX1ffoiU",
  authDomain: "bkland.firebaseapp.com",
  projectId: "bkland",
  storageBucket: "bkland.appspot.com",
  messagingSenderId: "276882401051",
  appId: "1:276882401051:web:b47e842012447886bc15be",
  measurementId: "G-M82WVFZM2Z"
});
const messaging = firebase.messaging();
