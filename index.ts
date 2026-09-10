// QUL Mini App 共通型定義
// Supabase側の実テーブル構成が確定するまでは、この型を「期待するインターフェース」として扱う。
// 既存のQUL Supabaseプロジェクトにテーブルが既にある場合は、そちらのスキーマに合わせて調整すること。

export interface Profile {
  id: string;
  line_user_id: string;
  display_name: string;
  picture_url: string | null;
  qul_id: string;
  created_at: string;
  updated_at: string;
}

export interface PointBalance {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface PointTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: "earn" | "use" | "adjust";
  description: string | null;
  created_at: string;
}

export interface Pass {
  id: string;
  user_id: string;
  pass_code: string;
  created_at: string;
  expires_at: string | null;
}

export type ReservationStatus = "confirmed" | "pending" | "cancelled";

export interface Reservation {
  id: string;
  user_id: string;
  event_id: string;
  status: ReservationStatus;
  created_at: string;
  // 表示用に events テーブル等と結合した場合に入る想定のフィールド（任意）
  title?: string;
  date?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  published_at: string;
}

// LIFFプロフィール（LIFF SDKから取得する値のみを保持する）
export interface LiffProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}
