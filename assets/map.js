/* 概念地图：30 张卡按主依赖连线；桌面散点图 + 手机按天树状列表 */
(function () {
  'use strict';

  /* 短标题只给地图用，内容仍以学习页为准 */
  var CARDS = [
    { n: 1, id: 'd1c01', t: '引用', day: 1, dep: 0 },
    { n: 2, id: 'd1c02', t: '三种 swap', day: 1, dep: 1 },
    { n: 3, id: 'd1c03', t: 'const T&', day: 1, dep: 1 },
    { n: 4, id: 'd1c04', t: 'cout 与 ::', day: 1, dep: 1 },
    { n: 5, id: 'd1c05', t: '命名空间', day: 1, dep: 4 },
    { n: 6, id: 'd1c06', t: '返回引用', day: 1, dep: 1 },
    { n: 7, id: 'd2c07', t: 'new / delete', day: 2, dep: 2 },
    { n: 8, id: 'd2c08', t: 'nullptr', day: 2, dep: 7 },
    { n: 9, id: 'd2c09', t: '指针与数组', day: 2, dep: 7 },
    { n: 10, id: 'd2c10', t: '栈与堆', day: 2, dep: 7 },
    { n: 11, id: 'd2c11', t: 'struct 加强', day: 2, dep: 2 },
    { n: 12, id: 'd2c12', t: 'bool', day: 2, dep: 4 },
    { n: 13, id: 'd2c13', t: 'const', day: 2, dep: 3 },
    { n: 14, id: 'd2c14', t: '默认参数', day: 2, dep: 2 },
    { n: 15, id: 'd2c15', t: '函数重载', day: 2, dep: 14 },
    { n: 16, id: 'd2c16', t: 'volatile', day: 2, dep: 10 },
    { n: 17, id: 'd2c17', t: 'static', day: 2, dep: 10 },
    { n: 18, id: 'd2c18', t: '位操作', day: 2, dep: 12 },
    { n: 19, id: 'd3c19', t: '过程 vs 对象', day: 3, dep: 11 },
    { n: 20, id: 'd3c20', t: '封装', day: 3, dep: 19 },
    { n: 21, id: 'd3c21', t: 'class 与 struct', day: 3, dep: 20 },
    { n: 22, id: 'd3c22', t: '构造函数', day: 3, dep: 21 },
    { n: 23, id: 'd3c23', t: '拷贝构造', day: 3, dep: 3 },
    { n: 24, id: 'd3c24', t: '浅拷贝', day: 3, dep: 7 },
    { n: 25, id: 'd3c25', t: '深拷贝', day: 3, dep: 23, x: '还涉及：卡 24 浅拷贝' },
    { n: 26, id: 'd3c26', t: 'operator=', day: 3, dep: 25, x: '还涉及：卡 23 拷贝构造' },
    { n: 27, id: 'd3c27', t: '析构函数', day: 3, dep: 7, x: '还涉及：卡 22 构造函数' },
    { n: 28, id: 'd3c28', t: '初始化列表', day: 3, dep: 22 },
    { n: 29, id: 'd3c29', t: 'explicit', day: 3, dep: 22 },
    { n: 30, id: 'd3c30', t: '三法则', day: 3, dep: 26 }
  ];
  var DAYNAME = { 1: 'Day 1 · 引用与传参', 2: 'Day 2 · 指针与内存', 3: 'Day 3 · 类与对象' };

  var BY = {};
  CARDS.forEach(function (c) { BY[c.n] = c; });

  /* ---------- 三关进度（与学习页共用同一份 localStorage） ---------- */
  var LV_KEY = 'cpp_card_levels_v2';
  var LV = {};
  try { LV = JSON.parse(localStorage.getItem(LV_KEY) || '{}') || {}; } catch (e) { LV = {}; }

  function lvCount(id) {
    var o = LV[id] || {};
    return (o.read ? 1 : 0) + (o.do ? 1 : 0) + (o.quiz ? 1 : 0);
  }
  function passed(id) { return lvCount(id) === 3; }

  var passedN = 0;
  CARDS.forEach(function (c) { if (passed(c.id)) passedN++; });
  document.getElementById('mProg').textContent = '已过 ' + passedN + '/30';

  /* ---------- 桌面散点图 ---------- */
  var NW = 168, NH = 72, GAP = 26, PADX = 16, ROW0 = 34, ROWSTEP = 96, BANDGAP = 14;
  var ROWS = { 1: 1, 2: 2, 3: 2 };
  var BANDTOP = {}, BANDH = {}, H = 0;
  for (var d0 = 1; d0 <= 3; d0++) {
    BANDTOP[d0] = H;
    BANDH[d0] = ROW0 + (ROWS[d0] - 1) * ROWSTEP + NH + 18;
    H += BANDH[d0] + BANDGAP;
  }
  H -= BANDGAP;
  var W = 1170;

  function posOf(c) {
    var i = c.n - 1;
    var dayIdx = c.day - 1;
    var inDay = i - (dayIdx === 0 ? 0 : dayIdx === 1 ? 6 : 18);
    var row = Math.floor(inDay / 6), col = inDay % 6;
    return {
      x: PADX + col * (NW + GAP),
      y: BANDTOP[c.day] + ROW0 + row * ROWSTEP
    };
  }

  function go(c) {
    location.href = 'index.html#' + c.id;
  }

  var stage = document.getElementById('mapStage');
  stage.style.width = W + 'px';
  stage.style.height = H + 'px';

  var html = [];
  for (var d = 1; d <= 3; d++) {
    html.push('<div class="band" style="top:' + BANDTOP[d] + 'px;height:' + BANDH[d] + 'px"></div>');
    html.push('<span class="bandname" style="top:' + (BANDTOP[d] + 10) + 'px">' + DAYNAME[d] + '</span>');
  }

  var svg = [];
  CARDS.forEach(function (c) {
    var p = posOf(c), n = lvCount(c.id);
    var st = n === 3 ? '✓' : n + '/3';
    html.push('<button class="node d' + c.day + '" type="button" ' +
      'style="left:' + p.x + 'px;top:' + p.y + 'px" data-n="' + c.n + '" ' +
      'aria-label="第 ' + c.n + ' 张 ' + c.t + '，三关 ' + (n === 3 ? '已通过' : n + ' 关已完成') + '">' +
      '<span class="nrow"><span class="nnum">' + (c.n < 10 ? '0' + c.n : c.n) + '</span>' +
      '<span class="nst' + (n === 3 ? ' ok' : '') + '">' + st + '</span></span>' +
      '<span class="nt">' + c.t + '</span>' +
      (c.x ? '<span class="nx">' + c.x + '</span>' : '') +
      '</button>');

    if (c.dep) {
      var pp = posOf(BY[c.dep]);
      var sameRow = Math.abs(pp.y - p.y) < 2;
      var path;
      if (sameRow) {
        var x1 = pp.x + NW, y1 = pp.y + NH / 2, x2 = p.x, y2 = p.y + NH / 2;
        path = 'M' + x1 + ' ' + y1 + ' C' + (x1 + 24) + ' ' + (y1 - 22) + ',' + (x2 - 24) + ' ' + (y2 - 22) + ',' + x2 + ' ' + y2;
      } else {
        var cx1 = pp.x + NW / 2, cy1 = pp.y + NH, cx2 = p.x + NW / 2, cy2 = p.y;
        path = 'M' + cx1 + ' ' + cy1 + ' C' + cx1 + ' ' + (cy1 + 34) + ',' + cx2 + ' ' + (cy2 - 34) + ',' + cx2 + ' ' + cy2;
      }
      svg.push('<path d="' + path + '" fill="none" stroke="#9AA3C0" stroke-width="1.6" stroke-dasharray="5 5" opacity=".7"/>');
    }
  });

  stage.insertAdjacentHTML('beforeend', html.join(''));
  var svgEl = document.getElementById('mapLines');
  svgEl.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  svgEl.setAttribute('width', W);
  svgEl.setAttribute('height', H);
  svgEl.innerHTML = svg.join('');

  stage.addEventListener('click', function (e) {
    var b = e.target.closest('.node');
    if (b) go(BY[+b.getAttribute('data-n')]);
  });

  /* ---------- 手机树状列表 ---------- */
  function depthOf(c) {
    var d = 0, cur = c;
    while (cur && cur.dep) { d++; cur = BY[cur.dep]; if (d > 40) break; }
    return d;
  }

  var list = document.getElementById('mapList');
  var lh = [];
  for (var dd = 1; dd <= 3; dd++) {
    lh.push('<div class="mgroup"><p class="mgh"><i class="i' + dd + '" style="background:' +
      (dd === 1 ? 'var(--d1-ink)' : dd === 2 ? 'var(--d2-ink)' : 'var(--d3-ink)') + '"></i>' + DAYNAME[dd] + '</p>');
    CARDS.filter(function (c) { return c.day === dd; }).forEach(function (c) {
      var n = lvCount(c.id), dep = c.dep ? BY[c.dep] : null;
      lh.push('<button class="mrow d' + c.day + '" type="button" data-n="' + c.n + '" ' +
        'style="padding-left:' + (12 + depthOf(c) * 14) + 'px" ' +
        'aria-label="第 ' + c.n + ' 张 ' + c.t + '">' +
        '<span class="mid">' + (c.n < 10 ? '0' + c.n : c.n) + '</span>' +
        '<span class="mtt">' + c.t +
        (dep ? '<em>前置：第 ' + dep.n + ' 张 ' + dep.t + '</em>' : '<em>起点</em>') +
        '</span>' +
        '<span class="mst' + (n === 3 ? ' ok' : '') + '">' + (n === 3 ? '✓' : n + '/3') + '</span>' +
        '</button>');
    });
    lh.push('</div>');
  }
  list.innerHTML = lh.join('');

  list.addEventListener('click', function (e) {
    var b = e.target.closest('.mrow');
    if (b) go(BY[+b.getAttribute('data-n')]);
  });
})();
