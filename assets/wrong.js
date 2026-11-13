/* 错题本页面：按天 / 知识点分组 + 一键只练错题 */
(function () {
  'use strict';

  var LABEL = { single: '单选', fill: '填空', judge: '判断', code: '代码' };
  var LETTERS = 'ABCDEFG';
  var DAYNAME = {
    day1: 'Day 1 · 引用与传参',
    day2: 'Day 2 · 指针与内存',
    day3: 'Day 3 · 类与对象',
    day4: 'Day 4 · 静态与 this',
    day5: 'Day 5 · 重载与继承'
  };
  var DAYORDER = ['day1', 'day2', 'day3', 'day4', 'day5'];
  var QB = {};      /* 题 id → {type, day, base} */
  var META = {};    /* 题 id → {day, num, title, tag, cardId} */

  function el(tag, cls, html) {
    var d = document.createElement(tag);
    if (cls) d.className = cls;
    if (html !== undefined) d.innerHTML = html;
    return d;
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function stripHtml(s) {
    var d = document.createElement('div');
    d.innerHTML = String(s).replace(/<br\s*\/?>/gi, ' ');
    return (d.textContent || '').replace(/\s+/g, ' ').trim();
  }
  function norm(s) {
    if (s === null || s === undefined) return '';
    s = String(s).trim().toLowerCase();
    s = s.replace(/[\uFF01-\uFF5E]/g, function (ch) { return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0); });
    return s.replace(/\s+/g, '');
  }
  function normCode(s) {
    if (s === null || s === undefined) return '';
    s = String(s).replace(/[\uFF01-\uFF5E]/g, function (ch) { return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0); });
    return s.replace(/\u3000/g, ' ').toLowerCase().replace(/\s+/g, '').replace(/;/g, '');
  }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function fmtTime(ts) {
    if (!ts) return '—';
    var d = new Date(ts);
    return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  /* ---------- 索引 ---------- */
  function buildIndex() {
    var banks = window.BANKS || {}, days = window.DAYS || {};
    DAYORDER.forEach(function (d) {
      var b = banks[d]; if (!b) return;
      ['single', 'fill', 'judge', 'code'].forEach(function (t) {
        (b[t] || []).forEach(function (q) { QB[q.id] = { type: t, day: d, base: q }; });
      });
    });
    DAYORDER.forEach(function (d) {
      var dd = days[d]; if (!dd) return;
      (dd.cards || []).forEach(function (c) {
        (c.quizIds || []).forEach(function (id) {
          if (!META[id]) {
            META[id] = { day: d, num: c.num, title: stripHtml(c.title), tag: (c.tags && c.tags[0]) || '综合', cardId: c.id };
          }
        });
      });
    });
  }
  function metaOf(id) {
    if (META[id]) return META[id];
    var q = QB[id];
    return { day: q ? q.day : 'day1', num: 0, title: '综合题', tag: '综合', cardId: '' };
  }

  /* ---------- 状态 ---------- */
  var filt = 'all';
  var P = null;   /* 练习态：{ids, ans, order} */

  function entries() {
    var db = WrongBook.all(), out = [];
    Object.keys(db).forEach(function (id) {
      if (!QB[id]) return;                    /* 题库里已不存在的旧 id 忽略 */
      out.push({ id: id, e: db[id], q: QB[id], m: metaOf(id) });
    });
    out.sort(function (a, b) { return (b.e.lastAt || 0) - (a.e.lastAt || 0); });
    return out;
  }

  function paintTop() {
    var n = entries().length;
    document.getElementById('wbCount').textContent = n + ' 道待清';
    document.getElementById('wbTop').textContent = '待清 ' + n + ' 道';
    document.getElementById('wbPracticeAll').disabled = n === 0;
  }

  /* ---------- 列表 ---------- */
  function renderList() {
    var box = document.getElementById('wbList');
    var all = entries();
    var html = '';

    var chips = '<div class="wbfilter">' +
      '<button type="button" class="wchip' + (filt === 'all' ? ' on' : '') + '" data-f="all">全部 ' + all.length + '</button>';
    DAYORDER.forEach(function (d) {
      var n = all.filter(function (x) { return x.m.day === d; }).length;
      if (!n) return;
      chips += '<button type="button" class="wchip' + (filt === d ? ' on' : '') + '" data-f="' + d + '">' +
        d.replace('day', 'Day ') + ' ' + n + '</button>';
    });
    chips += '</div>';

    if (!all.length) {
      box.innerHTML = chips +
        '<div class="wbempty"><b>错题本是空的</b>' +
        '去学习页的练习区做一轮，答错的题会自动进来。连对两次就自动出队。' +
        '<div style="margin-top:14px"><a class="btn-main" href="index.html#practice1" style="text-decoration:none;display:inline-flex;padding:8px 16px;font-size:13.5px">去练习区做题</a></div></div>';
      document.getElementById('wbPracticeAll').disabled = true;
      bindChips();
      return;
    }

    var list = filt === 'all' ? all : all.filter(function (x) { return x.m.day === filt; });
    DAYORDER.forEach(function (d) {
      var rows = list.filter(function (x) { return x.m.day === d; });
      if (!rows.length) return;
      html += '<section class="wbday" data-day="' + d + '">' +
        '<div class="wbdayhead"><h2>' + DAYNAME[d] + '</h2>' +
        '<span class="wbnum">' + rows.length + ' 道</span>' +
        '<button type="button" class="btn-ghost" data-practice-day="' + d + '">练这一天</button>' +
        '<a class="btn-ghost" href="index.html#practice' + d.replace('day', '') + '">去练习区</a></div>';

      /* 按知识点分组，顺序按首次出现 */
      var tags = [];
      rows.forEach(function (r) { if (tags.indexOf(r.m.tag) < 0) tags.push(r.m.tag); });
      tags.forEach(function (tag) {
        var group = rows.filter(function (r) { return r.m.tag === tag; });
        html += '<div class="wbkp"><p class="wbkpname">' + esc(tag) + '<span>' + group.length + ' 道</span></p>';
        group.forEach(function (r) {
          var raw = stripHtml(r.q.base.q);
          if (raw.length > 72) raw = raw.slice(0, 72) + '…';
          var card = r.m.cardId
            ? '<a class="wbcard" href="index.html#' + r.m.cardId + '">卡 ' + r.m.num + ' · ' + esc(r.m.title) + '</a>'
            : '<span class="wbcard">综合题</span>';
          html += '<div class="wbitem">' +
            '<div class="wbitemtop"><span class="badge b-' + r.q.type + '">' + LABEL[r.q.type] + '</span>' + card +
            '<span class="wbstate">连对 ' + (r.e.streak || 0) + '/2 · 错 ' + (r.e.wrong || 1) + ' 次 · 最近 ' + fmtTime(r.e.lastAt) + '</span></div>' +
            '<p class="wbq">' + esc(raw) + '</p>' +
            '<button type="button" class="btn-ghost" data-practice-one="' + r.id + '">单练这道</button>' +
            '</div>';
        });
        html += '</div>';
      });
      html += '</section>';
    });

    box.innerHTML = chips + html;
    bindChips();

    Array.prototype.forEach.call(box.querySelectorAll('[data-practice-day]'), function (b) {
      b.addEventListener('click', function () {
        startPractice(entries().filter(function (x) { return x.m.day === b.getAttribute('data-practice-day'); }).map(function (x) { return x.id; }));
      });
    });
    Array.prototype.forEach.call(box.querySelectorAll('[data-practice-one]'), function (b) {
      b.addEventListener('click', function () { startPractice([b.getAttribute('data-practice-one')]); });
    });
  }

  function bindChips() {
    Array.prototype.forEach.call(document.querySelectorAll('.wchip'), function (b) {
      b.addEventListener('click', function () {
        filt = b.getAttribute('data-f');
        renderList();
      });
    });
  }

  /* ---------- 练习 ---------- */
  function startPractice(ids) {
    if (!ids || !ids.length) return;
    P = { order: shuffle(ids.slice()), ans: {} };
    document.getElementById('wbHead').hidden = true;
    document.getElementById('wbList').hidden = true;
    var pv = document.getElementById('wbPractice');
    pv.hidden = false;
    pv.innerHTML =
      '<div class="wb-pbar">' +
        '<button type="button" class="btn-ghost" id="wbBack">← 返回错题本</button>' +
        '<span class="wp" id="wbProg">0 / ' + P.order.length + '</span>' +
      '</div>' +
      '<p class="wbqnote">这一轮只做错题。答对一次记 1/2，再答对一次才出队；中途答错会清零重来。</p>' +
      '<div id="wbQlist"></div>' +
      '<div id="wbSum"></div>';
    document.getElementById('wbBack').addEventListener('click', backToList);
    window.scrollTo(0, 0);
    renderPractice();
  }

  function backToList() {
    P = null;
    document.getElementById('wbHead').hidden = false;
    document.getElementById('wbList').hidden = false;
    var pv = document.getElementById('wbPractice');
    pv.hidden = true;
    pv.innerHTML = '';
    paintTop();
    renderList();
    window.scrollTo(0, 0);
  }

  function prepare(base, type) {
    if (type === 'single') {
      var opts = shuffle(base.options.map(function (txt, i) { return { text: txt, ok: i === base.ans }; }));
      var idx = 0;
      for (var k = 0; k < opts.length; k++) { if (opts[k].ok) { idx = k; break; } }
      return { id: base.id, type: 'single', q: base.q, code: base.code || '', options: opts, ansIdx: idx, answerText: opts[idx].text, why: base.why };
    }
    if (type === 'judge') {
      return { id: base.id, type: 'judge', q: base.q, code: base.code || '', ansIdx: base.ans, answerText: base.ans === 0 ? '对' : '错', why: base.why };
    }
    return { id: base.id, type: type, q: base.q, code: base.code || '', answers: base.answers, answerText: base.display, why: base.why };
  }

  function buildQ(p, i) {
    var st = P.ans[p.id];
    var m = metaOf(p.id);
    var card = el('div', 'q');
    card.setAttribute('data-qid', p.id);
    card.appendChild(el('div', 'q-head',
      '<span class="badge b-' + p.type + '">' + LABEL[p.type] + '</span><span class="q-idx">第 ' + (i + 1) + ' 题</span>' +
      (m.cardId ? '<a class="wbcard" href="index.html#' + m.cardId + '">卡 ' + m.num + ' · ' + esc(m.title) + '</a>' : '')));
    card.appendChild(el('div', 'q-text', p.q));
    if (p.code) {
      var pre = el('pre', 'code');
      pre.appendChild(el('code', '', p.code));
      card.appendChild(pre);
    }
    var body = el('div', 'q-body');
    card.appendChild(body);

    if (p.type === 'single') {
      p.options.forEach(function (opt, k) {
        var b = el('button', 'opt', '<span class="ok">' + LETTERS[k] + '.</span>' + opt.text);
        b.type = 'button';
        if (st) {
          b.disabled = true;
          if (k === p.ansIdx) b.classList.add('correct');
          else if (k === st.user) b.classList.add('wrong');
        } else {
          b.addEventListener('click', function () { answer(p, k === p.ansIdx, k, LETTERS[k] + '. ' + stripHtml(p.options[k].text)); });
        }
        body.appendChild(b);
      });
    } else if (p.type === 'judge') {
      var row = el('div');
      row.style.cssText = 'display:flex;gap:10px';
      ['对', '错'].forEach(function (txt, k) {
        var b = el('button', 'opt', txt);
        b.type = 'button';
        b.style.cssText = 'margin:8px 0 0;text-align:center';
        if (st) {
          b.disabled = true;
          if (k === p.ansIdx) b.classList.add('correct');
          else if (k === st.user) b.classList.add('wrong');
        } else {
          b.addEventListener('click', function () { answer(p, k === p.ansIdx, k, txt); });
        }
        row.appendChild(b);
      });
      body.appendChild(row);
    } else {
      if (p.type === 'code') body.appendChild(el('div', 'code-tip', '把 ____ 处该填的内容写进输入框：分号、空格、大小写都不计较。'));
      var frow = el('div', 'fill-row');
      var inp = document.createElement('input');
      inp.type = 'text';
      inp.placeholder = p.type === 'code' ? '填入空白处的代码，回车提交' : '输入答案，回车提交';
      inp.value = st ? st.raw : '';
      if (st) { inp.disabled = true; inp.classList.add(st.ok ? 'correct' : 'wrong'); }
      else {
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(p, inp.value); });
      }
      var sbtn = el('button', 'submit', st ? '已提交' : '提交');
      sbtn.type = 'button';
      if (st) sbtn.disabled = true;
      else sbtn.addEventListener('click', function () { submit(p, inp.value); });
      frow.appendChild(inp); frow.appendChild(sbtn);
      body.appendChild(frow);
    }

    var slot = el('div', 'fb-slot');
    card.appendChild(slot);
    if (st) {
      var out = st.status === 'out';
      slot.innerHTML =
        '<div class="fb ' + (st.ok ? 'ok' : 'no') + '">' +
          '<div class="head">' + (st.ok ? '✓ 答对了' : '✗ 答错了') + '</div>' +
          (st.ok ? '' : '<div class="ansline">正确答案：<b>' + p.answerText + '</b></div>') +
          '<div class="why">' + p.why + '</div>' +
          '<div class="ansline" style="margin-top:6px">' +
            (st.ok
              ? (out ? '连对 2 次，已从错题本出队。' : '连对 1/2：再连续答对一次就出队。')
              : '这道题又回到起点：连对计数清零。') +
          '</div>' +
        '</div>';
    }
    return card;
  }

  function renderPractice() {
    var list = document.getElementById('wbQlist');
    list.innerHTML = '';
    P.order.forEach(function (id, i) {
      var q = QB[id];
      list.appendChild(buildQ(prepare(q.base, q.type), i));
    });
    paintProgress();
  }

  function paintProgress() {
    var done = Object.keys(P.ans).length;
    document.getElementById('wbProg').textContent = done + ' / ' + P.order.length;
    var sum = document.getElementById('wbSum');
    if (done < P.order.length) { sum.innerHTML = ''; return; }
    var right = P.order.filter(function (id) { return P.ans[id] && P.ans[id].ok; }).length;
    var outN = P.order.filter(function (id) { return P.ans[id] && P.ans[id].status === 'out'; }).length;
    var left = entries().length;
    sum.innerHTML =
      '<div class="wbdone"><h3>这一轮错题做完了</h3>' +
      '<p>本轮 ' + P.order.length + ' 道：答对 <b>' + right + '</b> 道，答错 <b>' + (P.order.length - right) + '</b> 道。' +
      (outN ? '其中 <b>' + outN + '</b> 道连对两次，已经出队。' : '还没有题连对两次，再刷一轮就能出队。') + '</p>' +
      '<p>错题本还剩 <b>' + left + '</b> 道。</p>' +
      '<div class="btn-row">' +
        (left ? '<button type="button" class="btn-main" id="wbAgain">再来一轮（剩余 ' + left + ' 道）</button>' : '') +
        '<button type="button" class="btn-ghost" id="wbBack2">返回错题本</button>' +
      '</div></div>';
    var again = document.getElementById('wbAgain');
    if (again) {
      again.addEventListener('click', function () {
        startPractice(entries().map(function (x) { return x.id; }));
      });
    }
    document.getElementById('wbBack2').addEventListener('click', backToList);
  }

  function answer(p, ok, k, userText) {
    var status = WrongBook.record(p.id, ok);
    P.ans[p.id] = { ok: ok, user: k, userText: userText, status: status };
    renderPractice();
    paintTop();
  }

  function submit(p, val) {
    if (norm(val) === '') return;
    var ok;
    if (p.type === 'code') {
      ok = p.answers.some(function (a) { return normCode(a) === normCode(val); });
    } else {
      var v = norm(val);
      ok = p.answers.some(function (a) { return norm(a) === v; });
    }
    var status = WrongBook.record(p.id, ok);
    P.ans[p.id] = { ok: ok, user: null, userText: val, raw: val, status: status };
    renderPractice();
    paintTop();
  }

  /* ---------- 启动 ---------- */
  buildIndex();
  paintTop();
  renderList();
  document.getElementById('wbPracticeAll').addEventListener('click', function () {
    startPractice(entries().map(function (x) { return x.id; }));
  });
  document.addEventListener('wrongbook:change', paintTop);
})();
