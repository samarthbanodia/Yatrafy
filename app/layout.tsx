import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yatrafy - AI Travel Assistant",
  description: "Plan, book, and manage your trips with AI-powered assistance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
