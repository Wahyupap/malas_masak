'use client';

import React, { createContext, useContext, useState } from 'react';
import {
  DUMMY_ACTIVE_CHEFS,
  DUMMY_CHAT_THREADS,
  DUMMY_CURRENT_USER,
  DUMMY_INITIAL_ORDERS,
  DUMMY_OPEN_REQUESTS,
  DUMMY_REVIEWS,
} from '../data/dummyData';
import {
  confirmOrderReceived,
  submitCookingRequest,
  updateOrderStep,
  updatePaymentMethod,
} from '../services/api';
import {
  ActiveChef,
  ChatThread,
  CreateRequestPayload,
  CuisineCategory,
  OpenRequest,
  OrderItem,
  OrderStatusStep,
  PaymentMethod,
  ReviewItem,
  UserProfile,
  UserRole,
} from '../types';

/**
 * Shared Client State Context — malas masak
 *
 * BACKEND INTEGRATION NOTE (Next.js App Router):
 * Right now this context holds in-memory dummy data so every route (`/`, `/masuk`,
 * `/buat-request`, `/pesanan`, `/profil`, `/chat`) stays synchronized in the browser.
 *
 * When integrating your backend:
 * 1. Fetch initial server data in Server Components (`app/page.tsx`, `app/pesanan/page.tsx`)
 *    or with SWR / TanStack Query calling your `/api/*` Route Handlers.
 * 2. Replace the local state mutations below with `fetch('/api/...')` or Next.js Server Actions,
 *    then call `router.refresh()` or mutate the SWR/Query cache.
 */

interface AppStateContextValue {
  user: UserProfile;
  activeChefs: ActiveChef[];
  openRequests: OpenRequest[];
  orders: OrderItem[];
  selectedOrderId: string;
  reviews: ReviewItem[];
  chatThreads: ChatThread[];
  activeThreadId: string;
  draftCategory: CuisineCategory;
  setDraftCategory: (cat: CuisineCategory) => void;
  setSelectedOrderId: (id: string) => void;
  setActiveThreadId: (id: string) => void;
  applyAuthSuccess: (params: {
    nim: string;
    dormName?: string;
    activeRole?: UserRole;
  }) => void;
  changeRole: (role: UserRole) => void;
  updateRoom: (newRoom: string) => void;
  createRequest: (payload: CreateRequestPayload) => Promise<OrderItem>;
  claimRequest: (req: OpenRequest) => OrderItem;
  selectPayment: (orderId: string, method: PaymentMethod) => Promise<void>;
  advanceOrderStep: (
    orderId: string,
    nextStep: OrderStatusStep
  ) => Promise<void>;
  confirmReceived: (orderId: string, rating: number) => Promise<void>;
  uploadReceipt: (orderId: string, amount: number) => void;
  openOrCreateChefChat: (chefId: string, chefName: string) => string;
  markThreadRead: (threadId: string) => void;
  sendMessage: (
    threadId: string,
    text: string,
    attachmentType?: 'receipt' | 'photo',
    attachmentLabel?: string
  ) => void;
  acceptChatRequest: (threadId: string) => OrderItem | null;
  showToast: (msg: string) => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile>(DUMMY_CURRENT_USER);
  const [openRequests, setOpenRequests] =
    useState<OpenRequest[]>(DUMMY_OPEN_REQUESTS);
  const [orders, setOrders] = useState<OrderItem[]>(DUMMY_INITIAL_ORDERS);
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    DUMMY_INITIAL_ORDERS[0].id
  );
  const [chatThreads, setChatThreads] =
    useState<ChatThread[]>(DUMMY_CHAT_THREADS);
  const [activeThreadId, setActiveThreadId] = useState<string>(
    DUMMY_CHAT_THREADS[0].id
  );
  const [draftCategory, setDraftCategory] =
    useState<CuisineCategory>('Nasi & lauk');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3200);
  };

  const applyAuthSuccess = (params: {
    nim: string;
    dormName?: string;
    activeRole?: UserRole;
  }) => {
    setUser((prev) => ({
      ...prev,
      nim: params.nim,
      dormName: params.dormName ?? prev.dormName,
      activeRole: params.activeRole ?? prev.activeRole,
    }));
  };

  const changeRole = (role: UserRole) => {
    // BACKEND INTEGRATION: PATCH /api/profile { activeRole: role }
    setUser((prev) => ({ ...prev, activeRole: role }));
  };

  const updateRoom = (newRoom: string) => {
    // BACKEND INTEGRATION: PATCH /api/profile { roomNumber: newRoom }
    setUser((prev) => ({ ...prev, roomNumber: newRoom }));
    showToast(`Nomor kamar diperbarui ke ${newRoom}`);
  };

  const createRequest = async (payload: CreateRequestPayload) => {
    const { request, order } = await submitCookingRequest(payload, user.name);
    setOpenRequests((prev) => [request, ...prev]);
    setOrders((prev) => [order, ...prev]);
    setSelectedOrderId(order.id);
    showToast(`Request ${order.orderCode} terkirim ke koki Seni Kuliner!`);
    return order;
  };

  const claimRequest = (req: OpenRequest) => {
    // BACKEND INTEGRATION: POST /api/requests/${req.id}/accept
    const newOrder: OrderItem = {
      id: `ord-${Date.now()}`,
      orderCode: `#MM-${Math.floor(210 + Math.random() * 80)}`,
      estimatedArrival:
        req.timingLabel === 'Secepatnya' ? '19:45 WIB' : req.timingLabel,
      step: 2,
      isDeliveredConfirmed: false,
      chef: {
        id: user.id,
        name: user.name,
        major: user.major,
        rating: user.rating,
        avatarUrl: user.avatarUrl,
      },
      description: req.title,
      category: req.category,
      deliveryAddress: `${req.dormName}, ${req.roomNumber}`,
      ingredientMode: req.ingredientMode,
      ingredientNotes: req.ingredientList,
      receiptUploaded: false,
      receiptAmount: 0,
      chefWage: req.chefWage,
      serviceFee: 2000,
      paymentMethod: 'Tunai',
    };

    setOpenRequests((prev) => prev.filter((item) => item.id !== req.id));
    setOrders((prev) => [newOrder, ...prev]);
    setSelectedOrderId(newOrder.id);
    setUser((prev) => ({ ...prev, activeRole: 'koki' }));
    showToast(`Kamu mengambil request ${newOrder.orderCode}!`);
    return newOrder;
  };

  const selectPayment = async (orderId: string, method: PaymentMethod) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paymentMethod: method } : o))
    );
    await updatePaymentMethod(orderId, method);
  };

  const advanceOrderStep = async (
    orderId: string,
    nextStep: OrderStatusStep
  ) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, step: nextStep } : o))
    );
    await updateOrderStep(orderId, nextStep);
  };

  const confirmReceived = async (orderId: string, rating: number) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              step: 4,
              isDeliveredConfirmed: true,
              userRating: rating,
            }
          : o
      )
    );
    await confirmOrderReceived(orderId, rating);
    showToast('Pesanan selesai! Dana escrow telah diteruskan ke koki.');
  };

  const uploadReceipt = (orderId: string, amount: number) => {
    // BACKEND INTEGRATION: POST /api/orders/${orderId}/receipt
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, receiptUploaded: true, receiptAmount: amount }
          : o
      )
    );
    showToast('Nota belanja bahan berhasil diunggah.');
  };

  const markThreadRead = (threadId: string) => {
    setChatThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, unreadCount: 0 } : t))
    );
    setActiveThreadId(threadId);
  };

  const openOrCreateChefChat = (chefId: string, chefName: string) => {
    const existing = chatThreads.find(
      (t) =>
        t.peerName.toLowerCase() === chefName.toLowerCase() ||
        t.id === `thread-${chefId}`
    );

    if (existing) {
      markThreadRead(existing.id);
      return existing.id;
    }

    const initials = chefName
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const newThread: ChatThread = {
      id: `thread-${chefId}`,
      peerName: chefName,
      peerSubtitle: 'Koki Seni Kuliner',
      peerRoleLabel: 'Koki',
      initials,
      isOnline: true,
      badgeLabel: 'Pertanyaan',
      unreadCount: 0,
      lastMessagePreview: `Halo ${chefName}, mau tanya soal masakan...`,
      lastMessageTime: 'Baru saja',
      messages: [
        {
          id: `msg-init-${Date.now()}`,
          sender: 'peer',
          text: `Halo! Aku ${chefName} dari Seni Kuliner. Mau request dimasakin apa hari ini?`,
          timestamp: 'Sekarang',
        },
      ],
    };

    setChatThreads((prev) => [newThread, ...prev]);
    setActiveThreadId(newThread.id);
    return newThread.id;
  };

  const sendMessage = (
    threadId: string,
    text: string,
    attachmentType?: 'receipt' | 'photo',
    attachmentLabel?: string
  ) => {
    // BACKEND INTEGRATION: POST /api/chats/${threadId}/messages
    const nowTime = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    setChatThreads((prev) =>
      prev.map((t) => {
        if (t.id !== threadId) return t;
        return {
          ...t,
          lastMessagePreview: text,
          lastMessageTime: nowTime,
          messages: [
            ...t.messages,
            {
              id: `msg-${Date.now()}`,
              sender: 'me',
              text,
              timestamp: `${nowTime} WIB`,
              readReceipt: true,
              attachmentType,
              attachmentLabel,
            },
          ],
        };
      })
    );
  };

  const acceptChatRequest = (threadId: string) => {
    // BACKEND INTEGRATION: POST /api/chats/${threadId}/accept-request
    const thread = chatThreads.find((t) => t.id === threadId);
    if (!thread?.requestCard) return null;

    const reqCard = thread.requestCard;
    const newOrder: OrderItem = {
      id: `ord-${Date.now()}`,
      orderCode: `#MM-${Math.floor(220 + Math.random() * 70)}`,
      estimatedArrival: thread.targetTime ?? '19:30 WIB',
      step: 2,
      isDeliveredConfirmed: false,
      chef: {
        id: user.id,
        name: user.name,
        major: user.major,
        rating: user.rating,
        avatarUrl: user.avatarUrl,
      },
      description: reqCard.title,
      category: 'Nasi & lauk',
      deliveryAddress: `Dorm PIB, ${thread.peerSubtitle}`,
      ingredientMode: 'Saya sediakan',
      receiptUploaded: false,
      receiptAmount: 0,
      chefWage: reqCard.chefWage,
      serviceFee: 2000,
      paymentMethod: 'Tunai',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setSelectedOrderId(newOrder.id);
    setChatThreads((prev) =>
      prev.map((t) =>
        t.id === threadId && t.requestCard
          ? {
              ...t,
              badgeLabel: 'Selesai',
              requestCard: { ...t.requestCard, status: 'Diterima' },
              messages: [
                ...t.messages,
                {
                  id: `msg-accept-${Date.now()}`,
                  sender: 'me',
                  text: `Request "${reqCard.title}" sudah aku terima ya! Pesanan masuk ke status ${newOrder.orderCode}.`,
                  timestamp: 'Baru saja',
                  readReceipt: true,
                },
              ],
            }
          : t
      )
    );
    showToast(`Request dari ${thread.peerName} diterima (${newOrder.orderCode})`);
    return newOrder;
  };

  return (
    <AppStateContext.Provider
      value={{
        user,
        activeChefs: DUMMY_ACTIVE_CHEFS,
        openRequests,
        orders,
        selectedOrderId,
        reviews: DUMMY_REVIEWS,
        chatThreads,
        activeThreadId,
        draftCategory,
        setDraftCategory,
        setSelectedOrderId,
        setActiveThreadId,
        applyAuthSuccess,
        changeRole,
        updateRoom,
        createRequest,
        claimRequest,
        selectPayment,
        advanceOrderStep,
        confirmReceived,
        uploadReceipt,
        openOrCreateChefChat,
        markThreadRead,
        sendMessage,
        acceptChatRequest,
        showToast,
      }}
    >
      {children}

      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-24 lg:bottom-6 right-4 left-4 sm:left-auto sm:max-w-sm z-50 bg-cokelat-kopi text-krim-nasi border-2 border-outline rounded-lg px-gutter-md py-3 font-label text-label-md shadow-lg flex items-center gap-gutter-sm"
        >
          <span
            className="material-symbols-outlined text-primary text-title-lg shrink-0"
            aria-hidden="true"
          >
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}
    </AppStateContext.Provider>
  );
};

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error('useAppState must be used inside AppStateProvider');
  }
  return ctx;
}
