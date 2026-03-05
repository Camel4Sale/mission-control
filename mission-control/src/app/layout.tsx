import type { Metadata } from "next";
import { Syne, Outfit } from "next/font/google";
import "./globals.css";

// BOLD DISPLAY FONT - Syne (distinctive, bold, unique)
const syne = Syne({ 
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
});

// CLEAN BODY FONT - Outfit (modern, geometric)
const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Mission Control",
  description: "Molty's Mission Control Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" data-theme="dark" className={`${syne.variable} ${outfit.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
