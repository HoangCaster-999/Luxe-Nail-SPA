/* Luxe Nail & Spa — interactions */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------------- Price list data (from printed menu) ---------------- */
  const MENU = [
    { id: 'acrylic', title: 'Acrylic Nails', items: [
      ['Full Set Acrylic With Gel Colour', '£32', 'treatments/acrylic-full-set.jpg'],
      ['Full Set Permanent White Tip', '£30', 'p13038494.jpg'],
      ['Overlay On Natural Nails With Gel Colour', '£30', 'treatments/natural-acrylic-overlay.jpg'],
      ['Infill With Gel Colour', '£27', 'treatments/acrylic-infill.jpg'],
    ]},
    { id: 'pedicure', title: 'Full Spa Pedicure', items: [
      ['Spa Pedicure Without Gel', '£35', 'p5240677.jpg'],
      ['Spa Pedicure With Gel Colour', '£40', 'p9789201.jpg'],
    ]},
    { id: 'toes', title: 'Acrylic Toes', items: [
      ['Full Set Acrylic Toes With Gel Colour', '£35', 'treatments/acrylic-toes.jpg'],
      ['Acrylic On One Toe', '£3', 'treatments/single-toe-acrylic.jpg'],
    ]},
    { id: 'takeoff', title: 'Take Off', items: [
      ['Take Off Acrylic Only', '£10', 'treatments/acrylic-removal.jpg'],
      ['Take Off Gel Colour Only', '£7', 'treatments/gel-removal.jpg'],
      ['Take Off Gel Toes & Redone French Tip', '£28', 'treatments/french-toes-redone.jpg'],
      ['Take Off And Newset', 'Extra £3', 'treatments/takeoff-newset.jpg'],
    ]},
    { id: 'ombre', title: 'Ombre / Powder Colour', items: [
      ['Full Set Ombre', '£35', 'retouched/soft-white-ombre.jpg'],
      ['Infill Ombre', '£30', 'treatments/ombre-infill.jpg'],
    ]},
    { id: 'gel', title: 'Gel Colour', items: [
      ['Gel Colour On Natural Nail', '£20', 'p939835.jpg'],
      ['Gel Toes', '£22', 'treatments/gel-toes.jpg'],
      ['Take Off And Redone', 'Extra £3', 'p7755217.jpg'],
      ['Kids Gel Colour', 'From £10 – £15', 'treatments/kids-gel-colour.jpg'],
    ]},
    { id: 'biab', title: 'BIAB / Builder Gel', items: [
      ['BIAB Natural Nails', '£30', 'treatments/biab-natural.jpg'],
      ['BIAB Extension', '£35', 'treatments/biab-extension.jpg'],
    ]},
    { id: 'extras', title: 'Extra Services', items: [
      ['French / White Tips', 'From extra £5', 'retouched/pearl-gold-french.jpg'],
      ['Design', 'From extra £5', 'retouched/magenta-gold-florals.jpg'],
      ['Diamonds', 'From extra £5', 'retouched/crystal-floral-french.jpg'],
    ]},
  ];

  const tabsEl = $('.tabs');
  const gridEl = $('.menu-grid');
  const emptyEl = $('.prices__empty');
  const searchEl = $('.search input');
  let activeCat = 'acrylic';

  const escapeHtml = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const highlight = (text, q) => {
    const safe = escapeHtml(text);
    if (!q) return safe;
    const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig');
    return safe.replace(re, '<mark>$1</mark>');
  };

  [{ id: 'all', title: 'All' }, ...MENU].forEach((c) => {
    const b = document.createElement('button');
    b.className = 'tab';
    b.setAttribute('aria-pressed', c.id === activeCat);
    b.dataset.cat = c.id;
    b.textContent = c.title;
    tabsEl.append(b);
  });

  function renderMenu() {
    const q = searchEl.value.trim().toLowerCase();
    const cats = MENU.filter((c) => activeCat === 'all' || c.id === activeCat);
    let html = '';
    cats.forEach((c) => {
      const items = c.items.filter(([n]) => !q || n.toLowerCase().includes(q) || c.title.toLowerCase().includes(q));
      if (!items.length) return;
      html += items.map(([n, p, image]) => `<article class="menu-card">
        <img class="menu-card__image" src="images/${image}" alt="${escapeHtml(n)}" loading="lazy" width="480" height="480">
        <div class="menu-card__body"><p class="menu-card__category">${escapeHtml(c.title)}</p><h3>${highlight(n, q)}</h3><span class="menu-item__price">${escapeHtml(p)}</span></div>
        <a class="svc__book" href="mailto:Luxenailandspa27@gmail.com?subject=${encodeURIComponent(`Appointment request - ${n}`)}&amp;body=${encodeURIComponent(`Hello Luxe Nail & Spa,\r\n\r\nI would like to request an appointment.\r\nService: ${n}\r\nPreferred date: \r\nPreferred time: \r\nName: \r\nPhone: \r\n\r\nPlease confirm availability. Thank you.`)}" aria-label="Email to book ${escapeHtml(n)}">Book Now <span aria-hidden="true">&nearr;</span></a>
      </article>`).join('');
    });
    gridEl.innerHTML = html;
    emptyEl.hidden = !!html;
  }
  tabsEl.addEventListener('click', (e) => {
    const b = e.target.closest('.tab');
    if (!b) return;
    activeCat = b.dataset.cat;
    $$('.tab', tabsEl).forEach((t) => t.setAttribute('aria-pressed', t === b));
    renderMenu();
  });
  searchEl.addEventListener('input', () => {
    if (searchEl.value && activeCat !== 'all') {
      activeCat = 'all';
      $$('.tab', tabsEl).forEach((t) => t.setAttribute('aria-pressed', t.dataset.cat === 'all'));
    }
    renderMenu();
  });
  renderMenu();

  /* ---------------- Open / closed status (UK time) ---------------- */
  const HOURS = { 0: null, 1: [9, 18.5], 2: [9, 18.5], 3: [9, 18.5], 4: [9, 18.5], 5: [9, 18.5], 6: [9, 18] };
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const fmt = (h) => {
    const hr = Math.floor(h), m = Math.round((h - hr) * 60);
    return `${hr % 12 || 12}${m ? ':' + String(m).padStart(2, '0') : ''}${hr < 12 ? 'am' : 'pm'}`;
  };
  function londonNow() {
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
    }).formatToParts(new Date()).map((p) => [p.type, p.value]));
    return { day: DAYS.indexOf(parts.weekday), time: +parts.hour + +parts.minute / 60 };
  }
  function updateStatus() {
    const { day, time } = londonNow();
    const today = HOURS[day];
    const open = today && time >= today[0] && time < today[1];
    let text;
    if (open) {
      text = `Open now · until ${fmt(today[1])}`;
    } else if (today && time < today[0]) {
      text = `Closed · opens ${fmt(today[0])}`;
    } else {
      let d = (day + 1) % 7;
      while (!HOURS[d]) d = (d + 1) % 7;
      text = `Closed · opens ${d === (day + 1) % 7 ? 'tomorrow' : DAYS[d]} ${fmt(HOURS[d][0])}`;
    }
    $$('[data-status]').forEach((el) => {
      el.classList.toggle('is-open', !!open);
      el.classList.toggle('is-closed', !open);
      el.lastElementChild.textContent = text;
    });
    $$('.hours tr').forEach((tr) => tr.classList.toggle('is-today', +tr.dataset.day === day));
  }
  updateStatus();
  setInterval(updateStatus, 60_000);

  /* ---------------- Header, progress, active nav ---------------- */
  const header = $('.header');
  const progress = $('.progress');
  const navLinks = $$('.nav a');
  const sections = navLinks.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  function onScroll() {
    const y = scrollY;
    header.classList.toggle('is-scrolled', y > 10);
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    let current = null;
    sections.forEach((s) => { if (s.getBoundingClientRect().top < innerHeight * 0.35) current = s; });
    navLinks.forEach((a) => a.classList.toggle('is-active', current && a.getAttribute('href') === '#' + current.id));
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const burger = $('.burger');
  const nav = $('.nav');
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', open);
    nav.classList.toggle('is-open', open);
  });
  navLinks.forEach((a) => a.addEventListener('click', () => {
    burger.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  }));

  /* ---------------- Section reveals ---------------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      io.unobserve(en.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach((el) => io.observe(el));

  /* ---------------- Lightbox ---------------- */
  const lb = $('.lightbox'), lbImg = $('img', lb);
  let group = [], gi = 0;
  function openLb(list, i) {
    group = list; gi = i;
    showLb();
    lb.hidden = false;
    syncGalleryPlayback();
    document.body.style.overflow = 'hidden';
    $$('.lightbox__arrow', lb).forEach((a) => { a.hidden = group.length < 2; });
  }
  function showLb() {
    lbImg.src = group[gi].src;
    lbImg.alt = group[gi].alt;
  }
  function closeLb() { lb.hidden = true; document.body.style.overflow = ''; syncGalleryPlayback(); }
  const galleryItems = $$('.masonry__item');
  let galleryIndex = 0;
  const featured = $('.gallery__featured img');
  const galleryTrack = $('.gallery__track');
  const slideImages = $$('[data-gallery-offset]');
  let slideAnimations = [];
  const gallerySection = $('#gallery');
  const playbackButton = $('[data-gallery-playback]');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let galleryPaused = reducedMotion.matches;
  let galleryVisible = false;
  let galleryTimer;
  function syncGalleryPlayback() {
    clearInterval(galleryTimer);
    playbackButton.textContent = galleryPaused ? 'Play slideshow' : 'Pause slideshow';
    playbackButton.setAttribute('aria-pressed', galleryPaused);
    $('.gallery__counter').setAttribute('aria-live', galleryPaused ? 'polite' : 'off');
    $('.gallery__caption').setAttribute('aria-live', galleryPaused ? 'polite' : 'off');
    const interacting = gallerySection.contains(document.activeElement) && document.activeElement !== playbackButton;
    if (galleryPaused || !galleryVisible || document.hidden || !lb.hidden || interacting) return;
    galleryTimer = setInterval(() => selectGallery(galleryIndex + 1), 4500);
  }
  function renderGalleryPhotos(index) {
    slideImages.forEach((img) => {
      const item = galleryItems[(index + +img.dataset.galleryOffset + galleryItems.length) % galleryItems.length];
      img.src = item.dataset.lightboxSrc;
      img.alt = +img.dataset.galleryOffset === 0 ? $('img', item).alt : '';
    });
  }
  function selectGallery(i, animate = true) {
    slideAnimations.forEach((animation) => animation.cancel());
    slideAnimations = [];
    const previous = galleryIndex;
    renderGalleryPhotos(previous);
    galleryIndex = (i + galleryItems.length) % galleryItems.length;
    const selected = galleryItems[galleryIndex];
    $('.gallery__caption').textContent = $('img', selected).alt;
    galleryItems.forEach((b, j) => b.setAttribute('aria-pressed', j === galleryIndex));
    $('.gallery__counter').textContent = `${galleryIndex + 1} / ${galleryItems.length}`;
    const forward = galleryIndex === (previous + 1) % galleryItems.length;
    const backward = galleryIndex === (previous - 1 + galleryItems.length) % galleryItems.length;
    if (animate && !reducedMotion.matches && (forward || backward)) {
      const direction = forward ? 1 : -1;
      const distance = $('.gallery__featured').getBoundingClientRect().width + parseFloat(getComputedStyle(galleryTrack).gap);
      const options = { duration: 650, easing: 'cubic-bezier(.22,.68,.25,1)', fill: 'forwards' };
      const motion = galleryTrack.animate([{ transform: 'translateX(-50%)' }, { transform: `translateX(calc(-50% - ${direction * distance}px))` }], options);
      const incoming = slideImages.find((img) => +img.dataset.galleryOffset === direction);
      slideAnimations = [motion, incoming.animate({ opacity: [.85, 1] }, options), featured.animate({ opacity: [1, .85] }, options)];
      motion.onfinish = () => {
        if (slideAnimations[0] !== motion) return;
        renderGalleryPhotos(galleryIndex);
        slideAnimations.forEach((animation) => animation.cancel());
        slideAnimations = [];
      };
    } else {
      renderGalleryPhotos(galleryIndex);
    }
    syncGalleryPlayback();
  }
  playbackButton.addEventListener('click', () => {
    galleryPaused = !galleryPaused;
    syncGalleryPlayback();
  });
  const galleryObserver = new IntersectionObserver(([entry]) => {
    galleryVisible = entry.intersectionRatio >= .15;
    syncGalleryPlayback();
  }, { threshold: .15 });
  galleryObserver.observe(gallerySection);
  ['focusin', 'focusout'].forEach((event) => {
    gallerySection.addEventListener(event, () => queueMicrotask(syncGalleryPlayback));
  });
  document.addEventListener('visibilitychange', syncGalleryPlayback);
  reducedMotion.addEventListener('change', (event) => {
    if (event.matches) galleryPaused = true;
    syncGalleryPlayback();
  });
  galleryItems.forEach((b, i) => {
    b.setAttribute('aria-label', `Show ${$('img', b).alt}`);
    b.addEventListener('click', () => { galleryPaused = true; selectGallery(i); });
  });
  $$('[data-gallery-dir]').forEach((b) => b.addEventListener('click', () => { galleryPaused = true; selectGallery(galleryIndex + +b.dataset.galleryDir); }));
  $('.gallery__featured').addEventListener('click', () => openLb(galleryItems.map((g) => ({ src: g.dataset.lightboxSrc, alt: $('img', g).alt })), galleryIndex));
  selectGallery(0, false);
  $$('[data-lightbox-src]:not(.masonry__item)').forEach((b) => b.addEventListener('click', () => openLb([{ src: b.dataset.lightboxSrc, alt: b.dataset.lightboxAlt || '' }], 0)));
  $('.lightbox__close').addEventListener('click', closeLb);
  $('.lightbox__arrow--prev').addEventListener('click', () => { gi = (gi - 1 + group.length) % group.length; showLb(); });
  $('.lightbox__arrow--next').addEventListener('click', () => { gi = (gi + 1) % group.length; showLb(); });
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
  addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft' && group.length > 1) $('.lightbox__arrow--prev').click();
    if (e.key === 'ArrowRight' && group.length > 1) $('.lightbox__arrow--next').click();
  });

  /* ---------------- Nail studio ---------------- */
  const COLOURS = [
    ['Rose Quartz', '#e3a49a'], ['Nude Blush', '#e6bfac'], ['Champagne', '#e8d0ae'], ['Ballet Pink', '#f3c4cd'],
    ['Dusty Mauve', '#b98390'], ['Cherry Red', '#b3242f'], ['Berry Wine', '#7d2a45'], ['Lilac Dream', '#c3a8d8'],
    ['Sage', '#a3b796'], ['Emerald', '#1f5b4a'], ['Midnight', '#2a2b44'], ['Milky White', '#f7f1ea'], ['Gold Foil', '#c9a063'],
  ];
  const FINGERS = [
    { x: 104, y: 300, len: 150, rot: -14, w: 46 },
    { x: 160, y: 282, len: 196, rot: -5, w: 52 },
    { x: 218, y: 276, len: 214, rot: 1, w: 54 },
    { x: 276, y: 284, len: 190, rot: 8, w: 52 },
    { x: 318, y: 372, len: 124, rot: 36, w: 58 },
  ];
  const EXT = { square: 8, round: 6, almond: 26, coffin: 30, stiletto: 46 };
  const state = { shape: 'almond', colour: COLOURS[0], finish: 'gloss', diamonds: false };

  function nailPath(shape, len, w) {
    const nw = w - 16, L = -nw / 2, R = nw / 2;
    const cy = -len + nw * 1.05;            // cuticle line
    const ty = -len + 4 - EXT[shape];        // tip
    const h = cy - ty;
    const cut = `L${R},${cy} Q0,${cy + 9} ${L},${cy} Z`;
    switch (shape) {
      case 'square':
        return `M${L},${cy} L${L},${ty + 5} Q${L},${ty} ${L + 5},${ty} L${R - 5},${ty} Q${R},${ty} ${R},${ty + 5} ${cut}`;
      case 'round':
        return `M${L},${cy} L${L},${ty + nw / 2} Q${L},${ty} 0,${ty} Q${R},${ty} ${R},${ty + nw / 2} ${cut}`;
      case 'coffin':
        return `M${L},${cy} L${L},${ty + h * 0.55} L${L + nw * 0.24},${ty + 2} Q${L + nw * 0.26},${ty} ${L + nw * 0.32},${ty} L${R - nw * 0.32},${ty} Q${R - nw * 0.26},${ty} ${R - nw * 0.24},${ty + 2} L${R},${ty + h * 0.55} ${cut}`;
      case 'stiletto':
        return `M${L},${cy} L${L},${ty + h * 0.62} Q${L + 2},${ty + h * 0.22} 0,${ty} Q${R - 2},${ty + h * 0.22} ${R},${ty + h * 0.62} ${cut}`;
      default: // almond
        return `M${L},${cy} L${L},${ty + h * 0.5} Q${L + 1},${ty + 3} 0,${ty} Q${R - 1},${ty + 3} ${R},${ty + h * 0.5} ${cut}`;
    }
  }
  function tipPath(shape, len, w) {
    const nw = w - 16;
    const cy = -len + nw * 1.05, ty = -len + 4 - EXT[shape];
    const fy = ty + (cy - ty) * 0.38;
    return `M${-nw},${ty - 4} L${nw},${ty - 4} L${nw},${fy - 4} Q0,${fy + 10} ${-nw},${fy - 4} Z`;
  }

  const SVGNS = 'http://www.w3.org/2000/svg';
  const fingersG = $('.hand__fingers');
  const el = (tag, attrs = {}) => {
    const n = document.createElementNS(SVGNS, tag);
    Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
    return n;
  };

  // palm
  fingersG.append(el('path', { d: 'M80 340 Q72 268 132 262 L300 268 Q338 274 344 330 L334 470 L104 470 Z', fill: 'url(#skin)' }));
  const nails = FINGERS.map((f, i) => {
    const g = el('g', { class: 'finger', transform: `translate(${f.x} ${f.y}) rotate(${f.rot})` });
    g.append(el('rect', { x: -f.w / 2, y: -f.len, width: f.w, height: f.len + 60, rx: f.w / 2, fill: 'url(#skin)' }));
    g.append(el('path', { d: `M${-f.w * 0.22},${-f.len * 0.42} q${f.w * 0.22},6 ${f.w * 0.44},0`, stroke: '#d9a892', 'stroke-width': 1.4, fill: 'none', opacity: 0.6 }));
    const clipId = `nailclip${i}`;
    const clip = el('clipPath', { id: clipId });
    const clipPathEl = el('path');
    clip.append(clipPathEl);
    g.append(clip);
    const base = el('path', { class: 'nail-base' });
    const layer = el('g', { 'clip-path': `url(#${clipId})` });
    const tip = el('path', { fill: '#fffaf6' });
    const fx = el('rect', { x: -40, y: -f.len - 60, width: 80, height: 160 });
    const shine = el('rect', { x: -f.w / 2 + 11, y: -f.len - 50, width: 5, height: 200, rx: 3, fill: '#fff', opacity: 0.55 });
    layer.append(tip, fx, shine);
    const gems = el('g');
    g.append(base, layer, gems);
    fingersG.append(g);
    return { f, base, clipPathEl, tip, fx, gems };
  });

  const ombreTop = $('#ombreGrad stop:last-child');
  function renderNails() {
    const [, hex] = state.colour;
    ombreTop.setAttribute('stop-color', hex);
    nails.forEach(({ f, base, clipPathEl, tip, fx, gems }, i) => {
      const d = nailPath(state.shape, f.len, f.w);
      base.setAttribute('d', d);
      clipPathEl.setAttribute('d', d);
      base.setAttribute('fill', state.finish === 'ombre' ? 'url(#ombreGrad)' : hex);
      base.setAttribute('stroke', 'rgba(120,60,40,.18)');
      tip.setAttribute('d', tipPath(state.shape, f.len, f.w));
      tip.style.display = state.finish === 'french' ? '' : 'none';
      fx.setAttribute('fill', state.finish === 'chrome' ? 'url(#chromeGrad)' : 'url(#glitter)');
      fx.style.display = state.finish === 'chrome' || state.finish === 'glitter' ? '' : 'none';
      gems.innerHTML = '';
      if (state.diamonds && (i === 1 || i === 3)) {
        const nw = f.w - 16, cy = -f.len + nw * 1.05;
        [[0, cy - 9, 3.6], [-6, cy - 15, 2.4], [6, cy - 15, 2.4], [0, cy - 21, 1.8]].forEach(([x, y, r]) => {
          gems.append(el('circle', { cx: x, cy: y, r, fill: '#fff', stroke: '#e8c98f', 'stroke-width': 0.8 }));
          gems.append(el('circle', { cx: x - r * 0.3, cy: y - r * 0.3, r: r * 0.35, fill: '#fff8e0' }));
        });
      }
    });

    // summary + estimate
    const shapeName = state.shape[0].toUpperCase() + state.shape.slice(1);
    const finishName = { gloss: 'Glossy', french: 'French Tip', chrome: 'Chrome', glitter: 'Glitter', ombre: 'Ombre' }[state.finish];
    $('[data-summary]').textContent = `${shapeName} · ${state.colour[0]} · ${finishName}${state.diamonds ? ' · Diamonds' : ''}`;
    $('[data-colour-name]').textContent = state.colour[0];
    let price = ['coffin', 'stiletto'].includes(state.shape) ? 32 : 20;
    if (state.finish === 'ombre') price = 35;
    if (['french', 'chrome', 'glitter'].includes(state.finish)) price += 5;
    if (state.diamonds) price += 5;
    $('[data-estimate]').textContent = `from £${price}`;
  }

  const swatchesEl = $('.swatches');
  COLOURS.forEach((c, i) => {
    const b = document.createElement('button');
    b.className = 'swatch' + (i === 0 ? ' is-active' : '');
    b.style.background = c[1];
    b.title = c[0];
    b.setAttribute('aria-label', c[0]);
    b.addEventListener('click', () => {
      state.colour = c;
      $$('.swatch', swatchesEl).forEach((s) => s.classList.toggle('is-active', s === b));
      renderNails();
    });
    swatchesEl.append(b);
  });
  $$('.studio .chips').forEach((group) => {
    group.addEventListener('click', (e) => {
      const b = e.target.closest('.chip');
      if (!b) return;
      const opt = group.dataset.opt;
      if (opt === 'extra') {
        state.diamonds = !state.diamonds;
        b.classList.toggle('is-active', state.diamonds);
        b.setAttribute('aria-pressed', state.diamonds);
      } else {
        state[opt] = b.dataset.val;
        $$('.chip', group).forEach((c) => c.classList.toggle('is-active', c === b));
      }
      renderNails();
    });
  });
  renderNails();

})();
