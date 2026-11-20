/* Дронопорт — поведінка компонентів. Один класичний скрипт: слухачі висять на document, тож розмітку можна додавати будь-коли. */
(function () {
  'use strict';
  if (window.Droneport) return;
  var doc = document, root = doc.documentElement;

  /* ---- тема: [data-action="theme"]; сторінка з data-theme-auto бере тему системи ---- */
  function stored() { try { return localStorage.getItem('dp-theme'); } catch (e) { return null; } }
  function setTheme(t, keep) { root.setAttribute('data-theme', t); if (keep) { try { localStorage.setItem('dp-theme', t); } catch (e) {} } }
  if (root.hasAttribute('data-theme-auto') && !root.hasAttribute('data-theme')) {
    setTheme(stored() || (window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
  }

  /* ---- вкладки ---- */
  function tabsOf(list) { return [].slice.call(list.querySelectorAll('[role="tab"]:not(:disabled)')); }
  function pickTab(list, tab, focus) {
    tabsOf(list).forEach(function (t) {
      var on = t === tab, panel = doc.getElementById(t.getAttribute('aria-controls'));
      t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1;
      if (panel) panel.hidden = !on;
    });
    if (focus) tab.focus();
  }

  /* ---- копіювання коду ---- */
  function copy(btn) {
    var code = btn.closest('.codeblock').querySelector('code'), label = btn.lastChild, old = label.textContent;
    function done(ok) {
      label.textContent = ok ? 'Скопійовано' : 'Не скопійовано. Виділіть текст вручну';
      btn.classList.toggle('danger', !ok);
      setTimeout(function () { label.textContent = old; btn.classList.remove('danger'); }, 2000);
    }
    if (navigator.clipboard) navigator.clipboard.writeText(code.textContent).then(function () { done(true); }, function () { done(false); });
    else done(false);
  }

  doc.addEventListener('click', function (e) {
    var t = e.target, el;
    if (!t.closest) return;
    if ((el = t.closest('[role="tab"]')) && el.closest('[role="tablist"]') && !el.disabled) return pickTab(el.closest('[role="tablist"]'), el);
    if ((el = t.closest('.codeblock-head .btn'))) return copy(el);
    if ((el = t.closest('.term>abbr[tabindex]'))) { el.parentNode.classList.remove('is-closed'); el.parentNode.classList.toggle('is-open'); return; }
    if ((el = t.closest('[data-action="theme"]'))) return setTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light', true);
    if ((el = t.closest('[data-action="drawer"], .scrim'))) { var app = el.closest('.app'); if (app) app.classList.toggle(window.matchMedia && matchMedia('(max-width: 760px)').matches || el.classList.contains('scrim') ? 'drawer' : 'noside'); return; }
    if ((el = t.closest('[data-action="panel"]'))) { var a = el.closest('.app'); if (a) { a.classList.toggle('nopanel'); el.setAttribute('aria-pressed', !a.classList.contains('nopanel')); } }
  });

  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      [].forEach.call(doc.querySelectorAll('.term'), function (t) {
        if (t.matches(':hover,:focus-within') || t.classList.contains('is-open')) { t.classList.add('is-closed'); t.classList.remove('is-open'); }
      });
      var open = doc.querySelector('.app.drawer'); if (open) open.classList.remove('drawer');
      return;
    }
    var tab = doc.activeElement && doc.activeElement.closest && doc.activeElement.closest('[role="tab"]');
    if (!tab) return;
    var list = tab.closest('[role="tablist"]'); if (!list) return;
    var tabs = tabsOf(list), i = tabs.indexOf(tab);
    var n = { ArrowRight: (i + 1) % tabs.length, ArrowLeft: (i - 1 + tabs.length) % tabs.length, Home: 0, End: tabs.length - 1 }[e.key];
    if (i < 0 || n === undefined) return;
    e.preventDefault(); pickTab(list, tabs[n], true);
  });

  ['focusout', 'mouseout'].forEach(function (name) {
    doc.addEventListener(name, function (e) {
      var t = e.target.closest && e.target.closest('.term');
      if (t && !t.contains(e.relatedTarget)) t.classList.remove('is-closed');
    });
  });

  window.Droneport = { setTheme: setTheme, pickTab: pickTab };
})();
