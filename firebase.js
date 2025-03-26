import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import 'firebase/database';

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const analytics = getAnalytics(app);