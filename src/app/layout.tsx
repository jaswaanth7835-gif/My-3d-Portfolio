import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jaswaanth Narayanasamy | Aspiring SOC Analyst",
  description:
    "Portfolio of Jaswaanth Narayanasamy, a cybersecurity undergraduate at APIIT (University of Staffordshire) working toward a SOC Analyst role.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* set the theme before first paint: saved choice, else the system setting */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`,
          }}
        />
        {/* skip the intro overlay before paint for returning visitors and reduced-motion users */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(sessionStorage.getItem("intro-seen")==="1"||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.setAttribute("data-intro","skip")}catch(e){}})()`,
          }}
        />
        <noscript>
          <style>{`.intro{display:none}`}</style>
        </noscript>
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
