window.BANKS = window.BANKS || {};
window.BANKS.day2 = {
  "single": [
    {
      "id": "d2s14",
      "day": "day2",
      "q": "<code>volatile</code> 到底管什么？",
      "options": [
        "让变量读写变成原子操作",
        "告诉编译器这个值可能被外部改掉，每次都要真去内存读，别优化",
        "把变量放到寄存器里，读写更快",
        "让变量不能被修改"
      ],
      "ans": 1,
      "why": "volatile 只负责\"别缓存、别优化掉\"，常见于多线程共享标志、寄存器指针、中断共享变量、DMA 缓冲区（后三种以后有板子再看）。它不保证原子性；不想被改的是 const，不是 volatile。"
    },
    {
      "id": "d2s15",
      "day": "day2",
      "code": "volatile int flag = 0;\n// 另一个线程 100ms 后：flag = 1;\n\nint main() {\n    while (!flag) { }\n    // 等另一个线程把 flag 置 1\n}",
      "q": "如果 flag 不加 <code>volatile</code>，可能出什么问题？",
      "options": [
        "编译不过",
        "编译器可能把 flag 缓存进寄存器，while 变成永远退不出的死循环",
        "另一个线程改不了 flag",
        "flag 会变成随机值"
      ],
      "ans": 1,
      "why": "主循环里 flag 一直没人\"在眼皮底下\"改，编译器可能只读一次就反复用旧值。加了 volatile 才会每次都去内存读，能看到另一个线程改的新值。"
    },
    {
      "id": "d2s16",
      "day": "day2",
      "code": "void f(void) {\n    static int n = 0;\n    n++;\n}",
      "q": "函数里的 <code>static</code> 局部变量有什么特点？",
      "options": [
        "每次调用都重新初始化为 0",
        "只初始化一次，函数退出后值还在，下次调用接着用",
        "只能在本文件其他函数里访问",
        "和普通局部变量完全一样"
      ],
      "ans": 1,
      "why": "static 局部变量放在静态存储区，函数退出不销毁，初始化只做一次。常用来做计数器、保存状态机的上一步状态，又不用暴露成全局变量。"
    },
    {
      "id": "d2s01",
      "day": "day2",
      "code": "int* p = new int;\n*p = 5;\ndelete p;",
      "q": "这段代码的用法对吗？",
      "options": [
        "对：new 一间房配 delete，正好对上",
        "错：必须写成 delete[] p",
        "错：必须用 free(p) 才能还回去",
        "错：根本不该用 new，应该用 malloc"
      ],
      "ans": 0,
      "why": "new 单独租一间房，就用 delete 退；只有 new[] 租的一排房才用 delete[]。free 是 C 那套（配 malloc 用），和 new 是两套账本，混着用会把内存管理搞乱。"
    },
    {
      "id": "d2s02",
      "day": "day2",
      "code": "int* a = new int[10];\nfor (int i = 0; i < 10; i++) a[i] = i;\ndelete a;",
      "q": "最后一行有什么问题？",
      "options": [
        "没问题，delete 也能退一排房",
        "new[] 借的是一排房，必须用 delete[] a 整排退",
        "应该写成 delete a[10]",
        "应该写成 free(a)"
      ],
      "ans": 1,
      "why": "一排房要整排退，delete[] 才知道一共有几间（delete a[10] 只是去动第 10 间，而且已经越界）。写成 delete 是错误的配对，标准不保证后果，可能只清掉第一间，也可能把堆里的记账弄乱。"
    },
    {
      "id": "d2s03",
      "day": "day2",
      "q": "<code>delete p;</code> 之后马上写 <code>p = nullptr;</code>，主要是图什么？",
      "options": [
        "让这块内存还得更彻底",
        "把门牌号划掉，防止以后误用已经退租的地址",
        "防止内存泄漏",
        "不写这一句就编译不过"
      ],
      "ans": 1,
      "why": "内存在 delete 那一刻就已经还了，置空不会还得更干净。真正的用处是让 p 变成明确的\"空\"：以后 if (p) 能挡住误用，重复 delete nullptr 也安全。内存泄漏指的是\"根本没 delete\"，跟置空没关系；不置空也照样编译得过。"
    },
    {
      "id": "d2s04",
      "day": "day2",
      "code": "struct Point {\n    int x;\n    int y;\n    int sum() { return x + y; }\n};",
      "q": "这段在 C++ 里合法吗？",
      "options": [
        "合法，结构体里可以写函数",
        "不合法，结构体只能放数据",
        "不合法，函数必须写到 class 里",
        "合法，但函数里不能读写 x、y"
      ],
      "ans": 0,
      "why": "C++ 的结构体早就不只是\"装数据的盒子\"，里面可以写函数，函数能直接用它自己的 x、y。C 语言里确实不能这么写，所以从 C 过来的人容易以为不行。"
    },
    {
      "id": "d2s05",
      "day": "day2",
      "q": "已经写了 <code>struct Point { ... };</code>，在 C++ 里定义变量，哪种写法最正常？",
      "options": [
        "struct Point p;",
        "Point p;",
        "struct p Point;",
        "Point struct p;"
      ],
      "ans": 1,
      "why": "C 里类型名必须带着 struct 一起写，C++ 直接把 Point 当成类型名用。两种写法编译器都收，但 C++ 里没人再写 struct，多写反而像在写 C。"
    },
    {
      "id": "d2s06",
      "day": "day2",
      "q": "一个 <code>bool</code> 变量占几个字节？",
      "options": [
        "1 位",
        "1 字节",
        "2 字节",
        "4 字节"
      ],
      "ans": 1,
      "why": "1 位是理论上最省，但 C++ 规定 bool 至少占 1 字节，常见平台上正好 1 字节。所以 8 个 bool 就是 8 字节，别指望靠它省 RAM——真要按位省，得自己用位操作把 8 个状态塞进一个字节。"
    },
    {
      "id": "d2s07",
      "day": "day2",
      "code": "int n = true;\nint m = false;",
      "q": "<code>n</code> 和 <code>m</code> 分别是多少？",
      "options": [
        "1 和 0",
        "0 和 1",
        "true 和 false",
        "编译不过"
      ],
      "ans": 0,
      "why": "true 当数字用就是 1，false 就是 0，这是语言规定的转换。反过来也成立：数字变 bool 时，0 是 false，非 0 都是 true。"
    },
    {
      "id": "d2s08",
      "day": "day2",
      "q": "配置表用 <code>const</code> 而不用 <code>#define</code>，最主要的好处是什么？",
      "options": [
        "const 跑得更快",
        "#define 只能写数字，不能写字符串",
        "const 有类型、有作用域，编译器能查错，调试器也看得见",
        "const 完全不占内存"
      ],
      "ans": 2,
      "why": "#define 是预处理阶段的文字替换，没有类型，出错时报错信息会指向替换后的怪代码，调试器也看不到这个名字。const 是真变量，有类型、有作用域。至于占不占内存，得看用法：全局 const 数组通常被放进只读数据段；在板子上它才会进一步放进 flash、不占 RAM（以后再看），光加 const 并不能保证\"完全不占\"。"
    },
    {
      "id": "d2s09",
      "day": "day2",
      "q": "只写一句 <code>const int a;</code>，会怎样？",
      "options": [
        "能编译，a 自动是 0",
        "编译不过：封条一贴就必须当场给值",
        "能编译，a 是随机值",
        "能编译，以后还能给它赋一次值"
      ],
      "ans": 1,
      "why": "const 的意思就是\"定下来不许改\"，如果允许先不给值，这个变量永远没法有值，所以语言直接要求初始化。注意不是\"以后赋一次\"——一次也不行。"
    },
    {
      "id": "d2s10",
      "day": "day2",
      "code": "void f(int a = 1, int b);",
      "q": "这个声明合法吗？",
      "options": [
        "合法，两个参数随便给默认值",
        "不合法：默认值必须从右往左连续给",
        "合法，但调用时必须写全两个参数",
        "不合法：默认值只能是 0"
      ],
      "ans": 1,
      "why": "默认值要从最右边开始，一个接一个往左给。这里左边给了、右边没给，调用 f(5) 时编译器没法知道 b 该是什么，所以不合法。正确写法是 void f(int a, int b = 1);。"
    },
    {
      "id": "d2s11",
      "day": "day2",
      "code": "void f(int x);\nvoid f(int x, int y = 0);",
      "q": "调用 <code>f(1);</code> 会怎样？",
      "options": [
        "正常，选第一个版本",
        "正常，选第二个版本",
        "编译不过：两个版本都能匹配，编译器不知道选谁",
        "能编译，运行的时候随机挑一个"
      ],
      "ans": 2,
      "why": "f(1) 两个都能对上：一个直接匹配，另一个靠默认值补齐。遇到这种情况编译器不会替你猜，直接报二义性。想避开就改名字，或者把默认值去掉，让两个版本只有一个能匹配。"
    },
    {
      "id": "d2s12",
      "day": "day2",
      "code": "void f(int);\nvoid f(double);\nint  f(int);",
      "q": "这三句里，哪些算合法的重载？",
      "options": [
        "三句都算",
        "前两句算；第三句和第一句参数一模一样，只有返回值不同，会直接报错",
        "只有第三句算",
        "一句都不算"
      ],
      "ans": 1,
      "why": "重载看的是参数列表：个数、类型、顺序只要有一处不同就算。返回值不参与挑选——调用处写 f(1) 时没法靠返回值区分版本，所以\"只有返回值不同\"在 C++ 里等于重复声明，编译器直接报错。"
    },
    {
      "id": "d2s13",
      "day": "day2",
      "code": "void f(int x);\nvoid f(char* p);\n\nf(NULL);      // 这里会怎样？",
      "q": "表示\"空\"的时候，C++ 为什么更推荐 <code>nullptr</code> 而不是 <code>NULL</code>？",
      "options": [
        "<code>NULL</code> 在 C 里就是个数字 0，C++ 分不清\"整数 0\"和\"空指针\"，<code>f(NULL)</code> 会二义性、模板还会推导成 <code>int</code>；<code>nullptr</code> 只认指针",
        "<code>nullptr</code> 占的内存比 <code>NULL</code> 少，能省 RAM",
        "<code>NULL</code> 在 C++ 里已经彻底不能用了，写了就编译不过",
        "<code>nullptr</code> 可以当整数 0 用，算地址的时候更方便"
      ],
      "ans": 0,
      "why": "NULL 本质是 0（或 0L），所以 f(NULL) 会撞成二义性，模板推导也会把它当成 int；nullptr 有独立类型 std::nullptr_t，只认指针，能转成任何指针但转不成整数，所以安全。它不是更省内存，也不是 NULL 不能用——只是表达不出\"这是个指针\"。"
    }
  ],
  "fill": [
    {
      "id": "d2f91",
      "day": "day2",
      "code": "#define BIT(n) (1u &lt;&lt; (n))\n\nreg ____ BIT(3);   // 把第 3 位置 1，其他位不动",
      "q": "置位要保留其他位，横线上填<b>一个运算符</b>。",
      "answers": [
        "|="
      ],
      "display": "|=　（写成 reg |= BIT(3);）",
      "why": "置位用 <code>|=</code>，只把目标位变 1，其他位原样保留。直接写 <code>reg = BIT(3)</code> 会把别的位全冲成 0。"
    },
    {
      "id": "d2f92",
      "day": "day2",
      "code": "reg ____ ~BIT(3);   // 把第 3 位清 0，其他位不动",
      "q": "清零要保留其他位，横线上填<b>一个运算符</b>（取反后相与）。",
      "answers": [
        "&="
      ],
      "display": "&=　（写成 reg &= ~BIT(3);）",
      "why": "清零用 <code>&amp;= ~</code>：先把掩码取反，那位变 0、其他位变 1，再相与就只清目标位。写成 <code>reg = ~BIT(3)</code> 会把其他位全写成 1。"
    },
    {
      "id": "d2f01",
      "day": "day2",
      "code": "int* a = new int[10];\n// ... 用完之后\ndelete__ a;",
      "q": "<code>new int[10]</code> 借的是一排房，还的时候要补齐方括号。横线上填<b>两个字符</b>。",
      "answers": [
        "[]"
      ],
      "display": "[]（写成 delete[] a;）",
      "why": "new[] 配 delete[]，这是唯一配对。写成 delete 就是拿错钥匙，标准不保证后果——可能只清掉第一间，也可能把堆的记录弄乱。"
    },
    {
      "id": "d2f02",
      "day": "day2",
      "code": "delete p;\np = ____;   // 把旧门牌号划掉",
      "q": "退租以后要把 <code>p</code> 设成\"空门牌号\"，横线上填<b>四个字母</b>。",
      "answers": [
        "nullptr"
      ],
      "display": "nullptr（空门牌号）",
      "why": "置空以后 if (p) 能挡住误用，重复 delete nullptr 也安全。老代码里写 NULL 或 0 也能用，但 C++ 推荐 nullptr，它不会被当成整数参与运算。"
    },
    {
      "id": "d2f03",
      "day": "day2",
      "q": "<code>bool</code> 只记\"是/否\"，一个 bool 在常见平台上占 ____ 个字节（填数字）。",
      "answers": [
        "1",
        "一"
      ],
      "display": "1",
      "why": "C++ 规定 bool 至少 1 字节，常见编译器正好是 1 字节。别以为它只占 1 位——8 个 bool 就是 8 字节，想按位省得自己用位操作。"
    },
    {
      "id": "d2f04",
      "day": "day2",
      "q": "默认参数的规矩：必须从____往右连续给，中间不能跳着给。填<b>一个字</b>。",
      "answers": [
        "左"
      ],
      "display": "左（从最右边开始，往左连着给）",
      "why": "从最右边开始，一个接一个往左给。<code>void f(int a = 1, int b);</code> 就是\"左边给了、右边没给\"，调用时编译器没法补 b，所以不合法。"
    },
    {
      "id": "d2f05",
      "day": "day2",
      "q": "默认值写在声明还是定义里？规矩是同一个函数只能写____处（填<b>一个字</b>或数字）。",
      "answers": [
        "一",
        "1"
      ],
      "display": "一（只写一处）",
      "why": "写两处会报\"重定义默认参数\"。习惯上写在声明里（头文件），定义那边就不再重复写。"
    }
  ],
  "judge": [
    {
      "id": "d2j91",
      "day": "day2",
      "q": "<code>volatile</code> 能保证两个线程同时改变量时不丢数据。",
      "ans": 1,
      "why": "不能。volatile 只保证每次都真去内存读，<code>n++</code> 这种\"读-改-写\"仍然可能被打断，导致丢更新。要安全得用 std::atomic 或加锁。"
    },
    {
      "id": "d2j92",
      "day": "day2",
      "q": "函数里的 static 局部变量，每次调用函数都会重新初始化为初始值。",
      "ans": 1,
      "why": "错。static 局部变量只在第一次执行到它时初始化一次，之后一直保留上次的值，函数退出也不销毁。"
    },
    {
      "id": "d2j93",
      "day": "day2",
      "q": "文件作用域的 static 函数，只能在本文件里被调用，别的文件链接不到。",
      "ans": 0,
      "why": "对。这叫内部链接，常用来做模块私有函数：多个 .c 里写同名 static 函数也不会冲突。"
    },
    {
      "id": "d2j01",
      "day": "day2",
      "q": "<code>new</code> 出来的内存，可以用 <code>free</code> 还回去。",
      "ans": 1,
      "why": "new/delete 是一套，malloc/free 是另一套，不能交叉使用。free 不知道 new 那边做过什么（比如调用构造函数），混着用等于两套账本对不上。"
    },
    {
      "id": "d2j02",
      "day": "day2",
      "q": "<code>delete</code> 之后把指针置成 <code>nullptr</code>，能避免以后误用那个旧地址。",
      "ans": 0,
      "why": "旧门牌号留着，就还能照着它找过去；置空以后 if (p) 这道检查才有意义，重复 delete nullptr 也不会出事。"
    },
    {
      "id": "d2j03",
      "day": "day2",
      "q": "C++ 里用 struct 定义变量，必须写成 <code>struct Point p;</code>。",
      "ans": 1,
      "why": "C++ 把 Point 直接当类型名，写 <code>Point p;</code> 就行。带着 struct 也能编译，但那是 C 的老习惯，C++ 里没必要。"
    },
    {
      "id": "d2j04",
      "day": "day2",
      "q": "两个函数只要返回值类型不同，就算合法的重载。",
      "ans": 1,
      "why": "重载只看参数列表。调用处没法靠返回值挑版本，所以只改返回值等于重复声明，编译器直接报错。"
    },
    {
      "id": "d2j05",
      "day": "day2",
      "q": "<code>const int a = 10;</code> 之后再写 <code>a = 20;</code> 会编译不过。",
      "ans": 0,
      "why": "封条贴上就改不了，a = 20 会被编译器拦下。想留一个能改的副本，就另外定义变量把值抄过去，别去动 const 那个。"
    }
  ],
  "code": [
    {
      "id": "d2c91",
      "day": "day2",
      "q": "读代码，写出终端打印的字符（不要空格）。",
      "code": "void f(void) {\n    static int n = 0;\n    n++;\n    cout &lt;&lt; n;\n}\n\nint main() {\n    f();\n    f();\n    f();\n}",
      "answers": [
        "123"
      ],
      "display": "123",
      "why": "static 局部变量只初始化一次，之后一直保留值。三次调用 n 依次变成 1、2、3，所以打印 123；普通局部变量的话会是 111。"
    },
    {
      "id": "c07",
      "day": "day2",
      "q": "这块内存是用 new[] 要来的，补全释放它的那一行。",
      "code": "int* p = new int[10];\n// 释放这块内存\n____",
      "answers": [
        "delete[] p",
        "delete [] p",
        "delete[]p;"
      ],
      "display": "delete[] p;",
      "why": "new[] 必须配 delete[]，方括号是告诉编译器\"这是一排箱子，要挨个拆\"。写 delete p 只拆第一个、其余泄漏（很多平台直接崩）；写 free(p) 是另一套账本，new 出来的不能用 free 还。"
    },
    {
      "id": "c08",
      "day": "day2",
      "q": "delete 之后补一行，让这个指针不再指向已经还掉的那块内存。",
      "code": "int* p = new int(5);\ndelete p;\n____   // 防止悬垂指针被误用",
      "answers": [
        "p = nullptr",
        "p=nullptr",
        "p = NULL",
        "p = 0"
      ],
      "display": "p = nullptr;",
      "why": "delete 只把内存还回去，指针里那个旧门牌号还在，不置空就是悬垂指针。置成 nullptr 后 if (p) 才拦得住，重复 delete 也不出事。只写 nullptr 是没赋值；再写 delete p 是重复释放。"
    },
    {
      "id": "c09",
      "day": "day2",
      "q": "读代码，写出 p.sum() 打印的数字。",
      "code": "struct Point {\n  int x, y;\n  int sum() const { return x + y; }\n};\nPoint p{3, 4};\ncout << p.sum() << endl;",
      "answers": [
        "7"
      ],
      "display": "7",
      "why": "结构体里可以带成员函数，sum 直接用自己的 x、y 相加，3+4=7。答 34 是把两个数字当字符串接起来了；答\"编译不过\"是还停在 C 的观念里，以为 struct 只能放数据。"
    },
    {
      "id": "c10",
      "day": "day2",
      "q": "读代码，写出终端打印的数字。",
      "code": "bool flag = true;\nint n = flag;      // bool 转 int\ncout << n + 1 << endl;",
      "answers": [
        "2"
      ],
      "display": "2",
      "why": "true 转成 int 就是 1，1+1=2。答 1 是漏了 +1；答 0 是把 true 当成了 0，正好反了；答\"真\"是把 bool 当字符串——它本质就是一个 1 字节的整数。"
    },
    {
      "id": "c11",
      "day": "day2",
      "q": "读代码，写出终端打印的数字。",
      "code": "int add(int a, int b = 10) {\n  return a + b;\n}\ncout << add(5) << endl;",
      "answers": [
        "15"
      ],
      "display": "15",
      "why": "调用时省掉的那个参数自动拿默认值 10，5+10=15。答 5 是以为省略的参数当 0；答\"编译不过\"通常是没记住默认值必须从右往左连续给——这里只给最右边一个，是合法的。"
    },
    {
      "id": "c12",
      "day": "day2",
      "q": "f(1.0f) 会调用哪个版本？填 f(int) 或 f(double)。",
      "code": "void f(int x);\nvoid f(double x);\nf(1.0f);",
      "answers": [
        "f(double)",
        "f(double x)",
        "double"
      ],
      "display": "f(double)",
      "why": "float 转 double 叫\"提升\"，转 int 叫\"截断\"，编译器优先选损失小的那条路，所以走 f(double)。填 f(int) 是以为 float 会直接变整数；两个版本其实都能匹配，只是 double 更贴近，这里不报二义性。"
    }
  ]
};
