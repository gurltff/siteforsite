/* siteforsite — interactions */
(() => {
  const CFG = window.SFS_CONFIG || {};
  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------------- demo projects ---------------- */
  const DEMOS = [
    {
      title: "Coco's Corner", url: 'https://gurltff.github.io/imcoco/',
      desc: 'A cosy comfort app made in memory of Coco the cat. Tap to wake her up, play, vent and leave her little letters. It even installs on your phone like a real app.',
      tags: ['web app', 'installable', 'interactive'], cover: 'coco-cover', alt: 'coco-inside', feature: true, badge: 'our favourite',
    },
    {
      title: 'Anoushka Dey · portfolio', url: 'https://gurltff.github.io/portfolio-3-/',
      desc: 'A paper-collage portfolio that opens into a pixel-art desktop full of pop-up windows.',
      tags: ['portfolio', 'playful'], cover: 'anoushka-cover', alt: 'anoushka-inside',
    },
    {
      title: 'Ansshita Kumar · portfolio', url: 'https://gurltff.github.io/myportfolio/',
      desc: 'A dreamy “pop-up edition” portfolio with hand-drawn type, skill stickers and a stamp rally.',
      tags: ['portfolio', 'scrapbook'], cover: 'ansshita-cover', long: 'ansshita-long',
    },
    {
      title: 'Raghav Singh · portfolio', url: 'https://gurltff.github.io/myportfolio2/',
      desc: 'Draggable retro windows and a music player that open into a clean grid portfolio and a comic gallery.',
      tags: ['portfolio', 'retro'], cover: 'raghav-cover', long: 'raghav-long',
    },
    {
      title: 'ClimateWatch India', url: 'https://raghav3907-svg.github.io/climate-app/',
      desc: 'A live climate dashboard with temperature trends, a state heatmap, AQI monitoring and disaster alerts.',
      tags: ['dashboard', 'live data'], cover: 'climate-cover', long: 'climate-long',
    },
    {
      title: 'Weekly & monthly planner', url: 'https://raghav3907-svg.github.io/finalplannerver.01/',
      desc: 'A cute, no-install planner for your weekly to-dos, with a monthly calendar view.',
      tags: ['tool', 'planner'], cover: 'planner-cover', alt: 'planner-inside',
    },
    {
      title: 'Smart Attendance Tracker', url: 'https://gurltff.github.io/attendance-tracker/',
      desc: 'Attendance for students, teachers and CRs, with dashboards, announcements and geotagged check-ins. 1st place at our college\'s internal SIH hackathon.',
      tags: ['web app', 'hackathon winner'], cover: 'attendance-cover',
    },
  ];

  /* ---------------- order builder data ---------------- */
  const TYPES = [
    'Personal portfolio', 'Link-in-bio page', 'Digital resume / CV', 'Event or fest page',
    'Society or club page', 'Small business page', 'Birthday / anniversary / proposal page', 'Wedding or party invite',
  ];
  const BASE = 150;
  const EXTRAS = [
    { id: 'change', label: 'Extra change round', price: 50, qty: true },
    { id: 'page', label: 'Extra page', price: 99, qty: true },
    { id: 'form', label: 'Contact / registration form', price: 99 },
    { id: 'map', label: 'Google Map', price: 49 },
    { id: 'gallery', label: 'Photo gallery', price: 49 },
    { id: 'music', label: 'Music', price: 49 },
    { id: 'urgent', label: 'Urgent same-day delivery', price: 100 },
  ];

  /* labels used in the Google Form; keep in sync with google-form/create-order-form.gs */
  const FORM_LABELS = {
    types: [
      'Personal portfolio (₹150)', 'Link in bio page (₹150)', 'Digital resume or CV (₹150)', 'Event or fest page (₹150)',
      'Society or club page (₹150)', 'Small business or home seller page (₹150)',
      'Birthday, anniversary or proposal page (₹150)', 'Wedding or party invite (₹150)',
    ],
    extras: {
      change: 'Extra change after the first round (₹50 each)', page: 'Extra page (₹99 each)',
      form: 'Contact or registration form (₹99)', map: 'Google Map (₹49)', gallery: 'Photo gallery (₹49)',
      music: 'Music (₹49)', urgent: 'Urgent delivery, the same day (₹100)',
    },
    yes: 'Yes, I want some extras',
    no: 'No extras, just the ₹150 site',
  };

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const rupees = n => '₹' + n.toLocaleString('en-IN');
  const waNumber = (CFG.whatsappNumber || '919355143330').replace(/\D/g, '');
  const waLink = text => `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
  const hasForm = !!(CFG.googleFormUrl && /^https?:\/\//.test(CFG.googleFormUrl));

  /* ---------------- links from config ---------------- */
  const hello = 'Hi siteforsite! ♡ I’d like to book a website.';
  $$('[data-wa-link]').forEach(a => { a.href = waLink(hello); });
  $$('[data-number]').forEach(el => { if (CFG.displayNumber) el.textContent = CFG.displayNumber; });
  $$('[data-form-link]').forEach(a => {
    a.href = hasForm ? CFG.googleFormUrl : waLink('Hi siteforsite! ♡ I’d like to book a website.');
  });

  /* ---------------- split text into letters ---------------- */
  $$('[data-split]').forEach(el => {
    const text = el.textContent.trim();
    if (!el.hasAttribute('aria-hidden') && !el.getAttribute('aria-label')) el.setAttribute('aria-label', text);
    let i = 0;
    el.innerHTML = text.split(' ').map(word =>
      `<span class="w" aria-hidden="true" style="display:inline-block;white-space:nowrap">${
        [...word].map(ch => `<span class="ch" data-ch="${esc(ch)}" style="--i:${i++}">${esc(ch)}</span>`).join('')
      }</span>`).join(' ');
  });
  const wiggle = ch => {
    if (reduced || ch.classList.contains('is-wiggle')) return;
    ch.classList.add('is-wiggle');
    ch.addEventListener('animationend', () => ch.classList.remove('is-wiggle'), { once: true });
  };
  document.addEventListener('pointerover', e => {
    const ch = e.target.closest?.('.ch');
    if (ch && ch.closest('.is-in, .is-done, .footer')) wiggle(ch);
  });
  $('.hero__title')?.addEventListener('click', () => {
    $$('.hero .ch').forEach((ch, k) => setTimeout(() => wiggle(ch), k * 60));
  });

  /* ---------------- hero intro ---------------- */
  const hero = $('.hero');
  const start = () => {
    if (root.classList.contains('is-ready')) return;
    root.classList.add('is-ready');
    hero?.classList.add('is-in');
    setTimeout(() => hero?.classList.add('is-done'), 2600);
  };
  if (document.fonts?.ready) {
    Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1200))]).then(() => requestAnimationFrame(start));
  } else {
    requestAnimationFrame(start);
  }

  /* ---------------- scroll reveal ---------------- */
  const revealIO = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.add('is-in');
      if (el.matches('.h2')) setTimeout(() => el.classList.add('is-done'), 1400);
      const counter = el.querySelector('[data-count]');
      if (counter) countUp(counter);
      revealIO.unobserve(el);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
  const observeReveal = () => $$('[data-reveal]:not(.is-in)').forEach(el => revealIO.observe(el));

  function countUp(el) {
    const to = +el.dataset.count;
    if (reduced) { el.textContent = to; return; }
    const t0 = performance.now(), dur = 1100;
    const tick = t => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------------- nav (sits at the top of the page, scrolls away with it) ---------------- */
  const menuBtn = $('[data-menu]');
  const sheet = $('[data-sheet]');
  let ticking = false;
  const onScroll = () => {
    if (hero && !reduced) hero.style.setProperty('--py', Math.min(scrollY, 900));
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

  const setMenu = open => {
    menuBtn.setAttribute('aria-expanded', String(open));
    sheet.hidden = !open;
  };
  menuBtn?.addEventListener('click', () => setMenu(sheet.hidden));
  sheet?.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && sheet && !sheet.hidden) setMenu(false); });
  document.addEventListener('click', e => {
    if (sheet && !sheet.hidden && !e.target.closest('[data-sheet], [data-menu]')) setMenu(false);
  });


  /* ---------------- click-through pages ---------------- */
  const PAGES = [
    { id: 'home', path: 'home', label: 'home' },
    { id: 'about', path: 'about-us', label: 'about us' },
    { id: 'make', path: 'what-we-make', label: 'what we make' },
    { id: 'sites', path: 'sites-we-made', label: 'sites we made' },
    { id: 'team', path: 'meet-the-team', label: 'meet the team' },
    { id: 'prices', path: 'price-list', label: 'the price list' },
    { id: 'order', path: 'how-to-order', label: 'how to order' },
  ];
  const pageEls = Object.fromEntries($$('[data-page]').map(el => [el.dataset.page, el]));
  const urlEl = $('[data-url]');
  const baseTitle = document.title;
  let current = null;

  // back / next buttons at the bottom of every page except home
  PAGES.forEach((p, i) => {
    const el = pageEls[p.id];
    if (!el || i === 0) return;
    const prev = PAGES[i - 1], next = PAGES[i + 1];
    const nav = document.createElement('nav');
    nav.className = 'pager';
    nav.setAttribute('aria-label', 'Page');
    nav.innerHTML =
      `<a class="pager__prev" href="#${prev.id}">← ${esc(prev.label)}</a>` +
      (next ? `<a class="pager__next" href="#${next.id}">next: <b>${esc(next.label)}</b> →</a>`
            : `<a class="pager__next" href="#home">back to <b>home</b></a>`);
    el.appendChild(nav);
  });

  const pageFromHash = () => {
    const h = decodeURIComponent(location.hash.slice(1));
    return PAGES.find(p => p.id === h || p.path === h) || PAGES[0];
  };
  const show = (page, { focus = true } = {}) => {
    if (!pageEls[page.id]) return;
    Object.values(pageEls).forEach(el => el.classList.toggle('is-active', el === pageEls[page.id]));
    current = page;
    window.scrollTo(0, 0);
    document.title = page.id === 'home' ? baseTitle : `${page.label} · siteforsite`;
    if (urlEl) {
      urlEl.firstChild.textContent = 'siteforsite';
      urlEl.querySelector('span').textContent = '/' + page.path;
      urlEl.classList.remove('is-loading'); void urlEl.offsetWidth; urlEl.classList.add('is-loading');
    }
    if (sheet && !sheet.hidden) setMenu(false);
    if (focus) {
      const h = pageEls[page.id].querySelector('h1, h2');
      if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    }
    observeReveal();
  };
  addEventListener('hashchange', () => show(pageFromHash()));
  show(pageFromHash(), { focus: false });

  // the address bar's back / forward / refresh buttons
  const go = step => {
    const i = PAGES.indexOf(current) + step;
    if (i >= 0 && i < PAGES.length) location.hash = PAGES[i].id;
  };
  $$('.bar__nav [data-step]').forEach(b => b.addEventListener('click', () => go(+b.dataset.step)));
  $('.bar__nav [data-replay]')?.addEventListener('click', () => {
    const el = pageEls[current.id];
    el.classList.remove('is-active'); void el.offsetWidth; el.classList.add('is-active');
    if (current.id === 'home') { hero.classList.remove('is-in'); void hero.offsetWidth; hero.classList.add('is-in'); }
    urlEl?.classList.remove('is-loading'); void urlEl?.offsetWidth; urlEl?.classList.add('is-loading');
  });

  /* ---------------- sparkle trail over the hero ---------------- */
  if (hero && finePointer && !reduced) {
    let last = 0, live = 0;
    hero.addEventListener('pointermove', e => {
      const now = performance.now();
      if (now - last < 45 || live > 18) return;
      last = now; live++;
      const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      s.setAttribute('class', 'spark');
      s.setAttribute('aria-hidden', 'true');
      s.innerHTML = '<use href="#sparkle"/>';
      const size = 10 + Math.random() * 12;
      s.style.cssText = `left:${e.clientX + (Math.random() * 16 - 8)}px;top:${e.clientY + (Math.random() * 16 - 8)}px;width:${size}px;height:${size}px`;
      document.body.appendChild(s);
      s.addEventListener('animationend', () => { s.remove(); live--; }, { once: true });
    });
  }

  /* ---------------- tilt on the site-type cards ---------------- */
  if (finePointer && !reduced) {
    $$('[data-tilt]').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty('--ry', (x * 10).toFixed(2) + 'deg');
        card.style.setProperty('--rx', (y * -10).toFixed(2) + 'deg');
      });
      card.addEventListener('pointerleave', () => { card.style.removeProperty('--rx'); card.style.removeProperty('--ry'); });
    });
  }

  /* ---------------- demo cards ---------------- */
  const grid = $('[data-demos]');
  const IMG = n => `assets/img/demos/${n}.webp`;
  if (grid) {
    grid.innerHTML = DEMOS.map((d, k) => {
      const host = d.url.replace(/^https?:\/\//, '').replace(/\/$/, '');
      const extra = d.long
        ? `<img class="long" data-src="${IMG(d.long)}" alt="" aria-hidden="true">`
        : d.alt ? `<img class="alt" data-src="${IMG(d.alt)}" alt="" aria-hidden="true">` : '';
      const hint = d.long ? 'hover to scroll' : d.alt ? 'hover to peek inside' : 'tap to try it';
      return `
      <article class="demo${d.feature ? ' demo--feature' : ''}" data-reveal data-demo="${k}">
        <div class="demo__win">
          <div class="demo__bar"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="demo__url">${esc(host)}</span></div>
          <button class="demo__screen" type="button" data-try="${k}" aria-label="Try ${esc(d.title)} live, right here">
            <img class="cover" src="${IMG(d.cover)}" alt="Front page of ${esc(d.title)}" width="1120" height="700" loading="lazy">
            ${extra}
            <span class="demo__hint"><svg aria-hidden="true"><use href="#sparkle"/></svg>${hint}</span>
          </button>
        </div>
        <div class="demo__meta">
          ${d.badge ? `<span class="demo__badge">${esc(d.badge)} ♡</span>` : ''}
          <h3>${esc(d.title)}</h3>
          <p>${esc(d.desc)}</p>
          <p class="demo__tags">${d.tags.map(t => `<span>${esc(t)}</span>`).join('')}</p>
          <div class="demo__actions">
            <button class="btn btn--blue" type="button" data-try="${k}">try it here</button>
            <a class="btn btn--ghost" href="${d.url}" target="_blank" rel="noopener">visit live <svg class="ico" aria-hidden="true"><use href="#i-ext"/></svg></a>
          </div>
        </div>
      </article>`;
    }).join('');

    const loadExtra = card => {
      const img = card.querySelector('[data-src]');
      if (!img) return Promise.resolve(null);
      if (!img.dataset.loading) {
        img.dataset.loading = '1';
        img.src = img.dataset.src;
      }
      return img.complete && img.naturalWidth ? Promise.resolve(img) : new Promise(r => img.addEventListener('load', () => r(img), { once: true }));
    };
    const peek = async (card, on) => {
      if (!on) { card.classList.remove('is-peeking'); return; }
      card.classList.add('is-peeking');
      const img = await loadExtra(card);
      if (!img || !img.classList.contains('long') || !card.classList.contains('is-peeking')) return;
      const screen = card.querySelector('.demo__screen');
      const h = img.naturalHeight * (screen.clientWidth / img.naturalWidth);
      const shift = Math.max(0, h - screen.clientHeight);
      card.style.setProperty('--shift', `-${shift}px`);
      card.style.setProperty('--dur', `${Math.min(9, Math.max(3, shift / 140)).toFixed(1)}s`);
      // re-trigger transition after the variables land
      card.classList.remove('is-peeking'); void card.offsetWidth; card.classList.add('is-peeking');
    };

    $$('.demo', grid).forEach(card => {
      if (finePointer) {
        card.addEventListener('pointerenter', () => peek(card, true));
        card.addEventListener('pointerleave', () => peek(card, false));
        card.addEventListener('focusin', () => peek(card, true));
        card.addEventListener('focusout', () => peek(card, false));
      }
    });
    // touch screens: peek automatically while a card sits in the middle of the screen
    if (!finePointer && !reduced) {
      const timers = new WeakMap();
      const io = new IntersectionObserver(entries => entries.forEach(en => {
        clearTimeout(timers.get(en.target));
        if (en.isIntersecting) timers.set(en.target, setTimeout(() => peek(en.target, true), 700));
        else peek(en.target, false);
      }), { rootMargin: '-30% 0px -30% 0px' });
      $$('.demo', grid).forEach(c => io.observe(c));
    }
  }


  /* ---------------- sites carousel ---------------- */
  const car = $('[data-carousel]');
  if (car && grid) {
    const cards = () => $$('.demo', grid);
    const countEl = $('[data-car-count]', car);
    const [prevBtn, nextBtn] = $$('[data-car]', car);
    const index = () => {
      const mid = grid.scrollLeft + grid.clientWidth / 2;
      let best = 0, bestD = Infinity;
      cards().forEach((c, k) => { const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (d < bestD) { bestD = d; best = k; } });
      return best;
    };
    const update = () => {
      const i = index(), n = cards().length;
      countEl.textContent = `${i + 1} / ${n}`;
      prevBtn.disabled = i === 0;
      nextBtn.disabled = i === n - 1;
    };
    const goTo = i => {
      const c = cards()[Math.max(0, Math.min(cards().length - 1, i))];
      if (c) grid.scrollTo({ left: c.offsetLeft - (grid.clientWidth - c.offsetWidth) / 2, behavior: reduced ? 'auto' : 'smooth' });
    };
    $$('[data-car]', car).forEach(b => b.addEventListener('click', () => goTo(index() + +b.dataset.car)));
    grid.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index() + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index() - 1); }
    });
    let t;
    grid.addEventListener('scroll', () => { clearTimeout(t); t = setTimeout(update, 60); }, { passive: true });
    addEventListener('hashchange', () => setTimeout(update, 50));
    addEventListener('resize', update);
    update();
  }

  /* ---------------- live preview dialog ---------------- */
  const dlg = $('[data-peek]');
  const frame = $('[data-peek-frame]');
  const loading = $('.peek__loading');
  const openPeek = d => {
    if (!dlg || typeof dlg.showModal !== 'function') { window.open(d.url, '_blank', 'noopener'); return; }
    $('[data-peek-url]').textContent = d.url.replace(/^https?:\/\//, '');
    $('[data-peek-open]').href = d.url;
    loading.style.display = '';
    frame.src = d.url;
    dlg.showModal();
    document.body.style.overflow = 'hidden';
  };
  frame?.addEventListener('load', () => { if (frame.src !== 'about:blank') loading.style.display = 'none'; });
  const closePeek = () => dlg.close();
  dlg?.addEventListener('close', () => { frame.src = 'about:blank'; document.body.style.overflow = ''; });
  dlg?.addEventListener('click', e => { if (e.target === dlg) closePeek(); });
  $('[data-peek-close]')?.addEventListener('click', closePeek);
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-try]');
    if (t) openPeek(DEMOS[+t.dataset.try]);
  });

  /* ---------------- order builder ---------------- */
  const builder = $('[data-builder]');
  if (builder) {
    const typesEl = $('[data-types]', builder);
    const extrasEl = $('[data-extras]', builder);
    const linesEl = $('[data-lines]', builder);
    const totalEl = $('[data-total]', builder);
    const waBtn = $('[data-wa-order]', builder);
    const formBtn = $('[data-form-link]', builder);
    const nowEl = $('[data-half-now]', builder);
    const laterEl = $('[data-half-later]', builder);
    const state = { type: 0, extras: Object.fromEntries(EXTRAS.map(x => [x.id, 0])) };

    typesEl.innerHTML = TYPES.map((t, k) => `
      <label class="pill"><input type="radio" name="type" value="${k}"${k === 0 ? ' checked' : ''}><span>${esc(t)}</span></label>`).join('');
    extrasEl.innerHTML = EXTRAS.map(x => x.qty
      ? `<div class="qty" data-qty="${x.id}"><span>${esc(x.label)}</span><small>+${rupees(x.price)}</small>
           <button type="button" data-step="-1" aria-label="Fewer: ${esc(x.label)}">−</button><output aria-live="polite">0</output><button type="button" data-step="1" aria-label="More: ${esc(x.label)}">+</button></div>`
      : `<label class="pill"><input type="checkbox" value="${x.id}"><span>${esc(x.label)} <small>+${rupees(x.price)}</small></span></label>`).join('');

    let prevTotal = BASE;
    const render = () => {
      const lines = [[TYPES[state.type], BASE]];
      EXTRAS.forEach(x => {
        const n = state.extras[x.id];
        if (n) lines.push([x.qty && n > 1 ? `${x.label} × ${n}` : x.label, x.price * n]);
      });
      const total = lines.reduce((s, l) => s + l[1], 0);
      linesEl.innerHTML = lines.map(([l, p]) => `<li><span>${esc(l)}</span><span>${rupees(p)}</span></li>`).join('');
      totalEl.textContent = rupees(total);
      if (total !== prevTotal) { totalEl.classList.remove('bump'); void totalEl.offsetWidth; totalEl.classList.add('bump'); }
      prevTotal = total;
      const now = Math.ceil(total / 2), later = total - now;
      nowEl.textContent = rupees(now);
      laterEl.textContent = rupees(later);
      const msg = [
        'Hi siteforsite! ♡ I’d like to order:',
        ...lines.map(([l, p]) => `• ${l}: ${rupees(p)}`),
        `Total: ${rupees(total)} (${rupees(now)} to book, ${rupees(later)} after the preview)`,
        hasForm ? 'I’ve filled the order form too.' : 'Here’s what I want on my site:',
      ].join('\n');
      waBtn.href = waLink(msg);
      if (formBtn) formBtn.href = hasForm ? prefilledForm(total) : waLink(msg);
    };
    // opens the Google Form with this order already filled in
    const prefilledForm = total => {
      const f = CFG.googleFormFields;
      if (!f) return CFG.googleFormUrl;
      try {
        const u = new URL(CFG.googleFormUrl);
        u.searchParams.set('usp', 'pp_url');
        const add = (key, val) => { if (key) u.searchParams.append(key, val); };
        add(f.type, FORM_LABELS.types[state.type]);
        const picked = EXTRAS.filter(x => state.extras[x.id]);
        add(f.wantExtras, picked.length ? FORM_LABELS.yes : FORM_LABELS.no);
        picked.forEach(x => add(f.extras, FORM_LABELS.extras[x.id]));
        const counts = picked.filter(x => x.qty && state.extras[x.id] > 1).map(x => `${x.label}: ${state.extras[x.id]}`);
        if (counts.length) add(f.counts, counts.join(', '));
        if (picked.length) add(f.total, String(total));
        return u.toString();
      } catch { return CFG.googleFormUrl; }
    };
    typesEl.addEventListener('change', e => { state.type = +e.target.value; render(); });
    extrasEl.addEventListener('change', e => { if (e.target.type === 'checkbox') { state.extras[e.target.value] = e.target.checked ? 1 : 0; render(); } });
    extrasEl.addEventListener('click', e => {
      const b = e.target.closest('[data-step]');
      if (!b) return;
      const box = b.closest('[data-qty]');
      const id = box.dataset.qty;
      state.extras[id] = Math.max(0, Math.min(9, state.extras[id] + +b.dataset.step));
      box.querySelector('output').textContent = state.extras[id];
      box.classList.toggle('has', state.extras[id] > 0);
      render();
    });
    render();
  }

  /* ---------------- copy number ---------------- */
  const toastEl = $('[data-toast]');
  let toastT;
  const toast = msg => {
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('is-on'), 2200);
  };
  $$('[data-copy]').forEach(btn => btn.addEventListener('click', async () => {
    const num = waNumber.replace(/^91(?=\d{10}$)/, '');
    try { await navigator.clipboard.writeText(num); }
    catch {
      const t = document.createElement('textarea');
      t.value = num; document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); } catch {}
      t.remove();
    }
    btn.classList.add('is-done');
    btn.querySelector('span').textContent = 'copied!';
    toast('number copied ♡');
    setTimeout(() => { btn.classList.remove('is-done'); btn.querySelector('span').textContent = 'copy'; }, 2000);
  }));

  observeReveal();
})();
