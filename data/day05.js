window.DAYS = window.DAYS || {};
window.DAYS.day5 = {
  "id": "day5",
  "title": "Day 5 · 运算符重载与继承",
  "desc": "今天两件事：先让对象像内置类型一样用运算符（+、<<、++、==、()、* 和 ->），再把「父类的成员自动带过来」这条继承线走通，最后搞明白菱形继承为什么要 virtual。每张卡的输出都是真跑出来的，先猜再看。",
  "cards": [
    {
      "id": "d5c44",
      "num": 44,
      "title": "运算符重载：给对象换一套自己的运算符",
      "pain": "<b>没有它会怎样</b>：<code>a + b</code> 只认内置类型，两个 <code>Point</code> 相加编译器直接不认；写个 <code>add(a, b)</code> 又和别处的风格不一致。<b>运算符重载</b>就是把 <code>+</code> 这个名字重新绑到一个函数上——它<b>不是什么魔法，就是换了个名字的函数调用</b>，像「同一个门铃，谁家门口挂都响自己家」。",
      "analogy": "同一个门铃名字，挂谁家门口就响谁家的",
      "only": "",
      "guess": "先猜：<code>a + b</code> 编译成函数调用后，<code>a</code> 和 <code>b</code> 分别对应函数的哪个位置？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;                        // 直接写 cout\n\nclass Box {\npublic:\n    int v;\n    Box(int v) : v(v) {}                    // 构造：存一个数\n    Box operator+(const Box& o) {           // 成员函数：只写一个参数\n        return Box(v + o.v);                // 左边是自己，右边是 o\n    }\n};\n\nBox add(Box a, Box b) {                     // 普通函数对照：两个参数\n    return Box(a.v + b.v);\n}\n\nint main() {\n    Box a(1), b(2);\n    cout << (a + b).v << \"\\n\";     // 3：a.operator+(b)\n    cout << add(a, b).v << \"\\n\";   // 3：一样的活，只是名字不同\n}",
      "output": "3\n3",
      "errors": [],
      "pitfalls": [
        "<b>成员写一个参数，全局写两个</b>：写成成员函数时，左边那个对象就是 <code>this</code>，所以 <code>operator+</code> 只收一个参数；写成全局函数就要收两个。",
        "<b>别滥用</b>：只有让代码更像人话时才值得重载。给 <code>+</code> 定义「相减」这种反直觉语义，比不重载更难读。",
        "<b>内置类型动不了</b>：<code>int</code> 的 <code>+</code> 不能改，重载只对「至少一个操作数是自定义类型」有效。",
        "<b>不能改优先级和参数个数</b>：<code>a + b * c</code> 还是先算乘；<code>+</code> 也永远不能变成三个操作数。"
      ],
      "concl": "运算符重载就是给运算符绑一个新函数：成员函数少写一个参数，全局函数写全两个。",
      "terms": "正式叫「运算符重载（operator overloading）」；<code>operator+</code> 这种名字叫「运算符函数名」。",
      "tags": [
        "运算符重载"
      ],
      "board": "",
      "quizIds": [
        "d5s01",
        "d5s02"
      ]
    },
    {
      "id": "d5c45",
      "num": 45,
      "title": "重载 << 和 >>：让 cout 认你的对象",
      "pain": "<b>没有它会怎样</b>：<code>cout &lt;&lt; stu;</code> 直接编译报错，因为 <code>&lt;&lt;</code> 只认基本类型；想打印对象只能写 <code>stu.print()</code>，可读性差一大截。<b>重载 <code>&lt;&lt;</code></b> 就像<b>给对象办一张能过闸机的工牌</b>：办完 <code>cout</code> 这台闸机就认它了。",
      "analogy": "给对象办一张能过 cout 闸机的工牌",
      "only": "",
      "guess": "先猜：为什么 <code>operator&lt;&lt;</code> 必须写成全局函数，不能写进类里当成员？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;                                // 直接写 cout\n\nclass Stu {\n    int no;\n    string name;\npublic:\n    Stu(int no, string name) : no(no), name(name) {}\n    // 声明成友元，全局函数才看得到 private 的 no / name\n    friend ostream& operator<<(ostream& os, const Stu& s);\n    friend istream& operator>>(istream& is, Stu& s);\n};\n\nostream& operator<<(ostream& os, const Stu& s) {\n    os << s.no << \" \" << s.name;\n    return os;                                      // 返回流本身，才能连着 <<\n}\n\nistream& operator>>(istream& is, Stu& s) {\n    is >> s.no >> s.name;\n    return is;\n}\n\nint main() {\n    Stu a(1001, \"张三\");\n    cout << a << \"!\" << endl;   // 1001 张三!\n}",
      "output": "1001 张三!",
      "errors": [],
      "pitfalls": [
        "<b>只能是全局函数</b>：写成成员函数，左操作数就必须是 <code>Stu</code> 对象，可 <code>cout &lt;&lt; stu</code> 的左边是 <code>ostream</code>，位置不对。",
        "<b>要返回流引用</b>：返回 <code>void</code> 的话，<code>cout &lt;&lt; a &lt;&lt; \"!\"</code> 会在第二个 <code>&lt;&lt;</code> 处断掉。",
        "<b>输入要引用</b>：<code>operator&gt;&gt;</code> 的第二个参数必须是 <code>Stu&amp;</code>，不然改的是副本，外面拿不到值。",
        "<b>友元不是成员</b>：它没有 <code>this</code>，也不被继承，只是被允许访问私有成员。"
      ],
      "concl": "<code>&lt;&lt;</code> / <code>&gt;&gt;</code> 只能写成全局函数 + 友元，并返回流的引用。",
      "terms": "这种写法叫「流插入 / 流提取运算符重载」；<code>friend</code> 声明叫「友元声明」。",
      "tags": [
        "operator<<",
        "operator>>",
        "友元"
      ],
      "board": "",
      "quizIds": [
        "d5s03",
        "d5s04"
      ]
    },
    {
      "id": "d5c46",
      "num": 46,
      "title": "可重载的范围，和三条不能碰的红线",
      "pain": "<b>没有它会怎样</b>：有人以为重载是万能的，跑去给 <code>int</code> 重定义 <code>+</code>，或者重载 <code>&amp;&amp;</code> 想「优化」，结果程序行为全乱。<b>红线有三条</b>：不能新增 C++ 里没有的运算符、不能改优先级和参数个数、不能改内置类型；另外 <code>&amp;&amp;</code> 和 <code>||</code> 别碰——<b>像红绿灯，你可以换灯泡颜色，但不能改「红灯停」这条规矩</b>。",
      "analogy": "能换灯泡颜色，但不能改「红灯停」这条规矩",
      "only": "",
      "guess": "先猜：重载 <code>&amp;&amp;</code> 之后，<code>a &amp;&amp; f()</code> 里的 <code>f()</code> 还会短路不执行吗？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;                            // 直接写 cout\n\nint calls = 0;\nbool check() { calls++; return true; }          // 用来数右边被算了几次\n\nclass Flag {\npublic:\n    int v;\n    Flag(int v) : v(v) {}\n    bool operator&&(Flag o) {                   // 重载 &&\n        return v && o.v;\n    }\n};\n\nint main() {\n    Flag a(0);                                  // 左边是假\n    if (a && Flag(check())) { }                 // 重载后两边都要先算完\n    cout << calls << \"\\n\";     // 1：右边照样被调用，短路没了\n}",
      "output": "1",
      "errors": [],
      "pitfalls": [
        "<b>短路是内置语义</b>：内置 <code>&amp;&amp;</code> 左边为假就不算右边；重载后是函数调用，所有实参必须先求值，短路直接失效。",
        "<b>顺序也变了</b>：函数调用的实参求值顺序不确定，可能先算右边，副作用顺序和你写的不一样。",
        "<b><code>::</code> <code>.</code> <code>?:</code> <code>sizeof</code> 不能重载</b>：这几个在语法层面就不接受重载。",
        "<b>只能对自定义类型重载</b>：<code>int operator+(int, int)</code> 非法的，至少一边得是你自己的类型。"
      ],
      "concl": "重载只能改「自定义类型怎么算」，改不了优先级、参数个数和短路规则；<code>&amp;&amp;</code> / <code>||</code> 不要重载。",
      "terms": "「短路求值（short-circuit evaluation）」；「可重载运算符」与「不可重载运算符」的界限由标准规定。",
      "tags": [
        "运算符重载",
        "短路"
      ],
      "board": "",
      "quizIds": [
        "d5s05",
        "d5j01"
      ]
    },
    {
      "id": "d5c47",
      "num": 47,
      "title": "前置 ++ 和后置 ++：靠一个占位 int 分开",
      "pain": "<b>没有它会怎样</b>：<code>++a</code> 和 <code>a++</code> 的运算符长得一模一样，编译器怎么知道该调哪个函数？不重载的话对象根本不能自增。<b>办法是给后置版多塞一个没用的 <code>int</code> 参数</b>当记号，就像<b>两张同样的取件单，后置那张多盖了一个「存根」章</b>，柜台一眼就能分开。",
      "analogy": "两张一样的取件单，后置那张多盖一个存根章",
      "only": "",
      "guess": "先猜：<code>c++</code> 返回的是加完之后的值，还是加之前的值？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;                            // 直接写 cout\n\nclass Counter {\n    int v;\npublic:\n    Counter(int v) : v(v) {}\n\n    Counter& operator++() {                     // 前置：++c\n        ++v;\n        return *this;                           // 返回加完的自己\n    }\n\n    Counter operator++(int) {                   // 后置：c++（int 是占位记号）\n        Counter old = *this;                    // 先留一份旧值\n        ++v;\n        return old;                             // 返回旧值\n    }\n\n    int get() const { return v; }\n};\n\nint main() {\n    Counter c(5);\n    cout << (++c).get() << \"\\n\";    // 6：前置返回新的\n    cout << (c++).get() << \"\\n\";    // 6：后置返回旧的\n    cout << c.get() << \"\\n\";        // 7：但自己已经加了\n}",
      "output": "6\n6\n7",
      "errors": [],
      "pitfalls": [
        "<b>占位参数不用名字</b>：<code>operator++(int)</code> 里那个 <code>int</code> 只用来区分重载，调用时编译器自动传 0，你写不写形参名都行。",
        "<b>后置多一次拷贝</b>：要先存旧值，所以比前置慢一点；能写 <code>++c</code> 就别写 <code>c++</code>。",
        "<b>前置返回引用</b>：<code>Counter&amp;</code> 返回自己，避免再拷贝一份。",
        "<b>两个都写</b>：只写前置，<code>c++</code> 会退化成内置语义而编译不过；要就成对写。"
      ],
      "concl": "前置 <code>operator++()</code> 返回新值引用；后置 <code>operator++(int)</code> 用占位 int 区分，返回旧值副本。",
      "terms": "「前置自增 / 后置自增（prefix / postfix increment）」；那个 <code>int</code> 叫「占位参数（dummy parameter）」。",
      "tags": [
        "operator++",
        "自增"
      ],
      "board": "",
      "quizIds": [
        "d5s06",
        "d5f01"
      ]
    },
    {
      "id": "d5c48",
      "num": 48,
      "title": "operator+：返回新对象，别返回局部变量的引用",
      "pain": "<b>没有它会怎样</b>：两个对象相加，直觉上就该得到第三个新对象；如果返回引用，你交出去的要么是临时变量（函数一结束就没了），要么是其中一个操作数被改坏。<b>加法像把两杯水倒进第三只杯子</b>：原来两杯都还在，只是多了一杯。",
      "analogy": "两杯水倒进第三只杯子，原来两杯都还在",
      "only": "",
      "guess": "先猜：<code>a + b + c</code> 能一路连下去，靠的是返回类型还是参数类型？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;                        // 直接写 cout\n\nclass Num {\npublic:\n    int v;\n    Num(int v) : v(v) {}\n    Num operator+(const Num& o) const {     // 返回值：新对象\n        return Num(v + o.v);\n    }\n};\n\nint main() {\n    Num a(1), b(2), c(3);\n    Num d = a + b + c;                      // 先算 a+b，再加 c\n    cout << d.v << \"\\n\";       // 6\n    cout << a.v << \" \" << b.v << \"\\n\";   // 1 2：原来两个没被改\n}",
      "output": "6\n1 2",
      "errors": [],
      "pitfalls": [
        "<b>返回类型写值不写引用</b>：<code>Num</code> 而不是 <code>Num&amp;</code>。返回引用就指向了函数里的临时对象，函数一结束就悬空。",
        "<b>参数用 const 引用</b>：省一次拷贝，也保证不偷改右操作数。",
        "<b>函数后面加 const</b>：表示「我不改自己」，这样常对象也能参与相加。",
        "<b>连续相加靠返回值</b>：每一步都产出一个新对象，下一步拿它当左操作数。"
      ],
      "concl": "<code>operator+</code> 返回新对象（值），参数用 <code>const T&amp;</code>，两个操作数都不改。",
      "terms": "「值语义（value semantics）」；返回的那个临时对象叫「右值」。",
      "tags": [
        "operator+"
      ],
      "board": "",
      "quizIds": [
        "d5s07",
        "d5s08"
      ]
    },
    {
      "id": "d5c49",
      "num": 49,
      "title": "operator=：两个已经存在的对象之间才走它",
      "pain": "<b>没有它会怎样</b>：<code>b = a</code> 和 <code>Stu b = a</code> 长得几乎一样，行为却不同——前者是<b>赋值</b>（覆盖已有对象），后者是<b>拷贝构造</b>（出生时初始化）。不重载 <code>=</code> 时编译器给一份逐成员拷贝，遇到指针就是浅拷贝。<b>赋值像把旧文件抽出来换一份新的</b>：先清空抽屉，再放进去。",
      "analogy": "先清空抽屉，再放进新文件",
      "only": "",
      "guess": "先猜：<code>b = a;</code> 会调用拷贝构造吗？<code>Stu c = a;</code> 会调用 <code>operator=</code> 吗？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;                        // 直接写 cout\n\nclass Stu {\npublic:\n    int no;\n    Stu(int no) : no(no) {}\n    Stu& operator=(const Stu& o) {          // 赋值：返回引用\n        if (this == &o) return *this;       // 自赋值保护\n        no = o.no;\n        return *this;                       // 支持 a = b = c\n    }\n};\n\nint main() {\n    Stu a(1000), b(2000), c(3000);\n    b = a;                                  // 已经存在 → 调 operator=\n    Stu d = a;                              // 正在出生 → 调拷贝构造\n    cout << b.no << \" \" << d.no << \"\\n\";   // 1000 1000\n    a = b = c;                              // 连续赋值\n    cout << a.no << \"\\n\";   // 3000\n}",
      "output": "1000 1000\n3000",
      "errors": [],
      "pitfalls": [
        "<b>时机不同</b>：<code>Stu d = a;</code> 是初始化，走拷贝构造；<code>d = a;</code> 是赋值，走 <code>operator=</code>。",
        "<b>先释放再申请</b>：类里有指针时，赋值前要把自己原来的空间 <code>delete</code> 掉，否则旧内存泄漏。",
        "<b>自赋值要挡</b>：<code>a = a;</code> 如果不判 <code>this == &amp;o</code>，先 delete 再读自己就是读已释放内存。",
        "<b>返回 <code>*this</code> 的引用</b>：返回 <code>void</code> 就不能连续赋值，返回对象值会多一次拷贝。"
      ],
      "concl": "<code>=</code> 只在两个已有对象之间调用；要自赋值保护、先释放旧资源、返回 <code>*this</code> 的引用。",
      "terms": "「拷贝赋值运算符（copy assignment operator）」；与「拷贝构造」合称三法则里的两样。",
      "tags": [
        "operator=",
        "赋值"
      ],
      "board": "",
      "quizIds": [
        "d5s09",
        "d5j02"
      ]
    },
    {
      "id": "d5c50",
      "num": 50,
      "title": "operator== 和 !=：对象怎么算「相等」由你定",
      "pain": "<b>没有它会怎样</b>：<code>a == b</code> 对两个对象直接报错，编译器不知道你是想比学号、比名字，还是比地址。<b>重载 <code>==</code> 就是你亲自定一条「相等」的标准</b>，像<b>门卫核对工牌：照片、姓名、编号都对上才算同一个人</b>。",
      "analogy": "门卫核对工牌：几项都对上才算同一个人",
      "only": "",
      "guess": "先猜：只写 <code>==</code> 不写 <code>!=</code>，<code>a != b</code> 能编译吗？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;                                    // 直接写 cout\n\nclass Stu {\n    int no;\n    string name;\npublic:\n    Stu(int no, string name) : no(no), name(name) {}\n\n    bool operator==(const Stu& o) const {\n        return no == o.no && name == o.name;            // 两项都对上才算相等\n    }\n    bool operator!=(const Stu& o) const {\n        return !(*this == o);                           // 直接用 == 取反\n    }\n};\n\nint main() {\n    Stu a(1, \"张三\"), b(1, \"张三\"), c(2, \"李四\");\n    cout << (a == b) << \"\\n\";   // 1：内容一样\n    cout << (a != c) << \"\\n\";   // 1：内容不同\n}",
      "output": "1\n1",
      "errors": [],
      "pitfalls": [
        "<b>比较的是内容不是地址</b>：默认的 <code>==</code> 根本没有，你得自己写清楚比哪几个成员。",
        "<b><code>!=</code> 用 <code>==</code> 取反</b>：两处逻辑只写一遍，以后改规则不会漏。",
        "<b>参数用 const 引用</b>：比较不该改任何一个对象。",
        "<b>和 <code>strcmp</code> 区分</b>：C 字符串比内容要用 <code>strcmp</code>，直接 <code>==</code> 比的是地址。"
      ],
      "concl": "<code>==</code> 由你定义「相等」的字段；<code>!=</code> 直接拿 <code>==</code> 取反，保证两边规则一致。",
      "terms": "「相等比较运算符」；返回 <code>bool</code>、参数 <code>const T&amp;</code>、函数尾 <code>const</code> 是标准写法。",
      "tags": [
        "operator==",
        "比较"
      ],
      "board": "",
      "quizIds": [
        "d5s10",
        "d5s11"
      ]
    },
    {
      "id": "d5c51",
      "num": 51,
      "title": "operator()：让对象长得像函数（仿函数）",
      "pain": "<b>没有它会怎样</b>：想把「加 10」这个动作带着参数到处传，普通函数得靠函数指针，写法又长又难读。<b>重载 <code>()</code> 之后对象自己就能被调用</b>，还能顺便把状态（这里是 <code>base</code>）一起带走——像<b>一台预设好刻度的打孔机</b>，按一下就按你的刻度打一个孔。",
      "analogy": "预设好刻度的打孔机，按一下就按你的刻度打孔",
      "only": "",
      "guess": "先猜：<code>add10(5)</code> 里，<code>add10</code> 是函数名还是对象名？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;                            // 直接写 cout\n\nclass Add {\n    int base;                                   // 对象自己带的状态\npublic:\n    Add(int base) : base(base) {}\n    int operator()(int x) const {               // 重载 ()\n        return x + base;\n    }\n};\n\nint main() {\n    Add add10(10);\n    cout << add10(5) << \"\\n\";      // 15：对象 + () = 调用\n    cout << Add(1)(2) << \"\\n\";     // 3：临时对象也能直接调\n}",
      "output": "15\n3",
      "errors": [],
      "pitfalls": [
        "<b>它还是对象</b>：<code>add10</code> 有成员、能拷贝、能存进容器，比函数指针灵活。",
        "<b>也叫仿函数</b>：标准库的排序、<code>for_each</code> 都吃这种「能调的对象」。",
        "<b>通常写成 const</b>：调用不该改自己的状态，常对象才能用。",
        "<b>别和 <code>operator=</code> 混</b>：<code>()</code> 是调用，<code>=</code> 是赋值，两个完全不同的运算符。"
      ],
      "concl": "<code>operator()</code> 让对象能像函数一样被调用，还能带着成员状态，这就是仿函数。",
      "terms": "正式叫「函数调用运算符」；这种对象叫「仿函数（functor）」，C++11 之后常写成 lambda。",
      "tags": [
        "operator()",
        "仿函数"
      ],
      "board": "",
      "quizIds": [
        "d5s12",
        "d5j03"
      ]
    },
    {
      "id": "d5c52",
      "num": 52,
      "title": "operator* 和 ->：智能指针靠这两个装成指针",
      "pain": "<b>没有它会怎样</b>：<code>new</code> 出来的对象，忘了 <code>delete</code> 就泄漏；每次都记得释放又太累。<b>把指针包进一个类，在析构里 delete</b>，再重载 <code>*</code> 和 <code>-&gt;</code> 让它用起来还像指针——这就是智能指针。<b>像给钥匙配了个会自动归还的钥匙扣</b>：你走的时候它自己把钥匙还回去。",
      "analogy": "给钥匙配个会自动归还的钥匙扣",
      "only": "",
      "guess": "先猜：<code>q-&gt;hi()</code> 真正调用的是 <code>Ptr</code> 的哪个函数？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;                        // 直接写 cout\n\nclass Demo {\npublic:\n    Demo()  { cout << \"构造\\n\"; }\n    ~Demo() { cout << \"析构\\n\"; }\n    void hi() { cout << \"hi\\n\"; }\n};\n\nclass Ptr {\n    Demo* p;\npublic:\n    Ptr(Demo* p) : p(p) {}\n    ~Ptr() { delete p; }                    // 局部对象一销毁就自动释放\n    Demo& operator*()  { return *p; }       // *q  → 对象本身\n    Demo* operator->() { return p; }        // q-> → 真正的指针\n};\n\nint main() {\n    Ptr q(new Demo());\n    q->hi();                                // 等价于 (q.operator->())->hi()\n    (*q).hi();                              // 等价于 (q.operator*()).hi()\n}                                           // 这里 q 析构，Demo 跟着释放",
      "output": "构造\nhi\nhi\n析构",
      "errors": [],
      "pitfalls": [
        "<b><code>-&gt;</code> 会自动再接一次</b>：<code>q-&gt;hi()</code> 编译成 <code>(q.operator-&gt;())-&gt;hi()</code>，所以 <code>operator-&gt;</code> 必须返回真正的指针。",
        "<b>这两个只能写成员函数</b>：<code>*</code> 和 <code>-&gt;</code> 不能写成全局的。",
        "<b>还要管拷贝</b>：默认拷贝会让两个 <code>Ptr</code> 指向同一块内存，析构时二次释放；要写拷贝构造或 <code>= delete</code>。",
        "<b>这只是原理模型</b>：工程里直接用 <code>std::unique_ptr</code> / <code>shared_ptr</code>，行为和它一个思路。"
      ],
      "concl": "把裸指针包进类，析构里 delete，再重载 <code>*</code> 和 <code>-&gt;</code>，就是智能指针的基本原理。",
      "terms": "「智能指针（smart pointer）」；<code>operator-&gt;</code> 这种「返回指针再继续 -&gt;」的行为叫「箭头运算符的链式转发」。",
      "tags": [
        "operator*",
        "operator->",
        "智能指针"
      ],
      "board": "",
      "quizIds": [
        "d5s13",
        "d5s14"
      ]
    },
    {
      "id": "d5c53",
      "num": 53,
      "title": "三条硬规定：哪些只能成员、哪些只能全局",
      "pain": "<b>没有它会怎样</b>：<code>operator=</code>、<code>[]</code>、<code>()</code>、<code>-&gt;</code> 写成全局函数编译不过；<code>&lt;&lt;</code> 写成成员函数也编译不过。这些不是风格偏好，是<b>语法写死的</b>——像<b>门禁卡只能刷自己那扇门</b>，刷错了机器直接不认。",
      "analogy": "门禁卡只能刷自己那扇门，刷错机器不认",
      "only": "",
      "guess": "先猜：为什么 <code>=</code> 和 <code>[]</code> 被要求必须是成员函数？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;                            // 直接写 cout\n\nclass Arr {\n    int a[3] = {1, 2, 3};\npublic:\n    int& operator[](int i) { return a[i]; }     // [] 只能是成员函数\n    friend ostream& operator<<(ostream& os, const Arr& x);  // << 只能全局 + 友元\n};\n\nostream& operator<<(ostream& os, const Arr& x) {\n    for (int i = 0; i < 3; i++) {\n        if (i) os << \" \";\n        os << x.a[i];\n    }\n    return os;\n}\n\nint main() {\n    Arr x;\n    x[1] = 7;                                   // 通过 [] 改内部\n    cout << x << endl;                          // 1 7 3\n}",
      "output": "1 7 3",
      "errors": [],
      "pitfalls": [
        "<b><code>= [] () -&gt;</code> 只能成员</b>：它们都要直接动「当前对象」，写成全局没法表达。",
        "<b><code>&lt;&lt; &gt;&gt;</code> 只能全局</b>：左操作数是流对象，不是你自己的类，写成员就站错位置了。",
        "<b><code>+ - == &lt;</code> 两边都行</b>：成员少写一个参数，全局写两个；选一种保持全类统一。",
        "<b>友元不是成员</b>：全局版要访问 private，必须在类里 <code>friend</code> 声明一次。"
      ],
      "concl": "<code>= [] () -&gt;</code> 必须成员；<code>&lt;&lt; &gt;&gt;</code> 必须全局 + 友元；其余两种写法都行，但要统一。",
      "terms": "「成员函数形式」与「非成员（全局）形式」的运算符重载；标准只对少数运算符限制必须是成员。",
      "tags": [
        "运算符重载",
        "规则"
      ],
      "board": "",
      "quizIds": [
        "d5s15",
        "d5f02"
      ]
    },
    {
      "id": "d5c54",
      "num": 54,
      "title": "MyString ①：一个只有指针的类，必须自己管三件事",
      "pain": "<b>没有它会怎样</b>：字符串长度运行时才知道，只能用 <code>char*</code> 加 <code>new</code>。可一旦成员里有裸指针，默认的拷贝就只抄地址：两个对象共用一块内存，析构时 <code>delete</code> 两次直接崩。<b>像两个人共用一把钥匙，走的时候都去退房，前台只能报警</b>。",
      "analogy": "两个人共用一把钥匙，都去退房，前台报警",
      "only": "",
      "guess": "先猜：不写拷贝构造，<code>MyString b = a;</code> 之后两个对象的 <code>str</code> 指向同一块内存吗？",
      "codeMin": "",
      "codeFull": "#include <iostream>\n#include <cstring>\nusing namespace std;                            // 直接写 cout\n\nclass MyString {\n    char* str;                                  // 指向自己申请的那块\n    int size;\npublic:\n    MyString() : str(nullptr), size(0) {}       // 空串\n    MyString(const char* s) {                   // 有参构造：自己租地\n        size = strlen(s);\n        str = new char[size + 1];\n        strcpy(str, s);\n    }\n    MyString(const MyString& o) {               // 深拷贝：另租一块\n        size = o.size;\n        str = new char[size + 1];\n        strcpy(str, o.str);\n    }\n    ~MyString() { delete[] str; }               // 退房\n    void print() const { cout << str << endl; }\n};\n\nint main() {\n    MyString a(\"hello\");\n    MyString b = a;                             // 调深拷贝\n    a.print();                                  // hello\n    b.print();                                  // hello\n}",
      "output": "hello\nhello",
      "errors": [],
      "pitfalls": [
        "<b>为什么要 +1</b>：<code>strlen</code> 不算结尾的 <code>\\0</code>，多申请一个字节放它。",
        "<b>析构用 <code>delete[]</code></b>：<code>new char[]</code> 配 <code>delete[]</code>，配错了是未定义行为。",
        "<b>拷贝构造要深拷</b>：只写 <code>str = o.str</code> 就是浅拷贝，两个对象共用一块。",
        "<b>三件事成套</b>：析构、拷贝构造、拷贝赋值，只要管了其中一件，另外两件通常也得写。"
      ],
      "concl": "类里有 <code>new</code> 出来的指针，就必须自己写析构、拷贝构造（深拷贝）和拷贝赋值。",
      "terms": "「三法则（Rule of Three）」；<code>strlen</code> / <code>strcpy</code> 来自 C 的 <code>&lt;cstring&gt;</code>。",
      "tags": [
        "MyString",
        "深拷贝",
        "析构"
      ],
      "board": "",
      "quizIds": [
        "d5s16",
        "d5j04"
      ]
    },
    {
      "id": "d5c55",
      "num": 55,
      "title": "MyString ②：把 +、[]、= 和 << 都接上",
      "pain": "<b>没有它会怎样</b>：字符串类光能存还不能用，想拼接得写成员函数，想取一个字符得写 <code>get(i)</code>，和 <code>std::string</code> 的手感差太远。<b>把这些运算符接上</b>，对象才真的像「字符串」——像<b>给一台裸机装上熟悉的按键面板</b>，功能没变，但闭着眼也会用。",
      "analogy": "给裸机装上熟悉的按键面板",
      "only": "",
      "guess": "先猜：<code>operator[]</code> 返回 <code>char</code> 还是 <code>char&amp;</code>？返回值的区别在哪？",
      "codeMin": "",
      "codeFull": "#include <iostream>\n#include <cstring>\nusing namespace std;\n\nclass MyString {\n    char* str;\n    int size;\npublic:\n    MyString() : str(nullptr), size(0) {}\n    MyString(const char* s) {\n        size = strlen(s);\n        str = new char[size + 1];\n        strcpy(str, s);\n    }\n    MyString(const MyString& o) {\n        size = o.size;\n        str = new char[size + 1];\n        strcpy(str, o.str);\n    }\n    ~MyString() { delete[] str; }\n\n    MyString& operator=(const MyString& o) {    // 赋值：先退房再租新的\n        if (this == &o) return *this;\n        delete[] str;\n        size = o.size;\n        str = new char[size + 1];\n        strcpy(str, o.str);\n        return *this;\n    }\n\n    char& operator[](int i) { return str[i]; }  // 返回引用，才能 x[0] = 'H'\n\n    MyString operator+(const MyString& o) const {\n        MyString t;                             // 新对象：长度相加\n        t.size = size + o.size;\n        t.str = new char[t.size + 1];\n        strcpy(t.str, str);\n        strcat(t.str, o.str);\n        return t;\n    }\n\n    bool operator==(const MyString& o) const {\n        return strcmp(str, o.str) == 0;\n    }\n\n    friend ostream& operator<<(ostream& os, const MyString& s) {\n        os << s.str;\n        return os;\n    }\n};\n\nint main() {\n    MyString a(\"hello\"), b(\" world\");\n    MyString c = a + b;\n    cout << c << endl;              // hello world\n    c[0] = 'H';                     // [] 返回引用才能改\n    cout << c << endl;              // Hello world\n    MyString d;\n    d = c;                          // 赋值\n    cout << (d == c) << endl;   // 1\n}",
      "output": "hello world\nHello world\n1",
      "errors": [],
      "pitfalls": [
        "<b><code>[]</code> 返回 <code>char&amp;</code></b>：返回 <code>char</code> 只是副本，<code>c[0] = 'H'</code> 改不到里面。",
        "<b>赋值先 <code>delete[]</code></b>：旧空间不释放就是泄漏；不判自赋值则可能读已释放内存。",
        "<b><code>+</code> 返回新对象</b>：不能返回引用，因为 <code>t</code> 是局部对象。",
        "<b>比较用 <code>strcmp</code></b>：<code>str == o.str</code> 比的是两个地址，永远不等。"
      ],
      "concl": "<code>+</code> 返回新对象、<code>[]</code> 返回引用、<code>=</code> 先释放后拷贝、<code>==</code> 用 <code>strcmp</code>；四件凑齐才像个字符串。",
      "terms": "这套组合就是「值类型（value type）」的典型接口；标准库的 <code>std::string</code> 提供的就是这一组操作。",
      "tags": [
        "MyString",
        "operator+",
        "operator[]"
      ],
      "board": "",
      "quizIds": [
        "d5s17",
        "d5c01"
      ]
    },
    {
      "id": "d5c56",
      "num": 56,
      "title": "继承：把父类的东西整套搬过来",
      "pain": "<b>没有它会怎样</b>：Dog、Cat、Bird 都有腿、都会叫，不继承就得每个类抄一遍 <code>legs</code> 和 <code>speak()</code>，改一处要改三处。<b>继承</b>就是<b>子承父业</b>：父类的成员和数据整套带过来，子类只补自己那点新本事。",
      "analogy": "子承父业：父类的东西整套带过来，只补新的",
      "only": "",
      "guess": "先猜：<code>Dog</code> 对象里，<code>legs</code> 是父类的还是子类自己又存了一份？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;                            // 直接写 cout\n\nclass Animal {\npublic:\n    int legs;\n    Animal(int l) : legs(l) {}                  // 父类构造\n    void speak() { cout << \"...\" << endl; }     // 共性\n};\n\nclass Dog : public Animal {                     // public 继承\npublic:\n    Dog() : Animal(4) {}                        // 初始化列表里调父类构造\n    void bark() { cout << \"wang\" << endl; }     // 个性\n};\n\nint main() {\n    Dog d;\n    cout << d.legs << endl;    // 4：继承来的成员\n    d.speak();                 // ...：继承来的函数\n    d.bark();                  // wang：自己新增的\n}",
      "output": "4\n...\nwang",
      "errors": [],
      "pitfalls": [
        "<b>父类构造要显式调</b>：父类没有无参构造时，子类必须在初始化列表写 <code>Animal(4)</code>，否则编译报错。",
        "<b>public 继承最常用</b>：另外两种（protected / private）会把父类成员的可见性往下压，日常几乎不用。",
        "<b>「是一个」才继承</b>：Dog 是 Animal 才继承；只是「有一个」应该用成员对象，别硬套继承。",
        "<b>子类比父类大</b>：子类对象里包含父类那部分，<code>sizeof(Dog)</code> 至少是 <code>sizeof(Animal)</code>。"
      ],
      "concl": "继承让子类自动拥有父类的成员和函数，只补自己的部分；父类构造在初始化列表里调。",
      "terms": "「基类 / 派生类（base / derived）」也叫「父类 / 子类」；<code>class Dog : public Animal</code> 叫「继承列表」。",
      "tags": [
        "继承",
        "继承方式"
      ],
      "board": "",
      "quizIds": [
        "d5s18",
        "d5f03"
      ]
    },
    {
      "id": "d5c57",
      "num": 57,
      "title": "派生类访问控制：继承来的成员不一定碰得到",
      "pain": "<b>没有它会怎样</b>：以为继承了就什么都能用，结果在子类里访问父类 private 成员直接编译报错。<b>继承只搬成员，不改权限</b>：父类的 private 到了子类依然摸不到，只能通过父类留下的 public 函数间接用——像<b>继承了房子，但保险柜密码没给你</b>。",
      "analogy": "继承了房子，但保险柜密码没给你",
      "only": "",
      "guess": "先猜：父类的 protected 成员，子类里能访问吗？类外呢？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;                        // 直接写 cout\n\nclass Parent {\npublic:\n    int a = 1;\nprotected:\n    int b = 2;\nprivate:\n    int c = 3;\npublic:\n    int getC() { return c; }                // 父类自己留的窗口\n};\n\nclass Son : public Parent {\npublic:\n    void show() {\n        cout << a << \" \" << b << endl;      // a、b 能访问\n        // cout << c;                       // 编译报错：private 摸不到\n    }\n};\n\nint main() {\n    Son s;\n    s.show();                    // 1 2\n    cout << s.a << endl;         // 1：public 类外也能用\n    cout << s.getC() << endl;    // 3：只能走父类的窗口\n}",
      "output": "1 2\n1\n3",
      "errors": [],
      "pitfalls": [
        "<b>public 继承＝权限不变</b>：父类的 public 还是 public、protected 还是 protected，只有 private 一律不可直接访问。",
        "<b>protected 只对子类开放</b>：子类里能用，类外不能用，是「留给后代」的档位。",
        "<b>private 只能用父类的函数绕</b>：这就是封装，子类也不能破例。",
        "<b>protected / private 继承会压低权限</b>：父类 public 成员在子类里会变成 protected / private，工程里很少用。"
      ],
      "concl": "继承不改父类成员的权限：public 照旧、protected 子类可用、private 谁都不能直接碰。",
      "terms": "「访问控制（access control）」；三种继承方式 <code>public</code> / <code>protected</code> / <code>private</code> 只影响继承来的成员在子类里的可见性。",
      "tags": [
        "继承",
        "访问权限"
      ],
      "board": "",
      "quizIds": [
        "d5s19",
        "d5j05"
      ]
    },
    {
      "id": "d5c58",
      "num": 58,
      "title": "继承里的构造与析构：父 → 成员 → 子，析构倒着来",
      "pain": "<b>没有它会怎样</b>：父类还没准备好，子类就去用它继承来的成员，读到的是垃圾值。<b>顺序是定死的</b>：先父类、再成员对象、最后子类自己的函数体；析构完全反过来——像<b>盖楼先打地基再砌墙，拆楼先拆墙再挖地基</b>。",
      "analogy": "盖楼先地基后墙，拆楼先墙后地基",
      "only": "",
      "guess": "先猜：一个子类对象里有成员对象时，构造顺序是「父类 → 成员 → 子类」还是「父类 → 子类 → 成员」？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;                    // 直接写 cout\n\nstruct Mem {\n    Mem()  { cout << \"成员构造\" << endl; }\n    ~Mem() { cout << \"成员析构\" << endl; }\n};\n\nclass Parent {\npublic:\n    Parent()  { cout << \"父类构造\" << endl; }\n    ~Parent() { cout << \"父类析构\" << endl; }\n};\n\nclass Son : public Parent {\n    Mem m;                              // 成员对象\npublic:\n    Son()  { cout << \"子类构造\" << endl; }\n    ~Son() { cout << \"子类析构\" << endl; }\n};\n\nint main() {\n    Son s;                              // 只造一个对象\n}",
      "output": "父类构造\n成员构造\n子类构造\n子类析构\n成员析构\n父类析构",
      "errors": [],
      "pitfalls": [
        "<b>顺序固定</b>：父类构造 → 成员对象构造（按声明顺序）→ 子类构造体；析构完全逆序。",
        "<b>初始化列表不决定成员顺序</b>：成员按「在类里声明的先后」构造，跟你在初始化列表里写的顺序无关。",
        "<b>父类析构要 virtual</b>：用父类指针 delete 子类对象时，父类析构不是虚函数就只析构父类那部分，子类的资源漏掉。",
        "<b>有参构造靠初始化列表</b>：想让父类或成员走有参构造，只能写在初始化列表里。"
      ],
      "concl": "构造：父类 → 成员对象 → 子类；析构严格相反。要删子类对象时，父类析构必须 virtual。",
      "terms": "「对象模型」；父类的析构函数声明成 <code>virtual ~Parent()</code> 叫「虚析构」。",
      "tags": [
        "继承",
        "构造析构顺序"
      ],
      "board": "",
      "quizIds": [
        "d5s20",
        "d5c02"
      ]
    },
    {
      "id": "d5c59",
      "num": 59,
      "title": "同名成员：默认就近，想用父类的就加 ::",
      "pain": "<b>没有它会怎样</b>：子类也定义了一个 <code>a</code>，那 <code>son.a</code> 到底指哪个？直接报错还是随便挑一个？<b>规则是就近</b>：默认用子类自己的，要用父类那份就写 <code>son.Parent::a</code>——像<b>同名两家店，默认进离你近的那家，要去另一家得报清门牌</b>。",
      "analogy": "同名两家店，默认进近的，去另一家要报门牌",
      "only": "",
      "guess": "先猜：子类重定义了同名函数（参数不同），父类那些重载还能直接调吗？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;                        // 直接写 cout\n\nclass Parent {\npublic:\n    int a;\n    Parent(int a) : a(a) {}\n    void f()      { cout << \"父类f\" << endl; }\n    void f(int x) { cout << \"父类f(int)\" << endl; }\n};\n\nclass Son : public Parent {\npublic:\n    int a;                                  // 同名成员变量\n    Son(int a1, int a2) : Parent(a1), a(a2) {}\n    void f() { cout << \"子类f\" << endl; }   // 同名函数，把父类的 f 全遮住\n};\n\nint main() {\n    Son s(10, 20);\n    cout << s.a << \" \" << s.Parent::a << endl;   // 20 10\n    s.f();                                       // 子类f\n    s.Parent::f(1);                              // 父类f(int)：加作用域才够得着\n}",
      "output": "20 10\n子类f\n父类f(int)",
      "errors": [],
      "pitfalls": [
        "<b>变量同名互不影响</b>：子类那份和父类那份是两块内存，<code>s.a</code> 只是默认指子类那块。",
        "<b>函数同名会整体遮蔽</b>：子类写了 <code>f()</code>，父类的 <code>f(int)</code> 也一起被遮住，不加作用域就调不到。",
        "<b>作用域要写全</b>：<code>Parent::f(1)</code>，只写 <code>f(1)</code> 还是先找子类。",
        "<b>能用 <code>using</code> 解开</b>：子类里写 <code>using Parent::f;</code> 可以把父类那组重载重新放出来。"
      ],
      "concl": "同名成员默认用子类那份；要父类那份就加 <code>类名::</code>，函数同名会整体遮蔽。",
      "terms": "「名字隐藏（name hiding）」；用作用域限定符 <code>::</code> 指明要找哪个类里的名字。",
      "tags": [
        "继承",
        "同名成员",
        "作用域"
      ],
      "board": "",
      "quizIds": [
        "d5s21",
        "d5s22"
      ]
    },
    {
      "id": "d5c60",
      "num": 60,
      "title": "继承不带走的三样，和照样共享的静态成员",
      "pain": "<b>没有它会怎样</b>：以为构造函数也会继承，子类不写构造却发现编译不过；以为 <code>=</code> 能直接用，结果拷贝出来是浅的。<b>构造、析构、<code>operator=</code> 都不会被继承</b>，编译器给子类各生成一份——像<b>搬家带走了家具，但水电过户得自己重新办</b>。",
      "analogy": "搬家带走家具，水电过户得自己重新办",
      "only": "",
      "guess": "先猜：父类有一个静态成员 <code>n</code>，子类构造里能直接 <code>n++</code> 吗？改的是同一份吗？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;                    // 直接写 cout\n\nclass Parent {\npublic:\n    static int n;                       // 全类共用\n    Parent() { n++; }\n};\nint Parent::n = 0;\n\nclass Son : public Parent {\npublic:\n    Son() { n++; }                      // 继承来的静态成员，能直接用\n};\n\nint main() {\n    Parent p;                           // n = 1\n    Son s;                              // 父类构造 +1、子类构造 +1 → n = 3\n    cout << Parent::n << \" \" << Son::n << endl;   // 3 3：同一份\n}",
      "output": "3 3",
      "errors": [],
      "pitfalls": [
        "<b>构造 / 析构不继承</b>：子类必须自己写（或让编译器生成）构造函数，并在里面安排父类构造。",
        "<b><code>operator=</code> 不继承</b>：它干的是构造类似的活，子类版本要自己生成或自己写。",
        "<b>静态成员是共享的</b>：父类那份只有一块，子类里改也是改它；<code>Parent::n</code> 和 <code>Son::n</code> 是同一个。",
        "<b>静态函数也能继承</b>：但子类重定义同名静态函数，同样会把父类那组重载全遮住。"
      ],
      "concl": "构造、析构、<code>operator=</code> 不会被继承，必须各自生成；静态成员则被子类共享同一份。",
      "terms": "「非自动继承的成员函数」；<code>operator=</code> 不继承的原因是它和构造一样要处理「新对象」的初始化。",
      "tags": [
        "继承",
        "static",
        "operator="
      ],
      "board": "",
      "quizIds": [
        "d5s23",
        "d5j06"
      ]
    },
    {
      "id": "d5c61",
      "num": 61,
      "title": "多继承：一个子类认两个爹，就有了二义性",
      "pain": "<b>没有它会怎样</b>：想同时拥有 A 和 B 的能力，只能选一个继承，另一个塞成成员。C++ 允许<b>多继承</b>，但两个父类都有 <code>a</code> 时，<code>son.a</code> 就不知道该指谁，编译器直接报 ambiguous——像<b>两个孩子同名，老师点名必须带姓</b>。",
      "analogy": "两个孩子同名，点名必须带姓",
      "only": "",
      "guess": "先猜：<code>class Son : public A, public B</code> 之后，如果 A 和 B 都有 <code>a</code>，<code>son.a</code> 能编译吗？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;                // 直接写 cout\n\nclass A { public: int a = 10; };\nclass B { public: int a = 20; };\n\nclass C : public A, public B {      // 多继承：两个父类\npublic:\n    int c = 30;\n};\n\nint main() {\n    C x;\n    // cout << x.a;                 // 编译报错：ambiguous，不知道该用哪个 a\n    cout << x.A::a << \" \" << x.B::a << endl;   // 10 20：带类名就清楚了\n    cout << x.c << endl;                        // 30：自己的没歧义\n}",
      "output": "10 20\n30",
      "errors": [],
      "pitfalls": [
        "<b>同名就二义</b>：变量、函数同名都算，必须 <code>x.A::a</code> 这样指明来自哪个父类。",
        "<b>构造顺序按继承列表</b>：<code>: public A, public B</code> 就先构造 A 再构造 B，和初始化列表书写顺序无关。",
        "<b>能不用就别用</b>：多继承让代码难维护，工程里绝大多数场景用单继承 + 成员对象就能替代。",
        "<b>菱形必须处理</b>：两个父类又继承同一个祖先时，问题会升级成「重复继承」，得靠虚继承。"
      ],
      "concl": "多继承会带来同名二义性，访问时用 <code>类名::</code> 指明来源；工程中应尽量少用。",
      "terms": "「多重继承（multiple inheritance）」；编译器的报错关键词是 <code>ambiguous</code>（有歧义）。",
      "tags": [
        "多继承",
        "二义性"
      ],
      "board": "",
      "quizIds": [
        "d5s24",
        "d5f04"
      ]
    },
    {
      "id": "d5c62",
      "num": 62,
      "title": "菱形继承与虚继承：让公共祖先只留一份",
      "pain": "<b>没有它会怎样</b>：马继承动物、驴也继承动物，骡同时继承马和驴，于是骡里面装了两份「动物」——<code>mule.a</code> 有二义性，数据也重复。<b>虚继承</b>就是让马和驴声明「这份祖先我不独占」，最后只共享一份——像<b>两家分公司共用同一个总部账户，不再各开一份</b>。",
      "analogy": "两家分公司共用同一个总部账户，不各开一份",
      "only": "",
      "guess": "先猜：虚继承之后 <code>sizeof(骡)</code> 是变大还是变小？多出来的是什么？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;                    // 直接写 cout\n\nclass Animal { public: int a = 10; };\n\nclass Horse  : virtual public Animal {};   // 虚继承\nclass Donkey : virtual public Animal {};   // 虚继承\nclass Mule   : public Horse, public Donkey {};\n\nclass H2 : public Animal {};               // 普通继承对照\nclass D2 : public Animal {};\nclass M2 : public H2, public D2 {};\n\nint main() {\n    Mule m;\n    cout << m.a << endl;            // 10：不二义，只有一份 Animal\n    cout << sizeof(Mule) << endl;   // 24：两份 vbptr + 一份 int\n    cout << sizeof(M2) << endl;     // 8：两份 Animal 的 int\n}",
      "output": "10\n24\n8",
      "errors": [],
      "pitfalls": [
        "<b>虚继承只解决有公共祖先的情况</b>：两个毫无关系的父类同名，还是得加作用域。",
        "<b>代价是对象变大</b>：每个虚继承的分支多一个 <code>vbptr</code> 指向虚基类表，表里记的是到祖先的偏移量。",
        "<b>虚基类由最底层构造</b>：<code>Mule</code> 的初始化列表里要负责初始化 <code>Animal</code>，中间层的初始化会被忽略。",
        "<b>工程里几乎不用</b>：真正的多继承很少见，能用单继承 + 组合解决就别上菱形。"
      ],
      "concl": "菱形继承的重复数据用虚继承解决：公共祖先只留一份，代价是每个分支多一个 vbptr 和一次间接寻址。",
      "terms": "「菱形继承 / 钻石继承（diamond inheritance）」；「虚继承（virtual inheritance）」；<code>vbptr</code> 指「虚基类指针」，它指向的偏移表叫 <code>vbtable</code>。",
      "tags": [
        "菱形继承",
        "虚继承",
        "多继承"
      ],
      "board": "",
      "quizIds": [
        "d5s25",
        "d5c03"
      ]
    }
  ],
  "taskTitle": "Day 5 · 今天动手",
  "taskDesc": "两个任务都在本机跑。任务 1 把一套运算符接到同一个类上，看清前置和后置的差别；任务 2 打印构造析构顺序，再用 sizeof 验证虚继承到底多出了什么。",
  "tasks": [
    {
      "id": "d5t1",
      "title": "任务 1 · 给 Stu 接一整套运算符",
      "goal": "<b>目标</b>：在一个类上同时接 <code>+</code>、前置/后置 <code>++</code>、<code>==</code>、<code>&lt;&lt;</code>，跑起来对照每一步的值。",
      "code": "#include <iostream>\nusing namespace std;\n\nclass Stu {\n    int no;\npublic:\n    Stu(int no = 0) : no(no) {}\n\n    Stu& operator++() {                     // 前置\n        ++no;\n        return *this;\n    }\n    Stu operator++(int) {                   // 后置：返回旧值\n        Stu t = *this;\n        ++no;\n        return t;\n    }\n    Stu operator+(const Stu& o) const {     // 相加：返回新对象\n        return Stu(no + o.no);\n    }\n    bool operator==(const Stu& o) const {\n        return no == o.no;\n    }\n    friend ostream& operator<<(ostream& os, const Stu& s) {\n        os << s.no;\n        return os;\n    }\n};\n\nint main() {\n    Stu a(1000), b(2000);\n    cout << a + b << endl;      // 3000\n    cout << ++a << endl;        // 1001\n    cout << a++ << endl;        // 1001：后置返回旧值\n    cout << a << endl;          // 1002\n    cout << (a == b) << endl;   // 0\n}",
      "output": "3000\n1001\n1001\n1002\n0",
      "tip": "第 3 行和第 4 行最容易看错：<code>a++</code> 打印的是加之前的值（1001），打印完 <code>a</code> 才变成 1002。这也解释了为什么后置版本要先存一份旧对象。"
    },
    {
      "id": "d5t2",
      "title": "任务 2 · 构造析构顺序 + 虚继承的 sizeof",
      "goal": "<b>目标</b>：先看一个有成员对象的子类怎么构造、怎么析构，再用 <code>sizeof</code> 对比虚继承和普通多继承的对象大小。",
      "code": "#include <iostream>\nusing namespace std;\n\nclass P {\npublic:\n    P()  { cout << \"P构造\" << endl; }\n    ~P() { cout << \"P析构\" << endl; }\n};\n\nstruct M {\n    M()  { cout << \"M构造\" << endl; }\n    ~M() { cout << \"M析构\" << endl; }\n};\n\nclass S : public P {\n    M m;                        // 成员对象\npublic:\n    S()  { cout << \"S构造\" << endl; }\n    ~S() { cout << \"S析构\" << endl; }\n};\n\nclass Animal { public: int a = 10; };\nclass Horse  : virtual public Animal {};\nclass Donkey : virtual public Animal {};\nclass Mule   : public Horse, public Donkey {};\n\nint main() {\n    { S s; }                    // 花括号控制生命周期，出去立刻析构\n    Mule x;\n    cout << x.a << \" \" << sizeof(Mule) << endl;\n}",
      "output": "P构造\nM构造\nS构造\nS析构\nM析构\nP析构\n10 24",
      "tip": "构造是 P → M → S，析构原路返回；虚继承的 <code>Mule</code> 是 24 字节（两个 8 字节 vbptr + 一个 4 字节 int + 4 字节对齐填充），而不是两份 Animal 的 8 字节。"
    }
  ],
  "gloss": {
    "title": "今天这 5 个面试题，先用人话过一遍",
    "html": "<h4>今天这 5 个面试题，先用人话过一遍</h4>\n    <p><b>① 继承方式有哪些？</b>public、protected、private 三种。public 继承最常用：父类的 public 还是 public、protected 还是 protected，private 一律不可直接访问；protected / private 继承会把父类成员的可见性往下压，工程里基本不用。</p>\n    <p><b>② 子类里有对象成员时，构造和析构顺序怎样？</b>构造：父类构造 → 成员对象构造（按声明顺序）→ 子类构造体；析构完全相反。所以打印出来是「父、成员、子、子、成员、父」。</p>\n    <p><b>③ 继承中的同名成员怎么处理？</b>默认就近，用子类自己那份；要父类那份就加作用域 <code>子对象.父类名::成员</code>。函数同名更狠：子类一重定义，父类那组同名重载会被整体遮蔽，只能用作用域或 <code>using</code> 放出来。</p>\n    <p><b>④ 什么是菱形继承？有什么问题？怎么解决？</b>两个类各自继承同一个祖先，又有类同时继承这两个类。问题是公共祖先被继承两份，访问产生二义性、数据也重复。解决办法是让中间层用 <code>virtual</code> 虚继承，公共祖先只保留一份。</p>\n    <p><b>⑤ 虚继承的原理？</b>虚继承的对象里会多一个 <code>vbptr</code>（虚基类指针），它指向 <code>vbtable</code>（虚基类表），表里存的是到公共祖先的偏移量。靠这个偏移量，所有分支找到的都是同一份祖先数据。代价是对象变大、访问多一次间接寻址。</p>\n    <p class=\"say\">运算符重载那条线也别丢：<code>= [] () -&gt;</code> 只能成员，<code>&lt;&lt; &gt;&gt;</code> 只能全局加友元，<code>&amp;&amp;</code> / <code>||</code> 不要重载。下一课进多态，先把今天的 19 张卡过完三关。</p>"
  }
};
