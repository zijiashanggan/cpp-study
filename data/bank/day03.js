window.BANKS = window.BANKS || {};
window.BANKS.day3 = {
  "single": [
    {
      "id": "d3s01",
      "day": "day3",
      "q": "面向过程和面向对象，最核心的区别是什么？",
      "options": [
        "面向过程只能用 C 写，面向对象只能用 C++ 写",
        "面向过程按步骤拆，面向对象按\"谁负责什么\"拆成对象",
        "面向对象一定比面向过程跑得快",
        "面向过程处理不了复杂问题"
      ],
      "ans": 1,
      "why": "两者都是拆问题的办法：过程式按步骤拆，性能高但改起来牵一发动全身；OOP 按责任拆对象，好扩展但有一点间接开销。OOP 不是\"更快\"，只是\"更好分工\"。"
    },
    {
      "id": "d3s02",
      "day": "day3",
      "q": "造车的例子里，\"发动机找五菱、轮胎找韩泰\"，最能说明面向对象的哪一点？",
      "options": [
        "专业的人做专业的事，责任分开",
        "所有零件必须自己一个人造",
        "面向对象不需要测试",
        "零件越多程序跑得越快"
      ],
      "ans": 0,
      "why": "OOP 的核心就是分工：每个对象管好自己的事，对外只暴露接口。出问题先找对应模块，而不是在一大段流程里翻。"
    },
    {
      "id": "d3s03",
      "day": "day3",
      "code": "class User {\n    int id;\n};",
      "q": "这段代码里，<code>id</code> 默认是什么访问权限？",
      "options": [
        "public",
        "private",
        "protected",
        "没写就编译错误"
      ],
      "ans": 1,
      "why": "class 的默认权限是 private，struct 才是 public。所以在 class 里写成员，想给外面用一定要显式加 public:。"
    },
    {
      "id": "d3s04",
      "day": "day3",
      "q": "C++ 里 <code>class</code> 和 <code>struct</code> 最关键的区别是什么？",
      "options": [
        "class 里不能写函数",
        "struct 不能有构造函数",
        "默认访问权限不同：class 默认私有，struct 默认公有",
        "class 不能被继承"
      ],
      "ans": 2,
      "why": "除了默认权限，两者几乎可以互换：都能有成员函数、构造析构、继承。C++ 里 struct 常用来表示\"就是一堆数据\"，class 用来表示\"有行为的对象\"，这只是习惯，不是语法强制。"
    },
    {
      "id": "d3s05",
      "day": "day3",
      "code": "class User {\n    int id;\npublic:\n    void setId(int mid);\n};\n\nvoid ____setId(int mid) { id = mid; }",
      "q": "在类外实现成员函数，函数名前面必须补什么？",
      "options": [
        "User.",
        "User::",
        "什么都不用加",
        "this->"
      ],
      "ans": 1,
      "why": "要写 <code>void User::setId(int mid)</code>。少了 User::，编译器就把你当成一个普通全局函数，它既碰不到 id，也会和类里声明的那个函数对不上。"
    },
    {
      "id": "d3s06",
      "day": "day3",
      "code": "class User {\n    int id;\npublic:\n    void setId(int mid) { id = mid; }\n    int getId() { return id; }\n};",
      "q": "同一个类的成员函数里，访问另一个对象的 private 成员 id：",
      "options": [
        "不行，private 连同类对象也不能碰",
        "可以，类内部没有访问权限之分",
        "只有构造函数可以",
        "必须先把 id 改成 public"
      ],
      "ans": 1,
      "why": "访问权限只在类外才起作用。同一个类的成员函数之间，可以访问任意同类对象的私有成员；private 防的是\"外面的人\"，不是\"自己人\"。"
    },
    {
      "id": "d3s07",
      "day": "day3",
      "q": "下面哪个构造函数写法是对的？",
      "options": [
        "void Demo() { }",
        "Demo() { }",
        "int Demo() { return 0; }",
        "Demo void() { }"
      ],
      "ans": 1,
      "why": "构造函数名字和类名相同，而且没有返回值——连 void 都不能写。写成 void Demo() 编译器会把它当普通函数，对象创建时不会调用。"
    },
    {
      "id": "d3s08",
      "day": "day3",
      "code": "class Demo {\npublic:\n    Demo(int a) { }\n};\n\nint main() { Demo d; }",
      "q": "只写了有参构造，再写 <code>Demo d;</code> 会怎样？",
      "options": [
        "调用默认无参构造，一切正常",
        "编译不过：用户写了构造函数后，默认无参构造就失效了",
        "编译器会自动补一个无参构造",
        "能编译，运行时崩溃"
      ],
      "ans": 1,
      "why": "只要用户自己写了任何一个构造函数，编译器就不再提供默认无参构造。要么补一个 <code>Demo() { }</code>，要么写 <code>Demo d(0);</code>。"
    },
    {
      "id": "d3s09",
      "day": "day3",
      "code": "Demo o1(10);",
      "q": "下面哪一句会调用拷贝构造函数？",
      "options": [
        "Demo&amp; r = o1;",
        "Demo o2 = o1;",
        "Demo o2; o2 = o1;",
        "Demo o2(10);"
      ],
      "ans": 1,
      "why": "拷贝构造只用在\"用旧对象初始化新对象\"这一种场景。<code>Demo&amp; r = o1;</code> 只是起别名；<code>o2 = o1;</code> 是先定义再赋值，走的是赋值运算；<code>o2(10)</code> 调的是有参构造。"
    },
    {
      "id": "d3s10",
      "day": "day3",
      "code": "void fun(Demo d);\nDemo o1(10);\nfun(o1);",
      "q": "把对象按值传给函数，会发生什么？",
      "options": [
        "不会拷贝，函数里改形参外面也变",
        "会调用拷贝构造，用 o1 造一个形参对象",
        "一定编译不过",
        "只拷贝指针，不拷贝成员"
      ],
      "ans": 1,
      "why": "按值传参相当于 <code>Demo d = o1;</code>，要造一个形参对象，所以会调用拷贝构造。想省这次拷贝、又不想改原件，就传 <code>const Demo&amp;</code>。"
    },
    {
      "id": "d3s11",
      "day": "day3",
      "code": "class Demo {\n    char* name;\npublic:\n    Demo(const char* s) { name = new char[strlen(s) + 1]; strcpy(name, s); }\n    ~Demo() { delete[] name; }\n};",
      "q": "如果直接用编译器默认的拷贝构造（浅拷贝），会发生什么？",
      "options": [
        "完全没问题，编译器会帮你深拷贝",
        "两个对象指向同一块堆，改一个影响另一个，析构时可能双重释放",
        "指针会自动变成 nullptr",
        "只是多占一点栈空间"
      ],
      "ans": 1,
      "why": "默认拷贝构造只逐成员赋值，指针成员抄的是地址：a、b 共用一块堆。谁先析构谁释放，另一个就成了野指针，再释放一次就是双重释放。所以有指针成员必须自己写深拷贝。"
    },
    {
      "id": "d3s12",
      "day": "day3",
      "q": "析构函数下面哪个写法是对的？",
      "options": [
        "void ~Demo() { }",
        "~Demo() { }",
        "~Demo(int a) { }",
        "Demo~() { }"
      ],
      "ans": 1,
      "why": "析构函数是\"类名前加 ~\"，无返回值、连 void 也不能写、不能有参数、不能重载。一个类只有一个析构函数。"
    },
    {
      "id": "d3s13",
      "day": "day3",
      "code": "class Demo {\n    int a;\npublic:\n    Demo(int ma) : a(ma) { cout &lt;&lt; \"body\"; }\n};",
      "q": "初始化列表 <code>: a(ma)</code> 和函数体，哪个先执行？",
      "options": [
        "函数体先执行",
        "初始化列表先执行，然后才是函数体",
        "同时执行",
        "只有拷贝构造才走初始化列表"
      ],
      "ans": 1,
      "why": "顺序固定：先按成员定义顺序执行初始化列表，再进函数体。所以进函数体时，成员已经有值了；const 成员和引用成员也只能在列表里初始化。"
    },
    {
      "id": "d3s14",
      "day": "day3",
      "code": "class Emp {\n    Dept dept;\n    int eid;\npublic:\n    Emp(int id1, int id2) : eid(id1), dept(id2) { }\n};",
      "q": "成员 dept 和 eid 的构造顺序由什么决定？",
      "options": [
        "初始化列表里的书写顺序",
        "成员在类里定义的顺序",
        "按成员名字的字母顺序",
        "每次运行随机"
      ],
      "ans": 1,
      "why": "构造顺序只看成员在类里的定义顺序，和初始化列表怎么写无关。这段代码里 dept 先定义，所以先构造 dept，再构造 eid；析构顺序相反。"
    },
    {
      "id": "d3s15",
      "day": "day3",
      "code": "class Dept {\npublic:\n    explicit Dept(int id) { }\n};\nDept d = 100;   // 这一句",
      "q": "<code>explicit</code> 在这里起什么作用？",
      "options": [
        "让构造函数执行得更快",
        "禁止 <code>Dept d = 100;</code> 这种隐式转换",
        "把构造函数变成 private",
        "允许一次传多个参数"
      ],
      "ans": 1,
      "why": "单参构造默认允许\"int 自动变成 Dept\"，所以 <code>Dept d = 100;</code> 能编译。加上 explicit 就必须老老实实写 <code>Dept d(100);</code>，避免看不懂的隐式转换。"
    }
  ],
  "fill": [
    {
      "id": "d3f01",
      "day": "day3",
      "code": "void User____setId(int mid) {\n    id = mid;\n}",
      "q": "在类外实现成员函数，横线上填<b>一个运算符</b>（\"谁家的\"那个）。",
      "answers": [
        "::"
      ],
      "display": "::　（写成 void User::setId(int mid)）",
      "why": "<code>::</code> 是作用域解析运算符，左边写类名，右边写成员名。漏了它，这个函数就成了全局函数，访问不到类的成员。"
    },
    {
      "id": "d3f02",
      "day": "day3",
      "code": "class Demo {\npublic:\n    ____Demo() { cout &lt;&lt; \"退房\"; }\n};",
      "q": "析构函数名字前要加<b>一个符号</b>，横线填什么？",
      "answers": [
        "~"
      ],
      "display": "~　（写成 ~Demo()）",
      "why": "析构函数就是在类名前加 <code>~</code>，表示\"这个对象要没了\"。它无返回值、无参数、不能重载。"
    },
    {
      "id": "d3f03",
      "day": "day3",
      "code": "class Demo {\n    int a;\npublic:\n    Demo(int mA) ____ a(mA) {\n        cout &lt;&lt; \"body\";\n    }\n};",
      "q": "初始化列表前面要写<b>一个符号</b>，横线上填什么？",
      "answers": [
        ":"
      ],
      "display": ":　（写成 Demo(int mA) : a(mA)）",
      "why": "冒号后面接初始化列表，逗号分隔多个成员。它比函数体先执行，成员对象的有参构造也只能写在这里。"
    },
    {
      "id": "d3f04",
      "day": "day3",
      "code": "Demo(____ Demo&amp; obj) {   // 拷贝构造\n    a = obj.a;\n}",
      "q": "拷贝构造的形参前面，要补<b>一个关键字</b>，保证拷贝时不改原件。",
      "answers": [
        "const"
      ],
      "display": "const　（写成 Demo(const Demo&amp; obj)）",
      "why": "参数写成 <code>const Demo&amp;</code>：引用避免无限递归地拷贝，const 保证拷贝过程中不动原件。这是拷贝构造的标准写法。"
    },
    {
      "id": "d3f05",
      "day": "day3",
      "code": "struct Point {\n    int x, y;   // 不写访问权限\n};",
      "q": "struct 里不写访问权限，默认是 ____（填一个关键字）。",
      "answers": [
        "public"
      ],
      "display": "public",
      "why": "struct 默认 public，class 默认 private，这是两者唯一的硬区别。写 struct 表示\"这就是一堆公开的数据\"，写 class 则习惯上把数据藏起来。"
    },
    {
      "id": "d3f06",
      "day": "day3",
      "code": "char* p = new char[10];\n// 用完要还回去\n____;",
      "q": "补全释放数组的语句（<code>new[]</code> 要配对的写法）。",
      "answers": [
        "delete[] p",
        "delete [] p",
        "delete[]p"
      ],
      "display": "delete[] p;",
      "why": "<code>new[]</code> 必须配 <code>delete[]</code>。数组和单个对象是两本账，用 <code>delete p</code> 释放数组在不少平台上会崩，或者只析构第一个元素。"
    },
    {
      "id": "d3f07",
      "day": "day3",
      "code": "class Dept {\npublic:\n    ____ Dept(int id);   // 禁止 int 隐式变成 Dept\n};",
      "q": "挡住 <code>Dept d = 100;</code> 这种隐式转换，横线填<b>一个关键字</b>。",
      "answers": [
        "explicit"
      ],
      "display": "explicit",
      "why": "单参构造默认允许隐式转换，加 <code>explicit</code> 后就只能写 <code>Dept d(100);</code>。工程里建议单参构造都加上，少一类看不懂的 bug。"
    },
    {
      "id": "d3f08",
      "day": "day3",
      "code": "Demo(const Demo&amp; obj) {\n    name = new char[____];\n    strcpy(name, obj.name);\n}",
      "q": "深拷贝时，新内存的长度要按对方的字符串算，横线填什么？",
      "answers": [
        "strlen(obj.name) + 1"
      ],
      "display": "strlen(obj.name) + 1",
      "why": "字符串末尾还有一个 <code>\\0</code>，所以长度是 <code>strlen(obj.name) + 1</code>。少加 1 会越界写，多申请一点不会错但别浪费。"
    }
  ],
  "judge": [
    {
      "id": "d3j01",
      "day": "day3",
      "q": "构造函数可以写返回值，只要不写成 void 就行。",
      "ans": 1,
      "why": "构造函数没有返回值，连 void 都不能写。它由编译器在创建对象时自动调用，不是普通函数，不能拿返回值。"
    },
    {
      "id": "d3j02",
      "day": "day3",
      "q": "构造函数可以重载：同一个类可以有好几个参数不同的构造函数。",
      "ans": 0,
      "why": "可以。无参构造和带参构造就是最常见的重载，编译器按你传的参数挑一个调用。"
    },
    {
      "id": "d3j03",
      "day": "day3",
      "q": "析构函数可以带参数，也可以重载好几个。",
      "ans": 1,
      "why": "析构函数不能有参数、不能重载，一个类只有一个 <code>~类名()</code>。它由编译器在对象销毁前自动调用，不需要你传参。"
    },
    {
      "id": "d3j04",
      "day": "day3",
      "q": "自己写了拷贝构造函数之后，编译器仍然会提供一个默认无参构造。",
      "ans": 1,
      "why": "只要你声明了任何一个构造函数（包括拷贝构造），编译器就不再提供默认无参构造。需要 <code>Demo d;</code> 的话，得自己补一个无参构造。"
    },
    {
      "id": "d3j05",
      "day": "day3",
      "q": "类里只定义了有参构造，<code>Demo d;</code> 仍然能正常编译。",
      "ans": 1,
      "why": "编译不过：默认无参构造已经失效。要么写 <code>Demo d(0);</code>，要么自己补一个 <code>Demo() { }</code>。"
    },
    {
      "id": "d3j06",
      "day": "day3",
      "q": "浅拷贝之后，两个对象的指针成员指向同一块堆内存，析构时可能重复释放。",
      "ans": 0,
      "why": "对。默认拷贝构造只抄地址，两个对象共用一块堆；各自析构时都 delete 一次，就是双重释放。有指针成员必须写深拷贝。"
    },
    {
      "id": "d3j07",
      "day": "day3",
      "q": "成员对象的构造顺序，和初始化列表里的书写顺序一致。",
      "ans": 1,
      "why": "构造顺序只看成员在类里的定义顺序，跟初始化列表怎么写没关系。写反了顺序，编译器一般会给警告，但不会按你写的顺序来。"
    },
    {
      "id": "d3j08",
      "day": "day3",
      "q": "在同一个类的成员函数里，可以访问另一个同类对象的 private 成员。",
      "ans": 0,
      "why": "对。访问权限只在类外检查；类内部所有成员函数都能访问同类对象的私有成员。"
    },
    {
      "id": "d3j09",
      "day": "day3",
      "q": "给已有对象起一个引用别名，会调用拷贝构造函数。",
      "ans": 1,
      "why": "不会。引用只是别名，没有创建新对象。拷贝构造只发生在\"用旧对象初始化新对象\"时。"
    },
    {
      "id": "d3j10",
      "day": "day3",
      "q": "<code>explicit</code> 可以挡住 <code>Dept d = 100;</code> 这种隐式转换。",
      "ans": 0,
      "why": "对。加了 explicit 的单参构造不允许隐式转换，必须写成 <code>Dept d(100);</code>。"
    }
  ],
  "code": [
    {
      "id": "d3c01",
      "day": "day3",
      "q": "读代码，写出终端打印的字符（不要空格）。",
      "code": "class Demo {\npublic:\n    Demo() { cout &lt;&lt; \"A\"; }\n    Demo(int a) { cout &lt;&lt; \"B\"; }\n};\n\nint main() {\n    Demo d;\n    Demo e(1);\n}",
      "answers": [
        "AB"
      ],
      "display": "AB",
      "why": "<code>Demo d;</code> 调无参构造打印 A，<code>Demo e(1);</code> 调有参构造打印 B，所以是 AB。若只写有参构造却写 <code>Demo d;</code>，会直接编译不过。"
    },
    {
      "id": "d3c02",
      "day": "day3",
      "q": "补全析构函数，把构造函数里 new 出来的字符串释放掉。",
      "code": "class Demo {\n    char* name;\npublic:\n    Demo(const char* s) {\n        name = new char[strlen(s) + 1];\n        strcpy(name, s);\n    }\n    ~Demo() {\n        ____;\n    }\n};",
      "answers": [
        "delete[] name",
        "delete [] name",
        "delete[]name"
      ],
      "display": "delete[] name;",
      "why": "构造函数用的是 <code>new char[...]</code>，析构就必须配对 <code>delete[]</code>。只写 <code>delete name</code> 是数组/单对象配错，很多平台会崩。"
    },
    {
      "id": "d3c03",
      "day": "day3",
      "q": "补全类外的 setter，让形参 mid 写进成员 id。",
      "code": "class User {\n    int id;\npublic:\n    void setId(int mid);\n};\n\nvoid User::setId(int mid) {\n    ____ = mid;\n}",
      "answers": [
        "id",
        "this->id"
      ],
      "display": "id",
      "why": "成员名是 id，形参是 mid，直接写 <code>id = mid;</code> 即可。形参如果也叫 id，才需要用 <code>this->id = id;</code> 区分。"
    },
    {
      "id": "d3c04",
      "day": "day3",
      "q": "补全初始化列表，用 id2 调用成员对象 dept 的有参构造。",
      "code": "class Emp {\n    Dept dept;\n    int eid;\npublic:\n    Emp(int id1, int id2) ____ {\n        eid = id1;\n    }\n};",
      "answers": [
        "dept(id2)",
        ":dept(id2)",
        ": dept(id2)"
      ],
      "display": ": dept(id2)",
      "why": "成员对象只能靠初始化列表调有参构造，写法是 <code>: dept(id2)</code>。在函数体里写 <code>dept = Dept(id2);</code> 是先造临时对象再赋值，不是初始化。"
    },
    {
      "id": "d3c05",
      "day": "day3",
      "q": "这段代码里，拷贝构造函数被调用了几次？",
      "code": "class Demo {\npublic:\n    int a;\n    Demo(int ma) { a = ma; }\n    Demo(const Demo&amp; obj) { a = obj.a; }\n};\n\nint main() {\n    Demo o1(10);\n    Demo o2 = o1;\n}",
      "answers": [
        "1"
      ],
      "display": "1 次",
      "why": "只有 <code>Demo o2 = o1;</code> 是\"用旧对象初始化新对象\"，调用 1 次拷贝构造。<code>Demo o1(10);</code> 调的是有参构造。"
    },
    {
      "id": "d3c06",
      "day": "day3",
      "q": "读代码，写出终端打印的字符（不要空格）。",
      "code": "class D {\npublic:\n    D() { cout &lt;&lt; \"C\"; }\n    ~D() { cout &lt;&lt; \"X\"; }\n};\n\nint main() {\n    D a;\n    { D b; }\n    D c;\n}",
      "answers": [
        "CCXCXX"
      ],
      "display": "CCXCXX",
      "why": "a 构造 C → b 构造 C → b 出作用域析构 X → c 构造 C → main 结束，c 析构 X、a 析构 X。栈是后进先出，同一作用域里后构造的先析构。"
    },
    {
      "id": "d3c07",
      "day": "day3",
      "q": "读代码，写出最后打印的数字。",
      "code": "struct S { int* p; };\n\nint main() {\n    int x = 5;\n    S a;\n    a.p = &amp;x;\n    S b = a;      // 默认拷贝构造：浅拷贝\n    *b.p = 9;\n    cout &lt;&lt; *a.p &lt;&lt; endl;\n}",
      "answers": [
        "9"
      ],
      "display": "9",
      "why": "默认拷贝构造是浅拷贝，b.p 和 a.p 指向同一个 x。通过 b 改的就是 a 看到的那块内存，所以打印 9。要各管各的，就得写深拷贝。"
    },
    {
      "id": "d3c08",
      "day": "day3",
      "q": "读代码，写出终端打印的字符（不要空格）。",
      "code": "class D {\npublic:\n    D() { cout &lt;&lt; \"D\"; }\n    ~D() { cout &lt;&lt; \"~D\"; }\n};\n\nclass E {\n    D d;\npublic:\n    E() { cout &lt;&lt; \"E\"; }\n    ~E() { cout &lt;&lt; \"~E\"; }\n};\n\nint main() { E e; }",
      "answers": [
        "DE~E~D"
      ],
      "display": "DE~E~D",
      "why": "先构造成员 d 打印 D，再执行 E 自己的构造打印 E；析构相反：先析构 E 打印 ~E，再析构成员 d 打印 ~D。"
    }
  ]
};
