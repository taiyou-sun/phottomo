import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB73mTKh7UGbOANTwr7Nx-XfTPtnnYqx1U",
  authDomain: "phottomo.firebaseapp.com",
  projectId: "phottomo",
  storageBucket: "phottomo.firebasestorage.app",
  messagingSenderId: "809942392730",
  appId: "1:809942392730:web:834b00f3a98b8a2f782423",
  measurementId: "G-8TTKRPL1JS"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
