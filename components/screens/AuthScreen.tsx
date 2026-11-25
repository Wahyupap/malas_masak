'use client';

import React, { useState } from 'react';
import { loginWithNim, registerAccount } from '../../services/api';
import { UserRole } from '../../types';
import { MascotLogo } from '../MascotLogo';

interface AuthScreenProps {
  onSuccessAuth: (params: {
    nim: string;
    dormName?: string;
    activeRole?: UserRole;
  }) => void;
}

/**
 * Screen 1: Masuk / Daftar (Authentication)
 *
 * BACKEND INTEGRATION NOTE (Next.js App Router):
 * - Wire `handleSubmit` to `POST /api/auth/login` or `POST /api/auth/register`.
 * - Store session via HTTP-only JWT cookie or NextAuth.js / Auth.js session.
 * - Redirect authenticated users to `/` (`Beranda`) via `router.push('/')`.
 */
export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccessAuth }) => {
  const [mode, setMode] = useState<'masuk' | 'daftar'>('masuk');
  const [nim, setNim] = useState('2024103045');
  const [password, setPassword] = useState('********');
  const [showPassword, setShowPassword] = useState(false);
  const [dormName, setDormName] = useState('Dorm Melati');
  const [initialRole, setInitialRole] = useState<UserRole>('pemesan');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      if (mode === 'masuk') {
        const res = await loginWithNim({ nim, password });
        if (!res.ok) {
          setErrorMsg(res.error ?? 'Gagal masuk. Periksa kembali NIM & kata sandi.');
          return;
        }
        onSuccessAuth({ nim: res.user?.nim ?? nim });
      } else {
        const res = await registerAccount({
          nim,
          password,
          dormName,
          initialRole,
        });
        if (!res.ok) {
          setErrorMsg(res.error ?? 'Gagal mendaftar.');
          return;
        }
        onSuccessAuth({
          nim: res.user?.nim ?? nim,
          dormName: res.user?.dormName ?? dormName,
          activeRole: res.user?.activeRole ?? initialRole,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-gutter-md sm:px-gutter-lg lg:px-gutter-xl py-gutter-xl bg-surface text-on-surface">
      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-gutter-xl items-center">
        {/* Brand Intro */}
        <section className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left gap-gutter-md">
          <div className="flex items-center gap-gutter-sm">
            {/* Uploaded Mascot App Icon */}
            <img
              src="/assets/aistudio/maskot_panci_tidur_app_icon_b05a7c05.jpeg"
              alt="Maskot Panci Tidur malas masak"
              className="w-13 h-13 rounded-md object-cover border-2 border-outline shrink-0 bg-surface-container-lowest"
            />
            <div className="hidden sm:flex items-center">
              <MascotLogo size={42} className="sr-only" />
            </div>
            <span className="font-headline text-headline-md text-on-surface">
              malas masak
            </span>
          </div>

          <h1 className="font-headline text-display-lg-mobile sm:text-display-lg text-on-surface text-balance">
            Malas masak? Biar temanmu yang masakin.
          </h1>
          <p className="font-body text-body-lg text-on-surface-variant text-pretty max-w-prose">
            Masuk pakai NIM kampusmu untuk pesan makanan dari mahasiswa Seni Kuliner atau ambil request masak.
          </p>

          <ul className="hidden lg:flex flex-col gap-gutter-sm pt-gutter-xs">
            <li className="flex items-center gap-gutter-sm">
              <span className="material-symbols-outlined text-title-md text-secondary" aria-hidden="true">
                verified_user
              </span>
              <span className="font-body text-body-md text-on-surface">
                Terverifikasi NIM database kampus (PIB)
              </span>
            </li>
            <li className="flex items-center gap-gutter-sm">
              <span className="material-symbols-outlined text-title-md text-secondary" aria-hidden="true">
                lock
              </span>
              <span className="font-body text-body-md text-on-surface">
                Pembayaran escrow aman sampai makanan tiba
              </span>
            </li>
            <li className="flex items-center gap-gutter-sm">
              <span className="material-symbols-outlined text-title-md text-secondary" aria-hidden="true">
                receipt
              </span>
              <span className="font-body text-body-md text-on-surface">
                Nota belanja bahan transparan di halaman Status
              </span>
            </li>
          </ul>
        </section>

        {/* Auth Card */}
        <section className="lg:col-span-6 w-full max-w-md mx-auto">
          <article className="bg-surface-container-lowest text-on-surface border-2 border-outline rounded-lg p-gutter-md sm:p-gutter-lg flex flex-col gap-gutter-md">
            {/* Mode Toggle */}
            <div
              className="grid grid-cols-2 gap-gutter-xs p-1 rounded-full bg-surface-container border-2 border-outline"
              role="tablist"
              aria-label="Mode autentikasi"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'masuk'}
                onClick={() => {
                  setMode('masuk');
                  setErrorMsg(null);
                }}
                className={`py-2 rounded-full border-2 font-label text-label-md transition-colors duration-state-change cursor-pointer ${
                  mode === 'masuk'
                    ? 'bg-primary text-on-primary border-outline'
                    : 'bg-transparent text-on-surface border-transparent hover:bg-surface-container-low'
                }`}
              >
                Masuk
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'daftar'}
                onClick={() => {
                  setMode('daftar');
                  setErrorMsg(null);
                }}
                className={`py-2 rounded-full border-2 font-label text-label-md transition-colors duration-state-change cursor-pointer ${
                  mode === 'daftar'
                    ? 'bg-primary text-on-primary border-outline'
                    : 'bg-transparent text-on-surface border-transparent hover:bg-surface-container-low'
                }`}
              >
                Daftar
              </button>
            </div>

            {errorMsg && (
              <div
                role="alert"
                className="px-gutter-md py-2.5 rounded bg-error-container text-on-error-container border-2 border-outline font-body text-body-sm"
              >
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-gutter-md">
              {/* NIM */}
              <label className="flex flex-col gap-gutter-xs">
                <span className="font-label text-label-md text-on-surface">
                  NIM mahasiswa
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  placeholder="Contoh: 2024103045"
                  className="w-full px-gutter-md py-3 rounded bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant border-2 border-outline font-body text-body-md tabular-nums focus:border-outline focus:ring-2 focus:ring-primary focus:outline-none"
                />
                <span className="font-body text-body-sm text-on-surface-variant">
                  Diverifikasi otomatis dari database kampus (PIB).
                </span>
              </label>

              {/* Password */}
              <label className="flex flex-col gap-gutter-xs">
                <span className="font-label text-label-md text-on-surface">
                  Kata sandi
                </span>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    className="w-full pl-gutter-md pr-11 py-3 rounded bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant border-2 border-outline font-body text-body-md focus:border-outline focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    className="absolute right-3 text-on-surface-variant hover:text-on-surface cursor-pointer flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-title-md" aria-hidden="true">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </label>

              {/* Register-only fields */}
              {mode === 'daftar' && (
                <div className="flex flex-col gap-gutter-md">
                  <label className="flex flex-col gap-gutter-xs">
                    <span className="font-label text-label-md text-on-surface">
                      Asrama / Dorm
                    </span>
                    <select
                      value={dormName}
                      onChange={(e) => setDormName(e.target.value)}
                      className="w-full px-gutter-md py-3 rounded bg-surface-container-lowest text-on-surface border-2 border-outline font-body text-body-md focus:border-outline focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      <option value="Dorm Melati">Dorm Melati</option>
                      <option value="Dorm Anggrek">Dorm Anggrek</option>
                      <option value="Dorm Cendana">Dorm Cendana</option>
                    </select>
                  </label>

                  <div className="flex flex-col gap-gutter-xs">
                    <span className="font-label text-label-md text-on-surface">
                      Peran awal
                    </span>
                    <div className="flex flex-wrap gap-gutter-sm">
                      <button
                        type="button"
                        aria-pressed={initialRole === 'pemesan'}
                        onClick={() => setInitialRole('pemesan')}
                        className={`px-gutter-md py-2 rounded-full border-2 border-outline font-label text-label-md transition-colors duration-state-change cursor-pointer ${
                          initialRole === 'pemesan'
                            ? 'bg-primary text-on-primary'
                            : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
                        }`}
                      >
                        Pemesan (Default)
                      </button>
                      <button
                        type="button"
                        aria-pressed={initialRole === 'koki'}
                        onClick={() => setInitialRole('koki')}
                        className={`px-gutter-md py-2 rounded-full border-2 border-outline font-label text-label-md transition-colors duration-state-change cursor-pointer ${
                          initialRole === 'koki'
                            ? 'bg-primary text-on-primary'
                            : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
                        }`}
                      >
                        Daftar jadi Koki
                      </button>
                    </div>
                    <span className="font-body text-body-sm text-on-surface-variant">
                      Pendaftaran koki diverifikasi admin Seni Kuliner.
                    </span>
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-3.5 rounded-lg bg-secondary text-on-secondary border-2 border-outline font-headline text-label-lg transition-transform duration-state-change ease-state-change hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-outline disabled:opacity-60 cursor-pointer"
              >
                <span>
                  {isSubmitting
                    ? 'Memverifikasi...'
                    : mode === 'masuk'
                      ? 'Masuk ke malas masak'
                      : 'Daftar & masuk'}
                </span>
              </button>
            </form>
          </article>
        </section>
      </main>
    </div>
  );
};
