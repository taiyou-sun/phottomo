# Rorkアプリへようこそ

## プロジェクト情報

このプロジェクトは [Rork](https://rork.com) を使用して作成された、クロスプラットフォーム対応のネイティブモバイルアプリです。

**プラットフォーム**: iOS & Android ネイティブアプリ（Webへの書き出しも可能）
**フレームワーク**: Expo Router + React Native

## コードの編集方法

このネイティブアプリを編集するには、いくつかの方法があります。

### **Rorkを使用する（推奨）**

[rork.com](https://rork.com) にアクセスし、AIへのプロンプト入力でアプリを構築します。

Rork上で行った変更は、自動的にこのGitHubリポジトリにコミットされます。
また、ローカルのコードエディタで変更を行いGitHubへプッシュすると、その変更はRork側にも即座に反映されます。

### **お好みのコードエディタを使用する**

ローカル環境で開発を行いたい場合は、このリポジトリをクローンして変更をプッシュしてください。プッシュされた変更はRorkにも反映されます。

コーディングに慣れていない場合は [Cursor](https://cursor.sh/) の使用をおすすめします。ターミナル操作に慣れている場合は Claude Code も良い選択肢です。

**必須要件:** Node.js と Bun がインストールされていること。

  - [Node.jsのインストール (nvm推奨)](https://github.com/nvm-sh/nvm)
  - [Bunのインストール](https://bun.sh/docs/installation)

以下の手順で開始します：

```bash
# 手順 1: プロジェクトのGit URLを使用してリポジトリをクローン
git clone <YOUR_GIT_URL>

# 手順 2: プロジェクトディレクトリに移動
cd <YOUR_PROJECT_NAME>

# 手順 3: 必要な依存関係をインストール
bun i

# 手順 4: ブラウザでプレビューを開始（ホットリロード対応）
bun run start-web

# 手順 5: iOSシミュレーターを開始
# オプション A (推奨):
bun run start  # 実行後、ターミナルで "i" を押すとiOSシミュレーターが起動します
# オプション B (環境が対応している場合):
bun run start -- --ios
```

### **GitHub上で直接ファイルを編集する**

  - 編集したいファイルに移動します。
  - 右上の「Edit（鉛筆アイコン）」ボタンをクリックします。
  - 変更を行い、コミットします。

## 使用されている技術スタック

このプロジェクトは、最も人気のあるクロスプラットフォーム技術スタックで構築されています：

  - **React Native** - Metaによって作成されたクロスプラットフォーム開発フレームワーク（Instagram, Airbnbなどで採用）
  - **Expo** - React Nativeの拡張プラットフォーム（Discord, Shopify, Coinbaseなどで採用）
  - **Expo Router** - Web、サーバー機能、SSRをサポートするReact Native用ファイルベースルーティングシステム
  - **TypeScript** - 型安全なJavaScript
  - **React Query** - サーバー状態管理ライブラリ
  - **Lucide React Native** - 美しいアイコンセット

## アプリのテスト方法

### **実機でのテスト（推奨）**

1.  **iOS**: App Storeから [Rorkアプリ](https://apps.apple.com/app/rork) または [Expo Go](https://apps.apple.com/app/expo-go/id982107779) をダウンロード
2.  **Android**: Google Playから [Expo Goアプリ](https://play.google.com/store/apps/details?id=host.exp.exponent) をダウンロード
3.  `bun run start` を実行し、表示されたQRコードをアプリでスキャンします

### **ブラウザでのテスト**

`bun start-web` を実行するとブラウザでテストできます。
注意: 素早い確認には最適ですが、一部のネイティブ機能はブラウザでは動作しない場合があります。

### **iOSシミュレーター / Androidエミュレーター**

XCodeやAndroid Studioがなくても、Expo GoやRorkアプリを使えばほとんどの機能を確認できます。

**「カスタム開発ビルド（Custom Development Builds）」が必要になるケース:**

  - ネイティブ認証 (Face ID, Touch ID, Apple Sign In)
  - アプリ内課金 (In-app purchases) やサブスクリプション
  - プッシュ通知
  - カスタムネイティブモジュール

詳細: [Expo 開発ビルドガイド](https://docs.expo.dev/develop/development-builds/introduction/)

XCode (iOS) や Android Studio がインストールされている場合:

```bash
# iOS Simulator
bun run start -- --ios

# Android Emulator
bun run start -- --android
```

## アプリのデプロイ（公開）方法

### **App Store (iOS) へ公開**

1.  **EAS CLIのインストール**:

    ```bash
    bun i -g @expo/eas-cli
    ```

2.  **プロジェクトの設定**:

    ```bash
    eas build:configure
    ```

3.  **iOS向けビルド**:

    ```bash
    eas build --platform ios
    ```

4.  **App Storeへ提出**:

    ```bash
    eas submit --platform ios
    ```

詳細な手順は [ExpoのApp Storeデプロイガイド](https://docs.expo.dev/submit/ios/) を参照してください。

### **Google Play (Android) へ公開**

1.  **Android向けビルド**:

    ```bash
    eas build --platform android
    ```

2.  **Google Playへ提出**:

    ```bash
    eas submit --platform android
    ```

詳細な手順は [ExpoのGoogle Playデプロイガイド](https://docs.expo.dev/submit/android/) を参照してください。

### **Webサイトとして公開**

React NativeアプリはWebアプリとしても動作します：

1.  **Web向けビルド**:

    ```bash
    eas build --platform web
    ```

2.  **EAS Hostingでデプロイ**:

    ```bash
    eas hosting:configure
    eas hosting:deploy
    ```

その他のWebデプロイ方法:

  - **Vercel**: GitHubリポジトリと連携してデプロイ
  - **Netlify**: GitHubリポジトリと連携して自動デプロイ

## アプリの機能

このテンプレートに含まれる機能：

  - **クロスプラットフォーム互換性** - iOS, Android, Webで動作
  - **ファイルベースルーティング** (Expo Router使用)
  - **タブナビゲーション** (カスタマイズ可能)
  - **モーダル画面** (オーバーレイやダイアログ用)
  - **TypeScriptサポート** (開発体験の向上)
  - **Async storage** (ローカルデータの保存)
  - **ベクターアイコン** (Lucide React Native使用)

## プロジェクト構造

```
├── app/                    # アプリの画面 (Expo Router)
│   ├── (tabs)/            # タブナビゲーション画面
│   │   ├── _layout.tsx    # タブレイアウト設定
│   │   └── index.tsx      # ホームタブ画面
│   ├── _layout.tsx        # ルートレイアウト
│   ├── modal.tsx          # モーダル画面の例
│   └── +not-found.tsx     # 404画面
├── assets/                # 静的アセット
│   └── images/           # アプリアイコンや画像
├── constants/            # アプリの定数や設定
├── app.json             # Expo設定ファイル
├── package.json         # 依存関係とスクリプト
└── tsconfig.json        # TypeScript設定ファイル
```

## カスタム開発ビルド (Advanced)

高度なネイティブ機能を使用する場合、Expo Goではなく「カスタム開発ビルド」を作成する必要があります。

### **いつカスタム開発ビルドが必要か？**

  - **ネイティブ認証**: Face ID, Touch ID, Apple Sign In, Google Sign In
  - **アプリ内課金**: App Store / Google Play サブスクリプション
  - **高度なネイティブ機能**: サードパーティ製SDK, プラットフォーム固有機能（iOSのウィジェット等）
  - **バックグラウンド処理**: バックグラウンドタスク, 位置情報追跡

### **カスタム開発ビルドの作成手順**

```bash
# EAS CLIのインストール
bun i -g @expo/eas-cli

# 開発ビルド用にプロジェクトを設定
eas build:configure

# デバイス用に開発ビルドを作成
eas build --profile development --platform ios
eas build --profile development --platform android

# デバイスに開発ビルドをインストールして開発を開始
bun start --dev-client
```

**詳細情報:**

  - [開発ビルドの導入](https://docs.expo.dev/develop/development-builds/introduction/)
  - [開発ビルドの作成](https://docs.expo.dev/develop/development-builds/create-a-build/)
  - [開発ビルドのインストール](https://docs.expo.dev/develop/development-builds/installation/)

## 高度な機能の追加

### **データベースの追加**

バックエンドサービスとの連携：

  - **Supabase** - リアルタイム機能を備えたPostgreSQLデータベース
  - **Firebase** - Googleのモバイル開発プラットフォーム
  - **Custom API** - 独自のバックエンドへの接続

### **認証機能の追加**

ユーザー認証の実装：

**基本認証 (Expo Goで動作):**

  - **Expo AuthSession** - OAuthプロバイダー (Google, Facebook, Apple) - [ガイド](https://docs.expo.dev/guides/authentication/)
  - **Supabase Auth** - Email/パスワードおよびソーシャルログイン - [統合ガイド](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
  - **Firebase Auth** - 包括的な認証ソリューション - [設定ガイド](https://docs.expo.dev/guides/using-firebase/)

**ネイティブ認証 (カスタム開発ビルドが必要):**

  - **Apple Sign In** - ネイティブApple認証 - [実装ガイド](https://docs.expo.dev/versions/latest/sdk/apple-authentication/)
  - **Google Sign In** - ネイティブGoogle認証 - [設定ガイド](https://docs.expo.dev/guides/google-authentication/)

### **プッシュ通知の追加**

  - **Expo Notifications** - クロスプラットフォームプッシュ通知
  - **Firebase Cloud Messaging** - 高度な通知機能

### **決済機能の追加**

アプリの収益化：

**Web & クレジットカード決済 (Expo Goで動作):**

  - **Stripe** - クレジットカード決済とサブスクリプション - [Expo + Stripeガイド](https://docs.expo.dev/guides/using-stripe/)
  - **PayPal** - PayPal決済統合 - [設定ガイド](https://developer.paypal.com/docs/checkout/mobile/react-native/)

**ネイティブアプリ内課金 (カスタム開発ビルドが必要):**

  - **RevenueCat** - クロスプラットフォームアプリ内課金とサブスクリプション - [Expo統合ガイド](https://www.revenuecat.com/docs/expo)
  - **Expo In-App Purchases** - App Store/Google Play直接統合 - [実装ガイド](https://docs.expo.dev/versions/latest/sdk/in-app-purchases/)

## カスタムドメインを使用したい場合

Webデプロイの場合、以下のサービスでカスタムドメインが使用可能です：

  - **EAS Hosting** - 有料プランでカスタムドメイン利用可能
  - **Netlify** - 無料でカスタムドメインをサポート
  - **Vercel** - 自動SSL付きカスタムドメイン

モバイルアプリの場合、`app.json` でディープリンクスキームを設定します。

## トラブルシューティング

### **デバイスでアプリが読み込まれない場合**

1.  スマホとPCが同じWiFiネットワークに接続されているか確認してください。
2.  トンネルモードを試してください: `bun start -- --tunnel`
3.  ファイアウォールが接続をブロックしていないか確認してください。

### **ビルドが失敗する場合**

1.  キャッシュをクリア: `bunx expo start --clear`
2.  `node_modules` を削除して再インストール: `rm -rf node_modules && bun install`
3.  [Expoのトラブルシューティングガイド](https://docs.expo.dev/troubleshooting/build-errors/) を確認してください。

### **ネイティブ機能に関するヘルプ**

  - [Expoドキュメント](https://docs.expo.dev/) (ネイティブAPIについて)
  - [React Nativeドキュメント](https://reactnative.dev/docs/getting-started) (コアコンポーネントについて)
  - [Rork FAQ](https://rork.com/faq) (プラットフォーム固有の質問について)

## Rorkについて

Rorkは、Discord, Shopify, Coinbase, Instagramなど、App Storeのトップアプリの30%近くで使用されている技術スタック（React NativeとExpo）を使用して、完全なネイティブモバイルアプリを構築します。

あなたのRorkアプリは本番環境に対応しており、App StoreおよびGoogle Playストアの両方に公開可能です。また、Webアプリとしてエクスポートすることもでき、真のクロスプラットフォームを実現します。