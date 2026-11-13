import type { Metadata } from "next";
import { Newsreader, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DecisionCopilot } from "@/components/DecisionCopilot";

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Quant Fusion | Operations Decision Layer for Manufacturers & Distributors",
  description: "Connect isolated ERP, 3PL, and warehouse data into a single verified ship date in one click. Ditch spreadsheet workarounds without IT overhaul.",
  keywords: ["Supply Chain", "Order Fulfillment", "ERP Integration", "Ship Date Determination", "TradeGauge", "Avoidable Costs", "SOX Compliance"],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${newsreader.variable} ${inter.variable} ${ibmPlexMono.variable}`}>
      <body className="bg-canvas-page text-ink-primary font-sans antialiased min-h-screen flex flex-col selection:bg-surface-recessed selection:text-ink-primary relative">
        <div className="paper-grain-overlay" aria-hidden="true" />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <DecisionCopilot />
      </body>
    </html>
  );
}
