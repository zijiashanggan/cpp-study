/* 代码练习页：本地服务真编译真跑 + 关联知识卡就地讲解 */
(function () {
  'use strict';

  var SVC = 'http://127.0.0.1:8777';
  var OK_KEY = 'cpp_lab_v1';        /* 只记「我跑通了」，和卡片进度分开 */
  var DRAFT_KEY = 'cpp_lab_draft_v1';
  var TASKS = window.LAB_TASKS || [];
  var DAYS = window.DAYS || {};

  var cur = TASKS[0] ? TASKS[0].id : null;
  var svc = { on: false, compiler: '', canRun: false };
  var mobile = window.matchMedia('(max-width: 600px)').matches;

  var CARDS = {};
  ['day1', 'day2', 'day3', 'day4'].forEach(function (d) {
    var dd = DAYS[d];
    if (!dd) return;
    (dd.cards || []).forEach(function (c) { CARDS[c.id] = c; });
  });

  function readPassed() {
    try { return JSON.parse(localStorage.getItem(OK_KEY) || '{}') || {}; } catch (e) { return {}; }
  }
  function setPassed(id, v) {
    var o = readPassed();
    if (v) o[id] = Date.now(); else delete o[id];
    try { localStorage.setItem(OK_KEY, JSON.stringify(o)); } catch (e) {}
    paintProgress();
  }
  function readDraft() {
    try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}') || {}; } catch (e) { return {}; }
  }
  function saveDraft(id, code) {
    var o = readDraft(); o[id] = code;
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(o)); } catch (e) {}
  }
  function paintProgress() {
    var o = readPassed(), n = 0;
    TASKS.forEach(function (t) { if (o[t.id]) n++; });
    document.getElementById('labProg').textContent = '已跑通 ' + n + '/' + TASKS.length;
  }
  function esc(s) {
    return String(s === null || s === undefined ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function taskOf(id) {
    for (var i = 0; i < TASKS.length; i++) { if (TASKS[i].id === id) return TASKS[i]; }
    return null;
  }

  /* ---------- 左侧题单 ---------- */
  function renderNav() {
    var box = document.getElementById('labNav');
    var html = '<b>题目（先易后难）</b>';
    TASKS.forEach(function (t) {
      html += '<button type="button" data-task="' + t.id + '" class="' + (t.id === cur ? 'on' : '') + '">' +
        esc(t.title) + '<span>' + esc(t.day) + ' · ' + t.cases.length + ' 个测试</span></button>';
    });
    box.innerHTML = html;
    Array.prototype.forEach.call(box.querySelectorAll('[data-task]'), function (b) {
      b.addEventListener('click', function () { cur = b.getAttribute('data-task'); renderNav(); renderTask(); window.scrollTo(0, 0); });
    });
  }

  /* ---------- 关联卡精简讲解 ---------- */
  function cardsBlock(t) {
    var ids = t.cards || [];
    if (!ids.length) return '';
    var names = ids.map(function (id) { var c = CARDS[id]; return c ? ('卡 ' + c.num + ' · ' + String(c.title).replace(/<[^>]+>/g, '')) : id; });
    var html = '<details class="labcards"><summary>这题用到哪几张卡：' + esc(names.join(' / ')) + '</summary><div class="lcbody">';
    ids.forEach(function (id) {
      var c = CARDS[id];
      if (!c) return;
      html += '<div class="lc"><h4>卡 ' + c.num + ' · ' + c.title + '</h4>' +
        '<p>' + c.pain + '</p>';
      var code = c.codeMin || c.codeFull || '';
      if (code) {
        html += '<pre class="code" style="margin:0 0 8px"><code>' + esc(code.split('\n').slice(0, 12).join('\n')) + '</code></pre>';
      }
      html += '<div class="lc-concl">一句话结论：' + c.concl + '</div></div>';
    });
    html += '</div></details>';
    return html;
  }

  /* ---------- 主面板 ---------- */
  function renderTask() {
    var t = taskOf(cur);
    var panel = document.getElementById('labPanel');
    if (!t) { panel.innerHTML = '<p>题目数据没加载出来。</p>'; return; }
    var passed = !!readPassed()[t.id];
    var draft = readDraft()[t.id];

    var html = '';
    html += '<h2 class="ptitle">' + esc(t.title) + '</h2>';
    html += '<div class="pmeta"><span class="pill2">' + esc(t.day) + '</span>' +
      '<span class="pill2 lv' + (t.level === '进阶' ? ' lv2' : '') + '">' + esc(t.level || '入门') + '</span>' +
      '<span class="pill2">' + t.cases.length + ' 个测试用例</span></div>';
    html += cardsBlock(t);
    html += '<p class="pbrief">' + t.brief + '</p>';
    html += '<div class="pio">' + t.io + '</div>';

    html += '<table class="cases"><thead><tr><th style="width:50%">输入（stdin）</th><th style="width:50%">期望输出</th></tr></thead><tbody>';
    t.cases.forEach(function (c, i) {
      html += '<tr><td><pre>' + (c.stdin ? esc(c.stdin.replace(/\n$/, '')) : '（无输入）') + '</pre></td><td><pre>' + esc(c.expected) + '</pre></td></tr>';
    });
    html += '</tbody></table>';

    html += '<div class="editorwrap"><div class="editorbar"><b>main.cpp</b><span>写完整程序；改了会自动存在本机浏览器里</span><span class="sp">' + (passed ? '✓ 已标记跑通' : '') + '</span></div>' +
      '<textarea class="codeedit" id="labCode" spellcheck="false" autocomplete="off"></textarea></div>';

    html += '<div class="lab-runrow">' +
      '<button type="button" class="btn-main" id="labRun">运行</button>' +
      '<button type="button" class="btn-ghost" id="labReset">重置为起始代码</button>' +
      '<span class="kbd">Ctrl + Enter 也能运行</span></div>';

    html += '<div class="labout" id="labOut"></div>';

    html += '<div class="passrow"><label><input type="checkbox" id="labPassed"' + (passed ? ' checked' : '') + '> 我跑通了（打勾后展开参考答案）</label></div>';
    html += '<details class="answer' + ((passed || mobile) ? '' : ' locked') + '" id="labAns"><summary>参考答案</summary><pre>' + esc(t.answer) + '</pre></details>';

    panel.innerHTML = html;

    var ta = document.getElementById('labCode');
    ta.value = draft !== undefined ? draft : t.starter;
    ta.addEventListener('input', function () { saveDraft(t.id, ta.value); });
    ta.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        var s = ta.selectionStart, en = ta.selectionEnd;
        ta.value = ta.value.slice(0, s) + '    ' + ta.value.slice(en);
        ta.selectionStart = ta.selectionEnd = s + 4;
        saveDraft(t.id, ta.value);
      }
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); run(); }
    });

    document.getElementById('labRun').addEventListener('click', run);
    document.getElementById('labReset').addEventListener('click', function () {
      if (!confirm('用起始代码覆盖当前编辑内容？')) return;
      ta.value = t.starter;
      saveDraft(t.id, t.starter);
      document.getElementById('labOut').className = 'labout';
    });
    document.getElementById('labPassed').addEventListener('change', function () {
      setPassed(t.id, this.checked);
      var ans = document.getElementById('labAns');
      ans.classList.toggle('locked', !this.checked && !mobile);
      if (!this.checked) ans.removeAttribute('open');
    });
    document.getElementById('labAns').addEventListener('toggle', function () {
      if (this.classList.contains('locked')) { this.removeAttribute('open'); }
    });
  }

  /* ---------- 本地服务 ---------- */
  function paintSvc() {
    var s = document.getElementById('svcState');
    var hint = document.getElementById('svcHint');
    if (svc.on && svc.canRun) {
      s.className = 'svc on';
      s.textContent = '本地服务已连接 · ' + (svc.compiler || '编译器就绪');
      hint.textContent = '可以点「运行」了；关掉服务窗口前别刷新页面。';
    } else if (svc.on) {
      s.className = 'svc off';
      s.textContent = '服务已连接，但没找到编译器';
      hint.textContent = '装 VS 的 C++ 工作负载，或把 g++ 加进 PATH，然后重启 start-lab.bat。';
    } else {
      s.className = 'svc off';
      s.textContent = '本地服务未连接';
      hint.innerHTML = '双击 <code>lab-server\\start-lab.bat</code> 启动服务，再回到这里刷新。手机端不需要它，只读题和讲解就行。';
    }
  }

  function ping() {
    var done = false;
    var timer = setTimeout(function () { if (!done) { done = true; svc.on = false; paintSvc(); } }, 1500);
    fetch(SVC + '/ping', { method: 'GET', cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (done) return; done = true; clearTimeout(timer);
        svc.on = !!(j && j.ok);
        svc.compiler = (j && j.compiler) || '';
        svc.canRun = !!(j && j.canRun);
        paintSvc();
      })
      .catch(function () {
        if (done) return; done = true; clearTimeout(timer);
        svc.on = false; paintSvc();
      });
  }

  /* ---------- 运行 ---------- */
  function run() {
    if (mobile) return;
    var t = taskOf(cur);
    if (!t) return;
    var code = document.getElementById('labCode').value;
    var out = document.getElementById('labOut');
    var btn = document.getElementById('labRun');

    if (!svc.on) {
      out.className = 'labout show';
      out.innerHTML = '<div class="locompile"><b>本地服务没连上</b><pre>双击 lab-server\\start-lab.bat，看到「已启动」后回到这个页面刷新一次。\n手机端不支持运行，题目和讲解仍然可以看。</pre></div>';
      return;
    }

    btn.disabled = true;
    btn.textContent = '编译运行中…';
    out.className = 'labout show';
    out.innerHTML = '<div class="losum">正在调用本机编译器…</div>';

    var t0 = Date.now();
    fetch(SVC + '/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskId: t.id,
        code: code,
        cases: t.cases.map(function (c) { return { stdin: c.stdin || '', expected: c.expected }; })
      })
    })
      .then(function (r) { return r.json(); })
      .then(function (j) { renderRun(j, out, Date.now() - t0); })
      .catch(function (e) {
        out.className = 'labout show';
        out.innerHTML = '<div class="locompile"><b>请求失败</b><pre>' + esc(e && e.message ? e.message : '无法连接本地服务') +
          '\n请确认 start-lab.bat 的窗口还开着，然后刷新页面重试。</pre></div>';
      })
      .then(function () { btn.disabled = false; btn.textContent = '运行'; });
  }

  function renderRun(j, out, wall) {
    var html = '';
    if (j && j.error) {
      html += '<div class="locompile"><b>服务返回了错误</b><pre>' + esc(j.error) + '</pre></div>';
      out.innerHTML = html;
      return;
    }
    if (!j || j.compiled === false) {
      html += '<div class="locompile"><b>' + (j && j.compileTimeout ? '编译超时' : '编译没通过') + '</b>' +
        '<pre>' + esc((j && j.compileOutput) || '编译器没有输出。') + '</pre></div>';
      out.innerHTML = html;
      return;
    }
    html += '<div class="losum ' + (j.ok ? 'ok' : 'no') + '">' +
      (j.ok ? '✓ 全部通过（' + j.cases.length + ' / ' + j.cases.length + '）' : '✗ 有测试没通过') +
      '　<span style="font-weight:400;color:#6B7391;font-size:12.5px">' + (j.compiler || '') + ' · 编译+运行 ' + (j.ms || wall) + ' ms</span></div>';

    (j.cases || []).forEach(function (c, i) {
      html += '<div class="locase ' + (c.pass ? 'pass' : 'fail') + '">' +
        '<div class="lch"><span class="tag2">' + (c.pass ? 'PASS' : 'FAIL') + '</span><b>测试 ' + (i + 1) + '</b>' +
        '<span style="color:#6B7391;font-size:12px">' + (c.ms || 0) + ' ms</span>' +
        (c.timeout ? '<span style="color:#A11B12;font-size:12px">运行超过 5 秒，已强制结束</span>' : '') + '</div>' +
        '<div class="cols"><div><p>期望</p><pre>' + esc(c.expected) + '</pre></div>' +
        '<div><p>实际</p><pre>' + esc(c.timeout ? '（超时，没有正常输出）' : (c.actual === '' ? '（没有输出）' : c.actual)) + '</pre></div></div>' +
        (c.stderr && !c.timeout ? '<div style="margin-top:8px"><p style="margin:0 0 3px;font-size:11.5px;color:#6B7391">stderr</p><pre>' + esc(c.stderr) + '</pre></div>' : '') +
        '</div>';
    });
    if (j.compileOutput) {
      html += '<details class="answer" style="margin-top:10px"><summary>编译器输出（警告）</summary><pre>' + esc(j.compileOutput) + '</pre></details>';
    }
    out.innerHTML = html;
    if (j.ok) {
      var t = taskOf(cur);
      var cb = document.getElementById('labPassed');
      if (cb && !cb.checked) {
        cb.checked = true;
        setPassed(t.id, true);
        var ans = document.getElementById('labAns');
        if (ans) ans.classList.remove('locked');
      }
    }
  }

  /* ---------- 启动 ---------- */
  renderNav();
  renderTask();
  paintProgress();
  paintSvc();
  ping();
  window.addEventListener('focus', ping);
  setInterval(function () { if (!svc.on) ping(); }, 5000);
})();
