'use client';

import { useRouter } from 'next/navigation';
import { AuthScreen } from '../../components/screens/AuthScreen';
import { useAppState } from '../../context/AppStateContext';

/**
 * Route: /masuk (Masuk / Daftar)
 */
export default function AuthPage() {
  const router = useRouter();
  const { applyAuthSuccess } = useAppState();

  return (
    <AuthScreen
      onSuccessAuth={(params) => {
        applyAuthSuccess(params);
        router.push('/');
      }}
    />
  );
}
