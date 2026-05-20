# DESIGN.md — JBI Software Staffing Site

## Design intent

Healthcare B2B audience. Trustworthy and premium without being cold. Navy + teal communicates precision and healthcare familiarity. Typography-led — most pages are content, not imagery.

## Color system

All colors are defined as CSS custom properties in `:root` in `styles.css`.

### Base palette
| Token | Value | Use |
|-------|-------|-----|
| `--navy` | `#0b213f` | Primary dark — backgrounds, text |
| `--navy-light` | `#0e2a4a` | Secondary dark — gradient stops |
| `--teal` | `#0094b8` | Primary accent — CTAs, icons, highlights |
| `--teal-dark` | `#007a99` | Hover state for teal elements |
| `--green` | `#76c043` | Success states only |
| `--red` | `#dc2626` | Error states only |
| `--white` | `#ffffff` | — |

### Gray scale (Tailwind-aligned)
`--gray-50` through `--gray-900` — standard semantic gray steps

### Alpha tokens (never use raw rgba() in rules — use these)
| Token | Value | Use |
|-------|-------|-----|
| `--white-75` | rgba(255,255,255,.75) | Hero subtext |
| `--white-70` | rgba(255,255,255,.70) | Footer text, contact card |
| `--white-60` | rgba(255,255,255,.60) | Secondary subtext on dark |
| `--white-35` | rgba(255,255,255,.35) | Outline button borders |
| `--white-12` | rgba(255,255,255,.12) | Glass card borders |
| `--white-10` | rgba(255,255,255,.10) | Glass card backgrounds |
| `--white-08` | rgba(255,255,255,.08) | Subtle glass overlays |
| `--teal-20` | rgba(0,148,184,.20) | Teal borders |
| `--teal-14` | rgba(0,148,184,.14) | Teal hover backgrounds |
| `--teal-10` | rgba(0,148,184,.10) | Card icons, subtle tints |
| `--teal-08` | rgba(0,148,184,.08) | Very subtle teal areas |
| `--teal-06` | rgba(0,148,184,.06) | Hover shadows |
| `--navy-14` | rgba(11,33,63,.14) | Colored card hover shadows |
| `--navy-10` | rgba(11,33,63,.10) | Job card hover shadows |
| `--navy-08` | rgba(11,33,63,.08) | Job pill backgrounds |
| `--navy-96` | rgba(11,33,63,.96) | About-hero image overlay |
| `--overlay` | rgba(0,0,0,.50) | Modal backdrops |

### Shadow system
```
--shadow-sm  → subtle lift, small cards
--shadow     → standard card elevation  
--shadow-lg  → hover state, featured cards
```
All shadows are navy-tinted (not pure black).

## Typography

Font: **Outfit** (Google Fonts) — weights 300, 400, 500, 600, 700, 800

```
h1: clamp(2.2rem, 5vw, 3.5rem) — weight 800 — tracking -.025em
h2: clamp(1.8rem, 3.5vw, 2.5rem) — weight 700 — tracking -.018em
h3: 1.25rem — weight 600
p:  color --gray-600, line-height 1.75, max-width 68ch
```

`text-wrap: balance` on all headings — prevents orphaned words.

## Easing

Single easing token: `--ease-out: cubic-bezier(.22,1,.36,1)`
This is a strong deceleration curve (stronger than Material Design's `.4,0,.2,1`). Items land with weight. Never use `ease`, `linear`, or the old `cubic-bezier(.4,0,.2,1)` for interactive elements.

**Rule**: Only animate `transform` and `opacity`. Never `all`, never `width`, never `height`.
- Nav underline: `transform: scaleX()` — not `width`
- Skip-link: `transform: translateY()` — not `top`
- Cards lift: `transform: translateY(-4px)` — not `margin`
- Reveal: `transform: translateY(32px)` → `translateY(0)` — not `opacity` alone

## Animation

- `.reveal` — scroll-triggered fade+lift, 0.65s, `cubic-bezier(.22,1,.36,1)`
- `.reveal-stagger > *` — children get sequential 70ms delays (up to 350ms for 6 items)
- Hero float — `.hero::after` — 12s infinite alternate, `will-change: transform`
- Counters — ease-out-cubic, 1800ms, triggered by IntersectionObserver at 0.5 threshold
- Logo scroll — `@keyframes logo-scroll`, 25s linear, pauses on hover

## Key component rules

### Cards
- Default radius: 10px (not the global 12px — intentionally tighter)
- Hover: `translateY(-4px)` + navy-tinted shadow
- Never use `transition: all` — only `transform`, `box-shadow`, `border-color`

### Buttons
- `.btn-primary` — teal fill, hover lifts 2px, active `scale(0.97)`
- `.btn-secondary` — white with gray border, hover turns teal
- `.btn-outline-white` — transparent with white border (dark backgrounds only)
- All buttons: `border-radius: 50px` (pill shape)
- Focus: `outline: 2px solid var(--teal)`, `outline-offset: 3px`

### Dark sections — differentiated gradients
Each dark background context has its own angle/stops — never use the same gradient twice:
- `.hero` — 135deg, 3-stop: navy → navy-light → #12365c
- `.cta-banner` — 160deg, 3-stop: #081e3a → navy → #0a2d52
- `.about-hero` — 180deg (vertical): #0a2341 → navy
- `.page-header` — 120deg: navy → #0d2f56
- `.card-featured` — 150deg: navy-light → #081a33

### Hero stats (homepage)
Asymmetric layout — not a 2×2 grid:
- Primary stat card (3,500+) — full width, large number, teal glow, sublabel
- Secondary row — 3 stats in a single glass row with dividers between

### Navigation
- Mega-menu: JS-controlled with 150ms close delay (mouseenter/mouseleave)
- Active underline: `transform: scaleX(0)` → `scaleX(1)`, `transform-origin: left`
- Nav links: `min-height: 44px` for touch targets

## Texture and depth

- Grain overlay: `body::after` — SVG fractalNoise at 128px, opacity 0.028. Subtle but present.
- Navbar backdrop-filter: `blur(12px)` — frosted glass on scroll

## Layout patterns

- `.split` — 2-col, 1:1, with `.reverse` variant (rtl direction trick for order flip)
- `.cards-grid` — `cols-2`, `cols-3`, `cols-4`, `cols-auto`
- `.hero-stats-asymmetric` — featured primary + secondary row (homepage only)
- `.card-inline-cta` — horizontal card with text + button, breaks card grid monotony
- `.testimonials-grid` — 3-col with masonry offset (cards 2 and 5 are `margin-top: 28px`)

## Responsive breakpoints

- `1024px` — tablet: 1-col hero, 2-col grids, hide nav links, show hamburger
- `768px` — mobile: 1-col everything, reduced padding

## Accessibility

- Skip link: `.skip-link` — top of every page, `transform: translateY(-100%)` until `:focus`
- All pages have `<main id="main">` wrapping body content (nav + mobile-nav are outside)
- Focus rings: `:focus-visible` with teal outline, `border-radius: 4px`
- Touch targets: `.nav-links a` and `.pill` have `min-height: 44px`
- `prefers-reduced-motion` media query disables all animations/transitions
- `text-wrap: balance` on headings prevents orphans

## Anti-patterns (do not do these)

- ❌ `transition: all` or `transition: var(--transition)` — specify exact properties
- ❌ `transition: width` for underlines — use `transform: scaleX()`
- ❌ `transition: top/left/bottom/right` — use `transform: translate()`
- ❌ Raw `rgba()` in rules — use the `--white-*`, `--teal-*`, `--navy-*` tokens
- ❌ Identical card grid 3-up with same icon+h3+p structure repeated 6 times
- ❌ `ease` or `linear` for UI interactions — use `cubic-bezier(.22,1,.36,1)`
- ❌ Same `linear-gradient(135deg, navy, navy-light)` on every dark section
- ❌ `<section id="main">` as the skip target — must be `<main id="main">`
