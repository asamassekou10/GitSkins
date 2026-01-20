'use client';

/**
 * Client-side Analytics Provider
 * 
 * Wraps the application to provide analytics tracking utilities
 * for client-side events like theme selection, markdown copies, etc.
 */

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track page views
    if (pathname && typeof window !== 'undefined') {
      const fullPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      
      // Track showcase page views
      if (pathname.startsWith('/showcase/')) {
        const username = pathname.split('/showcase/')[1]?.split('?')[0];
        const theme = searchParams?.get('theme');
        
        if (username && posthog.__loaded) {
          posthog.capture('showcase_viewed', {
            username,
            theme: theme || 'satan',
            path: fullPath,
          });
        }
      }
    }
  }, [pathname, searchParams]);

  return <>{children}</>;
}

/**
 * Client-side analytics helper functions
 */
export const analytics = {
  /**
   * Track theme selection on client
   */
  trackThemeSelection: (theme: string, source: 'landing' | 'showcase' = 'landing', username?: string) => {
    if (typeof window !== 'undefined' && posthog.__loaded) {
      posthog.capture('theme_selected', {
        theme,
        source,
        username,
      });
    }
  },

  /**
   * Track markdown copy on client
   */
  trackMarkdownCopy: (widgetType: string, theme: string, username: string, source: 'landing' | 'showcase' = 'landing') => {
    if (typeof window !== 'undefined' && posthog.__loaded) {
      posthog.capture('markdown_copied', {
        widget_type: widgetType,
        theme,
        username,
        source,
      });
    }
  },

  /**
   * Track conversion funnel step
   */
  trackConversion: (step: string, metadata?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && posthog.__loaded) {
      posthog.capture('conversion_funnel', {
        step,
        ...metadata,
      });
    }
  },

  /**
   * Track custom event
   */
  track: (eventName: string, properties?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && posthog.__loaded) {
      posthog.capture(eventName, properties);
    }
  },
};
