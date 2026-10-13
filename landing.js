(function () {
  var root = document.documentElement;
  var stage = document.querySelector('.stage');
  var toggle = document.querySelector('.theme-toggle');
  var clusters = Array.prototype.slice.call(document.querySelectorAll('.cluster'));

  /* ---------- 1. scale the fixed-size stage to fit the window ---------- */
  function fit() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    var tall = window.matchMedia('(max-aspect-ratio: 5/6)').matches;
    var bw = tall ? 800 : 1920;   // design size of the layout
    var bh = tall ? 1400 : 1080;
    var s = Math.min(w / bw, h / bh);
    root.style.setProperty('--s', s.toFixed(4));
    // background stars use a "cover" unit so they always fill the screen
    root.style.setProperty('--u', Math.max(w / 1920, h / 1080).toFixed(4));
    // the stage now covers the whole window, so its corners are the screen's corners
    stage.style.width = (w / s) + 'px';
    stage.style.height = (h / s) + 'px';
    // the moon/sun's left edge, in stage units
    root.style.setProperty('--moon-x', (Math.max(20, 0.05 * w) / s).toFixed(1));
  }
  fit();
  window.addEventListener('resize', fit);

  /* ---------- 2. start the intro once fonts are ready ---------- */
  var started = false;
  function go() {
    if (started) return;
    started = true;
    root.classList.add('go');
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(go);
    setTimeout(go, 1500); // never wait forever on a slow connection
  } else {
    go();
  }

  /* ---------- 3. light / dark mode ---------- */
  function setTheme(mode) {
    root.setAttribute('data-theme', mode);
    toggle.setAttribute(
      'aria-label',
      mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
    );
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', mode === 'dark' ? '#5c4468' : '#faf9fe');
    try { localStorage.setItem('theme', mode); } catch (e) {}
  }

  setTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

  toggle.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (document.startViewTransition && !reduce) {
      document.startViewTransition(function () { setTheme(next); });
    } else {
      setTheme(next);
    }
  });

  /* ---------- 4. open a star's labels on hover / tap ---------- */
  var closeTimers = new WeakMap();
  var touchOnly = window.matchMedia('(hover: none)');

  function open(c) {
    clearTimeout(closeTimers.get(c));
    clusters.forEach(function (o) { if (o !== c) close(o, true); });
    c.classList.add('open');
  }
  function close(c, now) {
    clearTimeout(closeTimers.get(c));
    if (now) { c.classList.remove('open'); return; }
    // short grace period so the cursor can travel from the star to a label
    closeTimers.set(c, setTimeout(function () { c.classList.remove('open'); }, 350));
  }

  clusters.forEach(function (c) {
    var star = c.querySelector('.star');
    var labels = Array.prototype.slice.call(c.querySelectorAll('.label'));

    [star].concat(labels).forEach(function (el) {
      el.addEventListener('mouseenter', function () { open(c); });
      el.addEventListener('mouseleave', function () { close(c); });
    });

    // touch screens: first tap reveals the labels, second tap follows the link
    star.addEventListener('click', function (e) {
      if (touchOnly.matches && !c.classList.contains('open')) {
        e.preventDefault();
        open(c);
      }
    });
  });

  document.addEventListener('pointerdown', function (e) {
    if (!e.target.closest('.cluster')) {
      clusters.forEach(function (c) { close(c, true); });
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') clusters.forEach(function (c) { close(c, true); });
  });

    /* ---------- little star after each sub-category ---------- */
  document.querySelectorAll('.label').forEach(function (label) {
    label.insertAdjacentHTML(
      'beforeend',
      '<svg class="dot-star" viewBox="0 0 97 97" aria-hidden="true"><use href="#star-g"/></svg>'
    );
  });
  
})();

