import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import Navigation from "@/components/Navigation";
import "./globals.css";

// ORGANIC DISPLAY FONT - Fraunces (warm, elegant, distinctive)
const fraunces = Fraunces({ 
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

// CLEAN BODY FONT - Plus Jakarta Sans (modern, geometric, warm)
const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" data-theme="dark" className={`${fraunces.variable} ${plusJakarta.variable}`}>
      <body className="antialiased">
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
