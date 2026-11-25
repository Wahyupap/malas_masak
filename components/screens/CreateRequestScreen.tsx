'use client';

import React, { useState } from 'react';
import {
  CreateRequestPayload,
  CuisineCategory,
  IngredientMode,
  TimingOption,
} from '../../types';

interface CreateRequestScreenProps {
  initialCategory?: CuisineCategory;
  onBack: () => void;
  onSubmitRequest: (payload: CreateRequestPayload) => Promise<void>;
}

const CATEGORIES: CuisineCategory[] = [
  'Nasi & lauk',
  'Mie & sup',
  'Camilan',
  'Menu sehat',
];

/**
 * Screen 3: Buat Request (Create Cooking Request)
 *
 * BACKEND INTEGRATION NOTE:
 * - On form submit, call `POST /api/requests` with `CreateRequestPayload`.
 * - If user picks "Foto bahan", upload image via `multipart/form-data` or pre-signed
 *   object storage URL (S3 / Supabase Storage / Cloudinary) before creating request.
 * - Escrow holds `chefWage + 2000` (biaya layanan kampus).
 */
export const CreateRequestScreen: React.FC<CreateRequestScreenProps> = ({
  initialCategory = 'Nasi & lauk',
  onBack,
  onSubmitRequest,
}) => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CuisineCategory>(initialCategory);
  const [roomAddress, setRoomAddress] = useState('');
  const [timing, setTiming] = useState<TimingOption>('Secepatnya');
  const [scheduledTime, setScheduledTime] = useState('19:30 WIB');
  const [ingredientMode, setIngredientMode] = useState<IngredientMode>(
    'Koki yang belanja'
  );
  const [ingredientDetailMode, setIngredientDetailMode] = useState<
    'foto' | 'tulis'
  >('tulis');
  const [ingredientList, setIngredientList] = useState('');
  const [ingredientPhotoName, setIngredientPhotoName] = useState<string | null>(
    null
  );
  const [chefWage, setChefWage] = useState<number>(15000);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIngredientPhotoName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!description.trim()) {
      setErrorMsg('Tuliskan dulu masakan yang kamu mau ya.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitRequest({
        description: description.trim(),
        category,
        roomAddress: roomAddress.trim() || 'Asrama Melati, Kamar B105',
        timing,
        scheduledTime: timing === 'Jadwalkan' ? scheduledTime : undefined,
        ingredientMode,
        ingredientDetailMode:
          ingredientMode === 'Saya sediakan' ? ingredientDetailMode : undefined,
        ingredientList:
          ingredientMode === 'Saya sediakan' ? ingredientList : undefined,
        ingredientPhotoName: ingredientPhotoName ?? undefined,
        chefWage: Number.isFinite(chefWage) && chefWage >= 5000 ? chefWage : 15000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      {/* Contextual Task Flow Header */}
      <header className="bg-surface-container border-b-2 border-outline sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-gutter-md sm:px-gutter-lg py-3.5 flex items-center gap-gutter-md">
          <button
            type="button"
            onClick={onBack}
            aria-label="Kembali ke Beranda"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-lowest text-on-surface border-2 border-outline transition-colors duration-state-change hover:bg-surface-container-low shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
              arrow_back
            </span>
          </button>
          <div className="flex flex-col">
            <h1 className="font-headline text-headline-lg-mobile sm:text-headline-lg text-on-surface">
              Buat request
            </h1>
            <p className="font-body text-body-sm text-on-surface-variant">
              Ceritakan masakan yang kamu mau.
            </p>
          </div>
        </div>
      </header>

      {/* Main Form */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-gutter-md sm:px-gutter-lg py-gutter-lg">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start"
        >
          <div className="lg:col-span-7 flex flex-col gap-gutter-lg">
            {errorMsg && (
              <div
                role="alert"
                className="px-gutter-md py-2.5 rounded-lg bg-error-container text-on-error-container border-2 border-outline font-body text-body-sm"
              >
                {errorMsg}
              </div>
            )}

            {/* Mau dimasakin apa? */}
            <label className="flex flex-col gap-gutter-xs">
              <span className="font-label text-label-md text-on-surface">
                Mau dimasakin apa?
              </span>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Contoh: nasi goreng kampung, tidak pedas, tambah telur mata sapi"
                className="w-full px-gutter-md py-3 rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant border-2 border-outline font-body text-body-md focus:border-outline focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </label>

            {/* Jenis masakan */}
            <div className="flex flex-col gap-gutter-xs">
              <span className="font-label text-label-md text-on-surface">
                Jenis masakan
              </span>
              <div className="flex flex-wrap gap-gutter-sm">
                {CATEGORIES.map((cat) => {
                  const isActive = category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setCategory(cat)}
                      className={`inline-flex items-center px-gutter-md py-2 rounded-full border-2 border-outline font-label text-label-md transition-colors duration-state-change cursor-pointer ${
                        isActive
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Antar ke */}
            <label className="flex flex-col gap-gutter-xs">
              <span className="font-label text-label-md text-on-surface">
                Antar ke
              </span>
              <input
                type="text"
                value={roomAddress}
                onChange={(e) => setRoomAddress(e.target.value)}
                placeholder="Asrama / nomor kamar. Contoh: B105"
                className="w-full px-gutter-md py-3 rounded bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant border-2 border-outline font-body text-body-md focus:border-outline focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </label>

            {/* Kapan? */}
            <div className="flex flex-col gap-gutter-xs">
              <span className="font-label text-label-md text-on-surface">
                Kapan?
              </span>
              <div className="flex flex-wrap items-center gap-gutter-sm">
                {(['Secepatnya', 'Jadwalkan'] as TimingOption[]).map((opt) => {
                  const isActive = timing === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setTiming(opt)}
                      className={`inline-flex items-center px-gutter-md py-2 rounded-full border-2 border-outline font-label text-label-md transition-colors duration-state-change cursor-pointer ${
                        isActive
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
                {timing === 'Jadwalkan' && (
                  <input
                    type="text"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    placeholder="Contoh: 19:30 WIB"
                    className="px-gutter-md py-2 rounded-full bg-surface-container-lowest text-on-surface border-2 border-outline font-body text-body-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                )}
              </div>
            </div>

            {/* Bahan makanan */}
            <div className="flex flex-col gap-gutter-xs">
              <span className="font-label text-label-md text-on-surface">
                Bahan makanan
              </span>
              <div className="flex flex-wrap gap-gutter-sm">
                {(
                  ['Koki yang belanja', 'Saya sediakan'] as IngredientMode[]
                ).map((mode) => {
                  const isActive = ingredientMode === mode;
                  return (
                    <button
                      key={mode}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setIngredientMode(mode)}
                      className={`inline-flex items-center px-gutter-md py-2 rounded-full border-2 border-outline font-label text-label-md transition-colors duration-state-change cursor-pointer ${
                        isActive
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
                      }`}
                    >
                      {mode}
                    </button>
                  );
                })}
              </div>

              {ingredientMode === 'Koki yang belanja' && (
                <p className="font-body text-body-sm text-on-surface-variant flex items-center gap-gutter-xs pt-1">
                  <span
                    className="material-symbols-outlined text-title-md text-secondary"
                    aria-hidden="true"
                  >
                    receipt
                  </span>
                  <span>Koki wajib unggah foto nota belanja di halaman Status.</span>
                </p>
              )}

              {/* Opsi jika Saya sediakan (visible by default or when selected, matching reference screen) */}
              <div className="mt-gutter-xs bg-surface-container-low border-2 border-outline rounded-lg p-gutter-md flex flex-col gap-gutter-sm">
                <span className="font-label text-label-sm text-on-surface-variant">
                  Detail bahan (jika Saya sediakan):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setIngredientMode('Saya sediakan');
                      setIngredientDetailMode('foto');
                    }}
                    className={`inline-flex items-center justify-center gap-gutter-xs px-gutter-md py-2.5 rounded-lg border-2 border-outline font-label text-label-md transition-colors duration-state-change cursor-pointer ${
                      ingredientDetailMode === 'foto'
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-lowest text-on-surface hover:bg-primary-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-title-md" aria-hidden="true">
                      photo_camera
                    </span>
                    <span>Foto bahan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIngredientMode('Saya sediakan');
                      setIngredientDetailMode('tulis');
                    }}
                    className={`inline-flex items-center justify-center gap-gutter-xs px-gutter-md py-2.5 rounded-lg border-2 border-outline font-label text-label-md transition-colors duration-state-change cursor-pointer ${
                      ingredientDetailMode === 'tulis'
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-lowest text-on-surface hover:bg-primary-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-title-md" aria-hidden="true">
                      edit_note
                    </span>
                    <span>Tulis daftar bahan</span>
                  </button>
                </div>

                {ingredientDetailMode === 'tulis' ? (
                  <textarea
                    rows={2}
                    value={ingredientList}
                    onChange={(e) => setIngredientList(e.target.value)}
                    placeholder="Tulis bahan yang tersedia. Contoh: 2 telur, nasi putih, bawang merah, kecap"
                    className="w-full px-gutter-md py-2.5 rounded bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant border-2 border-outline font-body text-body-sm focus:border-outline focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                ) : (
                  <label className="flex items-center justify-between gap-gutter-sm px-gutter-md py-3 rounded bg-surface-container-lowest border-2 border-dashed border-outline cursor-pointer hover:bg-surface-container">
                    <span className="font-body text-body-sm text-on-surface-variant truncate">
                      {ingredientPhotoName
                        ? `Terpilih: ${ingredientPhotoName}`
                        : 'Pilih foto bahan makananmu (JPG/PNG)'}
                    </span>
                    <span className="font-label text-label-sm text-secondary shrink-0">
                      Pilih file
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      className="sr-only"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Upah & Submit Panel */}
          <div className="lg:col-span-5 flex flex-col gap-gutter-md bg-surface-container-lowest border-2 border-outline rounded-lg p-gutter-md sm:p-gutter-lg">
            <label className="flex flex-col gap-gutter-xs">
              <span className="font-label text-label-md text-on-surface">
                Upah untuk koki
              </span>
              <div className="relative flex items-center">
                <span
                  aria-hidden="true"
                  className="absolute left-gutter-md font-label text-label-md text-on-surface-variant"
                >
                  Rp
                </span>
                <input
                  type="number"
                  min={5000}
                  step={1000}
                  value={chefWage}
                  onChange={(e) => setChefWage(Number(e.target.value))}
                  inputMode="numeric"
                  className="w-full pl-11 pr-gutter-md py-3 rounded bg-surface-container-lowest text-on-surface border-2 border-outline font-body text-body-md tabular-nums focus:border-outline focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <span className="font-body text-body-sm text-on-surface-variant">
                Biaya layanan kampus Rp 2.000 · Dana ditahan aman (escrow).
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-3.5 rounded-lg bg-secondary text-on-secondary border-2 border-outline font-headline text-label-lg transition-transform duration-state-change ease-state-change hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-outline disabled:opacity-60 cursor-pointer"
            >
              <span>{isSubmitting ? 'Mengirim...' : 'Kirim request'}</span>
            </button>

            <p className="font-body text-body-sm text-on-surface-variant text-center">
              Request tampil ke koki Seni Kuliner di kampusmu.
            </p>
          </div>
        </form>
      </main>
    </div>
  );
};
