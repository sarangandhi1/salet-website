/*
 * The Meta pixel, loaded only after the visitor allows ad measurement.
 * Advertising cookies need consent (PECR), so until a choice is made nothing
 * from Meta loads. The choice is kept in the salet_ads cookie on .salet.uk,
 * so one answer covers salet.uk, reports.salet.uk and pro.salet.uk.
 *
 * window.SALET_PIXEL = { id, events: [[name, params, eventID], ...] } is
 * written by the server: the events the page itself stands for (a preview
 * started, a payment made). Each carries an event ID, so a reload does not
 * count twice.
 */
(function () {
  var cfg = window.SALET_PIXEL;
  if (!cfg || !cfg.id) return;
  var NAME = 'salet_ads';

  function choice() {
    var m = document.cookie.match(/(?:^|; )salet_ads=(yes|no)/);
    return m ? m[1] : null;
  }
  function remember(value) {
    var domain = /(^|\.)salet\.uk$/.test(location.hostname) ? '; domain=.salet.uk' : '';
    document.cookie = NAME + '=' + value + '; max-age=' + 365 * 86400 + '; path=/; samesite=lax' + domain + (location.protocol === 'https:' ? '; secure' : '');
  }

  function load() {
    /* Meta's standard base code. */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', cfg.id);
    window.fbq('track', 'PageView');
    (cfg.events || []).forEach(function (e) {
      window.fbq('track', e[0], e[1] || {}, e[2] ? { eventID: e[2] } : undefined);
    });
  }

  /* Its own styles, so the same file serves salet.uk, which has no app.css. */
  var CSS = '.consent-bar{position:fixed;left:0;right:0;bottom:0;z-index:2147483000;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.6rem 1rem;padding:.75rem 1rem;background:#0f2244;color:#f4f8fc;border-top:1px solid #1d3357;font:15px/1.45 Inter,system-ui,sans-serif}'
    + '.consent-bar p{margin:0;flex:1 1 18rem}.consent-bar a{color:#aecbea}'
    + '.consent-bar button{font:inherit;font-weight:600;border-radius:8px;padding:.5rem 1rem;cursor:pointer;border:1px solid #aecbea;background:#aecbea;color:#08152c}'
    + '.consent-bar button.ghost{background:transparent;color:#f4f8fc;border-color:#86b0dc}';

  function ask() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    var bar = document.createElement('div');
    bar.className = 'consent-bar';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Cookies');
    bar.innerHTML = '<p>Can we use an advertising cookie to see which of our ads brought you here? Nothing else changes either way. <a href="https://salet.uk/privacy#cookies">Privacy</a></p>'
      + '<div><button type="button" data-a="yes">Allow</button> <button type="button" class="ghost" data-a="no">No thanks</button></div>';
    bar.addEventListener('click', function (ev) {
      var a = ev.target && ev.target.getAttribute('data-a');
      if (!a) return;
      remember(a);
      bar.remove();
      if (a === 'yes') load();
    });
    document.body.appendChild(bar);
  }

  /* For pages that finish a step without a reload (the salet.uk brief form). */
  window.saletTrack = function (name, params, eventID) {
    if (window.fbq && choice() === 'yes') window.fbq('track', name, params || {}, eventID ? { eventID: eventID } : undefined);
  };

  function start() {
    var c = choice();
    if (c === 'yes') load();
    else if (!c) ask();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
