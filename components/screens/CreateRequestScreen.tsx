'use client';

import React, { useState } from 'react';
import {
  ActiveChef,
  CreateRequestPayload,
  RequestType,
  TimingOption,
} from '../../types';
import { DefaultAvatar } from '../DefaultAvatar';

interface CreateRequestScreenProps {
  activeChefs: ActiveChef[];
  initialRequestType?: RequestType;
  initialChefId?: string;
  onBack: () => void;
  onSubmitRequest: (payload: CreateRequestPayload) => Promise<void>;
}

const REQUEST_FEE_RUPIAH = 500;

/**
 * Screen 3: Buat Request (Create Cooking Request)
 *
 * BACKEND INTEGRATION NOTE:
 * - On form submit, call `POST /api/requests` with `CreateRequestPayload`.
 * - When `requestType === 'publik'`, the request appears in the public open feed (`GET /api/requests?status=open`).
 * - When `requestType === 'pilih-chef'`, route the request directly to `selectedChef.id` and notify them via Chat/WebSocket.
 * - If user picks "Foto bahan", upload image via `multipart/form-data` or pre-signed
 *   object storage URL (S3 / Supabase Storage / Cloudinary) before creating request.
 * - Escrow holds `chefWage + 500` (Pajak Unggah Request Rp 500).
 */
export const CreateRequestScreen: React.FC<CreateRequestScreenProps> = ({
  activeChefs,
  initialRequestType = 'publik',
  initialChefId,
  onBack,
  onSubmitRequest,
}) => {
  const [description, setDescription] = useState('');
  const [requestType, setRequestType] =
    useState<RequestType>(initialRequestType);
  const [selectedChefId, setSelectedChefId] = useState<string>(
    initialChefId && activeChefs.some((c) => c.id === initialChefId)
      ? initialChefId
      : activeChefs[0]?.id ?? ''
  );
  const [roomAddress, setRoomAddress] = useState('');
  const [timing, setTiming] = useState<TimingOption>('Secepatnya');
  const [scheduledTime, setScheduledTime] = useState('19:30 WIB');
  const [ingredientMode, setIngredientMode] = useState<
    'Gunakan Menu Chef' | 'Saya sediakan'
  >(initialRequestType === 'pilih-chef' ? 'Gunakan Menu Chef' : 'Saya sediakan');
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

  const selectedChef =
    activeChefs.find((c) => c.id === selectedChefId) ?? activeChefs[0];

  const handleSelectRequestType = (nextType: RequestType) => {
    setRequestType(nextType);
    // Sync default ingredient option per new design behavior:
    // "Pilih Chef" -> Gunakan Menu Chef; "Publik" -> Saya sediakan
    if (nextType === 'pilih-chef') {
      setIngredientMode('Gunakan Menu Chef');
    } else {
      setIngredientMode('Saya sediakan');
    }
  };

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

    if (requestType === 'pilih-chef' && !selectedChef) {
      setErrorMsg('Pilih salah satu chef aktif terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitRequest({
        description: description.trim(),
        requestType,
        selectedChef: requestType === 'pilih-chef' ? selectedChef : undefined,
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
        requestFee: REQUEST_FEE_RUPIAH,
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
            <span
              className="material-symbols-outlined text-title-lg"
              aria-hidden="true"
            >
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

            {/* Jenis Request */}
            <div className="flex flex-col gap-gutter-xs">
              <span className="font-label text-label-md text-on-surface">
                Jenis Request
              </span>
              <div className="flex flex-wrap gap-gutter-sm">
                <button
                  type="button"
                  aria-pressed={requestType === 'publik'}
                  onClick={() => handleSelectRequestType('publik')}
                  className={`inline-flex items-center px-gutter-md py-2 rounded-full border-2 border-outline font-label text-label-md transition-colors duration-state-change cursor-pointer ${
                    requestType === 'publik'
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  Publik
                </button>
                <button
                  type="button"
                  aria-pressed={requestType === 'pilih-chef'}
                  onClick={() => handleSelectRequestType('pilih-chef')}
                  className={`inline-flex items-center px-gutter-md py-2 rounded-full border-2 border-outline font-label text-label-md transition-colors duration-state-change cursor-pointer ${
                    requestType === 'pilih-chef'
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  Pilih Chef
                </button>
              </div>

              {/* Horizontal 3-row active chefs selector when "Pilih Chef" is active */}
              {requestType === 'pilih-chef' && (
                <div
                  id="pilih-chef-section"
                  className="mt-gutter-xs bg-surface-container-low border-2 border-outline rounded-lg p-gutter-md flex flex-col gap-gutter-sm"
                >
                  <div className="flex items-center justify-between gap-gutter-sm">
                    <span className="font-label text-label-sm text-on-surface-variant">
                      Pilih chef aktif (geser ke samping)
                    </span>
                    <span className="font-label text-label-sm text-secondary tabular-nums">
                      {activeChefs.length} aktif
                    </span>
                  </div>

                  <div className="grid grid-flow-col grid-rows-3 auto-cols-[240px] gap-gutter-sm overflow-x-auto pb-2">
                    {activeChefs.map((chef) => {
                      const isChefSelected = selectedChef?.id === chef.id;
                      return (
                        <button
                          key={chef.id}
                          type="button"
                          aria-pressed={isChefSelected}
                          onClick={() => setSelectedChefId(chef.id)}
                          className={`flex items-center gap-gutter-sm p-2.5 rounded-lg border-2 border-outline text-left transition-colors duration-state-change cursor-pointer ${
                            isChefSelected
                              ? 'bg-primary-container'
                              : 'bg-surface-container-lowest hover:bg-primary-container/60'
                          }`}
                        >
                          <DefaultAvatar
                            src={chef.avatarUrl}
                            alt={`Foto ${chef.name}`}
                            sizeClass="w-10 h-10"
                          />
                          <div className="min-w-0">
                            <p className="font-title text-title-sm text-on-surface truncate">
                              {chef.name}
                            </p>
                            <p className="font-body text-body-sm text-on-surface-variant truncate tabular-nums">
                              {chef.rating.toFixed(1)} ★ · {chef.specialty}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
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
                  ['Gunakan Menu Chef', 'Saya sediakan'] as const
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

              {/* Detail bahan panel when "Saya sediakan" is selected */}
              {ingredientMode === 'Saya sediakan' && (
                <div className="mt-gutter-xs bg-surface-container-low border-2 border-outline rounded-lg p-gutter-md flex flex-col gap-gutter-sm">
                  <span className="font-label text-label-sm text-on-surface-variant">
                    Detail bahan (jika Saya sediakan):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-sm">
                    <button
                      type="button"
                      onClick={() => setIngredientDetailMode('foto')}
                      className={`inline-flex items-center justify-center gap-gutter-xs px-gutter-md py-2.5 rounded-lg border-2 border-outline font-label text-label-md transition-colors duration-state-change cursor-pointer ${
                        ingredientDetailMode === 'foto'
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container-lowest text-on-surface hover:bg-primary-container'
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-title-md"
                        aria-hidden="true"
                      >
                        photo_camera
                      </span>
                      <span>Foto bahan</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIngredientDetailMode('tulis')}
                      className={`inline-flex items-center justify-center gap-gutter-xs px-gutter-md py-2.5 rounded-lg border-2 border-outline font-label text-label-md transition-colors duration-state-change cursor-pointer ${
                        ingredientDetailMode === 'tulis'
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container-lowest text-on-surface hover:bg-primary-container'
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-title-md"
                        aria-hidden="true"
                      >
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
              )}
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
                Pajak Unggah Request Rp 500
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
              {requestType === 'pilih-chef' && selectedChef
                ? `Request dikirim langsung ke Chef ${selectedChef.name}.`
                : 'Request tampil ke koki Seni Kuliner di kampusmu.'}
            </p>
          </div>
        </form>
      </main>
    </div>
  );
};
