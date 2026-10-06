import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#2dd4bf",
          fontSize: 34,
          fontWeight: 800,
          fontFamily: "monospace",
          borderRadius: 14,
        }}
      >
        JN
      </div>
    ),
    size
  );
}
