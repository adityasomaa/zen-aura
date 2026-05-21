import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ZenAura Bali — Cosmic creations for divine beings.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  // Decorative stars — sparse field across the canvas
  const stars = [
    { x: 80, y: 70, r: 2 },
    { x: 240, y: 130, r: 1.4 },
    { x: 410, y: 90, r: 1.8 },
    { x: 600, y: 60, r: 2.2 },
    { x: 720, y: 130, r: 1.4 },
    { x: 890, y: 90, r: 1.8 },
    { x: 1060, y: 110, r: 1.6 },
    { x: 1140, y: 50, r: 2 },
    { x: 130, y: 460, r: 1.6 },
    { x: 320, y: 540, r: 1.4 },
    { x: 540, y: 510, r: 1 },
    { x: 760, y: 560, r: 1.6 },
    { x: 980, y: 470, r: 2 },
    { x: 1110, y: 540, r: 1.4 },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "72px 96px",
          background:
            "radial-gradient(80% 60% at 30% 30%, rgba(105,13,172,0.5), transparent 65%), linear-gradient(135deg, #1a0b1e 0%, #301934 55%, #4a2a52 100%)",
          color: "#f5edd1",
          position: "relative",
          justifyContent: "space-between",
        }}
      >
        {/* Star field */}
        {stars.map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: s.y,
              left: s.x,
              width: s.r * 2,
              height: s.r * 2,
              borderRadius: 999,
              background: i % 4 === 0 ? "#eed977" : "#f5edd1",
              opacity: 0.85,
            }}
          />
        ))}

        {/* Top: brand mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#eed977",
              boxShadow: "0 0 32px rgba(238,217,119,0.6)",
            }}
          />
          <div
            style={{
              fontFamily: "serif",
              fontSize: 22,
              letterSpacing: 12,
              color: "#eed977",
              opacity: 0.85,
            }}
          >
            Z E N A U R A · B A L I
          </div>
        </div>

        {/* Centre: headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              fontSize: 18,
              letterSpacing: 8,
              color: "#eed977",
              opacity: 0.75,
              marginBottom: 24,
            }}
          >
            <div
              style={{ width: 64, height: 1, background: "rgba(238,217,119,0.5)" }}
            />
            UBUD · BALI · EST. 2023
          </div>
          <div
            style={{
              fontFamily: "serif",
              fontSize: 132,
              lineHeight: 1,
              letterSpacing: -3,
              color: "#f5edd1",
              display: "flex",
            }}
          >
            Cosmic creations
          </div>
          <div
            style={{
              fontFamily: "serif",
              fontSize: 132,
              lineHeight: 1.05,
              letterSpacing: -3,
              color: "#f5edd1",
              display: "flex",
              marginTop: 4,
            }}
          >
            for <span style={{ fontStyle: "italic", color: "#eed977", marginLeft: 18 }}>divine beings.</span>
          </div>
        </div>

        {/* Bottom: tagline + motto */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontFamily: "serif",
              fontSize: 22,
              color: "rgba(245,237,209,0.75)",
              fontStyle: "italic",
              maxWidth: 720,
              lineHeight: 1.4,
            }}
          >
            Handcrafted bohemian fashion, silver jewelry, and spiritual treasures from the heart of Ubud.
          </div>
          <div
            style={{
              fontFamily: "serif",
              fontSize: 18,
              letterSpacing: 6,
              color: "#eed977",
              opacity: 0.85,
            }}
          >
            zen-aura.vercel.app
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
