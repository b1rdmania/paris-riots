import json, sys
from PIL import Image, ImageDraw
g = json.load(open("grid.json")); im = Image.open("../game/art/paris.png").convert("RGB")
im = im.resize((im.width * 3, im.height * 3), Image.NEAREST); d = ImageDraw.Draw(im, "RGBA")
col = {"=": (255, 255, 255, 60), "~": (0, 120, 255, 90), "b": (255, 200, 0, 120), "T": (0, 255, 0, 70), "#": (0, 0, 0, 0), "P": (255, 0, 0, 120)}
for y, row in enumerate(g):
    for x, ch in enumerate(row):
        d.rectangle([x * 48, y * 48, x * 48 + 47, y * 48 + 47], fill=col.get(ch, (0, 0, 0, 0)), outline=(255, 255, 255, 40))
        d.text((x * 48 + 3, y * 48 + 2), f"{x},{y}", fill=(255, 255, 0, 200))
im.save(sys.argv[1])
