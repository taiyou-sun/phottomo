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

const beginnerQuestions: Question[] = [
  {
    id: 'subject',
    question: 'どんな被写体を撮影しますか？',
    options: [
      { value: 'landscape', label: '風景' },
      { value: 'portrait', label: '人物' },
      { value: 'street', label: '街撮り' },
      { value: 'general', label: '幅広く撮りたい' },
    ],
  },
  {
    id: 'feature',
    question: '重視する機能は？',
    options: [
      { value: 'easy', label: '使いやすさ' },
      { value: 'quality', label: '画質' },
      { value: 'size', label: 'コンパクトさ' },
      { value: 'video', label: '動画機能' },
    ],
  },
  {
    id: 'budget',
    question: 'ご予算は？',
    options: [
      { value: '10-20', label: '10〜20万円' },
      { value: '20+', label: '20万円以上' },
    ],
  },
];

const intermediateQuestions: Question[] = [
  {
    id: 'style',
    question: '撮影スタイルは？',
    options: [
      { value: 'landscape', label: '風景中心' },
      { value: 'portrait', label: 'ポートレート' },
      { value: 'street', label: 'スナップ' },
      { value: 'video', label: '動画も撮る' },
    ],
  },
  {
    id: 'lens',
    question: 'よく使うレンズは？',
    options: [
      { value: 'wide', label: '広角' },
      { value: 'standard', label: '標準' },
      { value: 'telephoto', label: '望遠' },
      { value: 'zoom', label: 'ズーム' },
    ],
  },
  {
    id: 'balance',
    question: '画質と機動性のバランスは？',
    options: [
      { value: 'quality', label: '画質優先' },
      { value: 'balanced', label: 'バランス型' },
      { value: 'mobility', label: '機動性優先' },
    ],
  },
  {
    id: 'budget',
    question: 'ご予算は？',
    options: [
      { value: '10-20', label: '10〜20万円' },
      { value: '20-30', label: '20〜30万円' },
      { value: '30+', label: '30万円以上' },
    ],
  },
];

const advancedQuestions: Question[] = [
  {
    id: 'sensor',
    question: 'センサーサイズの優先度は？',
    options: [
      { value: 'high-res', label: '高解像度優先' },
      { value: 'speed', label: 'スピード優先' },
      { value: 'balanced', label: 'バランス重視' },
    ],
  },
  {
    id: 'af',
    question: 'AF性能の要求は？',
    options: [
      { value: 'critical', label: '最重要（スポーツ等）' },
      { value: 'important', label: '重要' },
      { value: 'moderate', label: '標準で十分' },
    ],
  },
  {
    id: 'video',
    question: '動画仕様は？',
    options: [
      { value: '8k', label: '8K必須' },
      { value: '4k60', label: '4K/60p以上' },
      { value: 'basic', label: '基本的でOK' },
    ],
  },
  {
    id: 'proFeatures',
    question: '必要なプロ機能は？',
    options: [
      { value: 'dual-slot', label: 'デュアルスロット' },
      { value: 'weather', label: '防塵防滴' },
      { value: 'ergonomics', label: 'エルゴノミクス' },
      { value: 'all', label: 'すべて必要' },
    ],
  },
  {
    id: 'budget',
    question: 'ご予算は？',
    options: [
      { value: '20-30', label: '20〜30万円' },
      { value: '30-50', label: '30〜50万円' },
      { value: '50+', label: '50万円以上' },
    ],
  },
];

export default function CameraSurveyScreen() {
  const { surveyAnswers, setSurveyAnswers, navigateToScreen } = useApp();
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState<number>(0);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const experienceLevel = surveyAnswers.experience || null;
  const questions = experienceLevel === 'beginner'
    ? beginnerQuestions
    : experienceLevel === 'intermediate'
    ? intermediateQuestions
    : experienceLevel === 'advanced'
    ? advancedQuestions
    : [];

  const isFirstQuestion = !experienceLevel;
  const currentQuestion = isFirstQuestion
    ? {
        id: 'experience',
        question: '写真撮影の経験は？',
        options: [
          { value: 'beginner', label: '初級者' },
          { value: 'intermediate', label: '中級者' },
          { value: 'advanced', label: '上級者' },
        ],
      }
    : questions[currentQuestionIndex];

  React.useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [currentQuestionIndex, experienceLevel, fadeAnim]);

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...surveyAnswers, [questionId]: value };
    setSurveyAnswers(newAnswers);

    if (isFirstQuestion) {
      setCurrentQuestionIndex(0);
    } else if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      navigateToScreen('recommendation');
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (experienceLevel) {
      setSurveyAnswers({});
      setCurrentQuestionIndex(0);
    } else {
      navigateToScreen('home');
    }
  };

  const progress = isFirstQuestion
    ? 0
    : ((currentQuestionIndex + 1) / questions.length) * 100;

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
        <Text style={styles.appName}>カメラ診断</Text>
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
              質問 {isFirstQuestion ? 1 : currentQuestionIndex + 2} / {isFirstQuestion ? '?' : questions.length + 1}
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
