import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getAnalytics, isSupported } from "firebase/analytics"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3jwIiqKrF4PMJclYFlXq8psjjyu_XDgA",
  authDomain: "bloggin-2626d.firebaseapp.com",
  projectId: "bloggin-2626d",
  storageBucket: "bloggin-2626d.firebasestorage.app",
  messagingSenderId: "885496620623",
  appId: "1:885496620623:web:74e85c2035bf7020baec3a",
  measurementId: "G-Z3H512GL7S",
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

// Initialize Firebase services
const auth = getAuth(app)
const db = getFirestore(app)

// Initialize Analytics only on client side and if supported
let analytics = null
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app)
    }
  })
}

export { app, auth, db, analytics }
