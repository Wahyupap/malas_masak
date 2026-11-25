'use client';

import { useRouter } from 'next/navigation';
import { AppShell } from '../../components/AppShell';
import { ChatScreen } from '../../components/screens/ChatScreen';
import { useAppState } from '../../context/AppStateContext';

/**
 * Route: /chat (Chat & Request Masuk)
 */
export default function ChatPage() {
  const router = useRouter();
  const {
    chatThreads,
    activeThreadId,
    markThreadRead,
    sendMessage,
    acceptChatRequest,
  } = useAppState();

  const totalUnread = chatThreads.reduce((acc, t) => acc + t.unreadCount, 0);

  return (
    <AppShell dormLabel="Dorm PIB" unreadChatCount={totalUnread}>
      <ChatScreen
        threads={chatThreads}
        activeThreadId={activeThreadId}
        onSelectThread={markThreadRead}
        onSendMessage={sendMessage}
        onAcceptChatRequest={acceptChatRequest}
        onBack={() => router.back()}
      />
    </AppShell>
  );
}
