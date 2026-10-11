/* Customer login on phones: keyboards capitalise the first letter ("Nezar" instead of "nezar")
   and may add a space, so the saved username never matches. Turn that off, and if the name as
   typed is not recognised, also try it in lower case before the catalog checks it. */
(function () {
  var user = document.getElementById('lgUser'), pass = document.getElementById('lgPass'), form = document.getElementById('loginForm');
  if (!user || !form) return;
  [user, pass].forEach(function (el) {
    el.setAttribute('autocapitalize', 'none'); el.setAttribute('autocorrect', 'off'); el.setAttribute('spellcheck', 'false');
  });
  var subtle = window.crypto && crypto.subtle;
  if (!subtle || !window.TextEncoder) return;
  function hash(s) {
    return subtle.digest('SHA-256', new TextEncoder().encode(s)).then(function (b) {
      return Array.prototype.map.call(new Uint8Array(b), function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
    });
  }
  var checked = false;
  document.addEventListener('submit', function (e) {
    if (e.target !== form) return;
    if (checked) { checked = false; return; }          // second pass: let the catalog log in
    e.preventDefault(); e.stopPropagation();
    var typed = user.value.trim(), lower = typed.toLowerCase(), first = typed.charAt(0).toLowerCase() + typed.slice(1);
    var tries = [typed, first, lower].filter(function (v, i, a) { return a.indexOf(v) === i; });
    var users = (window.SITE && window.SITE.users) || [];
    Promise.all(tries.map(function (u) { return hash(u + ':' + pass.value); })).then(function (hs) {
      for (var i = 0; i < hs.length; i++) if (users.indexOf(hs[i]) > -1) { user.value = tries[i]; break; }
    }).catch(function () {}).then(function () {
      checked = true;
      form.dispatchEvent(new Event('submit', { cancelable: true }));
    });
  }, true);
})();
