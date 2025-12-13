import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Calendar, Camera, Sparkles } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'expo-router';

export default function AdviceDetailScreen() {
  const { navigateToScreen, selectedAdviceHistory } = useApp();
  const router = useRouter();

  if (!selectedAdviceHistory) {
    router.back();
    return null;
  }

  const { photoUri, photoData, advice, intent, createdAt } = selectedAdviceHistory;

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          testID="back-button"
        >
          <ChevronLeft size={24} color="#1a4d2e" />
        </TouchableOpacity>
        <Text style={styles.appName}>アドバイス詳細</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Image source={{ uri: photoUri }} style={styles.photo} resizeMode="cover" />

        <View style={styles.contentCard}>
          <View style={styles.intentSection}>
            <Text style={styles.intentLabel}>撮影意図</Text>
            <Text style={styles.intentText}>{intent}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.photoDataSection}>
            <Text style={styles.sectionTitle}>撮影データ</Text>
            <View style={styles.dataRow}>
              <Camera size={16} color="#5a7c5f" />
              <Text style={styles.dataLabel}>カメラ:</Text>
              <Text style={styles.dataValue}>{photoData.cameraName}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>レンズ:</Text>
              <Text style={styles.dataValue}>{photoData.lensName}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>設定:</Text>
              <Text style={styles.dataValue}>
                ISO{photoData.iso} / {photoData.aperture} / {photoData.shutterSpeed}
              </Text>
            </View>
            <View style={styles.dataRow}>
              <Calendar size={16} color="#5a7c5f" />
              <Text style={styles.dataLabel}>日時:</Text>
              <Text style={styles.dataValue}>{formatDate(createdAt)}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.adviceSection}>
            <View style={styles.adviceHeader}>
              <Sparkles size={20} color="#2e7d46" />
              <Text style={styles.sectionTitle}>AIコーチからのアドバイス</Text>
            </View>
            <View style={styles.adviceContent}>
              {advice.split('\n').map((line, index) => {
                const trimmedLine = line.trim();
                if (!trimmedLine) return null;

                if (
                  trimmedLine.startsWith('・') ||
                  trimmedLine.startsWith('- ') ||
                  /^\d+\./.test(trimmedLine)
                ) {
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
          </View>
        </View>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Text style={styles.closeButtonText}>戻る</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7f5',
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8ebe8',
  },
  backButton: {
    padding: 8,
  },
  appName: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1a4d2e',
    letterSpacing: 0.5,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  photo: {
    width: '100%',
    height: 300,
    backgroundColor: '#e8ebe8',
  },
  contentCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  intentSection: {
    marginBottom: 16,
  },
  intentLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#5a7c5f',
    marginBottom: 8,
  },
  intentText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1a4d2e',
  },
  divider: {
    height: 1,
    backgroundColor: '#e8ebe8',
    marginVertical: 16,
  },
  photoDataSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#1a4d2e',
    marginBottom: 12,
  },
  dataRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
    gap: 8,
  },
  dataLabel: {
    fontSize: 14,
    color: '#5a7c5f',
    minWidth: 60,
  },
  dataValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#1a4d2e',
    flex: 1,
  },
  adviceSection: {
    marginBottom: 8,
  },
  adviceHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    marginBottom: 12,
  },
  adviceContent: {
    gap: 8,
  },
  adviceParagraph: {
    fontSize: 15,
    lineHeight: 24,
    color: '#2a3a2a',
    marginBottom: 8,
  },
  bulletPoint: {
    flexDirection: 'row' as const,
    marginBottom: 8,
    paddingLeft: 8,
  },
  bulletDot: {
    fontSize: 15,
    lineHeight: 24,
    color: '#2e7d46',
    marginRight: 8,
    fontWeight: '700' as const,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
    color: '#2a3a2a',
  },
  closeButton: {
    backgroundColor: '#2e7d46',
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center' as const,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#fff',
  },
});
