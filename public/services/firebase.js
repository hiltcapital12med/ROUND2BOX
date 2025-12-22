// UBICACIÓN: /src/services/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Configuración de Firebase para Round2Box
const firebaseConfig = {
  apiKey: "AIzaSyBzDw7FHJsooi6fGZADZZc9BPkxhJ73oSQ",
  authDomain: "round2box-11d85.firebaseapp.com",
  projectId: "round2box-11d85",
  storageBucket: "round2box-11d85.firebasestorage.app",
  messagingSenderId: "948239545378",
  appId: "1:948239545378:web:8dfaae8cd5465181dc067b",
  measurementId: "G-EJLLDQCGKB"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);

// Exportamos las herramientas para usarlas en otros archivos
export const db = getFirestore(app);
export const auth = getAuth(app);