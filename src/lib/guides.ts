/**
 * Guide pages. Their text lives in the language dictionaries (dict.guides);
 * this file only keeps the order and the illustration for each slug.
 */
export const guideMeta: { slug: string; image?: string }[] = [
  { slug: "ary-zap-downloader", image: "/images/step-1-paste-link.svg" },
  { slug: "pakistani-drama-downloader", image: "/images/devices.svg" },
  { slug: "download-ary-dramas-on-android", image: "/images/step-3-saved-to-device.svg" },
  { slug: "download-ary-dramas-on-iphone", image: "/images/step-2-pick-quality.svg" },
  { slug: "download-ary-dramas-on-pc", image: "/images/devices.svg" },
  { slug: "watch-ary-dramas-offline", image: "/images/step-3-saved-to-device.svg" },
  { slug: "ary-plus-to-mp4", image: "/images/step-2-pick-quality.svg" },
];

export const guideSlugs = guideMeta.map((g) => g.slug);
