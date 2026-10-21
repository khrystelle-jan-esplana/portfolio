(function () {
  var root = document.documentElement;
  var toggle = document.querySelector('.theme-toggle');
  var header = document.querySelector('.site-header');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- light / dark mode (same saved setting as the landing page) ---------- */
  function setTheme(mode) {
    root.setAttribute('data-theme', mode);
    toggle.setAttribute(
      'aria-label',
      mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
    );
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', mode === 'dark' ? '#5f4467' : '#f9f8fe');
    try { localStorage.setItem('theme', mode); } catch (e) {}
  }

  setTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

  toggle.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    if (document.startViewTransition && !reduce) {
      document.startViewTransition(function () { setTheme(next); });
    } else {
      setTheme(next);
    }
  });

  /* ---------- header gets a soft blurry background once you scroll ---------- */
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 30);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- icons: <img data-icon="leaf"> finds leaf.svg in your icons folder ---------- */
  /* if your folder has another name, add it to this list (the first one that works is used) */
  var ICON_DIRS = ['Icons/', 'icons/', 'Images/icons/', 'Images/Icons/', 'Images/'];
  var foundDir = null;

  document.querySelectorAll('img[data-icon]').forEach(function (img) {
    var file = img.getAttribute('data-icon') + '.svg';
    var queue = foundDir ? [foundDir] : ICON_DIRS.slice();
    var current = null;
    function next() {
      if (!queue.length) { img.style.visibility = 'hidden'; return; }
      current = queue.shift();
      img.src = current + file;
    }
    img.addEventListener('load', function () { foundDir = foundDir || current; });
    img.addEventListener('error', next);
    next();
  });

  /* ---------- polaroid photo: Images/polaroid_img.(jpg | jpeg | png | webp) ---------- */
  var photo = document.querySelector('img[data-photo]');
  if (photo) {
    var base = 'Images/' + photo.getAttribute('data-photo');
    var exts = ['jpg', 'jpeg', 'png', 'webp', 'JPG', 'PNG', 'avif'];
    (function tryNext() {
      if (!exts.length) return;
      var test = new Image();
      var url = base + '.' + exts.shift();
      test.onload = function () { photo.src = url; photo.classList.add('loaded'); };
      test.onerror = tryNext;
      test.src = url;
    })();
  }

  /* ---------- scroll triggers ---------- */
  function watch(selector, options, callback) {
    var els = document.querySelectorAll(selector);
    if (!('IntersectionObserver' in window)) {
      els.forEach(callback);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          callback(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, options);
    els.forEach(function (el) { io.observe(el); });
  }

  /* fade-and-slide in on scroll */
  watch('.reveal', { threshold: 0.15, rootMargin: '0px 0px -6% 0px' }, function (el) {
    el.classList.add('visible');
  });

  /* scrapbook: everything in the about me panel gets "stuck on" once you scroll to it */
  watch('.panel', { threshold: 0.22 }, function (el) { el.classList.add('in'); });

  /* ---------- technical skills: stars light up one by one and connect ---------- */
  var box = document.querySelector('.skills');
  if (box) {
    var nodes = Array.prototype.slice.call(box.querySelectorAll('.skill'));
    var svg = box.querySelector('.skills-lines');
    var NS = 'http://www.w3.org/2000/svg';
    var lit = 0;   // how many stars are already lit (a resize keeps the lines that are drawn)

    function drawLines() {
      var rect = box.getBoundingClientRect();
      svg.setAttribute('viewBox', '0 0 ' + rect.width + ' ' + rect.height);
      svg.innerHTML = '';
      for (var i = 1; i < nodes.length; i++) {
        var a = nodes[i - 1].querySelector('.sk-star').getBoundingClientRect();
        var b = nodes[i].querySelector('.sk-star').getBoundingClientRect();
        var line = document.createElementNS(NS, 'line');
        line.setAttribute('x1', a.left + a.width / 2 - rect.left);
        line.setAttribute('y1', a.top + a.height / 2 - rect.top);
        line.setAttribute('x2', b.left + b.width / 2 - rect.left);
        line.setAttribute('y2', b.top + b.height / 2 - rect.top);
        line.setAttribute('pathLength', '1');
        if (i < lit) line.classList.add('drawn');
        svg.appendChild(line);
      }
    }
    drawLines();
    window.addEventListener('resize', drawLines);

    /* tiny twinkling sparkles scattered over the section */
    for (var s = 0; s < 36; s++) {
      var sp = document.createElement('span');
      sp.className = 'sparkle';
      sp.style.setProperty('--sx', (Math.random() * 100).toFixed(1) + '%');
      sp.style.setProperty('--sy', (Math.random() * 100).toFixed(1) + '%');
      sp.style.setProperty('--ss', (6 + Math.random() * 11).toFixed(1) + 'px');
      sp.style.setProperty('--sd', (2.4 + Math.random() * 3).toFixed(1) + 's');
      sp.style.setProperty('--sl', (Math.random() * 4).toFixed(1) + 's');
      box.appendChild(sp);
    }

    function burst(node) {
      for (var k = 0; k < 7; k++) {
        var b = document.createElement('span');
        b.className = 'burst';
        var ang = (Math.PI * 2 * k) / 7 + Math.random() * 0.5;
        var dist = 34 + Math.random() * 26;
        b.style.setProperty('--dx', (Math.cos(ang) * dist).toFixed(1) + 'px');
        b.style.setProperty('--dy', (Math.sin(ang) * dist).toFixed(1) + 'px');
        node.appendChild(b);
        (function (el) { setTimeout(function () { el.remove(); }, 1100); })(b);
      }
    }

    function light(i) {
      nodes[i].classList.add('on');
      lit = i + 1;
      if (!reduce) burst(nodes[i]);
    }

    function draw(i) {
      var line = svg.children[i - 1];   // the line that arrives at star i
      if (line) line.classList.add('drawn');
    }

    function play() {
      box.classList.add('go');
      if (reduce) {
        nodes.forEach(function (_, i) { light(i); if (i) draw(i); });
        return;
      }
      var STEP = 750;
      nodes.forEach(function (_, i) {
        /* the line grows from the previous star, then the next star lights up */
        if (i > 0) setTimeout(function () { draw(i); }, 300 + i * STEP - 520);
        setTimeout(function () { light(i); }, 300 + i * STEP);
      });
    }

    watch('.skills', { threshold: 0.4 }, play);
  }
})();
