// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
    // paste your firebase config here
    apiKey: "AIzaSyAsjU9q0xuXb-Xvw3DszkOwnaJZatrfY-M",
  authDomain: "fresh-buy-8f044.firebaseapp.com",
  projectId: "fresh-buy-8f044",
  storageBucket: "fresh-buy-8f044.appspot.com",
  messagingSenderId: "330779378079",
  appId: "1:330779378079:web:cf577ba0874857f63e7daa"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);


export { storage, db };
