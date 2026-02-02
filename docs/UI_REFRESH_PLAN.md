# UI Refresh Plan: Bootstrap → DaisyUI Migration

## Overview
Complete UI redesign of initgrep.blog from Bootstrap 4 to DaisyUI (Tailwind-based) with a modern, mobile-first card-based layout inspired by the Apple App Store design.

## Design Direction (from designs/mobilehome.png)

### Layout Structure
```
┌─────────────────────────────────────┐
│  Header: Logo + Theme Dropdown      │
├─────────────────────────────────────┤
│  Category Pills (horizontal scroll) │
│  [Java] [Spring] [Angular] [JS]...  │
├─────────────────────────────────────┤
│  Hero Card (Featured/Latest Post)   │
│  ┌─────────────────────────────┐    │
│  │  Large image                │    │
│  │  Title + Subtitle           │    │
│  │  Read button                │    │
│  └─────────────────────────────┘    │
├─────────────────────────────────────┤
│  Section: "Latest Posts"            │
│  ┌─────┐ ┌─────┐ ┌─────┐           │
│  │Card │ │Card │ │Card │  (grid)   │
│  └─────┘ └─────┘ └─────┘           │
├─────────────────────────────────────┤
│  Section: "By Category"             │
│  ┌───────────────────────────┐      │
│  │ Icon │ Title │ Count │ → │      │
│  └───────────────────────────┘      │
│  (list cards)                       │
└─────────────────────────────────────┘
```

### Responsive Behavior
- **Mobile**: Single column, stacked cards
- **Tablet**: 2-column grid for post cards
- **Desktop**: 3-column grid, wider hero card, max-width container

---

## Phase 1: Code Cleanup

### Unused Layouts to DELETE (5 files)
| File | Reason |
|------|--------|
| `_layouts/about.html` | 0 references |
| `_layouts/allPosts.html` | 0 references |
| `_layouts/author.html` | 0 references |
| `_layouts/post-v1.html` | Legacy v1, replaced by post.html |
| `_layouts/seriesPost-v1.html` | Legacy v1 |

### Unused Includes to DELETE (8 files)
| File | Reason |
|------|--------|
| `_includes/categories/postList.html` | 0 references |
| `_includes/f404/content.html` | 0 references |
| `_includes/search/search.html` | 0 references |
| `_includes/subscribe/subscribe-template.html` | 0 references |
| `_includes/util/heading.liquid` | 0 references |
| `_includes/util/sideColor.liquid` | 0 references |
| `_includes/util/textColor.liquid` | 0 references |
| `_includes/util/tokenizer.liquid` | 0 references |

### Old Layouts to Migrate & Delete
- `_layouts/category.html` → migrate to v3 → delete
- `_layouts/home.html` → migrate to v3 → delete
- `_includes/head.html` → replaced by v3/head.html
- `_includes/nav.html` → replaced by v3/header.html

---

## Phase 2: DaisyUI + Tailwind Setup

### CDN Approach (GitHub Pages compatible - no npm needed)

Add to `_includes/v3/head.html`:
```html
<!-- DaisyUI + Tailwind CDN -->
<link href="https://cdn.jsdelivr.net/npm/daisyui@5" rel="stylesheet" type="text/css" />
<link href="https://cdn.jsdelivr.net/npm/daisyui@5/themes.css" rel="stylesheet" type="text/css" />
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
```

### Current CSS to Remove (after v3 works)
- `assets/style/bootstrap/` (entire directory)
- `assets/style/custom/` (entire directory)
- All 7 theme SCSS files:
  - `light_light_theme.scss`
  - `light_yellow_theme.scss`
  - `light_indigo_theme.scss`
  - `light_green_theme.scss`
  - `dark_orange_theme.scss`
  - `dark_indigo_theme.scss`
  - `dark_green_theme.scss`
- `assets/style/common.scss`
- `assets/style/_animate.scss`

### Keep
- `assets/style/code-syntax/` (syntax highlighting)

---

## Phase 3: Theme Configuration

### Selected DaisyUI Themes (3 total)
1. **light** - clean white theme (default)
2. **retro** - warm, vintage feel
3. **forest** - dark green nature theme

### Theme Implementation
```html
<!-- Apply theme to html element -->
<html data-theme="light">
```

```javascript
// Theme switching (new approach)
function setTheme(themeName) {
  document.documentElement.setAttribute('data-theme', themeName);
  localStorage.setItem('theme', themeName);
}

// Load saved theme on page load
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
```

---

## Phase 4: Component Architecture

### New v3 Component Structure
```
_includes/v3/
├── head.html           # DOCTYPE, meta, DaisyUI CDN, theme init
├── header.html         # Navbar: logo + search + theme dropdown
├── category-pills.html # Horizontal scrollable category badges
├── hero-card.html      # Featured post large card
├── post-card.html      # Reusable post card for grids
├── category-list.html  # Category list items with counts
├── footer.html         # Minimal footer
└── search-modal.html   # DaisyUI modal for Google CSE
```

### New v3 Layouts
```
_layouts/
├── html_minifier.liquid  # Keep (base wrapper)
├── home-v3.html          # New homepage
├── post-v3.html          # New post page
└── category-v3.html      # New category page
```

### DaisyUI Components Reference

| UI Element | DaisyUI Classes | Notes |
|------------|-----------------|-------|
| Navbar | `navbar bg-base-100` | Sticky header |
| Theme Dropdown | `dropdown dropdown-end` | Right-aligned |
| Category Pills | `badge badge-outline` | In scrollable flex container |
| Hero Card | `card image-full` | Full-width image background |
| Post Card | `card card-compact bg-base-100 shadow-xl` | Grid item |
| Category List | `flex items-center` | Custom list style |
| Search Modal | `modal` | Google CSE inside |
| Buttons | `btn btn-primary` | CTAs |

---

## Phase 5: Key File Changes

### `_includes/v3/head.html`
```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- DaisyUI + Tailwind -->
  <link href="https://cdn.jsdelivr.net/npm/daisyui@5" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/daisyui@5/themes.css" rel="stylesheet" />
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>

  <!-- FontAwesome (keep) -->
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.1/css/all.css">

  <!-- Favicon -->
  <link rel="shortcut icon" href="{{site.baseurl}}/assets/images/favicon.svg" />

  <!-- SEO -->
  {% include seo/headseo.html %}

  <!-- Analytics -->
  {% include analytics/google-analytics.html %}
  {% include analytics/adblock-recover.html %}
  {% include ads/google-ads.html %}

  <!-- Google CSE -->
  <script async src="https://cse.google.com/cse.js?cx=000297669988019007071:0ouka41f0ma"></script>

  <!-- Theme init (before body renders) -->
  <script>
    (function() {
      const theme = localStorage.getItem('theme') || 'light';
      document.documentElement.setAttribute('data-theme', theme);
    })();
  </script>
</head>
<body class="bg-base-200 min-h-screen">
```

### `_includes/v3/header.html`
```html
<div class="navbar bg-base-100 sticky top-0 z-50 shadow-sm">
  <div class="navbar-start">
    <a href="/" class="btn btn-ghost text-xl">
      <i class="fas fa-terminal"></i>
      initgrep
    </a>
  </div>
  <div class="navbar-end gap-2">
    <!-- Search -->
    <button class="btn btn-ghost btn-circle" onclick="searchModal.showModal()">
      <i class="fas fa-search"></i>
    </button>
    <!-- Theme Dropdown -->
    <div class="dropdown dropdown-end">
      <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
        <i class="fas fa-palette"></i>
      </div>
      <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-40 p-2 shadow">
        <li><a onclick="setTheme('light')">Light</a></li>
        <li><a onclick="setTheme('retro')">Retro</a></li>
        <li><a onclick="setTheme('forest')">Forest</a></li>
      </ul>
    </div>
  </div>
</div>
```

### `assets/js/main.js` (simplified)
```javascript
// Theme management
function setTheme(themeName) {
  document.documentElement.setAttribute('data-theme', themeName);
  localStorage.setItem('theme', themeName);
}

// Scroll progress bar
function initScrollProgress() {
  const progress = document.getElementById('progress');
  if (!progress) return;

  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = (scrollTop / scrollHeight) * 100;
    progress.style.setProperty('--scroll', percent + '%');
  }, { passive: true });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
});
```

---

## Verification Checklist

### Local Testing
```bash
bundle exec jekyll serve
# Open http://localhost:4000
```

### Functionality Tests
- [ ] Homepage loads with default theme (light)
- [ ] Theme dropdown works (light/retro/forest)
- [ ] Theme persists after page reload
- [ ] Hero card displays featured post
- [ ] Post cards grid is responsive (1→2→3 columns)
- [ ] Category pills scroll horizontally on mobile
- [ ] Search modal opens and functions
- [ ] Post pages render correctly
- [ ] Category pages render correctly
- [ ] Code syntax highlighting works
- [ ] No console errors
- [ ] No broken images/links
- [ ] Mobile layout looks good
- [ ] Tablet layout looks good
- [ ] Desktop layout looks good

---

## Notes

- **CDN approach**: No build step needed, works on GitHub Pages
- **Tailwind Browser**: Classes processed at runtime
- **themes.css**: Required for retro/forest (not in base daisyui.css)
- **v3 naming**: Clean break allows parallel dev/testing with v2
- **Mobile-first**: Use Tailwind responsive prefixes (sm:, md:, lg:)
