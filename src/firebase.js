// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD0e1YlT_2Q45jAVn56nseiqsbrEkXiTIs",
  authDomain: "touristguide-981c3.firebaseapp.com",
  projectId: "touristguide-981c3",
  storageBucket: "touristguide-981c3.firebasestorage.app",
  messagingSenderId: "278221111218",
  appId: "1:278221111218:web:c0002701461744ad762eab",
  measurementId: "G-NMC2XYZ9DX"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
