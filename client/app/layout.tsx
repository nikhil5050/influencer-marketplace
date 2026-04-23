import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/toaster";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "InfluenceHub — India's Premier Influencer Marketing Platform",
  description:
    "Connect brands with verified influencers across India. Discover creators in fashion, tech, food, travel and more.",
  keywords:
    "influencer marketing, brand collaboration, India influencers, creator marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-cream font-body antialiased">
        <AuthProvider>
          <Navbar />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
