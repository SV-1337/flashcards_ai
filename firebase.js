import { initializeApp } from '@firebase/app';
import { getFirestore } from '@firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyAUlP1kpVDykXDrcuLAvLKKGN2fUuAFXQw",
    authDomain: "flashcards-c2873.firebaseapp.com",
    projectId: "flashcards-c2873",
    storageBucket: "flashcards-c2873.appspot.com",
    messagingSenderId: "244474817789",
    appId: "1:244474817789:web:cfe2ffb50f5b6b0d71a294",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db;