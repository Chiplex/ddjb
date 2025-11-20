import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BlockchainProvider from "@/lib/blockchain/BlockchainProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Justicia Digital Descentralizada | DDJB",
  description: "Plataforma blockchain para justicia digital descentralizada con arbitraje anónimo basado en reputación",
};

import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import { ThemeProvider } from "@/components/ThemeProvider";

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <BlockchainProvider>
            <LanguageProvider>
              {children}
            </LanguageProvider>
          </BlockchainProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
