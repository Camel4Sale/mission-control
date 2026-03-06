import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Deal-Finder Pro | Elysium',
  description: 'Intelligentes Immobilien-Deal-Finding mit AI-Analyse für die Elysium-Plattform',
  keywords: ['immobilien', 'deal-finder', 'investment', 'real estate', 'elysium'],
  authors: [{ name: 'Elysium Team' }],
  openGraph: {
    title: 'Deal-Finder Pro | Elysium',
    description: 'Finde die besten Immobilien-Deals mit AI-Unterstützung',
    type: 'website',
    locale: 'de_DE',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <head>
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
        
        {/* Global Scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Smooth scroll behavior
              document.documentElement.style.scrollBehavior = 'smooth';
            `,
          }}
        />
      </body>
    </html>
  );
}
