'use client';

import React, { useState } from 'react';
import {
  ActiveChef,
  CuisineCategory,
  OpenRequest,
  UserRole,
} from '../../types';
import { DefaultAvatar } from '../DefaultAvatar';

interface HomeScreenProps {
  activeRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  activeChefs: ActiveChef[];
  openRequests: OpenRequest[];
  onGoCreateRequest: (initialCategory?: CuisineCategory) => void;
  onChatWithChef: (chef: ActiveChef) => void;
  onClaimRequest: (request: OpenRequest) => void;
}

const CATEGORIES: CuisineCategory[] = [
  'Nasi & lauk',
  'Mie & sup',
  'Camilan',
  'Menu sehat',
];

const formatRupiah = (amount: number) =>
  `Rp ${amount.toLocaleString('id-ID')}`;

/**
 * Screen 2: Beranda (Home Feed)
 *
 * BACKEND INTEGRATION NOTE:
 * - Fetch `activeChefs` from `GET /api/chefs/active`
 * - Fetch `openRequests` from `GET /api/requests?status=open`
 * - Filter dynamically via query params or client-side memoization
 * - `onClaimRequest` should trigger `POST /api/requests/:id/accept`
 */
export const HomeScreen: React.FC<HomeScreenProps> = ({
  activeRole,
  onChangeRole,
  activeChefs,
  openRequests,
  onGoCreateRequest,
  onChatWithChef,
  onClaimRequest,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CuisineCategory | null>(
    'Nasi & lauk'
  );
  const [showAllFiltered, setShowAllFiltered] = useState(true);

  const handleCategoryClick = (cat: CuisineCategory) => {
    if (selectedCategory === cat && !showAllFiltered) {
      setShowAllFiltered(true);
    } else {
      setSelectedCategory(cat);
      setShowAllFiltered(false);
    }
  };

  const displayedChefs =
    !showAllFiltered && selectedCategory
      ? activeChefs.filter((c) => c.category === selectedCategory)
      : activeChefs;

  const displayedRequests =
    !showAllFiltered && selectedCategory
      ? openRequests.filter((r) => r.category === selectedCategory)
      : openRequests;

  return (
    <main className="flex-1 max-w-6xl w-full mx-auto px-gutter-md sm:px-gutter-lg lg:px-gutter-xl py-gutter-lg lg:py-gutter-xl flex flex-col gap-gutter-xl">
      {/* Top Grid: Hero + Cara Kerjanya on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
        {/* Hero & Role Toggle */}
        <section className="lg:col-span-7 flex flex-col gap-gutter-md">
          <div className="flex flex-col gap-gutter-sm">
            <h1 className="font-headline text-display-lg-mobile sm:text-display-lg text-on-surface text-balance">
              Lapar tapi malas masak?
            </h1>
            <p className="font-body text-body-lg text-on-surface-variant text-pretty max-w-prose">
              Minta teman Seni Kuliner di kampusmu yang masakin, langsung diantar ke kamar asramamu.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-gutter-md">
            <button
              type="button"
              onClick={() => onGoCreateRequest(selectedCategory ?? 'Nasi & lauk')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-gutter-sm px-gutter-xl py-3.5 rounded-lg bg-secondary text-on-secondary border-2 border-outline font-headline text-label-lg transition-transform duration-state-change ease-state-change hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-outline cursor-pointer whitespace-nowrap"
            >
              <span>Minta masakin</span>
            </button>

            <div className="flex items-center gap-gutter-sm" role="group" aria-label="Pilih peran">
              <button
                type="button"
                aria-pressed={activeRole === 'pemesan'}
                onClick={() => onChangeRole('pemesan')}
                className={`inline-flex items-center justify-center px-gutter-md py-2 rounded-full border-2 border-outline font-label text-label-md transition-colors duration-state-change cursor-pointer whitespace-nowrap ${
                  activeRole === 'pemesan'
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
                }`}
              >
                Saya pemesan
              </button>
              <button
                type="button"
                aria-pressed={activeRole === 'koki'}
                onClick={() => onChangeRole('koki')}
                className={`inline-flex items-center justify-center px-gutter-md py-2 rounded-full border-2 border-outline font-label text-label-md transition-colors duration-state-change cursor-pointer whitespace-nowrap ${
                  activeRole === 'koki'
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
                }`}
              >
                Saya koki
              </button>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-col gap-gutter-sm pt-gutter-sm">
            <div className="flex items-center justify-between gap-gutter-sm">
              <h2 className="font-headline text-headline-sm text-on-surface">
                Mau dimasakin apa?
              </h2>
              {!showAllFiltered && (
                <button
                  type="button"
                  onClick={() => setShowAllFiltered(true)}
                  className="font-label text-label-sm text-secondary hover:underline cursor-pointer"
                >
                  Tampilkan semua
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-gutter-sm">
              {CATEGORIES.map((category) => {
                const isSelected = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handleCategoryClick(category)}
                    className={`inline-flex items-center justify-center px-gutter-md py-2 rounded-full border-2 border-outline font-label text-label-md transition-colors duration-state-change cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Cara Kerjanya */}
        <section className="lg:col-span-5 flex flex-col gap-gutter-sm">
          <h2 className="font-headline text-headline-sm text-on-surface">
            Cara kerjanya
          </h2>
          <article className="bg-surface-container-lowest text-on-surface border-2 border-outline rounded-lg p-gutter-md sm:p-gutter-lg flex flex-col gap-gutter-md">
            <ol className="flex flex-col gap-gutter-md">
              <li className="flex items-start gap-gutter-sm">
                <span className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-label text-label-md shrink-0 tabular-nums">
                  1
                </span>
                <span className="font-body text-body-md text-on-surface">
                  Tulis request masakanmu &amp; tentukan upah koki.
                </span>
              </li>
              <li className="flex items-start gap-gutter-sm">
                <span className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-label text-label-md shrink-0 tabular-nums">
                  2
                </span>
                <span className="font-body text-body-md text-on-surface">
                  Koki Seni Kuliner menerima &amp; memasak pesananmu.
                </span>
              </li>
              <li className="flex items-start gap-gutter-sm">
                <span className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-label text-label-md shrink-0 tabular-nums">
                  3
                </span>
                <span className="font-body text-body-md text-on-surface">
                  Makanan diantar ke asramamu, dana cair setelah puas.
                </span>
              </li>
            </ol>
          </article>
        </section>
      </div>

      {/* Role-aware ordering: When user toggles "Saya koki", Request Terbuka comes right below Hero */}
      {activeRole === 'koki' ? (
        <>
          <OpenRequestsSection
            requests={displayedRequests}
            onClaimRequest={onClaimRequest}
          />
          <ActiveChefsSection
            chefs={displayedChefs}
            onChatWithChef={onChatWithChef}
          />
        </>
      ) : (
        <>
          <ActiveChefsSection
            chefs={displayedChefs}
            onChatWithChef={onChatWithChef}
          />
          <OpenRequestsSection
            requests={displayedRequests}
            onClaimRequest={onClaimRequest}
          />
        </>
      )}
    </main>
  );
};

interface ActiveChefsSectionProps {
  chefs: ActiveChef[];
  onChatWithChef: (chef: ActiveChef) => void;
}

const ActiveChefsSection: React.FC<ActiveChefsSectionProps> = ({
  chefs,
  onChatWithChef,
}) => (
  <section className="flex flex-col gap-gutter-sm">
    <div className="flex items-center justify-between gap-gutter-md">
      <h2 className="font-headline text-headline-sm text-on-surface">
        Koki aktif sekarang
      </h2>
      <span className="font-body text-body-sm text-on-surface-variant tabular-nums">
        {chefs.length} koki siap masak
      </span>
    </div>

    {chefs.length === 0 ? (
      <div className="bg-surface-container-lowest border-2 border-outline rounded-lg p-gutter-md text-center font-body text-body-md text-on-surface-variant">
        Belum ada koki aktif untuk kategori ini. Coba tampilkan semua kategori.
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter-md items-stretch">
        {chefs.map((chef, idx) => (
          <article
            key={chef.id}
            className={`h-full bg-surface-container-lowest text-on-surface border-2 border-outline rounded-lg p-gutter-md flex items-center justify-between gap-gutter-md ${
              idx === 2 && chefs.length === 3 ? 'sm:col-span-2 lg:col-span-1' : ''
            }`}
          >
            <div className="flex items-center gap-gutter-md min-w-0">
              <DefaultAvatar
                src={chef.avatarUrl}
                alt={`Foto ${chef.name}`}
                sizeClass="w-12 h-12"
              />
              <header className="min-w-0">
                <h3 className="font-title text-title-md text-on-surface truncate">
                  {chef.name}
                </h3>
                <p className="font-body text-body-sm text-on-surface-variant">
                  {chef.major} · {chef.specialty}
                </p>
                <p className="font-label text-label-sm text-secondary tabular-nums">
                  {chef.rating.toFixed(1)} ★ · {chef.completedCount} pesanan
                </p>
              </header>
            </div>
            <footer className="shrink-0">
              <button
                type="button"
                onClick={() => onChatWithChef(chef)}
                className="inline-flex items-center gap-gutter-xs px-gutter-md py-2 rounded-full bg-surface-container-lowest text-on-surface border-2 border-outline font-label text-label-md hover:bg-surface-container-low transition-colors duration-state-change cursor-pointer"
              >
                Chat
              </button>
            </footer>
          </article>
        ))}
      </div>
    )}
  </section>
);

interface OpenRequestsSectionProps {
  requests: OpenRequest[];
  onClaimRequest: (req: OpenRequest) => void;
}

const OpenRequestsSection: React.FC<OpenRequestsSectionProps> = ({
  requests,
  onClaimRequest,
}) => (
  <section className="flex flex-col gap-gutter-sm">
    <div className="flex items-center justify-between gap-gutter-md">
      <div className="flex flex-col">
        <h2 className="font-headline text-headline-sm text-on-surface">
          Request terbuka
        </h2>
        <p className="font-body text-body-sm text-on-surface-variant">
          Belum diambil koki — siap dimasak sekarang
        </p>
      </div>
      <span className="shrink-0 px-3 py-1 rounded-full bg-primary-container text-on-primary-container border-2 border-outline font-label text-label-sm tabular-nums">
        {requests.length} tersedia
      </span>
    </div>

    {requests.length === 0 ? (
      <div className="bg-surface-container-lowest border-2 border-outline rounded-lg p-gutter-md text-center font-body text-body-md text-on-surface-variant">
        Semua request terbuka sudah diambil koki.
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter-md items-stretch">
        {requests.map((req, idx) => (
          <article
            key={req.id}
            className={`h-full bg-surface-container-lowest text-on-surface border-2 border-outline rounded-lg p-gutter-md flex flex-col justify-between gap-gutter-md ${
              idx === 2 && requests.length === 3 ? 'sm:col-span-2 lg:col-span-1' : ''
            }`}
          >
            <div className="flex flex-col gap-gutter-xs">
              <div className="flex items-center justify-between gap-gutter-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface border border-outline font-label text-label-sm">
                  {req.category}
                </span>
                <span
                  className={`font-label text-label-sm tabular-nums ${
                    req.timingLabel === 'Secepatnya'
                      ? 'text-secondary'
                      : 'text-on-surface-variant'
                  }`}
                >
                  {req.timingLabel}
                </span>
              </div>
              <h3 className="font-title text-title-md text-on-surface">
                {req.title}
              </h3>
              <p className="font-body text-body-sm text-on-surface-variant">
                {req.dormName} · {req.roomNumber} ·{' '}
                {req.ingredientMode === 'Koki yang belanja'
                  ? 'Koki belanja'
                  : 'Bahan tersedia'}
              </p>
            </div>
            <footer className="flex items-center justify-between gap-gutter-sm pt-gutter-xs border-t border-outline-variant">
              <div className="flex flex-col">
                <span className="font-label text-label-sm text-on-surface-variant">
                  Upah koki
                </span>
                <span className="font-title text-title-md text-on-surface tabular-nums">
                  {formatRupiah(req.chefWage)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onClaimRequest(req)}
                className="inline-flex items-center px-gutter-md py-2 rounded-full bg-primary text-on-primary border-2 border-outline font-label text-label-md hover:bg-primary-container transition-colors duration-state-change cursor-pointer whitespace-nowrap"
              >
                Ambil request
              </button>
            </footer>
          </article>
        ))}
      </div>
    )}
  </section>
);
