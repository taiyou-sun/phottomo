import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Check } from 'lucide-react-native';
import { useApp, CoachingStyle } from '@/contexts/AppContext';

interface StyleOption {
  id: CoachingStyle;
  name: string;
  description: string;
  sampleAdvice: string[];
  emoji: string;
}

const coachingStyles: StyleOption[] = [
  {
    id: 'phottomo',
    name: 'ふぉっとも君',
    emoji: '📷',
    description: '優しく楽しく、語尾に「ニャ」がつく可愛らしいコーチング',
    sampleAdvice: [
      '絞りをF8にすると、手前から奥までピントが合うニャ！',
      'ISOは低く保つと、とってもきれいな写真になるニャン！',
    ],
  },
  {
    id: 'logical',
    name: 'ロジカル博士',
    emoji: '🔬',
    description: '専門用語と数値を用いた論理的で詳細なアドバイス',
    sampleAdvice: [
      '被写界深度を最大化するため、F8〜F11の絞り値を推奨します。',
      'ISO感度は100〜400に設定することで、S/N比が向上します。',
    ],
  },
  {
    id: 'supportive',
    name: '寄り添いカウンセラー',
    emoji: '🤝',
    description: '励ましながら優しく教えてくれる温かいアドバイス',
    sampleAdvice: [
      '大丈夫、絞りをF8にするだけで、素敵な風景写真が撮れますよ！',
      'ISOを低く保つと、とってもきれいな写真になります。焦らずゆっくりね。',
    ],
  },
  {
    id: 'spartan',
    name: 'スパルタ鬼軍曹',
    emoji: '💪',
    description: '厳しく命令的に、プロを目指す人向けの本格指導',
    sampleAdvice: [
      '絞りはF8〜F11だ！手前から奥まで全部シャープに撮れ！',
      'ISOは100〜400に保て！ノイズなど許されん！',
    ],
  },
];

export default function SettingsScreen() {
  const { coachingStyle, setCoachingStyle, previousScreen, navigateToScreen } = useApp();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleSelectStyle = (style: CoachingStyle) => {
    setCoachingStyle(style);
  };

  const handleComplete = () => {
    navigateToScreen(previousScreen || 'home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleComplete}
          style={styles.backButton}
          testID="back-button"
        >
          <ChevronLeft size={24} color="#1a4d2e" />
        </TouchableOpacity>
        <Text style={styles.appName}>コーチングスタイル</Text>
        <View style={styles.placeholder} />
      </View>

      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.title}>AIのアドバイススタイルを選択</Text>
            <Text style={styles.subtitle}>
              写真撮影のアドバイスをどのような口調で受け取りたいか選んでください
            </Text>

            <View style={styles.stylesContainer}>
              {coachingStyles.map((style) => (
                <TouchableOpacity
                  key={style.id}
                  style={[
                    styles.styleCard,
                    coachingStyle === style.id && styles.styleCardSelected,
                  ]}
                  onPress={() => handleSelectStyle(style.id)}
                  testID={`style-${style.id}`}
                >
                  {coachingStyle === style.id && (
                    <View style={styles.selectedBadge}>
                      <Check size={16} color="#fff" strokeWidth={3} />
                      <Text style={styles.selectedText}>選択中</Text>
                    </View>
                  )}

                  <Text style={styles.styleEmoji}>{style.emoji}</Text>
                  <Text style={styles.styleName}>{style.name}</Text>
                  <Text style={styles.styleDescription}>{style.description}</Text>

                  <View style={styles.sampleContainer}>
                    <Text style={styles.sampleLabel}>サンプル:</Text>
                    {style.sampleAdvice.map((advice, index) => (
                      <Text key={index} style={styles.sampleText}>
                        • {advice}
                      </Text>
                    ))}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleComplete}
              testID="complete-button"
            >
              <Text style={styles.completeButtonText}>完了</Text>
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
    backgroundColor: '#f5f7f5',
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
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
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1a4d2e',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#5a7c5f',
    lineHeight: 22,
    marginBottom: 24,
  },
  stylesContainer: {
    gap: 16,
  },
  styleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#e8ebe8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  styleCardSelected: {
    borderColor: '#2e7d46',
    backgroundColor: '#f0f8f2',
  },
  selectedBadge: {
    position: 'absolute' as const,
    top: 12,
    right: 12,
    backgroundColor: '#2e7d46',
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  selectedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700' as const,
  },
  styleEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  styleName: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1a4d2e',
    marginBottom: 8,
  },
  styleDescription: {
    fontSize: 14,
    color: '#5a7c5f',
    lineHeight: 20,
    marginBottom: 12,
  },
  sampleContainer: {
    backgroundColor: '#f5f7f5',
    borderRadius: 8,
    padding: 12,
  },
  sampleLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#5a7c5f',
    marginBottom: 6,
  },
  sampleText: {
    fontSize: 13,
    color: '#2a3a2a',
    lineHeight: 18,
    marginBottom: 4,
  },
  completeButton: {
    backgroundColor: '#2e7d46',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center' as const,
    marginTop: 24,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#fff',
  },
});
