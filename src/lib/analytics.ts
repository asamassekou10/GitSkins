/**
 * Analytics and Event Tracking Utilities
 *
 * Server-side event tracking for API routes
 */

import { PostHog } from 'posthog-node';

// Initialize PostHog client for server-side tracking
let posthogClient: PostHog | null = null;

if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
  });
}

export interface CardGenerationEvent {
  cardType: 'premium' | 'stats' | 'languages' | 'streak' | 'repos' | 'card' | 'card-animated';
  theme?: string;
  username: string;
  success: boolean;
  errorType?: string;
  duration?: number;
}

/**
 * Track card generation event
 */
export function trackCardGeneration(event: CardGenerationEvent) {
  if (!posthogClient) return;

  try {
    posthogClient.capture({
      distinctId: event.username,
      event: 'card_generated',
      properties: {
        card_type: event.cardType,
        theme: event.theme || 'default',
        success: event.success,
        error_type: event.errorType,
        duration_ms: event.duration,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    // Silently fail - don't break card generation
    console.error('[Analytics] Failed to track event:', error);
  }
}

/**
 * Track API error
 */
export function trackApiError(route: string, error: Error, context?: Record<string, unknown>) {
  if (!posthogClient) return;

  try {
    posthogClient.capture({
      distinctId: 'system',
      event: 'api_error',
      properties: {
        route,
        error_message: error.message,
        error_stack: error.stack,
        ...context,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('[Analytics] Failed to track error:', err);
  }
}

/**
 * Flush PostHog events (call before serverless function ends)
 */
export async function flushAnalytics() {
  if (!posthogClient) return;

  try {
    await posthogClient.shutdown();
  } catch (error) {
    console.error('[Analytics] Failed to flush:', error);
  }
}
