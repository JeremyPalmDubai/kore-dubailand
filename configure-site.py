from pathlib import Path
import json,sys,re
from urllib.parse import urlparse
root=Path(__file__).resolve().parent
origin=sys.argv[1].rstrip('/')
tally=sys.argv[2] if len(sys.argv)>2 else ''
assert urlparse(origin).scheme in ('http','https')
if tally: assert re.fullmatch(r'https://tally.so/(r|embed)/[A-Za-z0-9]+/?',tally),'Tally URL required'
routes=json.loads((root/'routes.json').read_text())
families=[routes]
if (root/'post-routes.json').exists(): families.append(json.loads((root/'post-routes.json').read_text()))
for family in families:
 for lang,route in family.items():
  p=root/'dist'/route.strip('/')/'index.html';s=p.read_text();s=re.sub(r'<!--SEO-->.*?<!--/SEO-->','',s,flags=re.S)
  s=re.sub(r'<meta property="og:(?:url|image)"[^>]*>', '', s)
  image='terrace.webp' if 'id="schedule"' in s else 'hero.webp'
  tags=f'<link rel="canonical" href="{origin}{route}"><meta property="og:url" content="{origin}{route}"><meta property="og:image" content="{origin}/assets/{image}">'
  tags+=''.join(f'<link rel="alternate" hreflang="{k}" href="{origin}{v}">' for k,v in family.items())
  tags+=f'<link rel="alternate" hreflang="x-default" href="{origin}{family["en"]}">'
  s=s.replace('</head>','<!--SEO-->'+tags+'<!--/SEO--></head>');p.write_text(s)
(root/'dist/index.html').write_text((root/'dist'/routes['en'].strip('/')/'index.html').read_text().replace('<head>',f'<head><meta http-equiv="refresh" content="0;url={routes["en"]}">'))
(root/'dist/sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join(f'<url><loc>{origin}{v}</loc></url>' for family in families for v in family.values())+'</urlset>')
(root/'dist/robots.txt').write_text(f'User-agent: *\nAllow: /\nSitemap: {origin}/sitemap.xml\n')
(root/'dist/assets/config.js').write_text('window.KORE_CONFIG = '+json.dumps({'tallyUrl':tally,'publicOrigin':origin})+';')
print('Configured all page families, canonical links, hreflang and sitemap.')
