import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, Auth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

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

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  
  if (Platform.OS !== 'web') {
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
  } else {
    auth = getAuth(app);
  }
  
  console.log('Firebase initialized successfully');
} else {
  app = getApp();
  auth = getAuth(app);
  console.log('Using existing Firebase app');
}

export { auth };
