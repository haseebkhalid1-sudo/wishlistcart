/**
 * WishlistCart Browser Extension — Content Script
 * Injected into all pages at document_idle.
 * Uses scoped "wlc-" class prefixes to avoid CSS conflicts.
 */

(function () {
  'use strict';

  // Bail if already injected (e.g. on navigation in SPAs)
  if (window.__wlcInjected) return;
  window.__wlcInjected = true;

  // ── Product page detection ────────────────────────────────────────────────

  function looksLikeProductPage() {
    const url = window.location.href;

    // Skip internal browser pages, search engines, social, etc.
    const skipPatterns = [
      /^chrome(-extension)?:\/\//,
      /^about:/,
      /^file:/,
      /google\.com\/search/,
      /bing\.com\/search/,
      /duckduckgo\.com/,
      /wishlistcart\.com/,
      /twitter\.com|x\.com/,
      /facebook\.com/,
      /instagram\.com/,
      /reddit\.com/,
      /youtube\.com/,
      /linkedin\.com/,
      /github\.com/,
      /wikipedia\.org/,
    ];

    if (skipPatterns.some((p) => p.test(url))) return false;

    // URL signals: product-like paths
    const urlSignals = [
      /\/product\//i,
      /\/products\//i,
      /\/item\//i,
      /\/items\//i,
      /\/dp\//i,          // Amazon
      /\/gp\/product\//i, // Amazon
      /\/p\//i,
      /\/pd\//i,
      /\/shop\//i,
      /[?&]product_id=/i,
      /[?&]item_id=/i,
      /\/buy\//i,
      /\/detail\//i,
    ];

    const hasUrlSignal = urlSignals.some((p) => p.test(url));

    // DOM signals: look for price elements and add-to-cart buttons
    const priceSelectors = [
      '[itemprop="price"]',
      '[class*="price"]',
      '[id*="price"]',
      '[data-testid*="price"]',
      '[class*="Price"]',
      '.product-price',
      '#price',
    ];

    const cartSelectors = [
      '[id*="add-to-cart"]',
      '[class*="add-to-cart"]',
      '[class*="addToCart"]',
      '[data-testid*="add-to-cart"]',
      'button[class*="cart"]',
      'button[class*="Cart"]',
      '[aria-label*="Add to cart"]',
      '[aria-label*="add to cart"]',
      '[class*="buy-now"]',
      '[class*="buyNow"]',
    ];

    const hasPriceEl = priceSelectors.some((s) => document.querySelector(s));
    const hasCartBtn = cartSelectors.some((s) => document.querySelector(s));

    // Require URL signal OR (price + cart button)
    return hasUrlSignal || (hasPriceEl && hasCartBtn);
  }

  // ── Inject styles ─────────────────────────────────────────────────────────

  function injectStyles() {
    const style = document.createElement('style');
    style.id = 'wlc-styles';
    style.textContent = `
      .wlc-btn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        background: #0F0F0F;
        color: #FFFFFF;
        border: none;
        border-radius: 22px;
        cursor: pointer;
        font-family: Georgia, serif;
        font-size: 18px;
        font-weight: 700;
        box-shadow: 0 2px 12px rgba(0,0,0,0.18), 0 1px 4px rgba(0,0,0,0.12);
        transition: width 0.2s ease, border-radius 0.2s ease, padding 0.2s ease, opacity 0.15s ease;
        overflow: hidden;
        white-space: nowrap;
        padding: 0;
        outline: none;
        -webkit-font-smoothing: antialiased;
      }

      .wlc-btn:hover {
        width: auto;
        padding: 0 16px;
        border-radius: 22px;
        opacity: 0.95;
      }

      .wlc-btn:active {
        transform: scale(0.97);
      }

      .wlc-btn:focus-visible {
        outline: 2px solid #0F0F0F;
        outline-offset: 2px;
      }

      .wlc-btn-text {
        display: none;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: -0.2px;
        margin-left: 8px;
      }

      .wlc-btn:hover .wlc-btn-text {
        display: inline;
      }

      .wlc-btn:hover .wlc-btn-letter {
        font-size: 16px;
      }

      .wlc-btn-letter {
        transition: font-size 0.2s ease;
        flex-shrink: 0;
      }

      .wlc-toast {
        position: fixed;
        bottom: 74px;
        right: 20px;
        z-index: 999999;
        background: #0F0F0F;
        color: #FFFFFF;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 13px;
        font-weight: 500;
        padding: 8px 14px;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.18);
        pointer-events: none;
        opacity: 0;
        transform: translateY(6px);
        transition: opacity 0.2s ease, transform 0.2s ease;
        white-space: nowrap;
        max-width: 240px;
      }

      .wlc-toast.wlc-toast-visible {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);
  }

  // ── Create the floating button ────────────────────────────────────────────

  function createButton() {
    const btn = document.createElement('button');
    btn.id = 'wlc-save-btn';
    btn.className = 'wlc-btn';
    btn.setAttribute('aria-label', 'Save to WishlistCart');
    btn.setAttribute('title', 'Save to WishlistCart');

    btn.innerHTML = `
      <span class="wlc-btn-letter">W</span>
      <span class="wlc-btn-text">Save to WishlistCart</span>
    `;

    btn.addEventListener('click', handleButtonClick);
    document.body.appendChild(btn);
    return btn;
  }

  // ── Toast notification ────────────────────────────────────────────────────

  let toastEl = null;
  let toastTimer = null;

  function showToast(message) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'wlc-toast';
      document.body.appendChild(toastEl);
    }

    if (toastTimer) clearTimeout(toastTimer);

    toastEl.textContent = message;
    // Force reflow before adding class
    toastEl.offsetHeight; // eslint-disable-line no-unused-expressions
    toastEl.classList.add('wlc-toast-visible');

    toastTimer = setTimeout(() => {
      toastEl.classList.remove('wlc-toast-visible');
    }, 2500);
  }

  // ── Button click handler ──────────────────────────────────────────────────

  function handleButtonClick() {
    // Send message to background to open the popup
    // Note: chrome.action.openPopup() only works from the background in MV3.
    // As a content script, we send a message to background.
    chrome.runtime.sendMessage({ type: 'OPEN_POPUP' }, (response) => {
      // If we can't open popup programmatically (which is common),
      // show a helpful tooltip directing user to the toolbar icon.
      if (chrome.runtime.lastError || !response) {
        showToast('Click the WishlistCart icon in your toolbar to save this product.');
      }
    });
  }

  // ── Init ──────────────────────────────────────────────────────────────────

  function init() {
    if (!looksLikeProductPage()) return;
    if (document.getElementById('wlc-save-btn')) return; // Already exists

    injectStyles();
    createButton();
  }

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // For SPAs: also watch for URL changes
  let lastUrl = window.location.href;
  const observer = new MutationObserver(() => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      // Remove existing button if any
      const existing = document.getElementById('wlc-save-btn');
      if (existing) existing.remove();
      // Re-evaluate after a brief delay (let SPA render)
      setTimeout(init, 800);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
