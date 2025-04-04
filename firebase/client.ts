// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyC-B9AOWHxFW7fxqhl_Dw0p3mdzJi75uvw",
  authDomain: "prepwise-5308e.firebaseapp.com",
  projectId: "prepwise-5308e",
  storageBucket: "prepwise-5308e.firebasestorage.app",
  messagingSenderId: "668585383102",
  appId: "1:668585383102:web:84fb74670a302170253aef",
  measurementId: "G-WQJ09C4L7F",
}

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp()

export const auth = getAuth(app)
export const db = getFirestore(app)
