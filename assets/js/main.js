/**
 * initgrep v3 - DaisyUI Theme System
 */

// Available themes
const THEMES = ['light', 'retro', 'forest'];
const DEFAULT_THEME = 'light';
const VERSION = '3.0.0';

// Map themes to Lucide icon names
var THEME_ICONS = {
    'light': 'sun',
    'caramellatte': 'sun-dim',
    'forest': 'moon'
};

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
    updateThemeIcon();
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && THEMES.includes(savedTheme)) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
        document.documentElement.setAttribute('data-theme', DEFAULT_THEME);
    }
    updateThemeColor();
    updateThemeIcon();
}

function updateThemeIcon() {
    var btn = document.getElementById('themeBtn');
    if (!btn) return;
    var theme = document.documentElement.getAttribute('data-theme') || DEFAULT_THEME;
    var iconName = THEME_ICONS[theme] || 'sun';
    var iconEl = btn.querySelector('svg, i');
    if (iconEl) {
        var newIcon = document.createElement('i');
        newIcon.setAttribute('data-lucide', iconName);
        newIcon.className = 'w-5 h-5';
        iconEl.replaceWith(newIcon);
        if (typeof lucide !== 'undefined') {
            lucide.createIcons({ nodes: [newIcon] });
        }
    }
}

function updateThemeColor() {
    // Update browser theme-color meta tag based on current theme
    const themeColors = {
        'light': '#ffffff',
        'caramellatte': '#e4d8b4',
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
 * Search
 */
var searchIndex = null;
var searchActiveIndex = -1;

function openSearch() {
    var overlay = document.getElementById('searchOverlay');
    if (!overlay) return;
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    var input = document.getElementById('searchInput');
    if (input) { input.value = ''; input.focus(); }
    document.getElementById('searchResults').innerHTML = '';
    searchActiveIndex = -1;
    loadSearchIndex();
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeSearch() {
    var overlay = document.getElementById('searchOverlay');
    if (!overlay) return;
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
}

function loadSearchIndex() {
    if (searchIndex) return;
    fetch('/search.json')
        .then(function(r) { return r.json(); })
        .then(function(data) { searchIndex = data; })
        .catch(function() { searchIndex = []; });
}

function performSearch(query) {
    if (!searchIndex || !query.trim()) {
        document.getElementById('searchResults').innerHTML = '';
        searchActiveIndex = -1;
        return;
    }
    var terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    var results = searchIndex.filter(function(post) {
        var haystack = (post.title + ' ' + post.meta + ' ' + post.category + ' ' + (post.categories || []).join(' ')).toLowerCase();
        return terms.every(function(t) { return haystack.indexOf(t) !== -1; });
    });
    renderResults(results, query);
}

function renderResults(results, query) {
    var container = document.getElementById('searchResults');
    if (!results.length) {
        container.innerHTML = '<div class="px-4 py-8 text-center text-base-content/50 text-sm">No results found</div>';
        searchActiveIndex = -1;
        return;
    }
    container.innerHTML = results.slice(0, 10).map(function(post, i) {
        var iconName = post.icon || 'file-text';
        return '<a href="' + post.url + '" class="search-result flex items-start gap-3 px-4 py-3 hover:bg-base-200 transition-colors cursor-pointer border-b border-base-200 last:border-0" data-index="' + i + '">'
            + '<div class="min-w-0 flex-1">'
            + '<div class="flex items-center gap-2 mb-0.5">'
            + '<span class="badge badge-ghost badge-sm gap-1">'
            + '<i data-lucide="' + iconName + '" class="w-3 h-3"></i>'
            + escapeHtml(post.category || '')
            + '</span>'
            + '</div>'
            + '<div class="font-medium text-sm text-base-content line-clamp-1">' + highlightMatch(post.title, query) + '</div>'
            + '<div class="text-xs text-base-content/60 line-clamp-1 mt-0.5">' + escapeHtml(post.meta || '') + '</div>'
            + '</div>'
            + '</a>';
    }).join('');
    searchActiveIndex = -1;
    if (typeof lucide !== 'undefined') {
        lucide.createIcons({ nodes: container.querySelectorAll('[data-lucide]') });
    }
}

function highlightMatch(text, query) {
    var safe = escapeHtml(text);
    var terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    terms.forEach(function(term) {
        var regex = new RegExp('(' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
        safe = safe.replace(regex, '<mark class="bg-primary/20 text-base-content rounded px-0.5">$1</mark>');
    });
    return safe;
}

function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function navigateResults(direction) {
    var items = document.querySelectorAll('.search-result');
    if (!items.length) return;
    items.forEach(function(el) { el.classList.remove('bg-base-200'); });
    searchActiveIndex += direction;
    if (searchActiveIndex < 0) searchActiveIndex = items.length - 1;
    if (searchActiveIndex >= items.length) searchActiveIndex = 0;
    items[searchActiveIndex].classList.add('bg-base-200');
    items[searchActiveIndex].scrollIntoView({ block: 'nearest' });
}

function selectResult() {
    var items = document.querySelectorAll('.search-result');
    if (searchActiveIndex >= 0 && searchActiveIndex < items.length) {
        window.location.href = items[searchActiveIndex].getAttribute('href');
    }
}

function initSearch() {
    document.addEventListener('keydown', function(e) {
        var overlay = document.getElementById('searchOverlay');
        var isOpen = overlay && !overlay.classList.contains('hidden');

        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            isOpen ? closeSearch() : openSearch();
            return;
        }

        if (!isOpen) return;

        if (e.key === 'Escape') { closeSearch(); return; }
        if (e.key === 'ArrowDown') { e.preventDefault(); navigateResults(1); return; }
        if (e.key === 'ArrowUp') { e.preventDefault(); navigateResults(-1); return; }
        if (e.key === 'Enter') { e.preventDefault(); selectResult(); return; }
    });

    var input = document.getElementById('searchInput');
    if (input) {
        input.addEventListener('input', function() { performSearch(this.value); });
    }
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
 * Code block line numbers (CSS counter approach)
 */
function initLineNumbers() {
    document.querySelectorAll('div.highlight pre code').forEach(function(codeEl) {
        if (codeEl.querySelector('.code-line')) return; // already processed

        var html = codeEl.innerHTML;
        // Remove trailing newline if present (Rouge adds one)
        if (html.endsWith('\n')) html = html.slice(0, -1);

        var lines = html.split('\n');
        codeEl.innerHTML = lines.map(function(line) {
            return '<span class="code-line">' + (line || ' ') + '</span>';
        }).join('');
    });
}

/**
 * Code block copy buttons
 */
var ICON_CLIPBOARD = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>';
var ICON_CHECK = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

function initCodeCopyButtons() {
    // Only target div.highlight, not pre.highlight (Rouge nests both)
    document.querySelectorAll('div.highlight').forEach(function(block) {
        if (block.querySelector('.code-copy-btn')) return;
        var btn = document.createElement('button');
        btn.className = 'code-copy-btn absolute top-2 right-2 z-10 flex items-center gap-1 ' +
            'bg-base-100 text-base-content/70 border border-base-200 ' +
            'rounded-md px-2 py-1 text-xs cursor-pointer ' +
            'transition-all duration-150 ' +
            'hover:bg-base-200 hover:text-base-content hover:scale-105 ' +
            'active:scale-95';
        btn.innerHTML = ICON_CLIPBOARD;
        btn.setAttribute('aria-label', 'Copy code');
        btn.addEventListener('click', function() {
            var codeEl = block.querySelector('code');
            if (!codeEl) return;
            navigator.clipboard.writeText(codeEl.textContent).then(function() {
                btn.innerHTML = ICON_CHECK + ' <span>Copied!</span>';
                btn.classList.add('text-success', 'bg-base-200');
                setTimeout(function() {
                    btn.innerHTML = ICON_CLIPBOARD;
                    btn.classList.remove('text-success', 'bg-base-200');
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
    initSearch();
    initLineNumbers();
    initCodeCopyButtons();
    // Initialize Lucide icons (replaces <i data-lucide="..."> with SVGs)
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Make functions available globally for onclick handlers
window.setTheme = setTheme;
window.openSearch = openSearch;
window.closeSearch = closeSearch;

// Run on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
