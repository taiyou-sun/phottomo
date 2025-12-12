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
import { CheckCircle, ArrowLeft } from "lucide-react-native";
import { useApp, PhotoData } from "@/contexts/AppContext";
import * as FileSystem from "expo-file-system/legacy";
// @ts-ignore
import ExifReader from "exifreader";
import { base64ToUint8Array } from "@/utils";

export default function ConfirmScreen() {
  const { navigateToScreen, uploadedImages, setPhotoData } = useApp();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const [extractedData, setExtractedData] = React.useState<PhotoData | null>(null);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    const extractExif = async () => {
      if (!uploadedImages.photoUri) return;

      try {
        const base64 = await FileSystem.readAsStringAsync(uploadedImages.photoUri, {
          encoding: "base64",
        });
        const fileBuffer = base64ToUint8Array(base64);
        const tags = await ExifReader.load(fileBuffer.buffer);

        const getTag = (keys: string[]) => {
          for (const key of keys) {
            if (tags[key]?.description) return tags[key].description;
            if (tags[key]?.value) return tags[key].value.toString();
          }
          return "不明";
        };

        const realPhotoData: PhotoData = {
          cameraName: getTag(["Model", "Make"]) || "不明",
          lensName: getTag(["LensModel", "LensType", "LensInfo"]) || "不明",
          iso: parseInt(getTag(["ISOSpeedRatings", "ISO"]) || "0", 10),
          aperture: getTag(["FNumber"]) ? `F${getTag(["FNumber"])}` : "不明",
          shutterSpeed: getTag(["ExposureTime"]) || "不明",
          focalLength: getTag(["FocalLength"]) ? `${getTag(["FocalLength"])}` : "不明",
          whiteBalance: getTag(["WhiteBalance"]) || "自動",
          mode: getTag(["ExposureProgram"]) || "Auto",
          dateTimeOriginal: getTag(["DateTimeOriginal", "DateTimeDigitized", "DateTime"]),
          filmSimulation: getTag(["FilmMode", "FilmSimulation", "Saturation"]),
          dynamicRange: getTag(["DynamicRange"]),
          focalLength35mm: getTag(["FocalLengthIn35mmFilm", "FocalLength35efl"]),
          exposureProgram: getTag(["ExposureProgram"]),
          flash: getTag(["Flash"]),
          meteringMode: getTag(["MeteringMode"]),
          exposureBias: getTag(["ExposureBiasValue"]),
        };

        setExtractedData(realPhotoData);
        setPhotoData(realPhotoData);
      } catch (error) {
        console.error("EXIF extraction failed:", error);
      }
    };

    extractExif();
  }, [fadeAnim, setPhotoData, uploadedImages.photoUri]);

  const handleViewAdvice = () => {
    navigateToScreen("advice");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigateToScreen("upload")}
          style={styles.backButton}
          testID="back-button"
        >
          <ArrowLeft size={24} color="#1a4d2e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>アップロード完了</Text>
        <View style={styles.placeholder} />
      </View>

      <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <View style={styles.successCard}>
              <CheckCircle size={64} color="#2e7d46" strokeWidth={2} />
              <Text style={styles.successTitle}>アップロード完了</Text>
              <Text style={styles.successText}>
                写真と撮影データを受信しました
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>写真</Text>
              <View style={styles.imageCard}>
                {uploadedImages.photoUri && (
                  <Image
                    source={{ uri: uploadedImages.photoUri }}
                    style={styles.image}
                  />
                )}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>撮影データ</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.screenshotScroll}
              >
                {uploadedImages.screenshotUris.map((uri, index) => (
                  <View key={index} style={styles.screenshotCard}>
                    <Image source={{ uri: uri }} style={styles.image} />
                  </View>
                ))}
              </ScrollView>
            </View>

            <View style={styles.dataCard}>
              <Text style={styles.dataTitle}>検出された撮影情報</Text>
              
              {extractedData ? (
                <>
                  <View style={styles.dataRow}>
                    <Text style={styles.dataLabel}>カメラ</Text>
                    <Text style={styles.dataValue}>{extractedData.cameraName}</Text>
                  </View>

                  <View style={styles.dataRow}>
                    <Text style={styles.dataLabel}>レンズ</Text>
                    <Text style={styles.dataValue}>{extractedData.lensName}</Text>
                  </View>

                  <View style={styles.dataRow}>
                    <Text style={styles.dataLabel}>ISO</Text>
                    <Text style={styles.dataValue}>{extractedData.iso}</Text>
                  </View>

                  <View style={styles.dataRow}>
                    <Text style={styles.dataLabel}>絞り</Text>
                    <Text style={styles.dataValue}>{extractedData.aperture}</Text>
                  </View>

                  <View style={styles.dataRow}>
                    <Text style={styles.dataLabel}>シャッター</Text>
                    <Text style={styles.dataValue}>{extractedData.shutterSpeed}</Text>
                  </View>

                  <View style={styles.dataRow}>
                    <Text style={styles.dataLabel}>焦点距離</Text>
                    <Text style={styles.dataValue}>{extractedData.focalLength}</Text>
                  </View>

                  <View style={styles.dataRow}>
                    <Text style={styles.dataLabel}>WB</Text>
                    <Text style={styles.dataValue}>{extractedData.whiteBalance}</Text>
                  </View>

                  <View style={styles.dataRow}>
                    <Text style={styles.dataLabel}>モード</Text>
                    <Text style={styles.dataValue}>{extractedData.mode}</Text>
                  </View>
                </>
              ) : (
                <Text style={styles.dataNote}>解析中...</Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.adviceButton}
              onPress={handleViewAdvice}
              testID="view-advice-button"
            >
              <Text style={styles.adviceButtonText}>AIアドバイスを見る</Text>
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
  successCard: {
    backgroundColor: "#e8f5e9",
    borderRadius: 16,
    padding: 32,
    alignItems: "center" as const,
    marginBottom: 32,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#1a4d2e",
    marginTop: 16,
    marginBottom: 8,
  },
  successText: {
    fontSize: 14,
    color: "#5a7c5f",
    textAlign: "center" as const,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#1a4d2e",
    marginBottom: 12,
  },
  imageCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden" as const,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 240,
    resizeMode: "contain" as const,
    backgroundColor: "#f5f7f5",
  },
  screenshotScroll: {
    flexDirection: "row" as const,
  },
  screenshotCard: {
    width: 200,
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden" as const,
    borderWidth: 1,
    borderColor: "#e8ebe8",
    marginRight: 12,
  },
  dataCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  dataTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#1a4d2e",
    marginBottom: 8,
  },
  dataNote: {
    fontSize: 12,
    color: "#8a9a8f",
    marginBottom: 16,
    fontStyle: "italic" as const,
  },
  dataRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f2f0",
  },
  dataLabel: {
    fontSize: 15,
    color: "#5a7c5f",
  },
  dataValue: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#1a4d2e",
  },
  adviceButton: {
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
  adviceButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#fff",
  },
});
