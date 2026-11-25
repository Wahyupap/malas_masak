'use client';

import { useRouter } from 'next/navigation';
import { CreateRequestScreen } from '../../components/screens/CreateRequestScreen';
import { useAppState } from '../../context/AppStateContext';

/**
 * Route: /buat-request (Buat Request)
 */
export default function CreateRequestPage() {
  const router = useRouter();
  const { draftCategory, createRequest } = useAppState();

  return (
    <CreateRequestScreen
      initialCategory={draftCategory}
      onBack={() => router.push('/')}
      onSubmitRequest={async (payload) => {
        await createRequest(payload);
        router.push('/pesanan');
      }}
    />
  );
}
