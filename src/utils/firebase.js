import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB0PkVwAFnuBzbJ_3h6v1XbEfwbYdVaKO0",
  authDomain: "chit-chat-705cd.firebaseapp.com",
  projectId: "chit-chat-705cd",
  storageBucket: "chit-chat-705cd.appspot.com",
  messagingSenderId: "436999790326",
  appId: "1:436999790326:web:dac92baf4d8721a99b96d7",
  measurementId: "G-9QFJ13S7XH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage();
