# QUL Mini App

LINEミニアプリとして、アプリインストール不要でQULの各サービス（Point / Q-PASS / Pay / Reserve / News）を利用できるようにするLIFFアプリです。

## 技術スタック

Next.js 14 (App Router) / TypeScript / Tailwind CSS / LIFF SDK / Supabase

## セットアップ

```bash
npm install
cp .env.local.example .env.local
# .env.local に実際の値を設定
npm run dev
```

### 必要な環境変数

| 変数名 | 用途 | 公開範囲 |
|---|---|---|
| `NEXT_PUBLIC_LIFF_ID` | LIFFアプリID | クライアント |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL | クライアント |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key（RLS前提） | クライアント |
| `SUPABASE_SERVICE_ROLE_KEY` | サーバー専用。RLSをバイパスするためAPI Route以外では絶対に使わない | サーバーのみ |
| `LINE_LOGIN_CHANNEL_ID` | LIFFのIDトークンをサーバーで検証するためのチャネルID | サーバーのみ |

`SUPABASE_SERVICE_ROLE_KEY` と `LINE_LOGIN_CHANNEL_ID` は `NEXT_PUBLIC_` を付けないこと。誤って付けるとブラウザに露出します。

## 画面構成

- `/` … Home（各サービスへの入口、お知らせ）
- `/pass` … Q-PASS（自分のQRコード表示）
- `/reserve` … 予約一覧
- `/my` … マイページ（LINEプロフィール・QUL ID・各種残高）
- `/point` … QUL Point詳細
- `/pay` … QUL Pay詳細（現在は準備中表示）

## 認証・データ取得の設計

1. `LiffProvider`（`src/components/LiffProvider.tsx`）がアプリ起動時に `liff.init()` を実行し、ログイン・プロフィール取得までを一元管理します。
2. LINEアプリ外から未ログインでアクセスされた場合は「LINEでQULを開いてください」という案内画面を表示します（要件どおり）。
3. ユーザー本人のデータ（ポイント残高・パス・予約件数）は、クライアントから直接Supabaseへは問い合わせず、`/api/me` に LIFFのIDトークンを送って取得します。
   - サーバー側で `LINE_LOGIN_CHANNEL_ID` を使ってIDトークンを検証し、検証済みの `line_user_id` のみを使ってSupabaseに問い合わせます（URLパラメータのuserIdは信用しません）。
   - これにより他ユーザーのデータを取得できないようにしています。
4. 既存のQULのSupabaseに `profiles` / `points` / `passes` / `reservations` テーブルが無い場合でもアプリが落ちないよう、`/api/me` は取得失敗時にデフォルト値（0pt・未登録扱い）を返します。実データに接続する際は `src/app/api/me/route.ts` のテーブル名・カラム名を実際のスキーマに合わせて調整してください。

## Supabaseスキーマ（依頼内容に基づく想定）

`src/types/index.ts` に型として定義しています。実際のQUL Supabaseに既存のテーブルがある場合は、そちらを優先し、本アプリ側の型・クエリを合わせてください。既存DBを削除・変更する処理は一切含まれていません。

## QRコード

`src/components/QRCode.tsx` に表示用（`QRDisplay`）とスキャン用（`QRScannerButton`、LIFFの `scanCodeV2` を使用）をまとめています。`purpose` に用途（`pass` / `point` / `pay` / `store-checkin` / `event-checkin`）を渡す構造なので、店舗受付・イベント受付などの用途追加時もこのコンポーネントを再利用できます。

## デプロイ（Vercel）

1. このリポジトリをVercelに接続
2. 上記の環境変数をVercelのプロジェクト設定に登録（`NEXT_PUBLIC_` の付かないものは "Sensitive" として登録）
3. デプロイ後のURLをLINE Developersコンソールの LIFFアプリの Endpoint URL に設定

## 未実装・今後の対応

- QUL Pay残高の実データ接続
- お知らせ（`notifications` テーブル）の実データ接続
- 予約詳細・予約作成フロー
- 通知設定の実際の保存処理

これらは画面上「準備中」と明示しており、存在しないAPIとして実装したふりはしていません。
