// Gemini API テストスクリプト
const GEMINI_API_KEY = "AIzaSyBZIQ_de-UnwJ4Rr729BXJLb7cvItWJtgI";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";

async function testGeminiAPI() {
  console.log('Testing Gemini API...');
  console.log('API Key:', GEMINI_API_KEY.substring(0, 10) + '...');
  console.log('API URL:', GEMINI_API_URL);

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: 'こんにちは' }]
          }
        ]
      })
    });

    console.log('Response status:', response.status);
    console.log('Response status text:', response.statusText);

    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));

    if (response.ok && data.candidates && data.candidates[0]) {
      console.log('\n✅ API Test SUCCESS!');
      console.log('AI Response:', data.candidates[0].content.parts[0].text);
    } else {
      console.log('\n❌ API Test FAILED!');
      console.log('Error details:', data);
    }
  } catch (error) {
    console.error('\n❌ API Test ERROR!');
    console.error('Error:', error.message);
    console.error('Full error:', error);
  }
}

testGeminiAPI();
