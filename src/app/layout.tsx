import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#2563eb",
};

export const metadata: Metadata = {
  title: "منصة إدارة أندية الجودو والفنون القتالية - JudoManager",
  description: "النظام المتكامل لإدارة أندية الرياضات القتالية واللاعبين والاشتراكات",
  manifest: "/manifest.json",
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
      <body className="bg-gray-50 text-gray-900 selection:bg-blue-600 selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
