# Art brief for Codex: Command & Couvre-feu

Turn-based Paris riot game, after the riots of 17–18 October 2026. Advance Wars rules, Amiga look. You can play either side. Same art method as Vex Tarot (`~/Documents/vex-tarot/art/`): fixed palette, native pixels, no dither, nearest-neighbour scaling.

The game runs now with placeholder sprites drawn in code (`game/index.html`, `ART`). Your sheets replace them. Do not change game rules or code. Claude wires the sheets in.

## Fixed rules

- Palette: `art/palette.json`, 32 colours, fixed order. Every pixel uses one of them. You may propose palette changes in a separate note. Do not change the file.
- Native screen: 384×240. Map tiles are 16×16. A unit is 16×16. A property is 16×16 and may grow 8 px upward (16×24) to overlap the tile above, like Advance Wars cities.
- 1 px dark outline (index 0) on units, so they read on any tile.
- Units face right. The game mirrors the Lycéens, who start in the east.
- Team colours are drawn into each sprite: Lycéens red/hi-vis (30, 26), CRS navy/blue (22–25). The game adds a 4 px team stripe under each unit and the HP number bottom-right. Keep those corners readable.
- Tone: slapstick, not gore. Nobody died in the real riots. Defeated units get "arrested" or "go home". No blood and no weapons that kill.

## Deliverables

Put everything in `art/`. Each PNG needs a JSON with frame rectangles (x, y, w, h), like `vex-sheet.json`.

### 1. `units.png`: 13 units × 8 frames, 16×16 cells

Columns: `idle0 idle1 walk0 walk1 attack0 attack1 hit ko`. One row per unit, in this order:

| Row | Id | Name | Side | What it is |
| --- | --- | --- | --- | --- |
| 0 | `lyceen` | LYCÉEN | Lycéens | Hooded youth, phone up, filming everything. Infantry. |
| 1 | `bloc` | BLACK BLOC | Lycéens | All black, balaclava, paving stone held overhead. |
| 2 | `trott` | TROTTINETTE | Lycéens | Kid on a rental e-scooter, two on board ideally. |
| 3 | `torse` | TONTON TORSE NU | Lycéens | Topless fat uncle. Belly, beer, unbothered by tear gas. |
| 4 | `panther` | PINK PANTHER | Lycéens | Pink cat burglar with a swag bag. Jewel thief (Louvre heist joke). Tiptoe walk cycle. |
| 5 | `caddie` | CADDIE MORTIER | Lycéens | Shopping trolley full of firework mortars. |
| 6 | `kangoo` | GILETS JAUNES | Lycéens | White Renault Kangoo van, hi-vis vests, flag out the window. |
| 7 | `crs` | CRS | CRS | Riot cop: helmet, visor, shield. |
| 8 | `gm` | GENDARME MOBILE | CRS | Heavier riot cop, two shields, baton. |
| 9 | `bravm` | BRAV-M | CRS | Two cops on one motorbike. |
| 10 | `lbd` | LBD | CRS | Cop with a rubber-bullet launcher. |
| 11 | `lacrymo` | LACRYMO | CRS | Cop with a tear-gas grenade launcher, green wisps. |
| 12 | `canon` | CANON À EAU | CRS | Water-cannon truck with a turret nozzle. |

The `ko` frame is the funny one: Lycéens get cuffed or dragged off by the hood, CRS sit down and rub their back.

### 2. `fx.png`: 16×16 cells, 4 frames each

`firework` burst · `teargas` cloud (pale green 31/17) · `water` splash · `rubber_bullet` (small, with a bounce) · `paving_stone` (thrown, tumbling) · `flame` (looted shop fire) · `smoke` · `capture_flag` (flag raised in the team colour).

### 3. `tiles.png`: 16×16 terrain

- `block`: Haussmann buildings seen from above at 3/4: zinc roof, chimney pots, cream facade strip at the bottom. 4 variants.
- `road`: asphalt boulevard. 16 variants by NESW neighbour mask (bit 1 = N, 2 = E, 4 = S, 8 = W), with lane dashes and pavement edges.
- `place`: cobbled square. 2 variants.
- `park`: trees and gravel paths. 2 variants.
- `seine`: water, 4 animation frames, plus a stone quay edge where the water meets land to the north or south.
- `bridge`: vertical stone bridge over the Seine.

### 4. `props.png`: 16×24 cells (8 px overhang above the tile)

One sprite each. The game draws the owner pennant top-right, so leave a 4×6 gap there.

- HQs: `beauvau` (Interior Ministry, tricolour), `lycee` (Lycée Voltaire: crumbling, a ceiling falling in, a tarp on the roof).
- Bases: `prefecture` (Préfecture de Police), `invalides` (gold dome), `sorbonne`, `metro` (Guimard green arch, yellow M).
- Landmarks: `arc`, `opera`, `louvre` (glass pyramid), `halles`, `hdv` (Hôtel de Ville), `nd` (Notre-Dame), `eiffel` (the tower top can overhang).
- Shops: `shop` (generic storefront with an awning) and `shop_looted` (smashed glass, empty racks). If you have time, branded-looking but unbranded variants: sneaker shop, phone shop, brasserie (Fouquet's), boulangerie, kebab.

### 5. Optional, the big win: battle cut-ins

Advance Wars shows a side-on battle scene when units fight. If you do this, one 96×64 panel per unit: a squad of 3–5 figures standing (`idle`), then `attack` (4 frames). The game shows attacker left, defender right. Ideas: the Kangoo honking and lurching, Tonton slapping his belly, Pink Panther tiptoeing past and leaving with the target's wallet, the water cannon knocking a row of kids over like skittles.

### 6. Optional: two commanders, 48×48 portraits

For the turn banner. `la_deleguee`: a 16-year-old class rep with a megaphone and a "GÉNÉRATION 6-7 REFAIT MAI 68" placard. `le_prefet`: a moustached prefect in uniform, phone in each hand. Fictional faces, not real people.

## Order of work

1. `units.png` rows 0, 3, 4, 7, 12 first (Lycéen, Tonton, Pink Panther, CRS, water cannon). Claude wires them in, then checks the look in the game before you do the rest.
2. The remaining units, then `fx.png`.
3. `tiles.png` + `props.png`.
4. The cut-ins and portraits, if the first three land.

## Spares

Ideas for later. They are not in the game yet: a Deliveroo rider (heals neighbours), a TikToker (boosts adjacent units), a BAC plainclothes cop disguised as a Lycéen, a police drone, a street sweeper who repairs looted shops at night.
