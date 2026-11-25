import {
  ActiveChef,
  ChatThread,
  OpenRequest,
  OrderItem,
  ReviewItem,
  UserProfile,
} from '../types';

/**
 * Dummy Data Store — malas masak
 *
 * BACKEND INTEGRATION NOTE:
 * Replace these static initial values with server-fetched data via:
 * - Next.js Server Components / `fetch('/api/...')` in Route Handlers
 * - React Query / SWR hooks calling `src/services/api.ts`
 *
 * NOTE ON PROFILE PICTURES:
 * `avatarUrl` is set to `null` so all profile pictures render the clean white-and-grey
 * default profile avatar component (`<DefaultAvatar />`), per project specification.
 * Once connected to backend storage (e.g. S3 / Supabase Storage / Cloudinary),
 * populate `avatarUrl` with the user's uploaded photo URL.
 */

export const DUMMY_CURRENT_USER: UserProfile = {
  id: 'usr-daniel-01',
  name: 'Daniel',
  nim: '2024103045',
  major: 'Seni Kuliner',
  dormName: 'Dormitory 1',
  roomNumber: 'Kamar B204',
  verifiedCampus: true,
  activeRole: 'koki',
  avatarUrl: null, // Renders default white & grey profile picture
  points: 240,
  rating: 4.9,
  flagCount: 0,
  completedOrders: 24,
};

export const DUMMY_ACTIVE_CHEFS: ActiveChef[] = [
  {
    id: 'chef-daniel',
    name: 'Daniel',
    major: 'Seni Kuliner',
    specialty: 'nasi & tumisan',
    category: 'Nasi & lauk',
    rating: 4.9,
    completedCount: 24,
    avatarUrl: null, // Default white & grey profile picture
    isOnline: true,
  },
  {
    id: 'chef-gwen',
    name: 'Gwen',
    major: 'Seni Kuliner',
    specialty: 'mie & sup hangat',
    category: 'Mie & sup',
    rating: 5.0,
    completedCount: 31,
    avatarUrl: null, // Default white & grey profile picture
    isOnline: true,
  },
  {
    id: 'chef-pedorin',
    name: 'Pedorin',
    major: 'Seni Kuliner',
    specialty: 'menu sehat',
    category: 'Menu sehat',
    rating: 4.8,
    completedCount: 19,
    avatarUrl: null, // Default white & grey profile picture
    isOnline: true,
  },
];

export const DUMMY_OPEN_REQUESTS: OpenRequest[] = [
  {
    id: 'req-101',
    category: 'Nasi & lauk',
    timingLabel: 'Secepatnya',
    title: 'Nasi telur dadar krispi & sambal terasi',
    dormName: 'Asrama Melati',
    roomNumber: 'Kamar B204',
    ingredientMode: 'Koki yang belanja',
    chefWage: 15000,
    requesterName: 'Salsa',
    createdAt: 'Baru saja',
  },
  {
    id: 'req-102',
    category: 'Mie & sup',
    timingLabel: '19:30 WIB',
    title: 'Sup ayam jahe hangat, tanpa micin',
    dormName: 'Asrama Anggrek',
    roomNumber: 'Kamar A112',
    ingredientMode: 'Saya sediakan',
    ingredientList: 'Dada ayam fillet 250g, jahe, daun bawang, wortel',
    chefWage: 18000,
    requesterName: 'Rizky',
    createdAt: '5m lalu',
  },
  {
    id: 'req-103',
    category: 'Camilan',
    timingLabel: 'Secepatnya',
    title: 'Pisang goreng keju cokelat 2 porsi',
    dormName: 'Asrama Melati',
    roomNumber: 'Kamar B308',
    ingredientMode: 'Koki yang belanja',
    chefWage: 12000,
    requesterName: 'Bima',
    createdAt: '12m lalu',
  },
];

export const DUMMY_INITIAL_ORDERS: OrderItem[] = [
  {
    id: 'ord-204',
    orderCode: '#MM-204',
    estimatedArrival: '19:30 WIB',
    step: 3,
    isDeliveredConfirmed: false,
    chef: {
      id: 'chef-gwen',
      name: 'Gwen',
      major: 'Seni Kuliner',
      rating: 5.0,
      avatarUrl: null, // Default white & grey profile picture
    },
    description: 'Nasi goreng kampung, tidak pedas, tambah telur',
    category: 'Nasi & lauk',
    deliveryAddress: 'Asrama Melati, Kamar B105',
    ingredientMode: 'Koki yang belanja',
    receiptUploaded: true,
    receiptAmount: 18500,
    chefWage: 15000,
    serviceFee: 2000,
    paymentMethod: 'Tunai',
  },
];

export const DUMMY_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    reviewerName: 'Salsa',
    roomNumber: 'Kamar B105',
    rating: 5.0,
    comment:
      'Nasi gorengnya enak banget, porsinya pas dan diantar masih hangat. Nota belanja juga jelas.',
    menuName: 'Nasi goreng kampung',
    dateLabel: 'Kemarin',
  },
  {
    id: 'rev-2',
    reviewerName: 'Bima',
    roomNumber: 'Kamar A201',
    rating: 4.8,
    comment:
      'Cepat dimasakinnya, pas banget buat makan malam habis nugas.',
    menuName: 'Mie tek-tek kuah',
    dateLabel: '3 hari lalu',
  },
];

export const DUMMY_CHAT_THREADS: ChatThread[] = [
  {
    id: 'thread-salsa',
    peerName: 'Salsa',
    peerSubtitle: 'Kamar B105',
    peerRoleLabel: 'Pemesan',
    initials: 'SA',
    isOnline: true,
    targetTime: '19:30 WIB',
    badgeLabel: 'Request masuk',
    unreadCount: 1,
    lastMessagePreview: 'Siap kak, makasih banyak! Kalau kurang bawang...',
    lastMessageTime: '18:45',
    requestCard: {
      id: 'chat-req-1',
      targetChefName: 'Daniel',
      title: 'Ayam teriyaki + telur dadar',
      ingredientNote: 'Bahan dari pemesan',
      chefWage: 15000,
      status: 'Menunggu konfirmasi',
    },
    messages: [
      {
        id: 'msg-1',
        sender: 'peer',
        text: 'Kak Daniel, bisa masakin ayam teriyaki + telur dadar buat jam 19:30? Dada ayam sama sausnya udah aku siapin di kamar.',
        timestamp: '18:42 WIB',
      },
      {
        id: 'msg-2',
        sender: 'me',
        text: 'Bisa banget Salsa! Aku selesai kelas jam 19:00, nanti langsung mampir ambil bahannya ya.',
        timestamp: '18:44 WIB',
        readReceipt: true,
      },
      {
        id: 'msg-3',
        sender: 'peer',
        text: 'Siap kak, makasih banyak! Kalau kurang bawang putih kabarin aja ya.',
        timestamp: '18:45 WIB',
      },
    ],
  },
  {
    id: 'thread-rizky',
    peerName: 'Rizky',
    peerSubtitle: 'Kamar C302',
    peerRoleLabel: 'Pemesan',
    initials: 'RZ',
    isOnline: true,
    targetTime: '20:00 WIB',
    badgeLabel: 'Pertanyaan',
    unreadCount: 1,
    lastMessagePreview: 'Halo kak, kalau request nasi goreng seafood tanpa udang bisa?',
    lastMessageTime: '18:30',
    messages: [
      {
        id: 'msg-r1',
        sender: 'peer',
        text: 'Halo kak, kalau request nasi goreng seafood tanpa udang malam ini bisa?',
        timestamp: '18:30 WIB',
      },
    ],
  },
  {
    id: 'thread-gwen',
    peerName: 'Gwen',
    peerSubtitle: 'Koki Seni Kuliner',
    peerRoleLabel: 'Koki',
    initials: 'GW',
    isOnline: true,
    targetTime: '19:30 WIB',
    badgeLabel: 'Selesai',
    unreadCount: 0,
    lastMessagePreview: 'Nota belanja bumbu sudah dikirim ya.',
    lastMessageTime: 'Kemarin',
    messages: [
      {
        id: 'msg-g1',
        sender: 'peer',
        text: 'Nota belanja bumbu sudah dikirim ya. Total bahan Rp 18.500.',
        timestamp: '18:10 WIB',
        attachmentType: 'receipt',
        attachmentLabel: 'Nota_Belanja_Bumbu.jpg',
      },
      {
        id: 'msg-g2',
        sender: 'me',
        text: 'Siap Gwen, makasih banyak! Ditunggu di B105 ya.',
        timestamp: '18:12 WIB',
        readReceipt: true,
      },
    ],
  },
];
