import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Check } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { selectLens, Lens } from '@/mocks/lenses';

export default function LensRecommendationScreen() {
  const { lensSurveyAnswers, navigateToScreen, resetLensSurveyAnswers } = useApp();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const { recommended, alternatives } = selectLens(lensSurveyAnswers);

  const LensCard = ({ lens, isRecommended = false }: { lens: Lens; isRecommended?: boolean }) => (
    <View style={[styles.lensCard, isRecommended && styles.recommendedCard]}>
      {isRecommended && (
        <View style={styles.recommendedBadge}>
          <Check size={16} color="#fff" strokeWidth={3} />
          <Text style={styles.recommendedText}>おすすめ</Text>
        </View>
      )}
      <Image source={{ uri: lens.imageUrl }} style={styles.lensImage} />
      <View style={styles.lensInfo}>
        <Text style={styles.lensName}>{lens.name}</Text>
        <Text style={styles.lensPrice}>{lens.price}</Text>
        <Text style={styles.lensDescription}>{lens.description}</Text>

        <View style={styles.featuresContainer}>
          {lens.features.map((feature, index) => (
            <View key={index} style={styles.featureBadge}>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>診断結果</Text>
        <TouchableOpacity
          onPress={() => navigateToScreen('settings')}
          style={styles.settingsButton}
          testID="settings-button"
        >
          <Settings size={24} color="#1a4d2e" />
        </TouchableOpacity>
      </View>

      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.title}>あなたにぴったりのレンズ</Text>
            <LensCard lens={recommended} isRecommended />

            <Text style={styles.alternativesTitle}>他の候補</Text>
            {alternatives.map((lens) => (
              <LensCard key={lens.id} lens={lens} />
            ))}

            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => {
                resetLensSurveyAnswers();
                navigateToScreen('home');
              }}
              testID="home-button"
            >
              <Text style={styles.homeButtonText}>ホームに戻る</Text>
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
  appName: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1a4d2e',
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
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1a4d2e',
    marginBottom: 16,
  },
  lensCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  recommendedCard: {
    borderWidth: 3,
    borderColor: '#2e7d46',
  },
  recommendedBadge: {
    position: 'absolute' as const,
    top: 16,
    right: 16,
    backgroundColor: '#2e7d46',
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 10,
    gap: 4,
  },
  recommendedText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700' as const,
  },
  lensImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#e8ebe8',
  },
  lensInfo: {
    padding: 20,
  },
  lensName: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1a4d2e',
    marginBottom: 8,
  },
  lensPrice: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#2e7d46',
    marginBottom: 12,
  },
  lensDescription: {
    fontSize: 15,
    color: '#5a7c5f',
    lineHeight: 22,
    marginBottom: 16,
  },
  featuresContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 8,
  },
  featureBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  featureText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#2e7d46',
  },
  alternativesTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1a4d2e',
    marginTop: 8,
    marginBottom: 16,
  },
  homeButton: {
    backgroundColor: '#2e7d46',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center' as const,
    marginTop: 8,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#fff',
  },
});
