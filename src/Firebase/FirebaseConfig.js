// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
    // paste your firebase config here
    apiKey: "AIzaSyBVLT6TBAUUI4G57wrp3BfIKRRIBOFoPv0",
    authDomain: "f2basket-e9b63.firebaseapp.com",
    projectId: "f2basket-e9b63",
    storageBucket: "f2basket-e9b63.appspot.com",
    messagingSenderId: "756537446828",
    appId: "1:756537446828:web:ca695f8fb0453607aa2a09",
    measurementId: "G-TDG1ZFMKZH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);


export { storage, db };
