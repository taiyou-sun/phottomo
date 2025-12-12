import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bluetooth } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

export default function ConnectingScreen() {
  const { navigateToScreen } = useApp();
  const [status, setStatus] = React.useState<string>('デバイスを検索中...');
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    const timer1 = setTimeout(() => setStatus('ペアリング中...'), 1500);
    const timer2 = setTimeout(() => setStatus('接続完了！'), 2500);
    const timer3 = setTimeout(() => navigateToScreen('photoData'), 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      pulse.stop();
    };
  }, [navigateToScreen, pulseAnim, fadeAnim]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <Bluetooth size={64} color="#2e7d46" strokeWidth={2} />
        </Animated.View>

        <Text style={styles.title}>カメラを接続</Text>
        <Text style={styles.status}>{status}</Text>

        <View style={styles.dotsContainer}>
          <View style={[styles.dot, status.includes('検索') && styles.dotActive]} />
          <View style={[styles.dot, status.includes('ペアリング') && styles.dotActive]} />
          <View style={[styles.dot, status.includes('完了') && styles.dotActive]} />
        </View>
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
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e8f5e9',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#1a4d2e',
    marginBottom: 16,
  },
  status: {
    fontSize: 16,
    color: '#5a7c5f',
    marginBottom: 40,
  },
  dotsContainer: {
    flexDirection: 'row' as const,
    gap: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#d0d7d0',
  },
  dotActive: {
    backgroundColor: '#2e7d46',
  },
});
