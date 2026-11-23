import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} - ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The preview card shown when the site is shared on WhatsApp, Facebook, X, etc. */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #064e3b 0%, #0a0a0a 70%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 84, height: 84, borderRadius: 20, background: "#059669", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="64" height="64" viewBox="0 0 32 32">
              <path d="M12 7.5v9.2l7.6-4.6z" fill="#fff" />
              <path d="M16 18.5v6M12.5 21.5 16 25l3.5-3.5" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div style={{ fontSize: 44, fontWeight: 700 }}>{site.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05 }}>ARY Plus Video Downloader</div>
          <div style={{ fontSize: 34, color: "#a7f3d0" }}>Save ARY drama episodes as MP4 · 240p to 4K · Free</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#d1fae5" }}>
          <span>{site.domain}</span>
          <span>No app · No sign-up</span>
        </div>
      </div>
    ),
    size,
  );
}
