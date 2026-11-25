/**
 * Domain TypeScript Models — malas masak
 *
 * BACKEND INTEGRATION NOTE (Next.js / REST / Prisma / Drizzle):
 * Mirror these interfaces with your backend database schema (e.g., Prisma models or
 * PostgreSQL tables) and API response DTOs so TypeScript end-to-end safety is preserved.
 */

export type ScreenName =
  | 'auth'
  | 'beranda'
  | 'buat-request'
  | 'pesanan'
  | 'profil'
  | 'chat';

export type UserRole = 'pemesan' | 'koki';

export type CuisineCategory =
  | 'Nasi & lauk'
  | 'Mie & sup'
  | 'Camilan'
  | 'Menu sehat';

export type TimingOption = 'Secepatnya' | 'Jadwalkan';

export type IngredientMode = 'Koki yang belanja' | 'Saya sediakan';

export type PaymentMethod = 'Tunai' | 'QRIS' | 'E-wallet';

/**
 * 1 = Request terkirim
 * 2 = Koki menerima
 * 3 = Sedang dimasak
 * 4 = Diantar ke kamarmu (or completed)
 */
export type OrderStatusStep = 1 | 2 | 3 | 4;

export interface UserProfile {
  id: string;
  name: string;
  nim: string;
  major: string;
  dormName: string;
  roomNumber: string;
  verifiedCampus: boolean;
  activeRole: UserRole;
  /** Optional profile image URL; null renders default white & grey avatar */
  avatarUrl: string | null;
  points: number;
  rating: number;
  flagCount: number;
  completedOrders: number;
}

export interface ActiveChef {
  id: string;
  name: string;
  major: string;
  specialty: string;
  category: CuisineCategory;
  rating: number;
  completedCount: number;
  /** Optional avatar URL; null renders default white & grey avatar */
  avatarUrl: string | null;
  isOnline: boolean;
}

export interface OpenRequest {
  id: string;
  category: CuisineCategory;
  timingLabel: string;
  title: string;
  dormName: string;
  roomNumber: string;
  ingredientMode: IngredientMode;
  ingredientList?: string;
  ingredientPhotoPreview?: string;
  chefWage: number;
  requesterName: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderCode: string; // e.g., "#MM-204"
  estimatedArrival: string; // e.g., "19:30 WIB"
  step: OrderStatusStep;
  isDeliveredConfirmed: boolean;
  chef: {
    id: string;
    name: string;
    major: string;
    rating: number;
    avatarUrl: string | null;
  };
  description: string;
  category: CuisineCategory;
  deliveryAddress: string;
  ingredientMode: IngredientMode;
  ingredientNotes?: string;
  receiptUploaded: boolean;
  receiptAmount: number;
  receiptImageUrl?: string;
  chefWage: number;
  serviceFee: number;
  paymentMethod: PaymentMethod;
  userRating?: number;
}

export interface ReviewItem {
  id: string;
  reviewerName: string;
  roomNumber: string;
  rating: number;
  comment: string;
  menuName: string;
  dateLabel: string;
}

export interface ChatRequestCard {
  id: string;
  targetChefName: string;
  title: string;
  ingredientNote: string;
  chefWage: number;
  status: 'Menunggu konfirmasi' | 'Diterima' | 'Selesai';
}

export interface ChatMessage {
  id: string;
  sender: 'me' | 'peer';
  text: string;
  timestamp: string;
  readReceipt?: boolean;
  attachmentType?: 'receipt' | 'photo';
  attachmentLabel?: string;
}

export interface ChatThread {
  id: string;
  peerName: string;
  peerSubtitle: string; // e.g., "Kamar B105" or "Koki Seni Kuliner"
  peerRoleLabel: string; // e.g., "Pemesan" or "Koki"
  initials: string;
  isOnline: boolean;
  targetTime?: string;
  badgeLabel: 'Request masuk' | 'Pertanyaan' | 'Selesai';
  unreadCount: number;
  lastMessagePreview: string;
  lastMessageTime: string;
  requestCard?: ChatRequestCard;
  messages: ChatMessage[];
}

export interface CreateRequestPayload {
  description: string;
  category: CuisineCategory;
  roomAddress: string;
  timing: TimingOption;
  scheduledTime?: string;
  ingredientMode: IngredientMode;
  ingredientDetailMode?: 'foto' | 'tulis';
  ingredientList?: string;
  ingredientPhotoName?: string;
  chefWage: number;
}
