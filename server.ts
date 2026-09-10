import "server-only";
import { createClient } from "@supabase/supabase-js";

// このファイルは "server-only" が付与されており、クライアントコンポーネントから
// importすると即座にビルドエラーになる。API Route / Server Action専用。
//
// service_role key はRLSをバイパスするため、ここでのクエリは必ず
// 呼び出し元でLIFFのuserIdをサーバー側で検証した上で、
// 対象ユーザー自身のデータのみを扱うこと。
// URLパラメータのuserIdをそのまま信用しないこと（なりすまし対策）。

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getSupabaseServerClient() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabaseのサーバー用環境変数が未設定です（.env.local を確認してください）"
    );
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
