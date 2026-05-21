import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(120% 80% at 30% 25%, rgba(105,13,172,0.55), transparent 60%), linear-gradient(135deg, #1a0b1e 0%, #301934 60%, #4a2a52 100%)",
          borderRadius: 36,
          position: "relative",
        }}
      >
        {/* Decorative stars */}
        <div
          style={{
            position: "absolute",
            top: 22,
            left: 28,
            width: 4,
            height: 4,
            borderRadius: 999,
            background: "#f5edd1",
            opacity: 0.85,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 36,
            right: 30,
            width: 6,
            height: 6,
            borderRadius: 999,
            background: "#eed977",
            opacity: 0.9,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 32,
            left: 36,
            width: 3,
            height: 3,
            borderRadius: 999,
            background: "#f5edd1",
            opacity: 0.7,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 26,
            right: 40,
            width: 4,
            height: 4,
            borderRadius: 999,
            background: "#f5edd1",
            opacity: 0.7,
          }}
        />

        {/* Monogram */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: "serif",
              fontStyle: "italic",
              fontSize: 112,
              fontWeight: 500,
              color: "#eed977",
              lineHeight: 1,
              letterSpacing: -2,
            }}
          >
            Z
          </div>
          <div
            style={{
              fontFamily: "serif",
              fontSize: 12,
              letterSpacing: 8,
              color: "#f5edd1",
              opacity: 0.7,
              marginTop: 6,
            }}
          >
            BALI
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
