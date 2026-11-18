import lokacije from '../../data/lokacije.json';
import kontakt from '../../data/kontakt.json';

export type Lokacija = (typeof lokacije)[number];

/** Vrednost koja još nije uneta. */
export const isTodo = (v: unknown): boolean =>
  v === undefined || v === null || v === '' || (typeof v === 'string' && v.trim().toUpperCase().startsWith('TODO'));

export const has = (v: unknown): boolean => !isTodo(v);

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Putanja unutar sajta, sa base prefiksom (GitHub Pages podfolder). */
export function u(path = '/'): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${BASE}${p}`;
}

export const SITE_URL = 'https://cheef30.github.io/kafeterija-mlin';

export const mapsUrl = (l: Lokacija) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Kafeterija Mlin, ${l.adresa}, ${l.grad}`)}`;

export const locLine = (l: Lokacija) => `${l.naziv} · ${l.adresa}`;

export function mailto(subject: string, body: string): string {
  return `mailto:${kontakt.mejl}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export const instagramUrl = has(kontakt.instagram) ? `https://www.instagram.com/${kontakt.instagram}/` : null;
export const instagramDm = has(kontakt.instagram) ? `https://ig.me/m/${kontakt.instagram}` : null;

const MESECI = ['januar', 'februar', 'mart', 'april', 'maj', 'jun', 'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'];
export function datum(iso: string): string {
  const d = new Date(iso + 'T12:00:00');
  return `${d.getDate()}. ${MESECI[d.getMonth()]} ${d.getFullYear()}.`;
}

export function cena(v: unknown): string | null {
  if (isTodo(v)) return null;
  const n = Number(v);
  return Number.isFinite(n) ? `${n.toLocaleString('sr-Latn-RS')} RSD` : String(v);
}

export { lokacije, kontakt };
