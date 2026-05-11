import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#07090e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#f3c66b",
          fontSize: 120,
          fontWeight: 600,
          fontFamily: "Georgia, serif",
          letterSpacing: "-0.04em",
        }}
      >
        T
      </div>
    ),
    size,
  );
}
