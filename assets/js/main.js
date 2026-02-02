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
 * Scroll Progress Bar
 */
function initScrollProgress() {
    const progressBar = document.getElementById('progress');
    if (!progressBar) return;

    document.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
        progressBar.style.setProperty('--scroll', `${scrollPercent}%`);
    }, { passive: true });
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
 * Initialize all functionality
 */
function init() {
    checkVersion();
    loadTheme();
    initScrollProgress();
    initSearchShortcut();
}

// Make setTheme available globally for the theme dropdown
window.setTheme = setTheme;

// Run on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
