/**
 * WishlistCart Browser Extension — Background Service Worker (MV3)
 * ES module format. No build step required.
 */

const DEFAULT_API_BASE = 'https://wishlistcart.com';

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getApiBase() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['apiBase'], (result) => {
      resolve(result.apiBase || DEFAULT_API_BASE);
    });
  });
}

// ── Scrape handler ────────────────────────────────────────────────────────────

async function handleScrape(url) {
  try {
    const apiBase = await getApiBase();
    const res = await fetch(`${apiBase}/api/scrape`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ url }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('[WishlistCart BG] Scrape API error:', res.status, text);
      return { error: `Scrape failed (${res.status})` };
    }

    const data = await res.json();
    return data;
  } catch (e) {
    console.error('[WishlistCart BG] Network error during scrape:', e);
    return { error: 'Network error — check your connection.' };
  }
}

// ── Message listener ──────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SCRAPE_URL') {
    handleScrape(message.url).then(sendResponse);
    return true; // Keep the message channel open for async response
  }

  if (message.type === 'OPEN_POPUP') {
    // Chrome MV3 doesn't support programmatic popup open,
    // but we handle this gracefully.
    chrome.action.openPopup().catch(() => {
      // openPopup() may not be available in all contexts — ignore silently
    });
    return false;
  }

  return false;
});

// ── Install / update handler ──────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    const apiBase = await getApiBase();
    // Open the browser extension landing page on first install
    chrome.tabs.create({ url: `${apiBase}/browser-extension` });
  }
});
