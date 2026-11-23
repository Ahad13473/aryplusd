"use client";

import { useEffect, useRef } from "react";
import { site } from "@/lib/site";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * A responsive AdSense unit. Renders nothing until NEXT_PUBLIC_ADSENSE_CLIENT
 * is set, so pages keep a clean layout before AdSense approval.
 * Create a "Display ad" unit in AdSense and pass its slot id.
 */
export function AdSlot({ slot, className = "" }: { slot?: string; className?: string }) {
  const pushed = useRef(false);
  const enabled = Boolean(site.adsenseClient && slot);

  useEffect(() => {
    if (!enabled || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* ad blocked or script not ready - leave the space empty */
    }
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div className={`my-6 min-h-[100px] w-full overflow-hidden text-center ${className}`} aria-label="Advertisement">
      <ins
        className="adsbygoogle block"
        data-ad-client={site.adsenseClient}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
