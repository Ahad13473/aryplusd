/** Brand, domain and SEO settings shared by every page. Change them here only. */
export const site = {
  name: "ARYPlusD",
  domain: "aryplusd.com",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://aryplusd.com").replace(/\/$/, ""),
  tagline: "ARY Plus Video Downloader",
  title: "ARYPlusD: Free ARY Plus Downloader in 4K - No Sign-in",
  description:
    "Free ARY Plus video downloader. Download ARY dramas in 4K Ultra HD, 1080p or 240p - no sign-in, no app. Search a drama, get every episode and download several at once as MP4.",
  keywords: [
    "ARY Plus downloader",
    "ARY Plus video downloader",
    "download ARY Plus dramas",
    "ARY ZAP downloader",
    "ARY drama download",
    "Pakistani drama download",
    "ARY Digital drama download MP4",
    "download ARY episodes HD",
    "ARY Plus to MP4",
    "download ARY dramas in 4K",
    "ARY drama 4K download free",
    "download ARY dramas without sign in",
    "download all episodes ARY drama",
    "latest ARY dramas 2026",
    "aryplusd",
  ],
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@aryplusd.com",
  /** AdSense publisher id, e.g. "ca-pub-1234567890123456". Ads stay off until it is set. */
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "",
  /** Search Console / Bing verification codes (optional). */
  googleVerification: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "",
  bingVerification: process.env.NEXT_PUBLIC_BING_VERIFICATION || "",
  lastUpdated: "2026-11-23",
} as const;

/** Illustration for each of the three steps (text lives in the dictionaries: dict.steps). */
export const stepImages = [
  "/images/step-1-paste-link.svg",
  "/images/step-2-pick-quality.svg",
  "/images/step-3-saved-to-device.svg",
] as const;
