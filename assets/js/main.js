(function() {
  'use strict';

  // ============================================================
  // Theme Toggle
  // ============================================================
  const THEME_KEY = 'site-theme';
  const html = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');
  const iconSun = toggleBtn ? toggleBtn.querySelector('.icon-sun') : null;
  const iconMoon = toggleBtn ? toggleBtn.querySelector('.icon-moon') : null;

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    updateThemeIcon(theme);
  }

  function updateThemeIcon(theme) {
    if (!iconSun || !iconMoon) return;
    if (theme === 'dark') {
      iconSun.style.display = 'none';
      iconMoon.style.display = 'block';
    } else {
      iconSun.style.display = 'block';
      iconMoon.style.display = 'none';
    }
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) {
      setTheme(saved);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    } else {
      setTheme('light');
    }
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
      const current = html.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  initTheme();

  // ============================================================
  // Navbar Scroll Effect
  // ============================================================
  const navbar = document.getElementById('navbar');
  if (navbar) {
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 10) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ============================================================
  // Mobile Menu Toggle
  // ============================================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', function() {
      mobileMenu.classList.toggle('open');
    });
    document.addEventListener('click', function(e) {
      if (!mobileMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileMenu.classList.remove('open');
      }
    });
  }

  // ============================================================
  // Search Overlay
  // ============================================================
  const searchToggle = document.getElementById('search-toggle');
  const searchOverlay = document.getElementById('search-overlay');
  const searchInput = document.getElementById('search-input');
  const searchClose = document.getElementById('search-close');
  const searchResults = document.getElementById('search-results');

  if (searchToggle && searchOverlay) {
    searchToggle.addEventListener('click', function() {
      searchOverlay.classList.add('open');
      setTimeout(function() { searchInput.focus(); }, 100);
    });

    searchClose.addEventListener('click', function() {
      searchOverlay.classList.remove('open');
      searchInput.value = '';
      searchResults.innerHTML = '';
    });

    searchOverlay.addEventListener('click', function(e) {
      if (e.target === searchOverlay) {
        searchOverlay.classList.remove('open');
      }
    });

    document.addEventListener('keydown', function(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchOverlay.classList.toggle('open');
        if (searchOverlay.classList.contains('open')) {
          setTimeout(function() { searchInput.focus(); }, 100);
        }
      }
      if (e.key === 'Escape' && searchOverlay.classList.contains('open')) {
        searchOverlay.classList.remove('open');
      }
    });
  }

  // ============================================================
  // Search Index (loaded from search-index.json)
  // ============================================================
  let searchIndex = null;

  async function loadSearchIndex() {
    if (searchIndex) return searchIndex;
    try {
      const resp = await fetch(window.searchBaseURL + 'search-index.json');
      searchIndex = await resp.json();
      return searchIndex;
    } catch (e) {
      return [];
    }
  }

  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', function() {
      clearTimeout(debounceTimer);
      const query = this.value.trim().toLowerCase();
      if (query.length < 2) {
        searchResults.innerHTML = '';
        return;
      }
      debounceTimer = setTimeout(async function() {
        const index = await loadSearchIndex();
        const results = index.filter(item => {
          return (item.title && item.title.toLowerCase().includes(query)) ||
                 (item.tags && item.tags.toLowerCase().includes(query)) ||
                 (item.content && item.content.toLowerCase().includes(query));
        }).slice(0, 10);

        if (results.length === 0) {
          searchResults.innerHTML = '<div class="search-empty">No results found for "' + query + '"</div>';
          return;
        }

        searchResults.innerHTML = results.map(function(item) {
          return '<a href="' + item.url + '" class="search-result-item">' +
            '<div class="search-result-title">' + item.title + '</div>' +
            '<div class="search-result-excerpt">' + (item.excerpt || '') + '</div>' +
            '<div class="search-result-meta">' +
              (item.tags ? '<span>' + item.tags + '</span>' : '') +
              (item.date ? '<span>' + item.date + '</span>' : '') +
            '</div>' +
          '</a>';
        }).join('');
      }, 200);
    });
  }

  // ============================================================
  // Image Zoom
  // ============================================================
  const imageZoomOverlay = document.getElementById('image-zoom');
  const zoomedImage = document.getElementById('zoomed-image');
  const imageZoomClose = document.getElementById('image-zoom-close');

  if (imageZoomOverlay && zoomedImage) {
    document.querySelectorAll('.article-body img, .article-content img').forEach(function(img) {
      img.classList.add('img-zoomable');
      img.addEventListener('click', function() {
        zoomedImage.src = this.src;
        zoomedImage.alt = this.alt;
        imageZoomOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeImageZoom() {
      imageZoomOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (imageZoomClose) imageZoomClose.addEventListener('click', closeImageZoom);
    imageZoomOverlay.addEventListener('click', function(e) {
      if (e.target === imageZoomOverlay) closeImageZoom();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeImageZoom();
    });
  }

  // ============================================================
  // Back to Top Button
  // ============================================================
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================================
  // Intersection Observer for Fade-in Animations
  // ============================================================
  // if ('IntersectionObserver' in window) {
  //   const observer = new IntersectionObserver(function(entries) {
  //     entries.forEach(function(entry) {
  //       if (entry.isIntersecting) {
  //         entry.target.classList.add('animate-fade-in-up');
  //         observer.unobserve(entry.target);
  //       }
  //     });
  //   }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  //   document.querySelectorAll('.feature-card, .article-card, .project-card, .metric-card').forEach(function(el) {
  //     el.style.opacity = '0';
  //     observer.observe(el);
  //   });
  // }

})();
