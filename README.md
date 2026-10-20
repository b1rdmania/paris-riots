# Paris Riots: The Game

A turn-based game on a pixel map of central Paris. Play the lycéens or the CRS. Curfew is at 23:00.

Play: https://couvre-feu.pages.dev

![Paris Riots: The Game](game/og.jpg)

## How it works

| Part | Source |
| --- | --- |
| Map | OpenStreetMap streets, water and parks for central Paris, drawn as pixel art by `data/render.py`. The game grid comes from the same render, so the rules match the picture. |
| Rules | Advance Wars: move a unit, then fire, capture or wait. Hold 4 of 7 landmarks at curfew to win as the lycéens. |
| Story | Five chapters set on 17 October 2026, with a diary card before each one. |
| Art | Painted with Codex in a fixed 32-colour palette. |
| Music | Public-domain tunes from BitMidi, played on a four-channel Game Boy-style synth. |

The game is one page with a canvas and no libraries. It runs on Cloudflare Pages.

## Run it

```
python3 -m http.server -d game 8000
```

Then open http://localhost:8000.

## Rebuild the map

Download the BBBike Paris extract to `data/Paris.osm.pbf`, then run these from `data/` with Python 3 and `osmium`, `shapely` and `pillow`:

```
python extract.py Paris.osm.pbf paris.json
python render.py paris.json ../game/art/paris.png
python grid.py
python layout.py
```

`layout.py` writes `game/map.js`.

## Credits

Map data © OpenStreetMap contributors, ODbL. Music: Offenbach, Rouget de Lisle, Degeyter and Satie, all public domain.

Built with Opus and Codex, and 10,000+ hours playing Amiga games as a kid.

## Licence

MIT
