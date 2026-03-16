(function () {
  'use strict';

  // === CONFIG ===
  const scriptTag = document.currentScript;
  const userConfig = window.WishlistCartWidget || {};
  const apiKey = userConfig.apiKey || scriptTag?.getAttribute('data-key') || '';
  const position = userConfig.position || 'bottom-right';
  const primaryColor = userConfig.primaryColor || '#0F0F0F';
  const buttonText = userConfig.buttonText || 'Save to Wishlist';
  const BASE_URL = 'https://wishlistcart.com';
  const PREFIX = 'wlc';

  if (!apiKey) {
    console.warn('[WishlistCart] Missing API key. Add data-key to the script tag.');
    return;
  }

  // === STATE ===
  let wishlists = [];
  let isOpen = false;
  let isSaving = false;

  // === STYLES ===
  // Inject scoped CSS (all classes prefixed with wlc-)
  const css = `
    .${PREFIX}-btn {
      position: fixed;
      ${position === 'bottom-left' ? 'left: 20px;' : 'right: 20px;'}
      bottom: 20px;
      z-index: 2147483647;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 16px;
      height: 44px;
      background: ${primaryColor};
      color: white;
      border: none;
      border-radius: 22px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: transform 150ms ease, box-shadow 150ms ease;
      white-space: nowrap;
    }
    .${PREFIX}-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.2);
    }
    .${PREFIX}-btn:active { transform: translateY(0); }
    .${PREFIX}-btn svg { width: 16px; height: 16px; flex-shrink: 0; }

    .${PREFIX}-popover {
      position: fixed;
      ${position === 'bottom-left' ? 'left: 20px;' : 'right: 20px;'}
      bottom: 76px;
      z-index: 2147483646;
      width: 300px;
      background: #fff;
      border: 1px solid #E4E4E0;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      overflow: hidden;
    }
    .${PREFIX}-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid #E4E4E0;
    }
    .${PREFIX}-title {
      font-size: 14px;
      font-weight: 600;
      color: #0F0F0F;
    }
    .${PREFIX}-close {
      background: none;
      border: none;
      cursor: pointer;
      color: #8A8A8A;
      font-size: 18px;
      line-height: 1;
      padding: 2px;
    }
    .${PREFIX}-body { padding: 12px 16px; }
    .${PREFIX}-label {
      display: block;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #8A8A8A;
      margin-bottom: 4px;
    }
    .${PREFIX}-page-info {
      font-size: 13px;
      color: #0F0F0F;
      font-weight: 500;
      margin-bottom: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .${PREFIX}-select {
      width: 100%;
      padding: 8px 10px;
      border: 1px solid #E4E4E0;
      border-radius: 6px;
      font-size: 13px;
      background: #F8F8F7;
      color: #0F0F0F;
      margin-bottom: 10px;
      appearance: none;
      outline: none;
      cursor: pointer;
    }
    .${PREFIX}-select:focus { border-color: #0F0F0F; }
    .${PREFIX}-save-btn {
      width: 100%;
      padding: 9px 0;
      background: ${primaryColor};
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 150ms;
    }
    .${PREFIX}-save-btn:hover { opacity: 0.88; }
    .${PREFIX}-save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .${PREFIX}-success {
      text-align: center;
      padding: 8px 0 4px;
      font-size: 13px;
      color: #1A7A4A;
      font-weight: 500;
    }
    .${PREFIX}-error {
      text-align: center;
      padding: 4px 0;
      font-size: 12px;
      color: #C0392B;
    }
    .${PREFIX}-signin {
      text-align: center;
      padding: 16px;
      font-size: 13px;
      color: #8A8A8A;
    }
    .${PREFIX}-signin a {
      color: #0F0F0F;
      text-decoration: underline;
      font-weight: 500;
    }
    .${PREFIX}-loading {
      text-align: center;
      padding: 16px;
      font-size: 13px;
      color: #8A8A8A;
    }
  `;

  function injectStyles() {
    const style = document.createElement('style');
    style.id = `${PREFIX}-styles`;
    style.textContent = css;
    document.head.appendChild(style);
  }

  // === DOM CREATION ===
  function createButton() {
    const btn = document.createElement('button');
    btn.className = `${PREFIX}-btn`;
    btn.setAttribute('aria-label', buttonText);
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      <span>${buttonText}</span>
    `;
    btn.addEventListener('click', togglePopover);
    return btn;
  }

  function createPopover() {
    const pop = document.createElement('div');
    pop.className = `${PREFIX}-popover`;
    pop.style.display = 'none';
    pop.innerHTML = `
      <div class="${PREFIX}-header">
        <span class="${PREFIX}-title">Save to WishlistCart</span>
        <button class="${PREFIX}-close" aria-label="Close">&#215;</button>
      </div>
      <div class="${PREFIX}-body" id="${PREFIX}-body-content">
        <div class="${PREFIX}-loading">Loading wishlists&#8230;</div>
      </div>
    `;
    pop.querySelector(`.${PREFIX}-close`).addEventListener('click', closePopover);
    return pop;
  }

  // === POPOVER CONTENT ===
  function renderPopoverContent() {
    const body = document.getElementById(`${PREFIX}-body-content`);
    if (!body) return;

    const pageTitle = document.title.slice(0, 60);
    const pageUrl = window.location.href;

    if (!wishlists.length) {
      body.innerHTML = `
        <div class="${PREFIX}-signin">
          No public wishlists found.<br>
          <a href="${BASE_URL}/dashboard/wishlists" target="_blank">Create a wishlist &#8594;</a>
        </div>
      `;
      return;
    }

    const options = wishlists.map(function (w) {
      return `<option value="${w.id}">${w.name} (${w._count ? w._count.items || 0 : 0} items)</option>`;
    }).join('');

    body.innerHTML = `
      <span class="${PREFIX}-label">Adding from</span>
      <div class="${PREFIX}-page-info" title="${pageTitle}">${pageTitle}</div>
      <span class="${PREFIX}-label">Save to</span>
      <select class="${PREFIX}-select" id="${PREFIX}-wishlist-select">${options}</select>
      <button class="${PREFIX}-save-btn" id="${PREFIX}-save-btn">Save to Wishlist</button>
      <div id="${PREFIX}-feedback"></div>
    `;

    document.getElementById(`${PREFIX}-save-btn`).addEventListener('click', function () {
      var select = document.getElementById(`${PREFIX}-wishlist-select`);
      var wishlistId = select ? select.value : null;
      if (!wishlistId || isSaving) return;

      isSaving = true;
      var saveBtn = document.getElementById(`${PREFIX}-save-btn`);
      var feedback = document.getElementById(`${PREFIX}-feedback`);
      if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Saving\u2026'; }

      fetch(`${BASE_URL}/api/widget/${apiKey}/add-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wishlistId: wishlistId,
          title: pageTitle || 'Product',
          url: pageUrl,
        }),
      })
        .then(function (res) {
          return res.json().then(function (data) {
            return { ok: res.ok, data: data };
          });
        })
        .then(function (result) {
          if (result.ok && result.data.success) {
            if (feedback) feedback.innerHTML = `<div class="${PREFIX}-success">&#10003; Saved to wishlist!</div>`;
            if (saveBtn) { saveBtn.textContent = 'Saved!'; }
            setTimeout(closePopover, 1500);
          } else {
            throw new Error(result.data.error || 'Failed to save');
          }
        })
        .catch(function (err) {
          if (feedback) feedback.innerHTML = `<div class="${PREFIX}-error">${err && err.message ? err.message : 'Failed to save'}</div>`;
          if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Try again'; }
        })
        .finally(function () {
          isSaving = false;
        });
    });
  }

  // === WISHLIST LOADING ===
  function loadWishlists() {
    return fetch(`${BASE_URL}/api/widget/${apiKey}/wishlists`)
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load');
        return res.json();
      })
      .then(function (data) {
        wishlists = data.wishlists || [];
      })
      .catch(function () {
        wishlists = [];
      });
  }

  // === TOGGLE ===
  function togglePopover() {
    if (isOpen) {
      closePopover();
    } else {
      openPopover();
    }
  }

  function openPopover() {
    var pop = document.getElementById(`${PREFIX}-popover`);
    if (pop) {
      pop.style.display = 'block';
      isOpen = true;
      renderPopoverContent();
    }
  }

  function closePopover() {
    var pop = document.getElementById(`${PREFIX}-popover`);
    if (pop) {
      pop.style.display = 'none';
      isOpen = false;
      isSaving = false;
    }
  }

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!isOpen) return;
    var btn = document.getElementById(`${PREFIX}-trigger`);
    var pop = document.getElementById(`${PREFIX}-popover`);
    if (btn && pop && !btn.contains(e.target) && !pop.contains(e.target)) {
      closePopover();
    }
  });

  // === INIT ===
  function init() {
    injectStyles();

    var btn = createButton();
    btn.id = `${PREFIX}-trigger`;
    document.body.appendChild(btn);

    var popover = createPopover();
    popover.id = `${PREFIX}-popover`;
    document.body.appendChild(popover);

    // Load wishlists in background
    loadWishlists();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
