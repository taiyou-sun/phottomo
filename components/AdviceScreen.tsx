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
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Settings, Edit3, Sparkles } from "lucide-react-native";
import { useApp } from "@/contexts/AppContext";
import { shootingIntents, transformAdviceByStyle } from "@/mocks/adviceData";
import * as ImageManipulator from "expo-image-manipulator";

const API_URL = process.env.EXPO_PUBLIC_AWS_API_URL || "";
const API_KEY = process.env.EXPO_PUBLIC_AWS_API_KEY || "";

if (!API_URL) {
  console.error("AWS API URL is not defined in .env");
}

export default function AdviceScreen() {
  const {
    photoData,
    coachingStyle,
    navigateToScreen,
    resetAll,
    uploadedImages,
  } = useApp();
  const [selectedIntent, setSelectedIntent] = React.useState<string | null>(
    null
  );
  const [customIntent, setCustomIntent] = React.useState<string>("");
  const [showCustomInput, setShowCustomInput] = React.useState<boolean>(false);
  const [aiAdvice, setAiAdvice] = React.useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = React.useState<boolean>(false);
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
          "x-api-key": API_KEY
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
      console.error(error);
      Alert.alert("Error", "AIアドバイスの生成に失敗しました");
    } finally {
      setLoadingAdvice(false);
    }
  };

  const handleIntentSelect = (intentId: string) => {
    setSelectedIntent(intentId);
    if (intentId !== "custom") {
      const intent = shootingIntents.find((i) => i.id === intentId);
      if (intent) {
        generateAiAdvice(intent.title);
      }
    }
  };

  const handleCustomIntentSubmit = () => {
    if (customIntent.trim()) {
      generateAiAdvice(customIntent);
    }
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

  const selectedIntentData = shootingIntents.find(
    (intent) => intent.id === selectedIntent
  );

  const getTransformedAdvice = () => {
    if (selectedIntent === "custom" && customIntent.trim()) {
      const baseAdvice = [
        `「${customIntent}」という意図に合わせて、構図を工夫してみましょう`,
        "光の向きと強さを意識すると、より表現力が高まります",
        "撮影設定を調整して、意図した雰囲気を作り出しましょう",
        "何度も撮り直して、ベストな一枚を探してみてください",
      ];
      return transformAdviceByStyle(baseAdvice, coachingStyle);
    }
    return selectedIntentData
      ? transformAdviceByStyle(selectedIntentData.baseAdvice, coachingStyle)
      : [];
  };

  const transformedAdvice = getTransformedAdvice();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
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
            <View style={styles.dataSummary}>
              <Text style={styles.summaryTitle}>撮影データ</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>カメラ:</Text>
                <Text style={styles.summaryValue}>{photoData.cameraName}</Text>
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
                  <Text
                    style={[
                      styles.intentTitle,
                      selectedIntent === intent.id &&
                        styles.intentTitleSelected,
                    ]}
                  >
                    {intent.title}
                  </Text>
                  <Text
                    style={[
                      styles.intentDescription,
                      selectedIntent === intent.id &&
                        styles.intentDescriptionSelected,
                    ]}
                  >
                    {intent.description}
                  </Text>
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
                <View style={styles.customIntentHeader}>
                  <Edit3
                    size={20}
                    color={selectedIntent === "custom" ? "#2e7d46" : "#1a4d2e"}
                  />
                  <Text
                    style={[
                      styles.intentTitle,
                      { marginLeft: 8 },
                      selectedIntent === "custom" && styles.intentTitleSelected,
                    ]}
                  >
                    自由に入力
                  </Text>
                </View>
                <Text
                  style={[
                    styles.intentDescription,
                    selectedIntent === "custom" &&
                      styles.intentDescriptionSelected,
                  ]}
                >
                  あなたの撮影意図を自由に入力してください
                </Text>
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
                  <Text style={styles.adviceTitle}>
                    AIコーチからのアドバイス
                  </Text>
                </View>
                <View style={styles.adviceContentContainer}>
                  {aiAdvice.split('\n').map((line, index) => {
                    const trimmedLine = line.trim();
                    if (!trimmedLine) return null;
                    
                    // Check for bullet points
                    if (trimmedLine.startsWith('・') || trimmedLine.startsWith('- ') || /^\d+\./.test(trimmedLine)) {
                      return (
                        <View key={index} style={styles.bulletPoint}>
                          <Text style={styles.bulletDot}>•</Text>
                          <Text style={styles.bulletText}>
                            {trimmedLine.replace(/^[・-]\s*|^\d+\.\s*/, '')}
                          </Text>
                        </View>
                      );
                    }
                    
                    return (
                      <Text key={index} style={styles.adviceParagraph}>
                        {trimmedLine}
                      </Text>
                    );
                  })}
                </View>
              </Animated.View>
            )}

            <View style={styles.actionButtons}>
              {selectedIntent && (
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => {
                    setSelectedIntent(null);
                    setShowCustomInput(false);
                    setCustomIntent("");
                  }}
                  testID="change-intent-button"
                >
                  <Text style={styles.secondaryButtonText}>
                    撮影意図を変更する
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => resetAll()}
                testID="new-photo-button"
              >
                <Text style={styles.primaryButtonText}>
                  新しい写真を撮影する
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
  dataSummary: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
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
    color: "#1a4d2e",
    marginBottom: 16,
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
    gap: 8,
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
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 8,
  },
  bulletDot: {
    fontSize: 16,
    lineHeight: 26,
    color: "#2e7d46",
    marginRight: 8,
    fontWeight: 'bold',
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 26,
    color: "#495057",
  },
});
