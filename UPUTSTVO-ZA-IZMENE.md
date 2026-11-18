# Uputstvo za izmene · Kafeterija Mlin

Sav sadržaj koji se menja živi u folderu `data/`. Dizajn se ne dira. Posle izmene uradite **commit + push** na `main` i sajt se sam objavi za oko 2 minuta (GitHub Actions → Pages).

Pravilo za sve fajlove: vrednost koju još nemamo piše se kao `"TODO"`. Sajt tada prikazuje „uskoro” i nikad ne izmišlja podatak.

---

## Radno vreme
Fajl: `data/lokacije.json`, polje `radnoVreme` (tekst koji se prikazuje) i `openingHoursSchema` (za Google, format schema.org).

```json
"radnoVreme": "Pon do pet 07:30 do 22:00 · Sub i ned 09:00 do 22:00",
"openingHoursSchema": ["Mo-Fr 07:30-22:00", "Sa-Su 09:00-22:00"]
```
Napomena: u tekstu za sajt koristite „do”, ne dugu crtu.

## Cena u meniju
Fajlovi: `data/meni-vozdovac.json`, `data/meni-novi-beograd.json`, `data/meni-terazije.json`.
Cena je broj u dinarima (bez „RSD”, sajt ga dodaje sam):
```json
{ "naziv": "Cappuccino", "opis": "", "cena": 260 }
```
Čim bar jedna stavka na lokaciji ima cenu, natpis „Cene uskoro” nestaje za tu lokaciju.

## Nova stavka ili kategorija u meniju
Dodajte objekat u niz `stavke` odgovarajuće kategorije. Nova kategorija:
```json
{ "naziv": "Smoothies & Shakes", "stavke": [ { "naziv": "Banana shake", "opis": "", "cena": "TODO" } ] }
```
Kategorija bez stavki prikazuje „Stavke uskoro”.

## Nova single origin kafa
Fajl: `data/kafe.json`. Dok je prazan (`[]`), sajt prikazuje tablu „Nove kafe stižu uskoro”.
```json
[
  {
    "naziv": "Etiopija Yirgacheffe",
    "zemlja": "Etiopija",
    "region": "Yirgacheffe",
    "obrada": "Washed",
    "note": ["jasmin", "bergamot", "breskva"],
    "dostupnoNa": ["Voždovac", "Novi Beograd"]
  }
]
```
Mlin blend (Costa Rica, Honduras, Guatemala, Colombia, Cameroon, Brasil Cerrado) čeka potvrdu u `data/mlin-blend.json` i ne prikazuje se.

## Novost
Fajl: `data/novosti.json`. Na početnoj se prikazuju 3 najnovije (po datumu).
```json
{
  "datum": "2026-12-01",
  "naslov": "Zimske čarolije",
  "tekst": "Jedna do dve rečenice.",
  "slika": "flatlay",
  "link": "meni#vozdovac"
}
```
`slika` je ID iz `scripts/images.config.mjs` (može i `null`). `link` je opcionalan.

## Proizvod u Shop-u
Fajl: `data/shop.json`, niz `proizvodi`.
```json
{
  "id": "ceger-kraft",
  "sku": "TODO",
  "naziv": "Ceger МЛИН",
  "opis": "Platneni ceger sa logom.",
  "kategorija": "cegeri",
  "limitirano": false,
  "cena": 1200,
  "velicine": [],
  "boje": ["natur"],
  "zaliha": "TODO",
  "slika": "ceger",
  "istaknuto": true
}
```
- `kategorija`: `solje`, `majice` ili `cegeri` (filter na strani Shop).
- `limitirano: true` + `"sezona": "Novogodišnja kolekcija"` daje tirkizni pečat.
- `istaknuto: true` ga stavlja među prva 4 na početnoj.
- `sku` i `zaliha` su spremni za kasniju online prodavnicu.

## Instagram
Fajl: `data/kontakt.json`, polje `instagram`, samo handle bez @:
```json
"instagram": "mlinkafeterija"
```
Tada se u futeru pojavljuje link, a u Shop-u dugme „Piši nam na Instagramu” (DM).

## Recenzije
Fajl: `data/recenzije.json`. Dok je prazan, sekcija se ne prikazuje. Unosite samo prave recenzije sa Google-a:
```json
[{ "tekst": "…", "ime": "Ana M.", "lokacija": "Voždovac", "ocena": 5, "izvor": "Google", "datum": "2026-10-02" }]
```
Link „Sve recenzije na Google-u” se pojavljuje kad u `data/lokacije.json` upišete `googleRecenzijeUrl`.

## Nova fotografija
1. Sačuvajte original u `slike/` (taj folder ne ide na GitHub).
2. Dodajte red u `scripts/images.config.mjs` (`id`, `src`, `alt` na srpskom, po želji `crop` i `tone: 'telefon'`).
3. Pokrenite `npm run images`. Skripta uklanja EXIF/GPS i pravi AVIF, WebP i JPG.
4. Koristite `id` u JSON fajlu i uradite commit + push (fajlovi iz `public/img/` idu u repo).

## Objava
```bash
git add -A
git commit -m "Meni: cene za Terazije"
git push
```
Napredak objave: GitHub → repo → Actions. Sajt: https://cheef30.github.io/kafeterija-mlin/

## Lokalno pokretanje
```bash
npm install
npm run dev      # http://localhost:4321/kafeterija-mlin/
npm run build    # proverava da li sve prolazi pre push-a
```
