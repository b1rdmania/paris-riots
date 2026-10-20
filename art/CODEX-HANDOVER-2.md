# Codex handover 2: redo the first five, then build the rest

Repo: `~/Documents/couvre-feu`. Live game: https://couvre-feu.pages.dev. Read `art/ART-BRIEF.md` (full spec) and `art/STYLE-CHECK-1.md` (why the first five failed).

## 1. Redo the first five

Redo Lycéen, Tonton, Pink Panther, CRS and water cannon against `STYLE-CHECK-1.md`. In short:

- Bright tops, so units show up on dark asphalt (2) and zinc (5).
- Fill the 16×16 cell: 12–14 px wide, 15 tall, chibi head about 6 px. Keep the bottom row clear.
- Draw at native size, or hand-clean after downsampling. Flat areas, 2–3 shades, every detail at least 2 px. No lone noise pixels.
- Lycéen: red hood, a face, a white phone up. Tonton: separate head with a moustache, bright belly, jeans, a can. Pink Panther: all pink with a white muzzle, curled tail and black swag bag; no brown. CRS: lighter helmet, visor glint, pale shield. Water cannon: lighter, white stripe, blue light, bigger jet.

## 2. Check it in the game yourself

```
cp art/units.png art/units.json game/art/
cd game && python3 -m http.server 8765
```

Open http://localhost:8765, start a game, and look at the units on roads, blocks and parks at 3×. You can place any unit from the browser console:

```js
__cf.G.units.push({ id: 999, type: "panther", side: 0, x: 10, y: 5, hp: 100, done: false, capturing: false })
```

Side 0 = Lycéens (the game mirrors them), side 1 = CRS. Every unit in `availableUnits` draws from the sheet; the rest fall back to code sprites. Pass = you can name each unit from 1× on the map. If you can't, fix it before moving on.

## 3. Build the rest

In this order, checking each batch in the game as in step 2:

1. **The other 8 units** in `units.png`, same rows and 8 columns as `ART-BRIEF.md`: `bloc`, `trott`, `caddie`, `kangoo`, `gm`, `bravm`, `lbd`, `lacrymo`. Same style rules as step 1. Add each one to `availableUnits` and remove it from `unavailableRows`.
2. **`fx.png` + `fx.json`**: firework, teargas, water, rubber_bullet, paving_stone, flame, smoke, capture_flag. 16×16, 4 frames each.
3. **`tiles.png` + `tiles.json`**: block ×4, road ×16 (NESW mask), place ×2, park ×2, seine ×4 frames plus quay edges, bridge.
4. **`props.png` + `props.json`**: 16×24 cells. Every named HQ, base, landmark and shop in `ART-BRIEF.md`, plus `shop_looted`. Leave the 4×6 pennant gap top-right.
5. **Optional, if 1–4 land well**: battle cut-ins (96×64) and the two commander portraits (48×48).

Steps 2–4 need engine changes, which Claude makes. Only `units.png` is wired in now. Deliver those sheets with their JSON and Claude will plug them in.

## Rules that don't change

- Palette `art/palette.json` only: 32 colours, binary alpha, no dither. Don't edit the palette. Put any suggestions in a note.
- Don't change `game/index.html` or the game rules.
- Slapstick, no gore. Defeated units get arrested or go home.
- Keep `units-validation.json` up to date (off-palette pixels = 0).

## When you're done

Write `art/HANDOFF-2.txt` with what you delivered, what you checked in the game, and anything you're unsure of. Include a screenshot of the full roster on the map: `art/style-check-2.png`.
