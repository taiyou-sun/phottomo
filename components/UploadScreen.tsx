import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Upload, ImageIcon, FileImage, ArrowLeft } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { useApp } from "@/contexts/AppContext";

export default function UploadScreen() {
  const { navigateToScreen, uploadedImages, setUploadedImages } = useApp();
  const [photoUri, setPhotoUri] = React.useState<string | null>(
    uploadedImages.photoUri
  );
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const pickPhoto = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("カメラロールへのアクセス許可が必要です");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images" as const,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
      console.log("Photo selected:", result.assets[0].uri);
    }
  };

  const handleContinue = () => {
    if (!photoUri) {
      alert("写真を選択してください");
      return;
    }

    setUploadedImages({
      photoUri,
      screenshotUris: [], // Keep empty array for compatibility
    });

    navigateToScreen("confirm");
  };

  const canContinue = !!photoUri;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigateToScreen("home")}
          style={styles.backButton}
          testID="back-button"
        >
          <ArrowLeft size={24} color="#1a4d2e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>写真をアップロード</Text>
        <View style={styles.placeholder} />
      </View>

      <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <View style={styles.instructionCard}>
              <Upload size={40} color="#2e7d46" strokeWidth={2} />
              <Text style={styles.instructionTitle}>写真をアップロード</Text>
              <Text style={styles.instructionText}>
                写真をアップロードしてください。{"\n"}
                EXIFデータから撮影設定を自動解析します。
              </Text>
            </View>

            <View style={styles.uploadSection}>
              <Text style={styles.sectionTitle}>写真を選択</Text>
              <TouchableOpacity
                style={styles.uploadCard}
                onPress={pickPhoto}
                activeOpacity={0.7}
                testID="photo-upload-button"
              >
                {photoUri ? (
                  <View style={styles.previewContainer}>
                    <Image
                      source={{ uri: photoUri }}
                      style={styles.previewImage}
                    />
                    <View style={styles.previewOverlay}>
                      <ImageIcon size={32} color="#fff" strokeWidth={2} />
                      <Text style={styles.previewText}>タップして変更</Text>
                    </View>
                  </View>
                ) : (
                  <>
                    <View style={styles.uploadIconContainer}>
                      <ImageIcon size={48} color="#2e7d46" strokeWidth={2} />
                    </View>
                    <Text style={styles.uploadTitle}>写真を選択</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.continueButton,
                !canContinue && styles.continueButtonDisabled,
              ]}
              onPress={handleContinue}
              disabled={!canContinue}
              testID="continue-button"
            >
              <Text
                style={[
                  styles.continueButtonText,
                  !canContinue && styles.continueButtonTextDisabled,
                ]}
              >
                次へ
              </Text>
            </TouchableOpacity>
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#1a4d2e",
  },
  placeholder: {
    width: 40,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  instructionCard: {
    backgroundColor: "#e8f5e9",
    borderRadius: 16,
    padding: 24,
    alignItems: "center" as const,
    marginBottom: 32,
  },
  instructionTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#1a4d2e",
    marginTop: 16,
    marginBottom: 12,
    textAlign: "center" as const,
  },
  instructionText: {
    fontSize: 14,
    color: "#5a7c5f",
    textAlign: "center" as const,
    lineHeight: 20,
  },
  uploadSection: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#1a4d2e",
    marginBottom: 12,
  },
  uploadCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 32,
    alignItems: "center" as const,
    borderWidth: 2,
    borderColor: "#e8ebe8",
    borderStyle: "dashed" as const,
    minHeight: 200,
    justifyContent: "center" as const,
  },
  uploadIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e8f5e9",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#1a4d2e",
    marginBottom: 8,
  },
  uploadDescription: {
    fontSize: 14,
    color: "#5a7c5f",
    textAlign: "center" as const,
    lineHeight: 20,
  },
  previewContainer: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    overflow: "hidden" as const,
    position: "relative" as const,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover" as const,
  },
  previewOverlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    opacity: 0.9,
  },
  previewText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#fff",
    marginTop: 8,
  },
  continueButton: {
    backgroundColor: "#2e7d46",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center" as const,
    marginTop: 16,
    shadowColor: "#2e7d46",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonDisabled: {
    backgroundColor: "#d0d7d0",
    shadowOpacity: 0,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#fff",
  },
  continueButtonTextDisabled: {
    color: "#8a9a8f",
  },
});
