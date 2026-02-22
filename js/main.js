// ===== Dark/Light Mode Toggle =====
(function() {
    const toggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const stored = localStorage.getItem('theme');

    if (stored) {
        html.setAttribute('data-theme', stored);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        html.setAttribute('data-theme', 'dark');
    }

    if (toggle) {
        toggle.addEventListener('click', function() {
            const current = html.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        });
    }
})();

// ===== Back to Top Button =====
(function() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

// ===== Copy to Clipboard =====
document.addEventListener('click', function(e) {
    var btn = e.target.closest('.copy-btn');
    if (!btn) return;

    var targetId = btn.getAttribute('data-copy-target');
    var el = document.getElementById(targetId);
    if (!el) return;

    var text = el.textContent;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function() {
            showCopySuccess(btn);
        }).catch(function() {
            fallbackCopy(text, btn);
        });
    } else {
        fallbackCopy(text, btn);
    }
});

function fallbackCopy(text, btn) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        showCopySuccess(btn);
    } catch (err) {
        // silent fail
    }
    document.body.removeChild(textarea);
}

function showCopySuccess(btn) {
    var span = btn.querySelector('span');
    var originalText = span ? span.textContent : '';
    if (span) span.textContent = 'Copied!';
    btn.classList.add('copy-btn--success');
    setTimeout(function() {
        if (span) span.textContent = originalText;
        btn.classList.remove('copy-btn--success');
    }, 2000);
}

// ===== Difficulty Filter (Index Page) =====
(function() {
    var filterBtns = document.querySelectorAll('.filter-btn');
    if (!filterBtns.length) return;

    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var filter = btn.getAttribute('data-filter');

            filterBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');

            var cards = document.querySelectorAll('.ranking-card, .prompt-library-card, .quickstart-card');
            cards.forEach(function(card) {
                if (filter === 'all') {
                    card.classList.remove('hidden');
                } else {
                    var difficulty = card.getAttribute('data-difficulty');
                    if (difficulty && difficulty === filter) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                }
            });
        });
    });
})();

// ===== Sidebar Scroll Tracking (Applications Page) =====
(function() {
    var sections = document.querySelectorAll('article[id^="app-"]');
    var navLinks = document.querySelectorAll('.sidebar-nav a');
    if (!sections.length || !navLinks.length) return;

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                navLinks.forEach(function(link) { link.classList.remove('active'); });
                var activeLink = document.querySelector('.sidebar-nav a[href="#' + entry.target.id + '"]');
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, { rootMargin: '-20% 0px -80% 0px' });

    sections.forEach(function(section) { observer.observe(section); });
})();

// ===== Prompt Search (Prompt Library Page) =====
(function() {
    var searchInput = document.getElementById('prompt-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
        var query = searchInput.value.toLowerCase().trim();
        var cards = document.querySelectorAll('.prompt-library-card');

        cards.forEach(function(card) {
            var text = card.textContent.toLowerCase();
            if (!query || text.indexOf(query) !== -1) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
})();

// ===== Smooth scroll for anchor links =====
document.addEventListener('click', function(e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;

    var targetId = link.getAttribute('href').substring(1);
    var target = document.getElementById(targetId);
    if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', '#' + targetId);
    }
});
