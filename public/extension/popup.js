/**
 * WishlistCart Browser Extension — Popup Script
 * Plain JS, no TypeScript, no bundler required.
 */

// ── Config ───────────────────────────────────────────────────────────────────

const DEFAULT_API_BASE = 'https://wishlistcart.com';

async function getApiBase() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['apiBase'], (result) => {
      resolve(result.apiBase || DEFAULT_API_BASE);
    });
  });
}

// ── State ────────────────────────────────────────────────────────────────────

let apiBase = DEFAULT_API_BASE;
let currentTabUrl = '';
let currentTabTitle = '';
let scrapedData = null;

// ── DOM helpers ──────────────────────────────────────────────────────────────

function show(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('hidden');
}

function hide(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('hidden');
}

function showState(state) {
  hide('stateLoading');
  hide('stateAuth');
  hide('stateForm');
  show(state);
}

function showMessage(text, type = 'error') {
  const el = document.getElementById('messageArea');
  if (!el) return;
  el.textContent = text;
  el.className = `message message-${type}`;
  el.classList.remove('hidden');
}

function hideMessage() {
  const el = document.getElementById('messageArea');
  if (el) el.classList.add('hidden');
}

// ── Auth check ───────────────────────────────────────────────────────────────

async function checkAuth() {
  try {
    const res = await fetch(`${apiBase}/api/extension/auth`, {
      credentials: 'include',
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      if (data.authenticated) {
        await onAuthenticated();
        return;
      }
    }
  } catch (e) {
    // Network error — fall through to not-auth state
    console.error('[WishlistCart] Auth check failed:', e);
  }

  showState('stateAuth');
}

async function onAuthenticated() {
  showState('stateForm');
  // Load in parallel
  await Promise.all([loadWishlists(), scrapeCurrentTab()]);
}

// ── Load wishlists ────────────────────────────────────────────────────────────

async function loadWishlists() {
  const select = document.getElementById('wishlistSelect');
  if (!select) return;

  try {
    const res = await fetch(`${apiBase}/api/extension/wishlists`, {
      credentials: 'include',
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to load wishlists');

    const data = await res.json();
    const wishlists = data.wishlists || [];

    select.innerHTML = '';

    if (wishlists.length === 0) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'No wishlists found';
      select.appendChild(opt);
      document.getElementById('noWishlistsHint').style.display = 'block';
      return;
    }

    // Restore last used wishlist
    const lastWishlistId = await getLastWishlistId();

    wishlists.forEach((wl) => {
      const opt = document.createElement('option');
      opt.value = wl.id;
      opt.textContent = wl.name;
      if (wl.id === lastWishlistId) opt.selected = true;
      select.appendChild(opt);
    });

    // If nothing matched, select first
    if (!select.value && wishlists.length > 0) {
      select.value = wishlists[0].id;
    }
  } catch (e) {
    console.error('[WishlistCart] Failed to load wishlists:', e);
    select.innerHTML = '<option value="">Failed to load — retry</option>';
  }
}

async function getLastWishlistId() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['lastWishlistId'], (result) => {
      resolve(result.lastWishlistId || null);
    });
  });
}

async function saveLastWishlistId(id) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ lastWishlistId: id }, resolve);
  });
}

// ── Scrape current tab ────────────────────────────────────────────────────────

async function scrapeCurrentTab() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.url) return;

    currentTabUrl = tab.url;
    currentTabTitle = tab.title || '';

    // If on wishlistcart.com itself, skip scraping — show manual form
    if (isWishlistCartUrl(currentTabUrl)) {
      show('productCard');
      const titleInput = document.getElementById('itemTitle');
      if (titleInput) titleInput.value = '';
      return;
    }

    // Show scraping indicator
    show('scrapingRow');

    // Pre-fill title from tab as fallback
    const titleInput = document.getElementById('itemTitle');
    if (titleInput && currentTabTitle) {
      titleInput.value = currentTabTitle.replace(/\s*[-|–]\s*.*$/, '').trim();
    }

    // Show domain
    try {
      const domain = new URL(currentTabUrl).hostname.replace(/^www\./, '');
      const domainEl = document.getElementById('productDomain');
      if (domainEl) domainEl.textContent = domain;
    } catch (_) {}

    // Request scrape from background
    const response = await chrome.runtime.sendMessage({
      type: 'SCRAPE_URL',
      url: currentTabUrl,
    });

    hide('scrapingRow');

    if (response && !response.error) {
      populateProductPreview(response);
    } else {
      // Scrape failed — show manual form with tab title pre-filled
      show('productCard');
      hide('productImage');
      show('productImagePlaceholder');
    }
  } catch (e) {
    console.error('[WishlistCart] Scrape error:', e);
    hide('scrapingRow');
    show('productCard');
  }
}

function isWishlistCartUrl(url) {
  try {
    const u = new URL(url);
    return u.hostname === 'wishlistcart.com' || u.hostname === 'localhost';
  } catch (_) {
    return false;
  }
}

function populateProductPreview(data) {
  scrapedData = data;

  show('productCard');

  // Title
  const titleInput = document.getElementById('itemTitle');
  if (titleInput && data.title) {
    titleInput.value = data.title;
  }

  const titleEl = document.getElementById('productTitle');
  if (titleEl) titleEl.textContent = data.title || currentTabTitle || 'Untitled product';

  // Price
  const priceEl = document.getElementById('productPrice');
  const priceInput = document.getElementById('itemPrice');
  if (data.price) {
    if (priceEl) priceEl.textContent = data.price;
    if (priceInput) priceInput.value = data.price.replace(/[^0-9.]/g, '');
  }

  // Image
  const imgEl = document.getElementById('productImage');
  const placeholder = document.getElementById('productImagePlaceholder');
  if (data.imageUrl && imgEl) {
    imgEl.src = data.imageUrl;
    imgEl.onload = () => {
      show('productImage');
      hide('productImagePlaceholder');
    };
    imgEl.onerror = () => {
      hide('productImage');
      show('productImagePlaceholder');
    };
  } else {
    hide('productImage');
    show('productImagePlaceholder');
  }

  // Domain
  try {
    const domain = new URL(data.url || currentTabUrl).hostname.replace(/^www\./, '');
    const domainEl = document.getElementById('productDomain');
    if (domainEl) domainEl.textContent = domain;
  } catch (_) {}
}

// ── Form submission ───────────────────────────────────────────────────────────

async function handleAddItem() {
  hideMessage();

  const wishlistId = document.getElementById('wishlistSelect')?.value;
  const title = document.getElementById('itemTitle')?.value?.trim();
  const priceRaw = document.getElementById('itemPrice')?.value?.trim();
  const quantity = parseInt(document.getElementById('itemQuantity')?.value || '1', 10);
  const priorityEl = document.querySelector('input[name="priority"]:checked');
  const priority = priorityEl?.value || 'MEDIUM';
  const notes = document.getElementById('itemNotes')?.value?.trim();

  // Validation
  if (!wishlistId) {
    showMessage('Please select a wishlist.');
    return;
  }
  if (!title) {
    showMessage('Please enter a product name.');
    return;
  }

  const addBtn = document.getElementById('addBtn');
  if (addBtn) {
    addBtn.disabled = true;
    addBtn.textContent = 'Adding…';
  }

  try {
    const payload = {
      wishlistId,
      title,
      url: scrapedData?.url || currentTabUrl || '',
      imageUrl: scrapedData?.imageUrl || null,
      price: priceRaw ? parseFloat(priceRaw) || null : null,
      currency: scrapedData?.currency || 'USD',
      notes: notes || null,
      quantity: Math.max(1, Math.min(99, quantity || 1)),
      priority,
    };

    const res = await fetch(`${apiBase}/api/extension/add-item`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `Server error (${res.status})`);
    }

    // Save last used wishlist
    await saveLastWishlistId(wishlistId);

    showMessage('Added to your wishlist!', 'success');

    // Disable form
    if (addBtn) addBtn.disabled = true;

    // Close popup after 1.5s
    setTimeout(() => window.close(), 1500);
  } catch (e) {
    console.error('[WishlistCart] Add item error:', e);
    showMessage(e.message || 'Something went wrong. Please try again.');
    if (addBtn) {
      addBtn.disabled = false;
      addBtn.textContent = 'Add to Wishlist';
    }
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
  // Resolve API base (allows dev override)
  apiBase = await getApiBase();

  // Wire up submit button
  const addBtn = document.getElementById('addBtn');
  if (addBtn) addBtn.addEventListener('click', handleAddItem);

  // Wire up Enter key on inputs (except textarea)
  document.querySelectorAll('input[type="text"], input[type="number"], select').forEach((el) => {
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleAddItem();
    });
  });

  // Start auth check
  await checkAuth();
});
