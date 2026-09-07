import { createClient } from "@supabase/supabase-js";

// 重要: ここで使うのは NEXT_PUBLIC_SUPABASE_ANON_KEY のみ。
// service_role key は絶対にこのファイル（クライアントバンドル）に含めないこと。
// RLS（Row Level Security）が有効なテーブルのみをここから参照する想定。

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: ReturnType<typeof createClient> | null = null;

/**
 * ブラウザ（クライアントコンポーネント）用のSupabaseクライアントを取得する。
 * 環境変数が未設定の場合はnullを返し、呼び出し側で「準備中」表示にフォールバックできるようにする。
 */
export function getSupabaseBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    });
  }
  return client;
}
