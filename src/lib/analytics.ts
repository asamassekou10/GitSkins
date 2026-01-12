/**
 * Analytics and Event Tracking Utilities
 *
 * Edge-compatible server-side event tracking for API routes
 * Uses fetch API instead of posthog-node for Edge Runtime compatibility
 */

// PostHog configuration
const POSTHOG_API_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

export interface CardGenerationEvent {
  cardType: 'premium' | 'stats' | 'languages' | 'streak' | 'repos' | 'card' | 'card-animated';
  theme?: string;
  username: string;
  success: boolean;
  errorType?: string;
  duration?: number;
}

/**
 * Track card generation event using fetch API (Edge-compatible)
 */
export async function trackCardGeneration(event: CardGenerationEvent) {
  if (!POSTHOG_API_KEY) return;

  try {
    // Use PostHog's capture API directly with fetch
    await fetch(`${POSTHOG_HOST}/capture/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: POSTHOG_API_KEY,
        event: 'card_generated',
        properties: {
          distinct_id: event.username,
          card_type: event.cardType,
          theme: event.theme || 'default',
          success: event.success,
          error_type: event.errorType,
          duration_ms: event.duration,
          timestamp: new Date().toISOString(),
        },
      }),
    }).catch(() => {
      // Silently fail - don't break card generation
    });
  } catch (error) {
    // Silently fail - don't break card generation
    console.error('[Analytics] Failed to track event:', error);
  }
}

/**
 * Track API error using fetch API (Edge-compatible)
 */
export async function trackApiError(route: string, error: Error, context?: Record<string, unknown>) {
  if (!POSTHOG_API_KEY) return;

  try {
    await fetch(`${POSTHOG_HOST}/capture/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: POSTHOG_API_KEY,
        event: 'api_error',
        properties: {
          distinct_id: 'system',
          route,
          error_message: error.message,
          error_stack: error.stack,
          ...context,
          timestamp: new Date().toISOString(),
        },
      }),
    }).catch(() => {
      // Silently fail
    });
  } catch (err) {
    console.error('[Analytics] Failed to track error:', err);
  }
}
