import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, getIdToken } from "firebase/auth";
const firebaseConfig = {
 apiKey: "AIzaSyD8DSp_J0kPxGfpxWls3cRQDbmcOPaJZTs",
  authDomain: "hopeconnect-ngo.firebaseapp.com",
  projectId: "hopeconnect-ngo",
  storageBucket: "hopeconnect-ngo.firebasestorage.app",
  messagingSenderId: "737226343288",
  appId: "1:737226343288:web:94cde2b445d6a8d2dcbe8d",
  measurementId: "G-6NPJQHCZDW"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

export const getCurrentUserToken = async () => {
    if (!auth.currentUser) {
        return null;
    }
    return await getIdToken(auth.currentUser);
};

export { onAuthStateChanged };

