import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Trym Sæther — Mathematics into software.";
export const dynamic = "force-static";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(120% 120% at 0% 0%, rgba(243,198,107,0.18) 0%, transparent 60%), linear-gradient(135deg, #07090e 0%, #0f1523 60%, #1d273d 100%)",
          display: "flex",
          flexDirection: "column",
          padding: "80px",
          color: "#f6f1e6",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* Crosshair top-left */}
        <div
          style={{
            position: "absolute",
            top: 36,
            left: 36,
            width: 22,
            height: 22,
            borderTop: "1.5px solid #f3c66b",
            borderLeft: "1.5px solid #f3c66b",
            opacity: 0.7,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 36,
            right: 36,
            width: 22,
            height: 22,
            borderBottom: "1.5px solid #f3c66b",
            borderRight: "1.5px solid #f3c66b",
            opacity: 0.7,
          }}
        />

        <div
          style={{
            color: "#f3c66b",
            fontSize: 22,
            fontFamily: "monospace",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            marginBottom: 36,
          }}
        >
          Atlas of a quiet practice — sheet 01
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 132,
            lineHeight: 0.98,
            letterSpacing: "-0.03em",
          }}
        >
          <span style={{ color: "#f6f1e6" }}>Mathematics</span>
          <span style={{ color: "#f3c66b", fontStyle: "italic" }}>
            into software.
          </span>
        </div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            color: "#a7b3cd",
            fontSize: 22,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ color: "#f6f1e6", fontSize: 28, letterSpacing: "-0.02em" }}>
              Trym Sæther
            </span>
            <span style={{ color: "#a7b3cd" }}>
              Simulation software · numerical methods · scientific computing
            </span>
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 14,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#f3c66b",
              textAlign: "right",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <span>Trondheim · 63°25′N</span>
            <span style={{ color: "#a7b3cd" }}>trymsaether.github.io</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
