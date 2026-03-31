import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDNJHMCyl3T2t8MHFDkJH1IKbcJoqvMLHQ",
  authDomain: "velvora-luxury.firebaseapp.com",
  projectId: "velvora-luxury",
  storageBucket: "velvora-luxury.firebasestorage.app",
  messagingSenderId: "799404146977",
  appId: "1:799404146977:web:4097bc4d377f7e4163be60"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
