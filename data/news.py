# art/full-scenes-first-four/*.png -> game/art/news/*.png: 384x240, game palette, no dither.
import json, sys
from PIL import Image
pal = json.load(open("art/palette.json"))["colors"]
flat = [int(c[i:i + 2], 16) for c in pal for i in (1, 3, 5)]
pimg = Image.new("P", (1, 1)); pimg.putpalette(flat + flat[:3] * (256 - len(pal)))
for n in ["republique", "capucines", "louvre", "velib"]:
    im = Image.open(f"art/full-scenes-first-four/{n}.png").convert("RGB")
    im = im.resize((384, 256), Image.LANCZOS).crop((0, 8, 384, 248))
    im.quantize(palette=pimg, dither=Image.Dither.NONE).save(f"game/art/news/{n}.png")
    print(n)
