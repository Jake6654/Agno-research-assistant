import type { Metadata } from "next";
import { Noto_Sans_KR, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Agno Research Assistant",
  description: "FastAPI research backend + Next.js frontend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${spaceGrotesk.variable} ${notoSansKr.variable}`}>
        {children}
      </body>
    </html>
  );
}
