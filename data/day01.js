window.DAYS = window.DAYS || {};
window.DAYS.day1 = {
  "id": "day1",
  "title": "Day 1 · 引用这条主线",
  "desc": "每张卡都是「为什么需要它 → 生活比方 → 能跑的短例子 → 新手常错 → 一句话结论」。先看结论，再读代码，不要背。",
  "cards": [
    {
      "id": "d1c01",
      "num": 1,
      "title": "引用：同一个箱子又贴了一张纸条",
      "pain": "<b>没有它会怎样</b>：C 里想让函数改外面的变量，只能传指针——调用处写 <code>&amp;</code>、函数里写 <code>*</code>，还得随时防着空指针。引用就是<b>给 a 那口箱子再贴一张写着 r 的纸条</b>：写起来跟普通变量一样，改的却是同一口箱子。",
      "analogy": "给 a 那口箱子再贴一张写着 r 的纸条",
      "only": "",
      "guess": "先猜：<code>int&amp; r = a; r = 20;</code> 之后，a 和 r 各是多少？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;             // 直接写 cout，不用加 std::\n\nint main() {                     // 程序入口\n    int a = 10;                  // 一口箱子，装 10\n    int& r = a;              // 同一口箱子的第二张纸条\n    r = 99;                      // 往纸条里写，就是往 a 里写\n    cout << a << \"\\n\";       // 99\n\n    int b = 20;                  // 另一口箱子，装 20\n    r = b;                   // 把 20 倒进 r 管的箱子，不是换绑\n    cout << a << \" \" << b << \"\\n\";   // 20 20\n\n    // int& bad;             // 编译报错：'bad' declared as reference but not initialized\n}",
      "output": "99\n20 20",
      "errors": [],
      "pitfalls": [
        "<b>为什么必须当场贴</b>：引用出生时就得绑到一口真实的箱子，之后不能换绑——这正是它比指针安全的地方。",
        "<b>贴了撕不掉</b>：<code>r = b;</code> 是\"倒东西\"，不是\"换箱子\"。想换目标只能用指针。",
        "<b>没有空引用</b>：可能没有箱子时用指针 + <code>nullptr</code>（Day 2 卡 8 细讲）。"
      ],
      "concl": "引用不是新箱子，是同一口箱子上的第二张纸条。",
      "terms": "正式叫「引用（reference）」，教材上的准确说法是\"变量的别名，不额外占用存储空间\"。",
      "tags": [
        "引用"
      ],
      "board": "",
      "quizIds": [
        "s01",
        "s02"
      ]
    },
    {
      "id": "d1c02",
      "num": 2,
      "title": "三种 swap：抄一份 / 递门牌号 / 递原件",
      "pain": "<b>没有它会怎样</b>：新手最常写的 <code>swap1</code> 是值传递，看着换了，函数一结束外面纹丝不动——这就是\"我明明改了怎么没反应\"。想让函数真把外面两个箱子互换，必须<b>把原件递进去</b>。",
      "analogy": "把原件递进去",
      "only": "",
      "guess": "先猜：三种 swap 里，哪一种调用完外面两个数没变？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;                                          // 直接写 cout\n\nvoid swap1(int x, int y) { int t = x; x = y; y = t; }        // 复印件\nvoid swap2(int* x, int* y) { int t = *x; *x = *y; *y = t; }  // 门牌号\nvoid swap3(int& x, int& y) { int t = x; x = y; y = t; }      // 原件\n\nint main() {                                                  // 程序入口\n    int m = 1, n = 2;                                         // 两口箱子\n    swap1(m, n);  cout << m << \" \" << n << \"\\n\";   // 1 2（没换）\n    swap2(&m, &n); cout << m << \" \" << n << \"\\n\";  // 2 1\n    swap3(m, n);  cout << m << \" \" << n << \"\\n\";   // 1 2（又换回来）\n\n    // swap2(m, n);   // 编译报错：invalid conversion from 'int' to 'int*'\n}",
      "output": "1 2\n2 1\n1 2",
      "errors": [],
      "pitfalls": [
        "<b>为什么值传递改不到</b>：参数是复印出来的，函数一结束复印件就扔了，你的箱子没动过。",
        "<b>指针能改，但要干三件事</b>：调用写 <code>&amp;</code>、函数里写 <code>*</code>、还得先判空。漏一个就编译不过或运行崩。",
        "<b>什么时候非用指针不可</b>：函数运行时要按数量申请一块内存（Day 2 卡 7），只能用指针接门牌号。<b>以后有板子再看</b>：读写寄存器——硬件那边没有箱子给你贴纸条，只有一个地址（如 <code>0x40020000</code>），只能拿门牌号去找。"
      ],
      "concl": "互换两个变量直接写引用版，别自己折腾门牌号。",
      "terms": "这三个版本依次叫「值传递」「地址传递（指针）」「引用传递（pass by reference）」。",
      "tags": [
        "引用",
        "swap"
      ],
      "board": "",
      "quizIds": [
        "s04",
        "s05"
      ]
    },
    {
      "id": "d1c03",
      "num": 3,
      "title": "const T&：把原件递给他看，但不许改",
      "pain": "<b>没有它会怎样</b>：传 <code>std::string</code> 这种大对象时，值传递每次调用都复印一整串字符，又慢又费内存；只加引用，函数又能顺手把你的东西改了。<code>const 类型&amp;</code> 就是<b>把原件递过去看，再贴一张\"不许改\"的封条</b>。",
      "analogy": "把原件递过去看，再贴一张\"不许改\"的封条",
      "only": "",
      "guess": "先猜：<code>const int&amp; r = 10;</code> 能编译吗？r 是几？",
      "codeMin": "",
      "codeFull": "#include <iostream>\n#include <string>\nusing namespace std;             // string 也来自 std\n\nvoid show(const string& s) {   // 递原件 + 贴封条\n    // s += \"!\";  // 编译报错：passing 'const std::string' as 'this' argument discards qualifiers\n    cout << s << \"\\n\";           // 只读不改，也不复制\n}\n\nint main() {                     // 程序入口\n    string name = \"Tom\";         // 一口 string 箱子\n    show(name);          // Tom（递的是原件）\n    const int& r = 10;   // 临时箱子也能贴封条\n    cout << r << \"\\n\";   // 10\n    // int& bad = 10;    // 编译报错：binding reference of type 'int&' to 'const int' discards qualifiers\n}",
      "output": "Tom\n10",
      "errors": [],
      "pitfalls": [
        "<b>三种写法一条线</b>：值传递 = 复印；<code>T&amp;</code> = 不复印但能改；<code>const T&amp;</code> = 不复印也不能改。",
        "<b>只看看、不打算改的大参数</b>，一律写 <code>const 类型&amp;</code>，这是团队里最常见的函数签名。",
        "<b>报错关键词</b>：<code>discards qualifiers</code> 就是\"你把封条撕了\"，看到它先想 const。"
      ],
      "concl": "只看看、不打算改的大东西，参数就写成 const 类型&。",
      "terms": "正式叫「常量引用」，作用是不拷贝、不可修改，常用于函数形参。",
      "tags": [
        "const引用",
        "临时量"
      ],
      "board": "",
      "quizIds": [
        "s06",
        "s18"
      ]
    },
    {
      "id": "d1c04",
      "num": 4,
      "title": "cout、endl、::：箭头、\"冲水\"和\"谁家的\"",
      "pain": "<b>没有它会怎样</b>：<code>printf</code> 要手写 <code>%d</code>、<code>%f</code>，类型和格式符对不上就打出乱码甚至崩；<code>cout</code> 让编译器自己认类型。<b>箭头朝右把东西塞进屏幕</b>，<code>endl</code> 是换行 + 冲水，<code>::</code> 读作\"谁家的\"。",
      "analogy": "箭头朝右把东西塞进屏幕",
      "only": "",
      "guess": "先猜：程序运行时你输入 5 再回车，屏幕上第一行是什么？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;      // 不写 std:: 也能用 cin、cout\n\nint main() {              // 程序入口\n    int a = 0;            // 先准备一口箱子\n    cout << \"请输入：\";       // 输出：请输入：\n    cin >> a;                 // 先输入 5，再按回车\n    cout << a << '\\n';        // 输出：5（只换行）\n    cout << a << endl;        // 输出：5（换行 + 立刻冲水）\n    // cout << a;             // 编译报错：'cout' was not declared in this scope（忘写 std::）\n}",
      "output": "请输入：5\n5",
      "errors": [],
      "pitfalls": [
        "<b>endl 是换行 + 冲水</b>：冲水 = 把攒在缓冲区里的字立刻推出去；<code>'\\n'</code> 只换行，攒够了一起走。",
        "<b>刷日志为什么用 '\\n'</b>：往文件或终端连续打几万行时，每行都冲一次水会明显拖慢；只有\"程序卡住前必须立刻看到\"的那几行才用 <code>endl</code>。",
        "<b>:: 读作\"谁家的\"</b>：<code>std::cout</code> 是标准库那家的；只写 <code>::a</code> 是全局那个 a。",
        "<b>怎么跑</b>：程序启动后先看到 <code>请输入：</code>，这时在键盘上敲 <code>5</code>，再按回车，后面的输出才会出来。"
      ],
      "concl": "箭头朝哪儿东西就往哪儿走；endl 多了个冲水；:: 就是在说\"谁家的\"。",
      "terms": "<code>std::cout</code> 是「标准输出流对象」，<code>endl</code> 是「换行并刷新缓冲区」，<code>::</code> 是「作用域解析运算符」。",
      "tags": [
        "cout",
        "endl",
        "作用域"
      ],
      "board": "",
      "quizIds": [
        "s08",
        "s11"
      ]
    },
    {
      "id": "d1c05",
      "num": 5,
      "title": "命名空间：给名字加个\"谁家的\"",
      "pain": "<b>没有它会怎样</b>：两个库都提供 <code>log()</code>，C 里只能改名或加前缀，越写越长。命名空间就是<b>给名字分家</b>：<code>A::log</code> 和 <code>B::log</code> 各叫各的，互不打架。",
      "analogy": "给名字分家",
      "only": "",
      "guess": "先猜：<code>using C::a1;</code> 之后直接写 <code>b1</code> 会怎样？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nnamespace A { int a = 1; }    // A 家有个 a\nnamespace B { int a = 2; }    // B 家也有个 a\nusing namespace std;          // 标准库的名字全部敞开\n\nint main() {                  // 程序入口\n    cout << A::a << \"\\n\";   // 1\n    cout << B::a << \"\\n\";   // 2\n\n    using A::a;             // 只搬 A 家的 a 进来\n    a = 3;                  // 改的就是 A::a\n    cout << A::a << \"\\n\";   // 3\n\n    // using namespace A;\n    // using namespace B;\n    // a = 3;               // 编译报错：reference to 'a' is ambiguous\n}",
      "output": "1\n2\n3",
      "errors": [],
      "pitfalls": [
        "<b>为什么写全名最保险</b>：<code>using namespace</code> 把两家东西倒在同一张桌子上，一旦重名，编译器不替你猜。",
        "<b>头文件里别写 using namespace</b>：会把\"污染\"带给所有 include 它的文件，工程大了很难查。",
        "<b>没名字的家</b>：<code>namespace { int x; }</code> 只在本文件可见，效果跟 <code>static</code> 一样（Day 2 卡 17）。"
      ],
      "concl": "名字撞了就写 :: 说清楚是谁家的。",
      "terms": "正式叫「命名空间（namespace）」，没名字的那个用「内部链接」来描述。",
      "tags": [
        "命名空间"
      ],
      "board": "",
      "quizIds": [
        "s09",
        "s10"
      ]
    },
    {
      "id": "d1c06",
      "num": 6,
      "title": "返回引用：别把拆掉的房子的门牌号给别人",
      "pain": "<b>没有它会怎样</b>：返回引用能省一次拷贝，但函数里临时造的箱子，函数一结束就拆房。把它的引用交出去，别人拿到的是<b>作废的门牌号</b>——这次刚好没被盖住，不代表下次还能开门。",
      "analogy": "作废的门牌号",
      "only": "",
      "guess": "先猜：<code>get()</code> 返回的是箱子本身还是复制品？<code>get() = 100;</code> 合法吗？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;               // 直接写 cout\n\nint g = 0;                         // 全局箱子，活到最后\nint& getG() { return g; }          // 全局箱子一直在\nstatic int s = 5;                  // 只在本文件可见的全局箱子\nint& getS() { return s; }          // static 箱子活到程序结束\nvoid fill(int& out) { out = 42; }   // 调用者自己的箱子\n\nint main() {                       // 程序入口\n    getG() = 7;   cout << g << \"\\n\";   // 7\n    getS() = 9;   cout << s << \"\\n\";   // 9\n\n    int v = 0;                     // 调用者自己的箱子\n    fill(v);      cout << v << \"\\n\";   // 42\n\n    // int& r = bad();   // bad 返回局部变量的引用，别运行：行为未定义\n}",
      "output": "7\n9\n42",
      "errors": [],
      "pitfalls": [
        "<b>为什么\"有时看着能跑\"</b>：栈上那块内存还没被别的函数盖掉；换编译器、换优化等级就现原形。",
        "<b>能安全返回的只有三种</b>：全局变量、static 变量、调用者自己传进来的引用/指针。",
        "<b>拿不准就按值返回</b>，别为了省一次拷贝埋一颗随机崩溃的雷。"
      ],
      "concl": "返回引用之前先问一句——这口箱子，函数结束后还在不在？",
      "terms": "这种情况正式叫「悬空引用（dangling reference）」，属于「未定义行为（UB）」。",
      "tags": [
        "引用返回",
        "生命周期"
      ],
      "board": "",
      "quizIds": [
        "s13",
        "s30"
      ]
    }
  ],
  "taskTitle": "Day 1 · 今天动手",
  "taskDesc": "两个小任务，不需要开发板，复制到 VS 或 g++ 里直接编译。先自己写，再对下面的预期输出；勾选状态会存在本机浏览器里。",
  "tasks": [
    {
      "id": "d1t1",
      "title": "任务 1 · 让函数真的改到外面的变量",
      "goal": "<b>目标</b>：分别用值传递和引用传递写 <code>addOne</code>，亲眼看到哪一个能改到 <code>score</code>。",
      "code": "#include <iostream>\nusing namespace std;\n\nvoid addOneWrong(int x) { x = x + 1; }   // 复印件上改，原件不动\nvoid addOne(int& x)     { x = x + 1; }   // 直接改原件\n\nint main() {\n    int score = 10;\n    addOneWrong(score);\n    cout << \"值传递后：\" << score << \"\\n\";    // 10\n    addOne(score);\n    cout << \"引用传递后：\" << score << \"\\n\";  // 11\n}",
      "output": "值传递后：10\n引用传递后：11",
      "tip": ""
    },
    {
      "id": "d1t2",
      "title": "任务 2 · 把函数调用写在等号左边",
      "goal": "<b>目标</b>：让 <code>at(a, 1)</code> 返回那一格的引用，然后直接给它赋值，验证 <code>a[1]</code> 真的变了。",
      "code": "#include <iostream>\nusing namespace std;\n\nint& at(int* arr, int i) { return arr[i]; }   // 返回那一格的引用\n\nint main() {\n    int a[3] = {1, 2, 3};\n    at(a, 1) = 99;    // 函数调用出现在等号左边，改的是 a[1]\n    cout << a[0] << \" \" << a[1] << \" \" << a[2] << \"\\n\";   // 1 99 3\n}",
      "output": "1 99 3",
      "tip": ""
    }
  ],
  "gloss": {
    "title": "术语小抄：教材、报错、面试，说的都是这些正式名字",
    "html": "<h4>术语小抄：教材、报错、面试，说的都是这些正式名字</h4>\n    <p>看教材、看编译器报错、面试时用的都是上面的正式名称，遇到术语就翻译回这套比喻——箱子、纸条、门牌号、封条、冲水、谁家的。</p>\n    <pre class=\"code\"><code>error: binding reference of type 'int&amp;' to 'const int' discards qualifiers</code></pre>\n    <p>逐词对一下：binding 是\"往上贴\"，reference 是\"那张纸条\"，discards qualifiers 是\"把 const 这张封条给撕了\"。</p>\n    <p class=\"say\">这是在说\"你想给一个承诺不改的东西贴一张能改的纸条，不行\"。</p>\n    <p>比如写 <code>const int a = 10; int&amp; r = a;</code> 就会撞上这条报错：a 已经被封条封住了，不许再贴一张能改的纸条。</p>"
  }
};
