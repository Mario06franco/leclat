import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB1I7Hd_TLlMuHV3Sk5-kPTOwjdpXXc-h0",
    authDomain: "leclat-288eb.firebaseapp.com",
    projectId: "leclat-288eb",
    storageBucket: "leclat-288eb.firebasestorage.app",
    messagingSenderId: "32688866199",
    appId: "1:32688866199:web:b2e96fe38649e153c4bad2",
    measurementId: "G-VT2YHPYF7W"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);