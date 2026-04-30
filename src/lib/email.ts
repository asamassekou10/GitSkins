/**
 * Email notifications via Resend.
 * No-ops gracefully when RESEND_API_KEY is not set.
 */

function resendAvailable(): boolean {
  return !!process.env.RESEND_API_KEY;
}

async function send(payload: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  if (!resendAvailable()) return;

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'GitSkins <noreply@gitskins.com>',
      replyTo: 'gitskinspro@gmail.com',
      ...payload,
    });
  } catch (err) {
    console.error('[email] send failed:', err);
  }
}

export async function sendWelcomeEmail(to: string, username: string): Promise<void> {
  await send({
    to,
    subject: 'Welcome to GitSkins!',
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;background:#050505;color:#fafafa">
        <h1 style="font-size:28px;font-weight:700;margin:0 0 8px">Welcome to GitSkins, ${username}!</h1>
        <p style="color:#888;margin:0 0 24px">Your GitHub profile just levelled up.</p>

        <p style="line-height:1.7;color:#ccc">
          You now have access to beautiful stat widgets, AI-powered README generation,
          GitHub Wrapped, the Repo Visualizer, and more — all for free.
        </p>

        <a href="https://gitskins.com/dashboard"
           style="display:inline-block;margin:24px 0;padding:12px 24px;background:#22c55e;color:#000;font-weight:700;border-radius:10px;text-decoration:none">
          Go to Dashboard
        </a>

        <p style="font-size:13px;color:#555;margin-top:32px">
          Need help? Reply to this email or visit
          <a href="https://gitskins.com/support" style="color:#22c55e">gitskins.com/support</a>.
        </p>
      </div>
    `,
  });
}

export async function sendPaymentConfirmationEmail(
  to: string,
  username: string,
  plan: 'monthly' | 'lifetime'
): Promise<void> {
  const planLabel = plan === 'lifetime' ? 'Pro Lifetime' : 'Pro Monthly';
  const detail =
    plan === 'lifetime'
      ? 'You have lifetime access — no recurring charges, ever.'
      : 'Your subscription renews monthly. Cancel anytime from the dashboard.';

  await send({
    to,
    subject: `You're now on GitSkins ${planLabel}!`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;background:#050505;color:#fafafa">
        <div style="display:inline-flex;align-items:center;gap:8px;padding:8px 16px;background:rgba(34,197,94,0.12);border:1px solid rgba(34,197,94,0.4);border-radius:100px;color:#22c55e;font-size:13px;font-weight:600;margin-bottom:24px">
          ✓ Payment confirmed
        </div>
        <h1 style="font-size:28px;font-weight:700;margin:0 0 8px">You're on ${planLabel}, ${username}!</h1>
        <p style="color:#888;margin:0 0 24px">${detail}</p>

        <p style="line-height:1.7;color:#ccc">
          You now have unlimited README generations, all 20 premium themes,
          watermark-free widgets, and priority rendering.
        </p>

        <a href="https://gitskins.com/dashboard"
           style="display:inline-block;margin:24px 0;padding:12px 24px;background:#22c55e;color:#000;font-weight:700;border-radius:10px;text-decoration:none">
          Go to Dashboard
        </a>

        <p style="font-size:13px;color:#555;margin-top:32px">
          Manage your subscription at any time from
          <a href="https://gitskins.com/dashboard" style="color:#22c55e">Dashboard → Manage Subscription</a>.
        </p>
      </div>
    `,
  });
}
