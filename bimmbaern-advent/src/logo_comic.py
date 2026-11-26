import re, sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()
# 1) drop bevel overlays (every path that references a blur filter)
n0 = len(re.findall(r'<path', s))
s = re.sub(r'<path\b(?:(?!/>).)*?filter:url\(#[^)]+\)(?:(?!/>).)*?/>', '', s, flags=re.S)
s = re.sub(r'<filter\b.*?</filter>', '', s, flags=re.S)
print('paths', n0, '->', len(re.findall(r'<path', s)))
# 2) ink outlines
INK = '#1a1210'
s = s.replace('stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter', f'stroke:{INK};stroke-width:2.6px;stroke-linecap:round;stroke-linejoin:round')
# 3) richer palette
pal = {'#0000ff': '#1c3aa8', '#ffff00': '#ffd033', '#fe0101': '#d9231f', '#1414dc': '#2742c9',
       '#fbfb87': '#ffeb8f', '#fefe91': '#ffeb8f', '#fcfc87': '#ffeb8f', '#a45340': '#a8452f', '#4ebb81': '#3fa66b'}
for k, v in pal.items():
    s = s.replace('fill:' + k, 'fill:' + v).replace('stroke:' + k, 'stroke:' + v)
# 4) shield: ink contour on blue shield + yellow field
s = s.replace('fill:#1c3aa8;fill-opacity:1;stroke:none;display:inline', f'fill:url(#gBlue);fill-opacity:1;stroke:{INK};stroke-width:4px;stroke-linejoin:round;display:inline', 1)
s = s.replace('fill:#ffd033;fill-opacity:1;stroke:none;display:inline', f'fill:url(#gGold);fill-opacity:1;stroke:{INK};stroke-width:2.6px;stroke-linejoin:round;display:inline', 1)
s = s.replace('fill:#d9231f;fill-opacity:1;stroke:#d9231f;stroke-opacity:1;display:inline', f'fill:#d9231f;fill-opacity:1;stroke:{INK};stroke-width:2.2px;stroke-linejoin:round;display:inline', 1)
defs = '''<linearGradient id="gBlue" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a4fc4"/><stop offset="1" stop-color="#152a82"/></linearGradient>
<linearGradient id="gGold" x1="0" y1="0" x2="0.9" y2="1"><stop offset="0" stop-color="#ffe066"/><stop offset="1" stop-color="#f7b81c"/></linearGradient>'''
s = s.replace('</defs>', defs + '</defs>', 1)
# 5) lettering: ink shadow instead of plain black offset, embedded-safe font stack
s = s.replace("font-family:Arial;-inkscape-font-specification:Arial Bold", "font-family:'Liberation Sans',Arial,sans-serif")
s = s.replace('fill:#000000;fill-opacity:1;stroke:none;display:inline;font-family', f'fill:{INK};fill-opacity:1;stroke:{INK};stroke-width:3px;stroke-linejoin:round;display:inline;font-family', 1)
# 6) padding so strokes are not clipped
s = re.sub(r'width="441\.64182"\s+height="635\.77112"', 'width="453.64" height="647.77" viewBox="-6 -6 453.64 647.77"', s, 1)
open(dst, 'w', encoding='utf-8').write(s)
print('bytes', len(s))
