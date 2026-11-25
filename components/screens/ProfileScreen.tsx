'use client';

import React, { useState } from 'react';
import {
  ChatThread,
  ReviewItem,
  UserProfile,
  UserRole,
} from '../../types';
import { DefaultAvatar } from '../DefaultAvatar';

interface ProfileScreenProps {
  user: UserProfile;
  reviews: ReviewItem[];
  incomingChatThreads: ChatThread[];
  onChangeRole: (role: UserRole) => void;
  onUpdateRoom: (newRoom: string) => void;
  onOpenChatThread: (threadId: string) => void;
  onLogout: () => void;
}

const formatRupiah = (amount: number) =>
  `Rp ${amount.toLocaleString('id-ID')}`;

/**
 * Screen 5: Profil Saya (User & Chef Profile)
 *
 * BACKEND INTEGRATION NOTE:
 * - Fetch user profile via `GET /api/profile/me` (requires auth cookie/token).
 * - Owner-only "Permintaan via chat" should be authorized on the server so only the
 *   profile owner sees incoming direct chat requests (`GET /api/chats?ownerOnly=true`).
 * - Updating dorm room calls `PATCH /api/profile` with `{ roomNumber }`.
 */
export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  reviews,
  incomingChatThreads,
  onChangeRole,
  onUpdateRoom,
  onOpenChatThread,
  onLogout,
}) => {
  const [isEditingRoom, setIsEditingRoom] = useState(false);
  const [roomDraft, setRoomDraft] = useState(user.roomNumber);

  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomDraft.trim()) {
      onUpdateRoom(roomDraft.trim());
    }
    setIsEditingRoom(false);
  };

  return (
    <main className="flex-1 max-w-6xl w-full mx-auto px-gutter-md sm:px-gutter-lg lg:px-gutter-xl py-gutter-lg flex flex-col gap-gutter-lg">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-gutter-md">
        <h1 className="font-headline text-headline-lg-mobile sm:text-headline-lg text-on-surface">
          Profil saya
        </h1>
        {user.verifiedCampus && (
          <span className="shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container border-2 border-outline font-label text-label-sm">
            <span className="material-symbols-outlined text-body-md" aria-hidden="true">
              verified_user
            </span>
            <span>Terverifikasi PIB</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
        {/* Left Column: Identity + Stats + Account Actions */}
        <div className="lg:col-span-5 flex flex-col gap-gutter-md">
          {/* Identity Card */}
          <article className="bg-surface-container-lowest text-on-surface border-2 border-outline rounded-lg p-gutter-md sm:p-gutter-lg flex flex-col gap-gutter-md">
            <div className="flex items-center gap-gutter-md">
              {/* Default white & grey profile picture */}
              <DefaultAvatar
                src={user.avatarUrl}
                alt={`Foto profil ${user.name}`}
                sizeClass="w-16 h-16"
              />
              <div className="min-w-0 flex flex-col gap-0.5">
                <h2 className="font-title text-title-lg text-on-surface">
                  {user.name}
                </h2>
                <p className="font-body text-body-sm text-on-surface-variant tabular-nums">
                  NIM {user.nim} · {user.major}
                </p>
                <p className="font-body text-body-sm text-on-surface-variant">
                  {user.dormName} · {user.roomNumber}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-gutter-xs pt-gutter-xs border-t border-outline-variant">
              <span className="font-label text-label-sm text-on-surface-variant">
                Mode aktif
              </span>
              <div className="grid grid-cols-2 gap-gutter-sm">
                <button
                  type="button"
                  aria-pressed={user.activeRole === 'pemesan'}
                  onClick={() => onChangeRole('pemesan')}
                  className={`py-2 px-3 rounded-full border-2 border-outline font-label text-label-md transition-colors duration-state-change cursor-pointer ${
                    user.activeRole === 'pemesan'
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  Pemesan
                </button>
                <button
                  type="button"
                  aria-pressed={user.activeRole === 'koki'}
                  onClick={() => onChangeRole('koki')}
                  className={`py-2 px-3 rounded-full border-2 border-outline font-label text-label-md transition-colors duration-state-change cursor-pointer ${
                    user.activeRole === 'koki'
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  Koki
                </button>
              </div>
            </div>
          </article>

          {/* Metrics: Poin, Rating, Flag */}
          <div className="grid grid-cols-3 gap-gutter-sm">
            <article className="bg-surface-container-lowest border-2 border-outline rounded-lg p-3 flex flex-col gap-1">
              <span className="font-label text-label-sm text-on-surface-variant">
                Poin
              </span>
              <span className="font-headline text-headline-sm text-on-surface tabular-nums">
                {user.points}
              </span>
            </article>
            <article className="bg-surface-container-lowest border-2 border-outline rounded-lg p-3 flex flex-col gap-1">
              <span className="font-label text-label-sm text-on-surface-variant">
                Rating
              </span>
              <span className="font-headline text-headline-sm text-secondary tabular-nums">
                {user.rating.toFixed(1)} ★
              </span>
            </article>
            <article className="bg-surface-container-lowest border-2 border-outline rounded-lg p-3 flex flex-col gap-1">
              <span className="font-label text-label-sm text-on-surface-variant">
                Flag
              </span>
              <span className="font-headline text-headline-sm text-secondary tabular-nums">
                {user.flagCount}
              </span>
            </article>
          </div>

          {/* Account Actions */}
          <article className="bg-surface-container-lowest border-2 border-outline rounded-lg p-gutter-md flex flex-col gap-gutter-sm">
            {!isEditingRoom ? (
              <button
                type="button"
                onClick={() => {
                  setRoomDraft(user.roomNumber);
                  setIsEditingRoom(true);
                }}
                className="w-full flex items-center justify-between py-2 px-2 rounded hover:bg-surface-container-low transition-colors duration-state-change cursor-pointer"
              >
                <span className="font-label text-label-md text-on-surface">
                  Ubah nomor kamar asrama
                </span>
                <span
                  className="material-symbols-outlined text-title-md text-on-surface-variant"
                  aria-hidden="true"
                >
                  chevron_right
                </span>
              </button>
            ) : (
              <form
                onSubmit={handleSaveRoom}
                className="flex flex-col gap-gutter-xs p-2 bg-surface-container-low rounded border border-outline-variant"
              >
                <label className="font-label text-label-sm text-on-surface">
                  Nomor kamar baru
                </label>
                <div className="flex items-center gap-gutter-xs">
                  <input
                    type="text"
                    value={roomDraft}
                    onChange={(e) => setRoomDraft(e.target.value)}
                    placeholder="Contoh: Kamar B204"
                    className="flex-1 min-w-0 px-3 py-1.5 rounded bg-surface-container-lowest border-2 border-outline font-body text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded bg-secondary text-on-secondary border-2 border-outline font-label text-label-sm cursor-pointer"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingRoom(false)}
                    className="px-2.5 py-1.5 rounded bg-surface-container-lowest text-on-surface border-2 border-outline font-label text-label-sm cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </form>
            )}

            <div className="border-t border-outline-variant" />

            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center justify-between py-2 px-2 rounded hover:bg-error-container transition-colors duration-state-change cursor-pointer"
            >
              <span className="font-label text-label-md text-error">
                Keluar dari akun
              </span>
              <span
                className="material-symbols-outlined text-title-md text-error"
                aria-hidden="true"
              >
                logout
              </span>
            </button>
          </article>
        </div>

        {/* Right Column: Owner-only Chat Requests + Public Reviews & Flag Transparency */}
        <div className="lg:col-span-7 flex flex-col gap-gutter-md">
          {/* Owner-only: Incoming Chat Requests */}
          <section
            aria-label="Permintaan masuk via chat"
            className="bg-surface-container-low border-2 border-outline rounded-lg p-gutter-md flex flex-col gap-gutter-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-gutter-sm">
              <div className="flex items-center gap-gutter-xs">
                <span
                  className="material-symbols-outlined text-title-md text-on-surface"
                  aria-hidden="true"
                >
                  chat_bubble
                </span>
                <h2 className="font-headline text-headline-sm text-on-surface">
                  Permintaan via chat
                </h2>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-container text-on-primary-container border-2 border-outline font-label text-label-sm">
                <span className="material-symbols-outlined text-body-md" aria-hidden="true">
                  lock
                </span>
                <span>Khusus pemilik profil</span>
              </span>
            </div>

            <div className="flex flex-col gap-gutter-sm">
              {incomingChatThreads.slice(0, 2).map((thread, index) => {
                const firstMsg = thread.messages[0]?.text ?? thread.lastMessagePreview;
                const wage = thread.requestCard?.chefWage ?? 12000;
                const isPrimaryReply = index === 0;

                return (
                  <article
                    key={thread.id}
                    className="bg-surface-container-lowest text-on-surface border-2 border-outline rounded-lg p-gutter-md flex flex-col gap-gutter-xs"
                  >
                    <div className="flex items-center justify-between gap-gutter-sm">
                      <span className="font-title text-title-md text-on-surface">
                        {thread.peerName} · {thread.peerSubtitle}
                      </span>
                      <span
                        className={`font-body text-body-sm tabular-nums ${
                          index === 0 ? 'text-secondary' : 'text-on-surface-variant'
                        }`}
                      >
                        {index === 0 ? 'Baru saja' : '15m lalu'}
                      </span>
                    </div>
                    <p className="font-body text-body-md text-on-surface text-pretty">
                      {firstMsg}
                    </p>
                    <div className="flex items-center justify-between gap-gutter-sm pt-1">
                      <span className="font-body text-body-sm text-on-surface-variant tabular-nums">
                        Upah koki: {formatRupiah(wage)}
                      </span>
                      <button
                        type="button"
                        onClick={() => onOpenChatThread(thread.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-outline font-label text-label-sm cursor-pointer ${
                          isPrimaryReply
                            ? 'bg-secondary text-on-secondary hover:opacity-95'
                            : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
                        }`}
                      >
                        <span
                          className="material-symbols-outlined text-body-md"
                          aria-hidden="true"
                        >
                          {isPrimaryReply ? 'reply' : 'chat'}
                        </span>
                        <span>
                          {isPrimaryReply ? 'Balas di chat' : 'Buka chat'}
                        </span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <div className="flex items-center justify-between gap-gutter-md">
            <h2 className="font-headline text-headline-sm text-on-surface">
              Ulasan publik
            </h2>
            <span className="font-body text-body-sm text-on-surface-variant tabular-nums">
              {user.completedOrders} pesanan selesai
            </span>
          </div>

          <div className="flex flex-col gap-gutter-sm">
            {reviews.map((rev) => (
              <article
                key={rev.id}
                className="bg-surface-container-lowest text-on-surface border-2 border-outline rounded-lg p-gutter-md flex flex-col gap-gutter-xs"
              >
                <div className="flex items-center justify-between gap-gutter-sm">
                  <span className="font-title text-title-md text-on-surface">
                    {rev.reviewerName} · {rev.roomNumber}
                  </span>
                  <span className="font-label text-label-md text-secondary tabular-nums">
                    {rev.rating.toFixed(1)} ★
                  </span>
                </div>
                <p className="font-body text-body-md text-on-surface">
                  {rev.comment}
                </p>
                <span className="font-body text-body-sm text-on-surface-variant">
                  Menu: {rev.menuName} · {rev.dateLabel}
                </span>
              </article>
            ))}
          </div>

          {/* Flag Transparency Card */}
          <article className="bg-surface-container-low border-2 border-outline rounded-lg p-gutter-md flex items-start gap-gutter-sm">
            <span
              className="material-symbols-outlined text-title-lg text-secondary shrink-0"
              aria-hidden="true"
            >
              shield
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="font-title text-title-md text-on-surface">
                Catatan kejujuran ({user.flagCount} Flag)
              </h3>
              <p className="font-body text-body-sm text-on-surface-variant">
                Jumlah flag selalu tampil terbuka untuk menjaga kenyamanan pemesan dan koki di kampus.
              </p>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
};
