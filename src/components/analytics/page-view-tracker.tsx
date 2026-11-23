"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Sends one tiny beacon per page view (also on client-side navigation). */
export function PageViewTracker({ lang }: { lang: string }) {
  const pathname = usePathname();
  useEffect(() => {
    const body = JSON.stringify({ path: pathname, lang, ref: document.referrer || null });
    try {
      if (!navigator.sendBeacon?.("/api/track", new Blob([body], { type: "application/json" }))) {
        void fetch("/api/track", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } });
      }
    } catch {
      /* analytics must never break the page */
    }
  }, [pathname, lang]);
  return null;
}
