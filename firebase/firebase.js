// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAWjgNA9sneaepMcgVm5GnMqYl3UPIXcGc",
    authDomain: "ttcalendar-abb33.firebaseapp.com",
    projectId: "ttcalendar-abb33",
    storageBucket: "ttcalendar-abb33.appspot.com",
    messagingSenderId: "954437661041",
    appId: "1:954437661041:web:4273688ecc06ba5f0786d0",
    measurementId: "G-T2P6VFTJPS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app;