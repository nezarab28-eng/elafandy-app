/* Elafandy catalog — order cart
   The customer collects products, enters the business details and sends the order
   to WhatsApp as a text message, or as a PDF file. */
(function () {
  'use strict';
  var E = window.ELF;
  if (!E) return;
  var S = E.S, esc = E.esc, t = E.t, I = window.I18N || { lang: 'he', dir: 'rtl' };
  var NAME = E.site('name'), VAT = E.site('vatNote'), FOOT = E.site('footNote'), TAG = E.site('tagline');
  var $ = function (s) { return document.querySelector(s); };
  var KEY = 'elafandy_cart_v1', CKEY = 'elafandy_customer_v1';

  function sget(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function sset(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  /* cart = [{id, q}] — only products that still exist in the catalog */
  var cart = (sget(KEY) || []).filter(function (x) { return x && E.byId[x.id] && x.q > 0; });
  function save() { sset(KEY, cart); badge(); }
  function find(id) { for (var i = 0; i < cart.length; i++) if (cart[i].id === id) return cart[i]; return null; }
  function units() { return cart.reduce(function (a, x) { return a + x.q; }, 0); }
  function add(id, q) {
    var it = find(id);
    if (it) it.q = Math.min(999, it.q + q); else cart.push({ id: id, q: Math.min(999, q) });
    save();
  }
  function setQty(id, q) {
    var it = find(id); if (!it) return;
    q = Math.max(0, Math.min(999, q | 0));
    if (!q) cart = cart.filter(function (x) { return x.id !== id; }); else it.q = q;
    save();
  }
  function showPrices() { return S.priceMode !== 'hidden' && E.logged(); }
  function total() { return cart.reduce(function (a, x) { return a + (E.byId[x.id].price || 0) * x.q; }, 0); }

  function badge() {
    var b = $('#cartCount'), n = units();
    if (!b) return;
    b.textContent = n; b.hidden = !n;
    b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
  }

  /* ---------- drawer ---------- */
  function archAvailable() { return !!(E.orderToken && E.orderToken()) || (S.priceMode === 'login' && E.logged()); }
  function archBar() {
    return archAvailable() ? '<button type="button" class="arch-open" data-arch><svg class="ic"><use href="#i-clock"/></svg>' + t('archBtn') + '<svg class="ic chev"><use href="#i-chev"/></svg></button>' : '';
  }
  function render() {
    var body = $('#cartBody');
    if (!cart.length) {
      body.innerHTML = archBar() + '<div class="cart-empty"><svg class="ic"><use href="#i-cart"/></svg><p>' + t('cartEmpty') + '</p>' +
        '<p class="muted">' + t('cartEmptyHint') + '</p></div>';
      $('#cartForm').hidden = true;
      return;
    }
    $('#cartForm').hidden = false;
    var sp = showPrices();
    body.innerHTML = archBar() + '<ul class="cart-list">' + cart.map(function (x) {
      var p = E.byId[x.id];
      return '<li class="cart-row">' +
        '<div class="cart-info"><a href="#p-' + esc(p.id) + '" data-cart-close dir="auto">' + esc(E.pn(p)) + '</a>' +
          '<span class="sku">' + t('sku') + ' ' + esc(p.id) + '</span>' +
          (sp ? '<span class="cart-price">' + E.fmt(p.price) + ' ' + t('perUnit') + '</span>' : '') + '</div>' +
        '<div class="qty sm" role="group" aria-label="' + t('qty') + '">' +
          '<button type="button" data-cq="1" data-id="' + esc(p.id) + '" aria-label="' + t('qtyPlus') + '">+</button>' +
          '<input type="number" inputmode="numeric" min="1" max="999" value="' + x.q + '" data-cset="' + esc(p.id) + '" aria-label="' + t('qty') + '">' +
          '<button type="button" data-cq="-1" data-id="' + esc(p.id) + '" aria-label="' + t('qtyMinus') + '">−</button></div>' +
        '<button type="button" class="cart-del" data-cdel="' + esc(p.id) + '" aria-label="' + t('remove') + '"><svg class="ic"><use href="#i-trash"/></svg></button>' +
        '</li>';
    }).join('') + '</ul>' +
    '<div class="cart-sum"><span>' + t('cartSum', { n: cart.length, u: units() }) + '</span>' +
      (sp ? '<b>' + E.fmt(total()) + ' <small>' + esc(VAT) + '</small></b>' : '') + '</div>';
  }
  function open() {
    render();
    var c = sget(CKEY) || {};
    $('#cBiz').value = c.biz || ''; $('#cPhone').value = c.phone || ''; $('#cName').value = c.name || '';
    $('#cartMsg').textContent = '';
    setupButtons();
    $('#cartDrawer').hidden = false;
    document.documentElement.classList.add('no-scroll');
  }
  /* second WhatsApp button + share button (only where the device can share files) */
  function canShareFiles() {
    try { return !!(navigator.canShare && navigator.canShare({ files: [new File(['x'], 'x.pdf', { type: 'application/pdf' })] })); }
    catch (e) { return false; }
  }
  function setupButtons() {
    var n2 = String(S.whatsapp2 || '').replace(/\D/g, ''), nm = S.whatsapp2Name || '';
    if (typeof nm === 'object') nm = nm[I.lang] || nm.he || '';
    $('#cartWa2').hidden = !n2;
    $('#cartWa2Name').textContent = nm || n2;
    $('#cartPdfShare').hidden = !canShareFiles();
  }
  function close() {
    $('#cartDrawer').hidden = true;
    document.documentElement.classList.remove('no-scroll');
  }

  /* ---------- order data ---------- */
  function customer() {
    return { biz: $('#cBiz').value.trim(), phone: $('#cPhone').value.trim(), name: $('#cName').value.trim(), note: $('#cNote').value.trim() };
  }
  function check(c) {
    var msg = $('#cartMsg');
    if (!c.biz) { msg.textContent = t('needBiz'); $('#cBiz').focus(); return false; }
    if (c.phone.replace(/\D/g, '').length < 9) { msg.textContent = t('needPhone'); $('#cPhone').focus(); return false; }
    msg.textContent = '';
    sset(CKEY, { biz: c.biz, phone: c.phone, name: c.name });
    return true;
  }
  function orderNo() {
    var d = new Date(), z = function (n) { return (n < 10 ? '0' : '') + n; };
    return 'ELF-' + String(d.getFullYear()).slice(2) + z(d.getMonth() + 1) + z(d.getDate()) + '-' + z(d.getHours()) + z(d.getMinutes());
  }
  function today() { return new Date().toLocaleDateString(I.lang === 'en' ? 'en-GB' : I.lang === 'ar' ? 'ar-EG' : 'he-IL', { year: 'numeric', month: '2-digit', day: '2-digit', numberingSystem: 'latn' }); }

  function orderText(c, no) {
    var sp = showPrices();
    var L = ['*' + t('oNew') + ' – ' + NAME + '*', t('oNo') + ': ' + no + ' | ' + today(), '',
      '*' + t('oBiz') + ':* ' + c.biz, '*' + t('oPhone') + ':* ' + c.phone];
    if (c.name) L.push('*' + t('oContact') + ':* ' + c.name);
    L.push('', '*' + t('oItems') + ':*');
    cart.forEach(function (x, i) {
      var p = E.byId[x.id];
      L.push((i + 1) + '. ' + t('sku') + ' ' + p.id + ' | ' + E.pn(p) + ' | ' + t('oQty') + ': ' + x.q +
        (sp ? ' | ' + E.fmt(p.price * x.q) : ''));
    });
    L.push('', t('oTotal', { n: cart.length, u: units() }) + (sp ? ' | ' + E.fmt(total()) + ' ' + VAT : ''));
    if (c.note) L.push('', '*' + t('oNotes') + ':* ' + c.note);
    return L.join('\n');
  }

  /* ---------- order snapshot (what was ordered, at which price) + archive on the hosting ---------- */
  function snapshot(c, no, via) {
    return { no: no, date: today(), via: via, sp: showPrices(), c: c,
      items: cart.map(function (x) { var p = E.byId[x.id]; return { id: p.id, name: E.pn(p), q: x.q, price: p.price }; }) };
  }
  function archive(o) {
    var tok = E.orderToken && E.orderToken();
    if (!tok || location.protocol === 'file:') return;
    E.apiOrders({ a: 'save', token: tok, order: o }).then(function (r) {
      if (r && r.err === 'token') E.setOrderToken(null);
    }).catch(function () {});
  }
  function oUnits(o) { return o.items.reduce(function (a, x) { return a + x.q; }, 0); }
  function oTotal(o) { return o.items.reduce(function (a, x) { return a + (x.price || 0) * x.q; }, 0); }

  /* after an order is sent: empty the cart and close it (business details stay remembered) */
  function afterSend(msg) {
    cart = []; save(); render(); close();
    $('#cNote').value = '';
    E.toast(msg);
  }

  function sendWhatsApp(e, num) {
    if (e) e.preventDefault();
    var c = customer(); if (!check(c)) return;
    var no = orderNo();
    archive(snapshot(c, no, num ? 'wa2' : 'wa'));
    var a = document.createElement('a');
    a.href = E.waLink(orderText(c, no), num); a.target = '_blank'; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
    afterSend(t('sentWa'));
  }

  /* ---------- PDF (rendered by the browser, so Hebrew prints correctly) ---------- */
  var libs;
  function loadScript(src) {
    return new Promise(function (ok, bad) {
      var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = bad; document.head.appendChild(s);
    });
  }
  function loadLibs() {
    if (!libs) libs = Promise.all([
      window.html2canvas ? 0 : loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'),
      (window.jspdf && window.jspdf.jsPDF) ? 0 : loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
    ]);
    return libs;
  }
  function pageHTML(o, rows, from, pageNo, pages, last) {
    var c = o.c, no = o.no, sp = o.sp, START = I.dir === 'rtl' ? 'right' : 'left', END = I.dir === 'rtl' ? 'left' : 'right';
    var logo = location.protocol === 'file:' ? '' : '<img src="assets/logo.png" style="width:74px;height:74px;border-radius:50%">';
    var head = pageNo === 1
      ? '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #C69A45;padding-bottom:14px">' +
          '<div style="display:flex;gap:14px;align-items:center">' + logo +
            '<div><div style="font:700 26px Arial;color:#8E1B22">' + esc(NAME) + '</div>' +
            '<div style="font-size:13px;color:#555">' + esc(TAG) + '</div>' +
            '<div style="font-size:14px;margin-top:4px" dir="ltr">' + esc(S.phoneDisplay || S.phone) + '</div></div></div>' +
          '<div style="text-align:' + END + '"><div style="font:700 22px Arial">' + t('oOrder') + '</div>' +
            '<div style="font-size:13px;color:#555">' + t('oNo') + ' <span dir="ltr">' + esc(no) + '</span>' + '</div><div style="font-size:13px;color:#555">' + esc(o.date) + '</div></div></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px 24px;margin:16px 0;padding:12px 16px;background:#F7F2EF;border-radius:8px;font-size:14px">' +
          '<div><b>' + t('oBiz') + ':</b> ' + esc(c.biz) + '</div><div><b>' + t('oPhone') + ':</b> <span dir="ltr">' + esc(c.phone) + '</span></div>' +
          (c.name ? '<div><b>' + t('oContact') + ':</b> ' + esc(c.name) + '</div>' : '') + '</div>'
      : '<div style="font-size:13px;color:#555;border-bottom:2px solid #C69A45;padding-bottom:8px;margin-bottom:12px">' +
          esc(NAME) + ' · ' + t('oOrder') + ' ' + esc(no) + ' (' + t('oCont') + ')</div>';
    var th = 'padding:8px 6px;background:#8E1B22;color:#fff;font-size:13px;text-align:' + START;
    var td = 'padding:7px 6px;border-bottom:1px solid #E5DCDA;font-size:13px;vertical-align:top';
    var table = '<table style="width:100%;border-collapse:collapse"><thead><tr>' +
      '<th style="' + th + ';width:28px">#</th><th style="' + th + ';width:80px">' + t('sku') + '</th><th style="' + th + '">' + t('oName') + '</th>' +
      '<th style="' + th + ';width:52px;text-align:center">' + t('oQty') + '</th>' +
      (sp ? '<th style="' + th + ';width:78px">' + t('oUnit') + '</th><th style="' + th + ';width:86px">' + t('oLine') + '</th>' : '') +
      '</tr></thead><tbody>' + rows.map(function (x, i) {
        return '<tr><td style="' + td + '">' + (from + i + 1) + '</td><td style="' + td + '" dir="ltr">' + esc(x.id) + '</td>' +
          '<td style="' + td + '" dir="auto">' + esc(x.name) + '</td><td style="' + td + ';text-align:center;font-weight:700">' + x.q + '</td>' +
          (sp ? '<td style="' + td + '">' + E.fmt(x.price || 0) + '</td><td style="' + td + '">' + E.fmt((x.price || 0) * x.q) + '</td>' : '') + '</tr>';
      }).join('') + '</tbody></table>';
    var foot = last
      ? '<div style="margin-top:14px;display:flex;justify-content:space-between;font-size:14px"><span>' + t('oTotal', { n: o.items.length, u: oUnits(o) }) + '</span>' +
          (sp ? '<b style="font-size:16px">' + E.fmt(oTotal(o)) + ' <span style="font-weight:400;font-size:12px">' + esc(VAT) + '</span></b>' : '') + '</div>' +
        (c.note ? '<div style="margin-top:12px;padding:10px 12px;border:1px solid #E5DCDA;border-radius:8px;font-size:13px"><b>' + t('oNotes') + ':</b> ' + esc(c.note) + '</div>' : '')
      : '';
    return '<div style="width:794px;height:1123px;box-sizing:border-box;padding:40px 44px;background:#fff;color:#22161A;font-family:Arial,sans-serif;direction:' + I.dir + ';position:relative">' +
      head + table + foot +
      '<div style="position:absolute;bottom:26px;left:44px;right:44px;display:flex;justify-content:space-between;font-size:11px;color:#888">' +
        '<span>' + esc(FOOT) + '</span><span>' + t('oPage', { p: pageNo, n: pages }) + '</span></div></div>';
  }
  /* mode 'dl': save the file on the device (cart stays) · 'share': phone share sheet (WhatsApp, email…) */
  function makePDF(mode, old, oldBtn) {
    var o = old, c, no;
    if (!o) { c = customer(); if (!check(c)) return; o = snapshot(c, orderNo(), mode === 'share' ? 'share' : 'pdf'); }
    c = o.c; no = o.no;
    var btn = oldBtn || $(mode === 'share' ? '#cartPdfShare' : '#cartPdfDl'); btn.disabled = true; var label = btn.innerHTML; btn.textContent = t('pdfMaking');
    loadLibs().then(function () {
      var chunks = [], first = 16, next = 24, i = 0, rows = o.items;
      while (i < rows.length) { var n = chunks.length ? next : first; chunks.push({ from: i, rows: rows.slice(i, i + n) }); i += n; }
      var holder = document.createElement('div');
      holder.style.cssText = 'position:fixed;left:-10000px;top:0';
      document.body.appendChild(holder);
      var pdf = new window.jspdf.jsPDF({ unit: 'pt', format: 'a4' });
      var seq = Promise.resolve();
      chunks.forEach(function (ch, k) {
        seq = seq.then(function () {
          holder.innerHTML = pageHTML(o, ch.rows, ch.from, k + 1, chunks.length, k === chunks.length - 1);
          return window.html2canvas(holder.firstChild, { scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false });
        }).then(function (canvas) {
          if (k) pdf.addPage();
          pdf.addImage(canvas.toDataURL('image/jpeg', 0.9), 'JPEG', 0, 0, 595.28, 841.89);
        });
      });
      return seq.then(function () {
        holder.remove();
        var name = 'Elafandy-Order-' + no + '.pdf';   // English file name: WhatsApp shows Hebrew file names as gibberish
        var blob = pdf.output('blob');
        var file = null;
        try { file = new File([blob], name, { type: 'application/pdf' }); } catch (e) {}
        if (mode === 'share' && file && navigator.canShare && navigator.canShare({ files: [file] })) {
          // phone: share sheet -> WhatsApp / email / any app -> the PDF is attached
          return navigator.share({ files: [file], title: t('oOrder') + ' ' + no, text: t('shareText', { biz: c.biz }) })
            .then(function () { archive(o); afterSend(t('sentShare')); })   // cancelled share keeps the cart
            .catch(function () {});
        }
        // download to the phone / computer; the cart stays so the customer can still send it
        var url = URL.createObjectURL(blob), a = document.createElement('a');
        a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
        if (!old) archive(o);
        E.toast(t('pdfDownloaded'));
      });
    }).catch(function () {
      E.toast(t('pdfFail'));
    }).then(function () { btn.disabled = false; btn.innerHTML = label; });
  }

  /* ---------- previous orders (kept on the hosting, per customer account) ---------- */
  var archList = [];
  function showArchive() {
    var body = $('#cartBody');
    $('#cartForm').hidden = true;
    var head = '<button type="button" class="arch-back" data-arch-back><svg class="ic"><use href="#i-chev"/></svg>' + t('archBack') + '</button>' +
      '<h3 class="arch-title"><svg class="ic"><use href="#i-clock"/></svg>' + t('archBtn') + '</h3>';
    var tok = E.orderToken();
    if (!tok) {
      body.innerHTML = head + '<div class="cart-empty"><p>' + t('archRelogin') + '</p>' +
        '<button type="button" class="btn btn-gold" data-login data-cart-close>' + t('login') + '</button></div>';
      return;
    }
    body.innerHTML = head + '<p class="arch-note">' + t('archLoading') + '</p>';
    E.apiOrders({ a: 'list', token: tok }).then(function (r) {
      if (!r || !r.ok) { if (r && r.err === 'token') { E.setOrderToken(null); showArchive(); return; } throw 0; }
      archList = r.orders || [];
      body.innerHTML = head + (archList.length
        ? '<ul class="arch-list">' + archList.map(function (o, i) {
            return '<li class="arch-item"><div class="arch-info"><b>' + esc(o.date) + '</b><span dir="ltr">' + esc(o.no) + '</span>' +
              '<span>' + t('archItems', { n: o.items.length }) + (o.sp ? ' · ' + E.fmt(oTotal(o)) : '') + '</span></div>' +
              '<div class="arch-acts"><button type="button" class="btn btn-line" data-arch-pdf="' + i + '"><svg class="ic"><use href="#i-dl"/></svg>PDF</button>' +
              '<button type="button" class="btn btn-line" data-arch-re="' + i + '"><svg class="ic"><use href="#i-cart"/></svg>' + t('archReorder') + '</button></div></li>';
          }).join('') + '</ul>'
        : '<div class="cart-empty"><svg class="ic"><use href="#i-clock"/></svg><p>' + t('archEmpty') + '</p></div>');
    }).catch(function () { body.innerHTML = head + '<p class="form-msg">' + t('archFail') + '</p>'; });
  }

  /* ---------- events ---------- */
  document.addEventListener('click', function (e) {
    var el = e.target, b;
    if ((b = el.closest('[data-add]'))) {
      e.preventDefault();
      var q = 1, src = b.getAttribute('data-qty-from');
      if (src && $(src)) q = Math.max(1, Math.min(999, parseInt($(src).value, 10) || 1));
      add(b.getAttribute('data-add'), q);
      b.classList.add('added'); setTimeout(function () { b.classList.remove('added'); }, 900);
      E.toast(t('added', { u: units() }));
      return;
    }
    if ((b = el.closest('[data-q]'))) {           // product page quantity
      var inp = $('#pdQty'); if (inp) inp.value = Math.max(1, Math.min(999, (parseInt(inp.value, 10) || 1) + (+b.getAttribute('data-q'))));
      return;
    }
    if (el.closest('#cartBtn')) { open(); return; }
    if ((b = el.closest('[data-cq]'))) { var id = b.getAttribute('data-id'), it = find(id); if (it) { setQty(id, it.q + (+b.getAttribute('data-cq'))); render(); } return; }
    if ((b = el.closest('[data-cdel]'))) { setQty(b.getAttribute('data-cdel'), 0); render(); return; }
    if (el.closest('[data-cart-close]') || el.id === 'cartDrawer') { close(); return; }
    if (el.closest('[data-arch]')) { showArchive(); return; }
    if (el.closest('[data-arch-back]')) { render(); return; }
    if ((b = el.closest('[data-arch-pdf]'))) { var od = archList[+b.getAttribute('data-arch-pdf')]; if (od) makePDF('dl', od, b); return; }
    if ((b = el.closest('[data-arch-re]'))) {
      var or = archList[+b.getAttribute('data-arch-re')], n = 0;
      if (or) or.items.forEach(function (x) { if (E.byId[x.id] && !E.byId[x.id].oos) { add(x.id, x.q); n++; } });
      render(); E.toast(t('archReadded', { n: n })); return;
    }
    if (el.closest('#cartPdfDl')) { makePDF('dl'); return; }
    if (el.closest('#cartPdfShare')) { makePDF('share'); return; }
    if (el.closest('#cartWa2')) { sendWhatsApp(null, S.whatsapp2); return; }
    if (el.closest('#cartClear')) {
      if (el.closest('#cartClear').getAttribute('data-sure')) { cart = []; save(); render(); el.closest('#cartClear').removeAttribute('data-sure'); el.closest('#cartClear').textContent = t('clearCart'); }
      else { el.closest('#cartClear').setAttribute('data-sure', '1'); el.closest('#cartClear').textContent = t('clearSure'); }
    }
  });
  document.addEventListener('change', function (e) {
    var id = e.target.getAttribute && e.target.getAttribute('data-cset');
    if (id) { setQty(id, Math.max(1, parseInt(e.target.value, 10) || 1)); render(); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !$('#cartDrawer').hidden) close(); });
  $('#cartForm').addEventListener('submit', sendWhatsApp);
  ['#cBiz', '#cPhone'].forEach(function (s) { $(s).addEventListener('input', function () { $('#cartMsg').textContent = ''; }); });
  ['#cBiz', '#cPhone', '#cName'].forEach(function (s) {
    $(s).addEventListener('change', function () { var c = customer(); sset(CKEY, { biz: c.biz, phone: c.phone, name: c.name }); });
  });
  badge();
  $('#cartCount').classList.remove('bump');
})();
