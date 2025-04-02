// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAvNAz7FKfwuagDKv-y97UVw1kgf7y7frw",
  authDomain: "version-control-5.firebaseapp.com",
  databaseURL: "https://version-control-5-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "version-control-5",
  storageBucket: "version-control-5.firebasestorage.app",
  messagingSenderId: "702508148859",
  appId: "1:702508148859:web:db77be580e35f005765ade",
  measurementId: "G-8JGSHFWL0Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);  

export { db };  
