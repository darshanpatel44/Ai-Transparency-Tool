import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Head from "next/head";
import { SkipToContent } from "@/components/SkipToContent";
import { AccessibilityProvider } from "@/components/AccessibilityProvider";

export const runtime = "edge";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SAID — Student AI Disclosure",
  description: "SAID — Student AI Disclosure by SJSU",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Skip to content link for keyboard users */}
        <div className="skip-link-wrapper">
          {/* @ts-expect-error - SkipToContent is a client component */}
          <SkipToContent />
        </div>
        
        {/* AccessibilityProvider wraps the content to initialize enhancements */}
        {/* @ts-expect-error - AccessibilityProvider is a client component */}
        <AccessibilityProvider>
          {/* Main content area with proper landmark */}
          <main id="main-content" className="min-h-screen">
            {children}
          </main>
        </AccessibilityProvider>
        
        {/* Announcer for screen readers */}
        <div
          id="sr-announcer"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        ></div>
      </body>
    </html>
  );
}
