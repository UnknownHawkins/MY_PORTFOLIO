import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { generateSEO } from "@/lib/metadata";
import FridayChat from "@/components/shared/FridayChat";

// Load Google Fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

// Configure base SEO metadata
export const metadata: Metadata = generateSEO();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} dark scroll-smooth`}
      suppressHydrationWarning
    >
      <body 
        className="bg-background text-foreground antialiased selection:bg-blue-500/30 selection:text-blue-200"
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <FridayChat />
        </Providers>
      </body>
    </html>
  );
}
