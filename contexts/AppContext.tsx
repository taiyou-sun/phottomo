import { useState, useEffect } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ScreenName = 
  | 'home' 
  | 'upload' 
  | 'confirm' 
  | 'connecting' 
  | 'photoData' 
  | 'advice' 
  | 'survey' 
  | 'recommendation' 
  | 'lensSurvey' 
  | 'lensRecommendation' 
  | 'settings';

export type CoachingStyle = 'logical' | 'supportive' | 'spartan' | 'phottomo';

export interface PhotoData {
  cameraName: string;
  lensName: string;
  iso: number;
  aperture: string;
  shutterSpeed: string;
  focalLength: string;
  whiteBalance: string;
  mode: string;
}

export interface UploadedImages {
  photoUri: string | null;
  screenshotUri: string | null;
}

export interface SurveyAnswers {
  experience?: 'beginner' | 'intermediate' | 'advanced';
  subject?: string;
  feature?: string;
  budget?: string;
  style?: string;
  lens?: string;
  balance?: string;
  sensor?: string;
  af?: string;
  video?: string;
  proFeatures?: string;
}

export interface LensSurveyAnswers {
  subject?: string;
  focalLength?: string;
  aperture?: string;
  budget?: string;
}

const [AppContextProvider, useApp] = createContextHook(() => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('home');
  const [previousScreen, setPreviousScreen] = useState<ScreenName>('home');
  const [photoData, setPhotoData] = useState<PhotoData | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImages>({
    photoUri: null,
    screenshotUri: null,
  });
  const [surveyAnswers, setSurveyAnswers] = useState<SurveyAnswers>({});
  const [lensSurveyAnswers, setLensSurveyAnswers] = useState<LensSurveyAnswers>({});
  const [coachingStyle, setCoachingStyle] = useState<CoachingStyle>('phottomo');

  useEffect(() => {
    const loadCoachingStyle = async () => {
      try {
        const stored = await AsyncStorage.getItem('coachingStyle');
        if (stored) {
          setCoachingStyle(stored as CoachingStyle);
        }
      } catch (error) {
        console.error('Failed to load coaching style:', error);
      }
    };
    loadCoachingStyle();
  }, []);

  const navigateToScreen = (screen: ScreenName) => {
    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
  };

  const saveCoachingStyle = async (style: CoachingStyle) => {
    try {
      await AsyncStorage.setItem('coachingStyle', style);
      setCoachingStyle(style);
    } catch (error) {
      console.error('Failed to save coaching style:', error);
    }
  };

  const resetSurveyAnswers = () => {
    setSurveyAnswers({});
  };

  const resetLensSurveyAnswers = () => {
    setLensSurveyAnswers({});
  };

  const resetPhotoData = () => {
    setPhotoData(null);
  };

  const resetUploadedImages = () => {
    setUploadedImages({
      photoUri: null,
      screenshotUri: null,
    });
  };

  const resetAll = () => {
    setPhotoData(null);
    setUploadedImages({
      photoUri: null,
      screenshotUri: null,
    });
    setSurveyAnswers({});
    setLensSurveyAnswers({});
    setCurrentScreen('home');
  };

  return {
    currentScreen,
    previousScreen,
    photoData,
    uploadedImages,
    surveyAnswers,
    lensSurveyAnswers,
    coachingStyle,
    navigateToScreen,
    setPhotoData,
    setUploadedImages,
    setSurveyAnswers,
    setLensSurveyAnswers,
    setCoachingStyle: saveCoachingStyle,
    resetSurveyAnswers,
    resetLensSurveyAnswers,
    resetPhotoData,
    resetUploadedImages,
    resetAll,
  };
});

export { AppContextProvider, useApp };
