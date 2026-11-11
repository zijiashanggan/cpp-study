window.DAYS = window.DAYS || {};
window.DAYS.day3 = {
  "id": "day3",
  "title": "Day 3 · 类、构造与析构",
  "desc": "今天的主线：把「数据」和「操作」捆成一个对象，再搞清楚对象出生（构造）和退房（析构）时自动发生什么。每张卡都会打出真实输出，照着顺序看。",
  "cards": [
    {
      "id": "d3c17",
      "num": 17,
      "title": "面向过程 vs 面向对象：自己造车，还是找专业的人",
      "pain": "<b>没有它会怎样</b>：外设一多，数据散在一堆全局变量里、函数名越叫越长，改一处要翻遍文件。<b>面向过程</b>是自己从挖矿开始一步步干；<b>面向对象</b>是把活儿拆给发动机厂、轮胎厂，自己只定接口、验收。",
      "analogy": "面向对象",
      "only": "",
      "guess": "",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nstruct CPerson { const char* name; int age; };\nvoid c_eat(CPerson* p) { cout << p->name << \" 吃饭\\n\"; }\n\nclass Person {\npublic:\n    const char* name;\n    int age;\n    void eat() { cout << name << \" 吃饭\\n\"; }\n};\n\nint main() {\n    CPerson a{\"小明\", 20};\n    c_eat(&a);            // 小明 吃饭\n    Person b{\"小红\", 18};\n    b.eat();              // 小红 吃饭\n\n    // c_eat(&b);         // 编译报错：cannot convert 'Person*' to 'CPerson*'\n}",
      "output": "",
      "errors": [],
      "pitfalls": [
        "<b>面向过程的特点</b>：开发慢一点，但性能高、看得见每一步。小项目、单片机裸机程序，很多时候这么写最合适。",
        "<b>面向对象的特点</b>：开发快、好扩展，代价是多一点间接开销。十几个外设模块、状态一堆时，用它更好管。",
        "<b>不是谁高级谁低级</b>：它们是两套拆问题的办法。嵌入式里常见的是\"哪块合适用哪套\"，而不是全盘二选一。"
      ],
      "concl": "小项目过程式够用；模块多、状态多，就用类把数据和操作捆一起。",
      "terms": "正式叫「面向过程（POP）」和「面向对象（OOP）」，三大特点是<b>封装</b>、<b>继承</b>、<b>多态</b>。",
      "tags": [],
      "board": "",
      "quizIds": []
    },
    {
      "id": "d3c18",
      "num": 18,
      "title": "封装：把东西装进盒子，再上一把锁",
      "pain": "<b>没有它会怎样</b>：所有成员都敞开，谁都能写 <code>user.id = -999;</code>，等发现数据不对，全工程几百处赋值根本查不出是谁干的。封装 = <b>把东西装进盒子，再上一把锁，只留几扇门</b>。",
      "analogy": "把东西装进盒子，再上一把锁，只留几扇门",
      "only": "",
      "guess": "",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nclass User {\n    int id;                                   // 默认 private\npublic:\n    void setId(int v) { if (v > 0) id = v; }  // 门：顺手检查合法性\n    int  getId() const { return id; }\n};\n\nint main() {\n    User u;\n    // u.id = -999;      // 编译报错：'int User::id' is private within this context\n    u.setId(100);\n    cout << u.getId() << \"\\n\";   // 100\n    u.setId(-5);                 // 被门拦住\n    cout << u.getId() << \"\\n\";   // 100\n}",
      "output": "",
      "errors": [],
      "pitfalls": [
        "<b>public</b>：外面能直接用；<b>private</b>：只有类自己的成员函数能用；<b>protected</b>：类和子类能用，没继承时等同 private。",
        "<b>为什么属性要私有</b>：不是防同事，是防\"以后改内部结构时，外面几百处代码跟着崩\"。",
        "<b>类内部不分权限</b>：同一个类的成员函数之间，private 成员照样访问；权限只在类外才有意义。"
      ],
      "concl": "属性私有、接口公开；以后改内部实现，外面用的人不用跟着改。",
      "terms": "这套做法叫「封装（encapsulation）」，改属性的函数叫 setter，读属性的叫 getter。",
      "tags": [],
      "board": "",
      "quizIds": []
    },
    {
      "id": "d3c19",
      "num": 19,
      "title": "class 与 struct：只差一个默认权限",
      "pain": "<b>没有它会怎样</b>：C 的 struct 默认全公开，照搬到 C++ 里如果也敞开，封装就白做了。C++ 保留 struct 是为了兼容 C（默认 public），新写的类用 class（默认 private）——<b>两个关键字只差这一条默认权限</b>。",
      "analogy": "两个关键字只差这一条默认权限",
      "only": "",
      "guess": "",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nclass User {\n    int id;                 // class 默认 private\npublic:\n    void setId(int mid);\n    int  getId();\n};\n\nvoid User::setId(int mid) { id = mid; }   // 类外实现必须加 User::\nint  User::getId() { return id; }\n\nstruct Point { int x, y; };                // struct 默认 public\n\nint main() {\n    User u;\n    u.setId(5);\n    cout << u.getId() << \"\\n\";   // 5\n\n    Point p{3, 4};\n    cout << p.x + p.y << \"\\n\";   // 7\n\n    // void setId(int mid) { id = mid; }\n    // 编译报错：'id' was not declared in this scope\n}",
      "output": "",
      "errors": [],
      "pitfalls": [
        "<b>忘了 <code>User::</code></b>：写出来的就是普通全局函数，碰不到类的成员；编译器会在 <code>id</code> 这一行报\"未声明\"。",
        "<b>工程里的常规拆法</b>：<code>Demo.h</code> 放类声明（加 <code>#pragma once</code>），<code>Demo.cpp</code> 写 <code>Demo::</code> 实现，<code>main.cpp</code> 只 include 头文件。",
        "<b>为什么分文件</b>：改实现不用动头文件，别人也不用看见你的实现细节。"
      ],
      "concl": "class 默认上锁，struct 默认敞开；类外实现别忘 类名::。",
      "terms": "<code>::</code> 叫「作用域解析运算符」，读作\"谁家的\"；<code>#pragma once</code> 是「头文件保护」，防止同一个头文件被重复展开。",
      "tags": [],
      "board": "",
      "quizIds": []
    },
    {
      "id": "d3c20",
      "num": 20,
      "title": "构造函数：对象一出生就自动跑的那段",
      "pain": "<b>没有它会怎样</b>：C 里 <code>struct Point p;</code> 之后 x、y 是垃圾值，每个对象创建后都得手动赋值，忘一个就带着随机数跑。构造函数就是<b>对象一出厂自动执行的出厂设置</b>：名字和类名一样、没有返回值、可以重载。",
      "analogy": "对象一出厂自动执行的出厂设置",
      "only": "",
      "guess": "",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nclass Demo {\n    int a;\npublic:\n    Demo()      { a = 0; cout << \"无参构造\\n\"; }\n    Demo(int v) { a = v; cout << \"有参构造 \" << a << \"\\n\"; }\n};\n\nint main() {\n    Demo x;        // 无参构造\n    Demo y(10);    // 有参构造 10\n    Demo z = 30;   // 有参构造 30（单参隐式转换，卡 25 讲为什么危险）\n\n    // 只写 Demo(int) 却写 Demo d; 会报：\n    // no matching function for call to 'Demo::Demo()'\n}",
      "output": "",
      "errors": [],
      "pitfalls": [
        "<b>默认构造会失效</b>：只要你自己写了任何一个构造函数，编译器就不再送你那个空的无参构造。",
        "<b>所以两个都写</b>：无参和有参都实现，别人写 <code>Demo d;</code> 才不会突然编译不过（就是上面那条报错）。",
        "<b>匿名对象</b>：<code>Demo();</code> 只是临时造一个，分号一到就析构，不会留在栈上（卡 23 讲析构）。"
      ],
      "concl": "自己写了构造函数，编译器就不再免费送无参构造。",
      "terms": "正式叫「构造函数（constructor）」，没参数的叫「默认构造函数」，同名不同参数叫「重载」。",
      "tags": [],
      "board": "",
      "quizIds": []
    },
    {
      "id": "d3c21",
      "num": 21,
      "title": "拷贝构造：拿一个旧对象，造一个新对象",
      "pain": "<b>没有它会怎样</b>：编译器会白送一个\"逐成员抄一遍\"的拷贝构造，普通成员够用；但它只在<b>用旧对象造新对象</b>时被调用，很多人以为赋值也会走它。拷贝构造 = <b>照着图纸另盖一栋一模一样的房子</b>，不是同一栋房挂两个门牌。",
      "analogy": "照着图纸另盖一栋一模一样的房子",
      "only": "",
      "guess": "",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nclass Demo {\npublic:\n    int a;\n    Demo(int v) { a = v; cout << \"有参构造 a=\" << a << \"\\n\"; }\n    Demo(const Demo& o) { a = o.a; cout << \"拷贝构造 a=\" << a << \"\\n\"; }\n    ~Demo() { cout << \"析构 a=\" << a << \"\\n\"; }\n};\n\nint main() {\n    Demo x(1);          // 有参构造 a=1\n    {\n        Demo y = x;     // 拷贝构造 a=1\n    }                   // 析构 a=1（y 先走）\n    Demo z(x);          // 拷贝构造 a=1\n    Demo& r = x;        // 不起别名，不打印\n    (void)r;\n}                       // 析构 a=1（z 走）、析构 a=1（x 走）\n\n// Demo(Demo o) { }    // 编译报错：invalid constructor; you probably meant 'Demo (const Demo&)'",
      "output": "",
      "errors": [],
      "pitfalls": [
        "<b>三种常见时机</b>：用旧对象初始化新对象、对象按值传参、对象按值返回（最后一种编译器常会优化掉）。",
        "<b>先定义再赋值不是拷贝构造</b>：<code>Demo y; y = x;</code> 走的是赋值运算，不会打印\"拷贝构造\"。",
        "<b>参数必须传引用</b>：写成 <code>Demo(Demo obj)</code> 会为了传参再造一个对象，无限套娃，编译器直接拦。"
      ],
      "concl": "旧对象初始化新对象才叫拷贝构造；起别名、赋值都不是。",
      "terms": "正式叫「拷贝构造函数（copy constructor）」，也叫复制构造函数；参数写成 <code>const 类名&amp;</code> 是标准姿势。",
      "tags": [],
      "board": "",
      "quizIds": []
    },
    {
      "id": "d3c22",
      "num": 22,
      "title": "浅拷贝与深拷贝：指针成员的生死问题",
      "pain": "<b>没有它会怎样</b>：默认拷贝是<b>浅拷贝</b>——指针成员只抄地址，两个对象共用一块堆。像<b>两个人只有一把钥匙</b>：一个人退租把房退了，另一个人手里的钥匙就成了废铁。表现是改一个动两个，析构时二次释放直接崩。",
      "analogy": "两个人只有一把钥匙",
      "only": "",
      "guess": "",
      "codeMin": "",
      "codeFull": "#include <iostream>\n#include <cstring>\nusing namespace std;\n\nclass Demo {\n    char* name;\npublic:\n    Demo(const char* s) {\n        name = new char[strlen(s) + 1];\n        strcpy(name, s);\n        cout << \"申请 \" << name << \"\\n\";\n    }\n    Demo(const Demo& o) {                       // 深拷贝：自己再租一块\n        name = new char[strlen(o.name) + 1];\n        strcpy(name, o.name);\n        cout << \"深拷贝 \" << name << \"\\n\";\n    }\n    ~Demo() {\n        cout << \"释放 \" << name << \"\\n\";\n        delete[] name;\n    }\n};\n\nint main() {\n    Demo a(\"Tom\");   // 申请 Tom\n    Demo b = a;      // 深拷贝 Tom\n}                    // 释放 Tom、释放 Tom（两块内存，各释放一次）\n\n// 没写深拷贝时两个 name 指向同一块，第二次释放会崩：\n// free(): double free detected in tcache 2",
      "output": "",
      "errors": [],
      "pitfalls": [
        "<b>浅拷贝的后果</b>：改 <code>b.name</code> 连带改掉 <code>a.name</code>；两个析构各释放一次同一块内存，程序直接崩。",
        "<b>深拷贝的做法</b>：先按对方长度 <code>new</code> 一块新的，再 <code>strcpy</code> 过来。",
        "<b>顺手纠坑</b>：<code>new char[...]</code> 必须配 <code>delete[]</code>，不是 <code>delete</code>；数组和单个对象是两本账。",
        "<b>三法则</b>：类里有指针，拷贝构造、拷贝赋值、析构一般都要自己写。"
      ],
      "concl": "类里有指针，拷贝必须自己申请新内存，析构必须自己释放。",
      "terms": "只抄地址叫「浅拷贝（shallow copy）」，重新开一块叫「深拷贝（deep copy）」；同一块内存释放两次叫「双重释放（double free）」。",
      "tags": [],
      "board": "",
      "quizIds": []
    },
    {
      "id": "d3c23",
      "num": 23,
      "title": "析构函数：对象退房前自动收拾",
      "pain": "<b>没有它会怎样</b>：类里有 <code>new</code> 出来的内存，对象销毁时没人还，跑久了 RAM 被吃光——单片机一共就几十 KB，最先出事。析构函数就是<b>退房前自动收拾行李、交钥匙</b>：<code>~类名()</code>，无返回值、不能写 void、不能带参数、不能重载。",
      "analogy": "退房前自动收拾行李、交钥匙",
      "only": "",
      "guess": "",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nclass Demo {\npublic:\n    const char* name;\n    Demo(const char* n) : name(n) { cout << \"出生 \" << name << \"\\n\"; }\n    ~Demo() { cout << \"退房 \" << name << \"\\n\"; }\n};\n\nint main() {\n    Demo a(\"a\");       // 出生 a\n    {\n        Demo b(\"b\");   // 出生 b\n        Demo c(\"c\");   // 出生 c\n    }                  // 退房 c、退房 b（后进先出）\n    Demo d(\"d\");       // 出生 d\n}                      // 退房 d、退房 a\n\n// void ~Demo() { }    // 编译报错：return type specification for destructor invalid\n// ~Demo(int x) { }    // 编译报错：destructors may not have parameters",
      "output": "",
      "errors": [],
      "pitfalls": [
        "<b>栈上的顺序</b>：同一作用域后构造的先析构，先构造的后析构；析构顺序永远和构造相反。",
        "<b>全局对象</b>：main 结束后析构，一般也后进先出，但不同编译器可能略有差别，别依赖它。",
        "<b>什么时候必须写</b>：类里有 <code>new</code> 出来的指针成员；不写就是内存泄漏——对象没了，堆那块还在。",
        "<b>没有指针就别硬写</b>：普通类用编译器默认的空析构就够了。"
      ],
      "concl": "谁 new 的谁 delete，析构函数就是对象的退房手续。",
      "terms": "正式叫「析构函数（destructor）」；对象离开 <code>{}</code> 叫「出作用域」；new 了没还叫「内存泄漏（memory leak）」。",
      "tags": [],
      "board": "",
      "quizIds": []
    },
    {
      "id": "d3c24",
      "num": 24,
      "title": "初始化列表：成员对象的\"有参构造\"只能在这儿点",
      "pain": "<b>没有它会怎样</b>：成员本身是个对象、又只有带参构造时，函数体里再赋值已经晚了——编译器会先要求它\"默认出生\"，没有默认构造就直接编译不过。初始化列表 <code>: a(mA), b(mB)</code> 就是<b>盖房子前先按图纸订好材料</b>，而不是先随便盖再拆了重装。",
      "analogy": "盖房子前先按图纸订好材料",
      "only": "",
      "guess": "",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nclass Part {\npublic:\n    Part(int id) { cout << \"Part 构造 \" << id << \"\\n\"; }\n    ~Part() { cout << \"Part 析构\\n\"; }\n};\n\nclass Car {\n    Part engine;   // 声明在前：先构造\n    Part wheel;    // 声明在后：后构造\npublic:\n    Car() : wheel(2), engine(1) { cout << \"Car 函数体\\n\"; }\n};\n\nint main() {\n    Car c;\n}\n// 输出：Part 构造 1\n//       Part 构造 2      ← 按声明顺序，不按列表书写顺序\n//       Car 函数体\n//       Part 析构\n//       Part 析构        ← 析构顺序和构造相反\n\n// class Car { Part p; public: Car() { p = Part(1); } };\n// 编译报错：no matching function for call to 'Part::Part()'",
      "output": "",
      "errors": [],
      "pitfalls": [
        "<b>构造顺序</b>：先按成员在类里的<b>定义顺序</b>构造，和初始化列表的书写顺序无关；最后才执行自己的函数体。",
        "<b>析构顺序</b>：和构造相反，先析构自己，再析构成员对象。",
        "<b>const 成员和引用成员</b>：也必须在初始化列表里给值，函数体里赋值来不及。"
      ],
      "concl": "成员对象的有参构造只能在初始化列表里点，函数体里赋值已经晚了。",
      "terms": "正式叫「初始化列表（member initializer list）」；类里的对象成员叫「对象成员 / 成员对象」。",
      "tags": [],
      "board": "",
      "quizIds": []
    },
    {
      "id": "d3c25",
      "num": 25,
      "title": "explicit 与默认成员函数：今天最容易踩的四个坑",
      "pain": "<b>没有它会怎样</b>：单参构造默认允许隐式转换，<code>Dept d = 100;</code> 这种像赋值的写法、甚至函数传参 <code>show(100)</code> 都会偷偷造对象，写错了编译器还帮你圆。<code>explicit</code> 就是<b>门禁必须刷卡</b>：想进门，老老实实写 <code>Dept(100)</code>。",
      "analogy": "门禁必须刷卡",
      "only": "",
      "guess": "",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nclass Dept {\npublic:\n    explicit Dept(int id) { did = id; }\n    int did;\n};\n\nvoid show(Dept d) { cout << d.did << \"\\n\"; }\n\nint main() {\n    show(Dept(100));   // 100\n    // show(100);      // 编译报错：could not convert '100' from 'int' to 'Dept'\n    // Dept d = 100;   // 同样被挡住\n}",
      "output": "",
      "errors": [],
      "pitfalls": [
        "<b>坑 1：默认权限</b> —— class 不写 public 就全是 private，外面 <code>user.id = 1;</code> 直接编译不过（卡 19）。",
        "<b>坑 2：默认构造失效</b> —— 自己写了有参构造，<code>Demo d;</code> 就编不过；无参构造要自己补（卡 20）。",
        "<b>坑 3：浅拷贝</b> —— 有指针成员还用默认拷贝，轻则改一个动两个，重则双重释放崩溃（卡 22）。",
        "<b>坑 4：new / delete 配错</b> —— <code>new[]</code> 配 <code>delete[]</code>，<code>new</code> 配 <code>delete</code>（卡 7）。",
        "<b>默认成员函数</b>：编译器白送无参构造、拷贝构造、拷贝赋值、析构；老话「三法则」指拷贝构造、拷贝赋值、析构这三个要一起写。你一旦自己写了拷贝构造，默认的无参构造也就不再送了。"
      ],
      "concl": "单参构造加 explicit，指针成员自己写拷贝和析构，能挡掉今天一半的坑。",
      "terms": "<code>explicit</code> 读作\"显式的\"，挡掉的叫「隐式转换（implicit conversion）」；编译器白送的这几个合称「默认成员函数」。",
      "tags": [],
      "board": "",
      "quizIds": []
    }
  ],
  "taskTitle": "Day 3 · 今天动手",
  "taskDesc": "今天两个任务是一组对照实验：先故意不写深拷贝，亲眼看到崩溃；再补上深拷贝，看同样的代码为什么就安全了。都在本机跑，不用开发板。",
  "tasks": [
    {
      "id": "d3t1",
      "title": "任务 1 · 故意不写深拷贝，看双重释放",
      "goal": "<b>目标</b>：写一个带 <code>char*</code> 成员的类，不写拷贝构造，让 <code>A b = a;</code> 触发两次 <code>delete[]</code>，亲眼看到进程崩溃。",
      "code": "#include <iostream>\n#include <cstring>\nusing namespace std;\n\nclass A {\npublic:\n    char* name;\n    A(const char* s) {                       // 构造：自己租一块\n        name = new char[strlen(s) + 1];\n        strcpy(name, s);\n        cout << \"申请 \" << name << endl;\n    }\n    // 故意不写拷贝构造：编译器只做浅拷贝\n    ~A() {\n        cout << \"释放\" << endl;\n        delete[] name;                       // 同一块内存被退两次\n    }\n};\n\nint main() {\n    A a(\"Tom\");\n    A b = a;      // 浅拷贝：b.name 和 a.name 指向同一块\n    cout << \"b 也用 \" << b.name << endl;\n}",
      "output": "申请 Tom\nb 也用 Tom\n释放\n释放",
      "tip": "崩溃怎么读：最后一行 <code>释放</code> 之后程序直接退出，控制台不一定再打印别的。本机实测退出码 <b>3221226356</b>，即十六进制 <b>0xC0000374</b>（STATUS_HEAP_CORRUPTION，堆损坏）。两次「释放」说明两个对象都析构了，但只有一次 <code>new[]</code>——第二次 <code>delete[]</code> 退的是已经退过的同一块，这就是 double free。Linux/glibc 下常见 <code>free(): double free detected in tcache 2</code>；VS 调试器里可能弹 <code>Critical error detected c0000374</code>。看到这个码，先想\"同一块内存释放了两次\"。"
    },
    {
      "id": "d3t2",
      "title": "任务 2 · 补上深拷贝，同样的代码不再崩",
      "goal": "<b>目标</b>：在任务 1 的类里补一个拷贝构造，让 <code>b</code> 自己再租一块内存，再跑一遍对比结果。",
      "code": "#include <iostream>\n#include <cstring>\nusing namespace std;\n\nclass A {\npublic:\n    char* name;\n    A(const char* s) {\n        name = new char[strlen(s) + 1];\n        strcpy(name, s);\n        cout << \"申请 \" << name << endl;\n    }\n    A(const A& o) {                          // 深拷贝：自己再租一块\n        name = new char[strlen(o.name) + 1];\n        strcpy(name, o.name);\n        cout << \"深拷贝 \" << name << endl;\n    }\n    ~A() {\n        cout << \"释放 \" << name << endl;\n        delete[] name;\n    }\n};\n\nint main() {\n    A a(\"Tom\");\n    A b = a;\n    cout << \"a=\" << a.name << \" b=\" << b.name << endl;\n}",
      "output": "申请 Tom\n深拷贝 Tom\na=Tom b=Tom\n释放 Tom\n释放 Tom",
      "tip": "对比任务 1：多了一行「深拷贝」，说明 <code>b</code> 自己租了一块；两次「释放」各退各的，进程正常结束。"
    }
  ],
  "gloss": {
    "title": "今天这 5 个面试题，先用人话过一遍",
    "html": "<h4>今天这 5 个面试题，先用人话过一遍</h4>\n    <p><b>① 面向过程和面向对象有什么区别？</b>过程式按步骤拆，性能高、开发慢；OOP 按对象和责任拆，开发快、好扩展，代价是一点间接开销。</p>\n    <p><b>② 三大特征是什么？</b>封装（数据和操作捆一起、上权限）、继承（复用父类）、多态（同一个接口，不同对象有不同实现）。今天只要求把封装讲清楚。</p>\n    <p><b>③ 构造函数和析构函数干什么？</b>构造：对象出生时自动初始化成员；析构：对象退房前自动清理，尤其是把 new 出来的内存还掉。</p>\n    <p><b>④ public / protected / private 区别？</b>public 外面能用；private 只有类自己能用；protected 类和子类能用，没继承时等同 private。</p>\n    <p><b>⑤ 浅拷贝和深拷贝？</b>浅拷贝只抄指针地址，两个对象共用一块堆，容易双重释放；深拷贝重新申请一块，各管各的。</p>\n    <p class=\"say\">今天先把「封装 + 构造 + 析构 + 深拷贝」这四件事写熟，继承和多态等下一课再展开，现在碰只会混。</p>"
  }
};
