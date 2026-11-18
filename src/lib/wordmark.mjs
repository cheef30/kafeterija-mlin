// Rekonstrukcija wordmarka МЛИН po fasadi na Voždovcu, majicama i šoljama.
// Okvir je kutija ručnog mlina, ručica izlazi iz gornje ivice, ispod stoji „кафетерија”.
// Koordinate: visina slova 100 jedinica, slova počinju na x = 0.

const LETTERS = [
  // М
  'M0 100V0h19l29 56L77 0h19v100H79V36L54 82H42L17 36v64z',
  // Л
  'M109 100L139 0h50v100h-17V17h-20l-25 83z',
  // И
  'M202 0h17v64L263 0h19v100h-17V36l-44 64h-19z',
  // Н
  'M295 0h17v42h46V0h17v100h-17V59h-46v41h-17z',
];

// Okvir (kutija mlina)
const FRAME = { x: -30, y: -30, w: 435, h: 160, stroke: 10 };
// Osovina ručice i krak
const PIVOT_X = 177;
const ARM_Y = -62;
const ARM_END = 316;
const KNOB_TOP = -90;

// „кафетерија”: monolinijska slova, visina 22, debljina 4.6
const TAG_GLYPHS = {
  к: { w: 15, d: 'M1.5 0V22M1.5 12L14 0M5.5 8.5L14.5 22' },
  а: { w: 17, d: 'M0.5 22L8.5 0L16.5 22M3.6 14H13.4' },
  ф: { w: 19, d: 'M9.5 0V22M9.5 4.5C-1.5 4.5 -1.5 17.5 9.5 17.5C20.5 17.5 20.5 4.5 9.5 4.5' },
  е: { w: 13, d: 'M13 0H1.5V22H13M1.5 11H11.5' },
  т: { w: 15, d: 'M0 0H15M7.5 0V22' },
  р: { w: 14, d: 'M1.5 22V0H8C15.5 0 15.5 12.5 8 12.5H1.5' },
  и: { w: 15, d: 'M1.5 0V22L13.5 0V22' },
  ј: { w: 12, d: 'M10.5 0V15C10.5 23 1 23 0.5 16.5' },
};

function tagline(x0, x1, y) {
  const word = 'кафетерија';
  const glyphs = [...word].map((c) => TAG_GLYPHS[c]);
  const total = glyphs.reduce((s, g) => s + g.w, 0);
  const gap = (x1 - x0 - total) / (glyphs.length - 1);
  let x = x0;
  return glyphs
    .map((g) => {
      const p = `<path transform="translate(${x.toFixed(2)} ${y})" d="${g.d}"/>`;
      x += g.w + gap;
      return p;
    })
    .join('');
}

/**
 * @param {object} o
 * @param {string} [o.color] boja (podrazumevano currentColor)
 * @param {boolean} [o.tagline] da li ide „кафетерија” ispod
 * @param {string} [o.title] pristupačni naziv
 * @param {string} [o.className]
 * @param {boolean} [o.crank] da li ručica dobija klase za animaciju
 */
export function wordmarkSVG({ color = 'currentColor', tagline: withTag = true, title = 'Kafeterija Mlin', className = '', crank = false, frame = true } = {}) {
  const aria = title ? `role="img" aria-label="${title}"` : 'aria-hidden="true" focusable="false"';
  if (!frame) {
    // Samo slova preko cele širine (futer), „кафетерија” ispod
    return (
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -4 375 ${withTag ? 158 : 108}" class="${className}" ${aria}>` +
      (title ? `<title>${title}</title>` : '') +
      `<g fill="${color}">${LETTERS.map((d) => `<path d="${d}"/>`).join('')}</g>` +
      (withTag ? `<g fill="none" stroke="${color}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round">${tagline(2, 373, 126)}</g>` : '') +
      `</svg>`
    );
  }
  const pad = 14;
  const minX = FRAME.x - FRAME.stroke / 2 - pad - (crank ? 0 : 0);
  const minY = KNOB_TOP - 8 - pad;
  const maxX = FRAME.x + FRAME.w + FRAME.stroke / 2 + pad;
  const maxY = withTag ? 196 + pad : FRAME.y + FRAME.h + FRAME.stroke / 2 + pad;
  const vb = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;
  const arm = `<g class="${crank ? 'mlin-crank' : ''}" style="transform-origin:${PIVOT_X}px ${ARM_Y}px">` +
    `<path d="M${PIVOT_X} ${ARM_Y}H${ARM_END}V${KNOB_TOP}"/>` +
    `<path class="${crank ? 'mlin-knob' : ''}" d="M${ARM_END - 18} ${KNOB_TOP}H${ARM_END + 18}" stroke-width="12"/>` +
    `</g>`;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" class="${className}" ${aria} fill="none">` +
    (title ? `<title>${title}</title>` : '') +
    `<g fill="${color}">${LETTERS.map((d) => `<path d="${d}"/>`).join('')}</g>` +
    `<g stroke="${color}" stroke-width="${FRAME.stroke}" stroke-linecap="square" stroke-linejoin="miter">` +
    `<rect x="${FRAME.x}" y="${FRAME.y}" width="${FRAME.w}" height="${FRAME.h}" rx="5"/>` +
    `<path d="M${PIVOT_X} ${FRAME.y}V${ARM_Y}"/>` +
    arm +
    `</g>` +
    (withTag
      ? `<g stroke="${color}" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round">${tagline(FRAME.x + 26, FRAME.x + FRAME.w - 26, 168)}</g>`
      : '') +
    `</svg>`
  );
}
