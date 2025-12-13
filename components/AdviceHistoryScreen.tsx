import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { ChevronLeft, Calendar, Camera } from 'lucide-react-native';
import { useApp, AdviceHistory } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { getAdviceHistory } from '@/utils/adviceHistory';
import { useRouter } from 'expo-router';

export default function AdviceHistoryScreen() {
  const { navigateToScreen, setSelectedAdviceHistory } = useApp();
  const { user } = useAuth();
  const router = useRouter();
  const [histories, setHistories] = useState<AdviceHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadHistories = useCallback(async () => {
    if (!user) {
      Alert.alert('エラー', 'ログインが必要です');
      navigateToScreen('home');
      return;
    }

    try {
      setLoading(true);
      const data = await getAdviceHistory(user.uid);
      setHistories(data);
    } catch (error) {
      console.error('Error loading advice history:', error);
      Alert.alert('エラー', 'アドバイス履歴の読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  }, [user, navigateToScreen]);

  useFocusEffect(
    useCallback(() => {
      loadHistories();
    }, [loadHistories])
  );

  const handleHistoryPress = (item: AdviceHistory) => {
    setSelectedAdviceHistory(item);
    router.push('/advice-detail');
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const renderItem = ({ item }: { item: AdviceHistory }) => (
    <TouchableOpacity
      style={styles.historyCard}
      onPress={() => handleHistoryPress(item)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.photoUri }} style={styles.thumbnail} />
      <View style={styles.cardContent}>
        <Text style={styles.intentText} numberOfLines={1}>
          {item.intent}
        </Text>
        <View style={styles.metaRow}>
          <Camera size={14} color="#5a7c5f" />
          <Text style={styles.cameraText} numberOfLines={1}>
            {item.photoData.cameraName}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Calendar size={14} color="#5a7c5f" />
          <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

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
        <Text style={styles.appName}>過去のアドバイス</Text>
        <View style={styles.placeholder} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2e7d46" />
          <Text style={styles.loadingText}>読み込み中...</Text>
        </View>
      ) : histories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>アドバイス履歴がありません</Text>
          <Text style={styles.emptySubText}>
            AIコーチングを試して、アドバイスを受けましょう
          </Text>
        </View>
      ) : (
        <FlatList
          data={histories}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#5a7c5f',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1a4d2e',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#5a7c5f',
    textAlign: 'center' as const,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  historyCard: {
    flexDirection: 'row' as const,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  thumbnail: {
    width: 100,
    height: 100,
    backgroundColor: '#e8ebe8',
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between' as const,
  },
  intentText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1a4d2e',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
  },
  cameraText: {
    fontSize: 13,
    color: '#5a7c5f',
    flex: 1,
  },
  dateText: {
    fontSize: 13,
    color: '#5a7c5f',
  },
});
