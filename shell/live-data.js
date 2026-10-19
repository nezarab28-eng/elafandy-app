/* Live catalog: keeps the app's products, prices and settings in step with the website.
   1. Before the catalog starts, use the newest copy saved from the website (if any).
   2. After start-up, load the website's current data/products.js and assets/config.js.
      If they changed, save them and, while the customer is still on the home screen,
      reload once so the new prices show straight away. Otherwise they apply next launch.
   Works offline: without internet the last saved copy (or the built-in one) is used. */
(function () {
  var BASE = ((window.APP && window.APP.webUrl) || '').replace(/\/+$/, '');
  if (!BASE) return;
  var K_CAT = 'live:catalog', K_SITE = 'live:site';
  function get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function put(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  function valid(c) { return c && c.groups && c.groups.length && c.products && c.products.length; }

  var savedCat = get(K_CAT), savedSite = get(K_SITE);
  if (valid(savedCat) && String(savedCat.generated || '') >= String((window.CATALOG || {}).generated || '')) window.CATALOG = savedCat;
  /* Customer logins: accept the accounts built into the app as well as the website's,
     so an account keeps working even if the published site has an older list. */
  var builtInUsers = ((window.SITE || {}).users || []).slice();
  if (savedSite && savedSite.nameHe) {
    window.SITE = JSON.parse(JSON.stringify(savedSite));
    window.SITE.users = builtInUsers.concat((savedSite.users || []).filter(function (u) { return builtInUsers.indexOf(u) < 0; }));
  }
  var inUse = { cat: JSON.stringify(window.CATALOG), site: JSON.stringify(savedSite && savedSite.nameHe ? savedSite : null) };

  /* Product images: when online, take them from the website so a changed photo shows
     without a new app version. If the website copy fails, fall back to the built-in one
     (and the catalog itself falls back to the logo). */
  if (navigator.onLine !== false) window.IMG_BASE = BASE + '/';
  document.addEventListener('error', function (e) {
    var img = e.target;
    if (!img || img.tagName !== 'IMG' || img.dataset.local) return;
    var src = img.getAttribute('src') || '';
    if (src.indexOf(BASE + '/images/') !== 0) return;
    e.stopPropagation();
    img.dataset.local = '1';
    img.src = src.slice(BASE.length + 1).replace(/\?.*$/, '');
  }, true);

  /* Run a website script without disturbing the running catalog, and hand back what it set.
     Inside the Android/iPhone app, if the script tag can't load, read the file through the
     phone's own network layer instead (Capacitor's built-in HTTP plugin) and run it inline. */
  function run(path, inject, done) {
    var keep = { c: window.CATALOG, s: window.SITE };
    var s = document.createElement('script');
    var finish = function (ok) {
      var got = ok ? { c: window.CATALOG, s: window.SITE } : null;
      window.CATALOG = keep.c; window.SITE = keep.s; s.remove();
      done(got);
    };
    if (inject.text != null) { s.textContent = inject.text; document.head.appendChild(s); finish(true); return; }
    s.src = BASE + '/' + path + '?t=' + Date.now();
    s.onload = function () { finish(true); };
    s.onerror = function () { finish(false); };
    document.head.appendChild(s);
  }
  function nativeGet(path, cb) {
    var H = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.CapacitorHttp;
    if (!H || !H.request) return cb(null);
    H.request({ url: BASE + '/' + path + '?t=' + Date.now(), method: 'GET', responseType: 'text' })
      .then(function (r) { cb(r && r.status === 200 && typeof r.data === 'string' ? r.data : null); }, function () { cb(null); });
  }
  function grab(path, done) {
    run(path, {}, function (got) {
      if (got) return done(got);
      nativeGet(path, function (text) { text ? run(path, { text: text }, done) : done(null); });
    });
  }

  /* Apply new data: reload while the customer is on the home screen (at most once a minute),
     otherwise as soon as they next go back to the home screen. */
  var pending = false;
  function atHome() { var h = (location.hash || '').slice(1); return !h || h === 'home' || h === 'top'; }
  function apply() {
    var modal = document.getElementById('loginModal');
    if (!pending || !atHome() || (modal && !modal.hidden)) return;
    var last = 0; try { last = +sessionStorage.getItem('live:reloadedAt') || 0; } catch (e) {}
    if (Date.now() - last < 60000) return;
    try { sessionStorage.setItem('live:reloadedAt', String(Date.now())); } catch (e) {}
    location.reload();
  }
  window.addEventListener('hashchange', function () { setTimeout(apply, 50); });

  var busy = false, lastCheck = 0;
  function refresh() {
    if (busy) return; busy = true; lastCheck = Date.now();
    grab('assets/config.js', function (cfg) {
      grab('data/products.js', function (data) {
        busy = false;
        if (cfg && cfg.s && cfg.s.nameHe && JSON.stringify(cfg.s) !== inUse.site && put(K_SITE, cfg.s)) pending = true;
        if (data && valid(data.c) && JSON.stringify(data.c) !== inUse.cat && put(K_CAT, data.c)) pending = true;
        apply();
      });
    });
  }
  if (document.readyState === 'complete') setTimeout(refresh, 300);
  else window.addEventListener('load', function () { setTimeout(refresh, 300); });
  /* phones keep the app running in the background for days: check again when it comes back */
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && Date.now() - lastCheck > 5 * 60000) refresh();
  });
})();
