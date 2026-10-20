# BBBike Paris .osm.pbf -> data/paris.json: streets, water, parks and buildings inside the game frame.
# usage: venv/bin/python extract.py Paris.osm.pbf paris.json
import json, sys
import osmium
from shapely import wkb
from shapely.geometry import box, mapping

W, E, S, N = 2.2840, 2.3770, 48.8400, 48.8770
FRAME = box(W, S, E, N)
fab = osmium.geom.WKBFactory()
MAJOR = {"trunk", "primary", "secondary"}
MINOR = {"tertiary", "residential", "unclassified", "living_street", "pedestrian"}
out = {"roads": [], "water": [], "parks": [], "buildings": [], "squares": []}

def rnd(geom):
    return [[[round(x, 6), round(y, 6)] for x, y in ring] for ring in geom]

def polys(g):
    g = g.intersection(FRAME)
    if g.is_empty: return []
    parts = getattr(g, "geoms", [g])
    res = []
    for p in parts:
        if p.geom_type != "Polygon": continue
        res.append([list(p.exterior.coords)] + [list(i.coords) for i in p.interiors])
    return res

for o in osmium.FileProcessor(sys.argv[1]).with_locations().with_areas():
    t = o.tags
    if o.is_way() and "highway" in t:
        hw = t["highway"]
        if hw not in MAJOR and hw not in MINOR: continue
        try: pts = [(n.lon, n.lat) for n in o.nodes]
        except osmium.InvalidLocationError: continue
        if not any(W <= x <= E and S <= y <= N for x, y in pts): continue
        if t.get("area") == "yes":
            continue
        out["roads"].append({"c": hw, "b": t.get("bridge") == "yes", "n": t.get("name", ""), "p": [[round(x, 6), round(y, 6)] for x, y in pts]})
    elif o.is_area():
        kind = None
        if t.get("natural") == "water" or t.get("waterway") == "riverbank": kind = "water"
        elif t.get("leisure") in ("park", "garden") or t.get("landuse") in ("grass",): kind = "parks"
        elif "building" in t: kind = "buildings"
        elif t.get("highway") == "pedestrian" or t.get("place") == "square": kind = "squares"
        if not kind: continue
        try: g = wkb.loads(fab.create_multipolygon(o), hex=True)
        except Exception: continue
        if not g.intersects(FRAME): continue
        if kind == "buildings": g = g.simplify(0.00002)
        for p in polys(g):
            out[kind].append([[[round(x, 6), round(y, 6)] for x, y in ring] for ring in p])

json.dump(out, open(sys.argv[2], "w"))
print({k: len(v) for k, v in out.items()})
