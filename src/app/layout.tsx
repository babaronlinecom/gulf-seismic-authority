import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gulfseismic.com"),
  title: {
    default:
      "Gulf Seismic — Road Marking & Infrastructure Contractor | Saudi Arabia & GCC",
    template: "%s | Gulf Seismic",
  },
  description:
    "Gulf Seismic General Contracting LLC — specialist road marking, thermoplastic marking, airport & runway marking, road studs, industrial safety marking and line removal for Saudi Arabia and the GCC. Request a technical RFQ.",
  keywords: [
    "Saudi road marking contractor",
    "thermoplastic road marking Saudi Arabia",
    "airport runway marking",
    "parking marking",
    "road studs raised pavement markers",
    "industrial safety marking",
    "line removal and remarking",
    "GCC infrastructure contractor",
  ],
  authors: [{ name: "Gulf Seismic General Contracting LLC" }],
  alternates: {
    canonical: "https://gulfseismic.com/",
    languages: {
      "en-SA": "https://gulfseismic.com/en/",
      "ar-SA": "https://gulfseismic.com/ar/",
    },
  },
  openGraph: {
    title: "Gulf Seismic — Road Marking & Infrastructure Contractor | Saudi Arabia & GCC",
    description:
      "Specialist road marking, thermoplastic, airport/runway, road studs, industrial safety marking and line removal. Saudi/GCC market-access ready. Request a technical RFQ.",
    url: "https://gulfseismic.com/",
    siteName: "Gulf Seismic",
    type: "website",
    images: ["/images/og-cover.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gulf Seismic — Road Marking & Infrastructure Contractor",
    description:
      "Specialist road marking for Saudi Arabia & the GCC. Request a technical RFQ.",
    images: ["/images/og-cover.jpg"],
  },
  icons: {
    icon: "/images/logo-mark.png",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
