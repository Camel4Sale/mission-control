'use client';

import { Inter } from "next/font/google";
import Navigation from '@/components/Navigation';
import TopBar from '@/components/TopBar';
import QuickAdd from '@/components/QuickAdd';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Plus } from 'lucide-react';
import "@/app/globals.css";

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

function generateBreadcrumbs(pathname: string): { label: string; href: string }[] {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ label: 'Home', href: '/' }];
  
  let currentPath = '';
  const labels: Record<string, string> = {
    'studium': 'Studium',
    'module': 'Module',
    'klausuren': 'Klausuren',
    'thesis': 'Masterarbeit',
    'noten': 'Noten',
    'unternehmen': 'Unternehmen',
    'pathium': 'Pathium',
    'celaris': 'Celaris',
    'elysium': 'Elysium',
  };
  
  paths.forEach((path) => {
    currentPath += `/${path}`;
    const label = labels[path] || path.charAt(0).toUpperCase() + path.slice(1);
    breadcrumbs.push({ label, href: currentPath });
  });
  
  return breadcrumbs;
}

function generateTitle(pathname: string): string {
  const titles: Record<string, string> = {
    '/': 'Command Center',
    '/studium': 'Studium Dashboard',
    '/studium/module': 'Module',
    '/studium/klausuren': 'Klausuren',
    '/studium/thesis': 'Masterarbeit',
    '/studium/noten': 'Noten',
    '/unternehmen': 'Unternehmen',
    '/unternehmen/pathium': 'Pathium',
    '/unternehmen/celaris': 'Celaris',
    '/unternehmen/elysium': 'Elysium',
  };
  return titles[pathname] || 'Life OS';
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [title, setTitle] = useState('Command Center');
  const [breadcrumbs, setBreadcrumbs] = useState<{ label: string; href: string }[]>([]);

  useEffect(() => {
    setTitle(generateTitle(pathname));
    setBreadcrumbs(generateBreadcrumbs(pathname));
  }, [pathname]);

  useEffect(() => {
    const handleQuickAdd = () => setQuickAddOpen(true);
    window.addEventListener('open-quick-add', handleQuickAdd);
    return () => window.removeEventListener('open-quick-add', handleQuickAdd);
  }, []);

  return (
    <html lang="de" data-theme="dark">
      <body className={`${inter.variable} antialiased`}>
        <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)]">
          <Navigation />
          <div className="flex-1 flex flex-col overflow-hidden">
            <TopBar title={title} breadcrumbs={breadcrumbs} />
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
          <button
            onClick={() => setQuickAddOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[var(--accent)] text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-40"
            title="Quick Add (⌘N)"
          >
            <Plus size={24} />
          </button>
          <QuickAdd isOpen={quickAddOpen} onClose={() => setQuickAddOpen(false)} />
        </div>
      </body>
    </html>
  );
}
