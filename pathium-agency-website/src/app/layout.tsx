import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Pathium | Software that scales",
  description: "We build scalable web apps, mobile solutions, and AI systems that transform businesses.",
  keywords: ["software development", "web development", "mobile apps", "AI", "consulting"],
  authors: [{ name: "Pathium" }],
  creator: "Pathium",
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://pathium.com",
    siteName: "Pathium",
    title: "Pathium | Software that scales",
    description: "We build scalable web apps, mobile solutions, and AI systems that transform businesses.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pathium Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pathium | Software that scales",
    description: "We build scalable web apps, mobile solutions, and AI systems that transform businesses.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
