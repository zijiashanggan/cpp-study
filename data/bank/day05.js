window.BANKS = window.BANKS || {};
window.BANKS.day5 = {
  "single": [
    {
      "id": "d5s01",
      "day": "day5",
      "q": "运算符重载本质上是什么？",
      "options": [
        "给运算符换了一套优先级规则",
        "给运算符绑一个函数，遇到对应写法就调用它",
        "让内置类型也能被重新定义",
        "编译器的语法糖，运行时不存在",
      ],
      "ans": 1,
      "why": "<code>a + b</code> 重载后就是 <code>a.operator+(b)</code> 或 <code>operator+(a, b)</code>，本质是一次函数调用，优先级和参数个数都不变。"
    },
    {
      "id": "d5s02",
      "day": "day5",
      "q": "把二元运算符重载成成员函数时，函数要写几个参数？",
      "options": [
        "0 个",
        "1 个（右边那个操作数）",
        "2 个（左右都写）",
        "3 个",
      ],
      "ans": 1,
      "why": "成员函数隐含 <code>this</code> 就是左操作数，所以只写右边那一个参数；写成全局函数才要写两个。"
    },
    {
      "id": "d5s03",
      "day": "day5",
      "code": "class Stu { };\n\nStu& operator<<(ostream& os, const Stu& s);   // 这样声明对不对？",
      "q": "<code>operator&lt;&lt;</code> 为什么不能写成成员函数？",
      "options": [
        "因为成员函数不能返回引用",
        "因为 <code>cout &lt;&lt; stu</code> 的左操作数是 ostream，不是你自己的类",
        "因为成员函数不能访问私有成员",
        "因为 <code>&lt;&lt;</code> 是 C 的关键字",
      ],
      "ans": 1,
      "why": "写成成员函数时，左操作数必须是本类对象；而 <code>cout &lt;&lt; stu</code> 的左边是 <code>ostream</code>，位置对不上，所以只能写成全局函数。"
    },
    {
      "id": "d5s04",
      "day": "day5",
      "q": "<code>ostream&amp; operator&lt;&lt;(ostream&amp; os, const Stu&amp; s)</code> 为什么返回 <code>ostream&amp;</code>，不返回 <code>void</code>？",
      "options": [
        "为了少一次拷贝，性能更好",
        "为了能连续写 <code>cout &lt;&lt; a &lt;&lt; b</code>",
        "因为 C++ 语法强制要求",
        "为了能访问私有成员",
      ],
      "ans": 1,
      "why": "每次 <code>&lt;&lt;</code> 都返回流本身，下一个 <code>&lt;&lt;</code> 才有左操作数接下去。返回 <code>void</code> 就断了链。"
    },
    {
      "id": "d5s05",
      "day": "day5",
      "q": "下面哪个运算符<b>不能</b>被重载？",
      "options": [
        "<code>+</code>",
        "<code>&lt;&lt;</code>",
        "<code>[]</code>",
        "<code>::</code>",
      ],
      "ans": 3,
      "why": "作用域限定符 <code>::</code>、成员访问 <code>.</code>、三目 <code>?:</code>、<code>sizeof</code> 在语法层面根本不接受重载。"
    },
    {
      "id": "d5s06",
      "day": "day5",
      "code": "class C {\npublic:\n    C& operator++();\n    C operator++(int);\n};",
      "q": "后置 <code>operator++(int)</code> 里那个 <code>int</code> 参数有什么用？",
      "options": [
        "记录自增几次",
        "只是占位记号，让编译器区分前置和后置",
        "表示返回 int",
        "没有它前置版本会失效",
      ],
      "ans": 1,
      "why": "前置和后置的运算符符号完全一样，只能靠参数表区分：带一个不用的 <code>int</code> 就是后置，调用时编译器自动传 0。"
    },
    {
      "id": "d5s07",
      "day": "day5",
      "q": "<code>operator+</code> 应该返回什么类型？",
      "options": [
        "返回两个操作数之一的引用",
        "返回新对象（值）",
        "返回 <code>void</code>",
        "返回指针",
      ],
      "ans": 1,
      "why": "相加产生的是第三个新对象，原来两个都不能被改；返回 <code>T</code> 而不是 <code>T&amp;</code>，否则要么悬空引用、要么把原对象改坏。"
    },
    {
      "id": "d5s08",
      "day": "day5",
      "q": "重载 <code>+</code> 之后，<code>a + b * c</code> 的执行顺序会变吗？",
      "options": [
        "会，按重载函数里的顺序",
        "不会，优先级和结合性还是语言规定的那套",
        "取决于返回类型",
        "取决于是否写成成员函数",
      ],
      "ans": 1,
      "why": "运算符重载不能改优先级、结合性和参数个数，所以还是先算 <code>b * c</code>。"
    },
    {
      "id": "d5s09",
      "day": "day5",
      "code": "Stu a(1000), b(2000);\nb = a;        // ①\nStu c = a;    // ②",
      "q": "① 和 ② 分别调用什么？",
      "options": [
        "都调用拷贝构造",
        "① 调用拷贝赋值，② 调用拷贝构造",
        "① 调用拷贝构造，② 调用拷贝赋值",
        "都调用拷贝赋值",
      ],
      "ans": 1,
      "why": "<code>b = a</code> 时 b 已经存在，走赋值运算符；<code>Stu c = a</code> 是初始化，走拷贝构造。"
    },
    {
      "id": "d5s10",
      "day": "day5",
      "q": "重载 <code>==</code> 时，返回类型通常写成什么？",
      "options": [
        "<code>int</code>",
        "<code>bool</code>",
        "<code>void</code>",
        "对象本身的引用",
      ],
      "ans": 1,
      "why": "比较结果只有真 / 假，返回 <code>bool</code> 最清楚；参数用 <code>const T&amp;</code>，函数尾加 <code>const</code> 表示不修改自己。"
    },
    {
      "id": "d5s11",
      "day": "day5",
      "q": "<code>operator!=</code> 一般怎么实现最好？",
      "options": [
        "把比较逻辑再抄一遍",
        "直接返回 <code>!(*this == o)</code>",
        "返回 <code>true</code>",
        "调用 <code>strcmp</code> 比较地址",
      ],
      "ans": 1,
      "why": "拿 <code>==</code> 取反，比较规则只维护一处，以后改字段不会漏。"
    },
    {
      "id": "d5s12",
      "day": "day5",
      "code": "class Add {\n    int base;\npublic:\n    Add(int b) : base(b) {}\n    int operator()(int x) const { return x + base; }\n};",
      "q": "重载 <code>()</code> 之后，这种对象被称为什么？",
      "options": [
        "友元",
        "仿函数（函数对象）",
        "静态对象",
        "匿名对象",
      ],
      "ans": 1,
      "why": "对象能像函数一样被调用，就叫仿函数。它比函数指针多带成员状态，标准库的谓词大量用它。"
    },
    {
      "id": "d5s13",
      "day": "day5",
      "q": "重载 <code>operator-&gt;</code> 时，函数必须返回什么？",
      "options": [
        "对象本身",
        "一个真正的指针",
        "引用",
        "<code>void</code>",
      ],
      "ans": 1,
      "why": "<code>q-&gt;hi()</code> 会被编译成 <code>(q.operator-&gt;())-&gt;hi()</code>，所以返回值必须能继续接 <code>-&gt;</code>，也就是真正的指针。"
    },
    {
      "id": "d5s14",
      "day": "day5",
      "q": "自己写的智能指针，靠什么自动释放对象？",
      "options": [
        "靠 <code>main</code> 里手动 <code>delete</code>",
        "把指针包进类，在析构函数里 <code>delete</code>",
        "靠垃圾回收器",
        "靠 <code>operator new</code> 自动回收",
      ],
      "ans": 1,
      "why": "局部对象离开作用域会自动析构，把 <code>delete</code> 写进析构函数，就借用了这条生命周期规则。"
    },
    {
      "id": "d5s15",
      "day": "day5",
      "q": "下面哪一组运算符<b>只能</b>写成成员函数？",
      "options": [
        "<code>+</code> <code>-</code> <code>*</code>",
        "<code>=</code> <code>[]</code> <code>()</code> <code>-&gt;</code>",
        "<code>&lt;&lt;</code> <code>&gt;&gt;</code>",
        "<code>==</code> <code>!=</code>",
      ],
      "ans": 1,
      "why": "<code>=</code>、<code>[]</code>、<code>()</code>、<code>-&gt;</code> 标准规定必须是成员函数；<code>&lt;&lt;</code> / <code>&gt;&gt;</code> 反过来只能写成全局（通常配友元）。"
    },
    {
      "id": "d5s16",
      "day": "day5",
      "code": "class MyString {\n    char* str;\npublic:\n    MyString(const char* s);\n    ~MyString();\n};",
      "q": "这个类只写了构造和析构，还缺什么才能安全拷贝？",
      "options": [
        "什么都不缺",
        "拷贝构造和拷贝赋值（深拷贝）",
        "只要再写一个 <code>print()</code>",
        "把 <code>str</code> 改成 public",
      ],
      "ans": 1,
      "why": "默认拷贝只抄指针地址，两个对象共用一块内存，析构时会 <code>delete[]</code> 两次。必须自己写深拷贝的拷贝构造和赋值。"
    },
    {
      "id": "d5s17",
      "day": "day5",
      "q": "<code>char&amp; operator[](int i)</code> 为什么返回引用而不是 <code>char</code>？",
      "options": [
        "为了省内存",
        "返回引用才能写 <code>s[0] = 'H'</code>，改到对象内部",
        "因为 <code>[]</code> 必须返回引用",
        "返回 <code>char</code> 会编译报错",
      ],
      "ans": 1,
      "why": "返回 <code>char</code> 只是字符的副本，赋值改的是副本；返回 <code>char&amp;</code> 才真正指向内部那个字节。"
    },
    {
      "id": "d5s18",
      "day": "day5",
      "code": "class Dog : public Animal { };",
      "q": "这行代码里 <code>public</code> 表示什么？",
      "options": [
        "Dog 的成员都是 public",
        "公有继承：父类 public 成员在 Dog 里仍是 public",
        "Dog 只能有一个对象",
        "Animal 的构造变成 public",
      ],
      "ans": 1,
      "why": "继承方式决定父类成员在子类里的可见性。public 继承保持原权限不变（private 成员仍然不可直接访问）。"
    },
    {
      "id": "d5s19",
      "day": "day5",
      "q": "父类的 protected 成员，在子类里和类外分别是什么情况？",
      "options": [
        "子类能访问，类外不能",
        "子类和类外都能访问",
        "子类和类外都不能访问",
        "子类不能，类外能",
      ],
      "ans": 0,
      "why": "protected 是「留给后代」的档位：子类内部能用，类外通过对象访问不了。"
    },
    {
      "id": "d5s20",
      "day": "day5",
      "q": "一个子类对象（父类 + 成员对象 + 子类自己）的构造顺序是？",
      "options": [
        "子类 → 成员对象 → 父类",
        "父类 → 成员对象 → 子类",
        "成员对象 → 父类 → 子类",
        "按初始化列表书写顺序",
      ],
      "ans": 1,
      "why": "先父类、再成员对象（按声明顺序）、最后子类构造体；析构严格反过来。"
    },
    {
      "id": "d5s21",
      "day": "day5",
      "code": "class P { public: int a; };\nclass S : public P { public: int a; };\nS s;",
      "q": "<code>s.a</code> 访问的是哪一个 <code>a</code>？",
      "options": [
        "父类的",
        "子类的（就近原则）",
        "编译报错",
        "两个都改",
      ],
      "ans": 1,
      "why": "同名时默认就近用子类那份；要父类那份得写 <code>s.P::a</code>。"
    },
    {
      "id": "d5s22",
      "day": "day5",
      "code": "class P {\npublic:\n    void f();\n    void f(int);\n};\nclass S : public P {\npublic:\n    void f();\n};\nS s;\ns.f(1);",
      "q": "<code>s.f(1)</code> 能编译通过吗？",
      "options": [
        "能，会调用父类的 <code>f(int)</code>",
        "不能，子类同名函数把父类那组重载整体遮蔽了",
        "能，会调用子类的 <code>f()</code>",
        "能，但运行时报错",
      ],
      "ans": 1,
      "why": "子类一重定义 <code>f</code>，父类所有同名重载都被遮蔽；要调父类版本必须写 <code>s.P::f(1)</code>，或在子类里 <code>using P::f;</code>。"
    },
    {
      "id": "d5s23",
      "day": "day5",
      "q": "下面哪个成员函数<b>不会</b>从父类继承到子类？",
      "options": [
        "普通成员函数",
        "静态成员函数",
        "构造函数",
        "const 成员函数",
      ],
      "ans": 2,
      "why": "构造函数、析构函数、<code>operator=</code> 都不继承，编译器会给子类各自生成一份。"
    },
    {
      "id": "d5s24",
      "day": "day5",
      "code": "class A { public: int a; };\nclass B { public: int a; };\nclass C : public A, public B {};\nC c;\nc.a;",
      "q": "最后一行会怎样？",
      "options": [
        "访问 A 的 a",
        "访问 B 的 a",
        "编译报错：有歧义",
        "访问一个合并后的 a",
      ],
      "ans": 2,
      "why": "两个父类都有 <code>a</code>，编译器无法判断用哪个，报 ambiguous；必须写成 <code>c.A::a</code> 或 <code>c.B::a</code>。"
    },
    {
      "id": "d5s25",
      "day": "day5",
      "q": "菱形继承里，<code>virtual public</code> 解决的核心问题是什么？",
      "options": [
        "让父类的函数变成虚函数",
        "让公共祖先在最终对象里只保留一份，消除二义性和重复数据",
        "让子类不能覆盖父类函数",
        "让构造顺序改变",
      ],
      "ans": 1,
      "why": "虚继承让中间层共享同一个祖先子对象，最终对象里只出现一份祖先数据；代价是多一个 vbptr 和一次间接寻址。"
    }
  ],
  "fill": [
    {
      "id": "d5f01",
      "day": "day5",
      "code": "class C {\npublic:\n    C& operator++();        // 前置\n    C operator++(____);     // 后置\n};",
      "q": "横线上填后置 <code>++</code> 的占位参数类型。",
      "answers": ["int"],
      "display": "int　（后置版本多一个 int 占位参数）",
      "why": "前置和后置符号相同，只能靠参数表区分；后置版本多一个不用的 <code>int</code>，编译器调用时自动传 0。"
    },
    {
      "id": "d5f02",
      "day": "day5",
      "code": "____ operator<<(ostream& os, const Stu& s) {\n    os << s.no;\n    return os;\n}",
      "q": "横线上填 <code>operator&lt;&lt;</code> 的返回类型。",
      "answers": ["ostream&", "ostream &"],
      "display": "ostream&amp;　（返回流本身，才能连续 &lt;&lt;）",
      "why": "返回 <code>ostream&amp;</code> 才能让 <code>cout &lt;&lt; a &lt;&lt; b</code> 一路接下去；返回 <code>void</code> 链就断了。"
    },
    {
      "id": "d5f03",
      "day": "day5",
      "code": "class Dog : ____ Animal { };   // 公有继承",
      "q": "横线上填继承方式关键字。",
      "answers": ["public"],
      "display": "public　（public 继承：父类权限保持不变）",
      "why": "继承列表写 <code>: public Animal</code>。protected / private 继承会把父类成员的可见性往下压，日常几乎不用。"
    },
    {
      "id": "d5f04",
      "day": "day5",
      "code": "class A { public: int a; };\nclass B { public: int a; };\nclass C : public A, public B {};\nC c;\ncout << c.____ << endl;   // 要访问 A 的 a",
      "q": "横线上填能消除二义性的写法（只写作用域部分）。",
      "answers": ["A::a"],
      "display": "A::a　（完整写法 c.A::a）",
      "why": "两个父类都有 <code>a</code> 时必须加作用域指明来源，<code>c.A::a</code> 才是合法且明确的。"
    },
    {
      "id": "d5f05",
      "day": "day5",
      "code": "____ operator[](int i) { return str[i]; }   // 要能 s[0] = 'H'",
      "q": "横线上填返回类型。",
      "answers": ["char&", "char &"],
      "display": "char&amp;　（返回引用才能改到内部）",
      "why": "返回 <code>char</code> 只是副本，<code>s[0] = 'H'</code> 改不到对象内部；必须返回 <code>char&amp;</code>。"
    },
    {
      "id": "d5f06",
      "day": "day5",
      "code": "class Horse : ____ public Animal { };   // 让公共祖先只留一份",
      "q": "横线上填关键字。",
      "answers": ["virtual"],
      "display": "virtual　（虚继承）",
      "why": "虚继承让中间层共享同一个祖先子对象，菱形继承里最终只有一份 Animal 数据。"
    },
    {
      "id": "d5f07",
      "day": "day5",
      "code": "class Parent {\npublic:\n    ____ ~Parent();   // 用父类指针 delete 子类对象时不能漏掉子类析构",
      "q": "横线上填关键字。",
      "answers": ["virtual"],
      "display": "virtual　（虚析构）",
      "why": "父类析构不是虚函数时，用父类指针 <code>delete</code> 子类对象只会析构父类那部分，子类资源泄漏。"
    },
    {
      "id": "d5f08",
      "day": "day5",
      "code": "char* p = new char[10];\n____ p;   // 配对释放",
      "q": "横线上填释放写法。",
      "answers": ["delete[]", "delete []"],
      "display": "delete[]　（new[] 必须配 delete[]）",
      "why": "<code>new char[]</code> 要配 <code>delete[]</code>；用 <code>delete</code> 是未定义行为，数组元素的析构可能不执行。"
    }
  ],
  "judge": [
    {
      "id": "d5j01",
      "day": "day5",
      "q": "重载 <code>&amp;&amp;</code> 之后，<code>a &amp;&amp; f()</code> 仍然保持「左边为假就不算 f()」的短路行为。",
      "ans": 1,
      "why": "错。重载后是函数调用，所有实参必须先求值，短路规则直接失效，而且求值顺序也不保证从左到右。"
    },
    {
      "id": "d5j02",
      "day": "day5",
      "q": "<code>b = a;</code>（b 已经存在）会调用拷贝构造函数。",
      "ans": 1,
      "why": "错。<code>b = a</code> 是赋值，调用 <code>operator=</code>；只有 <code>Stu c = a;</code> 这种「出生时初始化」才走拷贝构造。"
    },
    {
      "id": "d5j03",
      "day": "day5",
      "q": "重载了 <code>()</code> 的类，它的对象既能当对象用，也能像函数一样被调用。",
      "ans": 0,
      "why": "对。这就是仿函数：对象本身有成员、能拷贝，同时支持 <code>obj(args)</code> 的调用写法。"
    },
    {
      "id": "d5j04",
      "day": "day5",
      "q": "类里有 <code>char*</code> 成员却不写拷贝构造，默认拷贝是浅拷贝，两个对象会指向同一块内存。",
      "ans": 0,
      "why": "对。默认拷贝逐成员复制，指针成员复制的是地址；析构时会对同一块内存释放两次。"
    },
    {
      "id": "d5j05",
      "day": "day5",
      "q": "public 继承之后，父类的 private 成员在子类成员函数里可以直接访问。",
      "ans": 1,
      "why": "错。继承不改访问权限，父类 private 成员在子类里依然不可直接访问，只能通过父类提供的 public / protected 函数间接使用。"
    },
    {
      "id": "d5j06",
      "day": "day5",
      "q": "子类和父类共享同一个静态成员变量，子类里改它，父类看到的就是新值。",
      "ans": 0,
      "why": "对。静态成员属于类只有一份，子类继承后访问的是同一块内存，<code>Parent::n</code> 和 <code>Son::n</code> 是同一个。"
    },
    {
      "id": "d5j07",
      "day": "day5",
      "q": "虚继承之后，公共祖先的初始化由中间层（马、驴）各自完成。",
      "ans": 1,
      "why": "错。虚基类的初始化由最底层的派生类（骡）负责，中间层的初始化语句会被忽略，否则就会重复初始化。"
    }
  ],
  "code": [
    {
      "id": "d5c01",
      "day": "day5",
      "q": "读代码，按顺序写出打印的数字。",
      "code": "class C {\n    int v;\npublic:\n    C(int v) : v(v) {}\n    C& operator++() { ++v; return *this; }\n    C operator++(int) { C t = *this; ++v; return t; }\n    int get() { return v; }\n};\n\nint main() {\n    C c(5);\n    cout &lt;&lt; (++c).get() &lt;&lt; endl;\n    cout &lt;&lt; (c++).get() &lt;&lt; endl;\n    cout &lt;&lt; c.get() &lt;&lt; endl;\n}",
      "answers": ["6\n6\n7", "6 6 7"],
      "display": "6\n6\n7",
      "why": "前置先加再返回新值 → 6；后置返回旧值 → 6，但对象已经是 7；最后打印 7。"
    },
    {
      "id": "d5c02",
      "day": "day5",
      "q": "读代码，按顺序写出打印的六行。",
      "code": "struct M { M(){cout&lt;&lt;\"M构造\"&lt;&lt;endl;} ~M(){cout&lt;&lt;\"M析构\"&lt;&lt;endl;} };\nclass P { public: P(){cout&lt;&lt;\"P构造\"&lt;&lt;endl;} ~P(){cout&lt;&lt;\"P析构\"&lt;&lt;endl;} };\nclass S : public P {\n    M m;\npublic:\n    S(){cout&lt;&lt;\"S构造\"&lt;&lt;endl;}\n    ~S(){cout&lt;&lt;\"S析构\"&lt;&lt;endl;}\n};\nint main(){ S s; }",
      "answers": ["P构造\nM构造\nS构造\nS析构\nM析构\nP析构", "P构造 M构造 S构造 S析构 M析构 P析构"],
      "display": "P构造 / M构造 / S构造 / S析构 / M析构 / P析构",
      "why": "构造顺序：父类 → 成员对象 → 子类；析构完全逆序。记住「先地基后墙，拆时先墙后地基」。"
    },
    {
      "id": "d5c03",
      "day": "day5",
      "q": "64 位 g++ 下，写出 <code>cout &lt;&lt; sizeof(Mule) &lt;&lt; endl;</code> 打印的数字。",
      "code": "class Animal { public: int a = 10; };\nclass Horse  : virtual public Animal {};\nclass Donkey : virtual public Animal {};\nclass Mule   : public Horse, public Donkey {};\n\nint main() {\n    Mule m;\n    cout &lt;&lt; m.a &lt;&lt; endl;\n    cout &lt;&lt; sizeof(Mule) &lt;&lt; endl;\n}",
      "answers": ["10\n24", "10 24"],
      "display": "10\n24",
      "why": "<code>m.a</code> 只有一份，打印 10；虚继承让 Mule 里有两个 vbptr（各 8 字节）+ 一个 int（4 字节）+ 4 字节对齐填充 = 24。"
    },
    {
      "id": "d5c04",
      "day": "day5",
      "q": "读代码，写出打印的两个数字。",
      "code": "class A { public: int a = 10; };\nclass B { public: int a = 20; };\nclass C : public A, public B {};\n\nint main() {\n    C x;\n    cout &lt;&lt; x.A::a &lt;&lt; \" \" &lt;&lt; x.B::a &lt;&lt; endl;\n}",
      "answers": ["10 20"],
      "display": "10 20",
      "why": "两个父类各有一份 <code>a</code>，用作用域指明来源即可；直接写 <code>x.a</code> 会因二义性编译失败。"
    },
    {
      "id": "d5c05",
      "day": "day5",
      "q": "读代码，写出打印的数字。",
      "code": "class N {\npublic:\n    int v;\n    N(int v) : v(v) {}\n    N operator+(const N&amp; o) const { return N(v + o.v); }\n};\n\nint main() {\n    N a(1), b(2), c(3);\n    cout &lt;&lt; (a + b + c).v &lt;&lt; endl;\n}",
      "answers": ["6"],
      "display": "6",
      "why": "<code>operator+</code> 返回新对象，所以 <code>a + b</code> 先得 3，再和 c 相加得 6。"
    },
    {
      "id": "d5c06",
      "day": "day5",
      "q": "读代码，写出打印的结果。",
      "code": "class P { public: int a = 1; protected: int b = 2; private: int c = 3; };\nclass S : public P {\npublic:\n    void show() { cout &lt;&lt; a &lt;&lt; \" \" &lt;&lt; b &lt;&lt; endl; }\n};\n\nint main() {\n    S s;\n    s.show();\n    // cout &lt;&lt; s.b;   // 这行会编译报错\n}",
      "answers": ["1 2"],
      "display": "1 2",
      "why": "public 继承下 a 仍是 public、b 仍是 protected，子类里都能访问；c 是 private，子类和类外都碰不到，只能走父类的 public 函数。"
    }
  ]
};

