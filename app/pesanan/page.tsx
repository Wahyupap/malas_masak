'use client';

import { useRouter } from 'next/navigation';
import { AppShell } from '../../components/AppShell';
import { OrdersScreen } from '../../components/screens/OrdersScreen';
import { useAppState } from '../../context/AppStateContext';

/**
 * Route: /pesanan (Pesanan & Status)
 */
export default function OrdersPage() {
  const router = useRouter();
  const {
    user,
    orders,
    selectedOrderId,
    chatThreads,
    setSelectedOrderId,
    selectPayment,
    advanceOrderStep,
    confirmReceived,
    uploadReceipt,
    openOrCreateChefChat,
  } = useAppState();

  const totalUnread = chatThreads.reduce((acc, t) => acc + t.unreadCount, 0);

  return (
    <AppShell dormLabel="Dorm PIB" unreadChatCount={totalUnread}>
      <OrdersScreen
        orders={orders}
        selectedOrderId={selectedOrderId}
        activeRole={user.activeRole}
        onSelectOrder={setSelectedOrderId}
        onSelectPayment={selectPayment}
        onAdvanceStep={advanceOrderStep}
        onConfirmReceived={confirmReceived}
        onUploadReceipt={uploadReceipt}
        onChatWithChef={(chefId, chefName) => {
          openOrCreateChefChat(chefId, chefName);
          router.push('/chat');
        }}
      />
    </AppShell>
  );
}
