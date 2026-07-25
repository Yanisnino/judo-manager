import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const font = Cairo({ subsets: ["arabic", "latin"] });

export const metadata: Metadata = {
  title: "منصة إدارة أندية الجودو والفنون القتالية - JudoManager",
  description: "النظام المتكامل لإدارة أندية الرياضات القتالية واللاعبين والاشتراكات",
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "JudoManager",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="JudoManager" />
      </head>
      <body className={`${font.className} bg-gray-50 text-gray-900 selection:bg-blue-600 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
