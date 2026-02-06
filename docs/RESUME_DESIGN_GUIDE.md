# Resume Design Guide

Reference file for designing the resume page using the same design system as the privacy policy.

---

## Design System Overview

**Framework:** DaisyUI (Tailwind-based)
**Icons:** Lucide Icons (`data-lucide="icon-name"`)
**Theme:** Supports light/dark via `data-theme`

---

## Core Components

### 1. Section Card

Each section is a card with icon badge header:

```html
<section class="card bg-base-200 shadow-sm">
  <div class="card-body">
    <h2 class="card-title text-lg">
      <span class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <i data-lucide="icon-name" class="w-5 h-5 text-primary"></i>
      </span>
      Section Title
    </h2>
    <!-- Content here -->
  </div>
</section>
```

**Color variations for icon badges:**
- `bg-primary/10` + `text-primary` - Main emphasis
- `bg-secondary/10` + `text-secondary` - Secondary info
- `bg-accent/10` + `text-accent` - Accent/highlight
- `bg-info/10` + `text-info` - Informational
- `bg-success/10` + `text-success` - Positive/contact
- `bg-warning/10` + `text-warning` - Caution/notes

### 2. Highlighted Card (for key sections)

Add border for emphasis:

```html
<section class="card bg-base-200 shadow-sm border-2 border-primary/20">
  <!-- Same structure as above -->
</section>
```

### 3. List with Icons

```html
<ul class="space-y-2">
  <li class="flex items-center gap-2">
    <i data-lucide="check" class="w-4 h-4 text-base-content/50"></i>
    <span>List item text</span>
  </li>
</ul>
```

For multi-line items, use `items-start` and `mt-0.5` on icon:

```html
<li class="flex items-start gap-2">
  <i data-lucide="briefcase" class="w-4 h-4 text-base-content/50 mt-0.5"></i>
  <span><strong>Title</strong> – Description text here</span>
</li>
```

### 4. Button Links

```html
<!-- Ghost button -->
<a href="#" class="btn btn-ghost btn-sm gap-2">
  <i data-lucide="icon" class="w-4 h-4"></i>
  Label
</a>

<!-- Outline button -->
<a href="#" class="btn btn-outline btn-sm gap-2">
  <i data-lucide="icon" class="w-4 h-4"></i>
  Label
</a>

<!-- Primary button -->
<button class="btn btn-primary btn-sm gap-2">
  <i data-lucide="icon" class="w-4 h-4"></i>
  Label
</button>
```

### 5. Badge/Tag

```html
<span class="badge badge-ghost">Tag</span>
<span class="badge badge-primary">Primary</span>
<span class="badge badge-success">Success</span>
```

---

## Resume-Specific Sections

Suggested structure for resume:

### Header/Hero
```html
<div class="flex flex-col items-center text-center mb-8">
  <img src="photo.jpg" class="w-24 h-24 rounded-full object-cover mb-4" />
  <h1 class="text-3xl font-bold">Your Name</h1>
  <p class="text-base-content/70">Your Title / Tagline</p>
  <div class="flex gap-2 mt-4">
    <!-- Social links as badges -->
  </div>
</div>
```

### Experience Section
- Icon: `briefcase`
- Color: `primary`
- List jobs with company, role, dates, bullet points

### Skills Section
- Icon: `code-2` or `wrench`
- Color: `secondary`
- Use badges for skill tags

### Education Section
- Icon: `graduation-cap`
- Color: `info`

### Projects Section
- Icon: `folder-git-2` or `rocket`
- Color: `accent`

### Contact Section
- Icon: `mail` or `send`
- Color: `success`

---

## Spacing

- Between sections: `space-y-8` on container
- Inside cards: handled by `card-body`
- Lists: `space-y-2`
- Button groups: `gap-3`

---

## Typography

- Page title: `text-3xl md:text-4xl font-bold`
- Section title: `card-title text-lg`
- Body text: default or `text-base-content/80`
- Muted text: `text-base-content/70` or `/60`
- Small text: `text-sm`

---

## Suggested Lucide Icons for Resume

| Section | Icon |
|---------|------|
| Contact | `mail`, `phone`, `map-pin`, `globe` |
| Experience | `briefcase`, `building-2`, `calendar` |
| Education | `graduation-cap`, `book-open`, `award` |
| Skills | `code-2`, `wrench`, `cpu`, `database` |
| Projects | `folder-git-2`, `rocket`, `github`, `external-link` |
| Languages | `languages`, `globe-2` |
| Certifications | `badge-check`, `award`, `certificate` |
| Interests | `heart`, `gamepad-2`, `music`, `camera` |

---

## Example: Experience Card

```html
<section class="card bg-base-200 shadow-sm">
  <div class="card-body">
    <h2 class="card-title text-lg">
      <span class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <i data-lucide="briefcase" class="w-5 h-5 text-primary"></i>
      </span>
      Experience
    </h2>

    <div class="space-y-6 mt-2">
      <!-- Job 1 -->
      <div>
        <div class="flex flex-wrap items-baseline justify-between gap-2">
          <h3 class="font-semibold">Senior Developer</h3>
          <span class="text-sm text-base-content/60">2022 - Present</span>
        </div>
        <p class="text-base-content/70 text-sm">Company Name</p>
        <ul class="space-y-1 mt-2">
          <li class="flex items-start gap-2 text-sm">
            <i data-lucide="chevron-right" class="w-4 h-4 text-primary mt-0.5 shrink-0"></i>
            <span>Achievement or responsibility</span>
          </li>
        </ul>
      </div>

      <!-- Job 2 -->
      <div>
        <!-- Same structure -->
      </div>
    </div>
  </div>
</section>
```

---

## Example: Skills Card

```html
<section class="card bg-base-200 shadow-sm">
  <div class="card-body">
    <h2 class="card-title text-lg">
      <span class="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
        <i data-lucide="code-2" class="w-5 h-5 text-secondary"></i>
      </span>
      Skills
    </h2>

    <div class="flex flex-wrap gap-2 mt-2">
      <span class="badge badge-ghost gap-1">
        <i data-lucide="coffee" class="w-3 h-3"></i> Java
      </span>
      <span class="badge badge-ghost gap-1">
        <i data-lucide="leaf" class="w-3 h-3"></i> Spring
      </span>
      <span class="badge badge-ghost">PostgreSQL</span>
      <span class="badge badge-ghost">Docker</span>
    </div>
  </div>
</section>
```

---

## Notes

- Always wrap icon in circular background for section headers
- Use `/10` opacity for icon background colors
- Consistent `w-10 h-10` for header icon containers
- Consistent `w-5 h-5` for header icons
- Consistent `w-4 h-4` for inline/list icons
- Add `shrink-0` to icons in flex layouts to prevent squishing
