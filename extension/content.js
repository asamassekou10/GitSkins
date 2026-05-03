const GITSKINS_BASE_URL = 'https://gitskins.com';
const BAR_ID = 'gitskins-action-bar';

function getProfileUsername() {
  const path = window.location.pathname.split('/').filter(Boolean);
  if (path.length !== 1) return null;

  const username = path[0];
  const blocked = new Set([
    'about',
    'apps',
    'blog',
    'collections',
    'contact',
    'customer-stories',
    'dashboard',
    'enterprise',
    'events',
    'explore',
    'features',
    'gist',
    'github',
    'integrations',
    'login',
    'marketplace',
    'new',
    'notifications',
    'organizations',
    'pricing',
    'pulls',
    'search',
    'settings',
    'signup',
    'sponsors',
    'topics',
    'trending',
  ]);

  if (blocked.has(username.toLowerCase())) return null;
  if (!/^[a-zA-Z0-9-]{1,39}$/.test(username)) return null;
  return username;
}

function markdownFor(username, theme = 'studio') {
  return `![GitSkins Card](${GITSKINS_BASE_URL}/api/premium-card?username=${encodeURIComponent(username)}&theme=${theme}&variant=persona&avatar=persona)`;
}

async function copyText(value) {
  await navigator.clipboard.writeText(value);
  showToast('Copied to clipboard');
}

function showToast(message) {
  const existing = document.querySelector('.gitskins-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'gitskins-toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  window.setTimeout(() => toast.remove(), 1800);
}

function createLink(label, href, primary = false) {
  const link = document.createElement('a');
  link.textContent = label;
  link.href = href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  if (primary) link.className = 'gitskins-action-bar__primary';
  return link;
}

function injectActionBar() {
  const username = getProfileUsername();
  const existing = document.getElementById(BAR_ID);

  if (!username) {
    if (existing) existing.remove();
    return;
  }

  if (existing?.dataset.username === username) return;
  if (existing) existing.remove();

  const sidebar = document.querySelector('.js-profile-editable-area') || document.querySelector('[data-view-component="true"].Layout-sidebar');
  if (!sidebar) return;

  const bar = document.createElement('div');
  bar.id = BAR_ID;
  bar.className = 'gitskins-action-bar';
  bar.dataset.username = username;

  const brand = document.createElement('div');
  brand.className = 'gitskins-action-bar__brand';
  brand.innerHTML = '<span class="gitskins-action-bar__mark">G</span><span>GitSkins</span>';

  const copyButton = document.createElement('button');
  copyButton.type = 'button';
  copyButton.textContent = 'Copy card';
  copyButton.addEventListener('click', () => copyText(markdownFor(username)));

  bar.append(
    brand,
    createLink('Open skin', `${GITSKINS_BASE_URL}/showcase/${encodeURIComponent(username)}?skin=studio`, true),
    createLink('Generate README', `${GITSKINS_BASE_URL}/readme-generator?username=${encodeURIComponent(username)}`),
    createLink('Avatar', `${GITSKINS_BASE_URL}/avatar?username=${encodeURIComponent(username)}`),
    copyButton
  );

  sidebar.prepend(bar);
}

injectActionBar();

let lastUrl = window.location.href;
const observer = new MutationObserver(() => {
  if (lastUrl !== window.location.href) {
    lastUrl = window.location.href;
    window.setTimeout(injectActionBar, 350);
  }
});

observer.observe(document.documentElement, { childList: true, subtree: true });
