# DESIGN.md · Kafeterija Mlin

## Pojam
**Pržionica, ne kafić.** Sajt se ponaša kao etiketa na kesi sveže pržene kafe, odštampana preko urbanog editorijala. Materijali dolaze iz samih lokala: kreda sa izloga na Voždovcu, bakar sa Espresso Bike-a i fasade, crni plafoni i cevi sa Novog Beograda, tirkizne stolice kao jedini živi akcenat.

Jedna stvar po kojoj se sajt pamti: **ručica mlina iz logotipa okreće se dok skrolujete.** Ručica se okreće oko svoje osovine kao na pravom ručnom mlinu: gledano spreda, krak se skraćuje, prelazi na drugu stranu i vraća. Sve ostalo je mirno i disciplinovano.

## Boje (izvučene sa fotografija, kontrast proveren)

| Token | Hex | Upotreba |
|---|---|---|
| `--grafit` | `#1F1B17` | tamne sekcije, tekst na papiru (13.9:1) |
| `--grafit-2` | `#2A2520` | površine na tamnom |
| `--papir` | `#EFE7DA` | osnovna pozadina, kraft salveta |
| `--kraft` | `#E4D8C6` | pojas Shop-a i etikete kafa |
| `--bakar` | `#B5714E` | wordmark, krupni naslovi, linije (≥ 24 px, 3.15:1) |
| `--bakar-tekst` | `#8A4B2C` | bakarni tekst na papiru (5.5:1) |
| `--bakar-svetli` | `#C98B63` | bakarni tekst na grafitu (6.0:1) |
| `--tirkiz` | `#1E9AAE` | SAMO: aktivni tab, fokus na tamnom, jedna oznaka po sekciji |
| `--tirkiz-tamni` | `#14707F` | fokus prsten na papiru (4.7:1) |
| `--juta` | `#A68A64` | tanke linije, ivice etiketa (dekor, ne tekst) |
| `--siva` | `#6B6158` | sekundarni tekst na papiru (4.9:1) |

Zabranjeno: gradijenti kao dekor (dozvoljen samo zatamnjujući gradijent preko fotografije), glow, staklo, senke ispod svake kartice.

## Tipografija
- **Archivo** (varijabilni, osa širine 62 do 125): naslovi u kondenzovanom rezu (`wdth 68`, `wght 800`), tesno (`-0.02em`), velika slova samo za krupne naslove.
- **Source Sans 3**: humanistički tekst, 17 do 19 px, prored 1.55, red do 68 znakova.
- **IBM Plex Mono**: samo za podatke sa etikete (adrese, oznake lota, faze prženja, „EST. 2017”). Nikad za dugmad i nikad iznad svakog naslova.
- Ćirilični МЛИН je SVG (rekonstrukcija sa fasade, majice i šolja), ne font.
- Skala (minor third, fluidna): 14 / 17 / 20 / 24 / 32 / 48 / 72 / 120 / clamp do 200 px za hero.

## Raspored i ritam
```
[header tanak · papir]  МЛИН (ručica)      Lokacije Pržionica Meni Shop Bike Novosti     EST. 2017
[HERO · grafit]         ┌──────────────── tekst levo ─────┐┌──── foto desno do ivice ────┐
                        │ KAFETERIJA MLIN OFFICIAL | 2017 ││  barista, МЛИН na kecelji   │
                        │ FRESHLY ROASTED.                ││                              │
                        │ ALWAYS MLIN.                    ││                              │
                        └─────────────────────────────────┘└──────────────────────────────┘
                        ═══ traka tri lokacije (mono, cela širina) ═══
[LOKACIJE · papir]      tri uspravne kartice različitih kadrova, fotografija + etiketa ispod
                        (telefon: horizontalni swipe sa snap-om)
[PRŽIONICA · grafit]    foto levo do ivice │ tekst klijenta desno; ispod krivulja prženja preko cele širine
[IZDVAJAMO · papir]     dve velike kartice u redu, asimetrične (7/5)
[KAFE · kraft]          etikete kese; prazno stanje = jedna etiketa sa kredom šoljice
[MENI · papir]          gust editorijalni grid nejednakih polja (8 fotografija)
[SHOP · kraft]          4 proizvoda, „Novogodišnja kolekcija” šira
[BIKE · grafit]         foto preko cele širine, bakarni panel sa tekstom preklapa donju ivicu
[NOVOSTI · papir]       tri stavke u redu, bez kartica: slika, datum (mono), naslov
[FUTER · grafit]        tri lokacije, kontakt, ogroman МЛИН preko cele širine, copyright + potpis
```
Poravnanje: levo, svuda. Ništa centrirano osim praznih stanja.

## Pokret (tačno pet stvari)
1. Ručica mlina na skrol (header).
2. Učitavanje hero-a: naslov se otkriva po redovima, jednom.
3. Kredne ilustracije (4 na sajtu) se iscrtavaju kad uđu u ekran.
4. Krivulja prženja se crta na skrol.
5. Mobilni meni: otvaranje/zatvaranje.
Sve isključeno pod `prefers-reduced-motion`.

## Oblici
Uglovi: 0 px (etikete su sečeni papir). Jedini izuzetak su dugmad sa 2 px. Senke: nema. Razdvajanje rade boja sekcije i tanka linija u juti.

## Pregled plana prema podrazumevanim rešenjima (šta sam promenio)
- **Krem + bakar** je blizu „AI krem + terakota” šablona. Brief ga zahteva, pa sam ga zadržao, ali pomerio: papir je tamniji i kraft-žutiji (`#EFE7DA`, ne `#F4F1EA`), bakar je metalan i braon (`#B5714E`, ne narandžasto-glineni), a stranica se smenjuje sa grafitnim blokovima i fotografijama, tako da krem nikad ne dominira.
- **Mono oznake iznad svakog naslova** su šablon. Brief traži mono „etiketu”, pa je mono ograničen na stvarne podatke (adresa, koordinate, faza prženja, lot). Naslovi sekcija nemaju eyebrow, osim jedinog klijentovog „KAFETERIJA MLIN OFFICIAL | EST. 2017”.
- **Numeracija 01 / 07** postoji samo gde je sadržaj zaista niz: faze prženja. Lokacije nisu niz, pa nose oznaku lota i koordinate, ne redni broj.
- **Centriran hero** je zamenjen asimetričnim: tekst levo na grafitu, fotografija se preliva do desne ivice. Telefon ima poseban raspored: tekst gore, fotografija ispod do dna ekrana.
- **Tri identične kartice lokacija**: svaka ima drugačiji kadar i drugačiju oznaku (TO GO, Subotom brunch, matična), a tekst je etiketa ispod slike, ne ikonica + naslov.
