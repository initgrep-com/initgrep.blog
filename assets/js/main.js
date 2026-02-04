/**
 * initgrep v3 - DaisyUI Theme System
 */

// Available themes
const THEMES = ['light', 'retro', 'forest'];
const DEFAULT_THEME = 'light';
const VERSION = '3.0.0';

/**
 * Theme Management
 */
function setTheme(theme) {
    if (!THEMES.includes(theme)) {
        theme = DEFAULT_THEME;
    }
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeColor();
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && THEMES.includes(savedTheme)) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
        document.documentElement.setAttribute('data-theme', DEFAULT_THEME);
    }
    updateThemeColor();
}

function updateThemeColor() {
    // Update browser theme-color meta tag based on current theme
    const themeColors = {
        'light': '#ffffff',
        'retro': '#e4d8b4',
        'forest': '#171212'
    };
    const currentTheme = document.documentElement.getAttribute('data-theme') || DEFAULT_THEME;
    const color = themeColors[currentTheme] || '#333333';

    const metaTags = [
        'meta[name="theme-color"]',
        'meta[name="msapplication-navbutton-color"]',
        'meta[name="apple-mobile-web-app-status-bar-style"]'
    ];

    metaTags.forEach(selector => {
        const meta = document.querySelector(selector);
        if (meta) {
            meta.setAttribute('content', color);
        }
    });
}

/**
 * Search Modal (keyboard shortcut)
 */
function initSearchShortcut() {
    document.addEventListener('keydown', (event) => {
        // Cmd/Ctrl + K to open search
        if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
            event.preventDefault();
            const modal = document.getElementById('searchModal');
            if (modal) {
                modal.showModal();
            }
        }

        // Escape to close modals (handled by DaisyUI, but adding for safety)
        if (event.key === 'Escape') {
            const modal = document.getElementById('searchModal');
            if (modal && modal.open) {
                modal.close();
            }
        }
    });
}

/**
 * Version management - clear localStorage on version change
 */
function checkVersion() {
    const storedVersion = localStorage.getItem('_ver');
    if (storedVersion !== VERSION) {
        // Keep theme preference, clear everything else
        const theme = localStorage.getItem('theme');
        localStorage.clear();
        if (theme) {
            localStorage.setItem('theme', theme);
        }
        localStorage.setItem('_ver', VERSION);
    }
}

/**
 * Code block copy buttons
 */
var ICON_CLIPBOARD = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>';
var ICON_CHECK = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

function initCodeCopyButtons() {
    // Only target div.highlight, not pre.highlight (Rouge nests both)
    document.querySelectorAll('div.highlight').forEach(function(block) {
        if (block.querySelector('.code-copy-btn')) return;
        var btn = document.createElement('button');
        btn.className = 'code-copy-btn';
        btn.innerHTML = ICON_CLIPBOARD;
        btn.setAttribute('aria-label', 'Copy code');
        btn.addEventListener('click', function() {
            var code = block.querySelector('code');
            if (!code) return;
            navigator.clipboard.writeText(code.textContent).then(function() {
                btn.innerHTML = ICON_CHECK + ' <span>Copied!</span>';
                btn.classList.add('copied');
                setTimeout(function() {
                    btn.innerHTML = ICON_CLIPBOARD;
                    btn.classList.remove('copied');
                }, 2000);
            });
        });
        block.appendChild(btn);
    });
}

/**
 * Initialize all functionality
 */
function init() {
    checkVersion();
    loadTheme();
    initSearchShortcut();
    initCodeCopyButtons();
    // Initialize Lucide icons (replaces <i data-lucide="..."> with SVGs)
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Make setTheme available globally for the theme dropdown
window.setTheme = setTheme;

// Run on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
