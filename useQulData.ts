"use client";

import { useEffect, useState } from "react";
import { useLiff } from "@/components/LiffProvider";

interface QulData {
  registered: boolean;
  qulId: string | null;
  pointBalance: number;
  passCode: string | null;
  reservationCount: number;
}

const DEFAULT_DATA: QulData = {
  registered: false,
  qulId: null,
  pointBalance: 0,
  passCode: null,
  reservationCount: 0,
};

/**
 * /api/me を呼び出し、ログイン中ユーザー自身のQULデータを取得する。
 * データが無い/取得に失敗した場合は DEFAULT_DATA（0pt・準備中扱い）を返す。
 */
export function useQulData() {
  const { liff, status } = useLiff();
  const [data, setData] = useState<QulData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "ready" || !liff) return;

    let cancelled = false;

    async function fetchData() {
      try {
        const idToken = liff!.getIDToken();
        if (!idToken) {
          setData(DEFAULT_DATA);
          return;
        }
        const res = await fetch("/api/me", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });
        if (!res.ok) {
          setData(DEFAULT_DATA);
          return;
        }
        const json = (await res.json()) as QulData;
        if (!cancelled) setData(json);
      } catch (err) {
        console.error("QULデータ取得エラー:", err);
        if (!cancelled) setData(DEFAULT_DATA);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [status, liff]);

  return { data, loading };
}
