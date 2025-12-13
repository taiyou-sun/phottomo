import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Send } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { useRorkAgent } from '@rork-ai/toolkit-sdk';

export default function CameraSurveyScreen() {
  const { navigateToScreen } = useApp();
  const [input, setInput] = useState<string>('');
  const scrollViewRef = useRef<ScrollView>(null);

  const { messages, sendMessage } = useRorkAgent({
    tools: {},
  });

  useEffect(() => {
    if (messages.length === 0) {
      const initialPrompt = `あなたはFUJIFILMカメラの専門家です。ユーザーとの会話を通じて、最適なFUJIFILMカメラを提案してください。

以下の情報を自然な会話の中で聞き出してください：
- 撮影経験レベル（初心者・中級者・上級者）
- 主な被写体（風景・人物・スポーツ・マクロなど）
- 重視する機能（使いやすさ・画質・携帯性・動画など）
- 予算

会話は日本語で、親しみやすく、カメラ初心者にも分かりやすい言葉で行ってください。専門用語を使う場合は、簡単な説明を添えてください。

必要な情報が揃ったら、以下のFUJIFILMカメラから最適なものを提案してください：

【初心者向け】
- X-S20: 軽量コンパクト、動画性能も高い
- X-T30 II: クラシックデザイン、使いやすい操作性

【中級者向け】
- X-T5: 高解像度4020万画素、優れた画質
- X-S20: 動画も撮る方に最適

【上級者向け】
- X-H2S: スポーツ・動体撮影に最適、高速連写
- X-H2: 最高画質4020万画素、風景・ポートレートに
- X-Pro3: ストリートフォト向け、独特のデザイン

提案の際は、そのカメラがなぜユーザーに合っているのか、具体的な理由を説明してください。

まずは親しみやすく挨拶をして、カメラ選びのお手伝いを始めてください。`;
      sendMessage(initialPrompt);
    }
  }, [messages.length, sendMessage]);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      console.log('Sending message:', input);
      sendMessage(input.trim());
      setInput('');
    }
  };

  const handleBack = () => {
    navigateToScreen('home');
  };

  const renderMessage = (message: any, index: number) => {
    const isUser = message.role === 'user';
    const textParts = message.parts.filter((p: any) => p.type === 'text');
    
    if (textParts.length === 0) return null;

    return (
      <View
        key={message.id || index}
        style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.assistantBubble,
        ]}
      >
        {textParts.map((part: any, partIndex: number) => (
          <Text
            key={partIndex}
            style={[
              styles.messageText,
              isUser ? styles.userText : styles.assistantText,
            ]}
          >
            {part.text}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          testID="back-button"
        >
          <ChevronLeft size={24} color="#1a4d2e" />
        </TouchableOpacity>
        <Text style={styles.appName}>カメラを探す</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }}
        >
          {messages.map((message, index) => renderMessage(message, index))}
          
          {messages.length > 0 && messages[messages.length - 1].role === 'user' && (
            <View style={[styles.messageBubble, styles.assistantBubble]}>
              <ActivityIndicator size="small" color="#1a4d2e" />
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="メッセージを入力..."
            placeholderTextColor="#a0b0a8"
            multiline
            maxLength={500}
            testID="message-input"
          />
          <TouchableOpacity
            onPress={handleSend}
            style={[
              styles.sendButton,
              !input.trim() && styles.sendButtonDisabled,
            ]}
            disabled={!input.trim()}
            testID="send-button"
          >
            <Send
              size={20}
              color={input.trim() ? '#fff' : '#a0b0a8'}
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 12,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
  },
  userBubble: {
    alignSelf: 'flex-start' as const,
    backgroundColor: '#2e7d46',
    borderBottomLeftRadius: 4,
  },
  assistantBubble: {
    alignSelf: 'flex-end' as const,
    backgroundColor: '#fff',
    borderBottomRightRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  assistantText: {
    color: '#1a4d2e',
  },
  inputContainer: {
    flexDirection: 'row' as const,
    alignItems: 'flex-end' as const,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e8ebe8',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f7f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1a4d2e',
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2e7d46',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  sendButtonDisabled: {
    backgroundColor: '#e8ebe8',
  },
});
