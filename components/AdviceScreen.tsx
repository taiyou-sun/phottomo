import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Edit3 } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { shootingIntents, transformAdviceByStyle } from '@/mocks/adviceData';

export default function AdviceScreen() {
  const { photoData, coachingStyle, navigateToScreen, resetAll } = useApp();
  const [selectedIntent, setSelectedIntent] = React.useState<string | null>(null);
  const [customIntent, setCustomIntent] = React.useState<string>('');
  const [showCustomInput, setShowCustomInput] = React.useState<boolean>(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  if (!photoData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>撮影データが見つかりません</Text>
        </View>
      </SafeAreaView>
    );
  }

  const selectedIntentData = shootingIntents.find((intent) => intent.id === selectedIntent);
  
  const getTransformedAdvice = () => {
    if (selectedIntent === 'custom' && customIntent.trim()) {
      const baseAdvice = [
        `「${customIntent}」という意図に合わせて、構図を工夫してみましょう`,
        '光の向きと強さを意識すると、より表現力が高まります',
        '撮影設定を調整して、意図した雰囲気を作り出しましょう',
        '何度も撮り直して、ベストな一枚を探してみてください',
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
                  ISO{photoData.iso} / {photoData.aperture} / {photoData.shutterSpeed}
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
                  onPress={() => {
                    setSelectedIntent(intent.id);
                    setShowCustomInput(false);
                  }}
                  testID={`intent-${intent.id}`}
                >
                  <Text
                    style={[
                      styles.intentTitle,
                      selectedIntent === intent.id && styles.intentTitleSelected,
                    ]}
                  >
                    {intent.title}
                  </Text>
                  <Text
                    style={[
                      styles.intentDescription,
                      selectedIntent === intent.id && styles.intentDescriptionSelected,
                    ]}
                  >
                    {intent.description}
                  </Text>
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity
                style={[
                  styles.intentCard,
                  selectedIntent === 'custom' && styles.intentCardSelected,
                ]}
                onPress={() => {
                  setSelectedIntent('custom');
                  setShowCustomInput(true);
                }}
                testID="intent-custom"
              >
                <View style={styles.customIntentHeader}>
                  <Edit3 size={20} color={selectedIntent === 'custom' ? '#2e7d46' : '#1a4d2e'} />
                  <Text
                    style={[
                      styles.intentTitle,
                      { marginLeft: 8 },
                      selectedIntent === 'custom' && styles.intentTitleSelected,
                    ]}
                  >
                    自由に入力
                  </Text>
                </View>
                <Text
                  style={[
                    styles.intentDescription,
                    selectedIntent === 'custom' && styles.intentDescriptionSelected,
                  ]}
                >
                  あなたの撮影意図を自由に入力してください
                </Text>
              </TouchableOpacity>
              
              {showCustomInput && selectedIntent === 'custom' && (
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

            {((selectedIntentData && selectedIntent !== 'custom') || (selectedIntent === 'custom' && customIntent.trim())) && (
              <View style={styles.adviceSection}>
                <Text style={styles.adviceTitle}>
                  {coachingStyle === 'phottomo' && '📷 '}
                  AIアドバイス
                </Text>
                {transformedAdvice.map((advice, index) => (
                  <View key={index} style={styles.adviceItem}>
                    <View style={styles.adviceBullet} />
                    <Text style={styles.adviceText}>{advice}</Text>
                  </View>
                ))}

                {selectedIntentData && selectedIntent !== 'custom' && (
                  <View style={styles.settingsComparison}>
                    <Text style={styles.comparisonTitle}>現在の設定との比較</Text>
                    <View style={styles.comparisonTable}>
                      <View style={styles.comparisonRow}>
                        <Text style={styles.comparisonLabel}>絞り</Text>
                        <Text style={styles.comparisonCurrent}>{photoData.aperture}</Text>
                        <Text style={styles.comparisonRecommended}>
                          {selectedIntentData.settingsSuggestions.aperture}
                        </Text>
                      </View>
                      <View style={styles.comparisonRow}>
                        <Text style={styles.comparisonLabel}>ISO</Text>
                        <Text style={styles.comparisonCurrent}>{photoData.iso}</Text>
                        <Text style={styles.comparisonRecommended}>
                          {selectedIntentData.settingsSuggestions.iso}
                        </Text>
                      </View>
                      <View style={styles.comparisonRow}>
                        <Text style={styles.comparisonLabel}>シャッター</Text>
                        <Text style={styles.comparisonCurrent}>{photoData.shutterSpeed}</Text>
                        <Text style={styles.comparisonRecommended}>
                          {selectedIntentData.settingsSuggestions.shutterSpeed}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
                
                {selectedIntent === 'custom' && customIntent.trim() && (
                  <View style={styles.customIntentNote}>
                    <Text style={styles.customIntentNoteText}>
                      💡 カスタム意図のため、設定の比較は表示されません。あなたの意図に合わせて、自由に撮影設定を調整してみてください。
                    </Text>
                  </View>
                )}
              </View>
            )}

            <View style={styles.actionButtons}>
              {selectedIntent && (
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => {
                    setSelectedIntent(null);
                    setShowCustomInput(false);
                    setCustomIntent('');
                  }}
                  testID="change-intent-button"
                >
                  <Text style={styles.secondaryButtonText}>撮影意図を変更する</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => resetAll()}
                testID="new-photo-button"
              >
                <Text style={styles.primaryButtonText}>新しい写真を撮影する</Text>
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
  errorContainer: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  errorText: {
    fontSize: 16,
    color: '#5a7c5f',
  },
  dataSummary: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#1a4d2e',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row' as const,
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#5a7c5f',
    width: 80,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#1a4d2e',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1a4d2e',
    marginBottom: 16,
  },
  intentCards: {
    gap: 12,
    marginBottom: 24,
  },
  intentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e8ebe8',
  },
  intentCardSelected: {
    borderColor: '#2e7d46',
    backgroundColor: '#f0f8f2',
  },
  intentTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1a4d2e',
    marginBottom: 4,
  },
  intentTitleSelected: {
    color: '#2e7d46',
  },
  intentDescription: {
    fontSize: 14,
    color: '#5a7c5f',
  },
  intentDescriptionSelected: {
    color: '#2e7d46',
  },
  adviceSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  adviceTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1a4d2e',
    marginBottom: 16,
  },
  adviceItem: {
    flexDirection: 'row' as const,
    marginBottom: 12,
  },
  adviceBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2e7d46',
    marginTop: 7,
    marginRight: 12,
  },
  adviceText: {
    flex: 1,
    fontSize: 15,
    color: '#2a3a2a',
    lineHeight: 22,
  },
  settingsComparison: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e8ebe8',
  },
  comparisonTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#1a4d2e',
    marginBottom: 12,
  },
  comparisonTable: {
    gap: 8,
  },
  comparisonRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: 8,
  },
  comparisonLabel: {
    fontSize: 14,
    color: '#5a7c5f',
    width: 90,
  },
  comparisonCurrent: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#1a4d2e',
    flex: 1,
  },
  comparisonRecommended: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#2e7d46',
    flex: 1,
  },
  actionButtons: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#2e7d46',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center' as const,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#fff',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center' as const,
    borderWidth: 2,
    borderColor: '#2e7d46',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#2e7d46',
  },
  customIntentHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  customInputContainer: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#2e7d46',
  },
  customInput: {
    fontSize: 15,
    color: '#1a4d2e',
    minHeight: 80,
    textAlignVertical: 'top' as const,
    lineHeight: 22,
  },
  customIntentNote: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e8ebe8',
  },
  customIntentNoteText: {
    fontSize: 14,
    color: '#5a7c5f',
    lineHeight: 20,
  },
});
