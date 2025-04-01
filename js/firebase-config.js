// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAvNAz7FKfwuagDKv-y97UVw1kgf7y7frw",
    authDomain: "version-control-5.firebaseapp.com",
    projectId: "version-control-5",
    storageBucket: "version-control-5.appspot.com",
    messagingSenderId: "702508148859",
    appId: "1:702508148859:web:db77be580e35f005765ade"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();