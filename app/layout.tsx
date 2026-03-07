import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hustler Group",
  description: "Build energy. Move together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body
        className="min-h-screen antialiased"
        style={{
          backgroundColor: "#0b0b0b",
          color: "#f5f5f5",
        }}
      >
        {children}
      </body>
    </html>
  );
}
