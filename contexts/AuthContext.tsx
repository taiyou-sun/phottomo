import { useState, useEffect } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '@/constants/firebase';

export const [AuthContextProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user?.email);
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Signed in successfully:', userCredential.user.email);
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message || 'ログインに失敗しました');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Signed up successfully:', userCredential.user.email);
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.message || '新規登録に失敗しました');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
      console.log('Signed out successfully');
    } catch (err: any) {
      console.error('Sign out error:', err);
      setError(err.message || 'ログアウトに失敗しました');
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
      console.log('Password reset email sent to:', email);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'パスワードリセットに失敗しました');
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
});
