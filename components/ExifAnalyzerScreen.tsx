import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
// @ts-ignore
import ExifReader from "exifreader";
import { SafeAreaView } from "react-native-safe-area-context";
import { Camera, FileImage, Sparkles, ArrowLeft } from "lucide-react-native";
import * as ImageManipulator from "expo-image-manipulator";
import { base64ToUint8Array } from "@/utils";
import { useApp } from "@/contexts/AppContext";

const API_URL = process.env.EXPO_PUBLIC_AWS_API_URL || "";
const API_KEY = process.env.EXPO_PUBLIC_AWS_API_KEY || "";

interface ExifData {
  // Basic Info
  make: string | null;
  model: string | null;
  dateTimeOriginal: string | null;

  // Shooting Settings
  iso: string | null;
  fNumber: string | null;
  exposureTime: string | null;
  focalLength: string | null;
  lensModel: string | null;

  // Maker Notes (Fujifilm specific etc)
  filmSimulation: string | null;
  dynamicRange: string | null;
  whiteBalance: string | null;
  focalLength35mm: string | null;
  exposureProgram: string | null;
  flash: string | null;
  meteringMode: string | null;
  exposureBias: string | null;
}

export default function ExifAnalyzerScreen() {
  const { navigateToScreen } = useApp();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [exifData, setExifData] = useState<ExifData | null>(null);
  const [loading, setLoading] = useState(false);
  const [rawTags, setRawTags] = useState<any>(null);
  const [advice, setAdvice] = useState<string | null>(null);
  const [analyzingAdvice, setAnalyzingAdvice] = useState(false);

  const getAiAdvice = async () => {
    if (!imageUri || !exifData) return;

    setAnalyzingAdvice(true);
    setAdvice(null);

    try {
      // 1. Resize and compress image to avoid Lambda payload limit (6MB)
      const manipulated = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 1024 } }], // Resize to reasonable width
        {
          compress: 0.7,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );

      if (!manipulated.base64) {
        throw new Error("Failed to process image");
      }

      // 2. Call API
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY
        },
        body: JSON.stringify({
          image_base64: manipulated.base64,
          exif_data: exifData,
          intent: "この写真をもっと良くしたい", // Default intent for now
          persona: "phottomo",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      setAdvice(data.advice);
    } catch (error: any) {
      Alert.alert(
        "Error",
        "AIアドバイスの取得に失敗しました: " + error.message
      );
      console.error(error);
    } finally {
      setAnalyzingAdvice(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
        // We don't rely on the basic 'exif' property from ImagePicker as we use ExifReader
        exif: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        analyzeExif(uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
      console.error(error);
    }
  };

  const analyzeExif = async (uri: string) => {
    setLoading(true);
    setExifData(null);
    setRawTags(null);

    try {
      // 1. Read file as Base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: "base64",
      });

      // 2. Parse with ExifReader
      const fileBuffer = base64ToUint8Array(base64);
      const tags = await ExifReader.load(fileBuffer.buffer);

      // Log for debugging (as requested)
      console.log("--- Parsed EXIF Tags ---");
      // Avoid logging the huge base64 or binary buffers if any
      const loggableTags: any = {};
      Object.keys(tags).forEach((key) => {
        if (key !== "MakerNote" && key !== "UserComment") {
          // MakerNote can be huge binary sometimes if not parsed
          loggableTags[key] = tags[key].description || tags[key].value;
        }
      });
      console.log(JSON.stringify(loggableTags, null, 2));
      setRawTags(tags);

      // 3. Extract Data Logic
      const extractTag = (keys: string[]): string | null => {
        for (const key of keys) {
          if (tags[key] && tags[key].description) {
            return tags[key].description;
          }
          if (tags[key] && tags[key].value) {
            // Handle array values (sometimes rational numbers come as arrays)
            if (Array.isArray(tags[key].value)) {
              return tags[key].value.toString();
            }
            return tags[key].value.toString();
          }
        }
        return null;
      };

      // Helper for fraction conversion if needed (ExifReader usually handles description well, but just in case)
      // For now relying on .description provided by ExifReader

      const data: ExifData = {
        // Basic
        make: extractTag(["Make"]),
        model: extractTag(["Model"]),
        dateTimeOriginal: extractTag([
          "DateTimeOriginal",
          "DateTimeDigitized",
          "DateTime",
        ]),

        // Settings
        iso: extractTag(["ISOSpeedRatings", "ISO"]),
        fNumber: extractTag(["FNumber"]),
        exposureTime: extractTag(["ExposureTime"]),
        focalLength: extractTag(["FocalLength"]),
        lensModel: extractTag(["LensModel", "LensType", "LensInfo"]),

        // Maker Notes (Fujifilm specific attempts)
        // Note: ExifReader tries to parse MakerNotes. Keys might be 'FilmMode', 'FilmSimulation', etc.
        // We check multiple possibilities based on common Fujifilm tags.
        filmSimulation: extractTag([
          "FilmMode",
          "FilmSimulation",
          "Saturation",
        ]), // 'Saturation' sometimes holds film sim in older models or generic mapping
        dynamicRange: extractTag(["DynamicRange"]),
        whiteBalance: extractTag(["WhiteBalance"]),
        focalLength35mm: extractTag(["FocalLengthIn35mmFilm", "FocalLength35efl"]),
        exposureProgram: extractTag(["ExposureProgram"]),
        exposureBias: extractTag(["ExposureBiasValue"]),
        flash: extractTag(["Flash"]),
        meteringMode: extractTag(["MeteringMode"]),
      };

      // Deep search for Fujifilm Film Simulation if not found in top level
      // Sometimes it's inside a specific MakerNote tag that ExifReader might flatten with a prefix or keep nested?
      // ExifReader usually flattens tags. Let's look for specific Fujifilm values if possible.

      setExifData(data);
    } catch (error) {
      Alert.alert("Error", "Failed to analyze EXIF data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const DataRow = ({
    label,
    value,
    highlight = false,
  }: {
    label: string;
    value: string | null;
    highlight?: boolean;
  }) => (
    <View style={[styles.dataRow, highlight && styles.highlightRow]}>
      <Text style={styles.dataLabel}>{label}</Text>
      <Text style={[styles.dataValue, highlight && styles.highlightText]}>
        {value || "不明"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigateToScreen("home")}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>EXIF詳細解析</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <FileImage size={48} color="#ccc" />
              <Text style={styles.placeholderText}>写真を選択してください</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={pickImage}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Camera size={20} color="#fff" />
              <Text style={styles.buttonText}>写真を選択して解析</Text>
            </>
          )}
        </TouchableOpacity>

        {exifData && (
          <View style={styles.resultContainer}>
            <Text style={styles.sectionHeader}>基本情報</Text>
            <DataRow label="メーカー" value={exifData.make} />
            <DataRow label="機種名" value={exifData.model} />
            <DataRow label="撮影日時" value={exifData.dateTimeOriginal} />

            <Text style={styles.sectionHeader}>撮影設定</Text>
            <DataRow label="ISO感度" value={exifData.iso} />
            <DataRow label="F値" value={exifData.fNumber} />
            <DataRow label="シャッタースピード" value={exifData.exposureTime} />
            <DataRow label="露出補正" value={exifData.exposureBias} />
            <DataRow label="焦点距離" value={exifData.focalLength} />
            <DataRow label="レンズ" value={exifData.lensModel} />

            <Text style={styles.sectionHeader}>
              メーカー独自情報 (MakerNote)
            </Text>
            <DataRow
              label="フィルムシミュレーション"
              value={exifData.filmSimulation}
              highlight
            />
            <DataRow
              label="ダイナミックレンジ"
              value={exifData.dynamicRange}
              highlight
            />
            <DataRow
              label="ホワイトバランス"
              value={exifData.whiteBalance}
              highlight
            />
            <DataRow
              label="35mm換算焦点距離"
              value={exifData.focalLength35mm}
            />
            <DataRow
              label="撮影モード"
              value={exifData.exposureProgram}
            />
            <DataRow
              label="フラッシュ"
              value={exifData.flash}
            />
          </View>
        )}

        {exifData && (
          <View style={styles.adviceSection}>
            <TouchableOpacity
              style={[
                styles.aiButton,
                analyzingAdvice && styles.disabledButton,
              ]}
              onPress={getAiAdvice}
              disabled={analyzingAdvice}
            >
              {analyzingAdvice ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Sparkles size={20} color="#fff" />
                  <Text style={styles.buttonText}>AIアドバイスをもらう</Text>
                </>
              )}
            </TouchableOpacity>

            {advice && (
              <View style={styles.adviceContainer}>
                <Text style={styles.adviceTitle}>
                  🤖 AIコーチからのアドバイス
                </Text>
                <Text style={styles.adviceText}>{advice}</Text>
              </View>
            )}
          </View>
        )}

        {rawTags && (
          <View style={styles.debugContainer}>
            <Text style={styles.debugTitle}>
              Debug Info (Check Console for full logs)
            </Text>
            <Text style={styles.debugText}>
              Total Tags Found: {Object.keys(rawTags).length}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 4,
  },
  headerRight: {
    width: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  scrollContent: {
    padding: 16,
  },
  imageContainer: {
    height: 250,
    backgroundColor: "#e0e0e0",
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    alignItems: "center",
  },
  placeholderText: {
    marginTop: 8,
    color: "#888",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#2e7d46",
    padding: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e7d46",
    marginTop: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 4,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  highlightRow: {
    backgroundColor: "#f0f9f0",
    marginHorizontal: -8,
    paddingHorizontal: 8,
  },
  dataLabel: {
    color: "#666",
    flex: 1,
  },
  dataValue: {
    color: "#333",
    fontWeight: "500",
    flex: 2,
    textAlign: "right",
  },
  highlightText: {
    color: "#2e7d46",
    fontWeight: "bold",
  },
  adviceSection: {
    marginTop: 24,
  },
  aiButton: {
    flexDirection: "row",
    backgroundColor: "#7c4dff", // AIっぽい色
    padding: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    shadowColor: "#7c4dff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    opacity: 0.7,
  },
  adviceContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  adviceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  adviceText: {
    fontSize: 16,
    lineHeight: 26,
    color: "#495057",
  },
  debugContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
  debugTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
  },
  debugText: {
    fontSize: 12,
    color: "#666",
  },
});
