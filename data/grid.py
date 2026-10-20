# classes.json + paris.json -> grid.json: the 24x13 terrain grid the rules use.
import json, math
MW, MH, TS = 24, 13, 16
c = json.load(open("classes.json")); C = c["classes"]
d = json.load(open("paris.json"))
W, E, N, S = c["W"], c["E"], c["N"], c["S"]
px = lambda lon, lat: ((lon - W) / (E - W) * MW * TS, (N - lat) / (N - S) * MH * TS)
grid = [["#"] * MW for _ in range(MH)]
cnt = lambda tx, ty, chars: sum(C[ty * TS + j][tx * TS + i] in chars for j in range(TS) for i in range(TS))
# boulevards: tiles a main road runs through, walked finely so the network stays 4-connected
MAIN = {"trunk", "primary", "secondary"}
road = [[0] * MW for _ in range(MH)]
for r in d["roads"]:
    if r["c"] not in MAIN: continue
    pts = [px(*q) for q in r["p"]]
    last = None
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        n = max(1, int(math.hypot(x1 - x0, y1 - y0)))
        for k in range(n + 1):
            x, y = x0 + (x1 - x0) * k / n, y0 + (y1 - y0) * k / n
            tx, ty = int(x // TS), int(y // TS)
            if not (0 <= tx < MW and 0 <= ty < MH): last = None; continue
            if last and last != (tx, ty) and last[0] != tx and last[1] != ty:
                road[last[1]][tx] += 1  # corner step keeps 4-connectivity
            road[ty][tx] += 1; last = (tx, ty)
bridge = [[0] * MW for _ in range(MH)]
for r in d["roads"]:
    if not r["b"] or r["c"] not in ("trunk", "primary", "secondary"): continue
    for q in r["p"]:
        x, y = px(*q); tx, ty = int(x // TS), int(y // TS)
        if 0 <= tx < MW and 0 <= ty < MH: bridge[ty][tx] = 1
for ty in range(MH):
    for tx in range(MW):
        w, b, t = cnt(tx, ty, "W"), cnt(tx, ty, "bB"), cnt(tx, ty, "T")
        if w + b >= 22: grid[ty][tx] = "b" if bridge[ty][tx] else "~"
        elif t >= 110: grid[ty][tx] = "T"
        elif road[ty][tx] >= 12: grid[ty][tx] = "="
print("\n".join("".join(r) for r in grid))
json.dump(["".join(r) for r in grid], open("grid.json", "w"))
