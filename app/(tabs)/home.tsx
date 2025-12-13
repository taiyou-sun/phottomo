import React from "react";
import { useApp } from "@/contexts/AppContext";
import HomeScreen from "@/components/HomeScreen";
import UploadScreen from "@/components/UploadScreen";
import ConfirmScreen from "@/components/ConfirmScreen";
import ConnectingScreen from "@/components/ConnectingScreen";
import PhotoDataScreen from "@/components/PhotoDataScreen";
import AdviceScreen from "@/components/AdviceScreen";
import CameraSurveyScreen from "@/components/CameraSurveyScreen";
import CameraRecommendationScreen from "@/components/CameraRecommendationScreen";
import LensSurveyScreen from "@/components/LensSurveyScreen";
import LensRecommendationScreen from "@/components/LensRecommendationScreen";
import SettingsScreen from "@/components/SettingsScreen";
import ExifAnalyzerScreen from "@/components/ExifAnalyzerScreen";

export default function HomeTab() {
  const { currentScreen } = useApp();

  switch (currentScreen) {
    case "home":
      return <HomeScreen />;
    case "upload":
      return <UploadScreen />;
    case "confirm":
      return <ConfirmScreen />;
    case "connecting":
      return <ConnectingScreen />;
    case "photoData":
      return <PhotoDataScreen />;
    case "advice":
      return <AdviceScreen />;
    case "survey":
      return <CameraSurveyScreen />;
    case "recommendation":
      return <CameraRecommendationScreen />;
    case "lensSurvey":
      return <LensSurveyScreen />;
    case "lensRecommendation":
      return <LensRecommendationScreen />;
    case "settings":
      return <SettingsScreen />;
    case "exifAnalyzer":
      return <ExifAnalyzerScreen />;
    default:
      return <HomeScreen />;
  }
}
