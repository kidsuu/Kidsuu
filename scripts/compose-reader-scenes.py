"""Deterministic composition of internal draft reader art (requires Pillow).
Run with --sources pointing to the generated source-image directory and --reference
pointing to the OWNER'S approved clean-pair.png. Does not generate/redesign a mascot.
Do not run automatically in CI: the committed output hashes are checked there.
"""
import argparse
import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

p = argparse.ArgumentParser()
p.add_argument('--sources', required=True)
p.add_argument('--reference', required=True)
p.add_argument('--output', default='src/features/content/assets/demo')
a = p.parse_args()
src, out = Path(a.sources), Path(a.output)
out.mkdir(parents=True, exist_ok=True)
resample = Image.Resampling.LANCZOS

def save(im, name):
    im = im.convert('RGB')
    w = 960
    im = im.resize((w, round(im.height*w/im.width)), resample)
    im.save(out / (name+'.png'), optimize=True)

# Deliberate object close-ups remove distant furniture inconsistencies from AI art.
for source, name in [('paper-start', 'story-01'), ('paper-rain', 'story-02')]:
    save(Image.open(src/(source+'.png')).crop((70, 340, 1190, 820)), name)

bench = Image.open(src/'bench-empty.png').convert('RGB')
save(bench, 'story-03')
# Shared paper geometry is IDENTICAL in scenes 4, 5 and 6. It stays on dry wood.
quad = [(650,530),(978,685),(813,743),(500,581)]
def pt(u,v):
    return tuple(sum(weight*q[axis] for weight,q in zip([(1-u)*(1-v),u*(1-v),u*v,(1-u)*v],quad)) for axis in [0,1])
for number in [4,5,6]:
    im=bench.copy()
    d=ImageDraw.Draw(im)
    d.polygon([(x+2,y+4) for x,y in quad], fill='#a99582')
    d.polygon(quad, fill='#fffefa', outline='#81776f', width=2)
    # One long blue wavy line, not a folded boat or water.
    wave=[pt(.08+.84*i/120,.62+.12*math.sin(i/120*4*math.pi)) for i in range(121)]
    d.line(wave, fill='#547cb0',width=3,joint='curve')
    fold=[pt(0,.73),pt(.12,1),pt(0,1)]
    d.polygon(fold,fill='#e2dedd',outline='#9f9794')
    d.line([pt(0,.73),pt(.12,1)],fill='#9f9794',width=2)
    if number>=5:
        leaf=[pt(u,v) for u,v in [(.35,.49),(.42,.35),(.54,.31),(.65,.4),(.59,.53),(.46,.56)]]
        d.polygon(leaf,fill='#7e9860',outline='#566d40',width=2)
        d.line([pt(.36,.48),pt(.64,.4)],fill='#536c3c',width=2)
    if number==6:
        d.line([pt(.52,.46),pt(.52,.08)],fill='#547cb0',width=2)
        sail=[pt(.52,.08),pt(.70,.36),pt(.52,.36),pt(.52,.08)]
        d.polygon(sail[:-1],fill='#f0eee7')
        d.line(sail,fill='#547cb0',width=2,joint='curve')
    save(im,f'story-0{number}')

pair=Image.open(a.reference).convert('RGBA')
# Source crop is recorded and checked in the provenance file. No generative edit.
dog=pair.crop((192,155,420,355))
dog=dog.crop(dog.getbbox())
dog=dog.resize((300,round(dog.height*300/dog.width)),resample)
for source,name in [('cloth-background-rest','rhyme-rest'),('cloth-background-up','rhyme-up')]:
    im=Image.open(src/(source+'.png')).convert('RGBA')
    shadow=Image.new('RGBA',im.size)
    ImageDraw.Draw(shadow).ellipse((82,738,390,785),fill=(92,77,104,38))
    im=Image.alpha_composite(im,shadow.filter(ImageFilter.GaussianBlur(9)))
    im.alpha_composite(dog,(80,770-dog.height))
    save(im,name)
# Retain authoritative cast reference byte-for-byte, not an AI redrawing.
(out/'cast-reference.png').write_bytes(Path(a.reference).read_bytes())
print('Composed 6 story scenes, 2 rhyme frames and unchanged cast reference.')
