import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const font = Cairo({ subsets: ["arabic", "latin"] });

export const metadata: Metadata = {
  title: "Judo & Martial Arts Manager",
  description: "SaaS platform for managing martial arts clubs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${font.className} bg-gray-50 text-gray-900`}>
        {children}
      </body>
    </html>
  );
}
