// Gemini API 会話履歴テスト（CameraSurveyScreenと同じ形式）
const GEMINI_API_KEY = "AIzaSyBZIQ_de-UnwJ4Rr729BXJLb7cvItWJtgI";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";

async function testConversation() {
  console.log('=== Gemini API 会話履歴テスト ===\n');

  const systemPrompt = `あなたはFUJIFILMカメラの専門家です。ユーザーとの会話を通じて、最適なFUJIFILMカメラを提案してください。

以下の情報を自然な会話の中で一つずつ聞き出してください：
- 撮影経験レベル（初心者・中級者・上級者）
- 主な被写体（風景・人物・スポーツ・マクロなど）
- 重視する機能（使いやすさ・画質・携帯性・動画など）
- 予算

会話は日本語で、親しみやすく、カメラ初心者にも分かりやすい言葉で行ってください。`;

  // 会話履歴をシミュレート
  const contents = [
    {
      role: 'user',
      parts: [{ text: systemPrompt }]
    },
    {
      role: 'model',
      parts: [{ text: 'ご所望のカメラの情報を教えてください！' }]
    },
    {
      role: 'user',
      parts: [{ text: 'カメラ初心者です' }]
    },
    {
      role: 'model',
      parts: [{ text: 'カメラ初心者の方なんですね！どんな写真を撮りたいですか？' }]
    },
    {
      role: 'user',
      parts: [{ text: '風景写真を撮りたいです' }]
    }
  ];

  console.log('送信する会話履歴:');
  console.log(JSON.stringify(contents, null, 2));
  console.log('\n');

  try {
    const apiUrl = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;

    console.log('API URL:', apiUrl.replace(GEMINI_API_KEY, 'API_KEY_HIDDEN'));
    console.log('リクエスト送信中...\n');

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents,
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response status text:', response.statusText);
    console.log('');

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API Error Response:', JSON.stringify(errorData, null, 2));
      return;
    }

    const data = await response.json();
    console.log('✅ Full API Response:');
    console.log(JSON.stringify(data, null, 2));
    console.log('\n');

    // レスポンスの検証とテキストの抽出
    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];

      console.log('Finish Reason:', candidate.finishReason);

      if (candidate.finishReason !== 'STOP') {
        console.warn(`⚠️ 生成がブロックされました。理由: ${candidate.finishReason}`);
        return;
      }

      const aiText = candidate.content?.parts?.[0]?.text;

      if (aiText && typeof aiText === 'string') {
        console.log('\n✅ AI応答成功！');
        console.log('AI: ' + aiText);
      } else {
        console.log('❌ テキストが見つかりません');
        console.log('candidate.content:', candidate.content);
      }
    } else {
      console.log('❌ candidates が見つかりません');
    }

  } catch (error) {
    console.error('\n❌ エラー発生:');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
  }
}

testConversation();
