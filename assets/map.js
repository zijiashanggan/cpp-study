/* 概念地图：43 张卡按主依赖连线；桌面散点图 + 手机按天树状列表。
   点节点先出说明（桌面浮层 / 手机底部抽屉），浮层里点「进入卡片」才跳转。 */
(function () {
  'use strict';

  /* 短标题与说明只给地图用，内容以学习页卡片为准 */
  var CARDS = [
    { n: 1, id: 'd1c01', t: '引用', day: 1, dep: 0, d: '引用是给已有变量起别名，改引用就是改原变量，省掉拷贝、也让函数能改到外面。它必须初始化、绑定后不能改绑，是后面 const 引用、返回引用、拷贝构造的语法基础。' },
    { n: 2, id: 'd1c02', t: '三种 swap', day: 1, dep: 1, d: '同一个交换用值传递、指针、引用三种写法各实现一遍，差别在于函数拿到的是副本、地址还是原件。它把「形参怎么传」摆在一起对比，是理解传参方式最直观的例子。' },
    { n: 3, id: 'd1c03', t: 'const T&', day: 1, dep: 1, d: 'const 引用既能免去拷贝，又承诺函数里不修改实参，传大对象时最常用。它建立在引用之上，也是拷贝构造参数必须写成 const T& 的原因。' },
    { n: 4, id: 'd1c04', t: 'cout 与 ::', day: 1, dep: 1, d: 'cout 是标准库里的输出对象，:: 是作用域限定符，表示去哪个作用域里找名字。读懂 cout 和 std:: 的写法，才能看懂后面命名空间与类内成员的访问。' },
    { n: 5, id: 'd1c05', t: '命名空间', day: 1, dep: 4, d: '命名空间把名字装进不同抽屉，避免同名函数或类型互相打架；using namespace std 就是把这些名字一次性摊开。它解释了 std:: 前缀到底在做什么。' },
    { n: 6, id: 'd1c06', t: '返回引用', day: 1, dep: 1, d: '函数可以返回引用，交出去的是对象本身而不是副本，所以调用能出现在等号左边被赋值。前提是返回的东西在函数结束后仍然活着，不能返回局部变量。' },
    { n: 7, id: 'd2c07', t: 'new / delete', day: 2, dep: 2, d: 'new 在堆上按需申请内存并返回指针，delete 负责归还，new[] 必须配 delete[]。它让程序能按运行时才知道的数量申请内存，是动态数组、深拷贝、析构函数的前提。' },
    { n: 8, id: 'd2c08', t: 'nullptr', day: 2, dep: 7, d: 'nullptr 是空指针字面量，表示没有指向任何对象。解引用前先判空能避免程序直接崩掉，而 delete nullptr 是安全的。' },
    { n: 9, id: 'd2c09', t: '指针与数组', day: 2, dep: 7, d: '数组名在多数场合会退化成指向首元素的指针，所以函数参数里的 int a[] 其实是指针。知道这一点才不会在函数里用 sizeof 去算数组长度。' },
    { n: 10, id: 'd2c10', t: '栈与堆', day: 2, dep: 7, d: '栈上的对象随作用域自动创建销毁，堆上的对象由 new / delete 手动管理。生命周期不同，决定了析构函数什么时候被调用，也是内存泄漏与重复释放的根源。' },
    { n: 11, id: 'd2c11', t: 'struct 加强', day: 2, dep: 2, d: 'C++ 的 struct 除了装数据，还能带成员函数、构造函数和访问控制。它是从「一堆字段」走向「类」的过渡，和 class 只差默认访问权限。' },
    { n: 12, id: 'd2c12', t: 'bool', day: 2, dep: 4, d: 'bool 只有 true / false 两个值，条件判断的结果就是 bool。它让真假成为独立类型，判断语句和位操作都靠它表达。' },
    { n: 13, id: 'd2c13', t: 'const', day: 2, dep: 3, d: 'const 表示只读，修饰变量、参数、返回值都意味着这里不许改。它是 const 引用、常对象、const 成员函数这条线的起点。' },
    { n: 14, id: 'd2c14', t: '默认参数', day: 2, dep: 2, d: '函数参数可以给默认值，调用时不传就用默认的，但默认值必须从右往左连续给。它省掉一部分重复的重载写法。' },
    { n: 15, id: 'd2c15', t: '函数重载', day: 2, dep: 14, d: '同名函数只要参数个数或类型不同就能共存，编译器按调用时的实参挑选版本。它和默认参数解决的是同一类问题：让调用端少记几个名字。' },
    { n: 16, id: 'd2c16', t: 'volatile', day: 2, dep: 10, d: 'volatile 告诉编译器这个变量可能被外部改变，每次都要真去内存读，不能优化进寄存器。嵌入式里读写硬件寄存器常用它，和 const 是两件不同的事。' },
    { n: 17, id: 'd2c17', t: 'static', day: 2, dep: 10, d: '在函数里 static 让局部变量只初始化一次、活到程序结束；在文件或全局层面它限制名字只在本文件可见。它是 Day 4 静态成员的前置概念。' },
    { n: 18, id: 'd2c18', t: '位操作', day: 2, dep: 12, d: '用 & | ^ ~ << >> 直接操作二进制位，可以压缩标志、读写寄存器。嵌入式里配置硬件位域几乎离不开它。' },
    { n: 19, id: 'd3c19', t: '过程 vs 对象', day: 3, dep: 11, d: '面向过程按步骤组织代码，面向对象把数据和操作数据的方法捆在一起。理解这个转变，才能明白类到底解决了什么问题。' },
    { n: 20, id: 'd3c20', t: '封装', day: 3, dep: 19, d: '封装是把数据藏进 private、只留 public 接口给外面用，外部改不了内部状态。它让「谁能改、怎么改」有明确边界，是类存在的核心理由。' },
    { n: 21, id: 'd3c21', t: 'class 与 struct', day: 3, dep: 20, d: 'class 默认成员私有，struct 默认公有，其余能力完全一样。选哪个更多是表达意图：要封装用 class，纯数据聚合用 struct。' },
    { n: 22, id: 'd3c22', t: '构造函数', day: 3, dep: 21, d: '构造函数在对象创建时自动执行，负责把成员初始化到合法状态，名字与类相同、没有返回值。有了它，对象一出生就是可用的。' },
    { n: 23, id: 'd3c23', t: '拷贝构造', day: 3, dep: 3, d: '用同类型对象初始化新对象时调用拷贝构造，参数固定写成 const T&。它建立在 const 引用之上，是浅拷贝、深拷贝、三法则这条线的入口。' },
    { n: 24, id: 'd3c24', t: '浅拷贝', day: 3, dep: 7, d: '编译器默认生成的拷贝只逐成员复制，指针成员复制的是地址而不是内容，两个对象会指向同一块内存。它是理解深拷贝必要性的反面教材。' },
    { n: 25, id: 'd3c25', t: '深拷贝', day: 3, dep: 23, x: '还涉及：卡 24 浅拷贝', d: '深拷贝在拷贝构造里重新申请一块内存，再把内容搬过去，两个对象各管各的。它解决浅拷贝带来的重复释放问题，需要 new / delete 与拷贝构造两样基础。' },
    { n: 26, id: 'd3c26', t: 'operator=', day: 3, dep: 25, x: '还涉及：卡 23 拷贝构造', d: '拷贝赋值发生在两个已存在的对象之间，要处理自赋值、先释放旧资源再深拷贝，并返回 *this 支持连续赋值。它和拷贝构造时机不同：一个是出生，一个是覆盖。' },
    { n: 27, id: 'd3c27', t: '析构函数', day: 3, dep: 7, x: '还涉及：卡 22 构造函数', d: '析构函数在对象销毁前自动执行，用来释放 new 出来的资源，顺序与构造相反。没有它，深拷贝和动态数组都会漏内存。' },
    { n: 28, id: 'd3c28', t: '初始化列表', day: 3, dep: 22, d: '成员可以在构造函数的初始化列表里直接构造，比进函数体再赋值少一次默认构造。const 成员和引用成员必须走初始化列表。' },
    { n: 29, id: 'd3c29', t: 'explicit', day: 3, dep: 22, d: 'explicit 禁止单参数构造函数被隐式转换调用，避免 Box b = 10 这种悄悄发生的构造。它是对构造函数的一道收紧。' },
    { n: 30, id: 'd3c30', t: '三法则', day: 3, dep: 26, d: '只要自己写了析构、拷贝构造、拷贝赋值中的任何一个，另外两个通常也要写。它把前面几关串成一条规则，是资源管理类的最低要求。' },
    { n: 31, id: 'd4c31', t: '静态成员变量', day: 4, dep: 22, d: 'static 成员属于类而不属于对象，所有对象共用同一份，类内声明、类外定义。它用来表达「全类共享的状态」，比如总数、配置。' },
    { n: 32, id: 'd4c32', t: '静态计数器', day: 4, dep: 31, d: '把静态成员放进构造函数加一、析构函数减一，就得到全类的对象计数。它是静态成员最典型的用法，也顺便验证了构造与析构的时机。' },
    { n: 33, id: 'd4c33', t: '静态成员函数', day: 4, dep: 32, d: '静态成员函数没有 this，因此只能访问静态成员，用 类名:: 调用。它是访问静态数据的窗口，也是单例 getInstance 必须写成静态的原因。' },
    { n: 34, id: 'd4c34', t: '单例 · 饿汉', day: 4, dep: 33, d: '饿汉式在程序启动时就创建唯一实例：构造私有，再用静态成员和静态 getInstance 交出去。它简单、没有线程竞争，代价是无论用不用都先构造。' },
    { n: 35, id: 'd4c35', t: '单例 · 懒汉', day: 4, dep: 34, d: '懒汉式第一次调用 getInstance 时才创建实例，判空那一句就是它的命门。它省掉不必要的构造，但多线程下需要额外同步。' },
    { n: 36, id: 'd4c36', t: '单例 · 静态局部', day: 4, dep: 35, d: '把实例写成函数内的 static 局部变量，第一次调用时构造，之后都返回同一个对象。C++11 保证这种写法线程安全，是目前最推荐的懒汉实现。' },
    { n: 37, id: 'd4c37', t: '类的存储结构', day: 4, dep: 21, d: '对象的大小只由非静态数据成员决定，还要按对齐规则补齐；静态成员和成员函数都不占对象空间。它解释了 sizeof 为什么常常比成员相加更大。' },
    { n: 38, id: 'd4c38', t: 'this 同名形参', day: 4, dep: 37, d: '每个非静态成员函数都隐含一个 this 指针，指向当前对象。形参和成员同名时，用 this-> 指明左边那个是成员。' },
    { n: 39, id: 'd4c39', t: 'return *this', day: 4, dep: 38, d: '*this 就是当前对象本身，返回它的引用就能连续调用成员函数。链式调用的关键是返回类型写成 类名&，而不是返回值。' },
    { n: 40, id: 'd4c40', t: 'const 成员函数', day: 4, dep: 37, d: '在成员函数参数表后加 const，表示这个函数不修改对象状态。常对象只能调用这类函数，它是「只读承诺」的语法体现。' },
    { n: 41, id: 'd4c41', t: '常对象', day: 4, dep: 40, d: '用 const 修饰的对象只能调用 const 成员函数，成员能读不能改，mutable 成员是唯一例外。它把 const 成员函数的约束落实到具体对象上。' },
    { n: 42, id: 'd4c42', t: '友元', day: 4, dep: 40, d: 'friend 声明的函数或类可以访问私有成员，相当于发一把备用钥匙。它绕过封装但不是成员、没有 this，也不被继承。' },
    { n: 43, id: 'd4c43', t: '动态数组实战', day: 4, dep: 26, d: '把指针、个数、容量封装进类，满了就申请更大的内存、搬过去、释放旧的；拷贝时重新租地做深拷贝。它把 new / delete、构造析构、拷贝赋值、扩容串成一个能用的容器。' }
  ];
  var DAYNAME = { 1: 'Day 1 · 引用与传参', 2: 'Day 2 · 指针与内存', 3: 'Day 3 · 类与对象', 4: 'Day 4 · 静态与 this' };

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
  document.getElementById('mProg').textContent = '已过 ' + passedN + '/' + CARDS.length;

  /* ---------- 桌面散点图 ---------- */
  var NW = 168, NH = 72, GAP = 26, PADX = 16, ROW0 = 34, ROWSTEP = 96, BANDGAP = 14;
  var ROWS = { 1: 1, 2: 2, 3: 2, 4: 3 };
  var FIRST = {}, CNT = {};
  var acc = 0;
  for (var d0 = 1; d0 <= 4; d0++) {
    FIRST[d0] = acc;
    CNT[d0] = CARDS.filter(function (c) { return c.day === d0; }).length;
    acc += CNT[d0];
  }
  var BANDTOP = {}, BANDH = {}, H = 0;
  for (var d1 = 1; d1 <= 4; d1++) {
    BANDTOP[d1] = H;
    BANDH[d1] = ROW0 + (ROWS[d1] - 1) * ROWSTEP + NH + 18;
    H += BANDH[d1] + BANDGAP;
  }
  H -= BANDGAP;
  var W = 1170;

  function posOf(c) {
    var i = c.n - 1 - FIRST[c.day];
    var row = Math.floor(i / 6), col = i % 6;
    return {
      x: PADX + col * (NW + GAP),
      y: BANDTOP[c.day] + ROW0 + row * ROWSTEP
    };
  }

  var stage = document.getElementById('mapStage');
  stage.style.width = W + 'px';
  stage.style.height = H + 'px';

  var html = [];
  for (var d = 1; d <= 4; d++) {
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

  /* ---------- 说明浮层 / 底部抽屉 ---------- */
  var tip = null, tipTimer = 0, tipPinned = false, cur = null;

  function isMobile() { return window.matchMedia('(max-width: 900px)').matches; }
  function numHtml(n) { return '<span class="tipnum d' + BY[n].day + '">' + (n < 10 ? '0' + n : n) + '</span>'; }
  function bodyHtml(c) {
    var dep = c.dep ? BY[c.dep] : null, n = lvCount(c.id);
    return '<div class="tiphead">' + numHtml(c.n) + '<span class="tipt">' + c.t + '</span></div>' +
      '<p class="tipdesc">' + c.d + '</p>' +
      '<div class="tipmeta"><span>前置：' + (dep ? '第 ' + dep.n + ' 张 ' + dep.t : '起点') + '</span>' +
      '<span>三关：' + (n === 3 ? '✓ 已过' : n + '/3') + '</span></div>' +
      '<button type="button" class="btn-main tipgo">进入卡片</button>';
  }

  function ensureTip() {
    if (tip) return;
    tip = document.createElement('div');
    tip.className = 'tipcard';
    tip.hidden = true;
    document.body.appendChild(tip);
    tip.addEventListener('mouseenter', function () { clearTimeout(tipTimer); });
    tip.addEventListener('mouseleave', function () { if (!tipPinned) tipTimer = setTimeout(hideTip, 220); });
    tip.addEventListener('click', function (e) {
      if (e.target.closest('.tipgo')) go(cur);
    });
  }

  function hideTip() {
    if (!tip) return;
    tip.hidden = true;
    tipPinned = false;
    cur = null;
  }

  function openTip(c, el, pin) {
    ensureTip();
    cur = c;
    tipPinned = !!pin;
    tip.innerHTML = bodyHtml(c);
    tip.style.left = '0px';
    tip.style.top = '0px';
    tip.hidden = false;
    var r = el.getBoundingClientRect();
    var tw = tip.offsetWidth, th = tip.offsetHeight;
    var left = r.right + 12;
    if (left + tw > window.innerWidth - 8) left = r.left - tw - 12;
    if (left < 8) left = 8;
    var top = r.top - 6;
    if (top + th > window.innerHeight - 8) top = window.innerHeight - th - 8;
    if (top < 8) top = 8;
    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
  }

  var mask = null, sheet = null;
  function ensureSheet() {
    if (mask) return;
    mask = document.createElement('div');
    mask.className = 'sheetmask';
    mask.hidden = true;
    sheet = document.createElement('div');
    sheet.className = 'sheet';
    mask.appendChild(sheet);
    document.body.appendChild(mask);
    mask.addEventListener('click', function (e) { if (e.target === mask) closeSheet(); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('.tipgo')) go(cur); });
  }
  function closeSheet() {
    if (!mask) return;
    mask.hidden = true;
    document.body.style.overflow = '';
    cur = null;
  }
  function openSheet(c) {
    ensureSheet();
    cur = c;
    sheet.innerHTML = '<span class="sheetbar"></span>' + bodyHtml(c);
    mask.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function go(c) {
    if (!c) return;
    location.href = 'index.html#' + c.id;
  }

  stage.addEventListener('click', function (e) {
    var b = e.target.closest('.node');
    if (!b) return;
    e.preventDefault();
    openTip(BY[+b.getAttribute('data-n')], b, true);
  });
  stage.addEventListener('mouseover', function (e) {
    if (isMobile() || tipPinned) return;
    var b = e.target.closest('.node');
    if (!b) return;
    clearTimeout(tipTimer);
    openTip(BY[+b.getAttribute('data-n')], b, false);
  });
  stage.addEventListener('mouseout', function (e) {
    var b = e.target.closest('.node');
    if (!b || tipPinned) return;
    tipTimer = setTimeout(hideTip, 240);
  });

  /* ---------- 手机树状列表 ---------- */
  function depthOf(c) {
    var d = 0, cur2 = c;
    while (cur2 && cur2.dep) { d++; cur2 = BY[cur2.dep]; if (d > 40) break; }
    return d;
  }

  var list = document.getElementById('mapList');
  var lh = [];
  for (var dd = 1; dd <= 4; dd++) {
    lh.push('<div class="mgroup"><p class="mgh"><i class="i' + dd + '" style="background:' +
      (dd === 1 ? 'var(--d1-ink)' : dd === 2 ? 'var(--d2-ink)' : dd === 3 ? 'var(--d3-ink)' : 'var(--d4-ink)') + '"></i>' + DAYNAME[dd] + '</p>');
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
    if (!b) return;
    e.preventDefault();
    openSheet(BY[+b.getAttribute('data-n')]);
  });

  document.addEventListener('click', function (e) {
    if (tip && !tip.hidden && !e.target.closest('.node') && !e.target.closest('.tipcard')) hideTip();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    hideTip();
    closeSheet();
  });
})();
