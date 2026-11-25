'use client';

import { useRouter } from 'next/navigation';
import { CreateRequestScreen } from '../../components/screens/CreateRequestScreen';
import { useAppState } from '../../context/AppStateContext';

/**
 * Route: /buat-request (Buat Request)
 *
 * BACKEND INTEGRATION NOTE:
 * Pass server-fetched `activeChefs` here or hydrate from `GET /api/chefs/active`
 * so the "Pilih Chef" 3-row horizontal selector always reflects real online chefs.
 */
export default function CreateRequestPage() {
  const router = useRouter();
  const {
    activeChefs,
    draftRequestType,
    draftSelectedChefId,
    createRequest,
  } = useAppState();

  return (
    <CreateRequestScreen
      activeChefs={activeChefs}
      initialRequestType={draftRequestType}
      initialChefId={draftSelectedChefId}
      onBack={() => router.push('/')}
      onSubmitRequest={async (payload) => {
        await createRequest(payload);
        router.push('/pesanan');
      }}
    />
  );
}
