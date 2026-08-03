import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/gulf/header";
import { Footer } from "@/components/gulf/footer";
import { WhatsAppFab } from "@/components/gulf/whatsapp-fab";
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
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Gulf Seismic | Road & Industrial Marking Authority",
    description: company.description,
    url: company.url,
    siteName: company.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gulf Seismic | Road & Industrial Marking Authority",
    description: company.description,
  },
  alternates: {
    canonical: company.url,
  },
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
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <WhatsAppFab />
        <Toaster />
      </body>
    </html>
  );
}
