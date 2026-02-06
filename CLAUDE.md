# Claude Code Context

This file helps Claude maintain context across conversations for the initgrep.blog project.

## Current Project: UI Refresh (Bootstrap → DaisyUI)

### Documentation Files

| File | Purpose |
|------|---------|
| `docs/UI_REFRESH_PLAN.md` | Full implementation plan with design details, component specs, and code examples |
| `docs/UI_REFRESH_TASKS.md` | Task checklist - **update this when completing tasks** |

### Quick Reference

- **Framework**: DaisyUI (Tailwind-based) via CDN
- **Themes**: light (default), retro, forest
- **Design**: Mobile-first, card-based layout (see `designs/mobilehome.png`)
- **Version**: Creating v3 components (clean break from v2)

### Key Directories

```
_includes/v3/     # New components (to be created)
_includes/v2/     # Current components (to be deleted after v3 works)
_layouts/         # Page templates
assets/js/        # JavaScript (main.js needs rewrite)
assets/style/     # Current SCSS (to be removed after migration)
docs/             # Project documentation
designs/          # Design mockups
```

### How to Update Progress

1. Read `docs/UI_REFRESH_TASKS.md`
2. Find the task being worked on
3. Mark as `[x]` when completed
4. Save the file

### Testing Command

```bash
bundle exec jekyll serve
# Opens at http://localhost:4000
```

### Important Notes

- No npm/package.json - pure Jekyll with CDN dependencies
- GitHub Pages compatible (no build tools)
- Keep `assets/style/code-syntax/` for syntax highlighting
- Don't delete v2 files until v3 is fully working
