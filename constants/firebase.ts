import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB73mTKh7UGbOANTwr7Nx-XfTPtnnYqx1U",
  authDomain: "phottomo.firebaseapp.com",
  projectId: "phottomo",
  storageBucket: "phottomo.firebasestorage.app",
  messagingSenderId: "809942392730",
  appId: "1:809942392730:web:834b00f3a98b8a2f782423",
  measurementId: "G-8TTKRPL1JS"
};

let app: FirebaseApp;
let auth: Auth;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized');
} else {
  app = getApp();
  console.log('Using existing Firebase app');
}

auth = getAuth(app);

export { auth };
