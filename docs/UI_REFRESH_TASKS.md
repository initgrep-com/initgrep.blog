# UI Refresh Tasks

> Reference: [UI_REFRESH_PLAN.md](./UI_REFRESH_PLAN.md)

## Progress Legend
- [ ] Not started
- [x] Completed

---

## Step 1: Code Cleanup

### Delete Unused Layouts
- [x] `_layouts/about.html`
- [x] `_layouts/allPosts.html`
- [x] `_layouts/author.html`
- [x] `_layouts/post-v1.html`
- [x] `_layouts/seriesPost-v1.html`

### Delete Unused Includes
- [x] `_includes/categories/postList.html` (was at `_includes/category/postList.html`)
- [x] `_includes/f404/content.html`
- [x] `_includes/search/search.html`
- [x] `_includes/subscribe/subscribe-template.html`
- [x] `_includes/util/heading.liquid`
- [x] `_includes/util/sideColor.liquid`
- [x] `_includes/util/textColor.liquid`
- [x] `_includes/util/tokenizer.liquid`

---

## Step 2: Create v3 Foundation

- [x] Create `_includes/v3/` directory
- [x] Create `_includes/v3/head.html` with DaisyUI CDN

---

## Step 3: Build Core Components

- [x] `_includes/v3/header.html` - navbar with theme dropdown
- [x] `_includes/v3/hero-card.html` - featured post card
- [x] `_includes/v3/post-card.html` - reusable post card
- [x] `_includes/v3/category-pills.html` - horizontal category tags
- [x] `_includes/v3/category-list.html` - category list items
- [x] `_includes/v3/footer.html` - minimal footer
- [x] `_includes/v3/search-modal.html` - search overlay

---

## Step 4: Build Layouts

- [x] `_layouts/home-v3.html` - new homepage
- [x] `_layouts/post-v3.html` - new post page (also updated `post.html` directly)
- [x] `_layouts/category-v3.html` - new category page

---

## Step 5: JavaScript

- [x] Rewrite `assets/js/main.js` for data-theme system
- [x] Add search modal toggle functionality (Cmd/Ctrl+K shortcut)

---

## Step 6: Migration

- [x] Update `index.html` to use `home-v3` layout
- [x] Update category pages to use `category-v3` layout
- [x] Verify all posts work with updated `post.html` layout

---

## Step 7: Cleanup Old Assets

### Old Layouts (deleted)
- [x] `_layouts/home.html` (was already deleted)
- [x] `_layouts/home-v2.html` (was already deleted)
- [x] `_layouts/category.html` (was already deleted)
- [x] `_layouts/category-v2.html` (was already deleted)
- [x] `_layouts/siteIndentity.html` (deleted, inlined into google verification file)
- [x] `_layouts/post-v3.html` (deleted, unused duplicate of post.html)

### Old Includes (deleted)
- [x] `_includes/v2/` (was already deleted)
- [x] `_includes/head.html` (was already deleted)
- [x] `_includes/nav.html` (was already deleted)
- [x] `_includes/home/` (was already deleted)
- [x] `_includes/subHome/` (was already deleted)

### Empty Legacy Directories (deleted)
- [x] `_includes/category/` (empty directory removed)
- [x] `_includes/f404/` (empty directory removed)
- [x] `_includes/search/` (empty directory removed)
- [x] `_includes/subscribe/` (empty directory removed)

### Old SCSS (deleted)
- [x] All old SCSS files were already deleted (only `code-syntax/` remains)

---

## Step 8: Flatten v3 Structure

- [x] Move `_includes/v3/*` to `_includes/` root (head, header, footer, post-card, hero-card, category-list, category-pills, search-modal)
- [x] Delete `_includes/v3/` directory
- [x] Update all `{% include v3/... %}` references in all layouts
- [x] Rename `_layouts/home-v3.html` → `_layouts/home.html`
- [x] Rename `_layouts/category-v3.html` → `_layouts/category.html`
- [x] Update `index.html` front matter: `layout: home`
- [x] Update all 11 category pages: `layout: category`

---

## Step 9: JavaScript Cleanup

- [x] Remove dead `initScrollProgress()` function (referenced non-existent `#progress` element)
- [x] Remove scroll event listener for progress bar
- [x] Verify clean build with no warnings

---

## Step 10: Final Testing

- [x] Homepage loads correctly
- [x] Theme switcher works (light/retro/forest)
- [x] Theme persists on reload (via localStorage)
- [x] Post pages render correctly
- [x] Category pages render correctly
- [ ] Responsive: mobile view (needs manual testing)
- [ ] Responsive: tablet view (needs manual testing)
- [ ] Responsive: desktop view (needs manual testing)
- [x] Search modal works
- [x] Code syntax highlighting CSS created
- [x] Jekyll build succeeds with zero warnings
- [ ] No console errors (needs browser testing)
- [ ] No broken images/links (needs manual review)
- [ ] Deploy to GitHub Pages
- [ ] Verify production site

---

## Upcoming Tasks

- [x] Replace FontAwesome icons with Lucide icons
- [ ] Home page improvements
- [ ] Category page improvements
- [ ] Main content/article page improvements

---

## Notes

Last updated: 2026-02-03

### Migration Summary
- Created all components with DaisyUI styling
- Updated main.js for new data-theme switching system
- Updated all page layouts to use components directly (no v3 namespace)
- Created syntax.scss for code highlighting
- Build succeeds with Jekyll (zero warnings)

### Architecture (current)
- Components in `_includes/` (flat, no subdirectory grouping)
- Layouts: home, post, category, seriesPost, about, author, FourNotFour, privacy
- JS: single `main.js` with theme management and search shortcut
- CSS: DaisyUI + Tailwind via CDN, syntax highlighting via SCSS
