(function() {
  'use strict';

  const article = document.getElementById('article-content');
  const progressBar = document.getElementById('reading-progress');
  const tocList = document.getElementById('toc-list');
  const tocWrapper = document.querySelector('.article-toc-wrapper');

  if (!article) return;

  // ============================================================
  // Reading Progress Bar
  // ============================================================
  if (progressBar) {
    window.addEventListener('scroll', function() {
      var totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        var progress = (window.pageYOffset / totalHeight) * 100;
        progressBar.style.transform = 'scaleX(' + (progress / 100) + ')';
      }
    }, { passive: true });
  }

  // ============================================================
  // Table of Contents Generation
  // ============================================================
  if (tocList) {
    var headings = article.querySelectorAll('h2, h3');
    if (headings.length > 0) {
      if (tocWrapper) tocWrapper.style.display = 'block';

      var headingMap = [];

      headings.forEach(function(heading) {
        if (!heading.id) {
          heading.id = heading.textContent
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        }

        var item = document.createElement('div');
        item.className = 'toc-item toc-' + heading.tagName.toLowerCase();

        var link = document.createElement('a');
        link.className = 'toc-link';
        link.href = '#' + heading.id;
        link.textContent = heading.textContent;

        item.appendChild(link);
        tocList.appendChild(item);

        headingMap.push({ heading: heading, link: link });
      });

      // Highlight active TOC item on scroll
      function highlightTOC() {
        var scrollPos = window.scrollY + 120;
        var activeIndex = -1;

        for (var i = 0; i < headingMap.length; i++) {
          if (scrollPos >= headingMap[i].heading.offsetTop) {
            activeIndex = i;
          } else {
            break;
          }
        }

        headingMap.forEach(function(item, index) {
          if (index === activeIndex) {
            item.link.classList.add('active');
          } else {
            item.link.classList.remove('active');
          }
        });
      }

      window.addEventListener('scroll', highlightTOC, { passive: true });
      highlightTOC();
    }
  }

  // ============================================================
  // Copy Code Buttons
  // ============================================================
  document.querySelectorAll('pre code').forEach(function(codeBlock) {
    var pre = codeBlock.parentElement;
    if (pre.querySelector('.copy-btn')) return;

    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.setAttribute('aria-label', 'Copy code');

    btn.addEventListener('click', function() {
      navigator.clipboard.writeText(codeBlock.textContent).then(function() {
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(function() {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 2000);
      });
    });

    pre.style.position = 'relative';
    pre.appendChild(btn);
  });

})();
