#!/usr/bin/env bash
# Refreshes ./catalog from the live website, so the app is built on exactly what the website shows:
# its pages and scripts, products and prices, customer accounts and product photos.
# Anything that can't be downloaded keeps the copy already in ./catalog.
set -u
B=${1:-https://www.elafandy-tech.com}
cd "$(dirname "$0")/../catalog"
get() { curl -sfL --retry 2 --max-time 60 "$B/$1" -o "$1.tmp" && [ -s "$1.tmp" ] && mv "$1.tmp" "$1" || { rm -f "$1.tmp"; return 1; }; }
get index.html || { echo "website not reachable - keeping the catalog in the repository"; exit 0; }
# every local script, stylesheet and image the page links to
files=$(grep -oE '(src|href)="[^"#:]+"' index.html | cut -d'"' -f2 | grep -vE '^(https?:)?//' | sort -u)
for f in $files data/products.js data/users.js assets/config.js assets/logo.webp assets/logo.png; do
  mkdir -p "$(dirname "$f")"; get "$f" || echo "kept local copy of $f"
done
grep -q '^window.CATALOG=' data/products.js || { echo "products file looks wrong"; exit 1; }
mkdir -p images
grep -o '"id":"[^"]*"' data/products.js | cut -d'"' -f4 | sort -u |
  xargs -P 16 -I{} sh -c 'curl -sf --retry 2 --max-time 60 "$0/images/{}.webp" -o "images/{}.webp.tmp" && mv "images/{}.webp.tmp" "images/{}.webp" || rm -f "images/{}.webp.tmp"' "$B"
echo "catalog: $(grep -o '"priceDate":"[^"]*"' data/products.js | head -1), $(grep -o '"id":"' data/products.js | wc -l) products, $(ls images | wc -l) images"
