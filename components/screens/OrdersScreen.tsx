'use client';

import React, { useState } from 'react';
import {
  OrderItem,
  OrderStatusStep,
  PaymentMethod,
  UserRole,
} from '../../types';
import { DefaultAvatar } from '../DefaultAvatar';

interface OrdersScreenProps {
  orders: OrderItem[];
  selectedOrderId: string;
  activeRole: UserRole;
  onSelectOrder: (orderId: string) => void;
  onSelectPayment: (orderId: string, method: PaymentMethod) => void;
  onAdvanceStep: (orderId: string, nextStep: OrderStatusStep) => void;
  onConfirmReceived: (orderId: string, rating: number) => void;
  onUploadReceipt: (orderId: string, amount: number) => void;
  onChatWithChef: (chefId: string, chefName: string) => void;
}

const STEPS: { step: OrderStatusStep; label: string }[] = [
  { step: 1, label: 'Request terkirim' },
  { step: 2, label: 'Koki menerima' },
  { step: 3, label: 'Sedang dimasak' },
  { step: 4, label: 'Diantar ke kamarmu' },
];

const PAYMENT_METHODS: PaymentMethod[] = ['Tunai', 'QRIS', 'E-wallet'];

const formatRupiah = (amount: number) =>
  `Rp ${amount.toLocaleString('id-ID')}`;

/**
 * Screen 4: Pesanan & Status (Order Tracker & Escrow Payment)
 *
 * BACKEND INTEGRATION NOTE:
 * - Subscribe to real-time order updates via WebSocket / SSE / polling `GET /api/orders/:id`.
 * - Receipt photo upload uses `POST /api/orders/:id/receipt` (multipart/form-data).
 * - Clicking "Pesanan sudah diterima" calls `PATCH /api/orders/:id/confirm` to release escrow.
 */
export const OrdersScreen: React.FC<OrdersScreenProps> = ({
  orders,
  selectedOrderId,
  activeRole,
  onSelectOrder,
  onSelectPayment,
  onAdvanceStep,
  onConfirmReceived,
  onUploadReceipt,
  onChatWithChef,
}) => {
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptDraftAmount, setReceiptDraftAmount] = useState('18500');
  const [ratingDraft, setRatingDraft] = useState(5);

  const activeOrder =
    orders.find((o) => o.id === selectedOrderId) ?? orders[0];

  if (!activeOrder) {
    return (
      <main className="flex-1 max-w-6xl w-full mx-auto px-gutter-md sm:px-gutter-lg lg:px-gutter-xl py-gutter-lg">
        <div className="bg-surface-container-lowest border-2 border-outline rounded-lg p-gutter-lg text-center flex flex-col gap-gutter-sm">
          <h1 className="font-headline text-headline-md text-on-surface">
            Belum ada pesanan aktif
          </h1>
          <p className="font-body text-body-md text-on-surface-variant">
            Buat request masakan dari halaman Beranda untuk mulai melacak pesananmu.
          </p>
        </div>
      </main>
    );
  }

  const totalAmount =
    (activeOrder.receiptUploaded ? activeOrder.receiptAmount : 0) +
    activeOrder.chefWage +
    activeOrder.serviceFee;

  return (
    <main className="flex-1 max-w-6xl w-full mx-auto px-gutter-md sm:px-gutter-lg lg:px-gutter-xl py-gutter-lg flex flex-col gap-gutter-lg">
      {/* Order Switcher (visible when user has multiple orders) */}
      {orders.length > 1 && (
        <div className="flex items-center gap-gutter-sm overflow-x-auto pb-1">
          {orders.map((ord) => {
            const isSelected = ord.id === activeOrder.id;
            return (
              <button
                key={ord.id}
                type="button"
                onClick={() => onSelectOrder(ord.id)}
                className={`shrink-0 px-gutter-md py-1.5 rounded-full border-2 border-outline font-label text-label-sm tabular-nums cursor-pointer transition-colors duration-state-change ${
                  isSelected
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
                }`}
              >
                {ord.orderCode} · {ord.description.slice(0, 22)}
                {ord.description.length > 22 ? '…' : ''}
              </button>
            );
          })}
        </div>
      )}

      {/* Order Title */}
      <div className="flex flex-wrap items-center justify-between gap-gutter-sm">
        <div className="flex flex-col gap-1">
          <h1 className="font-headline text-headline-lg-mobile sm:text-headline-lg text-on-surface tabular-nums">
            Pesanan {activeOrder.orderCode}
          </h1>
          <p className="font-body text-body-md text-on-surface-variant tabular-nums">
            {activeOrder.isDeliveredConfirmed
              ? 'Pesanan selesai · Dana cair ke koki'
              : `Perkiraan sampai ${activeOrder.estimatedArrival}`}
          </p>
        </div>

        {/* Chef quick-advance helper when viewing in Koki mode */}
        {activeRole === 'koki' && !activeOrder.isDeliveredConfirmed && activeOrder.step < 4 && (
          <button
            type="button"
            onClick={() =>
              onAdvanceStep(
                activeOrder.id,
                (activeOrder.step + 1) as OrderStatusStep
              )
            }
            className="inline-flex items-center gap-1.5 px-gutter-md py-2 rounded-full bg-primary text-on-primary border-2 border-outline font-label text-label-sm hover:bg-primary-container cursor-pointer"
          >
            <span className="material-symbols-outlined text-title-md" aria-hidden="true">
              fast_forward
            </span>
            <span>Update status ke tahap {activeOrder.step + 1}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
        {/* Left Column: 4-Step Tracker + Chef Card */}
        <div className="lg:col-span-6 flex flex-col gap-gutter-md">
          {/* 4-Step Tracker Card */}
          <article className="bg-surface-container-lowest text-on-surface border-2 border-outline rounded-lg p-gutter-md sm:p-gutter-lg">
            <ol className="flex flex-col gap-gutter-md">
              {STEPS.map(({ step, label }) => {
                const isCompleted =
                  activeOrder.isDeliveredConfirmed || step < activeOrder.step;
                const isCurrent =
                  !activeOrder.isDeliveredConfirmed && step === activeOrder.step;

                return (
                  <li key={step} className="flex items-center gap-gutter-md">
                    <span
                      className={`w-8 h-8 rounded-full border-2 border-outline flex items-center justify-center font-label text-label-md tabular-nums shrink-0 ${
                        isCompleted
                          ? 'bg-secondary text-on-secondary'
                          : isCurrent
                            ? 'bg-primary text-on-primary'
                            : 'bg-surface-container-lowest text-on-surface-variant'
                      }`}
                    >
                      {step}
                    </span>
                    <span
                      className={
                        isCompleted || isCurrent
                          ? 'font-title text-title-md text-on-surface'
                          : 'font-body text-body-lg text-on-surface-variant'
                      }
                    >
                      {label}
                    </span>
                  </li>
                );
              })}
            </ol>
          </article>

          {/* Chef Card */}
          <article className="bg-surface-container-lowest text-on-surface border-2 border-outline rounded-lg p-gutter-md flex items-center justify-between gap-gutter-md">
            <div className="flex items-center gap-gutter-md min-w-0">
              <DefaultAvatar
                src={activeOrder.chef.avatarUrl}
                alt={`Foto ${activeOrder.chef.name}`}
                sizeClass="w-12 h-12"
              />
              <header className="min-w-0">
                <h2 className="font-title text-title-md text-on-surface truncate">
                  {activeOrder.chef.name}
                </h2>
                <p className="font-body text-body-sm text-on-surface-variant">
                  {activeOrder.chef.major} · {activeOrder.chef.rating.toFixed(1)} ★
                </p>
              </header>
            </div>
            <footer>
              <button
                type="button"
                onClick={() =>
                  onChatWithChef(activeOrder.chef.id, activeOrder.chef.name)
                }
                className="inline-flex items-center gap-gutter-xs px-gutter-md py-2 rounded-full bg-surface-container-lowest text-on-surface border-2 border-outline font-label text-label-md hover:bg-surface-container-low transition-colors duration-state-change cursor-pointer"
              >
                Chat
              </button>
            </footer>
          </article>
        </div>

        {/* Right Column: Ringkasan, Nota Bahan & Payment */}
        <div className="lg:col-span-6 flex flex-col gap-gutter-md">
          {/* Ringkasan Card */}
          <article className="bg-surface-container-lowest text-on-surface border-2 border-outline rounded-lg p-gutter-md sm:p-gutter-lg flex flex-col gap-gutter-sm">
            <h2 className="font-title text-title-lg text-on-surface">
              Ringkasan
            </h2>
            <div className="flex flex-col gap-1.5 font-body text-body-md text-on-surface">
              <p>{activeOrder.description}</p>
              <p className="text-on-surface-variant">
                Antar ke {activeOrder.deliveryAddress}
              </p>
              <p className="text-on-surface-variant">
                Bahan: {activeOrder.ingredientMode}
              </p>
              {activeOrder.ingredientNotes && (
                <p className="text-on-surface-variant text-body-sm">
                  Daftar bahan: {activeOrder.ingredientNotes}
                </p>
              )}
            </div>

            <div className="border-t-2 border-outline-variant pt-gutter-sm mt-1 flex flex-col gap-1.5">
              {activeOrder.ingredientMode === 'Koki yang belanja' && (
                <div className="flex items-center justify-between gap-gutter-sm">
                  <div className="flex items-center gap-gutter-xs flex-wrap">
                    <span className="font-body text-body-md text-on-surface">
                      Nota bahan
                    </span>
                    {activeOrder.receiptUploaded ? (
                      <button
                        type="button"
                        onClick={() => setShowReceiptModal(true)}
                        className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label text-label-sm border border-outline hover:opacity-90 cursor-pointer"
                      >
                        Foto diunggah
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowReceiptModal(true)}
                        className="px-2 py-0.5 rounded-full bg-warning-container text-on-warning-container font-label text-label-sm border border-outline cursor-pointer"
                      >
                        Menunggu nota
                      </button>
                    )}
                  </div>
                  <span className="font-body text-body-md text-on-surface tabular-nums">
                    {activeOrder.receiptUploaded
                      ? formatRupiah(activeOrder.receiptAmount)
                      : 'Rp 0'}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="font-body text-body-md text-on-surface">
                  Upah koki
                </span>
                <span className="font-body text-body-md text-on-surface tabular-nums">
                  {formatRupiah(activeOrder.chefWage)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-body text-body-md text-on-surface">
                  {activeOrder.serviceFee === 500
                    ? 'Pajak unggah request'
                    : 'Biaya layanan'}
                </span>
                <span className="font-body text-body-md text-on-surface tabular-nums">
                  {formatRupiah(activeOrder.serviceFee)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1.5 border-t border-outline-variant">
                <span className="font-title text-title-md text-on-surface">
                  Total
                </span>
                <span className="font-title text-title-md text-on-surface tabular-nums">
                  {formatRupiah(totalAmount)}
                </span>
              </div>
            </div>
          </article>

          {/* Bayar dengan */}
          <div className="flex flex-col gap-gutter-xs">
            <span className="font-label text-label-md text-on-surface">
              Bayar dengan
            </span>
            <div className="flex flex-wrap gap-gutter-sm">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = activeOrder.paymentMethod === method;
                return (
                  <button
                    key={method}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => onSelectPayment(activeOrder.id, method)}
                    className={`inline-flex items-center px-gutter-md py-2 rounded-full border-2 border-outline font-label text-label-md transition-colors duration-state-change cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    {method}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary CTA or Completed Summary */}
          {!activeOrder.isDeliveredConfirmed ? (
            <button
              type="button"
              onClick={() => onConfirmReceived(activeOrder.id, ratingDraft)}
              className="w-full inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-3.5 rounded-lg bg-secondary text-on-secondary border-2 border-outline font-headline text-label-lg transition-transform duration-state-change ease-state-change hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-outline cursor-pointer"
            >
              <span>Pesanan sudah diterima</span>
            </button>
          ) : (
            <article className="bg-secondary-container text-on-secondary-container border-2 border-outline rounded-lg p-gutter-md flex flex-col gap-gutter-sm">
              <div className="flex items-center gap-gutter-xs font-title text-title-md">
                <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
                  check_circle
                </span>
                <span>Pesanan diterima! Dana escrow diteruskan ke koki.</span>
              </div>
              <div className="flex items-center gap-gutter-xs">
                <span className="font-body text-body-sm">Rating untuk koki:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingDraft(star)}
                    className="font-label text-title-md cursor-pointer"
                    aria-label={`Beri ${star} bintang`}
                  >
                    {star <= ratingDraft ? '★' : '☆'}
                  </button>
                ))}
              </div>
            </article>
          )}
        </div>
      </div>

      {/* Receipt Preview / Upload Modal */}
      {showReceiptModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-gutter-md"
          role="dialog"
          aria-modal="true"
          aria-label="Detail nota bahan"
        >
          <div className="bg-surface-container-lowest border-2 border-outline rounded-lg max-w-md w-full p-gutter-lg flex flex-col gap-gutter-md">
            <div className="flex items-center justify-between">
              <h3 className="font-headline text-headline-sm text-on-surface">
                Nota belanja bahan
              </h3>
              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
                aria-label="Tutup modal nota"
                className="w-9 h-9 rounded-full border-2 border-outline flex items-center justify-center hover:bg-surface-container-low cursor-pointer"
              >
                <span className="material-symbols-outlined text-title-md" aria-hidden="true">
                  close
                </span>
              </button>
            </div>

            {activeOrder.receiptUploaded ? (
              <div className="bg-surface-container-low border-2 border-outline rounded-lg p-gutter-md flex flex-col gap-gutter-xs">
                <div className="flex items-center justify-between font-label text-label-sm text-on-surface-variant">
                  <span>Warung / Minimarket Kampus</span>
                  <span className="tabular-nums">Nota terverifikasi</span>
                </div>
                <div className="border-t border-outline-variant my-1" />
                <div className="flex justify-between font-body text-body-sm">
                  <span>Bahan utama &amp; bumbu segar</span>
                  <span className="tabular-nums">
                    {formatRupiah(activeOrder.receiptAmount)}
                  </span>
                </div>
                <div className="border-t border-outline-variant my-1" />
                <div className="flex justify-between font-title text-title-md">
                  <span>Total nota bahan</span>
                  <span className="tabular-nums">
                    {formatRupiah(activeOrder.receiptAmount)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-gutter-sm">
                <p className="font-body text-body-sm text-on-surface-variant">
                  Masukkan nominal nota belanja bahan untuk pesanan ini:
                </p>
                <input
                  type="number"
                  value={receiptDraftAmount}
                  onChange={(e) => setReceiptDraftAmount(e.target.value)}
                  className="w-full px-gutter-md py-2.5 rounded border-2 border-outline bg-surface-container-lowest font-body text-body-md tabular-nums"
                />
                <button
                  type="button"
                  onClick={() => {
                    onUploadReceipt(
                      activeOrder.id,
                      Number(receiptDraftAmount) || 18500
                    );
                    setShowReceiptModal(false);
                  }}
                  className="w-full py-2.5 rounded-lg bg-secondary text-on-secondary border-2 border-outline font-label text-label-md cursor-pointer"
                >
                  Simpan &amp; unggah nota
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};
