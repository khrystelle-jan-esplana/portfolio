(function () {
  var root = document.documentElement;
  if (!root.classList.contains('intro-active')) return;   // opened normally: nothing to do

  /* reduced motion: skip the whole show instantly */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.remove('intro-active');
    return;
  }

  var headerLogo = document.querySelector('.site-header .logo svg');
  if (!headerLogo) { root.classList.remove('intro-active'); return; }

  window.scrollTo(0, 0);

  /* ---------- build the overlay (the logo is cloned from the header) ---------- */
  var big = headerLogo.cloneNode(true);
  big.setAttribute('aria-hidden', 'true');
  big.removeAttribute('role');
  big.removeAttribute('aria-label');

  var stars = [[22, 30], [78, 28], [30, 76], [74, 74]].map(function (p) {
    return '<div class="intro-bgstar" style="left:' + p[0] + '%;top:' + p[1] + '%"><svg viewBox="0 -135 541 590" aria-hidden="true"><use href="#bgstar-g"/></svg></div>';
  }).join('');

  var intro = document.createElement('div');
  intro.className = 'intro';
  intro.setAttribute('aria-hidden', 'true');
  intro.innerHTML =
    '<div class="intro-stage">' + stars + '<div class="intro-logo"><div class="intro-pop"></div></div></div>' +
    '<div class="intro-half intro-half--top"></div>' +
    '<div class="intro-half intro-half--bottom"></div>' +
    '<div class="intro-seam"></div>';
  document.body.appendChild(intro);

  var logoBox = intro.querySelector('.intro-logo');
  intro.querySelector('.intro-pop').appendChild(big);

  /* ---------- when the writing is done, fly the logo to its header spot ---------- */
  var moved = false;
  function moveToCorner() {
    if (moved) return;
    moved = true;

    var src = big.getBoundingClientRect();
    var dst = headerLogo.getBoundingClientRect();
    var s = dst.width / src.width;
    var dx = (dst.left + dst.width / 2) - (src.left + src.width / 2);
    var dy = (dst.top + dst.height / 2) - (src.top + src.height / 2);

    intro.classList.add('leaving');   // the background fades away while the logo flies
    logoBox.style.transform =
      'translate(calc(-50% + ' + dx + 'px), calc(-50% + ' + dy + 'px)) scale(' + s + ')';

    setTimeout(finish, 1200);
  }

  function finish() {
    // swap: the real header logo appears exactly where the flying one landed
    root.classList.remove('intro-active');
    root.classList.add('intro-reveal');      // about me pill + stars pop in
    intro.remove();
    setTimeout(function () { root.classList.remove('intro-reveal'); }, 2500);
  }

  var paths = big.querySelectorAll('.w');
  var last = paths[paths.length - 1];
  if (last) {
    last.addEventListener('animationend', function () { setTimeout(moveToCorner, 550); });
  }

  setTimeout(moveToCorner, 9000);   // safety net
})();