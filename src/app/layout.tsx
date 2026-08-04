import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { JsonLd } from "@/components/gulf/json-ld";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import { company } from "@/lib/gulf-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(company.url),
  title: {
    default: "Gulf Seismic | Road & Industrial Marking Authority — UAE & Saudi Arabia",
    template: "%s | Gulf Seismic",
  },
  description: company.description,
  keywords: [
    "road marking UAE",
    "thermoplastic road marking",
    "parking lot marking",
    "warehouse marking",
    "airport marking",
    "industrial marking",
    "safety signage",
    "epoxy flooring",
    "road marking Saudi Arabia",
    "Riyadh road marking",
    "Jeddah road marking",
    "Dubai road marking",
    "Abu Dhabi road marking",
  ],
  authors: [{ name: company.legalName }],
  creator: company.legalName,
  publisher: company.legalName,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Gulf Seismic | Road & Industrial Marking Authority",
    description: company.description,
    url: company.url,
    siteName: company.name,
    type: "website",
    locale: "en_US",
    images: [{ url: "/images/og/default-og.jpg", width: 1344, height: 768, alt: "Gulf Seismic — Road & Industrial Marking Authority across UAE and Saudi Arabia" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gulf Seismic | Road & Industrial Marking Authority",
    description: company.description,
    images: ["/images/og/default-og.jpg"],
  },
  alternates: { canonical: company.url },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
