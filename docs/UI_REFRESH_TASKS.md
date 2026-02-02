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

### Old Layouts (delete after v3 confirmed)
- [ ] `_layouts/home.html`
- [ ] `_layouts/home-v2.html`
- [ ] `_layouts/category.html`
- [ ] `_layouts/category-v2.html`

### Old Includes (delete after v3 confirmed)
- [ ] `_includes/v2/` (entire directory)
- [ ] `_includes/head.html`
- [ ] `_includes/nav.html`
- [ ] `_includes/home/` (if unused)
- [ ] `_includes/subHome/` (if unused)

### Old SCSS (delete after v3 confirmed)
- [ ] `assets/style/bootstrap/` directory
- [ ] `assets/style/custom/` directory
- [ ] `assets/style/light_light_theme.scss`
- [ ] `assets/style/light_yellow_theme.scss`
- [ ] `assets/style/light_indigo_theme.scss`
- [ ] `assets/style/light_green_theme.scss`
- [ ] `assets/style/dark_orange_theme.scss`
- [ ] `assets/style/dark_indigo_theme.scss`
- [ ] `assets/style/dark_green_theme.scss`
- [ ] `assets/style/common.scss`
- [ ] `assets/style/_animate.scss`

---

## Step 8: Final Testing

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
- [ ] No console errors (needs browser testing)
- [ ] No broken images/links (needs manual review)
- [ ] Deploy to GitHub Pages
- [ ] Verify production site

---

## Notes

Last updated: 2026-02-02

### Migration Summary
- Created all v3 components with DaisyUI styling
- Updated main.js for new data-theme switching system
- Updated all page layouts to use v3 components
- Created syntax.scss for code highlighting
- Build succeeds with Jekyll

### Known Issues
- Some old Bootstrap SCSS deprecation warnings (won't affect v3)
- v2 components still exist (can be deleted after confirming v3 works in production)
