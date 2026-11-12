window.BANKS = window.BANKS || {};
window.BANKS.day4 = {
  "single": [
    {
      "id": "d4s01",
      "day": "day4",
      "q": "静态成员变量 <code>static int b;</code> 属于谁？",
      "options": [
        "每个对象各有一份，互不影响",
        "属于类，这个类的所有对象共用同一份",
        "属于 main 函数",
        "只在第一次创建对象时存在"
      ],
      "ans": 1,
      "why": "静态成员属于类，不属于对象。不管造多少个对象，<code>b</code> 只有一份；通过 <code>o1.b</code> 改，<code>o2.b</code> 看到的就是新值。"
    },
    {
      "id": "d4s02",
      "day": "day4",
      "code": "class Demo {\npublic:\n    static int b;\n};",
      "q": "类里的 <code>static int b;</code> 只是声明，真正分配内存还要写哪一行？",
      "options": [
        "Demo b = 10;",
        "int b = 10;",
        "int Demo::b = 10;",
        "static int Demo::b = 10;"
      ],
      "ans": 2,
      "why": "静态成员必须在类外定义：<code>int Demo::b = 10;</code>。漏了这一行，编译器能过，链接时会报 undefined reference。"
    },
    {
      "id": "d4s03",
      "day": "day4",
      "code": "class D {\npublic:\n    static int n;\n    D() { n++; }\n    ~D() { n--; }\n};\nint D::n = 0;\n\nint main() {\n    D a;\n    { D b; }\n    cout &lt;&lt; D::n &lt;&lt; endl;\n}",
      "q": "这段代码打印什么？",
      "options": [
        "0",
        "1",
        "2",
        "3"
      ],
      "ans": 1,
      "why": "a 构造 n=1；b 构造 n=2，出作用域析构 n=1；最后打印 1。构造加、析构减，计数器才能反映「现在活着几个」。"
    },
    {
      "id": "d4s04",
      "day": "day4",
      "q": "静态成员函数不能直接访问下面哪一类成员？",
      "options": [
        "静态成员变量",
        "普通（非静态）成员变量",
        "其他静态成员函数",
        "全局变量"
      ],
      "ans": 1,
      "why": "静态函数没有 this，不知道你指的是哪个对象，所以碰不到普通成员变量。普通成员函数反过来两种都能访问。"
    },
    {
      "id": "d4s05",
      "day": "day4",
      "q": "实现单例模式，最关键的一步是什么？",
      "options": [
        "把 getInstance 写成普通成员函数",
        "把构造函数私有化，只留静态 getInstance 当入口",
        "把析构函数删掉",
        "把类声明成 struct"
      ],
      "ans": 1,
      "why": "构造私有，外面就没法随便造对象；只能通过静态的 getInstance 拿那唯一一份。通常还要把拷贝构造和赋值也 <code>= delete</code> 掉。"
    },
    {
      "id": "d4s06",
      "day": "day4",
      "q": "饿汉式单例的实例是在什么时候创建的？",
      "options": [
        "第一次调用 getInstance 时",
        "程序启动、静态成员初始化时就创建",
        "每次调用 getInstance 都创建",
        "第一次访问该对象的成员函数时"
      ],
      "ans": 1,
      "why": "饿汉式把 <code>static Singleton* instance = new Singleton();</code> 写在类外，程序启动就执行一次。简单，但哪怕不用也占着资源。"
    },
    {
      "id": "d4s07",
      "day": "day4",
      "q": "懒汉式单例相比饿汉式，最大的不同是什么？",
      "options": [
        "不需要私有构造函数",
        "第一次调用 getInstance 时才创建实例",
        "可以有多个实例",
        "不需要静态成员"
      ],
      "ans": 1,
      "why": "懒汉式先让指针为空，getInstance 里判空再 <code>new</code>，第一次用到才创建，省启动资源；代价是多一次判断，多线程下还要额外处理。"
    },
    {
      "id": "d4s08",
      "day": "day4",
      "code": "void f() {\n    static int x = 0;\n    x++;\n    cout &lt;&lt; x &lt;&lt; endl;\n}",
      "q": "连续调用 <code>f()</code> 三次，静态局部变量 x 会怎样？",
      "options": [
        "每次都重新初始化为 0，打印 1 1 1",
        "只初始化一次，打印 1 2 3",
        "编译不过",
        "每次打印随机值"
      ],
      "ans": 1,
      "why": "静态局部变量在静态区，第一次执行到定义那一行才初始化，之后一直保留。所以输出 1、2、3，这也是静态局部变量单例的原理。"
    },
    {
      "id": "d4s09",
      "day": "day4",
      "code": "class Demo {\npublic:\n    char a;\n    int b;\n    static int c;\n    void fun() {}\n};",
      "q": "<code>sizeof(Demo)</code> 在常见 64 位编译器上是多少？",
      "options": [
        "5",
        "8",
        "9",
        "12"
      ],
      "ans": 1,
      "why": "1 字节 char + 3 字节填充 + 4 字节 int = 8。静态成员和成员函数都不占对象空间，所以不是 9 也不是 12。"
    },
    {
      "id": "d4s10",
      "day": "day4",
      "q": "一个空类（什么成员都没有）的 <code>sizeof</code> 是多少？",
      "options": [
        "0",
        "1",
        "4",
        "8"
      ],
      "ans": 1,
      "why": "空类大小是 1。编译器要保证每个对象都有独一无二的地址，所以至少占一个字节。"
    },
    {
      "id": "d4s11",
      "day": "day4",
      "q": "关于 this 指针，下面哪句是对的？",
      "options": [
        "this 是对象的一个成员，算进 sizeof",
        "this 指向当前调用该成员函数的对象，隐含在非静态成员函数里",
        "静态成员函数里也有 this",
        "this 必须自己定义"
      ],
      "ans": 1,
      "why": "this 是编译器隐含传进来的指针，指向当前对象，不用定义、不占对象空间。静态成员函数没有 this。"
    },
    {
      "id": "d4s12",
      "day": "day4",
      "q": "想做 <code>o.add(1).add(2).add(3);</code> 这样的链式调用，add 应该返回什么？",
      "options": [
        "void",
        "int",
        "Demo&amp;（当前对象的引用）",
        "Demo*（当前对象的指针）"
      ],
      "ans": 2,
      "why": "返回 <code>Demo&amp;</code>，<code>return *this;</code> 把当前对象交回去，后面才能继续点。返回 void 直接断链；返回值会拷贝，改的是副本。"
    },
    {
      "id": "d4s13",
      "day": "day4",
      "q": "const 成员函数的写法是下面哪个？",
      "options": [
        "const void show() { }",
        "void const show() { }",
        "void show() const { }",
        "void show(const) { }"
      ],
      "ans": 2,
      "why": "const 要写在函数参数表后面、函数体前面：<code>void show() const</code>。写在前面的 const 修饰的是返回值，意思完全不同。"
    },
    {
      "id": "d4s14",
      "day": "day4",
      "code": "class Demo {\npublic:\n    int a;\n    mutable int c;\n    void show() const {\n        // a = 1;\n        c = 1;\n    }\n};",
      "q": "为什么 <code>a = 1;</code> 不行，<code>c = 1;</code> 却可以？",
      "options": [
        "a 是 public，c 是 private",
        "c 用了 mutable，const 函数里允许改它",
        "int 不能赋值",
        "const 函数只能改最后一个成员"
      ],
      "ans": 1,
      "why": "const 成员函数把对象当只读，普通成员都不能改；<code>mutable</code> 明确开了例外，所以 c 能改。它只该用于缓存、计数这类成员。"
    },
    {
      "id": "d4s15",
      "day": "day4",
      "code": "const Demo o;",
      "q": "常对象 <code>o</code> 能调用下面哪类成员函数？",
      "options": [
        "所有成员函数",
        "只有 const 成员函数",
        "只有构造函数",
        "只有静态成员函数"
      ],
      "ans": 1,
      "why": "常对象只能调用 const 成员函数，因为普通函数可能改数据。<code>const Demo&amp;</code> 参数也是同样的限制。"
    },
    {
      "id": "d4s16",
      "day": "day4",
      "q": "友元函数是类的成员函数吗？",
      "options": [
        "是，和普通成员函数一样",
        "不是成员函数，但可以访问这个类的私有成员",
        "是静态成员函数",
        "只在构造函数里算"
      ],
      "ans": 1,
      "why": "友元不是成员，没有 this，调用时也不需要用对象来点；它只是因为被 <code>friend</code> 声明过，获得了访问私有成员的特权。"
    },
    {
      "id": "d4s17",
      "day": "day4",
      "q": "想让全局函数 <code>showId</code> 访问 <code>Person</code> 的私有成员，<code>friend</code> 应该写在哪里？",
      "options": [
        "写在 showId 函数体里",
        "写在 Person 类里面",
        "写在 main 函数里",
        "写在 showId 的声明前面"
      ],
      "ans": 1,
      "why": "谁开放权限，就写在谁家里：在 Person 类里写 <code>friend void showId(Person&amp;);</code>。写在朋友那边没有意义。"
    },
    {
      "id": "d4s18",
      "day": "day4",
      "q": "写了带指针成员的动态数组类，为什么必须自己写深拷贝？",
      "options": [
        "为了跑得更快",
        "默认拷贝只抄地址，两个对象共用一块内存，析构时会双重释放",
        "因为编译器不允许默认拷贝",
        "为了少写几行代码"
      ],
      "ans": 1,
      "why": "默认拷贝是浅拷贝，只把指针的值抄过去，两个对象指向同一块堆。一个改了另一个也变，析构时同一块被 <code>delete[]</code> 两次，程序直接崩。"
    },
    {
      "id": "d4s19",
      "day": "day4",
      "q": "静态成员变量会算进 <code>sizeof(对象)</code> 吗？",
      "options": [
        "会，和普通成员一样",
        "不会，它放在静态区，不属于某个对象",
        "只有 private 的才算",
        "只有 int 类型不算"
      ],
      "ans": 1,
      "why": "对象里只放非静态数据成员。静态成员全类共用一份，放在静态存储区；成员函数也只有一份代码，都不进对象大小。"
    },
    {
      "id": "d4s20",
      "day": "day4",
      "q": "为什么静态成员函数里写 <code>this->a</code> 会编译报错？",
      "options": [
        "静态函数里没有 this 指针",
        "a 一定是 private",
        "this 只能用在构造函数里",
        "静态函数不能有参数"
      ],
      "ans": 0,
      "why": "this 只隐含在非静态成员函数里。静态函数属于类、不属于某个对象，自然没有「当前对象」，也就没法访问普通成员。"
    },
    {
      "id": "d4s21",
      "day": "day4",
      "q": "动态数组满了要扩容，常见做法是哪一套？",
      "options": [
        "直接把 capacity 加 1，指针不用动",
        "申请一块更大的新内存，把旧数据搬过去，释放旧内存，再指向新内存",
        "把数组改成全局变量",
        "调用 delete[] 之后继续用原指针"
      ],
      "ans": 1,
      "why": "扩容三步：<code>new</code> 新地 → 循环搬数据 → <code>delete[]</code> 旧地 → 指针指向新地。顺序不能反，释放后原指针就是野指针。"
    },
    {
      "id": "d4s22",
      "day": "day4",
      "code": "void show(const Demo&amp; d) {\n    d.print();\n}",
      "q": "如果 <code>print</code> 没有加 const，这里会怎样？",
      "options": [
        "正常编译，什么都不影响",
        "编译报错：不能通过 const 引用调用非 const 成员函数",
        "运行时报错",
        "print 会被自动当成 const"
      ],
      "ans": 1,
      "why": "<code>const Demo&amp;</code> 承诺不改对象，只能调用 const 成员函数。所以只读函数记得在参数表后面加 const，否则连自己都调不了。"
    }
  ],
  "fill": [
    {
      "id": "d4f01",
      "day": "day4",
      "code": "class Demo {\npublic:\n    static int count;\n};\nint Demo::____ = 0;   // 类外定义计数器",
      "q": "类外定义静态成员，横线上填成员名。",
      "answers": [
        "count"
      ],
      "display": "count　（写成 int Demo::count = 0;）",
      "why": "类外定义必须写「类名::成员名」。静态成员在类里只是声明，这一行才真正分配内存并给初值。"
    },
    {
      "id": "d4f02",
      "day": "day4",
      "code": "class Demo {\npublic:\n    ____ int getCount() { return count; }   // 不造对象也能调\n};",
      "q": "让这个函数不依赖对象、可以直接用类名调用，横线填一个关键字。",
      "answers": [
        "static"
      ],
      "display": "static",
      "why": "<code>static</code> 成员函数属于类，可以直接 <code>Demo::getCount()</code> 调用。代价是它没有 this，不能访问普通成员。"
    },
    {
      "id": "d4f03",
      "day": "day4",
      "code": "void setA(int a) {\n    ____->a = a;   // 左边是成员，右边是形参\n}",
      "q": "形参和成员同名，横线上填那个隐藏指针。",
      "answers": [
        "this"
      ],
      "display": "this　（写成 this->a = a;）",
      "why": "<code>this</code> 指向当前对象，<code>this->a</code> 明确表示成员 a；右边的 a 按就近原则取形参。"
    },
    {
      "id": "d4f04",
      "day": "day4",
      "code": "Demo____ add(int v) {\n    sum += v;\n    return *this;   // 返回当前对象本身\n}",
      "q": "要支持链式调用，返回值类型这里缺一个符号，填什么？",
      "answers": [
        "&amp;",
        "&"
      ],
      "display": "&amp;　（写成 Demo&amp; add(int v)）",
      "why": "返回引用才不会拷贝出新对象，<code>return *this;</code> 交回的就是调用者本身。写成 <code>Demo</code> 会返回副本，链式调用就只改到副本。"
    },
    {
      "id": "d4f05",
      "day": "day4",
      "code": "void show() ____ {   // 承诺不改对象状态\n    cout &lt;&lt; a &lt;&lt; endl;\n}",
      "q": "给成员函数加只读承诺，横线填一个关键字。",
      "answers": [
        "const"
      ],
      "display": "const　（写成 void show() const）",
      "why": "const 写在参数表后面，表示这个函数不改成员。常对象和 const 引用只能调用这种函数。"
    },
    {
      "id": "d4f06",
      "day": "day4",
      "code": "class Demo {\npublic:\n    ____ int c;   // const 函数里也允许改\n};",
      "q": "给成员开一个「const 函数里也能改」的例外，横线填一个关键字。",
      "answers": [
        "mutable"
      ],
      "display": "mutable",
      "why": "<code>mutable</code> 成员不受 const 成员函数限制。只该给缓存、计数器这类「逻辑上不算改状态」的成员用。"
    },
    {
      "id": "d4f07",
      "day": "day4",
      "code": "Singleton* Singleton::instance = ____;   // 懒汉式：一开始还没有\n\n// getInstance() 里：\n// if (instance == ____) instance = new Singleton();",
      "q": "懒汉式的静态指针初值和判空值，横线填什么？",
      "answers": [
        "nullptr",
        "NULL",
        "0"
      ],
      "display": "nullptr　（写成 Singleton::instance = nullptr;）",
      "why": "懒汉式一开始不创建，指针先置空；getInstance 里判空，只有为空才 <code>new</code>，这样才保证只创建一次。"
    },
    {
      "id": "d4f08",
      "day": "day4",
      "code": "class Person {\n    ____ void showId(Person&amp; p);   // 允许它访问私有成员\nprivate:\n    int id;\n};",
      "q": "声明一个全局函数为友元，横线填一个关键字。",
      "answers": [
        "friend"
      ],
      "display": "friend　（写成 friend void showId(Person&amp; p);）",
      "why": "<code>friend</code> 只出现在被访问的类里，声明一次就够，定义仍写在类外。友元不是成员，没有 this。"
    }
  ],
  "judge": [
    {
      "id": "d4j01",
      "day": "day4",
      "q": "静态成员函数里可以直接访问普通成员变量，因为有 this 指针。",
      "ans": 1,
      "why": "正好说反了：静态成员函数没有 this，不能访问普通成员变量，只能访问静态成员。"
    },
    {
      "id": "d4j02",
      "day": "day4",
      "q": "饿汉式单例是在第一次调用 getInstance 时才创建实例的。",
      "ans": 1,
      "why": "那是懒汉式。饿汉式在程序启动、静态成员初始化时就创建好了，所以叫「饿」，一上来就吃。"
    },
    {
      "id": "d4j03",
      "day": "day4",
      "q": "链式调用时把返回值写成 <code>Demo</code>（按值返回），效果和 <code>Demo&amp;</code> 一样。",
      "ans": 1,
      "why": "按值返回会拷贝一个临时对象，后面几次调用都作用在副本上，原对象只完成了第一次。要链式就得返回引用 <code>Demo&amp;</code>。"
    },
    {
      "id": "d4j04",
      "day": "day4",
      "q": "const 对象可以调用普通的（非 const）成员函数，只要函数里没真的改数据。",
      "ans": 1,
      "why": "编译期就拦，不看函数体里有没有真改。普通成员函数没资格被 const 对象调用，只能调用 const 成员函数。"
    },
    {
      "id": "d4j05",
      "day": "day4",
      "q": "mutable 修饰的成员，在 const 成员函数里也可以修改。",
      "ans": 0,
      "why": "对。const 成员函数默认把成员当只读，<code>mutable</code> 是明确开的例外，常用于缓存、访问计数这类成员。"
    },
    {
      "id": "d4j06",
      "day": "day4",
      "q": "友元关系可以传递：A 是 B 的友元、B 是 C 的友元，那 A 也是 C 的友元。",
      "ans": 1,
      "why": "友元不传递、不继承、还是单向的。A 能看 B 的私有，不代表能看 C 的；B 也不自动获得看 A 私有的权限。"
    },
    {
      "id": "d4j07",
      "day": "day4",
      "q": "静态成员变量必须在类里声明，在类外定义。",
      "ans": 0,
      "why": "对。类里写 <code>static int b;</code> 只是声明，类外还要写 <code>int Demo::b = 0;</code> 才真正分配内存，缺了会链接报错。"
    }
  ],
  "code": [
    {
      "id": "d4c01",
      "day": "day4",
      "q": "读代码，写出最后打印的数字。",
      "code": "class D {\npublic:\n    static int n;\n    D() { n++; }\n};\nint D::n = 0;\n\nint main() {\n    D a, b, c;\n    cout &lt;&lt; D::n &lt;&lt; endl;\n}",
      "answers": [
        "3"
      ],
      "display": "3",
      "why": "三个对象各自调用一次构造函数，静态计数器 n 从 0 加到 3。静态成员全类共用一份，所以三次累加都落在同一个 n 上。"
    },
    {
      "id": "d4c02",
      "day": "day4",
      "q": "读代码，写出最后打印的数字。",
      "code": "class D {\npublic:\n    static int n;\n};\nint D::n = 5;\n\nint main() {\n    D a;\n    a.n = 8;\n    cout &lt;&lt; D::n &lt;&lt; endl;\n}",
      "answers": [
        "8"
      ],
      "display": "8",
      "why": "通过对象 a 改静态成员，改的还是类那一份。所以再用 <code>D::n</code> 读，得到 8。"
    },
    {
      "id": "d4c03",
      "day": "day4",
      "q": "读代码，写出最后打印的数字（布尔值按 0/1 输出）。",
      "code": "class S {\nprivate:\n    S() {}\n    static S* ins;\npublic:\n    static S* get() {\n        if (!ins) ins = new S();\n        return ins;\n    }\n};\nS* S::ins = nullptr;\n\nint main() {\n    S* p1 = S::get();\n    S* p2 = S::get();\n    cout &lt;&lt; (p1 == p2) &lt;&lt; endl;\n}",
      "answers": [
        "1"
      ],
      "display": "1",
      "why": "这是懒汉式单例：第一次 get 创建，之后判空直接返回同一个地址，所以 <code>p1 == p2</code> 为真，打印 1。"
    },
    {
      "id": "d4c04",
      "day": "day4",
      "q": "读代码，写出最后打印的数字。",
      "code": "class A {\n    int* p;\npublic:\n    A(int v) { p = new int(v); }\n    A(const A&amp; o) { p = new int(*o.p); }   // 深拷贝\n    ~A() { delete p; }\n    int get() { return *p; }\n    void set(int v) { *p = v; }\n};\n\nint main() {\n    A a(1);\n    A b = a;\n    b.set(9);\n    cout &lt;&lt; a.get() &lt;&lt; endl;\n}",
      "answers": [
        "1"
      ],
      "display": "1",
      "why": "拷贝构造里 <code>new int(*o.p)</code> 重新申请了一块内存并把值搬过去，所以 b 和 a 各管各的。b 改成 9，a 还是 1。"
    }
  ]
};
