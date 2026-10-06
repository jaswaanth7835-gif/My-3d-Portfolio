import { ImageResponse } from "next/og";
import { profile } from "@/data/portfolio";

export const alt = `${profile.name} — ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Link-preview card shown when the site is shared (LinkedIn, WhatsApp, Slack…).
export default function OpengraphImage() {
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
          background: "#0a0a0a",
          backgroundImage: "radial-gradient(circle at 85% 15%, rgba(45,212,191,0.28), transparent 45%), radial-gradient(circle at 10% 100%, rgba(91,141,239,0.22), transparent 45%)",
          color: "#ededed",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26, letterSpacing: 6, color: "#2dd4bf" }}>
          <div style={{ display: "flex", fontWeight: 800 }}>JN</div>
          <div style={{ display: "flex" }}>CYBERSECURITY · SOC · SRI LANKA</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 30, letterSpacing: 8, color: "#a1a1aa" }}>/ {profile.name.toUpperCase()}</div>
          <div style={{ display: "flex", flexWrap: "wrap", marginTop: 20, fontSize: 104, fontWeight: 800, lineHeight: 1, letterSpacing: -4 }}>
            Building at the edge of&nbsp;<span style={{ color: "#2dd4bf" }}>code.</span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 28, color: "#a1a1aa" }}>
          <div style={{ display: "flex" }}>{profile.title}</div>
          <div style={{ display: "flex", height: 6, width: 220, borderRadius: 6, background: "linear-gradient(90deg, #2dd4bf, #5b8def)" }} />
        </div>
      </div>
    ),
    size
  );
}
