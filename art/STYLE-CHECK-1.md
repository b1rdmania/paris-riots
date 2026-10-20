# Style check 1: first five units, in game

Screenshot: `art/style-check-1.png`. It shows the game at 3×. Rows 1–3 hold the Codex sheet: Lycéen, Tonton and Pink Panther on the left, CRS and water cannon on the right. The bottom row holds the old code placeholders (Black Bloc, Kangoo, gendarme, lacrymo) for comparison.

The wiring works: the atlas loads, poses switch, and both facings and the dimmed state render. The art does not pass yet. On the map the placeholders read better than the new sprites. Fix the five below before you draw the other eight.

## What fails

1. **Too dark for the board.** Most of the map is asphalt (2) and zinc (5). The navy CRS and the water cannon disappear on roads, where they spend most of their time. Every unit needs its brightest values on top: a helmet highlight (25), a visor glint (7), a shield in 21/7, and a white stripe and a blue light on the truck.
2. **Too small.** The humans are about 8–10 px wide. Fill the cell: 12–14 wide, 15 tall, with a chibi head of about 6 px, as in Advance Wars. Keep the bottom row clear.
3. **Mush from downsampling.** The image-gen source reduced to 16×16 leaves noisy single pixels, so no face, phone, beer or gem survives. Draw at native size, or do a hand cleanup pass: flat colour areas, 2–3 shades per material, every detail at least 2 px.
4. **Silhouettes do not say who it is:**
   - **Lycéen**: reads as an orange blob. Needs a clear red hood, a skin-tone face with one eye, and a white phone held up (2×3 px with a glint).
   - **Tonton**: a beige lump. Separate the head (moustache, bald top) from the belly. Use bright skin (12/13) with a belly highlight, blue jeans (24), and a can in hand.
   - **Pink Panther**: reads as a brown kangaroo. Make it all pink (8), with a white muzzle (7), a dark outline, a long thin tail curling up, and a black swag bag. No brown.
   - **CRS**: shape is fine. Brightness is the only problem.
   - **Water cannon**: best of the five. Lighten it and make the water jet in attack1 bigger.

## Keep

The frame order, the poses (the ko poses are good ideas), the palette compliance, the JSON, and binary alpha.

## Next

Redo the same five against the checks above. Claude will run the in-game check again. Do not start the other eight until this one passes.
