#!/usr/bin/env python3
"""ローカル環境で Gemini (Google Generative AI) に接続してテスト実行するスクリプト。
Colab 固有のコードを削除し、.env から API キーを読み込みます。
使い方:
  - 必要パッケージ: pip install google-generativeai python-dotenv
  - .env に GEMINI_API_KEY または GENIMI_API_KEY を設定
  - python scripts/ask_genimi_local.py "テストプロンプト"
"""
import os
import sys
import json
from typing import Optional

# .env を読み込む
from dotenv import load_dotenv
load_dotenv()

# google generative ai
try:
    import google.generativeai as genai
except Exception as e:
    print("ERROR: google.generativeai が import できません。pip install google-generativeai を実行してください。")
    raise

# 環境変数名をサポート（既存の .env に合わせる）
GEMINI_API_KEY = os.environ.get("GENIMI_API_KEY") or os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
if not GEMINI_API_KEY:
    print("ERROR: 環境変数 GENIMI_API_KEY (または GEMINI_API_KEY/GOOGLE_API_KEY) を .env に設定してください")
    sys.exit(2)

# API の初期化
genai.configure(api_key=GEMINI_API_KEY)
# 使用モデルは必要に応じて変更
model = genai.GenerativeModel('gemini-2.5-flash')

# ローカルの作業ディレクトリ（Colab の /content の代わり）
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_DIR = os.path.join(BASE_DIR, "data")
GOLDEN_DIR = os.path.join(BASE_DIR, "golden")
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(GOLDEN_DIR, exist_ok=True)

def generate(prompt: str, max_tokens: Optional[int] = None):
    try:
        # generate_content の呼び出しはライブラリのバージョンで変わる可能性があります
        response = model.generate_content(prompt)
        # 一般的には response.text に本文が入る
        text = getattr(response, 'text', None) or response
        return text
    except Exception as e:
        raise

if __name__ == '__main__':
    if len(sys.argv) >= 2:
        prompt = sys.argv[1]
    else:
        
        request = "安くて軽いカメラが欲しいのですが、どれがおすすめですか？"
        prompt = "この中から適切なカメラを2,3選んで推薦してください。理由も教えてください。"

    # camera_lens_combinations.json を読み込んでプロンプトに追加
    json_path = os.path.join(BASE_DIR, "camera_lens_combinations.json")
    extra_context = ""
    if os.path.exists(json_path):
        try:
            with open(json_path, "r", encoding="utf-8") as jf:
                data = json.load(jf)
            raw = json.dumps(data, ensure_ascii=False)
            extra_context = "\n\nCamera-lens combinations:\n" + raw
        except Exception as e:
            extra_context = f"\n\n(カメラ/レンズデータ読み込みエラー: {e})"
    else:
        extra_context = "\n\n(カメラ/レンズデータファイルが見つかりません)"

    # プロンプトへ追加
    prompt = request + prompt + extra_context
    print("--- request ---")
    print(request)
    try:
        resp = generate(prompt)
    except Exception as e:
        print("Request failed:", e)
        raise

    print("--- Response ---")
    # 可能なら JSON 化して見やすく出力
    try:
        print(json.dumps(resp, ensure_ascii=False, indent=2) if isinstance(resp, (dict, list)) else str(resp))
    except Exception:
        print(resp)