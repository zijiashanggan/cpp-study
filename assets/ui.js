/* C++ 前三天 · 页面装载、卡片渲染、关卡进度 */
(function () {
  'use strict';

  var A = window.CppApp || {};
  var SYL = window.SYLLABUS || [];
  var loaded = {};
  var loading = {};
  var started = {};

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
  function setLv(cardId, lv, on) {
    var o = lvOf(cardId);
    if (on) o[lv] = 1; else delete o[lv];
    LV[cardId] = o;
    writeJson(LV_STORE, LV);
    paintCard(cardId);
    paintDayProg(dayOfCard(cardId));
  }
  function isPassed(cardId) {
    var o = lvOf(cardId);
    return !!(o.read && o.do && o.quiz);
  }
  function dayOfCard(cardId) {
    var m = /^d(\d)c/.exec(cardId);
    return m ? 'day' + m[1] : '';
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

  function ensureBank(day) {
    var B = window.BANKS || {};
    if (B[day]) {
      A.mergeBank && A.mergeBank(day, B[day]);
      return Promise.resolve();
    }
    var meta = SYL.filter(function (x) { return x.id === day; })[0];
    if (!meta) return Promise.resolve();
    return loadScript(meta.bank).then(function () {
      return waitFor(function () { return (window.BANKS || {})[day]; });
    }).then(function () {
      var BB = window.BANKS || {};
      if (BB[day]) A.mergeBank && A.mergeBank(day, BB[day]);
    });
  }

  function ensureDay(day) {
    if (loaded[day]) return Promise.resolve();
    if (loading[day]) return loading[day];
    var meta = SYL.filter(function (x) { return x.id === day; })[0];
    if (!meta) return Promise.resolve();
    loading[day] = loadScript(meta.data).then(function () {
      return waitFor(function () { return (window.DAYS || {})[day]; });
    }).then(function () {
      var data = (window.DAYS || {})[day];
      if (!data) throw new Error('缺数据：' + day);
      renderDay(data);
      loaded[day] = true;
      delete loading[day];
      return ensureBank(day);
    }).then(function () {
      if (A.TRACKS && A.TRACKS['d' + day.slice(3)] && !started[day]) {
        started[day] = true;
        A.startRound(A.TRACKS['d' + day.slice(3)]);
      }
    }).catch(function (e) {
      delete loading[day];
      console.error(e);
    });
    return loading[day];
  }

  /* ---------------- 渲染 ---------------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function codeHtml(code) {
    return '<pre class="code"><code>' + A.hl(code) + '</code></pre>';
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

  function renderDay(day) {
    var mount = document.getElementById('mount-' + day.id);
    if (!mount) return;
    var h = [];
    h.push('<div class="sec-title" id="' + day.id + '">' + day.title +
      '<span class="day-prog" id="prog-' + day.id + '"></span></div>');
    if (day.desc) h.push('<p class="sec-desc">' + day.desc + '</p>');
    day.cards.forEach(function (c) { h.push(cardHtml(c)); });

    if (day.tasks && day.tasks.length) {
      h.push('<div class="sec-title" id="task' + day.id.slice(3) + '">' + day.taskTitle + '</div>');
      if (day.taskDesc) h.push('<p class="sec-desc">' + day.taskDesc + '</p>');
      day.tasks.forEach(function (t) { h.push(taskHtml(t)); });
    }
    if (day.gloss) {
      h.push('<div class="gloss">' + day.gloss.html + '</div>');
    }
    mount.innerHTML = h.join('\n');

    A.aiAttachCards && A.aiAttachCards();
    paintDayProg(day.id);
  }

  function paintDayProg(day) {
    var el = document.getElementById('prog-' + day);
    if (!el) return;
    var cards = document.querySelectorAll('#mount-' + day + ' .card[data-card]');
    var n = cards.length, m = 0;
    Array.prototype.forEach.call(cards, function (c) {
      if (isPassed(c.getAttribute('data-card'))) m++;
    });
    el.textContent = '今天 ' + n + ' 张，已过 ' + m + ' 张';
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

  /* ---------------- 首屏与懒加载 ---------------- */
  function targetDayFromHash() {
    var h = (location.hash || '').replace('#', '');
    var m = /^(day|task|practice)(\d)$/.exec(h);
    return m ? 'day' + m[2] : '';
  }

  function jumpTo(hash) {
    var el = document.getElementById(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function boot() {
    /* 顶部按钮：确保当天已经装载 */
    [1, 2, 3].forEach(function (n) {
      var top = document.getElementById('againTop' + n);
      if (top) top.addEventListener('click', function () {
        ensureDay('day' + n).then(function () {
          if (A.goNewRound && A.TRACKS['d' + n]) A.goNewRound(A.TRACKS['d' + n]);
        });
      });
    });

    /* 导航与任意锚点：如果那天还没装载，先装载再跳 */
    document.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;
      var hash = a.getAttribute('href').slice(1);
      var m = /^(day|task|practice)(\d)$/.exec(hash);
      if (!m) return;
      e.preventDefault();
      Promise.resolve(ensureDay('day' + m[2])).then(function () {
        if (location.hash !== '#' + hash) history.replaceState(null, '', '#' + hash);
        setTimeout(function () { jumpTo(hash); }, 30);
      });
    });

    window.addEventListener('hashchange', function () {
      var d = targetDayFromHash();
      if (d) ensureDay(d).then(function () { setTimeout(function () { jumpTo(location.hash.slice(1)); }, 30); });
    });

    /* 先装 Day 1，再用观察器按需装 Day 2 / Day 3 */
    ensureDay('day1').then(function () {
      var d = targetDayFromHash();
      if (d) return ensureDay(d).then(function () { setTimeout(function () { jumpTo(location.hash.slice(1)); }, 30); });
    });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var id = en.target.id.replace('mount-', '');
          ensureDay(id);
          io.unobserve(en.target);
        });
      }, { rootMargin: '900px 0px' });
      ['mount-day2', 'mount-day3'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) io.observe(el);
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  /* 供控制台/测试按需装载某一天 */
  if (A) { A.ensureDay = ensureDay; A.ensureBank = ensureBank; }
})();
