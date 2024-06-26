import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL } from "firebase/storage";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "planches-mixtes.firebaseapp.com",
  projectId: "planches-mixtes",
  storageBucket: "planches-mixtes.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);

const storage = getStorage()

export const getHttpsReference =(url: string)=> ref(storage, url);  
export const getImageHttpsReference = (url: string) => getDownloadURL(ref(storage, url))