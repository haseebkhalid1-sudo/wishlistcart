---
name: frontend-design
description: Use when designing the visual look, UI style, landing page, or any component where aesthetics, brand identity, and design quality matter for WishlistCart.com.
license: MIT
metadata:
  source: ~/.claude/skills-main/skills/frontend-design (tailored for WishlistCart.com)
  version: "2.0.0"
  triggers: design, visual, aesthetic, landing page, hero, layout, color, typography, beautiful, polish, brand, style, UI design, theme, dark, light, minimalistic
---

# Frontend Design — WishlistCart.com

Design-forward developer creating a modern, minimalistic UI for WishlistCart.com. Clean, purposeful, and trustworthy — the aesthetic of a premium consumer product.

## Brand Aesthetic Direction: **Modern Minimalism**

Not sterile corporate. Not trendy gradient-heavy SaaS. Clean and warm white:
- **White/Ash**: Off-white and light ash surfaces — feels premium, editorial, spacious
- **Black**: Near-black for text and primary actions — sharp, confident, readable
- **Minimal Accents**: One subtle accent color only where needed — never decorative
- **Whitespace first**: Generous spacing is the primary design element

Think: "Muji meets Linear. Apple.com meets Notion."

---

## Color System

### CSS Variables (src/app/globals.css)

```css
:root {
  /* === Surfaces === */
  --color-bg:               #FFFFFF;        /* Pure white — primary background */
  --color-bg-subtle:        #F8F8F7;        /* Warm ash — cards, sidebar, raised areas */
  --color-bg-muted:         #F2F1EF;        /* Cool ash — input backgrounds, tags */
  --color-bg-overlay:       #ECEAE6;        /* Dividers, skeleton loaders */

  /* === Text === */
  --color-text:             #0F0F0F;        /* Near-black — primary text */
  --color-text-secondary:   #4A4A4A;        /* Dark gray — body, descriptions */
  --color-text-muted:       #8A8A8A;        /* Mid gray — placeholders, captions */
  --color-text-disabled:    #C0C0C0;        /* Light gray — disabled states */
  --color-text-inverse:     #FFFFFF;        /* White text on dark backgrounds */

  /* === Borders === */
  --color-border:           #E4E4E0;        /* Subtle border */
  --color-border-strong:    #C8C8C2;        /* Stronger border, focused inputs */

  /* === Actions (single accent only) === */
  --color-accent:           #0F0F0F;        /* Black — primary buttons, links */
  --color-accent-hover:     #2A2A2A;        /* Slightly lighter on hover */
  --color-accent-subtle:    #F0F0EE;        /* Black at 4% opacity — hover backgrounds */

  /* === Semantic === */
  --color-success:          #1A7A4A;        /* Gifted / confirmed */
  --color-success-bg:       #F0FAF4;
  --color-warning:          #92600A;        /* Price alert */
  --color-warning-bg:       #FEF8EE;
  --color-error:            #C0392B;        /* Errors, destructive */
  --color-error-bg:         #FEF0EE;
  --color-sale:             #B91C1C;        /* Sale price indicator */
  --color-sale-bg:          #FEF2F2;

  /* === Shadows (very subtle — minimal design) === */
  --shadow-xs:    0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-sm:    0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md:    0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04);
  --shadow-lg:    0 8px 24px rgba(0, 0, 0, 0.10), 0 4px 8px rgba(0, 0, 0, 0.05);
  --shadow-dialog: 0 24px 64px rgba(0, 0, 0, 0.12);

  /* === Radius (consistent — pick one family) === */
  --radius-sm:   4px;    /* Tags, badges, small chips */
  --radius-md:   8px;    /* Inputs, buttons, small cards */
  --radius-lg:   12px;   /* Cards, dialogs, panels */
  --radius-xl:   16px;   /* Feature cards, large modals */
  --radius-full: 9999px; /* Pill buttons, avatars */

  /* === Spacing scale (matches Tailwind 4) === */
  /* Use Tailwind spacing utilities — documented here for reference */
  /* xs: 4px | sm: 8px | md: 16px | lg: 24px | xl: 32px | 2xl: 48px | 3xl: 64px */
}
```

### Color Usage Rules

| Token | Use For |
|-------|---------|
| `--color-bg` | Main page background, content areas |
| `--color-bg-subtle` | Card backgrounds, sidebar, raised panels |
| `--color-bg-muted` | Input fields, code blocks, tag chips |
| `--color-bg-overlay` | Skeleton loaders, dividers, disabled areas |
| `--color-text` | Headings, primary body text |
| `--color-text-secondary` | Body text, descriptions, metadata |
| `--color-text-muted` | Placeholders, helper text, captions |
| `--color-accent` | Primary buttons, active nav, links |
| `--color-border` | All borders (cards, inputs, dividers) |

---

## Typography System

### Font Stack

```tsx
// src/app/fonts.ts
import { Inter, DM_Serif_Display } from 'next/font/google'

// Headings: DM Serif Display — warm, editorial feel without being flashy
export const serif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-serif',
  display: 'swap',
})

// Body + UI: Inter — the gold standard for clean, readable UI
export const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})
```

```css
/* globals.css */
:root {
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-serif: 'DM Serif Display', Georgia, serif;
  --font-mono: 'Geist Mono', 'Fira Code', monospace;
}

body {
  font-family: var(--font-sans);
  font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11'; /* Inter optical sizing */
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
```

### Typography Scale

All sizes use `rem` based on `16px` root. Line-heights optimized per use.

#### Desktop Scale (≥ 1280px)

| Token | Size | Line Height | Weight | Font | Use |
|-------|------|-------------|--------|------|-----|
| `display-xl` | 4rem / 64px | 1.1 | 400 | Serif | Landing page hero H1 |
| `display-lg` | 3rem / 48px | 1.15 | 400 | Serif | Marketing section headings |
| `display-md` | 2.25rem / 36px | 1.2 | 400 | Serif | Page titles (dashboard) |
| `h1` | 1.875rem / 30px | 1.25 | 600 | Sans | Section titles |
| `h2` | 1.5rem / 24px | 1.3 | 600 | Sans | Card headings |
| `h3` | 1.25rem / 20px | 1.35 | 600 | Sans | Sub-headings |
| `h4` | 1.125rem / 18px | 1.4 | 600 | Sans | Small headings |
| `body-lg` | 1.125rem / 18px | 1.7 | 400 | Sans | Article body, landing page copy |
| `body` | 1rem / 16px | 1.6 | 400 | Sans | Standard body text |
| `body-sm` | 0.9375rem / 15px | 1.55 | 400 | Sans | Secondary content |
| `caption` | 0.875rem / 14px | 1.5 | 400 | Sans | Captions, helper text |
| `label` | 0.875rem / 14px | 1.4 | 500 | Sans | Form labels, table headers |
| `micro` | 0.75rem / 12px | 1.4 | 500 | Sans | Badges, tags, timestamps |
| `code` | 0.875rem / 14px | 1.6 | 400 | Mono | Code, prices, IDs |

#### Tablet Scale (768px–1279px)

| Token | Desktop | Tablet |
|-------|---------|--------|
| `display-xl` | 4rem | 3rem |
| `display-lg` | 3rem | 2.25rem |
| `display-md` | 2.25rem | 1.875rem |
| `h1` | 1.875rem | 1.5rem |
| `h2` | 1.5rem | 1.25rem |
| Body text | Unchanged | Unchanged |

#### Mobile Scale (< 768px)

| Token | Desktop | Mobile |
|-------|---------|--------|
| `display-xl` | 4rem | 2.25rem |
| `display-lg` | 3rem | 1.875rem |
| `display-md` | 2.25rem | 1.5rem |
| `h1` | 1.875rem | 1.375rem |
| `h2` | 1.5rem | 1.25rem |
| `h3` | 1.25rem | 1.125rem |
| `body-lg` | 1.125rem | 1rem |
| Body text | 1rem | 1rem |

### Tailwind Typography Config

```typescript
// tailwind.config.ts (extend)
import type { Config } from 'tailwindcss'

const config: Config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        'display-xl': ['4rem',   { lineHeight: '1.1',  fontWeight: '400' }],
        'display-lg': ['3rem',   { lineHeight: '1.15', fontWeight: '400' }],
        'display-md': ['2.25rem',{ lineHeight: '1.2',  fontWeight: '400' }],
        'body-lg':    ['1.125rem',{ lineHeight: '1.7', fontWeight: '400' }],
        'body-sm':    ['0.9375rem',{ lineHeight: '1.55', fontWeight: '400' }],
        'micro':      ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
      },
      colors: {
        bg: {
          DEFAULT: 'var(--color-bg)',
          subtle:  'var(--color-bg-subtle)',
          muted:   'var(--color-bg-muted)',
          overlay: 'var(--color-bg-overlay)',
        },
        content: {
          DEFAULT:   'var(--color-text)',
          secondary: 'var(--color-text-secondary)',
          muted:     'var(--color-text-muted)',
          disabled:  'var(--color-text-disabled)',
          inverse:   'var(--color-text-inverse)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          strong:  'var(--color-border-strong)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover:   'var(--color-accent-hover)',
          subtle:  'var(--color-accent-subtle)',
        },
      },
      boxShadow: {
        xs:     'var(--shadow-xs)',
        sm:     'var(--shadow-sm)',
        md:     'var(--shadow-md)',
        lg:     'var(--shadow-lg)',
        dialog: 'var(--shadow-dialog)',
      },
      borderRadius: {
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        xl:   'var(--radius-xl)',
      },
    },
  },
}
export default config
```

---

## Key Pages Design Guidance

### Landing Page Hero

```
Layout: Full-width, centered, generous vertical padding (160px top/bottom on desktop)
Background: --color-bg (pure white)
Headline: DM Serif Display, display-xl size, --color-text
Subhead: Inter body-lg, --color-text-secondary, max-width 540px centered
CTAs: 2 buttons — primary (black fill), secondary (outlined black)
Divider: Subtle horizontal rule --color-border below hero

Visual element: Product screenshot/mockup with --shadow-lg, border --color-border
Screenshot border-radius: 12px

Headline formula: "[Verb] anything. Share with everyone."
Example: "Save anything. Share with everyone."
```

### Item Card

```
Background: --color-bg-subtle
Border: 1px --color-border
Border-radius: 12px (--radius-lg)
Shadow: --shadow-xs (elevation on hover: --shadow-md + -translate-y-0.5)

Layout:
  Image: Aspect ratio 1:1, full-bleed top, border-radius 12px 12px 0 0
  Body: 16px padding
  Store name: micro size, --color-text-muted, uppercase tracking-wide
  Title: body weight-500, --color-text, line-clamp-2
  Price: body-lg weight-600, --color-text (NOT colored — clean black)
  Sale price: --color-sale with line-through original in --color-text-muted

Hover state:
  transition: all 200ms ease
  shadow: --shadow-md
  transform: translateY(-2px)
  Reveal action bar: "Buy now" link (--color-accent, no background, just text link)

Gifted state:
  Image: opacity-40 grayscale
  Overlay badge: "✓ Gifted" in --color-success, --color-success-bg background
```

### Dashboard Layout

```
Sidebar: 240px, --color-bg-subtle background, 1px right border --color-border
Top bar: --color-bg, 1px bottom border --color-border, height 56px
  Left: Logo (DM Serif, 18px)
  Right: User avatar (32px circle)
Content area: --color-bg, max-width 1200px, 32px horizontal padding
Wishlist grid: 3 columns desktop / 2 tablet / 1 mobile, 20px gap

Empty states:
  Centered SVG illustration (line-art style, black strokes, no color fills)
  h3 heading + body-sm description + single primary CTA
```

### Auth Pages (Login / Signup)

```
Layout: Split 50/50 on desktop, single column on mobile
Left panel: Pure white, centered form, max-width 400px
Right panel: --color-bg-subtle, can show product screenshot or illustration

Form elements:
  Inputs: 1px --color-border, --color-bg-muted background, --radius-md
  Focus ring: 2px --color-accent outline-offset-2
  Labels: label size, --color-text weight-500, 6px margin-bottom
  Buttons: full-width on mobile
```

### Public Wishlist Page

```
Header: white background, centered owner info
  Avatar: 64px circle, --shadow-sm
  Name: h2, --color-text
  Stats row: caption text, --color-text-muted (X items • Y stores • Event date)
  Share button: outlined, top-right

Items grid: Same card style as dashboard
Footer: minimal — branding "Powered by WishlistCart" + create-your-own CTA
```

---

## Component System (shadcn/ui overrides)

### Button Variants

```tsx
// src/components/ui/button.tsx — update buttonVariants
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      variant: {
        default:     'bg-[--color-accent] text-[--color-text-inverse] hover:bg-[--color-accent-hover] shadow-xs',
        secondary:   'bg-[--color-bg-muted] text-[--color-text] border border-[--color-border] hover:bg-[--color-bg-overlay]',
        outline:     'bg-transparent text-[--color-text] border border-[--color-border-strong] hover:bg-[--color-accent-subtle]',
        ghost:       'bg-transparent text-[--color-text] hover:bg-[--color-accent-subtle]',
        destructive: 'bg-[--color-error] text-white hover:opacity-90',
        link:        'bg-transparent text-[--color-accent] underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        sm:   'h-8  px-3 text-sm rounded-[--radius-sm]',
        md:   'h-10 px-4 text-sm rounded-[--radius-md]',
        lg:   'h-12 px-6 text-base rounded-[--radius-md]',
        xl:   'h-14 px-8 text-base rounded-[--radius-md]',
        icon: 'h-10 w-10 rounded-[--radius-md]',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
)
```

### Input

```tsx
// Clean, minimal input
className="h-10 w-full rounded-[--radius-md] border border-[--color-border] bg-[--color-bg-muted] px-3 py-2 text-sm text-[--color-text] placeholder:text-[--color-text-muted] focus:border-[--color-border-strong] focus:bg-[--color-bg] focus:outline-none focus:ring-2 focus:ring-[--color-accent] focus:ring-offset-0 transition-colors"
```

### Badge / Tag

```tsx
// Item priority, status badges
const badgeVariants = {
  default:  'bg-[--color-bg-muted] text-[--color-text-secondary] border border-[--color-border]',
  success:  'bg-[--color-success-bg] text-[--color-success] border border-[--color-success-bg]',
  warning:  'bg-[--color-warning-bg] text-[--color-warning]',
  error:    'bg-[--color-error-bg] text-[--color-error]',
  sale:     'bg-[--color-sale-bg] text-[--color-sale] font-semibold',
}
// All badges: text-micro px-2 py-0.5 rounded-[--radius-sm] font-medium
```

### Card

```tsx
// Base card — minimal, bordered
className="rounded-[--radius-lg] border border-[--color-border] bg-[--color-bg-subtle] shadow-xs"

// Elevated card — for hover states
className="rounded-[--radius-lg] border border-[--color-border] bg-[--color-bg] shadow-sm hover:shadow-md transition-shadow duration-200"
```

---

## Micro-Interactions

```tsx
// Standard transition on all interactive elements
'transition-all duration-150 ease-out'   // Fast actions (buttons, links)
'transition-all duration-200 ease-out'   // Hover animations (cards)
'transition-all duration-300 ease-in-out' // Dialogs, drawers

// Card hover: shadow lift
'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200'

// Button press: scale down
'active:scale-[0.97]'

// Success toast (Sonner)
toast.success('Item added!', {
  description: item.title,
  // No emoji — keep it minimal
})

// Price drop badge: pulse only when just triggered
'animate-pulse' // Only on new price alerts, remove after 5 seconds
```

---

## Responsive Breakpoints

| Name | Width | Tailwind | Notes |
|------|-------|----------|-------|
| Mobile | 375px | default | Minimum support target |
| Mobile-lg | 480px | `xs:` | Larger phones |
| Tablet | 768px | `md:` | iPad, 2-column content |
| Desktop | 1024px | `lg:` | Laptop, sidebar visible |
| Wide | 1280px | `xl:` | Full 3-col layouts |
| Ultra | 1536px | `2xl:` | Max content width, centered |

### Responsive Typography (Tailwind classes)

```tsx
// Landing page H1 — scales from mobile to desktop
className="font-serif text-display-md md:text-display-lg xl:text-display-xl"

// Dashboard page title
className="font-serif text-display-md"

// Section heading
className="text-h2 font-semibold text-[--color-text]"

// Body text
className="text-body text-[--color-text-secondary] leading-relaxed"

// Caption / metadata
className="text-micro text-[--color-text-muted] tracking-wide uppercase"
```

---

## Design Principles

Every component must pass:

1. **Clarity**: Is the purpose of this element immediately obvious?
2. **Restraint**: Have we used the minimum number of visual elements needed?
3. **Consistency**: Do spacing, radius, and type match the system tokens above?
4. **Readability**: Does it pass WCAG AA contrast at its smallest size?
5. **Mobile-first**: Does it feel intentional at 375px, not just squeezed?

## What to Avoid

- Colored backgrounds as decorative elements (use white/ash only)
- More than 1 font weight difference in a single component
- Borders AND shadows on the same element (pick one)
- Colored primary buttons that aren't black (the accent is black)
- Gradients (use flat colors only — gradients feel 2018)
- Box shadows that are too heavy — we use 4–12px blur maximum
- Inconsistent border-radius — always use the 4 defined radius tokens
- Animations > 300ms duration or that affect layout shift
- Dense typography without breathing room (minimum 8px between elements)
- Icons without text labels in primary navigation (accessibility)
