/* App shell: makes the website behave like a native app inside Capacitor. */
(function () {
  var Cap = window.Capacitor;
  var native = !!(Cap && Cap.isNativePlatform && Cap.isNativePlatform());
  var P = (Cap && Cap.Plugins) || {};
  document.documentElement.classList.add('in-app');
  if (native) document.documentElement.classList.add('in-app-' + Cap.getPlatform());

  var webUrl = ((window.APP && window.APP.webUrl) || '').replace(/\/+$/, '');
  if (!webUrl) document.documentElement.classList.add('no-weburl');

  /* Open WhatsApp, phone, email and other sites outside the app. */
  function isExternal(a) {
    var href = a.getAttribute('href') || '';
    if (/^(tel|mailto|sms|whatsapp):/i.test(href)) return true;
    if (!/^https?:/i.test(href)) return false;
    try { return new URL(href).host !== location.host; } catch (e) { return false; }
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (a && isExternal(a)) {
      e.preventDefault(); e.stopPropagation();
      if (native) location.href = a.href; // Capacitor hands non-app URLs to the system
      else window.open(a.href, '_blank', 'noopener');
      return;
    }
    /* "Copy link" copies the public website link, not the in-app address. */
    var c = e.target.closest && e.target.closest('[data-copy]');
    if (c && webUrl) {
      e.preventDefault(); e.stopPropagation();
      var url = webUrl + '/' + location.hash;
      var ok = function () { var t = document.getElementById('toast'); if (t) { t.textContent = 'הקישור הועתק'; t.hidden = false; setTimeout(function () { t.hidden = true; }, 2200); } };
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(ok, ok); else ok();
    }
  }, true);

  if (!native) return;

  /* Android back button: go back inside the catalog, close login, or exit from home. */
  if (P.App) P.App.addListener('backButton', function () {
    var modal = document.getElementById('loginModal');
    if (modal && !modal.hidden) { modal.hidden = true; return; }
    var h = location.hash.replace(/^#/, '');
    if (h && h !== 'home') history.length > 1 ? history.back() : (location.hash = 'home');
    else P.App.exitApp();
  });

  if (P.StatusBar) {
    P.StatusBar.setStyle({ style: 'DARK' }).catch(function () {});
    if (Cap.getPlatform() === 'android') P.StatusBar.setBackgroundColor({ color: '#0D0D0F' }).catch(function () {});
  }
  window.addEventListener('load', function () {
    if (P.SplashScreen) setTimeout(function () { P.SplashScreen.hide(); }, 150);
  });
})();
