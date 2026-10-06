import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { profile, site } from "@/data/portfolio";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "Jaswaanth Narayanasamy | Aspiring SOC Analyst";
const description =
  "Portfolio of Jaswaanth Narayanasamy, a cybersecurity undergraduate at APIIT (University of Staffordshire) working toward a SOC Analyst role.";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title,
  description,
  alternates: { canonical: "/" },
  authors: [{ name: profile.name, url: site }],
  keywords: ["Jaswaanth Narayanasamy", "cybersecurity", "SOC analyst", "portfolio", "Sri Lanka", "APIIT", "penetration testing"],
  openGraph: { type: "website", url: site, siteName: profile.name, title, description, locale: "en_GB" },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#f7f8f9" },
  ],
};

// Structured data so search engines understand this page is about a person.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: site,
  image: `${site}${profile.photo}`,
  jobTitle: "Cybersecurity Undergraduate",
  description,
  email: `mailto:${profile.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Hendala", addressCountry: "LK" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "APIIT Sri Lanka / University of Staffordshire" },
  sameAs: [profile.github, profile.linkedin],
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
      <body className="min-h-full flex flex-col">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
