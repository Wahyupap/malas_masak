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
 * 1. Create Next.js API Route Handlers under `src/app/api/...`:
 *    - POST   /api/auth/login          -> Verify student phone number + password
 *    - POST   /api/auth/register       -> Create student account (with optional chef verification)
 *    - GET    /api/chefs/active        -> Fetch active culinary students for Home & Buat Request -> Pilih Chef
 *    - GET    /api/requests            -> List open public cooking requests
 *    - POST   /api/requests            -> Create a new request (Publik or Pilih Chef) + Pajak Unggah Request Rp 500
 *    - POST   /api/requests/:id/accept -> Chef claims an open request -> creates an active Order
 *    - GET    /api/orders/active       -> Fetch active orders for current user/chef
 *    - PATCH  /api/orders/:id/status   -> Advance 4-step tracker (1 -> 2 -> 3 -> 4)
 *    - POST   /api/orders/:id/receipt  -> Upload grocery receipt photo & amount (multipart/form-data)
 *    - PATCH  /api/orders/:id/confirm  -> Buyer confirms delivery -> release escrow to chef
 *    - PATCH  /api/profile             -> Update dorm room number or active role (pemesan/koki)
 *    - GET    /api/chats               -> List threads for logged-in user
 *    - POST   /api/chats/:id/messages  -> Send chat message (or connect WebSocket/Pusher/Supabase Realtime)
 */

const SIMULATED_NETWORK_DELAY_MS = 180;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function loginWithPhone(params: {
  phoneNumber: string;
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
  if (!params.phoneNumber.trim()) {
    return { ok: false, error: 'Masukkan nomor HP mahasiswa terlebih dahulu.' };
  }
  return {
    ok: true,
    user: {
      phoneNumber: params.phoneNumber.trim(),
    },
  };
}

export async function registerAccount(params: {
  phoneNumber: string;
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
  if (!params.phoneNumber.trim() || !params.password.trim()) {
    return { ok: false, error: 'Nomor HP dan kata sandi wajib diisi.' };
  }
  return {
    ok: true,
    user: {
      phoneNumber: params.phoneNumber.trim(),
      dormName: params.dormName,
      activeRole: params.initialRole,
    },
  };
}

export async function submitCookingRequest(
  payload: CreateRequestPayload,
  requesterName: string
): Promise<{ request: OpenRequest | null; order: OrderItem }> {
  /*
    BACKEND INTEGRATION EXAMPLE (Next.js Route Handler: POST /api/requests):
    // Send payload including `requestType` ('publik' | 'pilih-chef'), `selectedChefId`,
    // `ingredientMode` ('Gunakan Menu Chef' | 'Saya sediakan'), and `requestFee` (500).
    // If `ingredientPhotoName` has a File, use multipart/form-data.
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

  const isDirectChef =
    payload.requestType === 'pilih-chef' && Boolean(payload.selectedChef);

  const request: OpenRequest | null = isDirectChef
    ? null
    : {
        id: newReqId,
        requestType: payload.requestType,
        category: 'Nasi & lauk',
        timingLabel,
        title: payload.description.trim(),
        dormName: 'Dorm PIB',
        roomNumber: payload.roomAddress.trim() || 'Kamar B105',
        ingredientMode: payload.ingredientMode,
        ingredientList: payload.ingredientList,
        chefWage: payload.chefWage,
        requestFee: payload.requestFee,
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
    step: isDirectChef ? 2 : 1, // Direct chef requests route straight to chosen chef
    isDeliveredConfirmed: false,
    chef: payload.selectedChef
      ? {
          id: payload.selectedChef.id,
          name: payload.selectedChef.name,
          major: payload.selectedChef.major,
          rating: payload.selectedChef.rating,
          avatarUrl: payload.selectedChef.avatarUrl,
        }
      : {
          id: 'chef-pending',
          name: 'Menunggu Koki',
          major: 'Seni Kuliner',
          rating: 4.9,
          avatarUrl: null,
        },
    description: payload.description.trim(),
    requestType: payload.requestType,
    category: payload.selectedChef?.category ?? 'Nasi & lauk',
    deliveryAddress: payload.roomAddress.trim() || 'Asrama Melati, Kamar B105',
    ingredientMode: payload.ingredientMode,
    ingredientNotes: payload.ingredientList,
    receiptUploaded: false,
    receiptAmount: 0,
    chefWage: payload.chefWage,
    serviceFee: payload.requestFee, // Pajak Unggah Request Rp 500
    paymentMethod: 'Tunai',
  };

  return { request, order };
}

export async function updateOrderStep(
  orderId: string,
  nextStep: OrderStatusStep
): Promise<{ ok: boolean; orderId: string; step: OrderStatusStep }> {
  await wait(100);
  return { ok: true, orderId, step: nextStep };
}

export async function updatePaymentMethod(
  orderId: string,
  paymentMethod: PaymentMethod
): Promise<{ ok: boolean }> {
  await wait(80);
  void orderId;
  void paymentMethod;
  return { ok: true };
}

export async function confirmOrderReceived(
  orderId: string,
  rating?: number
): Promise<{ ok: boolean }> {
  await wait(SIMULATED_NETWORK_DELAY_MS);
  void orderId;
  void rating;
  return { ok: true };
}
