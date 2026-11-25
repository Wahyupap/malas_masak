import type { Metadata } from 'next';
import { AppStateProvider } from '../context/AppStateContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'malas masak — Pesan Masak Antar Mahasiswa',
  description:
    'Platform pesan-masak antar mahasiswa asrama kampus (Dorm PIB) bersama mahasiswa Seni Kuliner.',
  openGraph: {
    title: 'malas masak — Pesan Masak Antar Mahasiswa',
    description:
      'Platform pesan-masak antar mahasiswa asrama kampus (Dorm PIB) bersama mahasiswa Seni Kuliner.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'malas masak — Pesan Masak Antar Mahasiswa',
    description:
      'Platform pesan-masak antar mahasiswa asrama kampus (Dorm PIB) bersama mahasiswa Seni Kuliner.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-on-surface font-body antialiased">
        <AppStateProvider>{children}</AppStateProvider>
      </body>
    </html>
  );
}
