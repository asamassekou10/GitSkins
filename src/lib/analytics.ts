/**
 * Analytics and Event Tracking Utilities
 *
 * Edge-compatible server-side event tracking for API routes
 * Uses fetch API instead of posthog-node for Edge Runtime compatibility
 * 
 * Tracks:
 * - Card generation events (all types)
 * - Theme selection
 * - Showcase page views
 * - Markdown copies
 * - API usage patterns
 * - Error rates
 * - Performance metrics
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

export interface ThemeSelectionEvent {
  theme: string;
  username?: string;
  source: 'landing' | 'showcase' | 'api';
}

export interface ShowcaseViewEvent {
  username: string;
  theme?: string;
  referrer?: string;
}

export interface MarkdownCopyEvent {
  widgetType: string;
  theme: string;
  username: string;
  source: 'landing' | 'showcase';
}

export interface ApiUsageEvent {
  endpoint: string;
  username?: string;
  theme?: string;
  userAgent?: string;
  ip?: string;
  duration: number;
  success: boolean;
}

/**
 * Track card generation event using fetch API (Edge-compatible)
 */
export async function trackCardGeneration(event: CardGenerationEvent) {
  if (!POSTHOG_API_KEY) return;

  try {
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
 * Track theme selection event
 */
export async function trackThemeSelection(event: ThemeSelectionEvent) {
  if (!POSTHOG_API_KEY) return;

  try {
    await fetch(`${POSTHOG_HOST}/capture/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: POSTHOG_API_KEY,
        event: 'theme_selected',
        properties: {
          distinct_id: event.username || 'anonymous',
          theme: event.theme,
          source: event.source,
          timestamp: new Date().toISOString(),
        },
      }),
    }).catch(() => {});
  } catch (error) {
    console.error('[Analytics] Failed to track theme selection:', error);
  }
}

/**
 * Track showcase page view
 */
export async function trackShowcaseView(event: ShowcaseViewEvent) {
  if (!POSTHOG_API_KEY) return;

  try {
    await fetch(`${POSTHOG_HOST}/capture/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: POSTHOG_API_KEY,
        event: 'showcase_viewed',
        properties: {
          distinct_id: event.username,
          username: event.username,
          theme: event.theme,
          referrer: event.referrer,
          timestamp: new Date().toISOString(),
        },
      }),
    }).catch(() => {});
  } catch (error) {
    console.error('[Analytics] Failed to track showcase view:', error);
  }
}

/**
 * Track markdown copy event
 */
export async function trackMarkdownCopy(event: MarkdownCopyEvent) {
  if (!POSTHOG_API_KEY) return;

  try {
    await fetch(`${POSTHOG_HOST}/capture/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: POSTHOG_API_KEY,
        event: 'markdown_copied',
        properties: {
          distinct_id: event.username,
          widget_type: event.widgetType,
          theme: event.theme,
          username: event.username,
          source: event.source,
          timestamp: new Date().toISOString(),
        },
      }),
    }).catch(() => {});
  } catch (error) {
    console.error('[Analytics] Failed to track markdown copy:', error);
  }
}

/**
 * Track API usage for analytics dashboard
 */
export async function trackApiUsage(event: ApiUsageEvent) {
  if (!POSTHOG_API_KEY) return;

  try {
    await fetch(`${POSTHOG_HOST}/capture/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: POSTHOG_API_KEY,
        event: 'api_usage',
        properties: {
          distinct_id: event.username || 'anonymous',
          endpoint: event.endpoint,
          username: event.username,
          theme: event.theme,
          duration_ms: event.duration,
          success: event.success,
          user_agent: event.userAgent,
          timestamp: new Date().toISOString(),
        },
      }),
    }).catch(() => {});
  } catch (error) {
    console.error('[Analytics] Failed to track API usage:', error);
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

/**
 * Track conversion funnel events
 */
export async function trackConversion(event: {
  step: 'landing_view' | 'theme_selected' | 'card_generated' | 'markdown_copied' | 'showcase_viewed';
  username?: string;
  metadata?: Record<string, unknown>;
}) {
  if (!POSTHOG_API_KEY) return;

  try {
    await fetch(`${POSTHOG_HOST}/capture/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: POSTHOG_API_KEY,
        event: 'conversion_funnel',
        properties: {
          distinct_id: event.username || 'anonymous',
          step: event.step,
          ...event.metadata,
          timestamp: new Date().toISOString(),
        },
      }),
    }).catch(() => {});
  } catch (error) {
    console.error('[Analytics] Failed to track conversion:', error);
  }
}
