'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { MascotLogo } from './MascotLogo';

interface AppShellProps {
  dormLabel?: string;
  unreadChatCount?: number;
  children: React.ReactNode;
}

/**
 * Shared Navigation Shell (Next.js App Router: Desktop Sticky Top Header + Mobile/Tablet Bottom Tab Bar)
 */
export const AppShell: React.FC<AppShellProps> = ({
  dormLabel = 'Dorm PIB',
  unreadChatCount = 0,
  children,
}) => {
  const pathname = usePathname();

  const navItems: {
    href: string;
    id: 'beranda' | 'pesanan' | 'profil';
    label: string;
    icon: string;
  }[] = [
    { href: '/', id: 'beranda', label: 'Beranda', icon: 'home' },
    { href: '/pesanan', id: 'pesanan', label: 'Pesanan', icon: 'receipt_long' },
    { href: '/profil', id: 'profil', label: 'Profil', icon: 'person' },
  ];

  const isRouteActive = (id: 'beranda' | 'pesanan' | 'profil') => {
    if (id === 'beranda') return pathname === '/';
    if (id === 'pesanan') return pathname.startsWith('/pesanan');
    if (id === 'profil') {
      return pathname.startsWith('/profil') || pathname.startsWith('/chat');
    }
    return false;
  };

  return (
    <div className="min-h-screen flex flex-col pb-24 lg:pb-0 bg-surface text-on-surface">
      {/* Top Header */}
      <header className="bg-surface-container border-b-2 border-outline sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-gutter-md sm:px-gutter-lg lg:px-gutter-xl py-3 flex items-center justify-between gap-gutter-md">
          <Link
            href="/"
            className="flex items-center gap-gutter-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-outline rounded"
          >
            <MascotLogo size={36} />
            <span className="font-headline text-headline-sm text-on-surface whitespace-nowrap">
              malas masak
            </span>
          </Link>

          {/* Desktop Top Navigation */}
          <nav aria-label="Navigasi utama" className="hidden lg:flex items-center gap-gutter-sm">
            {navItems.map((item) => {
              const isActive = isRouteActive(item.id);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`px-gutter-md py-2 rounded-full border-2 border-outline font-label text-label-md transition-colors duration-state-change whitespace-nowrap shrink-0 relative ${
                    isActive
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.id === 'profil' && unreadChatCount > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] leading-none rounded-full bg-secondary text-on-secondary border border-outline tabular-nums">
                      {unreadChatCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Location Badge */}
          <div className="flex items-center gap-gutter-xs px-3 py-1.5 rounded-full bg-surface-container-lowest border-2 border-outline shrink-0">
            <span
              className="material-symbols-outlined text-title-md text-on-surface"
              aria-hidden="true"
            >
              location_on
            </span>
            <span className="font-label text-label-md text-on-surface whitespace-nowrap">
              {dormLabel}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {children}

      {/* Bottom Navigation (Phone & Tablet) */}
      <nav
        aria-label="Navigasi bawah"
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-surface-container-lowest border-t-2 border-outline"
      >
        <div className="grid grid-cols-3">
          {navItems.map((item, idx) => {
            const isActive = isRouteActive(item.id);
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`py-3.5 flex items-center justify-center gap-gutter-xs font-label text-label-md transition-colors duration-state-change ${
                  idx < 2 ? 'border-r-2 border-outline' : ''
                } ${
                  isActive
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <span
                  className="material-symbols-outlined text-title-md"
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
