import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "dRep Community Platform | Gimbalabs",
  description:
    "A collaborativJoin the Gimbalabs DRep Community and participate in Cardano's decentralized governance. Share your voice, vote on proposals, and help build the future of a decentralized ecosystem.",
  openGraph: {
    title: "dRep Community Platform | Gimbalabs",
    description:
      "Join the Gimbalabs DRep Community and participate in Cardano's decentralized governance. Share your voice, vote on proposals, and help build the future of a decentralized ecosystem.",
    url: "https://drep.gimbalabs.com",
    siteName: "dRep Community Platform",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "dRep Community Platform | Gimbalabs",
    description:
      "Join the Gimbalabs DRep Community and participate in Cardano's decentralized governance. Share your voice, vote on proposals, and help build the future of a decentralized ecosystem.",
    creator: "@Gimbalabs",
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
        <Navigation />
        {children}
      </body>
    </html>
  );
}
