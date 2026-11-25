'use client';

import React, { useState } from 'react';
import { ChatThread } from '../../types';

interface ChatScreenProps {
  threads: ChatThread[];
  activeThreadId: string;
  onSelectThread: (threadId: string) => void;
  onSendMessage: (
    threadId: string,
    text: string,
    attachmentType?: 'receipt' | 'photo',
    attachmentLabel?: string
  ) => void;
  onAcceptChatRequest: (threadId: string) => void;
  onBack: () => void;
}

const formatRupiah = (amount: number) =>
  `Rp ${amount.toLocaleString('id-ID')}`;

/**
 * Screen 6: Chat & Request Masuk
 *
 * BACKEND INTEGRATION NOTE:
 * - Load threads via `GET /api/chats` and thread messages via `GET /api/chats/:id/messages`.
 * - Send messages via `POST /api/chats/:id/messages`, and subscribe to real-time updates
 *   (Socket.io / Pusher / Supabase Realtime / Next.js SSE).
 * - Inline "Terima request" button triggers `POST /api/chats/:id/accept-request`.
 */
export const ChatScreen: React.FC<ChatScreenProps> = ({
  threads,
  activeThreadId,
  onSelectThread,
  onSendMessage,
  onAcceptChatRequest,
  onBack,
}) => {
  const [messageInput, setMessageInput] = useState('');

  const activeThread =
    threads.find((t) => t.id === activeThreadId) ?? threads[0];

  const totalUnread = threads.reduce((acc, t) => acc + t.unreadCount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeThread || !messageInput.trim()) return;
    onSendMessage(activeThread.id, messageInput.trim());
    setMessageInput('');
  };

  const handleSendReceiptShortcut = () => {
    if (!activeThread) return;
    onSendMessage(
      activeThread.id,
      'Ini nota belanja bahannya ya, total Rp 18.500.',
      'receipt',
      'Nota_Belanja.jpg'
    );
  };

  const handleSendPhotoShortcut = () => {
    if (!activeThread) return;
    onSendMessage(
      activeThread.id,
      'Masakannya sudah jadi dan siap diantar!',
      'photo',
      'Foto_Masakan.jpg'
    );
  };

  if (!activeThread) return null;

  return (
    <main className="flex-1 max-w-6xl w-full mx-auto px-gutter-md sm:px-gutter-lg lg:px-gutter-xl py-gutter-md lg:py-gutter-lg flex flex-col gap-gutter-md lg:gap-gutter-lg">
      {/* Contextual Back & Title */}
      <div className="flex items-center justify-between gap-gutter-sm">
        <div className="flex items-center gap-gutter-sm">
          <button
            type="button"
            onClick={onBack}
            aria-label="Kembali"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-lowest text-on-surface border-2 border-outline hover:bg-surface-container-low cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
              arrow_back
            </span>
          </button>
          <div className="flex flex-col">
            <h1 className="font-headline text-headline-lg-mobile md:text-headline-lg text-on-surface">
              <span className="md:hidden">Chat</span>
              <span className="hidden md:inline lg:hidden">Chat</span>
              <span className="hidden lg:inline">Chat &amp; request masuk</span>
            </h1>
            <span className="font-body text-body-sm lg:text-body-md text-on-surface-variant">
              <span className="lg:hidden">Koordinasi bahan &amp; request langsung</span>
              <span className="hidden lg:inline">
                Koordinasi bahan, nota belanja, dan request langsung antar penghuni asrama
              </span>
            </span>
          </div>
        </div>

        <span className="px-2.5 sm:px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container border-2 border-outline font-label text-label-sm tabular-nums shrink-0">
          {totalUnread > 0 ? `${totalUnread} pesan baru` : 'Semua terbaca'}
        </span>
      </div>

      {/* Phone Thread Switcher Chips */}
      <div className="flex md:hidden items-center gap-gutter-sm overflow-x-auto pb-1">
        {threads.map((thread) => {
          const isSelected = thread.id === activeThread.id;
          return (
            <button
              key={thread.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelectThread(thread.id)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-outline font-label text-label-md cursor-pointer ${
                isSelected
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <span>
                {thread.peerName} · {thread.peerSubtitle.replace('Kamar ', '')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Two-Column Split on Tablet (md) and Desktop (lg) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter-md lg:gap-gutter-lg items-start">
        {/* Left Sidebar: Thread List */}
        <aside
          aria-label="Daftar percakapan"
          className="hidden md:flex md:col-span-5 lg:col-span-4 bg-surface-container-lowest border-2 border-outline rounded-lg p-gutter-sm flex-col gap-gutter-xs lg:gap-gutter-sm"
        >
          {threads.map((thread) => {
            const isSelected = thread.id === activeThread.id;
            return (
              <button
                key={thread.id}
                type="button"
                onClick={() => onSelectThread(thread.id)}
                className={`w-full text-left p-3 lg:p-gutter-md rounded-lg border-2 flex flex-col gap-1 transition-colors duration-state-change cursor-pointer ${
                  isSelected
                    ? 'bg-primary-container border-outline text-on-primary-container'
                    : 'bg-surface-container-lowest hover:bg-surface-container-low border-outline-variant text-on-surface'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-title text-title-md">
                    {thread.peerName} · {thread.peerSubtitle}
                  </span>
                  <span
                    className={`font-body text-body-sm tabular-nums ${
                      isSelected ? 'text-on-primary-container' : 'text-on-surface-variant'
                    }`}
                  >
                    {thread.lastMessageTime}
                  </span>
                </div>
                <p
                  className={`font-body text-body-sm line-clamp-1 ${
                    isSelected ? 'text-on-primary-container' : 'text-on-surface-variant'
                  }`}
                >
                  {thread.lastMessagePreview}
                </p>
                <span
                  className={`self-start px-2.5 py-0.5 rounded-full border border-outline font-label text-label-sm ${
                    thread.badgeLabel === 'Request masuk'
                      ? 'bg-primary text-on-primary'
                      : thread.badgeLabel === 'Selesai'
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'bg-surface-container-low text-on-surface'
                  }`}
                >
                  {thread.badgeLabel}
                </span>
              </button>
            );
          })}
        </aside>

        {/* Right Panel: Active Thread */}
        <section
          aria-label={`Percakapan dengan ${activeThread.peerName}`}
          className="md:col-span-7 lg:col-span-8 bg-surface-container-lowest border-2 border-outline rounded-lg flex flex-col overflow-hidden"
        >
          {/* Active Peer Header */}
          <div className="bg-surface-container-low border-b-2 border-outline p-gutter-md flex flex-wrap items-center justify-between gap-gutter-sm">
            <div className="flex items-center gap-gutter-sm min-w-0">
              <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-primary-container text-on-primary-container border-2 border-outline flex items-center justify-center shrink-0">
                <span className="font-title text-title-md">
                  {activeThread.initials}
                </span>
              </div>
              <div className="min-w-0 flex flex-col">
                <span className="font-title text-title-md lg:text-title-lg text-on-surface truncate">
                  {activeThread.peerName} · {activeThread.peerSubtitle}
                </span>
                <span className="inline-flex items-center gap-1.5 font-body text-body-sm text-on-surface-variant">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      activeThread.isOnline ? 'bg-secondary' : 'bg-outline-variant'
                    }`}
                    aria-hidden="true"
                  />
                  <span>
                    {activeThread.isOnline ? 'Aktif sekarang' : 'Offline'} ·{' '}
                    {activeThread.peerRoleLabel}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-gutter-sm shrink-0">
              {activeThread.targetTime && (
                <span className="px-2.5 lg:px-3 py-1 rounded-full bg-surface-container-lowest border-2 border-outline font-label text-label-sm tabular-nums">
                  <span className="hidden lg:inline">Target: </span>
                  {activeThread.targetTime}
                </span>
              )}
              {activeThread.requestCard &&
                activeThread.requestCard.status === 'Menunggu konfirmasi' && (
                  <button
                    type="button"
                    onClick={() => onAcceptChatRequest(activeThread.id)}
                    className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary text-on-secondary border-2 border-outline font-label text-label-md hover:opacity-95 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-title-md" aria-hidden="true">
                      check_circle
                    </span>
                    <span>Terima request</span>
                  </button>
                )}
            </div>
          </div>

          {/* Messages */}
          <div className="p-gutter-md lg:p-gutter-lg flex flex-col gap-gutter-md bg-surface min-h-[340px]">
            {/* Inline Request Card */}
            {activeThread.requestCard && (
              <article className="bg-surface-container-lowest border-2 border-outline rounded-lg p-3 lg:p-gutter-md flex flex-col lg:flex-row lg:items-center justify-between gap-gutter-xs lg:gap-gutter-md">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-gutter-sm">
                    <span className="font-label text-label-sm text-on-surface-variant">
                      Request langsung ke {activeThread.requestCard.targetChefName}
                    </span>
                    <span
                      className={`lg:hidden px-2 py-0.5 rounded-full border border-outline font-label text-label-sm ${
                        activeThread.requestCard.status === 'Diterima'
                          ? 'bg-secondary-container text-on-secondary-container'
                          : 'bg-primary-container text-on-primary-container'
                      }`}
                    >
                      {activeThread.requestCard.status === 'Menunggu konfirmasi'
                        ? 'Menunggu'
                        : activeThread.requestCard.status}
                    </span>
                  </div>
                  <p className="font-title text-title-md lg:text-title-lg text-on-surface">
                    {activeThread.requestCard.title}
                  </p>
                  <p className="font-body text-body-sm text-on-surface-variant tabular-nums">
                    {activeThread.requestCard.ingredientNote} · Upah koki{' '}
                    {formatRupiah(activeThread.requestCard.chefWage)}
                  </p>
                </div>

                <span
                  className={`hidden lg:inline-flex shrink-0 px-3 py-1 rounded-full border-2 border-outline font-label text-label-sm ${
                    activeThread.requestCard.status === 'Diterima'
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'bg-primary-container text-on-primary-container'
                  }`}
                >
                  {activeThread.requestCard.status}
                </span>
              </article>
            )}

            {/* Message Thread */}
            {activeThread.messages.map((msg) => {
              const isMe = msg.sender === 'me';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col gap-1 max-w-[85%] lg:max-w-[75%] ${
                    isMe ? 'items-end self-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`border-2 border-outline rounded-lg p-3 lg:p-gutter-md flex flex-col gap-1.5 ${
                      isMe
                        ? 'bg-primary-container text-on-primary-container'
                        : 'bg-surface-container-lowest text-on-surface'
                    }`}
                  >
                    {msg.attachmentLabel && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-low border border-outline font-label text-label-sm text-on-surface w-fit">
                        <span
                          className="material-symbols-outlined text-body-md text-secondary"
                          aria-hidden="true"
                        >
                          {msg.attachmentType === 'receipt'
                            ? 'receipt'
                            : 'photo_camera'}
                        </span>
                        <span>{msg.attachmentLabel}</span>
                      </div>
                    )}
                    <p className="font-body text-body-md text-pretty">
                      {msg.text}
                    </p>
                  </div>
                  <span className="font-body text-body-sm text-on-surface-variant tabular-nums">
                    {msg.timestamp}
                    {isMe && msg.readReceipt ? ' · Dibaca' : ''}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick Actions & Composer */}
          <div className="bg-surface-container-low border-t-2 border-outline p-gutter-md flex flex-col gap-gutter-sm">
            <div className="flex flex-wrap items-center gap-gutter-xs lg:gap-gutter-sm">
              {activeThread.requestCard &&
                activeThread.requestCard.status === 'Menunggu konfirmasi' && (
                  <button
                    type="button"
                    onClick={() => onAcceptChatRequest(activeThread.id)}
                    className="lg:hidden inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary text-on-secondary border-2 border-outline font-label text-label-sm cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-body-md" aria-hidden="true">
                      check_circle
                    </span>
                    <span>Terima request</span>
                  </button>
                )}
              <button
                type="button"
                onClick={handleSendReceiptShortcut}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest text-on-surface border-2 border-outline font-label text-label-sm hover:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined text-body-md" aria-hidden="true">
                  receipt
                </span>
                <span>Kirim nota bahan</span>
              </button>
              <button
                type="button"
                onClick={handleSendPhotoShortcut}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest text-on-surface border-2 border-outline font-label text-label-sm hover:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined text-body-md" aria-hidden="true">
                  photo_camera
                </span>
                <span>Kirim foto masakan</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-gutter-sm">
              <label htmlFor="chat-input" className="sr-only">
                Tulis pesan
              </label>
              <input
                id="chat-input"
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={`Tulis pesan ke ${activeThread.peerName}...`}
                className="flex-1 min-w-0 rounded-full bg-surface-container-lowest border-2 border-outline px-gutter-md py-2 lg:py-2.5 text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-outline"
              />
              <button
                type="submit"
                aria-label="Kirim pesan"
                className="inline-flex items-center justify-center w-10 h-10 lg:w-auto lg:px-5 lg:py-2.5 lg:gap-gutter-xs rounded-full bg-primary text-on-primary border-2 border-outline font-label text-label-md shrink-0 cursor-pointer hover:bg-primary-container transition-colors duration-state-change"
              >
                <span className="hidden lg:inline">Kirim</span>
                <span className="material-symbols-outlined text-title-md" aria-hidden="true">
                  send
                </span>
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
};
