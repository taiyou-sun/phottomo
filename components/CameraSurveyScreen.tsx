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
import { GoogleGenAI, GenerateContentResponse} from '@google/genai';

// react-native-config はネイティブモジュールなので環境によっては null を返すことがある。
// 動的 require を使い、存在しない場合は constants の値をフォールバックします。
let RNConfig: any = null;
try {
  // require を使うことでバンドル時の import 時エラーを避ける
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  RNConfig = require('react-native-config');
  // react-native-config がネイティブ側で初期化されていない場合は null になる可能性がある
  if (!RNConfig || typeof RNConfig.getConfig === 'function' && RNConfig.getConfig() == null) {
    RNConfig = null;
  }
} catch (e) {
  RNConfig = null;
}

import { GENIMI_API_URL as CONST_GENIMI_API_URL, GENIMI_API_KEY as CONST_GENIMI_API_KEY } from '@/constants/genimi';
import { longPressGestureHandlerProps } from 'react-native-gesture-handler/lib/typescript/handlers/LongPressGestureHandler';
import { G } from 'react-native-svg';

const GENIMI_API_URL: string = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const GENIMI_API_KEY: string = "AIzaSyBZIQ_de-UnwJ4Rr729BXJLb7cvItWJtgI";



export default function CameraSurveyScreen() {
  const { navigateToScreen } = useApp();
  const [input, setInput] = useState<string>('');
  const scrollViewRef = useRef<ScrollView>(null);
  // RNConfig が null の場合があるため安全にフォールバックする
  const key = (RNConfig && RNConfig.GENIMI_API_KEY) || GENIMI_API_KEY;
  const { messages, sendMessage } = useRorkAgent({
    tools: {},
  });

  useEffect(() => {
    if (messages.length === 0) {
        sendMessage({
          role: 'assistant',
          parts: [{ type: 'text', text: 'ご所望のカメラの情報を教えてください！' }],
        });
    }
  }, [messages.length, sendMessage]);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input.trim();
    console.log('Sending message:', userText);


    // まず UI 側は既存の sendMessage を使ってユーザーメッセージを追加
    sendMessage(userText);
    setInput('');

    // camera_lens_combinations.json を読み込んでプロンプトに追加

    // raw を try の外で宣言してスコープを広げる
    let raw = '';
    try {
      // Metro では require で静的なJSONを読み込める
      // components から一つ上のパスにある camera_lens_combinations.json を想定
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const cameraData = require('../camera_lens_combinations.json');
      raw = JSON.stringify(cameraData);
      
    } catch (e) {
      console.warn('camera_lens_combinations.json 読み込み失敗:', e);
    }
    const initialPrompt = `あなたはFUJIFILMカメラの専門家です。ユーザーとの会話を通じて、最適なFUJIFILMカメラを提案してください。

以下の情報を自然な会話の中で一つずつ聞き出してください：
- 撮影経験レベル（初心者・中級者・上級者）
- 主な被写体（風景・人物・スポーツ・マクロなど）
- 重視する機能（使いやすさ・画質・携帯性・動画など）
- 予算

会話は日本語で、親しみやすく、カメラ初心者にも分かりやすい言葉で行ってください。
専門用語を使う場合は、簡単な説明を添えてください。
以下の会話履歴を参照し、必要な情報が揃ったら、以下のFUJIFILMカメラのjsonデータから最適なものを提案してください。
提案の際は、そのカメラがなぜユーザーに合っているのか、理由を端的に説明とともに、jsonに含まれる商品のURLを必ず提示してください。
マークダウン形式の返答はやめてください。

以下はカメラのデータです。
${raw}

以下は会話履歴です。

`;

    // prompt を決定（既存の会話がある場合は会話履歴を付与）
    const buildHistory = (msgs: any[]) => {
      if (!msgs || msgs.length === 0) return '';
      return msgs
        .map((m) => {
          // role 表示用ラベル
          const roleLabel = isUserFromMessage(m) ? 'ユーザー' : 'アシスタント';
          const text = (m.parts || [])
            .filter((p: any) => p.type === 'text')
            .map((p: any) => (typeof p.text === 'string' ? p.text : ''))
            .join(' ')
            .trim();
          return `${roleLabel}: ${text}`;
        })
        .filter(Boolean)
        .join('\n');
    };

    let prompt: string;
    const historyStr = buildHistory(messages);
    if (!historyStr) {
      // 会話履歴がない場合は初期プロンプト + ユーザー入力
      prompt = initialPrompt + userText;
    } else {
      // 会話履歴を initialPrompt 以下に付与し、最新ユーザー入力を末尾に付ける
      prompt = `${initialPrompt}\n${historyStr}\nユーザー: ${userText}`;
      console.log('Constructed prompt with history:', prompt);
    }

    const ai = new GoogleGenAI({ apiKey: GENIMI_API_KEY });

    let response: GenerateContentResponse;

    try {
      // 1. APIを呼び出し
      response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });
      
    } catch (error) {
      // ネットワークエラーなど、リクエスト自体が失敗した場合
      console.error("Gemini APIリクエスト中にエラーが発生:", error);
      throw new Error("AI応答の取得に失敗しました。");
    }

  // 2. レスポンスの検証とテキストの抽出
  
  // a) response.text が存在し、文字列であることを確認 (Type Guard)
  if (response.text && typeof response.text === 'string') {
    // 成功: response.text が安全に String 型として利用できる
      sendMessage({
        role: 'assistant',
        parts: [{ type: 'text', text: response.text }],
      });
    return response.text;
  }
  
  // b) テキストが存在しない場合、なぜブロックされたかを確認
  if (response.candidates && response.candidates.length > 0) {
    const finishReason = response.candidates[0].finishReason;
    
    // Safety (安全性) や Recitation (引用) など、ブロックされた理由を特定
    if (finishReason !== 'STOP') {
      console.warn(`生成がブロックされました。理由: ${finishReason}`);
      // ブロックされた理由に応じて、適切なエラーメッセージを返す
      throw new Error(`AI応答が生成されませんでした。理由コード: ${finishReason}`);
    }
  }

  // c) 応答が空、または予期せぬ形式だった場合
  console.error("AIからの応答テキストが空でした。", response);
  throw new Error("AIから有効なテキスト応答が返されませんでした。");

  };

  const handleBack = () => {
    navigateToScreen('home');
  };

  // Markdown をレンダリングするコンポーネント。まず動的に人気ライブラリを試し、なければ簡易フォールバックを使う。
  const MarkdownView = ({ content }: { content: string }) => {
    let MarkdownLib: any = null;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      MarkdownLib = require('react-native-markdown-display').default;
    } catch (e) {
      MarkdownLib = null;
    }

    if (MarkdownLib) {
      // ライブラリがあればそれを使って描画
      const mdStyle = {
        body: styles.assistantText,
        heading1: styles.mdHeading,
        list_item: styles.mdList,
        code_inline: styles.mdCodeInline,
      } as any;

      return <MarkdownLib style={mdStyle}>{content}</MarkdownLib>;
    }

    // フォールバック: とりあえず行ごとに簡易パースして表示
    const lines = content.split('\n');
    return (
      <View>
        {lines.map((line, idx) => {
          if (!line.trim()) return <Text key={idx} style={styles.assistantText}>{"\n"}</Text>;
          if (/^#{1,6}\s+/.test(line)) {
            const text = line.replace(/^#{1,6}\s+/, '');
            return (
              <Text key={idx} style={styles.mdHeading}>
                {text}
              </Text>
            );
          }
          if (/^[-*+]>?\s+/.test(line) || /^\d+\.\s+/.test(line)) {
            const text = line.replace(/^[-*+]>?\s+|^\d+\.\s+/, '');
            return (
              <Text key={idx} style={styles.mdList}>
                {'• '}{text}
              </Text>
            );
          }

          // インラインスタイルの簡易処理: **bold**, *italic*, `code`
          const segments = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).filter(Boolean);
          return (
            <Text key={idx} style={styles.assistantText}>
              {segments.map((seg, i) => {
                if (/^\*\*.*\*\*$/.test(seg)) {
                  return <Text key={i} style={{ fontWeight: '700' }}>{seg.replace(/\*\*/g, '')}</Text>;
                }
                if (/^\*.*\*$/.test(seg)) {
                  return <Text key={i} style={{ fontStyle: 'italic' }}>{seg.replace(/\*/g, '')}</Text>;
                }
                if (/^`.*`$/.test(seg)) {
                  return <Text key={i} style={styles.mdCodeInline}>{seg.replace(/`/g, '')}</Text>;
                }
                return <Text key={i}>{seg}</Text>;
              })}
            </Text>
          );
        })}
      </View>
    );
  };

  const renderMessage = (message: any, index: number) => {
    // role フィールドは環境やライブラリで変わるため、いくつかの候補で判定する
    const isUser = isUserFromMessage(message);
    const textParts = message.parts.filter((p: any) => p.type === 'text');
    
    if (textParts.length === 0) return null;

    // row wrapper を使って左右配置を制御（より安定する）
    return (
      <View
        key={message.id || index}
        style={{ flexDirection: 'row', justifyContent: isUser ? 'flex-end' : 'flex-start' }}
      >
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.assistantBubble]}>
          {textParts.map((part: any, partIndex: number) => (
            isUser ? (
              <Text
                key={partIndex}
                style={[styles.messageText, isUser ? styles.userText : styles.assistantText]}
              >
                {part.text}
              </Text>
            ) : (
              <MarkdownView key={partIndex} content={part.text} />
            )
          ))}
        </View>
      </View>
    );
  };

  // messages の構造が不明な場合に備えた安全な判定関数
  const isUserFromMessage = (m: any): boolean => {
    if (!m) return false;
    // 直接 role がある場合
    if (typeof m.role === 'string') {
      const r = m.role.toLowerCase();
      if (r === 'user' || r === 'me' || r === 'human' || r === 'client') return true;
      if (r === 'assistant' || r === 'bot' || r === 'system') return false;
    }
    // その他の候補フィールド
    if (m.sender && String(m.sender).toLowerCase().includes('user')) return true;
    if (m.from && String(m.from).toLowerCase().includes('user')) return true;
    if (m.isUser === true) return true;
    if (m.author && m.author.role && String(m.author.role).toLowerCase().includes('user')) return true;
    // デフォルトは assistant 側とみなす
    return false;
  };

  // デバッグ: messages の構造を開発中のみ出力
  useEffect(() => {
    // console.log を残しておくと実行時にどのフィールドに role 情報が入るか確認できる
    console.log('Messages length:', messages.length);
  }, [messages]);

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
    backgroundColor: '#2e7d46',
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 16,
    marginLeft: 40,
    marginRight: 0,
  },
  assistantBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 16,
    marginRight: 40,
    marginLeft: 0,
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
    fontSize: 16,
    lineHeight: 22,
  },
  assistantText: {
    color: '#1a4d2e',
    fontSize: 16,
    lineHeight: 22,
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
  mdHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a4d2e',
    marginBottom: 6,
  },
  mdList: {
    fontSize: 16,
    color: '#1a4d2e',
    marginLeft: 6,
    marginBottom: 4,
  },
  mdCodeInline: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});
