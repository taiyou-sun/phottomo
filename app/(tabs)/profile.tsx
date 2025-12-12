import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mail, Camera, Sparkles, ChevronRight, Settings, HelpCircle, Info, Edit, X } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [cameraName, setCameraName] = useState('Canon EOS R5');
  const [tempCameraName, setTempCameraName] = useState('Canon EOS R5');
  const [isLoading, setIsLoading] = useState(false);
  const [isHelpModalVisible, setIsHelpModalVisible] = useState(false);
  const [helpSubject, setHelpSubject] = useState('');
  const [helpMessage, setHelpMessage] = useState('');
  const [isSendingHelp, setIsSendingHelp] = useState(false);
  const [helpImageUri, setHelpImageUri] = useState<string | null>(null);
  const [isPickingHelpImage, setIsPickingHelpImage] = useState(false);
  
  const handleLogout = async () => {
    Alert.alert(
      'ログアウト',
      'ログアウトしてもよろしいですか？',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: 'ログアウト',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('User confirmed logout');
              await signOut();
              router.replace('/');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('エラー', 'ログアウトに失敗しました');
            }
          },
        },
      ]
    );
  };

  const handleEditPress = () => {
    setTempCameraName(cameraName);
    setIsEditModalVisible(true);
  };

  const handlePickImage = async () => {
    try {
      setIsLoading(true);
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('エラー', '写真へのアクセス権限が必要です');
        setIsLoading(false);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setAvatarUri(result.assets[0].uri);
        console.log('Avatar image selected:', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('エラー', '画像の選択に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEdit = () => {
    setCameraName(tempCameraName);
    setIsEditModalVisible(false);
    console.log('Profile updated:', { avatarUri, cameraName: tempCameraName });
  };

  const handleCancelEdit = () => {
    setTempCameraName(cameraName);
    setIsEditModalVisible(false);
  };

  const StatItem = ({ label, value, color }: { label: string; value: string; color: string }) => (
    <View style={styles.statItem}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const SettingItem = ({ icon: Icon, label, onPress }: { icon: any; label: string; onPress?: () => void }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <Icon size={20} color="#5a7c5f" strokeWidth={2} />
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      <ChevronRight size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header with Custom Safe Area Handling */}
      <View style={[styles.headerBackground, { paddingTop: insets.top}]}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>プロフィール</Text>
          <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
            <Edit size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 + insets.bottom }]} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
              <View style={styles.avatar} />
            )}
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Mail size={20} color="#5a7c5f" strokeWidth={2} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>メールアドレス</Text>
              <Text style={styles.infoValue}>{user?.email || 'sakura@example.com'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoItem}>
            <Camera size={20} color="#5a7c5f" strokeWidth={2} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>使用カメラ</Text>
              <Text style={styles.infoValue}>{cameraName}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Sparkles size={20} color="#5a7c5f" strokeWidth={2} />
            <Text style={styles.statsTitle}>AIコーチング統計</Text>
          </View>

          <View style={styles.statsRow}>
            <StatItem label="撮影枚数" value="127" color="#2e7d46" />
            <StatItem label="アドバイス数" value="89" color="#f59e0b" />
            <StatItem label="平均スコア" value="4.8" color="#ef4444" />
          </View>
        </View>

        <View style={styles.settingsCard}>
          <View style={styles.settingsHeader}>
            <Settings size={20} color="#5a7c5f" strokeWidth={2} />
            <Text style={styles.settingsTitle}>設定</Text>
          </View>

          <View style={styles.settingsList}>
            {/* <SettingItem
              icon={Settings}
              label="通知設定"
              onPress={() => console.log('通知設定')}
            />
            <View style={styles.settingDivider} /> */}
            <SettingItem
              icon={HelpCircle}
              label="ヘルプ・サポート"
              onPress={() => setIsHelpModalVisible(true)}
            />
            <View style={styles.settingDivider} />
            <SettingItem
              icon={Info}
              label="アプリについて"
              onPress={() => console.log('アプリについて')}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutButtonText}>ログアウト</Text>
        </TouchableOpacity>
      </ScrollView>

        {/* Help & Support Modal */}
        <Modal
          visible={isHelpModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsHelpModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>ヘルプ・サポート</Text>
                <TouchableOpacity onPress={() => setIsHelpModalVisible(false)} style={styles.closeButton}>
                  <X size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text style={styles.helpTitle}>お問い合わせ</Text>

                  <Text style={styles.inputLabel}>件名</Text>
                  <TextInput
                    style={styles.helpInput}
                    value={helpSubject}
                    onChangeText={setHelpSubject}
                    placeholder="件名を入力"
                    placeholderTextColor="#999"
                  />

                  <Text style={[styles.inputLabel, { marginTop: 12 }]}>内容</Text>
                  <TextInput
                    style={styles.helpMessageInput}
                    value={helpMessage}
                    onChangeText={setHelpMessage}
                    placeholder="お問い合わせ内容を詳しくご記入ください。スクリーンショットなどがある場合はその旨を記載してください。"
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={6}
                  />

                  <Text style={[styles.inputLabel, { marginTop: 4, marginBottom: 6 }]}>画像添付</Text>
                  <View style={styles.helpImageRow}>
                    {helpImageUri ? (
                      <View style={styles.helpImageWrapper}>
                        <Image source={{ uri: helpImageUri }} style={styles.helpImagePreview} />
                        <TouchableOpacity
                          style={styles.helpImageRemoveButton}
                          onPress={() => setHelpImageUri(null)}
                          testID="remove-help-image"
                        >
                          <X size={14} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.helpContactButton}
                        onPress={async () => {
                          try {
                            setIsPickingHelpImage(true);
                            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
                            if (!permissionResult.granted) {
                              Alert.alert('エラー', '写真へのアクセス権限が必要です');
                              return;
                            }
                            const result = await ImagePicker.launchImageLibraryAsync({
                              mediaTypes: ['images'],
                              allowsEditing: true,
                              aspect: [4, 3],
                              quality: 0.7,
                            });
                            if (!result.canceled && result.assets[0]) {
                              setHelpImageUri(result.assets[0].uri);
                            }
                          } catch (err) {
                            console.error('Pick help image error', err);
                            Alert.alert('エラー', '画像の選択に失敗しました');
                          } finally {
                            setIsPickingHelpImage(false);
                          }
                        }}
                        activeOpacity={0.8}
                        testID="pick-help-image"
                      >
                        {isPickingHelpImage ? (
                          <ActivityIndicator color="#fff" />
                        ) : (
                          <Camera size={16} color="#fff" />
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={{ height: 12 }} />

                  <TouchableOpacity
                    style={styles.helpSendButton}
                    onPress={async () => {
                      if (!helpMessage.trim()) {
                        Alert.alert('入力エラー', '内容を入力してください');
                        return;
                      }
                      try {
                        setIsSendingHelp(true);
                        // TODO: ここで実際の送信APIを呼ぶ（未実装）。現状はログを残して成功扱いにする。
                        console.log('Send support message:', { subject: helpSubject, message: helpMessage, image: helpImageUri });
                        await new Promise((r) => setTimeout(r, 800));
                        Alert.alert('送信完了', 'お問い合わせを受け付けました。');
                        setHelpSubject('');
                        setHelpMessage('');
                        setHelpImageUri(null);
                        setIsHelpModalVisible(false);
                      } catch (err) {
                        console.error('Support send error', err);
                        Alert.alert('送信失敗', '送信に失敗しました。時間を置いて再度お試しください。');
                      } finally {
                        setIsSendingHelp(false);
                      }
                    }}
                    activeOpacity={0.8}
                    disabled={isSendingHelp}
                  >
                    {isSendingHelp ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.helpSendText}>送信</Text>
                    )}
                  </TouchableOpacity>

                </ScrollView>
              </View>
            </View>
          </View>
        </Modal>

      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancelEdit}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>プロフィール編集</Text>
              <TouchableOpacity onPress={handleCancelEdit} style={styles.closeButton}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>プロフィール画像</Text>
              <TouchableOpacity
                style={styles.avatarPickerContainer}
                onPress={handlePickImage}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="large" color="#2e5f4a" />
                ) : avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={styles.avatarPreview} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Camera size={32} color="#2e5f4a" />
                    <Text style={styles.avatarPlaceholderText}>画像を選択</Text>
                  </View>
                )}
              </TouchableOpacity>

              <Text style={styles.inputLabel}>使用カメラ</Text>
              <TextInput
                style={styles.textInput}
                value={tempCameraName}
                onChangeText={setTempCameraName}
                placeholder="カメラ名を入力"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelEdit}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>キャンセル</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveEdit}
                activeOpacity={0.7}
              >
                <Text style={styles.saveButtonText}>保存</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7f5',
  },
  headerBackground: {
    backgroundColor: '#2e5f4a',
  },
  headerContent: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#fff',
    letterSpacing: 0.5,
  },
  editButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 0,
  },
  profileSection: {
    alignItems: 'center' as const,
    marginTop: 20,
    marginBottom: 20,
  },
  avatarContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#2e5f4a',
    borderWidth: 4,
    borderColor: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1a4d2e',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
    maxHeight: 360,
  },
  faqItem: {
    marginBottom: 12,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#1a4d2e',
    marginBottom: 6,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: '#1a4d2e',
    marginBottom: 12,
  },
  faqAnswer: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
  },
  helpContactButton: {
    backgroundColor: '#2e5f4a',
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginTop: 8,
  },
  helpContactText: {
    color: '#fff',
    fontWeight: '700' as const,
  },
  helpInput: {
    backgroundColor: '#f5f7f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    color: '#111',
    width: '100%',
  },
  helpMessageInput: {
    backgroundColor: '#f5f7f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    color: '#111',
    textAlignVertical: 'top' as const,
    minHeight: 180,
    width: '100%',
  },
  helpSendButton: {
    backgroundColor: '#2e5f4a',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center' as const,
    marginTop: 12,
  },
  helpSendText: {
    color: '#fff',
    fontWeight: '700' as const,
  },
  helpImageRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    marginTop: 4,
    width: '100%',
  },
  helpImageWrapper: {
    position: 'relative' as const,
    width: '100%',
  },
  helpImagePreview: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  helpImageRemoveButton: {
    position: 'absolute' as const,
    top: 8,
    right: 8,
    backgroundColor: '#ff6b3d',
    borderRadius: 12,
    padding: 6,
  },
  
  inputLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#1a4d2e',
    marginBottom: 12,
  },
  avatarPickerContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center' as const,
    marginBottom: 24,
    overflow: 'hidden' as const,
  },
  avatarPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f7f4',
    borderWidth: 2,
    borderColor: '#2e5f4a',
    borderStyle: 'dashed' as const,
    borderRadius: 60,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  avatarPlaceholderText: {
    fontSize: 12,
    color: '#2e5f4a',
    marginTop: 8,
    fontWeight: '500' as const,
  },
  textInput: {
    backgroundColor: '#f5f7f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#1a4d2e',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  modalFooter: {
    flexDirection: 'row' as const,
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    alignItems: 'center' as const,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#666',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#2e5f4a',
    alignItems: 'center' as const,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#fff',
  },
  infoCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: '#1a4d2e',
    fontWeight: '500' as const,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 16,
  },
  statsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statsHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1a4d2e',
    marginLeft: 8,
  },
  statsRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
  },
  statItem: {
    alignItems: 'center' as const,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  settingsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  settingsHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1a4d2e',
    marginLeft: 8,
  },
  settingsList: {
    gap: 0,
  },
  settingItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
  },
  settingLabel: {
    fontSize: 15,
    color: '#1a4d2e',
  },
  settingDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  logoutButton: {
    backgroundColor: '#ff6b3d',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center' as const,
    shadowColor: '#ff6b3d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#fff',
    letterSpacing: 0.5,
  },
});
