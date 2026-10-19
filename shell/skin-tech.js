/* Elafandy "Tech" skin: black/red/gold/white app look, a home screen built on the 9 departments,
   and a bottom tab bar. Loaded after assets/app.js. In the website it only turns on
   when the catalog is opened as an installed app (home-screen icon). */
(function () {
  var standalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  var inApp = document.documentElement.classList.contains('in-app');
  if (!inApp && !standalone && !/[?&]skin=tech/.test(location.search)) return;

  var root = document.documentElement;
  root.classList.add('skin-tech', 'has-tabbar');
  /* the website has its own looks (data-skin); inside the app the black/red/gold look wins */
  root.removeAttribute('data-skin');
  if (window.MutationObserver) new MutationObserver(function () { if (root.hasAttribute('data-skin')) root.removeAttribute('data-skin'); })
    .observe(root, { attributes: true, attributeFilter: ['data-skin'] });
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', '#0D0D0F');

  var D = window.CATALOG, S = window.SITE || {};
  /* app texts in the website's three languages (the website's own selector picks the language) */
  var I18N = window.I18N || null, LANG = (I18N && I18N.lang) || 'he';
  var TX = {
    he: { h1: 'מה תרצו <em>למצוא</em> היום?', products: 'מוצרים', depts: 'מחלקות', priceUpd: 'עדכון מחירים', catalog: 'קטלוג', allProducts: 'לכל המוצרים',
          all: 'הכל ›', featured: 'מוצרים נבחרים', help: 'צריכים עזרה בבחירה?', helpP: 'דברו איתנו ונמצא לכם את המוצר המתאים.',
          wa: 'וואטסאפ', call: 'התקשרו', home: 'בית', search: 'חיפוש', cart: 'סל', login: 'כניסה', logout: 'יציאה', nav: 'ניווט ראשי' },
    ar: { h1: 'عمّ <em>تبحث</em> اليوم؟', products: 'منتجات', depts: 'أقسام', priceUpd: 'تحديث الأسعار', catalog: 'كتالوج', allProducts: 'كل المنتجات',
          all: 'الكل ›', featured: 'منتجات مختارة', help: 'تحتاج مساعدة في الاختيار؟', helpP: 'تواصل معنا ونجد لك المنتج المناسب.',
          wa: 'واتساب', call: 'اتصل', home: 'الرئيسية', search: 'بحث', cart: 'السلة', login: 'دخول', logout: 'خروج', nav: 'التنقل الرئيسي' },
    en: { h1: 'What are you <em>looking</em> for today?', products: 'products', depts: 'Departments', priceUpd: 'Price update', catalog: 'catalog', allProducts: 'All products',
          all: 'All ›', featured: 'Featured products', help: 'Need help choosing?', helpP: "Talk to us and we'll find the right product for you.",
          wa: 'WhatsApp', call: 'Call', home: 'Home', search: 'Search', cart: 'Cart', login: 'Log in', logout: 'Log out', nav: 'Main navigation' }
  };
  function tx(k) { return (TX[LANG] || TX.he)[k] || TX.he[k]; }
  function gName(g) { return I18N && I18N.tg ? I18N.tg(g) : g.name; }
  function pName(p) { return LANG === 'ar' ? (p.na || p.name) : LANG === 'en' ? (p.ne || p.en || p.name) : p.name; }
  var NUM = LANG === 'he' ? 'he-IL' : LANG === 'ar' ? 'en-US' : 'en-US';
  var main = document.getElementById('main');
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function nf(n) { return Number(n).toLocaleString(NUM); }
  var digits = function (s) { return String(s || '').replace(/\D/g, ''); };
  var waHref = 'https://wa.me/' + digits(S.whatsapp) + '?text=' + encodeURIComponent('שלום, אשמח לקבל פרטים');
  var telHref = 'tel:+' + digits(S.phone);

  var I = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>'; };
  var ICONS = {
    computers: I('<rect x="4" y="5" width="16" height="10" rx="1.5"/><path d="M2 19h20M9 19l.6-2h4.8l.6 2"/>'),
    displays: I('<rect x="2.5" y="4" width="19" height="12.5" rx="1.5"/><path d="M8 20.5h8M12 16.5v4"/><path d="M6 8h5" opacity=".6"/>'),
    components: I('<rect x="7" y="7" width="10" height="10" rx="1.5"/><rect x="10" y="10" width="4" height="4" rx=".5"/><path d="M9.5 3v4M14.5 3v4M9.5 17v4M14.5 17v4M3 9.5h4M3 14.5h4M17 9.5h4M17 14.5h4"/>'),
    storage: I('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="12" cy="11" r="4"/><circle cx="12" cy="11" r="1"/><path d="M7 17.5h3"/>'),
    peripherals: I('<rect x="7" y="2.5" width="10" height="19" rx="5"/><path d="M12 2.5v6M7 9.5h10"/>'),
    printing: I('<path d="M7 8V3.5h10V8"/><rect x="3" y="8" width="18" height="9" rx="1.5"/><path d="M7 14h10v6.5H7z"/><circle cx="17.5" cy="11" r=".6" fill="currentColor"/>'),
    network: I('<path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.6 16a5 5 0 0 1 6.8 0"/><circle cx="12" cy="19.2" r="1.2" fill="currentColor"/>'),
    power: I('<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z"/>'),
    office: I('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2M3 12.5h18"/>'),
    other: I('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>')
  };

  var countCat = {};
  (D.products || []).forEach(function (p) { countCat[p.cat] = (countCat[p.cat] || 0) + 1; });
  function groupCount(g) { return g.cats.reduce(function (a, c) { return a + (countCat[c] || 0); }, 0); }

  function homeHTML() {
    var tiles = D.groups.map(function (g) {
      return '<a class="th-tile" href="#g-' + esc(g.id) + '"><span class="th-ico">' + (ICONS[g.id] || ICONS.other) + '</span>' +
        '<strong>' + esc(gName(g)) + '</strong><small>' + nf(groupCount(g)) + ' ' + tx('products') + '</small></a>';
    }).join('');
    var feat = (D.hero || []).concat(D.groups.map(function (g) { return (g.cover || [])[0]; })).filter(Boolean);
    var byId = {}; D.products.forEach(function (p) { byId[p.id] = p; });
    var seen = {};
    var strip = feat.filter(function (id) { if (seen[id] || !byId[id]) return false; seen[id] = 1; return true; }).slice(0, 12).map(function (id) {
      var p = byId[id];
      return '<a class="th-prod" href="#p-' + esc(id) + '"><div class="im"><img loading="lazy" src="' + esc((window.IMG_BASE || '') + 'images/' + id + '.webp' + (window.IMG_BASE ? window.IMG_V || '' : '')) + '" alt="" onerror="this.onerror=null;this.src=\'assets/logo.webp\'"></div><span>' + esc(p.en || p.name) + '</span></a>';
    }).join('');
    return '<div class="th">' +
      '<section class="th-hero"><span class="th-tag"><i></i>Elafandy · Tech store</span>' +
        '<h1>' + tx('h1') + '</h1><p>' + esc((I18N && I18N.site ? I18N.site('intro') : S.intro) || '') + '</p>' +
        '<div class="th-stats"><span><b>' + nf(D.products.length) + '</b>' + tx('products') + '</span><span><b>' + D.groups.length + '</b>' + tx('depts') + '</span>' +
        (D.priceDate ? '<span><b>' + esc(D.priceDate) + '</b>' + tx('priceUpd') + '</span>' : '<span><b>24/7</b>' + tx('catalog') + '</span>') + '</div>' +
        '<a class="th-cta" href="#all">' + tx('allProducts') + I('<path d="m15 18-6-6 6-6"/>') + '</a></section>' +
      '<div class="th-head"><h2>' + tx('depts') + '</h2><a href="#all">' + tx('all') + '</a></div>' +
      '<nav class="th-grid" aria-label="' + esc(tx('depts')) + '">' + tiles + '</nav>' +
      (strip ? '<div class="th-head"><h2>' + tx('featured') + '</h2></div><div class="th-strip">' + strip + '</div>' : '') +
      '<div class="th-contact"><h3>' + tx('help') + '</h3><p>' + tx('helpP') + '</p><div class="row">' +
        '<a class="wa" href="' + esc(waHref) + '" target="_blank" rel="noopener"><svg><use href="#i-wa"/></svg>' + tx('wa') + '</a>' +
        '<a class="call" href="' + esc(telHref) + '"><svg><use href="#i-phone"/></svg>' + tx('call') + '</a></div></div>' +
    '</div>';
  }

  /* bottom tab bar */
  var bar = document.createElement('nav');
  bar.className = 'tabbar'; bar.setAttribute('aria-label', tx('nav'));
  var cartBtn = document.getElementById('cartBtn');
  bar.innerHTML =
    '<a href="#home" data-tab="home">' + I('<path d="M3 11 12 3.5 21 11"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5.5h4V20"/>') + tx('home') + '</a>' +
    '<a href="#all" data-tab="all">' + ICONS.other + tx('products') + '</a>' +
    '<button type="button" data-tab="search">' + I('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>') + tx('search') + '</button>' +
    (cartBtn
      ? '<button type="button" data-tab="cart">' + I('<path d="M3 4h2.5l2.2 11h10.6L20.5 7H6.6"/><circle cx="9.5" cy="19.5" r="1.4"/><circle cx="17" cy="19.5" r="1.4"/>') + tx('cart') + '<b class="tb-badge" hidden></b></button>'
      : '<a class="tb-wa" href="' + esc(waHref) + '" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><use href="#i-wa"/></svg>' + tx('wa') + '</a>') +
    (S.priceMode === 'login'
      ? '<button type="button" data-tab="login">' + I('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>') + '<span>' + tx('login') + '</span></button>'
      : '<a href="' + esc(telHref) + '">' + I('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>') + tx('call') + '</a>');
  document.body.appendChild(bar);

  var loginBtn = document.getElementById('loginBtn'), logoutBtn = document.getElementById('logoutBtn');
  function syncLogin() {
    var b = bar.querySelector('[data-tab="login"] span');
    if (b && logoutBtn) b.textContent = logoutBtn.hidden ? tx('login') : tx('logout');
  }
  bar.addEventListener('click', function (e) {
    var t = e.target.closest('[data-tab]'); if (!t) return;
    var tab = t.getAttribute('data-tab');
    if (tab === 'search') {
      var h = location.hash.slice(1);
      if (h && h !== 'home' && !/^(all|g-|c\d)/.test(h)) location.hash = 'all';
      window.scrollTo(0, 0);
      setTimeout(function () { var q = document.getElementById('q'); if (q) q.focus(); }, 60);
    } else if (tab === 'cart') {
      cartBtn.click();
    } else if (tab === 'login') {
      (logoutBtn && !logoutBtn.hidden ? logoutBtn : loginBtn).click();
      setTimeout(syncLogin, 50);
    }
  });
  if (logoutBtn && window.MutationObserver) new MutationObserver(syncLogin).observe(logoutBtn, { attributes: true, attributeFilter: ['hidden'] });
  syncLogin();
  /* cart badge mirrors the website's cart counter */
  var cartCount = document.getElementById('cartCount'), badge = bar.querySelector('.tb-badge');
  function syncCart() { if (badge && cartCount) { badge.hidden = cartCount.hidden || !+cartCount.textContent; badge.textContent = cartCount.textContent; } }
  if (cartCount && window.MutationObserver) new MutationObserver(syncCart).observe(cartCount, { attributes: true, childList: true, characterData: true, subtree: true });
  syncCart();

  function isHome() { var h = decodeURIComponent((location.hash || '').slice(1)); return !h || h === 'home' || h === 'top'; }
  function onRoute() {
    var h = decodeURIComponent((location.hash || '').slice(1));
    var home = isHome();
    root.classList.toggle('on-home', home);
    if (home) main.innerHTML = homeHTML();
    var tab = home ? 'home' : (h === 'all' ? 'all' : '');
    bar.querySelectorAll('[data-tab]').forEach(function (a) { a.setAttribute('aria-current', String(a.getAttribute('data-tab') === tab)); });
  }
  window.addEventListener('hashchange', onRoute);
  /* the catalog re-renders the page after login/logout without a hash change */
  if (window.MutationObserver) new MutationObserver(function () {
    if (isHome() && !main.querySelector('.th')) main.innerHTML = homeHTML();
  }).observe(main, { childList: true });
  onRoute();
})();
