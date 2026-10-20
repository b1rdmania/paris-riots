# Paris Riots: The Game

A turn-based story game on a pixel map of central Paris. You play the lycéens through five chapters. Curfew is at 23:00.

Play: https://couvre-feu.pages.dev

![Paris Riots: The Game](game/og.jpg)

## How it works

| Part | Source |
| --- | --- |
| Map | OpenStreetMap streets, water and parks for central Paris, drawn as pixel art by `data/render.py`. The game grid comes from the same render, so the rules match the picture. |
| Rules | Advance Wars: move a unit, then fire, capture or wait. Each chapter has one goal. |
| Story | Five chapters set on 17 October 2026, each with a diary card and a coach. You can play them in any order. |
| Art | Painted with Codex in a fixed 32-colour palette. |
| Music | Ten French classics from BitMidi, played on a four-channel Game Boy-style synth from [Wario Synth](https://wario.style). The menu lists them. |

The game is one page with a canvas and no libraries. It runs on Cloudflare Pages. It needs a desktop browser.

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

Map data © OpenStreetMap contributors, ODbL.

Music, as chiptune covers: Offenbach, Rouget de Lisle, Degeyter, Satie, Édith Piaf, Desireless, Serge Gainsbourg and Daft Punk. The songs belong to their writers.

Built with Opus and Codex, and 10,000+ hours playing Amiga games as a kid.

## Licence

MIT
