/* C++ 前三天 · 共用逻辑（题库、练习、AI 问答） */
(function () {
'use strict';

/* ============================================================
   代码高亮
   ============================================================ */
var KEY = ['int','void','const','return','using','namespace','static','class','struct','sizeof',
           'char','float','double','bool','unsigned','long','short','new','delete','true','false',
           'nullptr','for','while','if','else','break','continue','switch','case','default',
           'typedef','extern','include','explicit','operator'];
var TYP = ['std','cout','cin','endl','string','size_t','NULL'];

/* 名字后面紧跟 ( 才算函数名；再确认它前面的东西是类型/关键字/符号，
   避免把 Demo y(10) 里的 y 也当成函数名 */
var FN_PREV = /(?:^|[^\w])(?:void|int|char|float|double|bool|unsigned|long|short|static|const|auto|explicit|std)$/;

function isFnPos(before) {
  var s = before.slice(before.lastIndexOf('\n') + 1).replace(/\s+$/, '');
  if (!s) return true;                                  /* 行首：构造函数 / 定义 */
  if (/::|\.|->$/.test(s)) return true;                 /* 类内、成员调用 */
  if (/[=(,&|^!?+:;{}*]$/.test(s)) return true;         /* 表达式里直接调用 */
  return FN_PREV.test(s);                               /* void f( ... 返回类型后面 */
}

function hl(src) {
  var esc = src.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  var re = /(\/\/[^\n]*)|("(?:[^"\\\n]|\\.)*")|('(?:[^'\\\n]|\\.)*')|([A-Za-z_]\w*)(?=\s*\()|\b([A-Za-z_]\w*)\b|\b(\d+)\b/g;
  return esc.replace(re, function (m, c1, c2, c3, fn, word, num, offset, all) {
    if (c1) return '<span class="c">' + m + '</span>';
    if (c2 || c3) return '<span class="s">' + m + '</span>';
    if (fn) {
      if (KEY.indexOf(fn) > -1) return '<span class="k">' + m + '</span>';
      if (TYP.indexOf(fn) > -1) return '<span class="t">' + m + '</span>';
      if (isFnPos(all.slice(0, offset))) return '<span class="fn">' + m + '</span>';
      return m;
    }
    if (num) return '<span class="num">' + m + '</span>';
    if (word) {
      if (KEY.indexOf(word) > -1) return '<span class="k">' + m + '</span>';
      if (TYP.indexOf(word) > -1) return '<span class="t">' + m + '</span>';
    }
    return m;
  });
}

var BANK = { single: [], fill: [], judge: [], code: [] };

/* 把某一天的题库并进来（同一天重复加载会被忽略） */
function mergeBank(day, obj) {
  ['single', 'fill', 'judge', 'code'].forEach(function (type) {
    (obj[type] || []).forEach(function (b) {
      if (!BANK[type].some(function (x) { return x.id === b.id; })) BANK[type].push(b);
    });
  });
}


/* ============================================================
   随机抽题 / 打乱
   ============================================================ */
var LABEL = { single: '单选', fill: '填空', judge: '判断', code: '代码' };
var LETTERS = 'ABCDEFG';

function shuffle(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
  }
  return arr;
}

function sample(arr, n) {
  return shuffle(arr.slice()).slice(0, n);
}

/* 把题库里的原始题目加工成「本轮题目」：选项打乱 + 重算正确答案 + 解析跟着走 */
function prepare(base, type) {
  if (type === 'single') {
    var opts = shuffle(base.options.map(function (txt, i) {
      return { text: txt, ok: i === base.ans };
    }));
    var idx = 0;
    for (var k = 0; k < opts.length; k++) { if (opts[k].ok) { idx = k; break; } }
    return {
      key: base.id, type: 'single',
      q: base.q, code: base.code || '',
      options: opts, ansIdx: idx,
      answerText: opts[idx].text,
      why: base.why
    };
  }
  if (type === 'judge') {
    return {
      key: base.id, type: 'judge',
      q: base.q, code: base.code || '',
      ansIdx: base.ans,
      answerText: base.ans === 0 ? '对' : '错',
      why: base.why
    };
  }
  return {
    key: base.id, type: (type === 'code' ? 'code' : 'fill'),
    q: base.q, code: base.code || '',
    answers: base.answers,
    answerText: base.display,
    why: base.why
  };
}

/* 三套完全独立的练习：Day N 只抽 dayN 的题 */
var TRACKS = {
  d1: {
    id: 'd1', name: 'Day 1', day: 'day1',
    spec: { single: 8, fill: 4, judge: 3, code: 3 },
    dom: { list: 'qlist1', prog: 'stProg1', score: 'stScore1', rate: 'stRate1',
           sum: 'summary1', again: 'againBar1', root: 'practice1' },
    R: { list: [], ans: {}, draft: {}, startedAt: 0 }
  },
  d2: {
    id: 'd2', name: 'Day 2', day: 'day2',
    spec: { single: 6, fill: 3, judge: 2, code: 3 },
    dom: { list: 'qlist2', prog: 'stProg2', score: 'stScore2', rate: 'stRate2',
           sum: 'summary2', again: 'againBar2', root: 'practice2' },
    R: { list: [], ans: {}, draft: {}, startedAt: 0 }
  },
  d3: {
    id: 'd3', name: 'Day 3', day: 'day3',
    spec: { single: 7, fill: 3, judge: 3, code: 3 },
    dom: { list: 'qlist3', prog: 'stProg3', score: 'stScore3', rate: 'stRate3',
           sum: 'summary3', again: 'againBar3', root: 'practice3' },
    R: { list: [], ans: {}, draft: {}, startedAt: 0 }
  },
  d4: {
    id: 'd4', name: 'Day 4', day: 'day4',
    spec: { single: 7, fill: 3, judge: 3, code: 3 },
    dom: { list: 'qlist4', prog: 'stProg4', score: 'stScore4', rate: 'stRate4',
           sum: 'summary4', again: 'againBar4', root: 'practice4' },
    R: { list: [], ans: {}, draft: {}, startedAt: 0 }
  }
};

function dayOf(b) {
  if (b.day === 'day2' || b.day === 'day3' || b.day === 'day4') return b.day;
  return 'day1';
}

function startRound(t) {
  var ready = (window.CppApp && window.CppApp.ensureBank) ? window.CppApp.ensureBank(t.day) : Promise.resolve();
  ready.then(function () {
    var items = [];
    ['single', 'fill', 'judge', 'code'].forEach(function (type) {
      var pool = BANK[type].filter(function (b) { return dayOf(b) === t.day; });
      sample(pool, Math.min(t.spec[type], pool.length)).forEach(function (b) {
        items.push(prepare(b, type));
      });
    });
    t.R = { list: shuffle(items), ans: {}, draft: {}, startedAt: Date.now() };
    render(t);
  });
}

/* ============================================================
   渲染
   ============================================================ */
function norm(s) {
  if (s === null || s === undefined) return '';
  s = String(s).trim().toLowerCase();
  s = s.replace(/[\uFF01-\uFF5E]/g, function (ch) {
    return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0);
  });
  return s.replace(/\s+/g, '');
}

/* 代码题专用的宽松比较：忽略大小写、空白、分号、全角符号 */
function normCode(s) {
  if (s === null || s === undefined) return '';
  s = String(s);
  s = s.replace(/[\uFF01-\uFF5E]/g, function (ch) {
    return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0);
  });
  s = s.replace(/\u3000/g, ' ');
  return s.toLowerCase().replace(/\s+/g, '').replace(/;/g, '');
}

function stripHtml(s) {
  var d = document.createElement('div');
  d.innerHTML = String(s).replace(/<br\s*\/?>/gi, ' ');
  return (d.textContent || '').replace(/\s+/g, ' ').trim();
}

function buildQ(t, p, i) {
  var st = t.R.ans[p.key];
  var card = document.createElement('div');
  card.className = 'q';

  var head = document.createElement('div');
  head.className = 'q-head';
  head.innerHTML = '<span class="badge b-' + p.type + '">' + LABEL[p.type] + '</span>' +
                   '<span class="q-idx">第 ' + (i + 1) + ' 题</span>';
  card.appendChild(head);

  var text = document.createElement('div');
  text.className = 'q-text';
  text.innerHTML = p.q;
  card.appendChild(text);

  if (p.code) {
    var pre = document.createElement('pre');
    pre.className = 'code';
    pre.innerHTML = '<code>' + hl(p.code) + '</code>';
    card.appendChild(pre);
  }

  var body = document.createElement('div');
  body.className = 'q-body';
  card.appendChild(body);

  if (p.type === 'single') {
    p.options.forEach(function (opt, k) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'opt';
      btn.innerHTML = '<span class="ok">' + LETTERS[k] + '.</span>' + opt.text;
      if (st) {
        btn.disabled = true;
        if (k === p.ansIdx) btn.classList.add('correct');
        else if (k === st.user) btn.classList.add('wrong');
      } else {
        btn.addEventListener('click', function () { pick(t, p, k); });
      }
      body.appendChild(btn);
    });
  } else if (p.type === 'judge') {
    var row = document.createElement('div');
    row.style.display = 'flex';
    row.style.gap = '10px';
    ['对', '错'].forEach(function (opt, k) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'opt';
      btn.style.margin = '8px 0 0';
      btn.style.textAlign = 'center';
      btn.textContent = opt;
      if (st) {
        btn.disabled = true;
        if (k === p.ansIdx) btn.classList.add('correct');
        else if (k === st.user) btn.classList.add('wrong');
      } else {
        btn.addEventListener('click', function () { pick(t, p, k); });
      }
      row.appendChild(btn);
    });
    body.appendChild(row);
  } else {
    if (p.type === 'code') {
      var ctip = document.createElement('div');
      ctip.className = 'code-tip';
      ctip.textContent = '把 ____ 处该填的内容写进输入框：分号、空格、大小写都不计较。';
      body.appendChild(ctip);
    }
    var frow = document.createElement('div');
    frow.className = 'fill-row';
    var inp = document.createElement('input');
    inp.type = 'text';
    inp.placeholder = p.type === 'code' ? '填入空白处的代码，回车提交' : '输入答案，回车提交';
    inp.value = st ? st.raw : (t.R.draft[p.key] || '');
    inp.addEventListener('input', function () { t.R.draft[p.key] = inp.value; });
    if (st) {
      inp.disabled = true;
      inp.classList.add(st.ok ? 'correct' : 'wrong');
    } else {
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') submitFill(t, p, inp.value);
      });
    }
    var sbtn = document.createElement('button');
    sbtn.type = 'button';
    sbtn.className = 'submit';
    sbtn.textContent = st ? '已提交' : '提交';
    if (st) sbtn.disabled = true;
    else sbtn.addEventListener('click', function () { submitFill(t, p, inp.value); });
    frow.appendChild(inp);
    frow.appendChild(sbtn);
    body.appendChild(frow);
  }

  var slot = document.createElement('div');
  slot.className = 'fb-slot';
  card.appendChild(slot);

  if (st) {
    slot.innerHTML =
      '<div class="fb ' + (st.ok ? 'ok' : 'no') + '">' +
        '<div class="head">' + (st.ok ? '✓ 答对了' : '✗ 答错了') + '</div>' +
        (st.ok ? '' : '<div class="ansline">正确答案：<b>' + p.answerText + '</b></div>') +
        '<div class="why">' + p.why + '</div>' +
      '</div>';

    /* 答错就地给一个「问问为什么」，题干/选项/正确答案/错选一起交给 AI */
    if (!st.ok) {
      var askWrap = document.createElement('div');
      askWrap.className = 'aiwrap';
      var askBtn = document.createElement('button');
      askBtn.type = 'button';
      askBtn.className = 'aibtn';
      askBtn.textContent = '问问为什么';
      var askHost = document.createElement('div');
      askWrap.appendChild(askBtn);
      askWrap.appendChild(askHost);
      slot.appendChild(askWrap);
      askBtn.addEventListener('click', function () {
        if (askHost.getAttribute('data-open') === '1') {
          askHost.innerHTML = '';
          askHost.removeAttribute('data-open');
          askBtn.textContent = '问问为什么';
          return;
        }
        askHost.setAttribute('data-open', '1');
        askBtn.textContent = '收起';
        var idx = t.R.list.indexOf(p) + 1;
        aiMount(askHost, aiWrongCtx(p, idx, st), '这道题我为什么错了？正确答案为什么对？',
                '上下文已带上：题干、全部选项、正确答案、你的错选和原解析。');
      });
    }
  }
  return card;
}

function pick(t, p, k) {
  var ok = (k === p.ansIdx);
  var userText = (p.type === 'judge')
    ? (k === 0 ? '对' : '错')
    : (LETTERS[k] + '. ' + stripHtml(p.options[k].text));
  t.R.ans[p.key] = { ok: ok, user: k, userText: userText, raw: '' };
  if (window.WrongBook) WrongBook.record(p.key, ok);   /* 答错进错题本，连对两次出队 */
  render(t);
}

function submitFill(t, p, val) {
  var slot = document.querySelector('[data-slot="' + p.key + '"]');
  if (norm(val) === '') {
    if (slot) slot.innerHTML = '<div class="hint">先写点什么再提交。</div>';
    return;
  }
  var v = norm(val);
  var ok = p.answers.some(function (a) {
    return p.type === 'code' ? normCode(a) === normCode(val) : norm(a) === v;
  });
  t.R.ans[p.key] = { ok: ok, user: val, userText: val, raw: val };
  if (window.WrongBook) WrongBook.record(p.key, ok);
  render(t);
}

function render(t) {
  var list = document.getElementById(t.dom.list);
  list.innerHTML = '';
  t.R.list.forEach(function (p, i) {
    var card = buildQ(t, p, i);
    card.querySelector('.fb-slot').setAttribute('data-slot', p.key);
    list.appendChild(card);
  });
  updateStats(t);
  updateSummary(t);
}

function updateStats(t) {
  var total = t.R.list.length;
  var done = Object.keys(t.R.ans).length;
  var right = t.R.list.filter(function (p) { return t.R.ans[p.key] && t.R.ans[p.key].ok; }).length;
  document.getElementById(t.dom.prog).textContent = done + ' / ' + total;
  document.getElementById(t.dom.score).textContent = right;
  document.getElementById(t.dom.rate).textContent = done ? Math.round(right / done * 100) + '%' : '—';
  var allDone = 0, allTotal = 0;
  Object.keys(TRACKS).forEach(function (k) {
    allDone += Object.keys(TRACKS[k].R.ans).length;
    allTotal += TRACKS[k].R.list.length;
  });
  document.getElementById('bar').style.width = (allTotal ? allDone / allTotal * 100 : 0) + '%';
}

function updateSummary(t) {
  var box = document.getElementById(t.dom.sum);
  var total = t.R.list.length;
  var done = Object.keys(t.R.ans).length;
  var right = t.R.list.filter(function (p) { return t.R.ans[p.key] && t.R.ans[p.key].ok; }).length;
  var wrong = t.R.list.filter(function (p) { return t.R.ans[p.key] && !t.R.ans[p.key].ok; });

  if (done < total) {
    box.className = '';
    box.innerHTML = '';
    return;
  }

  var html = '<div class="sum-card">';
  html += '<h3>' + t.name + ' 练习：' + (wrong.length === 0 ? '全部答对，收工。' : '这一轮做完了') + '</h3>';
  html += '<div class="sum-score">对 <b>' + right + '</b> 道，错 <b style="color:#ff7b72">' + wrong.length +
          '</b> 道　（本轮 ' + total + ' 题，得分 ' + right + ' / ' + total +
          '，正确率 ' + Math.round(right / total * 100) + '%）</div>';

  if (wrong.length === 0) {
    html += '<p class="sum-note">' + t.name + ' 这一套你已经拿下了。点「再来一轮」换一批题再验一遍，或者往上回去看另一天的练习。</p>';
  } else {
    html += '<p class="sum-note">下面是「' + t.name + '」这一轮的错题，先看解析再重做（只影响 ' + t.name + ' 这套，另一套不受影响）。</p>';
    html += '<div class="wrong-head"><span>' + t.name + ' 本轮错题（' + wrong.length + ' 道）</span>' +
            '<button type="button" class="btn-ghost" data-export="1">导出错题报告</button></div>';
    html += '<ul class="wrong-list">';
    wrong.forEach(function (p, wi) {
      var idx = t.R.list.indexOf(p) + 1;
      var raw = stripHtml(p.q);
      if (raw.length > 46) raw = raw.slice(0, 46) + '…';
      var st = t.R.ans[p.key];
      html += '<li>' +
                '<div class="wq">' + idx + '. ' + raw + '</div>' +
                '<div class="wa">你的答案：<span class="bad">' + st.userText + '</span>　' +
                '正确：<span class="good">' + p.answerText + '</span></div>' +
                '<div class="ww">' + p.why + '</div>' +
                '<div class="aiwrap"><button type="button" class="aibtn" data-wq="' + wi + '">问问为什么</button>' +
                '<div class="aihost"></div></div>' +
              '</li>';
    });
    html += '</ul>';
  }

  html += '<p class="sum-tip">把导出的错题报告直接发给老师就行：题干、全部选项、你选了什么、正确答案和解析都在里面。</p>';

  html += '<div class="btn-row">';
  if (wrong.length > 0) {
    html += '<button class="btn-main" id="redo' + t.id + '">重做错题（' + wrong.length + ' 道）</button>';
  }
  html += '<button class="btn-main" id="againSum' + t.id + '">再来一轮</button>';
  html += '<button class="btn-ghost" type="button" data-export="1">导出错题报告</button>';
  html += '</div>';

  html += '<div class="notice" id="notice' + t.id + '"></div>';
  html += '<div class="export" id="exportBox' + t.id + '"></div>';
  html += '</div>';

  box.className = 'show';
  box.innerHTML = html;

  /* 错题里的「问问为什么」：把题干、选项、正确答案、你的错选一起交给 AI */
  Array.prototype.forEach.call(box.querySelectorAll('[data-wq]'), function (btn) {
    btn.addEventListener('click', function () {
      var wi = parseInt(btn.getAttribute('data-wq'), 10);
      var p = wrong[wi];
      if (!p) return;
      var host = btn.parentNode.querySelector('.aihost');
      if (host.getAttribute('data-open') === '1') {
        host.innerHTML = '';
        host.removeAttribute('data-open');
        btn.textContent = '问问为什么';
        return;
      }
      host.setAttribute('data-open', '1');
      btn.textContent = '收起';
      var idx = t.R.list.indexOf(p) + 1;
      aiMount(host, aiWrongCtx(p, idx, t.R.ans[p.key]),
              '这道题我为什么错了？正确答案为什么对？',
              '上下文已带上：题干、全部选项、正确答案、你的错选和原解析。');
    });
  });

  var redo = document.getElementById('redo' + t.id);
  if (redo) {
    redo.addEventListener('click', function () {
      // 只保留这一套的错题，重新随机排序（选项也重新打乱）
      var items = wrong.map(function (p) { return prepare(findBase(p), p.type); });
      t.R = { list: shuffle(items), ans: {}, draft: {}, startedAt: Date.now() };
      render(t);
      document.getElementById(t.dom.root).scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
  var again = document.getElementById('againSum' + t.id);
  if (again) again.addEventListener('click', function () { goNewRound(t); });

  Array.prototype.forEach.call(box.querySelectorAll('[data-export]'), function (btn) {
    btn.addEventListener('click', function () { openExport(t); });
  });
}

/* ============================================================
   导出错题报告（Markdown，纯本地能力）
   ============================================================ */
function pad2(n) { return (n < 10 ? '0' : '') + n; }

function todayStr() {
  var d = new Date();
  return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
}

function fmtDuration(ms) {
  var s = Math.max(0, Math.round(ms / 1000));
  var m = Math.floor(s / 60);
  s = s % 60;
  return m > 0 ? (m + ' 分 ' + s + ' 秒') : (s + ' 秒');
}

function rightAnswerLine(p) {
  if (p.type === 'fill' || p.type === 'code') return stripHtml(p.answerText);
  if (p.type === 'judge') return p.ansIdx === 0 ? '对' : '错';
  return LETTERS[p.ansIdx] + '. ' + stripHtml(p.options[p.ansIdx].text);
}

function buildReport(t, wrong) {
  var total = t.R.list.length;
  var right = t.R.list.filter(function (p) { return t.R.ans[p.key] && t.R.ans[p.key].ok; }).length;
  var L = [];

  L.push('# ' + t.name + ' 练习 · 错题报告');
  L.push('');
  L.push('- 日期：' + todayStr());
  L.push('- 练习范围：' + t.name + ' 题库（只含 ' + t.name + ' 的题）');
  L.push('- 本轮题量：' + total + ' 题（答对 ' + right + ' 题，答错 ' + wrong.length + ' 题）');
  L.push('- 得分：' + right + ' / ' + total + '（正确率 ' + Math.round(right / total * 100) + '%）');
  if (t.R.startedAt) L.push('- 用时：' + fmtDuration(Date.now() - t.R.startedAt));
  L.push('');
  L.push('> 本报告由「C++ 学习页」的 ' + t.name + ' 练习区自动生成，可直接交给老师看。');
  L.push('');

  wrong.forEach(function (p, i) {
    var st = t.R.ans[p.key];
    L.push('---');
    L.push('');
    L.push('## ' + (i + 1) + '. [' + LABEL[p.type] + '] ' + stripHtml(p.q));
    L.push('');

    if (p.code) {
      L.push('```cpp');
      L.push(p.code);
      L.push('```');
      L.push('');
    }

    if (p.type === 'fill' || p.type === 'code') {
      L.push('- 你的答案：`' + String(st.raw || '（空）') + '`');
      L.push('- 标准答案：`' + stripHtml(p.answerText) + '`');
      L.push('');
    } else {
      var opts = (p.type === 'judge')
        ? ['对', '错']
        : p.options.map(function (o) { return o.text; });
      var rightIdx = p.ansIdx;

      L.push('**全部选项：**');
      L.push('');
      opts.forEach(function (txt, k) {
        var label = (p.type === 'judge') ? txt : (LETTERS[k] + '. ' + stripHtml(txt));
        var mark = '';
        if (k === rightIdx) mark += '　← ✅ 正确答案';
        if (k === st.user) mark += '　← ❌ 你的选择';
        L.push('- ' + label + mark);
      });
      L.push('');
      L.push('- 你的答案：' + String(st.userText || ''));
      L.push('- 正确答案：' + rightAnswerLine(p));
      L.push('');
    }

    L.push('**解析：**' + stripHtml(p.why));
    L.push('');
  });

  L.push('---');
  L.push('');
  L.push('（共 ' + wrong.length + ' 道错题）');
  L.push('');
  return L.join('\n');
}

function showNotice(t, msg) {
  var n = document.getElementById('notice' + t.id);
  if (!n) return;
  n.textContent = msg;
  n.className = 'notice show';
  clearTimeout(showNotice._t);
  showNotice._t = setTimeout(function () {
    n.className = 'notice';
  }, 3200);
}

function openExport(t) {
  var wrong = t.R.list.filter(function (p) { return t.R.ans[p.key] && !t.R.ans[p.key].ok; });

  if (wrong.length === 0) {
    showNotice(t, '本轮全对，没有错题');
    return;
  }

  var box = document.getElementById('exportBox' + t.id);
  if (!box) return;

  box.innerHTML =
    '<div class="export-head">' + t.name + ' 错题报告（Markdown）<span class="export-meta">' + wrong.length + ' 道错题</span></div>' +
    '<textarea id="exportText' + t.id + '" readonly spellcheck="false"></textarea>' +
    '<div class="btn-row">' +
      '<button type="button" class="btn-main" id="copyBtn' + t.id + '">复制到剪贴板</button>' +
      '<button type="button" class="btn-main" id="dlBtn' + t.id + '">下载 .md 文件</button>' +
      '<button type="button" class="btn-ghost" id="hideExport' + t.id + '">收起</button>' +
    '</div>' +
    '<div class="export-tip" id="exportTip' + t.id + '"></div>';

  document.getElementById('exportText' + t.id).value = buildReport(t, wrong);
  box.className = 'export show';

  document.getElementById('copyBtn' + t.id).addEventListener('click', function () { copyReport(t); });
  document.getElementById('dlBtn' + t.id).addEventListener('click', function () { downloadReport(t); });
  document.getElementById('hideExport' + t.id).addEventListener('click', function () {
    box.className = 'export';
  });

  box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function exportTip(t, text, cls) {
  var tip = document.getElementById('exportTip' + t.id);
  if (!tip) return;
  tip.textContent = text;
  tip.className = 'export-tip ' + (cls || '');
}

function copyReport(t) {
  var ta = document.getElementById('exportText' + t.id);
  if (!ta) return;
  var text = ta.value;

  function done() { exportTip(t, '已复制，直接粘贴给老师就行。', 'ok'); }

  function manual() {
    ta.focus();
    ta.select();
    var copied = false;
    try { copied = document.execCommand('copy'); } catch (e) { copied = false; }
    if (copied) done();
    else exportTip(t, '浏览器不让自动复制，内容已经选中了，按 Ctrl+C（Mac 按 Command+C）手动复制即可。', 'warn');
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done, manual);
  } else {
    manual();
  }
}

function downloadReport(t) {
  var ta = document.getElementById('exportText' + t.id);
  if (!ta) return;
  var name = t.name.replace(/\s+/g, '') + '_错题报告_' + todayStr() + '.md';
  var blob = new Blob([ta.value], { type: 'text/markdown;charset=utf-8' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
  exportTip(t, '已下载：' + name, 'ok');
}

function findBase(p) {
  var arr = BANK[p.type];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].id === p.key) return arr[i];
  }
  return null;
}

function goNewRound(t) {
  startRound(t);
  document.getElementById(t.dom.root).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ============================================================
   AI 问答（和函数卡页面共用同一份配置 cpp_ai_cfg_v1）
   ============================================================ */
var AI_STORE = 'cpp_ai_cfg_v1';
var AI_PRESETS = [
  { id:'ollama',      name:'Ollama（本机）', base:'http://localhost:11434/v1',                        model:'qwen2.5:3b' },
  { id:'deepseek',    name:'DeepSeek',      base:'https://api.deepseek.com/v1',                        model:'deepseek-chat' },
  { id:'dashscope',   name:'通义千问',       base:'https://dashscope.aliyuncs.com/compatible-mode/v1', model:'qwen-plus' },
  { id:'siliconflow', name:'硅基流动',       base:'https://api.siliconflow.cn/v1',                     model:'Qwen/Qwen2.5-7B-Instruct' },
  { id:'custom',      name:'自定义',         base:'',                                                 model:'' }
];
var AI_TIMEOUT = 90000;      /* 本机 Ollama 冷启动首字实测约 55 秒，25 秒必然超时 */
var AI_MAX_CONTEXT = 2600;
var AI_BUSY = false;
var AI_ABORT = null;

var AICFG = (function () {
  var d = { p:'deepseek', base:'https://api.deepseek.com/v1', model:'deepseek-chat', key:'' };
  try {
    var raw = localStorage.getItem(AI_STORE);
    if (raw) {
      var o = JSON.parse(raw);
      if (o && typeof o === 'object') {
        d.p = o.p || d.p;
        d.base = typeof o.base === 'string' && o.base ? o.base : d.base;
        d.model = typeof o.model === 'string' && o.model ? o.model : d.model;
        d.key = typeof o.key === 'string' ? o.key : '';
      }
    }
  } catch (e) {}
  return d;
})();

function aiPreset(id) {
  for (var i = 0; i < AI_PRESETS.length; i++) if (AI_PRESETS[i].id === id) return AI_PRESETS[i];
  return AI_PRESETS[1];
}
function aiName() { return aiPreset(AICFG.p).name; }
function aiSaveCfg() {
  try { localStorage.setItem(AI_STORE, JSON.stringify(AICFG)); } catch (e) {}
}
function aiIsMobile() {
  return /Android|iPhone|iPad|iPod|Mobile|HarmonyOS/i.test(navigator.userAgent || '') ||
    !!(window.matchMedia && window.matchMedia('(max-width:640px)').matches);
}
function aiNowText() {
  return '当前：' + aiName() + ' · ' + (AICFG.model || '没填模型') + ' · ' +
    (AICFG.key ? 'key 已保存在本机' : '还没填 key') + ' · 超时 90 秒';
}

function paintAiCfg() {
  var chips = document.getElementById('aiPresets');
  chips.innerHTML = '';
  AI_PRESETS.forEach(function (pr) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'pbtn' + (pr.id === AICFG.p ? ' on' : '');
    b.textContent = pr.name;
    b.addEventListener('click', function () {
      AICFG.p = pr.id;
      if (pr.id !== 'custom') { AICFG.base = pr.base; AICFG.model = pr.model; }
      if (pr.id === 'ollama') { if (!AICFG.key) AICFG.key = 'ollama'; }
      else if (AICFG.key === 'ollama') { AICFG.key = ''; }
      aiSaveCfg();
      paintAiCfg();
    });
    chips.appendChild(b);
  });
  document.getElementById('aiBase').value = AICFG.base;
  document.getElementById('aiModel').value = AICFG.model;
  document.getElementById('aiKey').value = AICFG.key;
  document.getElementById('aiKeyState').textContent = AICFG.key
    ? (AICFG.p === 'ollama' ? '本机 Ollama 不校验 key，填 ollama 就行。' : 'key 已保存，和函数卡页面共用同一份。')
    : '还没填 key。';
  document.getElementById('aiMobileNote').className =
    'ainote-warn' + ((AICFG.p === 'ollama' && aiIsMobile()) ? '' : ' hidden');
  document.getElementById('aiOllamaNote').className =
    'ainote-box' + (AICFG.p === 'ollama' ? '' : ' hidden');
  document.getElementById('aiNow').textContent = aiNowText();
}
function openAiCfg() {
  paintAiCfg();
  document.getElementById('aiMask').className = 'aimask';
}
function closeAiCfg() {
  document.getElementById('aiMask').className = 'aimask hidden';
}

function aiAddMsg(box, role, content, extra, asHtml) {
  var log = box.querySelector('.chatlog');
  if (!log) return null;
  var d = document.createElement('div');
  d.className = 'msg ' + role + (extra ? ' ' + extra : '');
  if (role === 'ai') {
    var who = document.createElement('span');
    who.className = 'who';
    who.textContent = aiName() + ' · ' + AICFG.model;
    d.appendChild(who);
  }
  if (asHtml) {
    var sp = document.createElement('span');
    sp.innerHTML = content;
    d.appendChild(sp);
  } else {
    d.appendChild(document.createTextNode(content));
  }
  log.appendChild(d);
  log.scrollTop = log.scrollHeight;
  return d;
}

function aiRefreshCnt(box) {
  var c = box.querySelector('.chatbar .cnt');
  if (!c) return;
  var n = Math.floor(box._history.length / 2);
  c.textContent = n ? '已保留 ' + n + ' / 5 轮对话' : '还没有对话';
}

function aiNeedCfg(box, prefix) {
  var el = aiAddMsg(box, 'ai',
    (prefix || '还没填 API Key。') +
    ' 点 <button type="button" class="linkbtn" data-cfg="1">这里去设置</button> 填一下' +
    '（和函数卡页面共用同一份配置，那边填过这边就能直接用）。', 'err', true);
  var b = el && el.querySelector('[data-cfg]');
  if (b) b.addEventListener('click', openAiCfg);
}

/* 把一张知识卡的标题、要点、代码、术语对照整段抽出来当上下文 */
function aiCardCtx(card) {
  var clone = card.cloneNode(true);
  var w = clone.querySelector('.aiwrap');
  if (w) w.parentNode.removeChild(w);
  var out = [];
  Array.prototype.forEach.call(clone.querySelectorAll('h3, pre, p, li'), function (el) {
    var t = (el.textContent || '').replace(/[ \t]+/g, ' ').replace(/\s+/g, ' ').trim();
    if (!t) return;
    if (el.tagName === 'H3') out.push('【卡片】' + t.replace(/^\d+\s*/, ''));
    else if (el.tagName === 'PRE') out.push('【代码】\n' + (el.textContent || '').replace(/^\s+|\s+$/g, ''));
    else if (el.classList.contains('terms')) out.push('【术语对照】' + t.replace(/^术语对照：/, ''));
    else if (el.classList.contains('keep')) out.push('【记住】' + t.replace(/^记住这句就行：/, ''));
    else if (el.classList.contains('concl')) out.push('【一句话】' + t);
    else if (el.tagName === 'LI') out.push('· ' + t);
    else out.push(t);
  });
  var s = out.join('\n');
  if (s.length > AI_MAX_CONTEXT) s = s.slice(0, AI_MAX_CONTEXT) + '\n…（卡片较长，后文已截断）';
  return s;
}

/* 错题上下文：题干、全部选项、正确答案、你的错选、原解析 */
function aiWrongCtx(p, idx, st) {
  var L = [];
  L.push('【题型】' + (LABEL[p.type] || p.type) + '题　第 ' + idx + ' 题');
  L.push('【题干】' + stripHtml(p.q));
  if (p.code) L.push('【代码】\n' + p.code);
  if (p.type === 'single' && p.options) {
    L.push('【选项】');
    p.options.forEach(function (o, i) {
      L.push('  ' + String.fromCharCode(65 + i) + '. ' + stripHtml(o.text));
    });
  } else if (p.type === 'judge') {
    L.push('【选项】A. 对　B. 错');
  }
  L.push('【正确答案】' + stripHtml(p.answerText));
  L.push('【我的错选】' + stripHtml(st && st.userText ? st.userText : '（空）'));
  L.push('【原解析】' + stripHtml(p.why));
  return L.join('\n');
}

function aiMount(host, ctx, presetQ, note) {
  host.innerHTML = '';
  var box = document.createElement('div');
  box.className = 'aibox';
  box._ctx = ctx;
  box._history = [];       /* [{role,content}...]，只留最近 5 轮 */
  box._failQ = '';         /* 上次失败的问题，重试时不重复贴气泡 */
  box._errEl = null;

  var log = document.createElement('div');
  log.className = 'chatlog';

  var row = document.createElement('div');
  row.className = 'airow';
  var inp = document.createElement('input');
  inp.className = 'aiq';
  inp.type = 'text';
  inp.maxLength = 300;
  inp.setAttribute('placeholder', '继续追问，回车发送');
  var send = document.createElement('button');
  send.type = 'button';
  send.className = 'aibtn send primary';
  send.textContent = '发送';
  row.appendChild(inp);
  row.appendChild(send);

  var bar = document.createElement('div');
  bar.className = 'chatbar';
  var cnt = document.createElement('span');
  cnt.className = 'cnt';
  var clear = document.createElement('button');
  clear.type = 'button';
  clear.className = 'aibtn';
  clear.textContent = '清空对话';
  bar.appendChild(cnt);
  bar.appendChild(clear);

  box.appendChild(log);
  box.appendChild(row);
  box.appendChild(bar);

  var noteEl = document.createElement('div');
  noteEl.className = 'ainote';
  noteEl.innerHTML = note +
    ' 每次只把最近 5 轮对话和这段内容发给模型，消耗的是你自己的 key 额度。' +
    ' <button type="button" class="linkbtn" data-cfg="1">AI 设置</button>';
  box.appendChild(noteEl);

  if (AICFG.p === 'ollama' && aiIsMobile()) {
    var warn = document.createElement('div');
    warn.className = 'ainote-warn';
    warn.textContent = '手机上选 Ollama 连不到电脑的 localhost（手机的 localhost 是手机自己）。请改用云端服务商并填 key。';
    box.appendChild(warn);
  }

  host.appendChild(box);
  aiRefreshCnt(box);

  var cfgBtn = noteEl.querySelector('[data-cfg]');
  if (cfgBtn) cfgBtn.addEventListener('click', openAiCfg);
  send.addEventListener('click', function () { aiAsk(box); });
  inp.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); aiAsk(box); }
  });
  /* 手机上键盘弹起时把输入框滚到可视区中间，别被挡住 */
  inp.addEventListener('focus', function () {
    setTimeout(function () {
      try { inp.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
      catch (e) { inp.scrollIntoView(); }
    }, 250);
  });
  clear.addEventListener('click', function () {
    if (AI_BUSY) return;
    box._history = [];
    box._failQ = '';
    box._errEl = null;
    log.innerHTML = '';
    aiRefreshCnt(box);
    inp.value = '';
    send.textContent = '发送';
    inp.focus();
  });

  if (presetQ) { inp.value = presetQ; aiAsk(box); }
  else inp.focus();
}

function aiAsk(box) {
  var log = box.querySelector('.chatlog');
  var btn = box.querySelector('.aibtn.send');
  var qEl = box.querySelector('.aiq');
  if (!log || !btn || !qEl) return;
  if (AI_BUSY) {
    var busy = aiAddMsg(box, 'ai', '上一个问题还在等回复，稍等一下…', 'load');
    setTimeout(function () {
      if (busy && busy.parentNode) busy.parentNode.removeChild(busy);
    }, 3000);
    return;
  }

  var q = String(qEl.value || '').trim().slice(0, 300);
  if (!q) {
    aiAddMsg(box, 'ai', '先写一句要问什么，比如「这段代码为什么要判空？」', 'err');
    qEl.focus();
    return;
  }
  if (!AICFG.key && AICFG.p !== 'ollama') {
    aiNeedCfg(box, '还没填 API Key。');
    openAiCfg();
    return;
  }
  if (!AICFG.base || !AICFG.model) {
    aiNeedCfg(box, '接口地址或模型名还没填。');
    openAiCfg();
    return;
  }
  /* 上次失败的报错气泡先收起来，重试时不留一堆红字 */
  if (box._errEl && box._errEl.parentNode) box._errEl.parentNode.removeChild(box._errEl);
  box._errEl = null;
  /* 同一个问题重试就不再重复贴一遍「我」的气泡 */
  if (box._failQ !== q) aiAddMsg(box, 'me', q);
  box._failQ = '';

  var sys = '你是 C++ 嵌入式方向的助教，学生是刚入门的初学者。只围绕我给你的材料回答，用中文大白话，' +
    '先给结论，再补一个很小的例子或类比；如果材料里有正确答案和学生的错选，重点讲清学生为什么会错、正确思路是什么。' +
    '不要展开无关知识，不要用 Markdown 表格。回答尽量控制在 250 字以内。';
  /* 只带最近 5 轮（10 条）+ 这一次的材料和问题 */
  var msgs = [{ role: 'system', content: sys }]
    .concat(box._history.slice(-10))
    .concat([{ role: 'user', content: '材料：\n' + box._ctx + '\n\n学生的问题：' + q }]);
  var body = {
    model: AICFG.model,
    messages: msgs,
    max_tokens: 400,
    temperature: 0.3,
    stream: false
  };
  var url = String(AICFG.base).replace(/\/+$/, '') + '/chat/completions';

  AI_BUSY = true;
  btn.disabled = true;
  btn.textContent = '等待中…';
  var loadEl = aiAddMsg(box, 'ai', AICFG.p === 'ollama'
    ? '本机模型正在加载，可能要等一分钟…（冷启动实测约 55 秒，最多等 90 秒）'
    : '正在等回复…（最多等 90 秒）', 'load');

  AI_ABORT = ('AbortController' in window) ? new AbortController() : null;
  var timer = setTimeout(function () {
    if (AI_ABORT) { try { AI_ABORT.abort(); } catch (e) {} }
  }, AI_TIMEOUT);

  function finish() {
    clearTimeout(timer);
    AI_BUSY = false;
    AI_ABORT = null;
    btn.disabled = false;
    if (loadEl && loadEl.parentNode) loadEl.parentNode.removeChild(loadEl);
  }
  function fail(html) {
    finish();
    btn.textContent = '再问一次';
    box._failQ = q;                 /* 输入框里的问题保留着，直接再点一次即可 */
    box._errEl = aiAddMsg(box, 'ai', html, 'err', true);
    var c = box._errEl && box._errEl.querySelector('[data-cfg]');
    if (c) c.addEventListener('click', openAiCfg);
  }

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + (AICFG.key || 'ollama')
    },
    body: JSON.stringify(body),
    signal: AI_ABORT ? AI_ABORT.signal : undefined
  }).then(function (r) {
    return r.text().then(function (t) {
      if (!r.ok) {
        var msg = '';
        try { var j = JSON.parse(t); msg = (j.error && (j.error.message || j.error.code)) || ''; } catch (e) {}
        var err = new Error('HTTP ' + r.status + (msg ? '：' + String(msg).slice(0, 120) : ''));
        err.status = r.status;
        throw err;
      }
      return t;
    });
  }).then(function (t) {
    var data;
    try { data = JSON.parse(t); } catch (e) { throw new Error('返回的不是 JSON，Base URL 可能填错了'); }
    var c = data.choices && data.choices[0];
    var out = (c && ((c.message && c.message.content) || c.text)) || '';
    if (!out) throw new Error('模型返回了空内容');
    finish();
    btn.textContent = '发送';
    var answer = String(out).trim();
    aiAddMsg(box, 'ai', answer);
    /* 只保留最近 5 轮，超了丢最早的 */
    box._history.push({ role: 'user', content: q }, { role: 'assistant', content: answer });
    if (box._history.length > 10) box._history = box._history.slice(-10);
    aiRefreshCnt(box);
  }).catch(function (err) {
    var m = String((err && err.message) || err);
    if ((err && err.name === 'AbortError') || /abort/i.test(m)) {
      fail('等了 90 秒还没等到回复。本机模型闲置 5 分钟就会被卸载，下次提问又要重新加载（实测首字约 55 秒）。' +
           '再点一次「再问一次」通常就快了；如果用的是云端服务商，检查一下网络。');
      return;
    }
    var st = err && err.status;
    if (st === 401 || st === 403) {
      fail('key 不对或没有权限（HTTP ' + st + '）。点 ' +
           '<button type="button" class="linkbtn" data-cfg="1">这里去设置</button> 检查 key，注意首尾别带空格。');
      return;
    }
    if (st === 429) {
      fail('被限流或额度用完了（HTTP 429）。等半分钟再问，或者换一个服务商。');
      return;
    }
    if (st === 404) {
      fail('接口地址或模型名不对（HTTP 404）。检查 Base URL 是否以 /v1 结尾、模型名是否拼对。');
      return;
    }
    if (/Failed to fetch|NetworkError|Load failed|Network request failed/i.test(m)) {
      fail('请求发不出去，多半是被 CORS 拦了或网络不通。本机 Ollama 要设 OLLAMA_ORIGINS 允许这个网页访问，' +
           '改完必须重启 ollama；云端服务商换个网络再试。');
      return;
    }
    fail('出错了：' + m);
  });
}

/* 每张知识卡底部加「问 AI · 就这张卡」 */
function aiAttachCards() {
  Array.prototype.forEach.call(document.querySelectorAll('.card'), function (card) {
    if (card.querySelector('.aiwrap')) return;
    var wrap = document.createElement('div');
    wrap.className = 'aiwrap';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'aibtn';
    btn.textContent = '问 AI · 就这张卡';
    var host = document.createElement('div');
    wrap.appendChild(btn);
    wrap.appendChild(host);
    card.appendChild(wrap);
    btn.addEventListener('click', function () {
      if (wrap.getAttribute('data-open') === '1') {
        host.innerHTML = '';
        wrap.removeAttribute('data-open');
        btn.textContent = '问 AI · 就这张卡';
        return;
      }
      wrap.setAttribute('data-open', '1');
      btn.textContent = '收起 AI';
      aiMount(host, aiCardCtx(card), '', '上下文已带上这张卡的标题、要点、代码和术语对照。');
    });
  });
}

document.getElementById('aiSave').addEventListener('click', function () {
  AICFG.base = document.getElementById('aiBase').value.trim();
  AICFG.model = document.getElementById('aiModel').value.trim();
  AICFG.key = document.getElementById('aiKey').value.trim();
  aiSaveCfg();
  paintAiCfg();
  document.getElementById('aiNow').textContent = '已保存。' + aiNowText();
});
document.getElementById('aiClear').addEventListener('click', function () {
  AICFG.key = '';
  document.getElementById('aiKey').value = '';
  aiSaveCfg();
  paintAiCfg();
  document.getElementById('aiNow').textContent = 'key 已清空。' + aiNowText();
});
document.getElementById('aiClose').addEventListener('click', closeAiCfg);
document.getElementById('aiMask').addEventListener('click', function (e) {
  if (e.target === this) closeAiCfg();
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && document.getElementById('aiMask').className.indexOf('hidden') < 0) closeAiCfg();
});

window.CppApp = {
  hl: hl, BANK: BANK, TRACKS: TRACKS, LABEL: LABEL,
  startRound: startRound, goNewRound: goNewRound,
  mergeBank: mergeBank, aiAttachCards: aiAttachCards,
  openAiCfg: openAiCfg
};
})();
