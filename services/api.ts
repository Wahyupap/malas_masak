import {
  CreateRequestPayload,
  OpenRequest,
  OrderItem,
  OrderStatusStep,
  PaymentMethod,
  UserProfile,
  UserRole,
} from '../types';

/**
 * Frontend-to-Backend Integration Service Layer — malas masak
 *
 * HOW TO INTEGRATE WITH NEXT.JS BACKEND (App Router Route Handlers or REST API):
 * 1. Create Next.js API Route Handlers under `src/app/api/...` (or `app/api/...`):
 *    - POST   /api/auth/login          -> Verify NIM against campus PIB database + check password
 *    - POST   /api/auth/register       -> Create student account (with optional chef verification)
 *    - GET    /api/requests            -> List open cooking requests (filter by category / dorm)
 *    - POST   /api/requests            -> Create a new cooking request & hold escrow funds
 *    - POST   /api/requests/:id/accept -> Chef claims an open request -> creates an active Order
 *    - GET    /api/orders/active       -> Fetch active orders for current user/chef
 *    - PATCH  /api/orders/:id/status   -> Advance 4-step tracker (1 -> 2 -> 3 -> 4)
 *    - POST   /api/orders/:id/receipt  -> Upload grocery receipt photo & amount (multipart/form-data)
 *    - PATCH  /api/orders/:id/confirm  -> Buyer confirms delivery -> release escrow to chef
 *    - PATCH  /api/profile             -> Update dorm room number or active role (pemesan/koki)
 *    - GET    /api/chats               -> List threads for logged-in user
 *    - POST   /api/chats/:id/messages  -> Send chat message (or connect WebSocket/Pusher/Supabase Realtime)
 *
 * 2. Replace the simulated async helpers below with real `fetch('/api/...')` calls.
 *    Example is included inside each function comment.
 */

const SIMULATED_NETWORK_DELAY_MS = 180;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function loginWithNim(params: {
  nim: string;
  password: string;
}): Promise<{ ok: boolean; user?: Partial<UserProfile>; error?: string }> {
  /*
    BACKEND INTEGRATION EXAMPLE (Next.js Route Handler: POST /api/auth/login):
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) return { ok: false, error: (await res.json()).message };
    return { ok: true, user: await res.json() };
  */
  await wait(SIMULATED_NETWORK_DELAY_MS);
  if (!params.nim.trim()) {
    return { ok: false, error: 'Masukkan NIM mahasiswa terlebih dahulu.' };
  }
  return {
    ok: true,
    user: {
      nim: params.nim.trim(),
    },
  };
}

export async function registerAccount(params: {
  nim: string;
  password: string;
  dormName: string;
  initialRole: UserRole;
}): Promise<{ ok: boolean; user?: Partial<UserProfile>; error?: string }> {
  /*
    BACKEND INTEGRATION EXAMPLE (Next.js Route Handler: POST /api/auth/register):
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return await res.json();
  */
  await wait(SIMULATED_NETWORK_DELAY_MS);
  if (!params.nim.trim() || !params.password.trim()) {
    return { ok: false, error: 'NIM dan kata sandi wajib diisi.' };
  }
  return {
    ok: true,
    user: {
      nim: params.nim.trim(),
      dormName: params.dormName,
      activeRole: params.initialRole,
    },
  };
}

export async function submitCookingRequest(
  payload: CreateRequestPayload,
  requesterName: string
): Promise<{ request: OpenRequest; order: OrderItem }> {
  /*
    BACKEND INTEGRATION EXAMPLE (Next.js Route Handler: POST /api/requests):
    // If payload includes an ingredient photo File, send FormData instead of JSON.
    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Gagal mengirim request');
    return await res.json();
  */
  await wait(SIMULATED_NETWORK_DELAY_MS);

  const randomCode = Math.floor(205 + Math.random() * 90);
  const newReqId = `req-${Date.now()}`;
  const timingLabel =
    payload.timing === 'Jadwalkan' && payload.scheduledTime
      ? payload.scheduledTime
      : 'Secepatnya';

  const request: OpenRequest = {
    id: newReqId,
    category: payload.category,
    timingLabel,
    title: payload.description.trim(),
    dormName: 'Dorm PIB',
    roomNumber: payload.roomAddress.trim() || 'Kamar B105',
    ingredientMode: payload.ingredientMode,
    ingredientList: payload.ingredientList,
    chefWage: payload.chefWage,
    requesterName,
    createdAt: 'Baru saja',
  };

  const order: OrderItem = {
    id: `ord-${Date.now()}`,
    orderCode: `#MM-${randomCode}`,
    estimatedArrival:
      payload.timing === 'Jadwalkan' && payload.scheduledTime
        ? payload.scheduledTime
        : '20:00 WIB',
    step: 1, // 1 = Request terkirim
    isDeliveredConfirmed: false,
    chef: {
      id: 'chef-pending',
      name: 'Menunggu Koki',
      major: 'Seni Kuliner',
      rating: 4.9,
      avatarUrl: null,
    },
    description: payload.description.trim(),
    category: payload.category,
    deliveryAddress: payload.roomAddress.trim() || 'Asrama Melati, Kamar B105',
    ingredientMode: payload.ingredientMode,
    ingredientNotes: payload.ingredientList,
    receiptUploaded: false,
    receiptAmount: 0,
    chefWage: payload.chefWage,
    serviceFee: 2000,
    paymentMethod: 'Tunai',
  };

  return { request, order };
}

export async function updateOrderStep(
  orderId: string,
  nextStep: OrderStatusStep
): Promise<{ ok: boolean; orderId: string; step: OrderStatusStep }> {
  /*
    BACKEND INTEGRATION EXAMPLE (PATCH /api/orders/:id/status):
    await fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ step: nextStep }),
    });
  */
  await wait(100);
  return { ok: true, orderId, step: nextStep };
}

export async function updatePaymentMethod(
  orderId: string,
  paymentMethod: PaymentMethod
): Promise<{ ok: boolean }> {
  /*
    BACKEND INTEGRATION EXAMPLE (PATCH /api/orders/:id/payment):
    await fetch(`/api/orders/${orderId}/payment`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentMethod }),
    });
  */
  await wait(80);
  void orderId;
  void paymentMethod;
  return { ok: true };
}

export async function confirmOrderReceived(
  orderId: string,
  rating?: number
): Promise<{ ok: boolean }> {
  /*
    BACKEND INTEGRATION EXAMPLE (PATCH /api/orders/:id/confirm):
    // Releases escrow funds to the chef and records optional star rating
    await fetch(`/api/orders/${orderId}/confirm`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating }),
    });
  */
  await wait(SIMULATED_NETWORK_DELAY_MS);
  void orderId;
  void rating;
  return { ok: true };
}
