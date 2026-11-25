'use client';

import { useRouter } from 'next/navigation';
import { AppShell } from '../components/AppShell';
import { HomeScreen } from '../components/screens/HomeScreen';
import { useAppState } from '../context/AppStateContext';

/**
 * Route: / (Beranda)
 *
 * BACKEND INTEGRATION NOTE (Next.js Server Component upgrade):
 * To render SSR/RSC data on initial load, convert this file into an async Server Component
 * that queries `activeChefs` and `openRequests` directly from your DB (Prisma/Drizzle)
 * and passes them as `initialChefs` / `initialRequests` into a client wrapper.
 */
export default function HomePage() {
  const router = useRouter();
  const {
    user,
    activeChefs,
    openRequests,
    chatThreads,
    changeRole,
    setDraftCategory,
    openOrCreateChefChat,
    claimRequest,
  } = useAppState();

  const totalUnread = chatThreads.reduce((acc, t) => acc + t.unreadCount, 0);

  return (
    <AppShell dormLabel="Dorm PIB" unreadChatCount={totalUnread}>
      <HomeScreen
        activeRole={user.activeRole}
        onChangeRole={changeRole}
        activeChefs={activeChefs}
        openRequests={openRequests}
        onGoCreateRequest={(cat) => {
          if (cat) setDraftCategory(cat);
          router.push('/buat-request');
        }}
        onChatWithChef={(chef) => {
          openOrCreateChefChat(chef.id, chef.name);
          router.push('/chat');
        }}
        onClaimRequest={(req) => {
          claimRequest(req);
          router.push('/pesanan');
        }}
      />
    </AppShell>
  );
}
