import Navigation from "@/components/Navigation";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
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
