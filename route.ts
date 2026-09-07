import { NextRequest, NextResponse } from "next/server";
import { verifyLiffIdToken } from "@/lib/verifyLiffToken";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const idToken = body?.idToken as string | undefined;

  if (!idToken) {
    return NextResponse.json({ error: "idTokenが必要です" }, { status: 400 });
  }

  const verified = await verifyLiffIdToken(idToken);
  if (!verified) {
    return NextResponse.json({ error: "認証に失敗しました" }, { status: 401 });
  }

  const { lineUserId } = verified;

  // 既存のQUL Supabase構成にテーブルが無い場合でもアプリ全体が落ちないよう、
  // テーブルごとに個別にtry/catchし、取得できなければ「未登録」として扱う。
  let profile = null;
  let pointBalance = 0;
  let passCode: string | null = null;
  let reservationCount = 0;

  try {
    const supabase = getSupabaseServerClient();

    const { data: profileRow } = await supabase
      .from("profiles")
      .select("id, qul_id, display_name")
      .eq("line_user_id", lineUserId)
      .maybeSingle();
    profile = profileRow ?? null;

    if (profile?.id) {
      const [{ data: pointRow }, { data: passRow }, { count }] =
        await Promise.all([
          supabase
            .from("points")
            .select("balance")
            .eq("user_id", profile.id)
            .maybeSingle(),
          supabase
            .from("passes")
            .select("pass_code")
            .eq("user_id", profile.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle(),
          supabase
            .from("reservations")
            .select("id", { count: "exact", head: true })
            .eq("user_id", profile.id),
        ]);

      pointBalance = pointRow?.balance ?? 0;
      passCode = passRow?.pass_code ?? null;
      reservationCount = count ?? 0;
    }
  } catch (err) {
    // 既存テーブルが未整備の場合など。ここでは握りつぶし、デフォルト値のまま返す。
    console.error("Supabaseからのデータ取得に失敗:", err);
  }

  return NextResponse.json({
    registered: Boolean(profile),
    qulId: profile?.qul_id ?? null,
    pointBalance,
    passCode,
    reservationCount,
  });
}
