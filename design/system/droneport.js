/* Дронопорт — дизайн-система, єдина точка підключення.
   Сторінка ставить один рядок:  <script src="system/droneport.js" data-current="id-пункту-меню"></script>
   Скрипт сам, під час відкриття сторінки, без жодної збірки:
     1. читає project/tokens.json і робить із нього CSS-змінні обох тем;
     2. підключає project/components/bundle.css (стилі компонентів) і bundle.js (поведінка);
     3. підставляє блоки з ../blocks/ на місце рядків <!-- @block назва параметр="…" -->;
     4. показує плашку, якщо сторінка чи блок вживає клас, якого в системі немає.
   Тому зміна токена, компонента чи блока видна на всіх сторінках після оновлення вкладки. */
(function () {
  'use strict';
  var me = document.currentScript, doc = document, root = doc.documentElement;
  var SYS = new URL('.', me.src), SITE = new URL('..', me.src);
  var current = me.getAttribute('data-current');
  var problems = [];

  // Доки система не зібралася в браузері, сторінку не показуємо: без миготіння нестилізованої розмітки.
  var veil = doc.createElement('style');
  veil.textContent = 'html:not(.dp-ready) body{visibility:hidden}';
  doc.head.appendChild(veil);
  setTimeout(ready, 4000);
  function ready() { root.classList.add('dp-ready'); }

  function get(url, type) {
    return fetch(url, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error(r.status + ' ' + url);
      return type === 'json' ? r.json() : r.text();
    });
  }
  function add(tag, attrs) {
    return new Promise(function (ok) {
      var el = doc.createElement(tag);
      Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); });
      el.onload = ok; el.onerror = function () { problems.push('не завантажено ' + (attrs.href || attrs.src)); ok(); };
      doc.head.appendChild(el);
    });
  }

  /* ---- 1. токени → CSS-змінні ---- */
  function tokensCss(t) {
    var themes = t.color.themes.map(function (x) { return x.id; }), first = themes[0];
    var val = function (x, th) { return typeof x.value === 'string' ? x.value : (x.value[th] != null ? x.value[th] : x.value[first]); };
    var themed = t.color.tokens.concat((t.shadow && t.shadow.tokens) || []);
    var block = function (th) { return themed.map(function (x) { return '--' + x.name + ':' + val(x, th); }).join(';') + ';color-scheme:' + (th === 'dark' ? 'dark' : 'light'); };
    var css = ':root,[data-theme="' + first + '"]{' + block(first) + '}';
    themes.slice(1).forEach(function (th) { css += '[data-theme="' + th + '"]{' + block(th) + '}'; });
    var flat = [];
    Object.keys(t).forEach(function (k) { if (t[k] && t[k].tokens && k !== 'color' && k !== 'shadow') flat = flat.concat(t[k].tokens); });
    css += ':root{' + flat.map(function (x) { return '--' + x.name + ':' + x.value; }).join(';') + ';' +
      Object.keys(t.type.families).map(function (k) { return '--font-' + k + ':' + t.type.families[k]; }).join(';') + '}';
    t.type.groups.forEach(function (g) { g.styles.forEach(function (s) {
      css += '.' + s.name + '{font-family:var(--font-' + (s.family || g.family) + ');font-size:' + s.fontSize + ';line-height:' + s.lineHeight + ';font-weight:' + s.fontWeight + '}';
    }); });
    return css;
  }

  /* ---- 3. блоки ---- */
  var cache = {};
  function block(name) {
    return cache[name] || (cache[name] = get(new URL('blocks/' + name + '.html', SITE)).then(function (s) {
      return s.replace(/^\s*<!--[\s\S]*?-->\s*/, '').trim();
    }, function () { problems.push('немає блока «' + name + '»'); return ''; }));
  }
  var CALL = /^\s*@block\s+([\w\/-]+)((?:\s+[\w-]+="[^"]*")*)\s*$/;
  function fill(scope, depth) {
    var walker = doc.createTreeWalker(scope, NodeFilter.SHOW_COMMENT), calls = [], n;
    while ((n = walker.nextNode())) { var m = n.nodeValue.match(CALL); if (m) calls.push([n, m[1], m[2]]); }
    if (depth > 8) { if (calls.length) problems.push('блоки вкладено надто глибоко'); return Promise.resolve(); }
    return Promise.all(calls.map(function (c) {
      var params = {}; c[2].replace(/([\w-]+)="([^"]*)"/g, function (_, k, v) { params[k] = v; });
      return block(c[1]).then(function (html) {
        var tpl = doc.createElement('template');
        tpl.innerHTML = html.replace(/\{\{([\w-]+)\}\}/g, function (_, k) { return params[k] != null ? params[k] : ''; });
        var frag = tpl.content;
        return fill(frag, depth + 1).then(function () { c[0].replaceWith(frag); });
      });
    }));
  }

  /* ---- 4. перевірка: кожен клас сторінки має існувати в системі ---- */
  function check() {
    var known = {};
    (function walk(rules) {
      [].forEach.call(rules, function (r) {
        if (r.selectorText) (r.selectorText.match(/\.[A-Za-z][\w-]*/g) || []).forEach(function (c) { known[c.slice(1)] = 1; });
        if (r.cssRules) walk(r.cssRules);
      });
    })([].reduce.call(doc.styleSheets, function (all, s) { try { return all.concat([].slice.call(s.cssRules)); } catch (e) { return all; } }, []));
    if (!Object.keys(known).length) return;
    var missing = {};
    [].forEach.call(doc.body.querySelectorAll('[class]'), function (el) {
      [].forEach.call(el.classList, function (c) { if (!known[c]) missing[c] = 1; });
    });
    Object.keys(missing).forEach(function (c) { problems.push('класу «' + c + '» немає в дизайн-системі'); });
    if (doc.body.querySelector('style:not([data-dp])')) problems.push('на сторінці є власний <style>');
  }
  function report() {
    if (!problems.length) return;
    console.warn('Дронопорт:\n' + problems.join('\n'));
    var bar = doc.createElement('div');
    bar.setAttribute('role', 'alert');
    bar.style.cssText = 'position:fixed;z-index:99;left:var(--space-12);bottom:var(--space-12);max-width:420px;padding:var(--space-8) var(--space-12);border-radius:var(--radius-md);background:var(--bg-raised);box-shadow:var(--shadow-raised),0 0 0 var(--line-w) var(--line-strong);color:var(--danger);font:400 13px/19px var(--font-text)';
    bar.textContent = 'Розбіжність із дизайн-системою: ' + problems.join('; ') + '.';
    doc.body.appendChild(bar);
  }

  /* ---- запуск ---- */
  if (!root.hasAttribute('data-theme')) root.setAttribute('data-theme-auto', '');
  var fonts = add('link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Geologica:wght@400..600&family=Martian+Mono:wdth,wght@87.5,400..600&display=swap' });
  var tokens = get(new URL('project/tokens.json', SYS), 'json').then(function (t) {
    var st = doc.createElement('style'); st.setAttribute('data-dp', 'tokens'); st.textContent = tokensCss(t); doc.head.appendChild(st);
  }, function (e) { problems.push('не прочитано tokens.json (' + e.message + '). Сторінку треба відкривати з вебсервера, а не як файл'); });
  // Стилі компонентів беремо текстом: локальні @font-face відкидаємо, бо шрифти дає Google Fonts.
  var styles = Promise.all([tokens, get(new URL('project/components/bundle.css', SYS))]).then(function (r) {
    var st = doc.createElement('style'); st.setAttribute('data-dp', 'components');
    st.textContent = r[1].replace(/@font-face\s*{[^}]*}/g, ''); doc.head.appendChild(st);
  }, function (e) { problems.push('не прочитано bundle.css (' + e.message + ')'); });
  var dom = new Promise(function (ok) { doc.readyState === 'loading' ? doc.addEventListener('DOMContentLoaded', ok) : ok(); });
  var blocks = dom.then(function () { return fill(doc.body, 0); }).then(function () {
    if (!current) return;
    var hit = doc.querySelectorAll('[data-id="' + current + '"]');
    if (!hit.length) problems.push('пункту меню «' + current + '» немає в навігації');
    [].forEach.call(hit, function (el) { el.setAttribute('aria-current', 'page'); });
  });
  Promise.all([styles, blocks]).then(function () {
    return add('script', { src: new URL('project/components/bundle.js', SYS).href });
  }).then(function () { check(); ready(); report(); void fonts; });
})();
