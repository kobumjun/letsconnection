import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="bg-neutral-950 text-neutral-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
