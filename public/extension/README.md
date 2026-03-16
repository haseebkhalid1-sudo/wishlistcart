# WishlistCart Browser Extension

Chrome Extension (Manifest V3) that lets users save products from any website to their WishlistCart wishlists without leaving the page.

## Features

- One-click save from any product page via the toolbar popup
- Auto-scrapes product title, price, and image from the current tab
- Floating "Save to WishlistCart" button appears on detected product pages
- Wishlist selector pre-populated from the user's account
- Quantity, priority, and notes fields
- Remembers the last-used wishlist

## Loading the extension in Chrome (development)

1. Generate PNG icons first — see `icons/README.md`
2. Open Chrome and navigate to `chrome://extensions`
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked**
5. Select the `public/extension/` directory from this project
6. The WishlistCart icon will appear in your Chrome toolbar

After making changes to any file, click the refresh icon on the extension card in `chrome://extensions` to reload.

## File structure

```
public/extension/
├── manifest.json       Chrome Extension manifest (MV3)
├── popup.html          Popup UI (opens on toolbar icon click)
├── popup.js            Popup logic (auth, scrape, form submit)
├── background.js       Service worker (scrape relay, install handler)
├── content.js          Content script (floating save button on product pages)
└── icons/
    ├── icon.svg        Source SVG — generate PNGs from this
    ├── icon16.png      Required — generate from SVG
    ├── icon48.png      Required — generate from SVG
    ├── icon128.png     Required — generate from SVG
    └── README.md       Icon generation instructions
```

## API endpoints required (Next.js side)

The extension calls these routes on `wishlistcart.com`:

| Method | Path | Purpose |
|--------|------|---------|
| `GET`  | `/api/extension/auth` | Check if user is logged in |
| `GET`  | `/api/extension/wishlists` | Fetch user's wishlists |
| `POST` | `/api/extension/add-item` | Add item to a wishlist |
| `POST` | `/api/scrape` | Scrape product data from URL |

All calls use `credentials: 'include'` — authentication is handled via the user's existing session cookies.

## Development with localhost

To test against a local dev server, open the extension popup in Chrome DevTools console and run:

```js
chrome.storage.local.set({ apiBase: 'http://localhost:3000' });
```

Then reload the extension popup. Clear it to revert to production:

```js
chrome.storage.local.remove('apiBase');
```

## Firefox support

The extension uses `chrome.*` APIs. For Firefox compatibility:

1. Replace all `chrome.*` calls with `browser.*` (Firefox uses Promises natively)
2. Or add the [`webextension-polyfill`](https://github.com/mozilla/webextension-polyfill) library and include it in the manifest `content_scripts` and popup

Firefox also requires a `browser_specific_settings` key in `manifest.json`:

```json
"browser_specific_settings": {
  "gecko": {
    "id": "extension@wishlistcart.com",
    "strict_min_version": "109.0"
  }
}
```

## Publishing to Chrome Web Store

1. Generate production-quality PNG icons (128px minimum for store listing)
2. Prepare store assets: screenshots (1280×800 or 640×400), promotional tile (440×280)
3. Zip the entire `public/extension/` directory contents (not the folder itself)
4. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
5. Pay the one-time $5 developer registration fee (if not already done)
6. Click **New Item** → upload the zip
7. Fill in store listing details, set privacy policy URL, submit for review

Review typically takes 1–3 business days for new extensions.

## No build step required

All extension files are plain HTML/CSS/JS. No TypeScript compilation, no bundler, no `node_modules`. Load unpacked and go.
