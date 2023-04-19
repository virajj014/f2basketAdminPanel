// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
    // paste your firebase config here
    apiKey: "AIzaSyA7-NMORMXymaM0oovdcUcHzqHklI57Ag4",
  authDomain: "procart-6c87e.firebaseapp.com",
  projectId: "procart-6c87e",
  storageBucket: "procart-6c87e.appspot.com",
  messagingSenderId: "216573367345",
  appId: "1:216573367345:web:3eeb9b09e4557048b13110"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);


export { storage, db };
