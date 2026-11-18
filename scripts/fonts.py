"""Pravi lake fontove za sajt iz @fontsource paketa.

- Archivo: varijabilni font sužen na ose koje sajt koristi (širina 68 do 75, težina 650 do 800).
- Source Sans 3: težina 400 do 700.
- Latin Extended fajlovi se seku na Latin Extended-A (č ć đ š ž i ostala slova srednje Evrope).

Pokretanje: python scripts/fonts.py
"""
from pathlib import Path
from io import BytesIO
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

ROOT = Path(__file__).resolve().parent.parent
NM = ROOT / "node_modules"
OUT = ROOT / "public" / "fonts"
OUT.mkdir(parents=True, exist_ok=True)

LATIN = "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"
LATIN_EXT_A = "U+0100-017F"


def build(src: Path, dst: str, unicodes: str, limits: dict | None = None):
    font = TTFont(src, lazy=False)
    if limits:
        font = instancer.instantiateVariableFont(font, limits)
        buf = BytesIO()
        font.flavor = None
        font.save(buf)
        buf.seek(0)
        font = TTFont(buf, lazy=False)
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = ["kern", "liga", "calt", "ccmp", "locl", "mark", "mkmk", "tnum"]
    opts.name_IDs = ["*"]
    opts.notdef_outline = True
    sub = subset.Subsetter(opts)
    sub.populate(unicodes=subset.parse_unicodes(unicodes))
    sub.subset(font)
    path = OUT / dst
    font.flavor = "woff2"
    font.save(path)
    print(f"{dst}: {path.stat().st_size // 1024} KB")


arch = NM / "@fontsource-variable/archivo/files"
sans = NM / "@fontsource-variable/source-sans-3/files"
mono = NM / "@fontsource/ibm-plex-mono/files"
A = {"wdth": (68, 75), "wght": (650, 800)}
S = {"wght": (400, 700)}

build(arch / "archivo-latin-wdth-normal.woff2", "archivo-latin.woff2", LATIN, A)
build(arch / "archivo-latin-ext-wdth-normal.woff2", "archivo-latin-ext.woff2", LATIN_EXT_A, A)
build(sans / "source-sans-3-latin-wght-normal.woff2", "source-sans-3-latin.woff2", LATIN, S)
build(sans / "source-sans-3-latin-ext-wght-normal.woff2", "source-sans-3-latin-ext.woff2", LATIN_EXT_A, S)
for w in ("400", "500"):
    build(mono / f"ibm-plex-mono-latin-{w}-normal.woff2", f"ibm-plex-mono-latin-{w}.woff2", LATIN)
    build(mono / f"ibm-plex-mono-latin-ext-{w}-normal.woff2", f"ibm-plex-mono-latin-ext-{w}.woff2", LATIN_EXT_A)
