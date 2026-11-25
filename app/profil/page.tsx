'use client';

import { useRouter } from 'next/navigation';
import { AppShell } from '../../components/AppShell';
import { ProfileScreen } from '../../components/screens/ProfileScreen';
import { useAppState } from '../../context/AppStateContext';

/**
 * Route: /profil (Profil Saya)
 */
export default function ProfilePage() {
  const router = useRouter();
  const {
    user,
    reviews,
    chatThreads,
    changeRole,
    updateRoom,
    markThreadRead,
  } = useAppState();

  const totalUnread = chatThreads.reduce((acc, t) => acc + t.unreadCount, 0);

  return (
    <AppShell dormLabel="Dorm PIB" unreadChatCount={totalUnread}>
      <ProfileScreen
        user={user}
        reviews={reviews}
        incomingChatThreads={chatThreads}
        onChangeRole={changeRole}
        onUpdateRoom={updateRoom}
        onOpenChatThread={(threadId) => {
          markThreadRead(threadId);
          router.push('/chat');
        }}
        onLogout={() => router.push('/masuk')}
      />
    </AppShell>
  );
}
