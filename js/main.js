/* O PALCO DO TEMPO (linktree)
   1) monta a lista de videos a partir de videos.config.js
   2) abertura (cortinas), pelicula e encerramento com GSAP
   3) spritesheet do projetor (so aparece se o arquivo existir) */
(function () {
  'use strict';

  var OPEN = 0.14; // largura de cortina aberta (igual a --open no CSS)
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  if (!hasGsap) document.documentElement.classList.remove('js'); // cortinas abertas, conteudo visivel

  function h(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  // Aceita links do Drive em varios formatos e devolve o link "view". Outros http(s) passam direto.
  function cleanUrl(u) {
    u = (u || '').trim();
    if (!u) return '';
    var m = u.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([\w-]+)/);
    if (m) return 'https://drive.google.com/file/d/' + m[1] + '/view';
    return /^https?:\/\//i.test(u) ? u : '';
  }

  function rng(seed) { return function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }; }
  function tornPolygon(seed) {
    var r = rng(seed * 7919 + 13), n = 36, amp = 6, p = [], i;
    for (i = 0; i <= n; i++) p.push((i / n * 100).toFixed(1) + '% ' + (r() * amp).toFixed(1) + 'px');
    for (i = 1; i < 5; i++) p.push('calc(100% - ' + (r() * amp * 0.8).toFixed(1) + 'px) ' + (i * 20) + '%');
    for (i = n; i >= 0; i--) p.push((i / n * 100).toFixed(1) + '% calc(100% - ' + (r() * amp).toFixed(1) + 'px)');
    for (i = 4; i >= 1; i--) p.push((r() * amp * 0.8).toFixed(1) + 'px ' + (i * 20) + '%');
    return 'polygon(' + p.join(',') + ')';
  }

  /* ---------- 1) videos ---------- */
  var PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 4.5v15l13-7.5z"/></svg>';

  function renderActs() {
    var list = document.getElementById('acts');
    var videos = (window.PALCO_CONFIG && window.PALCO_CONFIG.videos) || [];
    videos.forEach(function (v, i) {
      var url = cleanUrl(v.url);
      var title = (v.titulo || '').trim();
      var li = h('li', 'act' + (url ? '' : ' act--soon') + (v.descricao ? ' act--desc' : ''));
      var row = h(url ? 'a' : 'div', 'act__row');
      if (url) {
        row.href = url; row.target = '_blank'; row.rel = 'noopener noreferrer';
        row.setAttribute('aria-label', 'Assistir ' + (v.ato || '') + (title ? ': ' + title : '') + ' (abre em nova aba)');
      }
      row.style.setProperty('--torn', tornPolygon(i + 3));

      var thumb = h('div', 'act__thumb');
      thumb.setAttribute('aria-hidden', 'true');
      if (v.thumb) {
        var img = new Image(); img.alt = ''; img.loading = 'lazy'; img.decoding = 'async'; img.src = v.thumb;
        img.onerror = function () { img.remove(); };
        thumb.appendChild(img);
      }

      var body = h('div', 'act__body');
      if (title) body.appendChild(h('p', 'act__ato', v.ato));
      body.appendChild(h('h2', 'act__title', title || v.ato));
      if (v.descricao) body.appendChild(h('p', 'act__desc', v.descricao));

      var side;
      if (url) { side = h('span', 'act__play magnetic'); side.innerHTML = PLAY; side.setAttribute('role', 'img'); side.setAttribute('aria-label', 'Assistir'); }
      else { side = h('span', 'act__soon', 'Em breve'); }

      row.append(thumb, body, side);
      li.appendChild(row);
      list.appendChild(li);
    });
  }

  /* ---------- 3) spritesheet (frame a frame) ---------- */
  function initSprites() {
    document.querySelectorAll('[data-sprite]').forEach(function (el) {
      var src = el.dataset.sprite, cols = +el.dataset.cols, rows = +el.dataset.rows, n = +el.dataset.frames;
      var probe = new Image();
      var load = function () { probe.src = src; }; // se o arquivo nao existir, o elemento continua escondido
      probe.onload = function () {
        el.style.backgroundImage = 'url(' + src + ')';
        el.style.backgroundSize = (cols * 100) + '% ' + (rows * 100) + '%';
        el.style.aspectRatio = el.dataset.w + ' / ' + el.dataset.h;
        el.hidden = false;
        var cur = -1;
        function show(i) {
          i = Math.max(0, Math.min(n - 1, i | 0));
          if (i === cur) return; cur = i;
          var c = i % cols, r = Math.floor(i / cols);
          el.style.backgroundPosition = (cols > 1 ? c / (cols - 1) * 100 : 0) + '% ' + (rows > 1 ? r / (rows - 1) * 100 : 0) + '%';
        }
        show(0);
        if (reduced || !hasGsap) return;
        var fps = +el.dataset.fps || 12, t = 0, on = false;
        var tick = function (_, dt) { t += dt / 1000; show((t * fps) % n); };
        ScrollTrigger.create({ trigger: el, start: 'top bottom', end: 'bottom top',
          onToggle: function (s) { if (s.isActive && !on) { gsap.ticker.add(tick); on = true; } else if (!s.isActive && on) { gsap.ticker.remove(tick); on = false; } } });
      };
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (es) {
          if (es.some(function (e) { return e.isIntersecting; })) { io.disconnect(); load(); }
        }, { rootMargin: '900px 0px' });
        io.observe(el.parentElement);
      } else { load(); }
    });
  }

  function buildFilm() {
    var track = document.getElementById('filmTrack'), i;
    for (i = 0; i < 112; i++) track.appendChild(h('span', 'frame'));
  }

  /* ---------- 2) animacoes ---------- */
  function animate() {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    /* Abertura: cortinas recolhem para as laterais e os videos entram */
    var intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
    intro
      .to('.stage .curtain', { scaleX: OPEN, duration: 1.8, delay: 0.2, ease: 'power3.inOut' }, 0)
      .from('.beam', { opacity: 0, duration: 1.4 }, 0.9)
      .from('.act', { opacity: 0, y: 36, duration: 0.8, stagger: 0.09 }, 1.1);
    // quem rolar ou tocar nao espera a abertura terminar
    ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(function (ev) {
      addEventListener(ev, function () { intro.timeScale(8); }, { once: true, passive: true });
    });

    /* Luz de palco: segue o ponteiro no desktop, balanca sozinha no toque */
    var beams = [['.beam--l', -9], ['.beam--r', 9]];
    if (finePointer) {
      var q = beams.map(function (b) { return gsap.quickTo(b[0], 'rotation', { duration: 1.2, ease: 'power3' }); });
      addEventListener('pointermove', function (e) {
        var k = e.clientX / innerWidth - 0.5;
        q[0](beams[0][1] + k * 14); q[1](beams[1][1] + k * 14);
      }, { passive: true });
    } else {
      beams.forEach(function (b, i) {
        gsap.to(b[0], { rotation: b[1] * 0.35, duration: 5 + i, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      });
    }

    /* Pelicula desliza durante toda a rolagem */
    gsap.to('#filmTrack', { xPercent: -50, ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.6 } });

    /* Encerramento: as cortinas se fecham de novo com a rolagem */
    gsap.fromTo('.finale .curtain', { scaleX: OPEN }, { scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: '.finale', start: 'top 80%', end: 'top 12%', scrub: 0.5 } });
    gsap.from('.finale h2', { opacity: 0, y: 40, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.finale h2', start: 'top 85%', once: true } });

    /* Botoes magneticos (so com mouse) */
    if (finePointer) {
      document.querySelectorAll('.magnetic').forEach(function (el) {
        var xt = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
        var yt = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
        var host = el.closest('a') || el;
        host.addEventListener('pointermove', function (e) {
          var r = el.getBoundingClientRect();
          xt((e.clientX - r.left - r.width / 2) * 0.3); yt((e.clientY - r.top - r.height / 2) * 0.3);
        });
        host.addEventListener('pointerleave', function () { xt(0); yt(0); });
      });
    }

    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }

  /* cabecalho ganha fundo ao rolar */
  var top = document.querySelector('.top');
  function onScroll() { top.classList.toggle('is-solid', scrollY > 60); }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  renderActs();
  buildFilm();
  if (reduced || !hasGsap) {
    document.querySelectorAll('.curtain').forEach(function (c) { c.style.transform = 'scaleX(' + OPEN + ')'; });
  }
  if (hasGsap && !reduced) animate();
  initSprites();
})();
