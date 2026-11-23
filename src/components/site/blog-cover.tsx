/**
 * Cover art for blog posts, drawn with satori-compatible inline styles so the
 * same design is used for the on-page image and the social share card.
 */
export function BlogCoverArt({ kicker, title, category }: { kicker: string; title: string; category: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 64,
        background: "linear-gradient(135deg, #065f46 0%, #0b1220 55%, #111827 100%)",
        color: "#fff",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", padding: "8px 18px", borderRadius: 999, background: "#10b981", fontSize: 26, fontWeight: 700 }}>
          {kicker}
        </div>
        <div style={{ fontSize: 24, color: "#a7f3d0" }}>{category}</div>
      </div>
      <div style={{ display: "flex", fontSize: title.length > 60 ? 54 : 64, fontWeight: 800, lineHeight: 1.12 }}>{title}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, color: "#d1fae5" }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "#059669", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="32" height="32" viewBox="0 0 32 32">
            <path d="M12 7.5v9.2l7.6-4.6z" fill="#fff" />
            <path d="M16 18.5v6M12.5 21.5 16 25l3.5-3.5" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        ARYPlusD Blog
      </div>
    </div>
  );
}
