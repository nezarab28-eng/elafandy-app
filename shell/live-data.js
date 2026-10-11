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

  /* Run a website script without disturbing the running catalog, and hand back what it set. */
  function grab(path, done) {
    var keep = { c: window.CATALOG, s: window.SITE };
    var s = document.createElement('script');
    s.src = BASE + '/' + path + '?t=' + Date.now();
    s.onload = s.onerror = function (ev) {
      var got = ev.type === 'load' ? { c: window.CATALOG, s: window.SITE } : null;
      window.CATALOG = keep.c; window.SITE = keep.s; s.remove();
      done(got);
    };
    document.head.appendChild(s);
  }

  function refresh() {
    grab('assets/config.js', function (cfg) {
      grab('data/products.js', function (data) {
        var changed = false;
        if (cfg && cfg.s && cfg.s.nameHe && JSON.stringify(cfg.s) !== inUse.site) { changed = put(K_SITE, cfg.s) || changed; }
        if (data && valid(data.c) && JSON.stringify(data.c) !== inUse.cat) { changed = put(K_CAT, data.c) || changed; }
        if (!changed) return;
        var h = (location.hash || '').slice(1), modal = document.getElementById('loginModal');
        var atHome = !h || h === 'home' || h === 'top';
        var done = true; try { done = !!sessionStorage.getItem('live:reloaded'); } catch (e) {}
        if (atHome && !(modal && !modal.hidden) && !done) {
          try { sessionStorage.setItem('live:reloaded', '1'); } catch (e) {}
          location.reload();
        }
      });
    });
  }
  if (document.readyState === 'complete') setTimeout(refresh, 300);
  else window.addEventListener('load', function () { setTimeout(refresh, 300); });
})();
