import { Inter } from "next/font/google";
import Navigation from "@/components/Navigation";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" data-theme="dark">
      <body className={`${inter.variable} antialiased`}>
        <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)]">
          <Navigation />
          <main className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
