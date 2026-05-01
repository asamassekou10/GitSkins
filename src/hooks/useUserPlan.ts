'use client';

import useSWR from 'swr';
import { useSession } from 'next-auth/react';

export interface UserPlanData {
  plan: 'free' | 'pro';
  readmeGenerationsUsed: number;
  readmeGenerationsLimit: number;
  readmeGenerationsRemaining: number;
  month: string;
  loading: boolean;
}

const DEFAULT: UserPlanData = {
  plan: 'free',
  readmeGenerationsUsed: 0,
  readmeGenerationsLimit: 5,
  readmeGenerationsRemaining: 5,
  month: '',
  loading: true,
};

const fetcher = (url: string) =>
  fetch(url).then((r) => (r.ok ? r.json() : null));

export function useUserPlan(): UserPlanData {
  const { status } = useSession();

  const { data, isLoading } = useSWR(
    status === 'authenticated' ? '/api/usage' : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30_000,
      shouldRetryOnError: false,
    }
  );

  if (status === 'unauthenticated') return { ...DEFAULT, loading: false };
  if (status === 'loading' || isLoading) return DEFAULT;
  if (!data) return { ...DEFAULT, loading: false };

  return { ...data, loading: false };
}
