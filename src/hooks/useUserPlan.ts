'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';

export interface UserPlanData {
  plan: 'free' | 'pro';
  readmeGenerationsUsed: number;
  readmeGenerationsLimit: number;
  readmeGenerationsRemaining: number;
  month: string;
  loading: boolean;
  authenticated: boolean;
}

const DEFAULT: UserPlanData = {
  plan: 'free',
  readmeGenerationsUsed: 0,
  readmeGenerationsLimit: 5,
  readmeGenerationsRemaining: 5,
  month: '',
  loading: true,
  authenticated: false,
};

const UNAUTHENTICATED: UserPlanData = {
  ...DEFAULT,
  readmeGenerationsLimit: 0,
  readmeGenerationsRemaining: 0,
  loading: false,
  authenticated: false,
};

// Module-level cache: key → { data, fetchedAt }
const cache = new Map<string, { data: UserPlanData; fetchedAt: number }>();
const CACHE_TTL = 30_000; // 30 seconds

export function useUserPlan(): UserPlanData {
  const { status } = useSession();
  const [result, setResult] = useState<UserPlanData>(DEFAULT);
  const fetchingRef = useRef(false);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      setResult(UNAUTHENTICATED);
      return;
    }

    const key = '/api/usage';
    const cached = cache.get(key);
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
      setResult(cached.data);
      return;
    }

    if (fetchingRef.current) return;
    fetchingRef.current = true;

    fetch(key)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) {
          setResult(UNAUTHENTICATED);
          return;
        }
        const resolved: UserPlanData = { ...data, loading: false, authenticated: true };
        cache.set(key, { data: resolved, fetchedAt: Date.now() });
        setResult(resolved);
      })
      .catch(() => setResult(UNAUTHENTICATED))
      .finally(() => { fetchingRef.current = false; });
  }, [status]);

  return result;
}
