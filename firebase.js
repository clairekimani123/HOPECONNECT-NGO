import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, getIdToken } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBOW7-VcOa4hjDD-3m__kcNXF47thzhDAI", 
  authDomain: "hope-connect-5e7e3.firebaseapp.com",     
  projectId: "hope-connect-5e7e3",
  storageBucket: "hope-connect-5e7e3.appspot.com", 
  messagingSenderId: "250806047336",
  appId: "1:250806047336:web:a50a6883921230a510a1dd",
  measurementId: "G-WNWB1R9JT9"
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

