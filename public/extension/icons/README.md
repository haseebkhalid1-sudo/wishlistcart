# Extension Icons

Chrome extensions require PNG icons. Generate them from `icon.svg` before loading the extension.

## Required files

| File | Size |
|------|------|
| `icon16.png` | 16×16 px |
| `icon48.png` | 48×48 px |
| `icon128.png` | 128×128 px |

## How to generate PNGs

### Option 1 — Inkscape (CLI)
```bash
inkscape icon.svg --export-type=png --export-filename=icon16.png  -w 16  -h 16
inkscape icon.svg --export-type=png --export-filename=icon48.png  -w 48  -h 48
inkscape icon.svg --export-type=png --export-filename=icon128.png -w 128 -h 128
```

### Option 2 — ImageMagick
```bash
convert -background none icon.svg -resize 16x16   icon16.png
convert -background none icon.svg -resize 48x48   icon48.png
convert -background none icon.svg -resize 128x128 icon128.png
```

### Option 3 — Sharp (Node.js)
```js
const sharp = require('sharp');
for (const size of [16, 48, 128]) {
  sharp('icon.svg').resize(size, size).png().toFile(`icon${size}.png`);
}
```

### Option 4 — Online
Use https://svgtopng.com or https://cloudconvert.com/svg-to-png and export at 16, 48, and 128 px.

## Placeholder (for quick dev testing)
If you just want to load the extension without icons temporarily, you can use any 16×16, 48×48, and 128×128 PNG files renamed appropriately. The extension will still function — only the toolbar icon appearance is affected.
