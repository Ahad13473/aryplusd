import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/** Lets phones install the site to the home screen like an app. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} - ${site.tagline}`,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#059669",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
