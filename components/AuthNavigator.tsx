import React, { useState } from 'react';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';

type AuthScreen = 'login' | 'signup' | 'forgot';

export default function AuthNavigator() {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('login');

  switch (currentScreen) {
    case 'login':
      return (
        <LoginScreen
          onNavigateToSignUp={() => setCurrentScreen('signup')}
          onNavigateToForgotPassword={() => setCurrentScreen('forgot')}
        />
      );
    case 'signup':
      return (
        <SignUpScreen
          onNavigateToLogin={() => setCurrentScreen('login')}
        />
      );
    case 'forgot':
      return (
        <ForgotPasswordScreen
          onNavigateBack={() => setCurrentScreen('login')}
        />
      );
    default:
      return (
        <LoginScreen
          onNavigateToSignUp={() => setCurrentScreen('signup')}
          onNavigateToForgotPassword={() => setCurrentScreen('forgot')}
        />
      );
  }
}
