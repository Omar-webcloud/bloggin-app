
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCGvTD3wapDUlIVAmeo9XBBNVs-lpfeN6o",
  authDomain: "bloggin-2626d.firebaseapp.com",
  projectId: "bloggin-2626d",
  storageBucket: "bloggin-2626d.firebasestorage.app",
  messagingSenderId: "885496620623",
  appId: "1:885496620623:web:74e85c2035bf7020baec3a",
  measurementId: "G-Z3H512GL7S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { auth, db, storage, analytics };
