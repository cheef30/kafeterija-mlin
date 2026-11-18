// Sav JavaScript sajta: ručica mlina, kreda, krivulja prženja, mobilni meni.
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* 1. Ručica mlina se okreće na skrol.
   Krak se okreće oko osovine kao na pravom ručnom mlinu: gledano spreda, skraćuje se (cos). */
const cranks = Array.from(document.querySelectorAll<SVGGElement>('.mlin-crank'));
const PIVOT = 177;
if (cranks.length && !reduce) {
  let ticking = false;
  const turn = () => {
    const theta = window.scrollY / 240;
    const c = Math.cos(theta);
    const sx = Math.abs(c) < 0.04 ? 0.04 * Math.sign(c || 1) : c;
    for (const g of cranks) g.setAttribute('transform', `translate(${PIVOT} 0) scale(${sx.toFixed(3)} 1) translate(${-PIVOT} 0)`);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(turn); }
  }, { passive: true });
  turn();
}

/* 2. Kredne ilustracije se iscrtavaju jednom, kad uđu u ekran. */
const chalks = document.querySelectorAll<SVGElement>('[data-chalk]');
if (reduce || !('IntersectionObserver' in window)) {
  chalks.forEach((c) => c.classList.add('is-drawn'));
} else {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.classList.add('is-drawn'); io.unobserve(e.target); }
    }
  }, { threshold: 0.35 });
  chalks.forEach((c) => io.observe(c));
}

/* 3. Krivulja prženja prati skrol. */
const curve = document.querySelector<HTMLElement>('[data-curve]');
if (curve && !reduce) {
  let ticking = false;
  let max = 0; // crta se samo napred: kad je jednom nacrtana, ostaje
  const draw = () => {
    const r = curve.getBoundingClientRect();
    const vh = window.innerHeight;
    max = Math.max(max, Math.min(1, Math.max(0, (vh * 0.95 - r.top) / (vh * 0.6))));
    const p = max;
    curve.style.setProperty('--draw', String(1 - p));
    curve.style.setProperty('--dot', p > 0.97 ? '1' : '0');
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(draw); } }, { passive: true });
  draw();
}

/* 4. Mobilni meni (dialog). */
const dlg = document.getElementById('mob') as HTMLDialogElement | null;
const openBtn = document.querySelector<HTMLButtonElement>('[data-menu-open]');
if (dlg && openBtn) {
  openBtn.addEventListener('click', () => { dlg.showModal(); openBtn.setAttribute('aria-expanded', 'true'); });
  dlg.addEventListener('close', () => { openBtn.setAttribute('aria-expanded', 'false'); openBtn.focus(); });
  dlg.querySelector('[data-menu-close]')?.addEventListener('click', () => dlg.close());
  dlg.querySelectorAll('[data-menu-link]').forEach((a) => a.addEventListener('click', () => dlg.close()));
  openBtn.setAttribute('aria-expanded', 'false');
}

/* 5. Tabovi menija po lokaciji (stanje u URL-u: /meni#terazije). */
const tablist = document.querySelector<HTMLElement>('[role="tablist"]');
if (tablist) {
  const tabs = Array.from(tablist.querySelectorAll<HTMLAnchorElement>('[role="tab"]'));
  const ids = tabs.map((t) => t.dataset.id!);
  const select = (id: string, focus = false, push = true) => {
    if (!ids.includes(id)) id = ids[0];
    for (const t of tabs) {
      const on = t.dataset.id === id;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(`panel-${t.dataset.id}`);
      if (panel) panel.hidden = !on;
      if (on && focus) t.focus();
    }
    if (push && location.hash.slice(1) !== id) history.replaceState(null, '', `#${id}`);
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', (e) => { e.preventDefault(); select(t.dataset.id!); });
    t.addEventListener('keydown', (e) => {
      const k = e.key;
      let n = -1;
      if (k === 'ArrowRight') n = (i + 1) % tabs.length;
      if (k === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
      if (k === 'Home') n = 0;
      if (k === 'End') n = tabs.length - 1;
      if (n >= 0) { e.preventDefault(); select(tabs[n].dataset.id!, true); }
    });
  });
  const fromHash = () => {
    const h = decodeURIComponent(location.hash.slice(1));
    const id = ids.find((x) => h === x || h.startsWith(`${x}-`)) ?? ids[0];
    select(id, false, false);
    if (h.startsWith(`${id}-`)) document.getElementById(h)?.scrollIntoView();
  };
  window.addEventListener('hashchange', fromHash);
  fromHash();
}

/* 6. Filter proizvoda u Shop-u. */
const chips = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-filter]'));
if (chips.length) {
  const items = Array.from(document.querySelectorAll<HTMLElement>('[data-kategorija]'));
  const status = document.querySelector<HTMLElement>('[data-filter-status]');
  chips.forEach((chip) => chip.addEventListener('click', () => {
    const f = chip.dataset.filter!;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    let n = 0;
    for (const it of items) {
      const show = f === 'sve' || (f === 'limitirano' ? it.dataset.limitirano === 'true' : it.dataset.kategorija === f);
      it.hidden = !show;
      if (show) n++;
    }
    if (status) status.textContent = `Prikazano proizvoda: ${n}`;
  }));
}
