const BASE_URL = 'https://gitskins.com';

const usernameInput = document.getElementById('username');
const themeSelect = document.getElementById('theme');
const statusEl = document.getElementById('status');
const messageEl = document.getElementById('message');
const openSkin = document.getElementById('open-skin');
const openReadme = document.getElementById('open-readme');
const openAvatar = document.getElementById('open-avatar');
const copyCard = document.getElementById('copy-card');
const copySkin = document.getElementById('copy-skin');

function profileUsernameFromUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== 'github.com') return null;
    const parts = parsed.pathname.split('/').filter(Boolean);
    if (parts.length !== 1) return null;
    const username = parts[0];
    if (!/^[a-zA-Z0-9-]{1,39}$/.test(username)) return null;
    return username;
  } catch {
    return null;
  }
}

function getUsername() {
  return usernameInput.value.trim().replace(/^@/, '') || 'octocat';
}

function getTheme() {
  return themeSelect.value;
}

function cardMarkdown(username, theme) {
  return `![GitSkins Card](${BASE_URL}/api/premium-card?username=${encodeURIComponent(username)}&theme=${theme}&variant=persona&avatar=persona)`;
}

function skinMarkdown(username, theme) {
  return `[![${username}'s GitSkins profile](${BASE_URL}/api/premium-card?username=${encodeURIComponent(username)}&theme=${theme}&variant=persona&avatar=persona)](${BASE_URL}/showcase/${encodeURIComponent(username)}?skin=studio)`;
}

function updateLinks() {
  const username = getUsername();
  const theme = getTheme();
  openSkin.href = `${BASE_URL}/showcase/${encodeURIComponent(username)}?skin=studio`;
  openReadme.href = `${BASE_URL}/readme-generator?username=${encodeURIComponent(username)}`;
  openAvatar.href = `${BASE_URL}/avatar?username=${encodeURIComponent(username)}&theme=${theme}`;
}

async function writeClipboard(value, message) {
  await navigator.clipboard.writeText(value);
  messageEl.textContent = message;
  window.setTimeout(() => {
    messageEl.textContent = '';
  }, 1800);
}

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const detected = tab?.url ? profileUsernameFromUrl(tab.url) : null;

  if (detected) {
    usernameInput.value = detected;
    statusEl.textContent = `Detected @${detected}`;
  } else {
    usernameInput.value = 'octocat';
    statusEl.textContent = 'Open a GitHub profile or enter a username.';
  }

  updateLinks();
}

usernameInput.addEventListener('input', updateLinks);
themeSelect.addEventListener('change', updateLinks);

copyCard.addEventListener('click', () => {
  writeClipboard(cardMarkdown(getUsername(), getTheme()), 'Card markdown copied.');
});

copySkin.addEventListener('click', () => {
  writeClipboard(skinMarkdown(getUsername(), getTheme()), 'Profile skin block copied.');
});

init();
