import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  TextInput,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Settings, Edit3, Sparkles } from "lucide-react-native";
import { useApp } from "@/contexts/AppContext";
import { shootingIntents, transformAdviceByStyle } from "@/mocks/adviceData";
import { coachingStyles } from "@/constants/coachingStyles";

import * as ImageManipulator from "expo-image-manipulator";
import { useAuth } from "@/contexts/AuthContext";
import { saveAdviceHistory } from "@/utils/adviceHistory";
import Markdown from "react-native-markdown-display";

const API_URL = process.env.EXPO_PUBLIC_AWS_API_URL || "";
const API_KEY = process.env.EXPO_PUBLIC_AWS_API_KEY || "";

if (!API_URL) {
  console.error("AWS API URL is not defined in .env");
} else {
  console.log("Using API URL:", API_URL);
}

export default function AdviceScreen() {
  const {
    photoData,
    coachingStyle,
    setCoachingStyle,
    navigateToScreen,
    resetAll,
    uploadedImages,
  } = useApp();
  const { user } = useAuth();
  const [selectedIntent, setSelectedIntent] = React.useState<string | null>(
    null
  );
  const [customIntent, setCustomIntent] = React.useState<string>("");
  const [showCustomInput, setShowCustomInput] = React.useState<boolean>(false);
  const [aiAdvice, setAiAdvice] = React.useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = React.useState<boolean>(false);
  const [currentIntent, setCurrentIntent] = React.useState<string>("");
  const [isSaved, setIsSaved] = React.useState<boolean>(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const generateAiAdvice = async (intent: string) => {
    if (!uploadedImages.photoUri || !photoData) return;

    setLoadingAdvice(true);
    setAiAdvice(null);
    setIsSaved(false); // 新しいアドバイス生成時は保存状態をリセット

    try {
      // 1. Compress Image
      const manipulated = await ImageManipulator.manipulateAsync(
        uploadedImages.photoUri,
        [{ resize: { width: 1024 } }],
        {
          compress: 0.7,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );

      if (!manipulated.base64) throw new Error("Image processing failed");

      // 2. Call API
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify({
          image_base64: manipulated.base64,
          exif_data: photoData,
          intent: intent,
          persona: coachingStyle,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
        throw new Error(`API request failed: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      setAiAdvice(data.advice);
    } catch (error) {
      console.error("AIアドバイスの生成に失敗しました:", error);
    } finally {
      setLoadingAdvice(false);
    }
  };

  const handleIntentSelect = (intentId: string) => {
    setSelectedIntent(intentId);
    if (intentId !== "custom") {
      const intent = shootingIntents.find((i) => i.id === intentId);
      if (intent) {
        setCurrentIntent(intent.title);
        generateAiAdvice(intent.title);
      }
    }
  };

  const handleCustomIntentSubmit = () => {
    if (customIntent.trim()) {
      setCurrentIntent(customIntent);
      generateAiAdvice(customIntent);
    }
  };

  const handleSaveAdvice = () => {
    // 即座に保存済み状態にする
    setIsSaved(true);

    // バックグラウンドで保存処理を実行
    if (aiAdvice && user && photoData && uploadedImages.photoUri) {
      saveAdviceHistory({
        userId: user.uid,
        photoUri: uploadedImages.photoUri,
        photoData,
        advice: aiAdvice,
        intent: currentIntent,
        coachingStyle,
      })
        .then(() => {
          console.log("Advice saved successfully");
        })
        .catch((error) => {
          console.error("Error saving advice:", error);
          // 保存失敗時は保存済み状態を解除
          setIsSaved(false);
        });
    }
  };

  const handleCloseAdvice = () => {
    // ホーム画面に戻る（保存はしない）
    navigateToScreen("home");
    resetAll();
  };


  if (!photoData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>撮影データが見つかりません</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={styles.appName}>ふぉっとも</Text>
        <TouchableOpacity
          onPress={() => navigateToScreen("settings")}
          style={styles.settingsButton}
          testID="settings-button"
        >
          <Settings size={24} color="#1a4d2e" />
        </TouchableOpacity>
      </View>

      <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            {uploadedImages.photoUri && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>撮影した写真</Text>
                <View style={styles.photoContainer}>
                  <Image
                    source={{ uri: uploadedImages.photoUri }}
                    style={styles.photoImage}
                    resizeMode="contain"
                  />
                </View>
              </View>
            )}

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>撮影データ</Text>
              <View style={styles.dataSummary}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>カメラ:</Text>
                  <Text style={styles.summaryValue}>
                    {photoData.cameraName}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>レンズ:</Text>
                  <Text style={styles.summaryValue}>{photoData.lensName}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>設定:</Text>
                  <Text style={styles.summaryValue}>
                    ISO{photoData.iso} / {photoData.aperture} /{" "}
                    {photoData.shutterSpeed}
                  </Text>
                </View>
                {photoData.focalLength && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>焦点距離:</Text>
                    <Text style={styles.summaryValue}>
                      {photoData.focalLength}
                    </Text>
                  </View>
                )}
                {photoData.exposureBias && photoData.exposureBias !== "0" && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>露出補正:</Text>
                    <Text style={styles.summaryValue}>
                      {photoData.exposureBias}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.coachSelectionSection}>
              <Text style={styles.sectionTitle}>コーチを選択</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.coachListContent}
              >
                {coachingStyles.map((style) => (
                  <TouchableOpacity
                    key={style.id}
                    style={[
                      styles.coachCard,
                      coachingStyle === style.id && styles.coachCardSelected,
                    ]}
                    onPress={() => setCoachingStyle(style.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.coachEmoji}>{style.emoji}</Text>
                    <Text
                      style={[
                        styles.coachName,
                        coachingStyle === style.id && styles.coachNameSelected,
                      ]}
                    >
                      {style.name}
                    </Text>
                    {coachingStyle === style.id && (
                      <View style={styles.activeCoachBadge} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <Text style={styles.sectionTitle}>撮影意図を選択</Text>
            <View style={styles.intentCards}>
              {shootingIntents.map((intent) => (
                <TouchableOpacity
                  key={intent.id}
                  style={[
                    styles.intentCard,
                    selectedIntent === intent.id && styles.intentCardSelected,
                  ]}
                  onPress={() => handleIntentSelect(intent.id)}
                  testID={`intent-${intent.id}`}
                >
                  <View style={styles.intentHeader}>
                    <Text style={styles.intentEmoji}>{intent.emoji}</Text>
                    <View style={styles.intentTextContainer}>
                      <Text
                        style={[
                          styles.intentTitle,
                          selectedIntent === intent.id &&
                            styles.intentTitleSelected,
                        ]}
                      >
                        {intent.title}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={[
                  styles.intentCard,
                  selectedIntent === "custom" && styles.intentCardSelected,
                ]}
                onPress={() => {
                  setSelectedIntent("custom");
                  setShowCustomInput(true);
                }}
                testID="intent-custom"
              >
                <View style={styles.intentHeader}>
                  <Text style={styles.intentEmoji}>✏️</Text>
                  <View style={styles.intentTextContainer}>
                    <Text
                      style={[
                        styles.intentTitle,
                        selectedIntent === "custom" &&
                          styles.intentTitleSelected,
                      ]}
                    >
                      自由に入力
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {showCustomInput && selectedIntent === "custom" && (
                <View style={styles.customInputContainer}>
                  <TextInput
                    style={styles.customInput}
                    placeholder="例：夕暮れの静けさを表現したい"
                    placeholderTextColor="#9eb09e"
                    value={customIntent}
                    onChangeText={setCustomIntent}
                    multiline
                    numberOfLines={3}
                    testID="custom-intent-input"
                  />
                  <TouchableOpacity
                    style={styles.customSubmitButton}
                    onPress={handleCustomIntentSubmit}
                    testID="custom-intent-submit"
                  >
                    <Text style={styles.customSubmitText}>
                      アドバイスをもらう
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {loadingAdvice && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2e7d46" />
                <Text style={styles.loadingText}>
                  AIコーチが写真を分析中...
                </Text>
              </View>
            )}

            {aiAdvice && (
              <Animated.View style={[styles.adviceCard, { opacity: fadeAnim }]}>
                <View style={styles.adviceHeader}>
                  <Sparkles size={24} color="#fff" />
                  <View>
                    <Text style={styles.adviceTitle}>
                      AIコーチからのアドバイス
                    </Text>
                    {selectedIntent && (
                      <Text style={styles.adviceSubtitle}>
                        {selectedIntent === "custom"
                          ? `「${customIntent}」について`
                          : `「${
                              shootingIntents.find(
                                (i) => i.id === selectedIntent
                              )?.title
                            }」について`}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={styles.adviceContentContainer}>
                  <Markdown style={markdownStyles}>{aiAdvice}</Markdown>
                </View>
              </Animated.View>
            )}

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  (!aiAdvice || isSaved) && styles.saveButtonDisabled,
                ]}
                onPress={handleSaveAdvice}
                disabled={!aiAdvice || isSaved}
                testID="save-advice-button"
              >
                <Text
                  style={[
                    styles.saveButtonText,
                    (!aiAdvice || isSaved) && styles.saveButtonTextDisabled,
                  ]}
                >
                  {isSaved ? "保存済み" : "アドバイスを保存する"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCloseAdvice}
                testID="close-advice-button"
              >
                <Text style={styles.closeButtonText}>
                  アドバイスを閉じる
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7f5",
  },
  header: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e8ebe8",
  },
  appName: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#1a4d2e",
    letterSpacing: 0.5,
  },
  headerSpacer: {
    width: 40,
  },
  settingsButton: {
    padding: 8,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  errorText: {
    fontSize: 16,
    color: "#5a7c5f",
  },
  sectionContainer: {
    marginBottom: 24,
  },
  photoContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden" as const,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  photoImage: {
    width: "100%",
    height: 300,
    backgroundColor: "#f5f7f5",
  },
  dataSummary: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#1a4d2e",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row" as const,
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#5a7c5f",
    width: 80,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#1a4d2e",
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#1a4d2e",
    marginBottom: 16,
  },
  intentCards: {
    gap: 12,
    marginBottom: 24,
  },
  intentCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#e8ebe8",
  },
  intentCardSelected: {
    borderColor: "#2e7d46",
    backgroundColor: "#f0f8f2",
  },
  intentTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#1a4d2e",
    marginBottom: 4,
  },
  intentTitleSelected: {
    color: "#2e7d46",
  },
  intentDescription: {
    fontSize: 14,
    color: "#5a7c5f",
  },
  intentDescriptionSelected: {
    color: "#2e7d46",
  },
  adviceSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  adviceTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#fff",
    marginBottom: 2,
  },
  adviceItem: {
    flexDirection: "row" as const,
    marginBottom: 12,
  },
  adviceBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2e7d46",
    marginTop: 7,
    marginRight: 12,
  },
  adviceText: {
    flex: 1,
    fontSize: 15,
    color: "#2a3a2a",
    lineHeight: 22,
  },
  settingsComparison: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e8ebe8",
  },
  comparisonTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#1a4d2e",
    marginBottom: 12,
  },
  comparisonTable: {
    gap: 8,
  },
  comparisonRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingVertical: 8,
  },
  comparisonLabel: {
    fontSize: 14,
    color: "#5a7c5f",
    width: 90,
  },
  comparisonCurrent: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#1a4d2e",
    flex: 1,
  },
  comparisonRecommended: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#2e7d46",
    flex: 1,
  },
  actionButtons: {
    gap: 12,
  },
  saveButton: {
    backgroundColor: "#2e7d46",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center" as const,
    shadowColor: "#2e7d46",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: "#d0d7d0",
    shadowOpacity: 0,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#fff",
  },
  saveButtonTextDisabled: {
    color: "#8a9a8f",
  },
  closeButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center" as const,
    borderWidth: 2,
    borderColor: "#2e7d46",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#2e7d46",
  },
  primaryButton: {
    backgroundColor: "#2e7d46",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center" as const,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#fff",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center" as const,
    borderWidth: 2,
    borderColor: "#2e7d46",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#2e7d46",
  },
  customIntentHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
  },
  customInputContainer: {
    marginTop: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#2e7d46",
  },
  customInput: {
    fontSize: 15,
    color: "#1a4d2e",
    minHeight: 80,
    textAlignVertical: "top" as const,
    lineHeight: 22,
  },
  customIntentNote: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e8ebe8",
  },
  customIntentNoteText: {
    fontSize: 14,
    color: "#5a7c5f",
    lineHeight: 20,
  },
  adviceCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  adviceHeader: {
    backgroundColor: "#2e7d46",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  adviceTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#fff",
    marginBottom: 2,
  },
  adviceSubtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
  },
  coachSelectionSection: {
    marginBottom: 24,
  },
  coachListContent: {
    paddingRight: 20,
    gap: 12,
  },
  coachCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    minWidth: 100,
    borderWidth: 2,
    borderColor: "#e8ebe8",
    position: "relative",
  },
  coachCardSelected: {
    borderColor: "#2e7d46",
    backgroundColor: "#f0f8f2",
  },
  coachEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  coachName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#5a7c5f",
    textAlign: "center",
  },
  coachNameSelected: {
    color: "#2e7d46",
  },
  activeCoachBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2e7d46",
  },
  intentHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
  },
  intentEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  intentTextContainer: {
    flex: 1,
  },
  customSubmitButton: {
    backgroundColor: "#2e7d46",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  customSubmitText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    color: "#666",
    fontSize: 16,
  },
  adviceContentContainer: {
    padding: 16,
    backgroundColor: "#fff",
  },
  adviceParagraph: {
    fontSize: 16,
    lineHeight: 26,
    color: "#495057",
    marginBottom: 12,
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 8,
    paddingLeft: 8,
  },
  bulletDot: {
    fontSize: 16,
    lineHeight: 26,
    color: "#2e7d46",
    marginRight: 8,
    fontWeight: "bold",
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 26,
    color: "#495057",
  },
});

const markdownStyles = {
  body: {
    fontSize: 16,
    lineHeight: 26,
    color: "#495057",
  },
  strong: {
    fontWeight: "bold",
    color: "#1a4d2e",
  },
  heading1: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a4d2e",
    marginTop: 16,
    marginBottom: 8,
  },
  heading2: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a4d2e",
    marginTop: 12,
    marginBottom: 8,
  },
  list_item: {
    marginBottom: 4,
  },
  bullet_list: {
    marginBottom: 8,
  },
};
