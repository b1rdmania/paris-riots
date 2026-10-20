PARIS RIOTS — STOCK BACKGROUND BANK 1

Four original paintings, each delivered as:
  <name>.png          clean full-screen background
  <name>-results.png  matching background with result-text band

Order in contact-sheet.png (left to right, top to bottom):
  seine-rain           Rainy Seine intermission
  metro-last-train     Quiet boulevard and metro entrance
  students-afterglow   Fireworks and bicycles at Republique
  cafe-morning-after  Dawn cleanup and the untroubled cafe couple

All eight runtime files: 384x240, opaque, existing art/palette.json
32-colour palette. No dithering algorithm. Scale with nearest-neighbour.
Result variants: draw text inside x12 y157 w360 h36.
For gameplay overlays, use clean versions and an opaque UI panel where
needed; painted cobbles are not a guaranteed readable text background.

These are optional stock assets, not engine-integrated or deployed.
Existing title, scenes and victory art were not replaced.
Manifest records filenames, intended uses and result text bounds.

Built-in image_gen produced the original paintings using victory_crs.png
as a style reference. Exact prompts are in PROMPTS.txt. Full-size source
paintings are retained in sources/. Sources are not palette-constrained.

Rebuild from repository root:
  node art/src/build-background-bank.cjs

Verified: contact sheet at native resolution; result-band composition;
all runtime pixels opaque and indexed within the established palette.
