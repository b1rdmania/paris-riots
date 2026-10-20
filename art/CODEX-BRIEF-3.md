# Codex brief 3: iconic scenes + Amiga/LucasArts front end

The game is now **Paris Riots - The Game** (live: https://couvre-feu.pages.dev). The map is real Paris, and your units, props and battle cut-ins are wired in. Play a fight to see the battle screen. Andy wants two things next:

1. The battle backdrops should recreate the iconic photos of the 17–18 October 2026 riots.
2. Every menu and screen should feel like an Amiga / LucasArts game, the way Vex Tarot does (`~/Documents/vex-tarot/art/rooms/`).

The rules from `ART-BRIEF.md` still apply: `art/palette.json` only, binary alpha, no dither, slapstick, nobody dies. Don't change `game/index.html`. Claude wires the art in.

## A. Battle scenes: `scenes.png` + `scenes.json`

During a fight the screen splits in two. Each half shows the place where that unit stands, with the 96×64 squad cut-in drawn on top at 2×.

- **Size:** each scene is **96×66 native**, drawn at 2×, so its pixels match the cut-ins.
- **Layout:** the squad covers most of the frame from the bottom up. Put the subject in the **top half and at the edges**: skyline, statue, placard, smoke. Keep the bottom 8 px as plain ground (asphalt, gravel or bridge deck) so feet land on something.
- **Mirroring:** the right half is never mirrored. Only the squads flip.
- **Light:** dusk-to-night with orange fire light suits most of them. Optional `_day` variants are welcome.

Recreate the moment in our palette and style. Work from the photo descriptions below; you may look at the photos.

| key | Map location (`byProp`) | Moment |
| --- | --- | --- |
| `republique` | METRO REPUBLIQUE | Marianne statue with a yellow hi-vis vest draped round her and kids climbing the plinth. Heavy smoke, a kiosk burning. Photos: BBC "In pictures", Guardian gallery, AFP/Saligot "heavy smoke around the statue". |
| `capucines` | OPERA, GALERIES LAFAYETTE, APPLE STORE | A fire on Boulevard des Capucines. A kid holds up a placard: **GÉNÉRATION 6-7 REFAIT MAI 68**. Opéra Garnier's green dome behind. AFP/Kiran Ridley. |
| `louvre` | LOUVRE | The glass pyramid barricaded with crowd barriers and bins. A student holds a **FERMÉ** sign; tourists wait behind a cordon. AFP/Dilkoff, AP/Ena. |
| `champs` | ARC DE TRIOMPHE, FOUQUET'S, NIKE, PSG STORE, SEPHORA | A barricade across the Champs-Élysées, with the Arc de Triomphe at the end of the avenue. Reuters. |
| `halles` | LES HALLES, METRO CHATELET, FNAC, ZARA | Kids kicking in a sneaker shop window near Châtelet–Les Halles. AFP/Rondel. |
| `rivoli_cafe` | HOTEL DE VILLE, MONOPRIX | The morning after on Rue de Rivoli: a couple sitting calmly on a café terrace among smashed windows. The deadpan one. AFP/Dilkoff. |
| `boulangerie` | BOULANGERIE, KEBAB | A bakery on fire, baguettes in the window. Reuters. |
| `ile` | PREFECTURE DE POLICE, NOTRE-DAME, SORBONNE | A CRS line and a water cannon on the Île de la Cité, Notre-Dame's towers behind. |
| `velib` | `byTerrain` `=` (any boulevard) | Hire bikes piled in the road and burning. Getty. |
| `guerre_civile` | `byTerrain` `#` (inside blocks) | A car burning beside graffiti: **INTRODUCTION À LA GUERRE CIVILE**. AFP/Saligot. |
| `pont` | `byTerrain` `b` (bridges) | A Seine bridge, its stone balustrade, and a tear-gas cloud drifting over the water. |
| `jardin` | `byTerrain` `T` (parks) | Tuileries gravel, plane trees, a burning bin. |
| `beauvau` | PLACE BEAUVAU, INVALIDES | The Interior Ministry gates, a tricolour, a row of CRS vans. |
| `lycee` | LYCEE CHARLEMAGNE | The crumbling lycée: tarp on the roof, a fallen ceiling tile on the steps, a banner. |

`scenes.json` shape (the engine already reads it):

```json
{
  "frames": { "republique": { "x": 0, "y": 0, "w": 96, "h": 66 } },
  "byProp": { "METRO REPUBLIQUE": "republique", "OPERA": "capucines" },
  "byTerrain": { "=": "velib", "#": "guerre_civile", "b": "pont", "T": "jardin" },
  "captions": { "republique": "PLACE DE LA REPUBLIQUE", "capucines": "BOULEVARD DES CAPUCINES" }
}
```

Captions appear under the fight in our 5×7 font: uppercase, under 40 characters.

## B. Amiga / LucasArts front end

The menus are flat boxes with text. Make them feel like a 1991 Amiga game, using LucasArts' VGA rooms and Vex's Velvet Alcove as the reference. The screen is 384×240.

1. **`title.png` (384×240)**: a painted title scene: Place de la République at dusk, Marianne in hi-vis, smoke, a CRS line on one side and lycéens on the other. A painted **PARIS RIOTS** logotype, chunky Amiga-era lettering with fire or chrome built from palette ramps, with **THE GAME** under it. Leave a clear band at y 150–226 for 4 menu lines in our font, like Vex's control strip.
2. **`ui.png` + `ui.json`**: UI chrome:
   - a 9-slice menu frame (24×24, 8 px corners): LucasArts black with a thin gilt or brass line, or Amiga bevel. Your call; pick one and keep it consistent.
   - the selection marker for a menu row, and a 16×16 Amiga-style pointer cursor.
   - END TURN and BACK buttons (normal and pressed), 48×12.
   - a turn banner frame (384×46) in each side's colours. The Lycéens' can be a cardboard placard, the CRS's an official Préfecture strip.
   - side emblems, 16×16: Lycéens (a raised fist with a phone) and CRS (a shield).
3. **`victory_lyceens.png` and `victory_crs.png` (384×240)**: win screens. Lycéens: kids on the Marianne statue at night with fireworks. CRS: dawn, street sweepers and the café-terrace couple. Leave a band at y 150–200 for result text.
4. **`help.png` (384×240)**: the How to Play page background. An official Préfecture "NOTE DE SERVICE" memo, coffee-stained, with space for 16 lines of text at x 14–370, y 30–200.
5. **Optional: `font8.png` + `font8.json`**: an 8×8 Topaz-style bitmap font (A–Z, 0–9, punctuation, É È À Ç) for headings. Body text stays in the 5×7 font.

## Order

1. Scenes `republique`, `capucines`, `louvre`, `velib`. Check them in the game: run `python3 -m http.server` in `game/`, start a two-player game, and attack. Then do the rest.
2. `title.png`, then `ui.png`.
3. The win screens and `help.png`, then the font.

When you're done, write `art/HANDOFF-3.txt` with a screenshot of one fight on a painted scene.
