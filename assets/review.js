/* 知识卡复习队列：三关全过后按 1/2/4/7/15/30 天回到队列。
   数据存在独立键 cpp_review_v1，不碰 cpp_card_levels_v2 / cpp_task_done_v1 /
   cpp_lab_v1 / cpp_wrong_v1 / cpp_eye_v1 / cpp_fs_v1。
   到期判定：按本机日历日的 00:00 计，due <= 今天 即到期。 */
(function () {
  'use strict';

  var KEY = 'cpp_review_v1';
  var LV_KEY = 'cpp_card_levels_v2';
  var INT = [1, 2, 4, 7, 15, 30];
  var DAYNAME = { day1: 'Day 1', day2: 'Day 2', day3: 'Day 3', day4: 'Day 4' };

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function addDays(n) {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + n);
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  /* 两个 YYYY-MM-DD 之间差几天（按 UTC 解析，避免夏令时） */
  function diffDays(a, b) {
    function t(s) { var p = s.split('-').map(Number); return Date.UTC(p[0], p[1] - 1, p[2]); }
    return Math.round((t(a) - t(b)) / 86400000);
  }
  function shortDate(s) { var p = s.split('-'); return Number(p[1]) + '/' + Number(p[2]); }
  function read(k, d) { try { var v = JSON.parse(localStorage.getItem(k) || 'null'); return v || d; } catch (e) { return d; } }
  function write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function dayOf(id) { var m = /^d(\d)c/.exec(id); return m ? 'day' + m[1] : 'day1'; }

  /* 三关全过的卡自动进入队列：首次到期 = 今天 + 1 天 */
  function sync() {
    var lv = read(LV_KEY, {}), db = read(KEY, {}), changed = false, t = todayStr();
    Object.keys(lv).forEach(function (id) {
      var o = lv[id] || {}, n = 0;
      [1, 2, 3].forEach(function (k) { if (o[k]) n++; });
      if (n === 3 && !db[id]) {
        db[id] = { n: 0, due: addDays(INT[0]), since: t, last: '' };
        changed = true;
      }
    });
    if (changed) write(KEY, db);
    return db;
  }

  function status() {
    var db = sync(), t = todayStr(), due = [], next = '';
    Object.keys(db).forEach(function (id) {
      var e = db[id] || {};
      if (!e.due) return;
      if (e.due <= t) due.push(id);
      else if (!next || e.due < next) next = e.due;
    });
    due.sort();
    return { due: due, next: next, total: Object.keys(db).length, today: t };
  }

  function cardOf(id) {
    var d = (window.DAYS || {})[dayOf(id)];
    if (!d || !d.cards) return null;
    for (var i = 0; i < d.cards.length; i++) if (d.cards[i].id === id) return d.cards[i];
    return null;
  }

  function ensureDays(ids) {
    var days = [], seen = {};
    ids.forEach(function (id) { var d = dayOf(id); if (!seen[d]) { seen[d] = 1; days.push(d); } });
    if (!window.CppApp || !window.CppApp.ensureDay) return Promise.resolve();
    return Promise.all(days.map(function (d) {
      return window.CppApp.ensureDay(d).catch(function () {});
    }));
  }

  /* ---------- 入口状态 ---------- */
  function paint() {
    var st = status();
    var badge = document.getElementById('rvNavBadge');
    if (badge) {
      if (st.due.length) { badge.textContent = st.due.length; badge.classList.remove('hide'); }
      else if (st.next) { badge.textContent = shortDate(st.next); badge.classList.remove('hide'); }
      else { badge.textContent = ''; badge.classList.add('hide'); }
    }
    var dEl = document.getElementById('rvDue');
    if (dEl) dEl.textContent = st.due.length ? st.due.length + ' 张' : (st.total ? '已清' : '空');
    var nEl = document.getElementById('rvNext');
    if (nEl) {
      if (st.due.length) nEl.textContent = '今天有 ' + st.due.length + ' 张到期，点开重看一遍。';
      else if (st.next) nEl.textContent = '下一次复习 ' + shortDate(st.next) + '（' + diffDays(st.next, st.today) + ' 天后）';
      else nEl.textContent = '还没有卡进队列：三关全过的卡会从第二天开始回来。';
    }
    var b = document.getElementById('rvStart');
    if (b) {
      b.disabled = st.due.length === 0;
      b.textContent = st.due.length ? '开始复习（' + st.due.length + ' 张）' : '今天没有到期的';
    }
  }

  /* ---------- 复习面板 ---------- */
  function buildPanel() {
    if (document.getElementById('rvPanel')) return;
    var sec = document.createElement('section');
    sec.className = 'rvpanel';
    sec.id = 'rvPanel';
    sec.hidden = true;
    sec.innerHTML =
      '<div class="rvwrap">' +
        '<div class="rvtop">' +
          '<h1>知识卡复习</h1>' +
          '<span id="rvCount"></span>' +
          '<button type="button" class="btn-ghost" id="rvClose">关闭</button>' +
        '</div>' +
        '<p class="rvsub">按 1 / 2 / 4 / 7 / 15 / 30 天的节奏回到队列。看完点「标记完成」，就排到下一个复习日；Day 顺序阅读不受影响。</p>' +
        '<div id="rvList"></div>' +
      '</div>';
    document.body.appendChild(sec);
    document.getElementById('rvClose').addEventListener('click', close);
  }

  function renderPanel() {
    var st = status();
    var list = document.getElementById('rvList');
    var cnt = document.getElementById('rvCount');
    if (!list) return;
    if (!st.due.length) {
      cnt.textContent = '今天没有到期';
      list.innerHTML = '<div class="rvdone"><h3>今天的复习做完了</h3><p>' +
        (st.next ? '下一轮在 <b>' + shortDate(st.next) + '</b>（' + diffDays(st.next, st.today) + ' 天后）。'
                 : '队列里还没有卡：三关全过之后，第二天会开始回来。') + '</p></div>';
      return;
    }
    cnt.textContent = '今天 ' + st.due.length + ' 张到期';
    var db = read(KEY, {});
    var html = '';
    st.due.forEach(function (id) {
      var card = cardOf(id);
      if (!card) return;
      var e = db[id] || {};
      var times = (e.n || 0) + 1;
      html += '<article class="rvitem" data-rv="' + id + '">' +
        '<div class="rvhead"><span>' + (DAYNAME[dayOf(id)] || '') + ' · 第 ' + card.num + ' 张</span>' +
        '<span class="rvstep">第 ' + times + ' 次复习</span></div>' +
        (window.CppApp && window.CppApp.cardHtml ? window.CppApp.cardHtml(card) : '<pre class="code"><code>' + esc(card.title) + '</code></pre>') +
        '<div class="rvfoot"><button type="button" class="btn-main" data-done="' + id + '">看完，标记完成</button></div>' +
        '</article>';
    });
    list.innerHTML = html;
    Array.prototype.forEach.call(list.querySelectorAll('[data-done]'), function (b) {
      b.addEventListener('click', function () { complete(b.getAttribute('data-done')); });
    });
  }

  function complete(id) {
    var db = read(KEY, {});
    var e = db[id] || { n: 0 };
    e.n = Math.min((e.n || 0) + 1, INT.length - 1);
    e.last = todayStr();
    e.due = addDays(INT[e.n]);
    db[id] = e;
    write(KEY, db);
    paint();
    renderPanel();
  }

  function open() {
    buildPanel();
    var sec = document.getElementById('rvPanel');
    sec.hidden = false;
    document.body.style.overflow = 'hidden';
    sec.scrollTop = 0;
    var st = status();
    renderPanel();
    ensureDays(st.due).then(paint).then(function () { renderPanel(); });
  }

  function close() {
    var sec = document.getElementById('rvPanel');
    if (sec) sec.hidden = true;
    document.body.style.overflow = '';
    if (location.hash === '#review') {
      try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
    }
  }

  function boot() {
    paint();
    buildPanel();
    var link = document.getElementById('navReview');
    if (link) link.addEventListener('click', function (e) { e.preventDefault(); open(); });
    var btn = document.getElementById('rvStart');
    if (btn) btn.addEventListener('click', open);
    document.addEventListener('keydown', function (e) {
      var sec = document.getElementById('rvPanel');
      if (e.key === 'Escape' && sec && !sec.hidden) close();
    });
    if (location.hash === '#review') open();
    window.addEventListener('hashchange', function () {
      if (location.hash === '#review') open();
    });
    /* 别的标签页勾了三关，回来时刷新入口 */
    window.addEventListener('focus', paint);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
