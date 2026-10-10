/* Elafandy digital catalog — app logic (no dependencies) */
(function () {
  'use strict';
  var S = window.SITE || {};
  var D = window.CATALOG || { groups: [], products: [] };
  var P = D.products;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var main = $('#main');
  var PAGE = 36;

  /* ---------- indexes ---------- */
  var CATS = [];                    // [{i, name, group}]
  var catByName = {};
  D.groups.forEach(function (g) {
    g.cats.forEach(function (c) {
      var o = { i: CATS.length, name: c, group: g };
      CATS.push(o); catByName[c] = o;
    });
  });
  var byId = {};
  var countCat = {};
  P.forEach(function (p, i) {
    p._i = i; byId[p.id] = p;
    countCat[p.cat] = (countCat[p.cat] || 0) + 1;
    p._s = norm([p.name, p.id, p.cat, p.en || '', p.model || ''].join(' '));
  });
  function groupCount(g) { return g.cats.reduce(function (a, c) { return a + (countCat[c] || 0); }, 0); }

  function norm(s) { return String(s).toLowerCase().replace(/[״"׳'`’]/g, '').replace(/[-_/\\,.()+]/g, ' ').replace(/\s+/g, ' '); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmt(n) { return '₪' + Number(n).toLocaleString('he-IL', { maximumFractionDigits: 2 }); }
  function nf(n) { return Number(n).toLocaleString('he-IL'); }
  function ic(id, cls) { return '<svg class="ic ' + (cls || '') + '"><use href="#i-' + id + '"/></svg>'; }

  /* ---------- storage (safe) ---------- */
  function sget(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function sset(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} }

  /* ---------- contact ---------- */
  function waLink(text) {
    var n = String(S.whatsapp || '').replace(/\D/g, '');
    return 'https://wa.me/' + n + (text ? '?text=' + encodeURIComponent(text) : '');
  }
  function telLink() { return 'tel:+' + String(S.phone || '').replace(/\D/g, ''); }
  function productMsg(p) { return (p.oos ? 'שלום, רציתי לבדוק מתי יחזור למלאי: ' : 'שלום, אני מעוניין/ת במוצר: ') + (p.en || p.name) + ' (מק״ט: ' + p.id + ')'; }

  /* ---------- prices / login ---------- */
  var AUTH = 'elafandy_auth_v2';
  function logged() { return S.priceMode === 'public' || (S.priceMode === 'login' && sget(AUTH) === 'yes'); }
  function priceHTML(p, big) {
    if (p.oos) return '<span class="oos-tag">אזל מהמלאי</span>';
    if (S.priceMode === 'hidden') return '<span class="price-ask">מחיר בפנייה</span>';
    if (!logged()) return '<button type="button" class="price-lock" data-login>' + ic('lock') + 'מחיר ללקוחות</button>';
    return '<span class="price">' + fmt(p.price) + '<small>' + esc(S.vatNote || '') + '</small></span>';
  }
  function syncAuthUI() {
    var isLogin = S.priceMode === 'login';
    $('#loginBtn').hidden = !isLogin || logged();
    $('#logoutBtn').hidden = !isLogin || !logged();
  }

  /* SHA-256 (small, dependency-free) */
  function sha256(ascii) {
    function rr(v, a) { return (v >>> a) | (v << (32 - a)); }
    var mp = Math.pow, maxWord = mp(2, 32), result = '', words = [], bitLen = ascii.length * 8;
    var hash = [], k = [], primeCounter = 0, isC = {};
    for (var c = 2; primeCounter < 64; c++) {
      if (!isC[c]) {
        for (var i = 0; i < 313; i += c) isC[i] = c;
        hash[primeCounter] = (mp(c, .5) * maxWord) | 0;
        k[primeCounter++] = (mp(c, 1 / 3) * maxWord) | 0;
      }
    }
    hash = hash.slice(0, 8);
    ascii += '\x80';
    while (ascii.length % 64 - 56) ascii += '\x00';
    for (i = 0; i < ascii.length; i++) words[i >> 2] |= ascii.charCodeAt(i) << ((3 - i) % 4) * 8;
    words[words.length] = ((bitLen / maxWord) | 0); words[words.length] = bitLen;
    for (var j = 0; j < words.length;) {
      var w = words.slice(j, j += 16), oldHash = hash;
      hash = hash.slice(0, 8);
      for (i = 0; i < 64; i++) {
        var w15 = w[i - 15], w2 = w[i - 2], a = hash[0], e = hash[4];
        var t1 = hash[7] + (rr(e, 6) ^ rr(e, 11) ^ rr(e, 25)) + ((e & hash[5]) ^ ((~e) & hash[6])) + k[i] +
          (w[i] = (i < 16) ? w[i] : (w[i - 16] + (rr(w15, 7) ^ rr(w15, 18) ^ (w15 >>> 3)) + w[i - 7] + (rr(w2, 17) ^ rr(w2, 19) ^ (w2 >>> 10))) | 0);
        var t2 = (rr(a, 2) ^ rr(a, 13) ^ rr(a, 22)) + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
        hash = [(t1 + t2) | 0].concat(hash); hash[4] = (hash[4] + t1) | 0;
      }
      for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
    }
    for (i = 0; i < 8; i++) for (j = 3; j + 1; j--) { var b = (hash[i] >> (j * 8)) & 255; result += ((b < 16) ? 0 : '') + b.toString(16); }
    return result;
  }
  function utf8(s) { return unescape(encodeURIComponent(s)); }

  /* ---------- images (files, or bundles in the online preview) ---------- */
  var BUNDLE = window.IMG_BUNDLES || null;
  var cache = {}, loading = {};
  window.__IMGB = function (n, map) { for (var k in map) cache[k] = map[k]; if (loading[n]) loading[n].done(); };
  function loadBundle(n) {
    if (loading[n]) return loading[n].p;
    var done, p = new Promise(function (r) { done = r; });
    loading[n] = { p: p, done: done };
    var s = document.createElement('script');
    s.src = 'bundles/' + (n === 'home' ? 'home' : 'b' + n) + '.js';
    s.async = true; s.onerror = done;
    document.head.appendChild(s);
    return p;
  }
  function srcFor(id) {
    if (!BUNDLE) return Promise.resolve('images/' + id + '.webp');
    if (cache[id]) return Promise.resolve(cache[id]);
    return loadBundle('home').then(function () {
      return cache[id] || loadBundle(BUNDLE[id]).then(function () { return cache[id]; });
    });
  }
  function setImg(img) {
    var id = img.getAttribute('data-id');
    srcFor(id).then(function (src) { if (src) img.src = src; });
  }
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); setImg(e.target); } });
  }, { rootMargin: '600px 0px' }) : null;
  function hydrate(root) {
    (root || document).querySelectorAll('img[data-id]:not([data-h])').forEach(function (img) {
      img.setAttribute('data-h', '1');
      img.addEventListener('load', function () { img.classList.add('ok'); });
      img.addEventListener('error', function () { var m = img.closest('.media,.pd-media'); if (m) { m.classList.add('logo-tile'); img.removeAttribute('data-id'); img.src = 'assets/logo.webp'; } });
      if (io) io.observe(img); else setImg(img);
    });
  }
  function mediaHTML(p, cls) {
    if (p.logo || !p.img) {
      return '<div class="' + cls + ' logo-tile"><img class="ok" src="assets/logo.webp" alt="' + esc(S.nameHe) + '" loading="lazy">' +
        (p.logo ? '<span class="badge">תואם</span>' : '') + '</div>';
    }
    return '<div class="' + cls + '"><img data-id="' + esc(p.id) + '" alt="' + esc(p.en || p.name) + '"></div>';
  }

  /* ---------- shared pieces ---------- */
  function cardHTML(p) {
    return '<article class="card' + (p.oos ? ' is-oos' : '') + '">' +
      mediaHTML(p, 'media' + (p.oos ? ' oos' : '')) +
      '<div class="card-body">' +
        '<div class="card-meta"><span class="c">' + esc(p.cat) + '</span><span class="sku">' + esc(p.id) + '</span></div>' +
        '<h3 dir="auto"><a href="#p-' + esc(p.id) + '">' + esc(p.en || p.name) + '</a></h3>' +
        '<div class="card-foot">' + priceHTML(p) +
          '<a class="order" href="' + esc(waLink(productMsg(p))) + '" target="_blank" rel="noopener" aria-label="הזמנה בוואטסאפ: ' + esc(p.en || p.name) + '"><svg><use href="#i-wa"/></svg></a>' +
        '</div>' +
      '</div></article>';
  }
  function crumbs(items) {
    return '<nav class="crumbs" aria-label="מיקום">' + items.map(function (it, i) {
      var sep = i ? ic('chev') : '';
      return sep + (it[1] ? '<a href="' + it[1] + '">' + esc(it[0]) + '</a>' : '<span aria-current="page">' + esc(it[0]) + '</span>');
    }).join('') + '</nav>';
  }

  /* ---------- views ---------- */
  function viewHome() {
    var heroTiles = (D.hero || []).slice(0, 6).map(function (id) {
      var p = byId[id]; return p ? '<a class="tile" href="#p-' + esc(id) + '" aria-label="' + esc(p.name) + '"><img data-id="' + esc(id) + '" alt=""></a>' : '';
    }).join('');
    var depts = D.groups.map(function (g) {
      var imgs = (g.cover || []).slice(0, 4);
      while (imgs.length < 4) imgs.push(null);
      return '<a class="dept" href="#g-' + g.id + '">' +
        '<div class="mosaic">' + imgs.map(function (id) { return '<span>' + (id ? '<img data-id="' + esc(id) + '" alt="">' : '') + '</span>'; }).join('') + '</div>' +
        '<div class="dept-body"><h3>' + esc(g.name) + '</h3>' +
        '<span class="meta">' + nf(groupCount(g)) + ' מוצרים · ' + g.cats.length + ' קטגוריות</span>' +
        '<span class="cats">' + g.cats.map(esc).join(' · ') + '</span></div></a>';
    }).join('');
    var toc = D.groups.map(function (g) {
      return '<div><h3><a href="#g-' + g.id + '">' + esc(g.name) + '</a></h3><ul>' +
        g.cats.map(function (c) { return '<li><a href="#c' + catByName[c].i + '">' + esc(c) + '<b>' + nf(countCat[c] || 0) + '</b></a></li>'; }).join('') +
        '</ul></div>';
    }).join('');

    main.innerHTML =
      '<section class="hero"><div class="hero-in">' +
        '<div>' +
          '<span class="eyebrow"><svg viewBox="0 0 64 32"><use href="#i-crown"/></svg>' + esc(S.nameEn || '') + '</span>' +
          '<h1>' + esc(S.nameHe) + '<span>' + esc(S.tagline) + '</span></h1>' +
          '<p class="lead">' + esc(S.intro) + '</p>' +
          '<div class="hero-cta">' +
            '<a class="btn btn-gold btn-lg" href="#all">' + ic('grid') + 'לכל המוצרים</a>' +
            '<a class="btn btn-ghost btn-lg" href="' + esc(waLink('שלום, אשמח לקבל פרטים')) + '" target="_blank" rel="noopener">' + ic('wa') + 'שאלו אותנו בוואטסאפ</a>' +
          '</div>' +
          '<div class="hero-stats">' +
            '<div><b>' + nf(P.length) + '</b><small>מוצרים בקטלוג</small></div>' +
            '<div><b>' + CATS.length + '</b><small>קטגוריות</small></div>' +
            '<div><b>' + D.groups.length + '</b><small>מחלקות</small></div>' +
          '</div>' +
        '</div>' +
        '<div class="stage" aria-hidden="false"><span class="ring"></span><span class="ring r2"></span>' +
          '<div class="medal"><img src="assets/logo.webp" alt="' + esc(S.nameHe) + '"></div>' + heroTiles + '</div>' +
      '</div></section>' +
      '<section class="section"><div class="wrap">' +
        '<div class="sec-head"><div><span class="kicker">מחלקות</span><h2>מה תרצו למצוא היום?</h2></div>' +
        '<a class="link-more" href="#all">כל ' + nf(P.length) + ' המוצרים' + ic('chev') + '</a></div>' +
        '<div class="dept-grid">' + depts + '</div>' +
      '</div></section>' +
      '<section class="section" style="padding-top:0"><div class="wrap">' +
        '<div class="sec-head"><div><span class="kicker">תוכן העניינים</span><h2>כל הקטגוריות</h2></div></div>' +
        '<div class="toc">' + toc + '</div>' +
      '</div></section>' +
      contactBand();
    hydrate(main);
  }

  function contactBand() {
    return '<section class="band section"><div class="wrap band-in">' +
      '<div><h2>מצאתם מוצר? נשמח לעזור</h2><p>שלחו לנו הודעה עם מק״ט המוצר ונחזור אליכם עם זמינות ומחיר.</p></div>' +
      '<div class="band-actions">' +
        '<a class="btn btn-wa btn-lg" href="' + esc(waLink('שלום, אשמח לקבל פרטים')) + '" target="_blank" rel="noopener">' + ic('wa') + 'וואטסאפ</a>' +
        '<a class="btn btn-gold btn-lg" href="' + telLink() + '">' + ic('phone') + '<span class="num" style="color:inherit">' + esc(S.phoneDisplay || S.phone) + '</span></a>' +
      '</div></div></section>';
  }

  /* listing state */
  var L = { scope: null, cat: null, sort: 'default', shown: PAGE, stockOnly: false };
  var HAS_OOS = P.some(function (p) { return p.oos; });
  var q = '';

  function currentList() {
    var list = P;
    if (L.scope && L.scope.type === 'group') { var cs = L.scope.g.cats; list = list.filter(function (p) { return cs.indexOf(p.cat) > -1; }); }
    if (L.scope && L.scope.type === 'cat') list = list.filter(function (p) { return p.cat === L.scope.c.name; });
    if (L.cat) list = list.filter(function (p) { return p.cat === L.cat; });
    var words = norm(q).trim().split(' ').filter(Boolean);
    if (words.length) list = list.filter(function (p) { return words.every(function (w) { return p._s.indexOf(w) > -1; }); });
    if (L.stockOnly) list = list.filter(function (p) { return !p.oos; });
    if (L.sort !== 'default') {
      list = list.slice();
      if (L.sort === 'pa') list.sort(function (a, b) { return a.price - b.price; });
      if (L.sort === 'pd') list.sort(function (a, b) { return b.price - a.price; });
      if (L.sort === 'nm') list.sort(function (a, b) { return (a.en || a.name).localeCompare(b.en || b.name, 'he'); });
    } else if (!L.scope) {
      var order = {}; CATS.forEach(function (c) { order[c.name] = c.i; });
      list = list.slice().sort(function (a, b) { return (order[a.cat] - order[b.cat]) || (a._i - b._i); });
    }
    // out-of-stock products always come after the products in stock
    return list.filter(function (p) { return !p.oos; }).concat(list.filter(function (p) { return p.oos; }));
  }

  function viewList(scope) {
    L.scope = scope; L.cat = null; L.shown = PAGE;
    var title, sub, cr = [['ראשי', '#home']], chipsFor = null;
    if (!scope) { title = q ? 'תוצאות חיפוש' : 'כל המוצרים'; cr.push([title]); }
    else if (scope.type === 'group') { title = scope.g.name; cr.push([title]); chipsFor = scope.g.cats; }
    else { title = scope.c.name; cr.push([scope.c.group.name, '#g-' + scope.c.group.id], [title]); }

    var side = D.groups.map(function (g) {
      var gOn = scope && scope.type === 'group' && scope.g === g;
      return '<h4>' + esc(g.name) + '</h4>' +
        '<a class="dept-link" href="#g-' + g.id + '" aria-current="' + gOn + '">כל המחלקה<b>' + nf(groupCount(g)) + '</b></a>' +
        g.cats.map(function (c) {
          var on = scope && scope.type === 'cat' && scope.c.name === c;
          return '<a href="#c' + catByName[c].i + '" aria-current="' + on + '">' + esc(c) + '<b>' + nf(countCat[c] || 0) + '</b></a>';
        }).join('');
    }).join('');
    var allOn = !scope;

    main.innerHTML =
      '<div class="wrap page-head">' + crumbs(cr) + '<h1>' + esc(title) + '</h1><div class="sub" id="sub"></div></div>' +
      '<div class="wrap layout">' +
        '<aside class="side" aria-label="קטגוריות"><a class="dept-link" href="#all" aria-current="' + allOn + '">כל המוצרים<b>' + nf(P.length) + '</b></a>' + side + '</aside>' +
        '<div>' +
          '<div class="toolbar">' +
            '<div class="chips" id="chips"></div>' +
            '<label class="sort" for="sortSel">מיון' +
              '<select id="sortSel"><option value="default">לפי קטגוריה</option>' +
              (logged() && S.priceMode !== 'hidden' ? '<option value="pa">מחיר: מהנמוך לגבוה</option><option value="pd">מחיר: מהגבוה לנמוך</option>' : '') +
              '<option value="nm">לפי שם</option></select></label>' +
            (HAS_OOS ? '<label class="stock-only" for="stockOnly"><input type="checkbox" id="stockOnly"' + (L.stockOnly ? ' checked' : '') + '>רק מוצרים במלאי</label>' : '') +
          '</div>' +
          '<div id="notice"></div>' +
          '<div class="grid" id="grid"></div>' +
          '<div class="more" id="more"></div>' +
        '</div>' +
      '</div>' + contactBand();

    // category chips: inside a department -> its categories; elsewhere -> departments
    var chips = $('#chips');
    if (chipsFor) {
      chips.innerHTML = '<button type="button" class="chip" data-chip="" aria-pressed="true">הכל<b>' + nf(groupCount(scope.g)) + '</b></button>' +
        chipsFor.map(function (c) { return '<button type="button" class="chip" data-chip="' + esc(c) + '" aria-pressed="false">' + esc(c) + '<b>' + nf(countCat[c] || 0) + '</b></button>'; }).join('');
      chips.addEventListener('click', function (e) {
        var b = e.target.closest('[data-chip]'); if (!b) return;
        L.cat = b.getAttribute('data-chip') || null; L.shown = PAGE;
        chips.querySelectorAll('.chip').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        renderGrid();
      });
    } else {
      var here = scope && scope.type === 'cat' ? scope.c.group : null;
      chips.innerHTML = '<a class="chip" href="#all" aria-pressed="' + allOn + '">כל המוצרים</a>' +
        D.groups.map(function (g) { return '<a class="chip" href="#g-' + g.id + '" aria-pressed="' + (g === here) + '">' + esc(g.name) + '</a>'; }).join('');
    }
    $('#sortSel').value = L.sort;
    if ($('#stockOnly')) $('#stockOnly').addEventListener('change', function () { L.stockOnly = this.checked; L.shown = PAGE; renderGrid(); });
    $('#sortSel').addEventListener('change', function () { L.sort = this.value; L.shown = PAGE; renderGrid(); });
    renderGrid();
  }

  function renderGrid() {
    var list = currentList();
    var grid = $('#grid'), more = $('#more'), sub = $('#sub'), note = $('#notice');
    if (!grid) return;
    sub.textContent = nf(list.length) + ' מוצרים';
    note.innerHTML = q ? '<div class="notice">' + ic('search') + '<span>מחפש: <b dir="auto">' + esc(q) + '</b></span>' +
      (L.scope ? '<button type="button" data-searchall>חיפוש בכל הקטלוג</button>' : '') +
      '<button type="button" data-clearq>ניקוי חיפוש</button></div>' : '';
    if (!list.length) {
      grid.innerHTML = '<div class="empty"><h3>לא נמצאו מוצרים</h3><p>נסו מילה אחרת, מק״ט, או שלחו לנו הודעה ונבדוק עבורכם.</p>' +
        '<a class="btn btn-wa" href="' + esc(waLink('שלום, אני מחפש/ת: ' + q)) + '" target="_blank" rel="noopener">' + ic('wa') + 'שאלו אותנו</a></div>';
      more.innerHTML = ''; return;
    }
    grid.innerHTML = list.slice(0, L.shown).map(cardHTML).join('');
    hydrate(grid);
    if (list.length > L.shown) {
      more.innerHTML = '<button type="button" class="btn btn-line btn-lg" id="moreBtn">הצגת מוצרים נוספים (' + nf(list.length - L.shown) + ')</button>';
      var btn = $('#moreBtn');
      btn.addEventListener('click', function () { L.shown += PAGE * 2; renderGrid(); });
      if (io && 'IntersectionObserver' in window) {
        var auto = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { auto.disconnect(); L.shown += PAGE; appendMore(list); } }, { rootMargin: '800px 0px' });
        auto.observe(btn);
      }
    } else more.innerHTML = '';
  }
  function appendMore(list) {
    var grid = $('#grid'); if (!grid) return;
    var have = grid.children.length;
    grid.insertAdjacentHTML('beforeend', list.slice(have, L.shown).map(cardHTML).join(''));
    hydrate(grid);
    var more = $('#more');
    if (list.length > L.shown) {
      more.innerHTML = '<button type="button" class="btn btn-line btn-lg" id="moreBtn">הצגת מוצרים נוספים (' + nf(list.length - L.shown) + ')</button>';
      var btn = $('#moreBtn');
      btn.addEventListener('click', function () { L.shown += PAGE * 2; appendMore(list); });
      var auto = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { auto.disconnect(); L.shown += PAGE; appendMore(list); } }, { rootMargin: '800px 0px' });
      auto.observe(btn);
    } else more.innerHTML = '';
  }

  function viewProduct(p) {
    var c = catByName[p.cat], g = c ? c.group : null;
    var cr = [['ראשי', '#home']];
    if (g) cr.push([g.name, '#g-' + g.id]);
    if (c) cr.push([c.name, '#c' + c.i]);
    var facts = '<dt>מק״ט</dt><dd>' + esc(p.id) + '</dd>' +
      (p.model ? '<dt>Model Number</dt><dd>' + esc(p.model) + '</dd>' : '') +
      '<dt>קטגוריה</dt><dd style="font-family:var(--f-body);direction:rtl;text-align:start">' + esc(p.cat) + '</dd>';
    var priceBlock = p.oos ? '<div class="pd-price"><span class="oos-tag big">אזל מהמלאי</span><span style="color:var(--muted);font-size:14px">שלחו לנו הודעה ונעדכן כשיחזור למלאי.</span></div>' : S.priceMode === 'hidden' ? '' :
      '<div class="pd-price">' + (logged() ? '<span class="price">' + fmt(p.price) + '<small>' + esc(S.vatNote || '') + '</small></span>'
        : '<button type="button" class="btn btn-line" data-login>' + ic('lock') + 'כניסה לצפייה במחיר</button>') + '</div>';
    var spec = '';
    if (p.desc) spec += '<section class="spec"><h2>תיאור</h2><p class="en" dir="ltr">' + esc(p.desc) + '</p></section>';
    if (p.specs && p.specs.length) spec += '<section class="spec"><h2>מפרט טכני</h2><div style="overflow-x:auto"><table>' +
      p.specs.map(function (r) { return '<tr><th>' + esc(r[0]) + '</th><td>' + esc(r[1]) + '</td></tr>'; }).join('') + '</table></div></section>';
    if (!spec) spec = '<div class="spec-note">לפרטים נוספים ומפרט מלא על המוצר — פנו אלינו בוואטסאפ או בטלפון וציינו את המק״ט <b class="sku" style="font-size:13px">' + esc(p.id) + '</b>.</div>';

    var related = P.filter(function (x) { return x.cat === p.cat && x !== p && !x.oos; }).slice(0, 8);

    main.innerHTML =
      '<div class="wrap page-head">' + crumbs(cr) + '</div>' +
      '<div class="wrap pd">' +
        mediaHTML(p, 'pd-media' + (p.oos ? ' oos' : '')) +
        '<div class="pd-info">' +
          '<span class="pd-cat">' + esc(p.cat) + '</span>' +
          '<h1 dir="auto">' + esc(p.en || p.name) + '</h1>' +
          (p.en ? '<p dir="auto" style="margin:-6px 0 16px;color:var(--muted)">' + esc(p.name) + '</p>' : '') +
          '<dl class="facts">' + facts + '</dl>' +
          priceBlock +
          '<div class="pd-actions">' +
            '<a class="btn btn-wa btn-lg" href="' + esc(waLink(productMsg(p))) + '" target="_blank" rel="noopener">' + ic('wa') + (p.oos ? 'בדיקת זמינות בוואטסאפ' : 'הזמנה בוואטסאפ') + '</a>' +
            '<a class="btn btn-wine btn-lg" href="' + telLink() + '">' + ic('phone') + 'התקשרו</a>' +
            '<button type="button" class="btn btn-line btn-lg" data-copy>' + ic('link') + 'העתקת קישור</button>' +
          '</div>' +
          '<p class="pd-contact">טלפון: <span class="num">' + esc(S.phoneDisplay || S.phone) + '</span></p>' +
          spec +
        '</div>' +
      '</div>' +
      (related.length ? '<section class="wrap related"><div class="sec-head"><div><span class="kicker">מאותה קטגוריה</span><h2>מוצרים נוספים</h2></div>' +
        (c ? '<a class="link-more" href="#c' + c.i + '">לכל ' + esc(c.name) + ic('chev') + '</a>' : '') + '</div>' +
        '<div class="grid">' + related.map(cardHTML).join('') + '</div></section>' : '');
    hydrate(main);
    document.title = (p.en || p.name) + ' · ' + S.nameHe;
  }

  function viewMissing() {
    main.innerHTML = '<div class="wrap section"><div class="empty"><h3>המוצר לא נמצא</h3><p>ייתכן שהמוצר הוסר מהקטלוג.</p><a class="btn btn-wine" href="#all">לכל המוצרים</a></div></div>';
  }

  /* ---------- router ---------- */
  function route() {
    var h = decodeURIComponent((location.hash || '').slice(1));
    var activeG = null, m;
    document.title = 'קטלוג ' + S.nameHe;
    if (!h || h === 'home' || h === 'top') { viewHome(); }
    else if (h === 'all') { viewList(null); }
    else if ((m = h.match(/^g-(.+)$/))) {
      var g = D.groups.filter(function (x) { return x.id === m[1]; })[0];
      if (g) { activeG = g; viewList({ type: 'group', g: g }); document.title = g.name + ' · ' + S.nameHe; } else viewHome();
    }
    else if ((m = h.match(/^c(\d+)$/))) {
      var c = CATS[+m[1]];
      if (c) { activeG = c.group; viewList({ type: 'cat', c: c }); document.title = c.name + ' · ' + S.nameHe; } else viewHome();
    }
    else if ((m = h.match(/^p-(.+)$/))) {
      var p = byId[m[1]];
      if (p) { activeG = (catByName[p.cat] || {}).group; viewProduct(p); } else viewMissing();
    }
    else if (h === 'main') { return; }
    else { viewHome(); }
    document.querySelectorAll('#deptNav a').forEach(function (a) { a.setAttribute('aria-current', String(activeG && a.getAttribute('href') === '#g-' + activeG.id)); });
    window.scrollTo(0, 0);
  }

  /* ---------- chrome ---------- */
  function initChrome() {
    document.querySelectorAll('[data-site]').forEach(function (el) { el.textContent = S[el.getAttribute('data-site')] || ''; });
    $('#year').textContent = new Date().getFullYear();
    if (D.priceDate) $('#priceDate').textContent = 'מחירון מעודכן ל־' + D.priceDate + '.';
    document.querySelectorAll('[data-wa]').forEach(function (a) { a.href = waLink('שלום, אשמח לקבל פרטים'); });
    document.querySelectorAll('[data-call]').forEach(function (a) { a.href = telLink(); });
    $('#deptNav').innerHTML = '<div class="depts-in"><a href="#all">כל המוצרים</a>' +
      D.groups.map(function (g) { return '<a href="#g-' + g.id + '">' + esc(g.name) + '</a>'; }).join('') + '</div>';
    var fc = '<a href="' + esc(waLink('שלום, אשמח לקבל פרטים')) + '" target="_blank" rel="noopener">' + ic('wa') + 'וואטסאפ</a>' +
      '<a href="' + telLink() + '">' + ic('phone') + '<span class="num">' + esc(S.phoneDisplay || S.phone) + '</span></a>';
    if (S.email) fc += '<a href="mailto:' + esc(S.email) + '"><span class="num">' + esc(S.email) + '</span></a>';
    if (S.address) fc += '<span>' + esc(S.address) + '</span>';
    if (S.hours) fc += '<span>' + esc(S.hours) + '</span>';
    $('#footContact').innerHTML = fc;
    var mh = $('.masthead');
    function setMh() { document.documentElement.style.setProperty('--mast-h', mh.offsetHeight + 'px'); }
    setMh(); window.addEventListener('resize', setMh);
    syncAuthUI();
  }

  /* search */
  var qInput = $('#q'), qClear = $('#qClear'), qTimer;
  function onSearch() {
    q = qInput.value.trim();
    qClear.hidden = !q;
    var h = location.hash.slice(1);
    if (/^(all|g-|c\d)/.test(h)) { L.shown = PAGE; renderGrid(); }
    else if (q) { location.hash = 'all'; }
  }
  qInput.addEventListener('input', function () { clearTimeout(qTimer); qTimer = setTimeout(onSearch, 160); });
  $('#searchForm').addEventListener('submit', function (e) { e.preventDefault(); onSearch(); qInput.blur(); if (q && !/^(all|g-|c\d)/.test(location.hash.slice(1))) location.hash = 'all'; });
  qClear.addEventListener('click', function () { qInput.value = ''; onSearch(); qInput.focus(); });

  /* global clicks */
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t.closest('[data-login]')) { e.preventDefault(); openLogin(); return; }
    if (t.closest('[data-clearq]')) { qInput.value = ''; onSearch(); return; }
    if (t.closest('[data-searchall]')) { location.hash = 'all'; return; }
    if (t.closest('[data-copy]')) {
      var url = location.href;
      var done = function () { toast('הקישור הועתק'); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, function () { fallbackCopy(url); });
      else fallbackCopy(url);
      return;
    }
    if (t.closest('[data-close]') || t.id === 'loginModal') closeLogin();
  });
  function fallbackCopy(s) {
    var ta = document.createElement('textarea'); ta.value = s; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); toast('הקישור הועתק'); } catch (e) { toast(s); }
    ta.remove();
  }
  var tt;
  function toast(msg) { var el = $('#toast'); el.textContent = msg; el.hidden = false; clearTimeout(tt); tt = setTimeout(function () { el.hidden = true; }, 2200); }

  /* login */
  function openLogin() { $('#loginModal').hidden = false; $('#lgMsg').textContent = ''; setTimeout(function () { $('#lgUser').focus(); }, 30); }
  function closeLogin() { $('#loginModal').hidden = true; }
  $('#loginBtn').addEventListener('click', openLogin);
  $('#logoutBtn').addEventListener('click', function () { sset(AUTH, null); syncAuthUI(); route(); toast('התנתקת'); });
  $('#loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var h = sha256(utf8($('#lgUser').value.trim() + ':' + $('#lgPass').value));
    var msg = $('#lgMsg');
    if ((S.users || []).indexOf(h) > -1) {
      sset(AUTH, 'yes'); msg.textContent = 'התחברת בהצלחה'; msg.classList.add('ok');
      setTimeout(function () { closeLogin(); syncAuthUI(); var y = window.scrollY; route(); window.scrollTo(0, y); }, 500);
    } else { msg.classList.remove('ok'); msg.textContent = 'שם משתמש או סיסמה שגויים'; }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLogin(); });

  /* boot */
  initChrome();
  if (BUNDLE) loadBundle('home');
  window.addEventListener('hashchange', route);
  route();
})();
