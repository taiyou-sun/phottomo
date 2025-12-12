import { initializeApp, getApp } from 'firebase/app';
import { getAuth, initializeAuth, Auth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyB73mTKh7UGbOANTwr7Nx-XfTPtnnYqx1U",
  authDomain: "phottomo.firebaseapp.com",
  projectId: "phottomo",
  storageBucket: "phottomo.firebasestorage.app",
  messagingSenderId: "809942392730",
  appId: "1:809942392730:web:834b00f3a98b8a2f782423",
  measurementId: "G-8TTKRPL1JS"
};

let app;
let auth: Auth;

try {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: {
      _getPersistence: () => 'LOCAL',
      _isAvailable: async () => true,
      _set: async (key: string, value: string) => {
        await AsyncStorage.setItem(key, value);
      },
      _get: async (key: string) => {
        const value = await AsyncStorage.getItem(key);
        return value;
      },
      _remove: async (key: string) => {
        await AsyncStorage.removeItem(key);
      },
      _addListener: () => {},
      _removeListener: () => {},
    } as any,
  });
  console.log('Firebase initialized with AsyncStorage persistence');
} catch (error: any) {
  if (error.code === 'app/duplicate-app') {
    console.log('Firebase app already initialized');
    app = getApp();
    auth = getAuth(app);
  } else {
    console.error('Firebase initialization error:', error);
    throw error;
  }
}

export { auth };
