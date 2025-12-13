import { useState, useEffect } from "react";
import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ScreenName =
  | "home"
  | "upload"
  | "confirm"
  | "connecting"
  | "photoData"
  | "advice"
  | "survey"
  | "recommendation"
  | "settings"
  | "exifAnalyzer";

export type CoachingStyle = "logical" | "supportive" | "spartan" | "phottomo";

export interface PhotoData {
  cameraName: string;
  lensName: string;
  iso: number;
  aperture: string;
  shutterSpeed: string;
  focalLength: string;
  whiteBalance: string;
  mode: string;
  // Additional fields for detailed analysis
  dateTimeOriginal?: string;
  filmSimulation?: string;
  dynamicRange?: string;
  focalLength35mm?: string;
  exposureProgram?: string;
  flash?: string;
  meteringMode?: string;
  exposureBias?: string;
}

export interface UploadedImages {
  photoUri: string | null;
  screenshotUris: string[];
}

export interface SurveyAnswers {
  experience?: "beginner" | "intermediate" | "advanced";
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



const [AppContextProvider, useApp] = createContextHook(() => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>("home");
  const [previousScreen, setPreviousScreen] = useState<ScreenName>("home");
  const [photoData, setPhotoData] = useState<PhotoData | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImages>({
    photoUri: null,
    screenshotUris: [],
  });
  const [surveyAnswers, setSurveyAnswers] = useState<SurveyAnswers>({});
  const [coachingStyle, setCoachingStyle] = useState<CoachingStyle>("phottomo");

  useEffect(() => {
    const loadCoachingStyle = async () => {
      try {
        const stored = await AsyncStorage.getItem("coachingStyle");
        if (stored) {
          setCoachingStyle(stored as CoachingStyle);
        }
      } catch (error) {
        console.error("Failed to load coaching style:", error);
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
      await AsyncStorage.setItem("coachingStyle", style);
      setCoachingStyle(style);
    } catch (error) {
      console.error("Failed to save coaching style:", error);
    }
  };

  const resetSurveyAnswers = () => {
    setSurveyAnswers({});
  };



  const resetPhotoData = () => {
    setPhotoData(null);
  };

  const resetUploadedImages = () => {
    setUploadedImages({
      photoUri: null,
      screenshotUris: [],
    });
  };

  const resetAll = () => {
    setPhotoData(null);
    setUploadedImages({
      photoUri: null,
      screenshotUris: [],
    });
    setSurveyAnswers({});
    setCurrentScreen("home");
  };

  return {
    currentScreen,
    previousScreen,
    photoData,
    uploadedImages,
    surveyAnswers,
    coachingStyle,
    navigateToScreen,
    setPhotoData,
    setUploadedImages,
    setSurveyAnswers,
    setCoachingStyle: saveCoachingStyle,
    resetSurveyAnswers,
    resetPhotoData,
    resetUploadedImages,
    resetAll,
  };
});

export { AppContextProvider, useApp };
