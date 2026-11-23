import { site } from "@/lib/site";

/** ads.txt for AdSense, generated from NEXT_PUBLIC_ADSENSE_CLIENT (empty until it is set). */
export function GET() {
  const pub = site.adsenseClient.replace(/^ca-/, "");
  const body = pub ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n` : "";
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
