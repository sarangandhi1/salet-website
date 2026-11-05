# Tell Bing (and the IndexNow engines) about every page in a site's sitemap.
# Run after each deploy:  python3 scripts/indexnow.py salet.uk e96fa8accd201963781653e2b2dbff07
#                         python3 scripts/indexnow.py pro.salet.uk e96fa8accd201963781653e2b2dbff07
import json, re, sys, urllib.request
host, key = sys.argv[1], sys.argv[2]
def get(u): return urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': 'salet-indexnow'}), timeout=30).read().decode()
idx = get(f'https://{host}/sitemap-index.xml')
urls = []
for sm in re.findall(r'<loc>([^<]+)</loc>', idx):
    urls += re.findall(r'<loc>([^<]+)</loc>', get(sm))
print(host, len(urls), 'urls')
for i in range(0, len(urls), 10000):
    body = json.dumps({'host': host, 'key': key, 'keyLocation': f'https://{host}/{key}.txt', 'urlList': urls[i:i+10000]}).encode()
    req = urllib.request.Request('https://www.bing.com/indexnow', data=body, headers={'Content-Type': 'application/json; charset=utf-8'})
    try:
        r = urllib.request.urlopen(req, timeout=60); print('batch', i, r.status)
    except urllib.error.HTTPError as e:
        print('batch', i, e.code, e.read()[:200])
