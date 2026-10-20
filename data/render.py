# data/paris.json -> game/art/paris.png: the 384x208 map background in the game palette.
# Streets carve the city into blocks; each block is drawn as a Haussmann block:
# zinc roof, a lit north edge, and a two-pixel limestone facade with windows on the south.
# usage: venv/bin/python render.py paris.json ../game/art/paris.png
import json, math, random, sys
from PIL import Image, ImageDraw

import os
MW, MH, TS = 24, 13, 16
PW, PH = MW * TS, MH * TS
CLAT = 48.8585
W, E = 2.2865, 2.3745
# EXTRA=n renders n more pixels of Paris on each side (scenery for wide phone screens)
EXTRA = int(os.environ.get("EXTRA", "0"))
if EXTRA:
    dx = (E - W) * EXTRA / PW
    W, E, PW = W - dx, E + dx, PW + 2 * EXTRA
HLAT = (E - W) * math.cos(math.radians(CLAT)) * PH / PW
N, S = CLAT + HLAT / 2, CLAT - HLAT / 2
PAL = json.load(open("../art/palette.json"))["colors"]
RGB = [int(c[i:i + 2], 16) for c in PAL for i in (1, 3, 5)]
rng = random.Random(7)

def px(lon, lat):
    return ((lon - W) / (E - W) * PW, (N - lat) / (N - S) * PH)

d = json.load(open(sys.argv[1]))
WIDTH = {"trunk": 3, "primary": 3, "secondary": 2, "tertiary": 1, "residential": 1, "unclassified": 1, "living_street": 1, "pedestrian": 1}

# Class map: 0 block, 1 street, 2 park, 3 water, 4 square, 6 bridge edge, 7 bridge deck
cls = Image.new("L", (PW, PH), 0)
cg = ImageDraw.Draw(cls)
for s in d["squares"]:
    if len(s[0]) > 2: cg.polygon([px(*q) for q in s[0]], fill=4)
for p in d["parks"]:
    if len(p[0]) > 2: cg.polygon([px(*q) for q in p[0]], fill=2)
for r in sorted(d["roads"], key=lambda r: WIDTH[r["c"]]):
    cg.line([px(*q) for q in r["p"]], fill=1, width=WIDTH[r["c"]])
water = Image.new("1", (PW, PH), 0)
wg = ImageDraw.Draw(water)
def seine(w):
    xs, ys = zip(*(px(*q) for q in w[0]))
    return max(xs) - min(xs) > 40 or (max(ys) - min(ys) < 40 and max(xs) - min(xs) > 6)
d["water"] = [w for w in d["water"] if len(w[0]) > 2 and seine(w)]
for w in d["water"]:
    wg.polygon([px(*q) for q in w[0]], fill=1)
for w in d["water"]:
    for hole in w[1:]:
        if len(hole) > 2: wg.polygon([px(*q) for q in hole], fill=0)
bridge = Image.new("L", (PW, PH), 0)
bg = ImageDraw.Draw(bridge)
for r in d["roads"]:
    if r["b"]:
        pts = [px(*q) for q in r["p"]]
        bg.line(pts, fill=1, width=WIDTH[r["c"]] + 2)
        bg.line(pts, fill=2, width=max(1, WIDTH[r["c"]]))

C = [[cls.getpixel((x, y)) for x in range(PW)] for y in range(PH)]
for y in range(PH):
    for x in range(PW):
        if water.getpixel((x, y)):
            b = bridge.getpixel((x, y))
            C[y][x] = 5 + b if b else 3
at = lambda x, y: C[y][x] if 0 <= x < PW and 0 <= y < PH else -1

img = Image.new("P", (PW, PH), 2)
img.putpalette(RGB + [0] * (768 - len(RGB)))
put = img.putpixel
for y in range(PH):
    for x in range(PW):
        c = C[y][x]
        if c == 0:
            if at(x, y + 1) not in (0, -1): put((x, y), 11)                     # facade base
            elif at(x, y + 2) not in (0, -1): put((x, y), 3 if x % 2 else 12)  # windows in limestone
            elif at(x, y - 1) not in (0, -1): put((x, y), 6)                    # lit roof edge
            elif at(x - 1, y) not in (0, -1) or at(x + 1, y) not in (0, -1): put((x, y), 4)
            else: put((x, y), 5)
        elif c == 1: put((x, y), 2)
        elif c == 4: put((x, y), 4)
        elif c == 2:
            r = rng.random()
            put((x, y), 16 if r < 0.3 else 17 if r < 0.36 else 15)
        elif c == 3:
            edge = any(at(x + dx, y + dy) not in (3, 6, 7, -1) for dx, dy in ((0, -1), (0, 1), (-1, 0), (1, 0)))
            put((x, y), 13 if edge else (20 if rng.random() < 0.08 else 19))
        elif c == 6: put((x, y), 11)
        elif c == 7: put((x, y), 12)
# tree shadows in parks
for y in range(PH - 1, 0, -1):
    for x in range(PW):
        if C[y][x] == 2 and img.getpixel((x, y)) == 15 and img.getpixel((x, y - 1)) == 16: put((x, y), 14)
# plane trees along the widest boulevards
for r in d["roads"]:
    if WIDTH[r["c"]] < 3 or r["b"]: continue
    pts = [px(*q) for q in r["p"]]
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        L = math.hypot(x1 - x0, y1 - y0)
        if L < 1: continue
        nx, ny = -(y1 - y0) / L, (x1 - x0) / L
        for k in range(1, int(L), 3):
            x, y = x0 + (x1 - x0) * k / L, y0 + (y1 - y0) * k / L
            for side in (-1.6, 1.6):
                tx, ty = int(round(x + nx * side)), int(round(y + ny * side))
                if 0 <= tx < PW and 0 <= ty < PH and C[ty][tx] in (0, 1): put((tx, ty), 16)
img.save(sys.argv[2])
if not EXTRA: json.dump({"W": W, "E": E, "N": N, "S": S, "classes": ["".join(".=TW-~bB"[C[y][x]] for x in range(PW)) for y in range(PH)]}, open("classes.json", "w"))
print("ok", round(N, 5), round(S, 5))
