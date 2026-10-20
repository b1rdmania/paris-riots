# Full-size paintings -> game palette, no dither.
#   game/art/news/<n>.png  384x240 (still)
#   game/art/wide/<n>.png  480x300 (room for the chapter-card camera to pan)
import json
from PIL import Image
pal = json.load(open("art/palette.json"))["colors"]
flat = [int(c[i:i + 2], 16) for c in pal for i in (1, 3, 5)]
pimg = Image.new("P", (1, 1)); pimg.putpalette(flat + flat[:3] * (256 - len(pal)))
SRC = {n: f"art/full-scenes-first-four/{n}.png" for n in ["republique", "capucines", "louvre", "velib"]}
SRC["seine-rain"] = "art/background-bank/sources/seine-rain.png"
def fit(im, w, h):
    r = max(w / im.width, h / im.height)
    im = im.resize((round(im.width * r), round(im.height * r)), Image.LANCZOS)
    x, y = (im.width - w) // 2, (im.height - h) // 2
    return im.crop((x, y, x + w, y + h))
for n, f in SRC.items():
    im = Image.open(f).convert("RGB")
    if n in ["republique", "capucines", "louvre", "velib"]:
        fit(im, 384, 240).quantize(palette=pimg, dither=Image.Dither.NONE).save(f"game/art/news/{n}.png")
    fit(im, 480, 300).quantize(palette=pimg, dither=Image.Dither.NONE).save(f"game/art/wide/{n}.png")
    print(n)
