import "server-only";

/**
 * クライアントから届いた LIFF の ID トークンを LINE のエンドポイントで検証し、
 * 検証済みの line_user_id (sub) のみを返す。
 *
 * これにより「URLパラメータのuserIdをそのまま信用する」ことを避け、
 * なりすましによる他ユーザーデータへのアクセスを防ぐ。
 */
export async function verifyLiffIdToken(idToken: string): Promise<{
  lineUserId: string;
} | null> {
  const channelId = process.env.LINE_LOGIN_CHANNEL_ID;
  if (!channelId) {
    console.error("LINE_LOGIN_CHANNEL_ID が未設定です");
    return null;
  }

  try {
    const res = await fetch("https://api.line.me/oauth2/v2.1/verify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        id_token: idToken,
        client_id: channelId,
      }),
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = (await res.json()) as { sub?: string; aud?: string };
    if (!data.sub || data.aud !== channelId) return null;

    return { lineUserId: data.sub };
  } catch (err) {
    console.error("LIFF IDトークン検証エラー:", err);
    return null;
  }
}
