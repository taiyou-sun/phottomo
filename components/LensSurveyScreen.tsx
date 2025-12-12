import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Settings } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface Question {
  id: string;
  question: string;
  options: { value: string; label: string }[];
}

const lensQuestions: Question[] = [
  {
    id: 'subject',
    question: 'どんな被写体を撮影しますか？',
    options: [
      { value: 'landscape', label: '風景' },
      { value: 'portrait', label: '人物・ポートレート' },
      { value: 'sports', label: 'スポーツ・動き物' },
      { value: 'macro', label: 'マクロ・小物' },
      { value: 'general', label: '万能に使いたい' },
    ],
  },
  {
    id: 'focalLength',
    question: '焦点距離の好みは？',
    options: [
      { value: 'wide', label: '広角（風景・建築）' },
      { value: 'standard', label: '標準（スナップ）' },
      { value: 'telephoto', label: '望遠（遠い被写体）' },
      { value: 'zoom', label: 'ズームレンズ' },
      { value: 'prime', label: '単焦点レンズ' },
    ],
  },
  {
    id: 'aperture',
    question: '明るさ（F値）の優先度は？',
    options: [
      { value: 'high', label: '明るさ重視（F1.4〜F2.0）' },
      { value: 'moderate', label: 'バランス型（F2.8〜F4）' },
      { value: 'low', label: '気にしない' },
    ],
  },
  {
    id: 'budget',
    question: 'ご予算は？',
    options: [
      { value: 'low', label: '〜5万円' },
      { value: 'medium', label: '5〜10万円' },
      { value: 'high', label: '10万円以上' },
    ],
  },
];

export default function LensSurveyScreen() {
  const { lensSurveyAnswers, setLensSurveyAnswers, navigateToScreen } = useApp();
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState<number>(0);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const currentQuestion = lensQuestions[currentQuestionIndex];

  React.useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [currentQuestionIndex, fadeAnim]);

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...lensSurveyAnswers, [questionId]: value };
    setLensSurveyAnswers(newAnswers);

    if (currentQuestionIndex < lensQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      navigateToScreen('lensRecommendation');
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      navigateToScreen('home');
    }
  };

  const progress = ((currentQuestionIndex + 1) / lensQuestions.length) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          testID="back-button"
        >
          <ChevronLeft size={24} color="#1a4d2e" />
        </TouchableOpacity>
        <Text style={styles.appName}>レンズ診断</Text>
        <TouchableOpacity
          onPress={() => navigateToScreen('settings')}
          style={styles.settingsButton}
          testID="settings-button"
        >
          <Settings size={24} color="#1a4d2e" />
        </TouchableOpacity>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <Text style={styles.questionNumber}>
              質問 {currentQuestionIndex + 1} / {lensQuestions.length}
            </Text>
            <Text style={styles.question}>{currentQuestion.question}</Text>

            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.optionButton}
                  onPress={() => handleAnswer(currentQuestion.id, option.value)}
                  testID={`option-${option.value}`}
                >
                  <Text style={styles.optionText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
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
  settingsButton: {
    padding: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e8ebe8',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2e7d46',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  content: {
    flex: 1,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#5a7c5f',
    marginBottom: 12,
  },
  question: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#1a4d2e',
    marginBottom: 32,
    lineHeight: 36,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#e8ebe8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1a4d2e',
    textAlign: 'center' as const,
  },
});
