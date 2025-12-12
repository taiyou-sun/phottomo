import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import AuthNavigator from '@/components/AuthNavigator';
import HomeScreen from '@/components/HomeScreen';
import UploadScreen from '@/components/UploadScreen';
import ConfirmScreen from '@/components/ConfirmScreen';
import ConnectingScreen from '@/components/ConnectingScreen';
import PhotoDataScreen from '@/components/PhotoDataScreen';
import AdviceScreen from '@/components/AdviceScreen';
import CameraSurveyScreen from '@/components/CameraSurveyScreen';
import CameraRecommendationScreen from '@/components/CameraRecommendationScreen';
import LensSurveyScreen from '@/components/LensSurveyScreen';
import LensRecommendationScreen from '@/components/LensRecommendationScreen';
import SettingsScreen from '@/components/SettingsScreen';
import { COLORS } from '@/constants/colors';

export default function Index() {
  const { currentScreen } = useApp();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!user) {
    return <AuthNavigator />;
  }

  switch (currentScreen) {
    case 'home':
      return <HomeScreen />;
    case 'upload':
      return <UploadScreen />;
    case 'confirm':
      return <ConfirmScreen />;
    case 'connecting':
      return <ConnectingScreen />;
    case 'photoData':
      return <PhotoDataScreen />;
    case 'advice':
      return <AdviceScreen />;
    case 'survey':
      return <CameraSurveyScreen />;
    case 'recommendation':
      return <CameraRecommendationScreen />;
    case 'lensSurvey':
      return <LensSurveyScreen />;
    case 'lensRecommendation':
      return <LensRecommendationScreen />;
    case 'settings':
      return <SettingsScreen />;
    default:
      return <HomeScreen />;
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});
