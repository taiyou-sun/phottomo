import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Download } from 'lucide-react-native';
import { useApp, PhotoData } from '@/contexts/AppContext';

export default function PhotoDataScreen() {
  const { navigateToScreen, setPhotoData } = useApp();
  const [progress, setProgress] = React.useState<number>(0);
  const [isComplete, setIsComplete] = React.useState<boolean>(false);
  const progressAnim = React.useRef(new Animated.Value(0)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsComplete(true);

          const mockPhotoData: PhotoData = {
            cameraName: 'FUJIFILM X-T5',
            lensName: 'XF16-80mmF4 R OIS WR',
            iso: 800,
            aperture: 'F4.0',
            shutterSpeed: '1/250',
            focalLength: '35mm',
            whiteBalance: '自動',
            mode: 'Aperture Priority',
          };
          setPhotoData(mockPhotoData);

          return 100;
        }
        const newProgress = prev + 5;
        Animated.timing(progressAnim, {
          toValue: newProgress,
          duration: 100,
          useNativeDriver: false,
        }).start();
        return newProgress;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [setPhotoData, progressAnim, fadeAnim]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.iconContainer}>
            <Download size={48} color="#2e7d46" strokeWidth={2} />
          </View>

          <Text style={styles.title}>撮影データを受信中</Text>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>{progress}%</Text>
          </View>

          {isComplete && (
            <Animated.View style={styles.dataCard}>
              <Text style={styles.dataTitle}>撮影データ</Text>

              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>カメラ</Text>
                <Text style={styles.dataValue}>FUJIFILM X-T5</Text>
              </View>

              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>レンズ</Text>
                <Text style={styles.dataValue}>XF16-80mmF4</Text>
              </View>

              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>ISO</Text>
                <Text style={styles.dataValue}>800</Text>
              </View>

              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>絞り</Text>
                <Text style={styles.dataValue}>F4.0</Text>
              </View>

              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>シャッター</Text>
                <Text style={styles.dataValue}>1/250</Text>
              </View>

              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>焦点距離</Text>
                <Text style={styles.dataValue}>35mm</Text>
              </View>

              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>WB</Text>
                <Text style={styles.dataValue}>自動</Text>
              </View>

              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>モード</Text>
                <Text style={styles.dataValue}>Aperture Priority</Text>
              </View>
            </Animated.View>
          )}

          {isComplete && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigateToScreen('advice')}
              testID="view-advice-button"
            >
              <Text style={styles.buttonText}>AIアドバイスを見る</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7f5',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center' as const,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e8f5e9',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1a4d2e',
    marginBottom: 32,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 40,
  },
  progressBar: {
    width: '100%',
    height: 12,
    backgroundColor: '#e8ebe8',
    borderRadius: 6,
    overflow: 'hidden' as const,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2e7d46',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1a4d2e',
    textAlign: 'center' as const,
  },
  dataCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  dataTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1a4d2e',
    marginBottom: 16,
  },
  dataRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f0',
  },
  dataLabel: {
    fontSize: 15,
    color: '#5a7c5f',
  },
  dataValue: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#1a4d2e',
  },
  button: {
    width: '100%',
    backgroundColor: '#2e7d46',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center' as const,
    shadowColor: '#2e7d46',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#fff',
  },
});
