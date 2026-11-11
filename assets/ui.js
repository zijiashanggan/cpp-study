/* C++ 前三天 · 单卡渲染、目录、翻页与关卡进度 */
(function () {
  'use strict';

  var A = window.CppApp || {};
  var SYL = window.SYLLABUS || [];
  var loaded = {};
  var loading = {};
  var started = {};
  var tailDone = {};
  var DATA = {};

  /* 当前状态：只保存「哪一天、第几张」，DOM 里始终只渲染这一张 */
  var ST = { day: 'day1', idx: 0 };
  var COLL = {};   /* 侧栏分组折叠状态 */

  /* ---------------- localStorage ---------------- */
  var TASK_STORE = 'cpp_task_done_v1';      /* 原「今天动手」勾选，保持兼容 */
  var LV_STORE = 'cpp_card_levels_v2';      /* 新：三关进度，独立键名 */

  function readJson(key) {
    try {
      var raw = localStorage.getItem(key);
      var o = raw ? JSON.parse(raw) : null;
      return o && typeof o === 'object' ? o : {};
    } catch (e) { return {}; }
  }
  function writeJson(key, obj) {
    try { localStorage.setItem(key, JSON.stringify(obj)); } catch (e) {}
  }
  var TASK_DONE = readJson(TASK_STORE);
  var LV = readJson(LV_STORE);

  function lvOf(cardId) {
    var o = LV[cardId];
    return o && typeof o === 'object' ? o : {};
  }
  function lvCount(cardId) {
    var o = lvOf(cardId), n = 0;
    if (o.read) n++;
    if (o.do) n++;
    if (o.quiz) n++;
    return n;
  }
  function isPassed(cardId) { return lvCount(cardId) === 3; }
  function setLv(cardId, lv, on) {
    var o = lvOf(cardId);
    if (on) o[lv] = 1; else delete o[lv];
    LV[cardId] = o;
    writeJson(LV_STORE, LV);
    paintCard(cardId);
    paintToc();
    paintRail();
  }
  function dayOfCard(cardId) {
    var m = /^d(\d)c/.exec(cardId);
    return m ? 'day' + m[1] : '';
  }

  /* ---------------- 基础查询 ---------------- */
  function metaOf(day) {
    for (var i = 0; i < SYL.length; i++) if (SYL[i].id === day) return SYL[i];
    return null;
  }
  function dayName(day) {
    var m = metaOf(day);
    return m ? (m.title || day) : day;
  }
  function cardsOf(day) {
    var d = DATA[day];
    return d && d.cards ? d.cards : [];
  }
  function cardCount(day) {
    var n = cardsOf(day).length;
    if (n) return n;
    var m = metaOf(day);
    return m && m.cards ? m.cards : 0;
  }
  function passedCount(day) {
    var n = 0;
    Object.keys(LV).forEach(function (id) {
      if (dayOfCard(id) !== day) return;
      if (isPassed(id)) n++;
    });
    return n;
  }
  function idxOfCard(day, cardId) {
    var list = cardsOf(day);
    for (var i = 0; i < list.length; i++) if (list[i].id === cardId) return i;
    return -1;
  }

  /* ---------------- 脚本加载 ---------------- */
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error('加载失败：' + src)); };
      document.head.appendChild(s);
    });
  }

  function waitFor(fn) {
    return new Promise(function (resolve) {
      var t = 0;
      (function tick() {
        if (fn()) return resolve();
        t += 20;
        if (t > 3000) return resolve();
        setTimeout(tick, 20);
      })();
    });
  }

  function showLoad(day) {
    if (ST.day !== day) return;
    var host = document.getElementById('cardHost');
    if (host && !host.querySelector('.card[data-card]')) {
      host.innerHTML = '<div class="load-tip">正在加载 ' + dayName(day) + ' 的内容…</div>';
    }
  }
  function showFail(day, isBank) {
    var html = '<div class="load-err">' + (isBank ? '练习题' : dayName(day) + ' 的内容') +
      '没能加载：网络中断或文件缺失。<button class="again" data-retry="' + day + '">重试</button></div>';
    if (isBank) {
      var q = document.getElementById('qlist' + day.slice(3));
      if (q) q.innerHTML = html;
    } else if (ST.day === day) {
      var host = document.getElementById('cardHost');
      if (host) host.innerHTML = html;
    } else {
      var g = document.getElementById('gloss' + day.slice(3));
      if (g) g.innerHTML = html;
    }
  }

  function ensureBank(day) {
    var B = window.BANKS || {};
    if (B[day]) {
      A.mergeBank && A.mergeBank(day, B[day]);
      return Promise.resolve();
    }
    var meta = metaOf(day);
    if (!meta) return Promise.resolve();
    return loadScript(meta.bank).then(function () {
      return waitFor(function () { return (window.BANKS || {})[day]; });
    }).then(function () {
      var BB = window.BANKS || {};
      if (BB[day]) A.mergeBank && A.mergeBank(day, BB[day]);
      else throw new Error('缺题库：' + day);
    });
  }

  function ensureDay(day) {
    if (loaded[day]) return Promise.resolve();
    if (loading[day]) return loading[day];
    var meta = metaOf(day);
    if (!meta) return Promise.resolve();
    showLoad(day);
    loading[day] = loadScript(meta.data).then(function () {
      return waitFor(function () { return (window.DAYS || {})[day]; });
    }).then(function () {
      var data = (window.DAYS || {})[day];
      if (!data) throw new Error('缺数据：' + day);
      DATA[day] = data;
      loaded[day] = true;
      delete loading[day];
      renderTail(day);
      if (ST.day === day) { paintDeckHead(); paintCardHost(); paintToc(); paintPager(); }
      return ensureBank(day).catch(function (e) { console.error(e); showFail(day, true); });
    }).then(function () {
      if (A.TRACKS && A.TRACKS['d' + day.slice(3)] && !started[day]) {
        started[day] = true;
        A.startRound(A.TRACKS['d' + day.slice(3)]);
      }
    }).catch(function (e) {
      delete loading[day];
      console.error(e);
      showFail(day, false);
    });
    return loading[day];
  }

  /* 失败后的重试：内容缺失则整块重来，只缺题库则只重取题库 */
  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-retry]') : null;
    if (!t) return;
    var day = t.getAttribute('data-retry');
    var q = document.getElementById('qlist' + day.slice(3));
    if (q) q.innerHTML = '';
    if (!loaded[day]) {
      delete loading[day];
      ensureDay(day).then(function () {
        if (ST.day === day) { paintDeckHead(); paintCardHost(); paintToc(); paintPager(); }
      });
    } else {
      started[day] = false;
      ensureBank(day).then(function () {
        A.startRound && A.startRound(A.TRACKS['d' + day.slice(3)]);
      }).catch(function (err) { console.error(err); showFail(day, true); });
    }
  });

  /* ---------------- 渲染 ---------------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* 代码块：超过 6 行默认折叠，只露前 6 行；按钮文案写明总行数和剩余行数 */
  var FOLD = 6;
  function codeHtml(code) {
    var raw = String(code == null ? '' : code).replace(/\n+$/, '');
    var n = raw ? raw.split('\n').length : 0;
    var body = A.hl ? A.hl(raw) : esc(raw);
    if (n <= FOLD) return '<pre class="code"><code>' + body + '</code></pre>';
    var more = '展开全文 · 共 ' + n + ' 行（还有 ' + (n - FOLD) + ' 行）';
    return '<div class="codewrap short" data-more="' + esc(more) + '">' +
      '<pre class="code"><code>' + body + '</code></pre>' +
      '<button class="expand" type="button">' + esc(more) + '</button>' +
      '</div>';
  }

  function cardHtml(card) {
    var h = [];
    h.push('<div class="card" data-card="' + card.id + '">');
    h.push('<h3><span class="n">' + card.num + '</span>' + card.title + '</h3>');
    if (card.pain) h.push('<p class="concl">' + card.pain + '</p>');
    if (card.analogy) h.push('<p class="analogy"><b>打个比方</b>：' + card.analogy + '</p>');
    if (card.only) h.push('<p class="only">' + card.only + '</p>');
    if (card.guess) h.push('<div class="guess"><b>先猜输出</b>：' + String(card.guess).replace(/^先猜[：:]\s*/, '') + '</div>');
    if (card.codeMin) {
      h.push('<p class="stage">最小版 · 先看懂这一步</p>');
      h.push(codeHtml(card.codeMin));
    }
    if (card.codeFull) {
      if (card.codeMin) h.push('<p class="stage">完整版 · 加上必要的头文件和 main，复制走就能编译</p>');
      h.push(codeHtml(card.codeFull));
    }
    if (card.output) {
      h.push('<details class="reveal"><summary>对答案：实际输出</summary>' +
             '<pre class="code out"><code>' + esc(card.output) + '</code></pre></details>');
    }
    if (card.errors && card.errors.length) {
      h.push('<div class="errs"><b>会撞上的报错</b><ul>');
      card.errors.forEach(function (e) { h.push('<li>' + e + '</li>'); });
      h.push('</ul></div>');
    }
    if (card.pitfalls && card.pitfalls.length) {
      h.push('<ul class="pts">');
      card.pitfalls.forEach(function (p) { h.push('<li>' + p + '</li>'); });
      h.push('</ul>');
    }
    if (card.concl) h.push('<p class="keep">记住这句就行：' + card.concl + '</p>');
    if (card.terms) h.push('<p class="terms">术语对照：' + card.terms + '</p>');
    h.push(levelsHtml(card));
    h.push('</div>');
    return h.join('\n');
  }

  function levelsHtml(card) {
    var o = lvOf(card.id);
    var quizable = card.quizIds && card.quizIds.length;
    return '<div class="levels" data-card="' + card.id + '">' +
      '<span class="lv-title">这张卡三关</span>' +
      '<button type="button" class="lv' + (o.read ? ' on' : '') + '" data-lv="read"><i></i>读讲解</button>' +
      '<button type="button" class="lv' + (o.do ? ' on' : '') + '" data-lv="do"><i></i>跑代码</button>' +
      '<button type="button" class="lv' + (o.quiz ? ' on' : '') + (quizable ? '' : ' off') + '" data-lv="quiz"><i></i>过题</button>' +
      '<span class="lv-note">三关都过，这张卡才算过</span>' +
      '<div class="lv-quiz"></div>' +
      '</div>';
  }

  function taskHtml(t) {
    var h = [];
    h.push('<div class="card" data-task-card="' + t.id + '">');
    h.push('<h3>' + t.title + '</h3>');
    if (t.goal) h.push('<p class="concl">' + t.goal + '</p>');
    if (t.code) h.push(codeHtml(t.code));
    if (t.output) {
      h.push('<p class="terms"><b>预期看到</b>：</p>');
      h.push('<pre class="code out"><code>' + esc(t.output) + '</code></pre>');
    }
    if (t.tip) h.push('<p class="check-tip">' + t.tip + '</p>');
    h.push('<label class="taskdone"><input type="checkbox" data-task="' + t.id + '"' +
      (TASK_DONE[t.id] ? ' checked' : '') + '><span>做完了，勾上</span></label>');
    h.push('</div>');
    return h.join('\n');
  }

  /* 当天「动手任务 + 术语」只渲染一次，切天不重复堆积 */
  function renderTail(day) {
    if (tailDone[day]) return;
    var d = DATA[day];
    if (!d) return;
    var n = day.slice(3);
    var taskHost = document.getElementById('task' + n);
    if (taskHost) {
      var h = [];
      if (d.tasks && d.tasks.length) {
        h.push('<div class="sec-title">' + (d.taskTitle || dayName(day) + ' · 今天动手') + '</div>');
        if (d.taskDesc) h.push('<p class="sec-desc">' + d.taskDesc + '</p>');
        d.tasks.forEach(function (t) { h.push(taskHtml(t)); });
      }
      taskHost.innerHTML = h.join('\n');
    }
    var gloss = document.getElementById('gloss' + n);
    if (gloss) gloss.innerHTML = d.gloss ? '<div class="gloss">' + d.gloss.html + '</div>' : '';
    tailDone[day] = true;
    A.aiAttachCards && A.aiAttachCards();
  }

  /* ---------------- 顶部标题 / 进度 ---------------- */
  function totalCards() {
    var t = 0;
    SYL.forEach(function (m) { t += (m.cards || 0); });
    return t;
  }
  function passedTotal() {
    var n = 0;
    Object.keys(LV).forEach(function (id) { if (isPassed(id)) n++; });
    return n;
  }

  function paintDeckHead() {
    var meta = metaOf(ST.day) || {};
    var n = cardCount(ST.day);
    var cur = n ? Math.min(ST.idx, n - 1) + 1 : 0;
    var card = cardsOf(ST.day)[ST.idx];

    var qi = document.getElementById('qi');
    var qt = document.getElementById('qt');
    var bar = document.getElementById('deckBar');
    var wrap = document.getElementById('deckBarWrap');
    var ov = document.getElementById('ovBtn');
    var dt = document.getElementById('drawerTitle');
    var sub = document.getElementById('deckSub');
    var hero = document.getElementById('deckTitle');
    var eyebrow = document.getElementById('heroEyebrow');

    if (qi) qi.textContent = String(cur || 1);
    if (qt) qt.textContent = String(n);
    if (bar) bar.style.width = (n ? cur / n * 100 : 0) + '%';
    if (wrap) {
      wrap.setAttribute('aria-valuemax', String(n || 1));
      wrap.setAttribute('aria-valuenow', String(cur || 1));
    }
    if (ov) ov.textContent = '今天 ' + n + ' 张 ▾';
    if (dt) dt.textContent = '今天 ' + n + ' 张';

    /* 大标题 = 当前这张卡的标题；卡内 h3 不再重复 */
    if (hero) hero.textContent = card ? card.title : (meta.title || ST.day);
    if (eyebrow) eyebrow.textContent = meta.nav || meta.title || ST.day;
    if (sub) sub.textContent = meta.nav || meta.title || ST.day;

    var cd = document.getElementById('crumbDay');
    if (cd) {
      cd.textContent = meta.nav || meta.id || ST.day;
      cd.setAttribute('href', '#' + ST.day);
    }
    var ct = document.getElementById('crumbTrack');
    if (ct) ct.setAttribute('href', '#' + ST.day);
    var cc = document.getElementById('crumbCard');
    if (cc) cc.textContent = '第 ' + (cur || 1) + ' 张';

    paintRail();
  }

  /* 右侧「今天进度」：全局第 X/30 张 + 当前卡三关状态 */
  function paintRail() {
    var n = cardCount(ST.day);
    var meta = metaOf(ST.day) || {};
    var card = cardsOf(ST.day)[ST.idx];
    var total = totalCards();
    var before = 0;
    for (var i = 0; i < SYL.length; i++) {
      if (SYL[i].id === ST.day) break;
      before += (SYL[i].cards || 0);
    }
    var gi = Math.min(before + ST.idx + 1, total);

    var dEl = document.getElementById('railDay');
    var iEl = document.getElementById('railIdx');
    var tEl = document.getElementById('railTotal');
    var bEl = document.getElementById('railBar');
    var tip = document.getElementById('railTip');
    var rbtn = document.getElementById('railNext');
    if (dEl) dEl.textContent = meta.nav || meta.id || ST.day;
    if (iEl) iEl.textContent = String(gi);
    if (tEl) tEl.textContent = String(total);
    if (bEl) bEl.style.width = (total ? gi / total * 100 : 0) + '%';

    var o = card ? lvOf(card.id) : {};
    Array.prototype.forEach.call(document.querySelectorAll('#railLvs .rlv'), function (el) {
      el.classList.toggle('on', !!o[el.getAttribute('data-lv')]);
    });

    var cnt = card ? lvCount(card.id) : 0;
    if (tip) {
      tip.textContent = !card ? '这一天的内容还在加载…'
        : cnt === 3 ? '这张卡三关都过了，接着下一张。'
        : cnt === 0 ? '先读讲解，再自己敲一遍。'
        : (cnt === 2 ? '就差最后一关了。' : '还差 ' + (3 - cnt) + ' 关，读完、跑过、做对题才算过。');
    }
    var hs = document.getElementById('heroState');
    if (hs) {
      hs.textContent = !card ? '加载中' : cnt === 3 ? '已通过' : cnt === 0 ? '未开始' : '进行中';
      hs.className = 'pill pill-run' + (cnt === 3 ? ' done' : cnt === 0 ? ' idle' : '');
    }

    if (rbtn) {
      var last = n > 0 && ST.idx >= n - 1;
      rbtn.textContent = last ? '今天刷完' : '继续下一张';
      rbtn.classList.toggle('done', last);
    }
    var tp = document.getElementById('tnProg');
    if (tp) tp.textContent = '已过 ' + passedTotal() + '/' + total;
  }

  /* 只渲染当前这一张：innerHTML 覆盖，不追加 */
  function paintCardHost() {
    var host = document.getElementById('cardHost');
    if (!host) return;
    var cards = cardsOf(ST.day);
    var card = cards[ST.idx];
    if (!card) {
      /* 加载失败时 catch 已经把兜底条写进来了，别被加载提示覆盖 */
      if (host.querySelector('.load-err')) return;
      if (!loaded[ST.day]) host.innerHTML = '<div class="load-tip">正在加载 ' + dayName(ST.day) + ' 的内容…</div>';
      return;
    }
    host.innerHTML = cardHtml(card);
    A.aiAttachCards && A.aiAttachCards();
    paintDeckHead();
  }

  function paintCard(cardId) {
    var el = document.querySelector('.card[data-card="' + cardId + '"]');
    if (!el) return;
    var o = lvOf(cardId);
    ['read', 'do', 'quiz'].forEach(function (k) {
      var b = el.querySelector('.lv[data-lv="' + k + '"]');
      if (b) b.classList.toggle('on', !!o[k]);
    });
    el.classList.toggle('passed', isPassed(cardId));
  }

  /* ---------------- 目录（侧栏与抽屉共用一套 HTML） ---------------- */
  function tocGroupHtml(day) {
    var meta = metaOf(day) || {};
    var cards = cardsOf(day);
    var total = cards.length || meta.cards || 0;
    var done = passedCount(day);
    var folded = !!COLL[day];
    var h = [];
    h.push('<div class="toc-group' + (folded ? ' collapsed' : '') + '" data-group="' + day + '">');
    h.push('<button class="toc-g" type="button" data-day="' + day + '" aria-expanded="' + (folded ? 'false' : 'true') + '">' +
      '<span class="toc-gt">' + esc(meta.nav || meta.title || day) + '</span>' +
      '<span class="toc-gn">' + done + '/' + total + '</span>' +
      '<span class="toc-caret" aria-hidden="true">▾</span></button>');
    h.push('<div class="toc-rows">');
    if (!cards.length) {
      h.push('<button class="toc-row toc-load" type="button" data-day="' + day + '" data-idx="0">' +
        '<span class="toc-num">→</span>' +
        '<span class="toc-t">切到这一天（' + total + ' 张）</span>' +
        '<span class="toc-st">加载</span></button>');
    } else {
      cards.forEach(function (c, i) {
        var k = lvCount(c.id);
        var on = (ST.day === day && ST.idx === i);
        h.push('<button class="toc-row' + (on ? ' active' : '') + '" type="button" data-day="' + day +
          '" data-idx="' + i + '"' + (on ? ' aria-current="true"' : '') + '>' +
          '<span class="toc-num">' + (i + 1) + '</span>' +
          '<span class="toc-t">' + esc(c.title || '') + '</span>' +
          '<span class="toc-st' + (k === 3 ? ' ok' : '') + '">' + (k === 3 ? '✓' : k + '/3') + '</span>' +
          '</button>');
      });
    }
    h.push('</div></div>');
    return h.join('');
  }

  function paintToc() {
    var html = SYL.map(function (m) { return tocGroupHtml(m.id); }).join('');
    var tl = document.getElementById('tocList');
    var dl = document.getElementById('drawerList');
    if (tl) tl.innerHTML = html;
    if (dl) dl.innerHTML = html;

    var sum = document.getElementById('tocSum');
    if (sum) {
      var total = 0, done = 0;
      SYL.forEach(function (m) {
        total += cardCount(m.id);
        done += passedCount(m.id);
      });
      sum.textContent = '已过 ' + done + ' / ' + total;
    }
    scrollActiveRow();
  }

  function scrollActiveRow() {
    var list = document.getElementById('tocList');
    if (!list) return;
    var row = list.querySelector('.toc-row.active');
    if (!row) return;
    var top = row.offsetTop, bottom = top + row.offsetHeight;
    if (top < list.scrollTop) list.scrollTop = top - 8;
    else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight + 8;
  }

  /* ---------------- 翻页 ---------------- */
  function paintPager() {
    var n = cardCount(ST.day);
    var prev = document.getElementById('prevBtn');
    var next = document.getElementById('nextBtn');
    var last = n > 0 && ST.idx >= n - 1;
    if (prev) prev.disabled = ST.idx <= 0;
    if (next) {
      next.textContent = last ? '今天刷完' : '下一张';
      next.classList.toggle('done', last);
    }
  }

  var toastTimer = null;
  function toast(msg) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 3000);
  }

  /* 切换卡片回顶部（页面已不使用全局 smooth，这里就是瞬时的） */
  function toTop() {
    window.scrollTo(0, 0);
  }

  function showCard(i) {
    var cards = cardsOf(ST.day);
    if (!cards.length) return;
    ST.idx = Math.max(0, Math.min(cards.length - 1, i));
    paintCardHost();
    paintToc();
    paintPager();
    try { history.replaceState(null, '', '#' + cards[ST.idx].id); }
    catch (e) { location.hash = cards[ST.idx].id; }
    toTop();
  }

  function step(delta) {
    var cards = cardsOf(ST.day);
    if (!cards.length) return;
    var i = ST.idx + delta;
    if (i < 0) return;
    if (i > cards.length - 1) {
      toast('今天的 ' + cards.length + ' 张卡都看完了，往下滑到练习区刷一轮吧。');
      return;
    }
    showCard(i);
  }

  function showDay(day, idx, opts) {
    opts = opts || {};
    if (!metaOf(day)) return Promise.resolve();
    /* 先把骨架切过去：标题、进度条、卡片区都指向新的一天。
       这样后面加载失败时，兜底提示会落在卡片区，而不是看不见的隐藏块里。 */
    ST.day = day;
    var n = cardCount(day);
    ST.idx = Math.max(0, Math.min(idx || 0, Math.max(0, n - 1)));

    var deck = document.querySelector('.deck');
    if (deck) deck.id = day;

    var parts = document.querySelectorAll('.day-part');
    Array.prototype.forEach.call(parts, function (el) {
      el.hidden = el.getAttribute('data-day') !== day;
    });

    paintDeckHead();
    paintCardHost();
    paintToc();
    paintPager();
    if (opts.scroll !== false) toTop();

    return ensureDay(day).then(function () {
      paintDeckHead();
      paintCardHost();
      paintToc();
      paintPager();
    });
  }

  /* ---------------- 关卡交互 ---------------- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.lv') : null;
    if (!btn) return;
    var cardEl = btn.closest('.card');
    if (!cardEl) return;
    var cardId = cardEl.getAttribute('data-card');
    var lv = btn.getAttribute('data-lv');
    var day = dayOfCard(cardId);

    if (lv === 'read' || lv === 'do') {
      setLv(cardId, lv, !lvOf(cardId)[lv]);
      return;
    }
    if (lv === 'quiz') {
      if (btn.classList.contains('off')) return;
      openQuiz(cardEl, cardId, day, btn);
    }
  });

  /* 代码折叠 */
  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.codewrap .expand') : null;
    if (!b) return;
    var w = b.closest('.codewrap');
    if (!w) return;
    var folded = w.classList.toggle('short');
    b.textContent = folded ? (w.getAttribute('data-more') || '展开全文') : '收起';
    b.classList.toggle('on', !folded);
  });

  /* 今天动手勾选：动态渲染，用事件委托 */
  document.addEventListener('change', function (e) {
    var cb = e.target;
    if (!cb || !cb.getAttribute || !cb.getAttribute('data-task')) return;
    var id = cb.getAttribute('data-task');
    TASK_DONE[id] = cb.checked;
    writeJson(TASK_STORE, TASK_DONE);
  });

  /* ---------------- 过题小测 ---------------- */
  function findQ(id) {
    var types = ['single', 'fill', 'judge', 'code'];
    for (var i = 0; i < types.length; i++) {
      var arr = A.BANK[types[i]] || [];
      for (var j = 0; j < arr.length; j++) if (arr[j].id === id) return { base: arr[j], type: types[i] };
    }
    return null;
  }

  function openQuiz(cardEl, cardId, day, btn) {
    var host = cardEl.querySelector('.lv-quiz');
    if (!host) return;
    if (host.getAttribute('data-open') === '1') {
      host.innerHTML = '';
      host.removeAttribute('data-open');
      return;
    }
    host.setAttribute('data-open', '1');
    host.innerHTML = '<p class="quiz-tip">正在取题…</p>';
    ensureBank(day).then(function () {
      var card = null;
      var dayData = (window.DAYS || {})[day];
      if (dayData) dayData.cards.forEach(function (c) { if (c.id === cardId) card = c; });
      var ids = (card && card.quizIds) || [];
      var qs = ids.map(findQ).filter(Boolean);
      if (!qs.length) { host.innerHTML = '<p class="quiz-tip">这张卡的对应题目还没挂上。</p>'; return; }
      renderMiniQuiz(host, qs, cardId);
    });
  }

  function norm(s) {
    return String(s == null ? '' : s).toLowerCase()
      .replace(/[\uFF01-\uFF5E]/g, function (ch) { return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0); })
      .replace(/\s+/g, '').replace(/;/g, '');
  }

  function renderMiniQuiz(host, qs, cardId) {
    host.innerHTML = '<p class="quiz-tip">这张卡对应的小测：答对全部题目，就算过题。</p>';
    var pending = qs.length;
    qs.forEach(function (item, qi) {
      var base = item.base, type = item.type;
      var box = document.createElement('div');
      box.className = 'mini-q';
      var stem = document.createElement('div');
      stem.className = 'mini-stem';
      stem.innerHTML = '<span class="mini-idx">' + (qi + 1) + '</span>' + base.q;
      box.appendChild(stem);
      if (base.code) {
        var pre = document.createElement('pre');
        pre.className = 'code';
        pre.innerHTML = '<code>' + A.hl(base.code) + '</code>';
        box.appendChild(pre);
      }
      var fb = document.createElement('div');
      fb.className = 'mini-fb';
      box.appendChild(fb);

      function good() {
        fb.className = 'mini-fb ok';
        fb.textContent = '对了。' + (base.why ? strip(base.why) : '');
        pending--;
        if (pending === 0) setLv(cardId, 'quiz', true);
      }
      function bad() {
        fb.className = 'mini-fb no';
        fb.textContent = '再想想：这题考的是「' + (base.q ? strip(base.q).slice(0, 40) : '') + '…」';
      }

      if (type === 'single') {
        var opts = base.options.map(function (txt, i) { return { text: txt, ok: i === base.ans }; });
        var wrap = document.createElement('div');
        wrap.className = 'mini-opts';
        opts.forEach(function (o) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'opt';
          b.innerHTML = o.text;
          b.addEventListener('click', function () {
            if (box.getAttribute('data-done') === '1') return;
            if (o.ok) { box.setAttribute('data-done', '1'); wrap.remove(); good(); }
            else { b.classList.add('wrong'); bad(); }
          });
          wrap.appendChild(b);
        });
        box.appendChild(wrap);
      } else if (type === 'judge') {
        var row = document.createElement('div');
        row.className = 'mini-opts';
        ['对', '错'].forEach(function (txt, i) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'opt';
          b.textContent = txt;
          b.addEventListener('click', function () {
            if (box.getAttribute('data-done') === '1') return;
            if (i === base.ans) { box.setAttribute('data-done', '1'); row.remove(); good(); }
            else bad();
          });
          row.appendChild(b);
        });
        box.appendChild(row);
      } else {
        var form = document.createElement('div');
        form.className = 'fill-row';
        var inp = document.createElement('input');
        inp.type = 'text';
        inp.placeholder = '输入答案，回车提交';
        var okBtn = document.createElement('button');
        okBtn.type = 'button';
        okBtn.className = 'sbtn';
        okBtn.textContent = '提交';
        form.appendChild(inp);
        form.appendChild(okBtn);
        box.appendChild(form);
        function submit() {
          if (box.getAttribute('data-done') === '1') return;
          var v = norm(inp.value);
          var ok = (base.answers || []).some(function (a) { return norm(a) === v; });
          if (ok) { box.setAttribute('data-done', '1'); form.remove(); good(); }
          else bad();
        }
        okBtn.addEventListener('click', submit);
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); });
      }
      host.appendChild(box);
    });
  }

  function strip(s) {
    var d = document.createElement('div');
    d.innerHTML = String(s).replace(/<br\s*\/?>/gi, ' ');
    return (d.textContent || '').replace(/\s+/g, ' ').trim();
  }

  /* ---------------- 抽屉 ---------------- */
  function openDrawer() {
    var mask = document.getElementById('drawerMask');
    var dr = document.getElementById('drawer');
    if (!mask || !dr) return;
    mask.hidden = false;
    dr.classList.add('open');
    dr.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lock');
    var c = document.getElementById('drawerClose');
    if (c) c.focus();
  }
  function closeDrawer() {
    var mask = document.getElementById('drawerMask');
    var dr = document.getElementById('drawer');
    if (mask) mask.hidden = true;
    if (dr) {
      dr.classList.remove('open');
      dr.setAttribute('aria-hidden', 'true');
    }
    document.body.classList.remove('lock');
  }
  function drawerOpen() {
    var dr = document.getElementById('drawer');
    return !!(dr && dr.classList.contains('open'));
  }

  /* ---------------- 深链 ---------------- */
  function parseHash(h) {
    h = String(h == null ? location.hash : h).replace('#', '');
    var m;
    if ((m = /^(day|task|practice)([123])$/.exec(h))) return { type: m[1], day: 'day' + m[2] };
    if ((m = /^(d[123]c\d+)$/.exec(h))) return { type: 'card', day: dayOfCard(m[1]), card: m[1] };
    return null;
  }

  function navTo(t) {
    if (!t) return Promise.resolve();
    if (t.type === 'card') {
      return showDay(t.day, 0).then(function () {
        var i = idxOfCard(t.day, t.card);
        if (i > 0) showCard(i);
        else toTop();
      });
    }
    if (t.type === 'day') {
      return showDay(t.day, 0);
    }
    return showDay(t.day, 0, { scroll: false }).then(function () {
      var el = document.getElementById(t.type + t.day.slice(3));
      if (el) setTimeout(function () {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 40);
    });
  }

  function boot() {
    /* 顶部按钮：切到那天，开新一轮，滚到练习 */
    [1, 2, 3].forEach(function (n) {
      var top = document.getElementById('againTop' + n);
      if (top) top.addEventListener('click', function () {
        showDay('day' + n, 0, { scroll: false }).then(function () {
          if (A.goNewRound && A.TRACKS['d' + n]) A.goNewRound(A.TRACKS['d' + n]);
        });
      });
    });

    /* 目录行 / 分组 / 翻页 / 抽屉 */
    document.addEventListener('click', function (e) {
      var el = e.target.closest ? e.target.closest('.toc-row') : null;
      if (el) {
        var day = el.getAttribute('data-day');
        var idx = parseInt(el.getAttribute('data-idx'), 10) || 0;
        closeDrawer();
        showDay(day, idx);
        return;
      }
      var g = e.target.closest ? e.target.closest('.toc-g') : null;
      if (g) {
        var d = g.getAttribute('data-day');
        COLL[d] = !COLL[d];
        paintToc();
      }
    });

    var prev = document.getElementById('prevBtn');
    var next = document.getElementById('nextBtn');
    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (next) next.addEventListener('click', function () { step(1); });

    /* 讲解 / 练习 tab：不销毁卡片，只切当前视图并滚到对应区块 */
    var tabL = document.getElementById('tabLearn');
    var tabP = document.getElementById('tabPractice');
    function setTab(which) {
      var learn = which === 'learn';
      if (tabL) {
        tabL.classList.toggle('on', learn);
        tabL.setAttribute('aria-selected', learn ? 'true' : 'false');
      }
      if (tabP) {
        tabP.classList.toggle('on', !learn);
        tabP.setAttribute('aria-selected', learn ? 'false' : 'true');
      }
      var target = learn ? document.getElementById(ST.day)
        : document.getElementById('practice' + ST.day.slice(3));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (tabL) tabL.addEventListener('click', function () { setTab('learn'); });
    if (tabP) tabP.addEventListener('click', function () { setTab('practice'); });

    /* 右栏主按钮：与底部「下一张」同一套逻辑 */
    var railBtn = document.getElementById('railNext');
    if (railBtn) railBtn.addEventListener('click', function () { step(1); });

    var bell = document.getElementById('tnBell');
    if (bell) bell.addEventListener('click', function () {
      toast('没有新通知。今天的 ' + cardCount(ST.day) + ' 张卡在左侧目录里。');
    });

    var ov = document.getElementById('ovBtn');
    if (ov) ov.addEventListener('click', openDrawer);
    var dc = document.getElementById('drawerClose');
    if (dc) dc.addEventListener('click', closeDrawer);
    var dm = document.getElementById('drawerMask');
    if (dm) dm.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawerOpen()) closeDrawer();
    });

    /* 顶部导航与任意 #day / #task / #practice 锚点 */
    document.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;
      var t = parseHash(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      try { history.replaceState(null, '', a.getAttribute('href')); } catch (err) {}
      navTo(t);
    });

    window.addEventListener('hashchange', function () {
      var t = parseHash();
      if (t) navTo(t);
    });

    /* 首帧：默认 Day 1 第 1 张；带深链则按深链定位 */
    var t0 = parseHash();
    ensureDay('day1').then(function () {
      if (t0) return navTo(t0);
      return showDay('day1', 0);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  /* 供控制台/测试按需装载某一天 */
  if (A) {
    A.ensureDay = ensureDay;
    A.ensureBank = ensureBank;
    A.showDay = showDay;
    A.showCard = showCard;
    A.state = ST;
  }
})();
