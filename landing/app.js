/* =============================================================
   BITRIX.PRO landing — interactive layer
   ============================================================= */

const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const PRM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const HOVER = matchMedia('(hover: hover)').matches;
const escapeHTML = (s) => String(s).replace(/[&<>"'/]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','/':'&#47;'}[c]));
const rafThrottle = (fn) => { let t = false; return (...a) => { if (t) return; t = true; requestAnimationFrame(() => { fn(...a); t = false; }); }; };

/* ===== Preloader ===== */
(() => {
  const pre = $('#preloader');
  const fill = $('#preloaderFill');
  const pct = $('#preloaderPct');
  if (!pre) return;
  let p = 0;
  const tick = () => {
    p = Math.min(100, p + (Math.random() * 14 + 6));
    fill.style.width = p + '%';
    pct.textContent = Math.floor(p);
    if (p < 100) setTimeout(tick, 90);
    else setTimeout(() => pre.classList.add('hidden'), 250);
  };
  if (document.readyState === 'complete') tick();
  else window.addEventListener('load', tick);
})();

/* ===== Scroll progress ===== */
(() => {
  const bar = $('#scrollProgress');
  if (!bar) return;
  const update = () => {
    const h = document.documentElement;
    const sc = h.scrollTop || document.body.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max ? (sc / max) * 100 : 0) + '%';
  };
  addEventListener('scroll', rafThrottle(update), { passive: true });
  update();
})();

/* ===== Sticky header shrink ===== */
(() => {
  const h = $('#header');
  const onScroll = () => h.classList.toggle('is-scrolled', scrollY > 8);
  addEventListener('scroll', rafThrottle(onScroll), { passive: true });
  onScroll();
})();

/* ===== Custom cursor ===== */
if (HOVER && !PRM) (() => {
  const c = $('#cursor');
  if (!c) return;
  const dot = $('.cursor__dot', c);
  const ring = $('.cursor__ring', c);
  let x = 0, y = 0, rx = 0, ry = 0;
  addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`; });
  const loop = () => {
    rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  };
  loop();
  const hoverSel = 'a, button, .srv, .case-card, .plan, .faq__item, .calc__opt, summary, input, label';
  document.addEventListener('mouseover', (e) => { if (e.target.closest(hoverSel)) c.classList.add('is-hover'); });
  document.addEventListener('mouseout', (e) => { if (e.target.closest(hoverSel)) c.classList.remove('is-hover'); });
  document.addEventListener('mousedown', () => c.classList.add('is-down'));
  document.addEventListener('mouseup', () => c.classList.remove('is-down'));
})();

/* ===== Reveal on scroll ===== */
(() => {
  const els = $$('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('is-visible')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();

/* ===== Counter animation ===== */
(() => {
  const nums = $$('[data-count]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count, 10);
      const dur = 1400;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.floor(eased * target).toLocaleString('ru-RU');
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.4 });
  nums.forEach(n => io.observe(n));
})();

/* ===== Split-text hero title ===== */
(() => {
  const el = $('[data-split]');
  if (!el) return;
  const text = el.textContent;
  el.innerHTML = '';
  [...text].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = ch === ' ' ? ' ' : ch;
    span.style.transitionDelay = (i * 28) + 'ms';
    el.appendChild(span);
  });
  setTimeout(() => el.classList.add('is-split'), 500);
})();

/* ===== Tilt + spotlight cards ===== */
if (HOVER && !PRM) (() => {
  const cards = $$('.tilt');
  cards.forEach(card => {
    card.addEventListener('mousemove', rafThrottle((e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const rx = ((y / r.height) - 0.5) * -8;
      const ry = ((x / r.width) - 0.5) * 8;
      card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      card.style.setProperty('--mx', `${x - 125}px`);
      card.style.setProperty('--my', `${y - 125}px`);
    }));
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();

/* ===== Magnetic buttons ===== */
if (HOVER && !PRM) (() => {
  $$('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
})();

/* ===== Button ripple position ===== */
(() => {
  document.querySelectorAll('.btn').forEach(b => {
    b.addEventListener('click', (e) => {
      const r = b.getBoundingClientRect();
      b.style.setProperty('--rx', `${e.clientX - r.left}px`);
      b.style.setProperty('--ry', `${e.clientY - r.top}px`);
    });
  });
})();

/* ===== Burger menu ===== */
(() => {
  const burger = $('#burger');
  const nav = $('#nav');
  if (!burger || !nav) return;
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open'); burger.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false');
  }));
})();

/* ===== Scrollspy ===== */
(() => {
  const links = $$('.nav a[data-spy]');
  if (!links.length) return;
  const map = new Map();
  links.forEach(l => {
    const id = l.dataset.spy;
    const sec = document.getElementById(id);
    if (sec) map.set(sec, l);
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      const link = map.get(e.target);
      if (!link) return;
      if (e.isIntersecting) {
        links.forEach(x => x.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    });
  }, { rootMargin: '-50% 0px -49% 0px', threshold: 0 });
  map.forEach((_, sec) => io.observe(sec));
})();

/* ===== Back to top ===== */
(() => {
  const btn = $('#backTop');
  if (!btn) return;
  const onScroll = () => btn.classList.toggle('show', scrollY > 600);
  addEventListener('scroll', rafThrottle(onScroll), { passive: true });
  btn.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
  onScroll();
})();

/* ===== Parallax in hero ===== */
if (!PRM) (() => {
  const layers = $$('[data-parallax-speed]');
  if (!layers.length) return;
  const apply = () => {
    const sc = scrollY;
    layers.forEach(l => {
      const sp = parseFloat(l.dataset.parallaxSpeed) || 0.2;
      l.style.transform = `translateY(${sc * sp}px)`;
    });
  };
  addEventListener('scroll', rafThrottle(apply), { passive: true });
})();

/* ===== Process SVG path draw ===== */
(() => {
  const path = $('#processPath');
  if (!path) return;
  const len = path.getTotalLength();
  path.style.strokeDasharray = len;
  path.style.strokeDashoffset = len;
  const io = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    let p = 0; const dur = 1600; const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      path.style.strokeDashoffset = len * (1 - t);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    io.disconnect();
  }, { threshold: 0.3 });
  io.observe(path);
})();

/* ===== Particles (constellation) ===== */
if (!PRM) (() => {
  const canvas = $('#particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles, mouse = { x: -9999, y: -9999 };
  const isMobile = innerWidth < 768;
  const COUNT = isMobile ? 35 : 75;
  const LINK_DIST = isMobile ? 90 : 140;
  let raf = null;

  function resize() {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
  }
  function init() {
    particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      a: Math.random() * 0.5 + 0.25,
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      // mouse repulsion
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const d2 = dx*dx + dy*dy;
      if (d2 < 120 * 120) {
        const d = Math.sqrt(d2) || 1;
        const f = (120 - d) / 120 * 0.6;
        p.x += dx / d * f;
        p.y += dy / d * f;
      }
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 175, 55, ${p.a})`;
      ctx.shadowColor = 'rgba(212,175,55,0.55)';
      ctx.shadowBlur = 6;
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    // links
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < LINK_DIST) {
          const o = (1 - d / LINK_DIST) * 0.25;
          ctx.strokeStyle = `rgba(212, 175, 55, ${o})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(draw);
  }
  resize(); init(); draw();
  addEventListener('resize', () => { resize(); init(); });
  addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  addEventListener('mouseout', () => { mouse.x = mouse.y = -9999; });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
    else if (!raf) { draw(); }
  });
})();

/* ===== Pricing toggle ===== */
(() => {
  const toggle = $('.pricing__toggle');
  if (!toggle) return;
  const opts = $$('.pricing__opt', toggle);
  const nums = $$('.plan__num');
  opts.forEach(opt => {
    opt.addEventListener('click', () => {
      opts.forEach(o => { o.classList.remove('is-active'); o.setAttribute('aria-selected', 'false'); });
      opt.classList.add('is-active'); opt.setAttribute('aria-selected', 'true');
      const period = opt.dataset.period;
      toggle.classList.toggle('year', period === 'year');
      nums.forEach(n => {
        const v = parseInt(n.dataset['price' + (period === 'year' ? 'Year' : 'Month')], 10);
        n.style.opacity = '0';
        setTimeout(() => {
          n.textContent = v.toLocaleString('ru-RU');
          n.style.opacity = '1';
        }, 150);
      });
    });
  });
})();

/* ===== Calculator ===== */
(() => {
  const items = $$('.calc__opt input');
  const sumEl = $('#calcSum');
  const daysEl = $('#calcDays');
  if (!items.length) return;
  const update = () => {
    let total = 0, days = 0;
    items.forEach(i => {
      if (i.checked) { total += +i.dataset.cost; days += 2; }
    });
    sumEl.style.opacity = '0';
    setTimeout(() => {
      sumEl.textContent = total.toLocaleString('ru-RU');
      sumEl.style.opacity = '1';
    }, 120);
    daysEl.textContent = Math.max(3, days);
  };
  items.forEach(i => i.addEventListener('change', update));
  update();
})();

/* ===== Cases filter ===== */
(() => {
  const filters = $$('.case-filter');
  const cards = $$('.case-card');
  filters.forEach(f => {
    f.addEventListener('click', () => {
      filters.forEach(x => x.classList.remove('is-active'));
      f.classList.add('is-active');
      const cat = f.dataset.filter;
      cards.forEach(c => {
        c.classList.toggle('is-hidden', cat !== 'all' && c.dataset.cat !== cat);
      });
    });
  });
})();

/* ===== Reviews slider ===== */
(() => {
  const slider = $('#reviewsSlider');
  if (!slider) return;
  const track = $('#reviewsTrack');
  const slides = $$('.review', track);
  const dotsBox = $('#revDots');
  let idx = 0, timer;

  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'rev-dot' + (i === 0 ? ' is-active' : '');
    d.setAttribute('aria-label', `Отзыв ${i + 1}`);
    d.addEventListener('click', () => go(i));
    dotsBox.appendChild(d);
  });
  const dots = $$('.rev-dot', dotsBox);

  const go = (i) => {
    idx = (i + slides.length) % slides.length;
    track.style.transform = `translateX(${-idx * 100}%)`;
    dots.forEach((d, j) => d.classList.toggle('is-active', j === idx));
    resetTimer();
  };
  const resetTimer = () => { clearInterval(timer); timer = setInterval(() => go(idx + 1), 6000); };
  $('#revNext').addEventListener('click', () => go(idx + 1));
  $('#revPrev').addEventListener('click', () => go(idx - 1));
  resetTimer();

  // Drag/swipe
  let dragStart = null, dragDX = 0;
  const onDown = (e) => { dragStart = (e.touches ? e.touches[0] : e).clientX; dragDX = 0; track.style.transition = 'none'; };
  const onMove = (e) => {
    if (dragStart == null) return;
    const x = (e.touches ? e.touches[0] : e).clientX;
    dragDX = x - dragStart;
    track.style.transform = `translateX(calc(${-idx * 100}% + ${dragDX}px))`;
  };
  const onUp = () => {
    if (dragStart == null) return;
    track.style.transition = '';
    if (Math.abs(dragDX) > 60) go(idx + (dragDX < 0 ? 1 : -1));
    else track.style.transform = `translateX(${-idx * 100}%)`;
    dragStart = null;
  };
  slider.addEventListener('mousedown', onDown);
  slider.addEventListener('mousemove', onMove);
  slider.addEventListener('mouseup', onUp);
  slider.addEventListener('mouseleave', onUp);
  slider.addEventListener('touchstart', onDown, { passive: true });
  slider.addEventListener('touchmove', onMove, { passive: true });
  slider.addEventListener('touchend', onUp);

  slider.addEventListener('mouseenter', () => clearInterval(timer));
  slider.addEventListener('mouseleave', resetTimer);
})();

/* ===== Toasts ===== */
const toast = (msg, kind = 'ok') => {
  const wrap = $('#toasts'); if (!wrap) return;
  const t = document.createElement('div');
  t.className = 'toast toast--' + kind;
  t.textContent = msg;
  wrap.appendChild(t);
  setTimeout(() => { t.classList.add('hide'); setTimeout(() => t.remove(), 400); }, 3800);
};

/* ===== Modal ===== */
(() => {
  const modal = $('#modal');
  if (!modal) return;
  const titleEl = $('#modalTitle');
  const textEl = $('#modalText');
  const listEl = $('#modalList');
  let lastFocus = null;

  const SERVICES = {
    crm:     { title: 'Внедрение CRM',    text: 'Структурируем продажи: воронки, права, сделки, статусы.', list: ['Аудит процессов', 'Карточки сделок', 'Поля и стадии', 'Права доступа'] },
    auto:    { title: 'Автоматизация',    text: 'Освобождаем команду от рутины через роботов и БП.',     list: ['Роботы стадий', 'Бизнес‑процессы', 'Триггеры', 'Уведомления'] },
    integ:   { title: 'Интеграции',       text: 'Связываем Битрикс24 с вашими сервисами.',                list: ['1С / 1С УТ', 'Телефония', 'WhatsApp / Telegram', 'API'] },
    portal:  { title: 'Корпоративный портал', text: 'Организуем структуру компании и совместную работу.', list: ['Структура и роли', 'Документы', 'Задачи и проекты', 'Внутренний чат'] },
    bi:      { title: 'Аналитика',        text: 'Видите бизнес как на ладони.',                          list: ['Дашборды', 'KPI отдела', 'Сквозная аналитика', 'Отчёты'] },
    edu:     { title: 'Обучение',         text: 'Чтобы команда полюбила систему.',                       list: ['Тренинги по ролям', 'Видеоинструкции', 'База знаний', 'Поддержка вопросов'] },
    migr:    { title: 'Миграция данных',  text: 'Безопасно переносим из вашей текущей системы.',         list: ['Экспорт клиентов', 'История сделок', 'Документы', 'Маппинг полей'] },
    support: { title: 'Поддержка 24/7',   text: 'Сопровождение и доработки на ежемесячной основе.',      list: ['SLA‑ответ', 'Запас часов', 'Доработки', 'Развитие системы'] },
  };
  const open = (key) => {
    const data = SERVICES[key];
    if (!data) return;
    titleEl.textContent = data.title;
    textEl.textContent = data.text;
    listEl.innerHTML = '';
    data.list.forEach(s => { const li = document.createElement('li'); li.textContent = s; listEl.appendChild(li); });
    lastFocus = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('.modal__close', modal).focus(), 50);
  };
  const close = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastFocus?.focus();
  };
  $$('.srv').forEach(s => s.addEventListener('click', () => open(s.dataset.modal)));
  $$('.srv').forEach(s => { s.setAttribute('tabindex', '0'); s.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(s.dataset.modal); }}); });
  modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('is-open')) close(); });
})();

/* ===== Chat widget ===== */
(() => {
  const fab = $('#chatFab');
  const chat = $('#chat');
  const close = $('#chatClose');
  const form = $('#chatForm');
  const input = $('#chatInput');
  const body = $('#chatBody');
  if (!fab) return;

  const REPLIES = [
    'Уточню у менеджера — обычно от 60 000 ₽.',
    'Срок старта — 2–5 дней.',
    'Оставьте телефон в форме ниже, мы перезвоним.',
    'Да, делаем интеграцию с 1С под любые конфигурации.',
    'Можем подключить телефонию и мессенджеры.',
  ];

  fab.addEventListener('click', () => {
    const open = chat.classList.toggle('is-open');
    chat.setAttribute('aria-hidden', !open);
    if (open) setTimeout(() => input.focus(), 200);
  });
  close.addEventListener('click', () => { chat.classList.remove('is-open'); chat.setAttribute('aria-hidden', 'true'); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value.trim();
    if (!v) return;
    const m = document.createElement('div');
    m.className = 'msg msg--me';
    m.textContent = v; // textContent — без HTML-инъекций
    body.appendChild(m);
    input.value = '';
    body.scrollTop = body.scrollHeight;
    setTimeout(() => {
      const r = document.createElement('div');
      r.className = 'msg msg--bot';
      r.textContent = REPLIES[Math.floor(Math.random() * REPLIES.length)];
      body.appendChild(r);
      body.scrollTop = body.scrollHeight;
    }, 700);
  });
})();

/* ===== Phone mask ===== */
(() => {
  const inp = $('#fPhone');
  if (!inp) return;
  const format = (digits) => {
    let d = digits.replace(/\D/g, '').slice(0, 11);
    if (d.startsWith('8')) d = '7' + d.slice(1);
    if (!d.startsWith('7') && d.length) d = '7' + d;
    const p1 = d.slice(1, 4), p2 = d.slice(4, 7), p3 = d.slice(7, 9), p4 = d.slice(9, 11);
    let out = '+7';
    if (p1) out += ' (' + p1;
    if (p1.length === 3) out += ')';
    if (p2) out += ' ' + p2;
    if (p3) out += '-' + p3;
    if (p4) out += '-' + p4;
    return out;
  };
  inp.addEventListener('input', (e) => {
    const v = e.target.value;
    e.target.value = format(v);
  });
  inp.addEventListener('focus', (e) => { if (!e.target.value) e.target.value = '+7 ('; });
  inp.addEventListener('blur', (e) => { if (e.target.value === '+7 (' || e.target.value === '+7') e.target.value = ''; });
})();

/* ===== Lead form: validation + honeypot + throttle ===== */
(() => {
  const form = $('#leadForm');
  if (!form) return;
  const fName = $('#fName');
  const fPhone = $('#fPhone');
  const errName = $('#errName');
  const errPhone = $('#errPhone');
  const btn = $('#leadSubmit');
  let busy = false, lastSubmit = 0;

  const setErr = (field, errEl, msg) => {
    field.parentElement.classList.toggle('error', !!msg);
    errEl.textContent = msg || '';
    field.setAttribute('aria-invalid', msg ? 'true' : 'false');
  };

  const validName = (v) => {
    v = v.trim();
    if (v.length < 2) return 'Минимум 2 символа';
    if (!/^[A-Za-zА-Яа-яЁё\s\-]+$/.test(v)) return 'Только буквы';
    return '';
  };
  const validPhone = (v) => {
    const digits = v.replace(/\D/g, '');
    if (digits.length < 11) return 'Введите телефон полностью';
    return '';
  };

  fName.addEventListener('blur', () => setErr(fName, errName, validName(fName.value)));
  fPhone.addEventListener('blur', () => setErr(fPhone, errPhone, validPhone(fPhone.value)));
  fName.addEventListener('input', () => { if (errName.textContent) setErr(fName, errName, validName(fName.value)); });
  fPhone.addEventListener('input', () => { if (errPhone.textContent) setErr(fPhone, errPhone, validPhone(fPhone.value)); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (busy) return;
    // throttle 2.5s
    if (Date.now() - lastSubmit < 2500) { toast('Подождите немного…', 'err'); return; }

    // honeypot
    if (form.website.value) { toast('Ошибка отправки', 'err'); return; }

    const nErr = validName(fName.value);
    const pErr = validPhone(fPhone.value);
    setErr(fName, errName, nErr);
    setErr(fPhone, errPhone, pErr);
    if (nErr || pErr) { toast('Проверьте поля формы', 'err'); return; }

    busy = true;
    btn.disabled = true;
    const orig = btn.textContent;
    btn.textContent = 'Отправляем…';

    // simulate request
    await new Promise(r => setTimeout(r, 900));

    lastSubmit = Date.now();
    busy = false;
    btn.disabled = false;
    btn.textContent = orig;
    form.reset();
    toast('Спасибо! Свяжемся в течение 15 минут', 'ok');
  });
})();
