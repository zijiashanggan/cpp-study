window.DAYS = window.DAYS || {};
window.DAYS.day4 = {
  "id": "day4",
  "title": "Day 4 · 静态成员、this 与 const",
  "desc": "今天把「一个类所有对象共用的东西（static）」和「每个对象自己的 this」分清楚，再用 const、友元把封装补完整，最后写一个真正能扩容的动态数组类。每张卡都有真实输出，先猜再看。",
  "cards": [
    {
      "id": "d4c31",
      "fn": "static 成员变量",
      "num": 31,
      "title": "静态成员变量：全班共用一块白板",
      "pain": "<b>没有它会怎样</b>：想记录「这个类一共造了多少个对象」，用普通成员每个对象各存一份，谁也不认识总数。<code>static</code> 成员就是<b>全班共用一块白板</b>：不管班里坐了多少人，黑板只有一块，谁上去写，所有人都看得见。",
      "analogy": "全班共用一块白板，谁写大家都看得见",
      "only": "",
      "guess": "先猜：<code>o1.b = 200;</code> 之后 <code>o2.b</code> 是多少？<code>sizeof(o1)</code> 里算不算 b？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;                      // 直接写 cout\n\nclass Demo {\npublic:                                   // 下面这些外面能访问\n    int a;                                // 普通成员：每个对象各一份\n    static int b;                         // 静态成员：全类共用一份\n};\n\nint Demo::b = 10;                         // 类外定义并初始化，缺这行会链接报错\n\nint main() {                              // 程序入口\n    cout << Demo::b << \"\\n\";   // 10：不造对象也能读\n    Demo o1, o2;                          // 造两个对象\n    cout << sizeof(o1) << \"\\n\";   // 4：静态成员不算进对象\n    o1.b = 200;                           // 通过 o1 改白板\n    cout << o2.b << \"\\n\";   // 200：o2 看到的是同一份\n}",
      "output": "10\n4\n200",
      "errors": [],
      "pitfalls": [
        "<b>类内声明、类外定义</b>：类里只写 <code>static int b;</code>，真正的内存要在类外写 <code>int Demo::b = 10;</code>，漏了就报 undefined reference。",
        "<b>它不属于对象</b>：<code>sizeof</code> 只算普通成员，静态成员和成员函数都不进对象。",
        "<b>两种叫法都行</b>：<code>Demo::b</code> 说明它属于类，<code>o1.b</code> 只是借对象的名字找到同一块。",
        "<b>编译期就分配</b>：对象还没造，静态成员已经在内存里了。"
      ],
      "concl": "静态成员属于类，不属于对象；类内声明，类外定义。",
      "terms": "正式叫「静态成员变量（static data member）」；类外那行 <code>Demo::b = 10;</code> 叫「定义」。",
      "tags": [
        "static",
        "静态成员"
      ],
      "board": "",
      "quizIds": [
        "d4s01",
        "d4s02"
      ]
    },
    {
      "id": "d4c32",
      "fn": "static 成员变量",
      "num": 32,
      "title": "静态计数器：看住这个类到底有几个对象",
      "pain": "<b>没有它会怎样</b>：想知道「现在活着几个对象」，用普通成员只能看到某一个对象自己，看不到总数；全局变量又谁都能改、和类脱钩。静态成员做计数器，<b>构造 +1、析构 -1</b>，像<b>游泳馆门口的计数器</b>：进一个加一，出一个减一，池子里剩几个一目了然。",
      "analogy": "游泳馆门口的计数器：进一个加一，出一个减一",
      "only": "",
      "guess": "先猜：<code>Demo a, b; Demo c = b;</code> 之后计数器是 2 还是 3？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;                  // 直接写 cout\n\nclass Demo {\npublic:                               // 成员外部可见\n    static int count;                 // 计数器：全类共用一份\n    Demo() { count++; }               // 每造一个对象 +1\n    Demo(const Demo&) { count++; }    // 拷贝构造也要 +1\n    ~Demo() { count--; }              // 对象销毁就 -1\n};\n\nint Demo::count = 0;                  // 类外定义，初值 0\n\nint main() {                          // 程序入口\n    Demo a, b;                        // 造 2 个\n    Demo c = b;                       // 再拷贝 1 个\n    cout << Demo::count << \"\\n\";   // 3\n    {\n        Demo d, e;                    // 又造 2 个\n        cout << Demo::count << \"\\n\";   // 5\n    }                                 // d、e 出作用域，各 -1\n    cout << Demo::count << \"\\n\";   // 3\n}",
      "output": "3\n5\n3",
      "errors": [],
      "pitfalls": [
        "<b>拷贝构造也得管</b>：只写构造函数，<code>Demo c = b;</code> 会让计数少一个。",
        "<b>析构函数是减法的位置</b>：不是每个对象活到程序结束，出作用域就要 -1。",
        "<b>多线程不安全</b>：<code>count++</code> 不是原子操作，以后学线程再回来补。",
        "<b>计数器别乱公开</b>：最好是 private，再给一个 <code>static int getCount()</code> 读。"
      ],
      "concl": "静态成员 + 构造加、析构减，就是全类的对象计数器。",
      "terms": "这个套路叫「引用计数 / 实例计数」；C++ 里用静态成员实现，属于类级别的状态。",
      "tags": [
        "static",
        "计数器"
      ],
      "board": "",
      "quizIds": [
        "d4s03",
        "d4f01"
      ]
    },
    {
      "id": "d4c33",
      "fn": "static 成员函数",
      "num": 33,
      "title": "静态成员函数：没有 this，只能碰静态",
      "pain": "<b>没有它会怎样</b>：静态成员设成 private 后，外面读不到，只能造个对象再调普通函数，很别扭；而且普通函数里有 <code>this</code>，它根本不知道该看哪个对象。静态成员函数<b>像管理白板的班干部</b>：不坐在任何人的座位上（没有 this），只负责擦写那块公共白板。",
      "analogy": "管理公共白板的班干部：不坐谁的座位，只管公共那块板",
      "only": "",
      "guess": "先猜：静态成员函数里写 <code>a++;</code>（a 是普通成员），能编译吗？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;                        // 直接写 cout\n\nclass Demo {\n    int a;                                  // 普通成员：属于某个对象\n    static int b;                           // 私有静态成员\npublic:                                     // 成员外部可见\n    Demo() : a(0) {}                        // 默认构造\n    static int getB() { return b; }         // 静态函数：没有 this\n    // static int getA() { return a; }      // 编译报错：invalid use of member 'a'\n    void setA(int v) { a = v; }             // 普通函数：有 this\n};\n\nint Demo::b = 100;                          // 类外定义\n\nint main() {                                // 程序入口\n    cout << Demo::getB() << \"\\n\";   // 100：不造对象也能调\n    Demo o;                                 // 造一个对象\n    o.setA(5);                              // 普通函数改普通成员\n    cout << Demo::getB() << \"\\n\";   // 100\n}",
      "output": "100\n100",
      "errors": [],
      "pitfalls": [
        "<b>没有 this</b>：静态函数不知道你指的是哪个对象，所以碰不到普通成员变量。",
        "<b>普通函数两种都能碰</b>：普通成员函数既能访问普通成员，也能访问静态成员，反过来不行。",
        "<b>仍然受访问权限管</b>：静态函数写成 private，外面照样调不了。",
        "<b>主要用途</b>：把静态成员藏在 private，再用一个 public static 函数当窗口，这就是对静态数据的封装。"
      ],
      "concl": "静态函数没有 this，只能访问静态成员；它就是静态数据的那扇窗。",
      "terms": "正式叫「静态成员函数（static member function）」；普通成员函数里那个隐藏的 <code>this</code> 叫「this 指针」。",
      "tags": [
        "static",
        "静态成员函数"
      ],
      "board": "",
      "quizIds": [
        "d4s04",
        "d4j01"
      ]
    },
    {
      "id": "d4c34",
      "fn": "static 成员函数",
      "num": 34,
      "title": "饿汉式单例：程序一启动就先造好",
      "pain": "<b>没有它会怎样</b>：串口、日志、配置这类东西全工程只能有一份，谁都能 <code>new</code> 一个就乱套。单例就是<b>公司只有一台打印机</b>：不对外卖机器（构造私有），只留一个前台（<code>getInstance</code>），谁要用都去前台借同一台。「饿汉」是<b>一上班就把打印机开好</b>。",
      "analogy": "公司只有一台打印机，一上班就先开机等着",
      "only": "",
      "guess": "先猜：两次 <code>getInstance()</code> 拿到的地址一样吗？构造为什么必须私有？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;                              // 直接写 cout\n\nclass Singleton {\nprivate:                                          // 外面不能造\n    static Singleton* instance;                   // 唯一的实例地址\n    Singleton() {}                                // 构造私有：挡住外部 new\npublic:                                           // 只留一个入口\n    static Singleton* getInstance() {             // 工厂方法\n        return instance;                          // 永远返回同一个地址\n    }\n    void hello() { cout << \"我是唯一的\\n\"; }      // 业务方法\n};\n\nSingleton* Singleton::instance = new Singleton(); // 程序一启动就造好\n\nint main() {                                      // 程序入口\n    Singleton* p1 = Singleton::getInstance();     // 拿一次\n    Singleton* p2 = Singleton::getInstance();     // 再拿一次\n    cout << (p1 == p2) << \"\\n\";   // 1：同一个地址\n    p1->hello();                                  // 我是唯一的\n    // Singleton s;   // 编译报错：构造函数是 private\n}",
      "output": "1\n我是唯一的",
      "errors": [],
      "pitfalls": [
        "<b>构造必须私有</b>：不然外面 <code>Singleton s;</code> 就能再造一个，单例立刻破功。",
        "<b>拷贝构造也要挡</b>：不写 <code>= delete</code>，别人还能 <code>Singleton b = *p1;</code> 复制一份。",
        "<b>饿汉的代价</b>：程序一启动就占用资源，哪怕今天一次都没用到。",
        "<b>没有对应的析构</b>：<code>new</code> 出来这份一般不释放，进程结束由系统回收；想干净就换卡 36 的写法。"
      ],
      "concl": "单例 = 构造私有 + 静态实例 + 静态 getInstance；饿汉是启动就造。",
      "terms": "正式叫「单例模式（Singleton）」；<code>getInstance</code> 这种创建入口叫「工厂方法」。",
      "tags": [
        "单例",
        "饿汉式"
      ],
      "board": "",
      "quizIds": [
        "d4s05",
        "d4s06"
      ]
    },
    {
      "id": "d4c35",
      "fn": "static（局部 / 文件）",
      "num": 35,
      "title": "懒汉式单例：第一次要用才造",
      "pain": "<b>没有它会怎样</b>：饿汉式不管用不用，启动就占内存。嵌入式里 RAM 很紧，很多模块可能一辈子不打开。懒汉式就是<b>客人来了才开打印机</b>：第一次有人借才通电，之后谁来都是这台。",
      "analogy": "客人来了才开打印机，之后谁来都是这台",
      "only": "",
      "guess": "先猜：<code>main</code> 里第一行打印之前，实例造好了吗？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;                               // 直接写 cout\n\nclass Singleton {\nprivate:                                           // 外面不能造\n    static Singleton* instance;                    // 先空着\n    Singleton() { cout << \"造了一个\\n\"; }          // 构造私有\npublic:                                            // 只留一个入口\n    static Singleton* getInstance() {              // 工厂方法\n        if (instance == nullptr) {                 // 没人造过才造\n            instance = new Singleton();            // 第一次用到才 new\n        }\n        return instance;                           // 之后都返回同一份\n    }\n};\n\nSingleton* Singleton::instance = nullptr;          // 一开始是空\n\nint main() {                                       // 程序入口\n    cout << \"main 开始\\n\";                         // 此时还没造\n    Singleton* p1 = Singleton::getInstance();      // 这里才造\n    Singleton* p2 = Singleton::getInstance();      // 不再造\n    cout << (p1 == p2) << \"\\n\";   // 1\n}",
      "output": "main 开始\n造了一个\n1",
      "errors": [],
      "pitfalls": [
        "<b>判空不能省</b>：忘了 <code>if (instance == nullptr)</code>，每调一次就 <code>new</code> 一个，单例变成多例。",
        "<b>第一次调用才花钱</b>：懒汉省启动资源，代价是第一次调用时有一次延迟。",
        "<b>多线程不安全</b>：两个线程同时进来可能各造一个；正式工程要加锁，或者直接用卡 36 的写法。",
        "<b>还是要挡拷贝</b>：和饿汉一样，拷贝构造、赋值都要 <code>= delete</code>。"
      ],
      "concl": "懒汉式在第一次 getInstance 时才创建，判空那一句就是它的命门。",
      "terms": "「懒汉式（lazy）」= 延迟到第一次使用才初始化；对应的「饿汉式（eager）」= 启动就初始化。",
      "tags": [
        "单例",
        "懒汉式"
      ],
      "board": "",
      "quizIds": [
        "d4s07",
        "d4j02"
      ]
    },
    {
      "id": "d4c36",
      "fn": "static（局部 / 文件）",
      "num": 36,
      "title": "静态局部变量单例：最省事、也最安全",
      "pain": "<b>没有它会怎样</b>：饿汉浪费启动资源，懒汉要手动判空、还要自己管释放，多线程下还得加锁。C++11 起有更省事的写法：<b>函数里的 static 局部变量</b>，第一次执行到才构造，而且编译器保证只构造一次。像<b>只在需要时才开的那盏灯，开了就不再关</b>。",
      "analogy": "只在需要时才开的那盏灯，开了就不再关",
      "only": "",
      "guess": "先猜：<code>getInstance()</code> 调三次，构造会打印几次？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;                            // 直接写 cout\n\nclass Singleton {\nprivate:                                        // 外面不能造\n    Singleton() { cout << \"只造一次\\n\"; }       // 构造私有\n    Singleton(const Singleton&) = delete;       // 禁止拷贝\n    Singleton& operator=(const Singleton&) = delete;   // 禁止赋值\npublic:                                         // 只留一个入口\n    static Singleton& getInstance() {           // 返回引用更方便\n        static Singleton one;                   // 第一次进来才初始化\n        return one;                             // 之后都是它\n    }\n    int id = 7;                                 // 一个普通成员\n};\n\nint main() {                                    // 程序入口\n    Singleton& a = Singleton::getInstance();    // 第一次：造\n    Singleton& b = Singleton::getInstance();    // 第二次：直接用\n    cout << (&a == &b) << \"\\n\";   // 1：同一个对象\n    cout << a.id << \"\\n\";   // 7\n}",
      "output": "只造一次\n1\n7",
      "errors": [],
      "pitfalls": [
        "<b>静态局部变量在静态区</b>：不在栈上，函数返回了它还在，程序结束才销毁。",
        "<b>只初始化一次</b>：C++11 起编译器保证这件事，多线程下也安全。",
        "<b>作用域仍在函数内</b>：外面拿不到这个变量，只能通过 <code>getInstance()</code> 拿引用。",
        "<b>返回引用不是指针</b>：调用方写 <code>Singleton& s = Singleton::getInstance();</code>，不用管释放。"
      ],
      "concl": "函数内 static 局部变量，天然只构造一次，是现在最推荐的单例写法。",
      "terms": "正式叫「静态局部变量（static local variable）」，也常叫「Meyers Singleton」；<code>= delete</code> 表示明确禁用。",
      "tags": [
        "单例",
        "静态局部变量"
      ],
      "board": "",
      "quizIds": [
        "d4s08",
        "d4f02"
      ]
    },
    {
      "id": "d4c37",
      "fn": "sizeof",
      "num": 37,
      "title": "类的存储结构：sizeof 到底算的是什么",
      "pain": "<b>没有它会怎样</b>：很多人以为类里写了函数、写了 static，对象就会变大，结果 <code>sizeof</code> 一测对不上，串口发结构体时长度算错。<b>对象里只放非静态数据成员</b>；成员函数全类只有一份代码，静态成员在静态区，都不进对象。像<b>员工工牌</b>：只印本人的信息，公司的规章制度不印在每张卡上。",
      "analogy": "员工工牌只印本人信息，公司制度不印在每张卡上",
      "only": "",
      "guess": "先猜：<code>char a; int b; static int c;</code> 再加一个成员函数，<code>sizeof(Demo)</code> 是 5 还是 8？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;              // 直接写 cout\n\nclass Demo {\npublic:                           // 权限和空间没关系\n    char a;                       // 1 字节\n    int b;                        // 4 字节\n    static int c;                 // 静态成员：不进对象\n    void fun() {}                 // 成员函数：不进对象\n};\n\nint Demo::c = 10;                 // 静态成员放静态区\n\nint main() {                      // 程序入口\n    cout << sizeof(Demo) << \"\\n\";   // 8：1 + 4 + 3 字节填充\n    Demo o;                       // 造一个对象看看\n    cout << sizeof(o) << \"\\n\";   // 8：对象和类一样大\n}",
      "output": "8\n8",
      "errors": [],
      "pitfalls": [
        "<b>对齐填充</b>：<code>char</code> 后面要补 3 个字节，让 <code>int</code> 从 4 的倍数开始，所以是 8 不是 5。",
        "<b>顺序会影响大小</b>：<code>char + int + int</code> 是 12；把两个 int 放前面、char 放最后，还是 12。",
        "<b>空类不是 0</b>：空类 <code>sizeof</code> 是 1，编译器要给它一个地址。",
        "<b>以后会变</b>：加了虚函数会多一个指针（vptr），32 位加 4 字节，64 位加 8 字节。",
        "<b>static 和函数不算</b>：这两样全类共用，不属于某一个对象。"
      ],
      "concl": "对象里只有非静态数据成员，还要按对齐规则补空；static 和函数都不占。",
      "terms": "这个大小叫「对象布局 / 内存对齐」；补的那些字节叫「填充（padding）」。",
      "tags": [
        "sizeof",
        "内存对齐"
      ],
      "board": "",
      "quizIds": [
        "d4s09",
        "d4s10"
      ]
    },
    {
      "id": "d4c38",
      "fn": "this",
      "num": 38,
      "title": "this 指针：形参和成员同名时怎么分开",
      "pain": "<b>没有它会怎样</b>：<code>void setA(int a) { a = a; }</code> 看着像赋值，其实左边右边都是形参，成员一直没动，编译器还不报错。成员函数全类共用一份代码，得靠一个隐藏指针知道「这次是哪个对象在调用」，那就是 <b>this</b>——<b>相当于「我这间房」</b>，同名时用它指明是房间里的东西。",
      "analogy": "说到「我这间房」，才知道指的是谁家的东西",
      "only": "",
      "guess": "先猜：<code>a = a;</code> 写完，对象的成员 a 会变成 10 吗？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;                      // 直接写 cout\n\nclass Demo {\npublic:                                   // 成员外部可见\n    int a;                                // 成员 a\n    void setA(int a) {                    // 形参也叫 a\n        this->a = a;                      // 左边是成员，右边是形参\n    }\n};\n\nint main() {                              // 程序入口\n    Demo o1, o2;                          // 两个对象\n    o1.setA(10);                          // o1 的 a = 10\n    o2.setA(20);                          // o2 的 a = 20\n    cout << o1.a << \" \" << o2.a << \"\\n\";   // 10 20\n}",
      "output": "10 20",
      "errors": [],
      "pitfalls": [
        "<b>就近原则</b>：形参和成员同名时，直接写名字拿到的是形参，所以必须加 <code>this-></code>。",
        "<b>this 不占对象空间</b>：它是编译器传进来的隐含参数，不是成员，<code>sizeof</code> 不受影响。",
        "<b>只有非静态函数有</b>：静态成员函数没有 this，这也是它碰不到普通成员的原因。",
        "<b>别乱返回 this</b>：<code>return this;</code> 是指针，<code>return *this;</code> 才是对象本身（下一张）。"
      ],
      "concl": "形参和成员同名，就用 this-> 指明左边那个是成员。",
      "terms": "<code>this</code> 叫「指向本对象的指针」，它隐含在每个非静态成员函数里。",
      "tags": [
        "this",
        "同名形参"
      ],
      "board": "",
      "quizIds": [
        "d4s11",
        "d4f03"
      ]
    },
    {
      "id": "d4c39",
      "fn": "this",
      "num": 39,
      "title": "return *this：链式调用一路点下去",
      "pain": "<b>没有它会怎样</b>：想让 <code>o.add(1).add(2).add(3)</code> 连着写，函数就得把「刚才那个对象」交回来；返回 <code>void</code> 就断了。<code>return *this;</code> 就是<b>把「我自己」递回去</b>，下一个点号接着在同一个对象上干活。",
      "analogy": "办完一件事把「我自己」递给你，接着办下一件",
      "only": "",
      "guess": "先猜：<code>o.add(1).add(2).add(3)</code> 之后 <code>o.sum</code> 是 6，还是只有 3？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;                              // 直接写 cout\n\nclass Demo {\npublic:                                           // 成员外部可见\n    int sum = 0;                                  // 累加结果\n    Demo& add(int v) {                            // 返回引用，不是新对象\n        sum += v;                                 // 累加到当前对象\n        return *this;                             // 谁调用我，就返回谁\n    }\n};\n\nint main() {                                      // 程序入口\n    Demo o;                                       // 造一个对象\n    o.add(1).add(2).add(3);                       // 一路点下去\n    cout << o.sum << \"\\n\";   // 6\n}",
      "output": "6",
      "errors": [],
      "pitfalls": [
        "<b>必须返回引用</b>：写成 <code>Demo add(int)</code> 返回的是临时拷贝，后面几刀都砍在副本上，<code>o.sum</code> 只剩 3。",
        "<b>不能返回局部变量</b>：<code>return *this;</code> 返回的是当前对象，安全；返回函数里的局部对象引用就是野引用。",
        "<b>静态函数没有 *this</b>：静态成员函数里没有 this，也就没法链式。",
        "<b>常见场景</b>：<code>cout &lt;&lt; a &lt;&lt; b</code> 的 <code>&lt;&lt;</code>、赋值运算符，都是靠返回自身做链式。"
      ],
      "concl": "想链式调用就返回 Demo&amp;，而 return *this; 返回的就是当前对象本身。",
      "terms": "<code>*this</code> 是「解引用 this」，得到对象本体；这种写法叫「链式调用（method chaining）」。",
      "tags": [
        "this",
        "链式调用"
      ],
      "board": "",
      "quizIds": [
        "d4s12",
        "d4j03"
      ]
    },
    {
      "id": "d4c40",
      "fn": "const 成员函数",
      "num": 40,
      "title": "const 成员函数与 mutable：只读承诺",
      "pain": "<b>没有它会怎样</b>：一个只负责打印的函数，本来不该改数据，但编译器不知道，你手滑写错一行也不拦。在函数后面加 <code>const</code>，就是<b>在门口挂「只读，不许动」的牌子</b>，里面真改了，编译直接报错。极少数确实要改的（比如缓存、计数器），用 <code>mutable</code> 单独开个后门。",
      "analogy": "门口挂「只读，不许动」的牌子，mutable 是唯一的后门",
      "only": "",
      "guess": "先猜：const 函数里改普通成员 a 和 mutable 成员 c，哪个能编译过？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;                        // 直接写 cout\n\nclass Demo {\npublic:                                     // 成员外部可见\n    int a;                                  // 普通成员\n    mutable int c;                          // mutable：const 函数里也能改\n    Demo(int a, int c) : a(a), c(c) {}      // 有参构造\n    void show() const {                     // 函数后面加 const\n        // a = 100;   // 编译报错：assignment of member 'a' in read-only object\n        c = 100;                            // c 有 mutable，放行\n        cout << a << \" \" << c << \"\\n\";      // 10 100\n    }\n};\n\nint main() {                                // 程序入口\n    Demo o(10, 30);                         // 造对象\n    o.show();                               // 10 100\n}",
      "output": "10 100",
      "errors": [],
      "pitfalls": [
        "<b>const 写在函数后面</b>：<code>void show() const</code>，不是写在前面；写在前面修饰的是返回值。",
        "<b>本质是修饰 this</b>：它把 this 变成「指向常量的指针」，成员就都成了只读。",
        "<b>mutable 少用</b>：只给缓存、计数这类「逻辑上不算改了状态」的成员用，滥用等于没加 const。",
        "<b>两个版本能共存</b>：同一个函数可以同时有 const 版和非 const 版，编译器按对象是否 const 挑。"
      ],
      "concl": "函数后加 const 表示只读；真要改，只有 mutable 成员能过。",
      "terms": "「const 成员函数」承诺不改对象状态；<code>mutable</code> 读作「可变的」，用来给这条承诺开例外。",
      "tags": [
        "const",
        "mutable"
      ],
      "board": "",
      "quizIds": [
        "d4s13",
        "d4s14"
      ]
    },
    {
      "id": "d4c41",
      "fn": "const 成员函数",
      "num": 41,
      "title": "常对象：只能用 const 的门",
      "pain": "<b>没有它会怎样</b>：函数参数写成 <code>const Demo&amp; o</code> 是为了「借看，不给你改」，结果里面调了个普通成员函数，编译直接不过。常对象就是<b>贴着封条的对象</b>：只能走贴「只读」标签的门（const 函数），普通门一律不给开。",
      "analogy": "贴着封条的对象，只开贴「只读」标签的门",
      "only": "",
      "guess": "先猜：<code>const Demo o;</code> 之后 <code>o.test()</code>（普通函数）能编译吗？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;                        // 直接写 cout\n\nclass Demo {\npublic:                                     // 成员外部可见\n    int a;                                  // 普通成员\n    mutable int c;                          // mutable 成员\n    Demo() : a(0), c(0) {}                  // 默认构造\n    void show() const {                     // const 函数：常对象能叫\n        cout << a << \" \" << c << \"\\n\";      // 0 0\n    }\n    void test() { cout << \"普通函数\\n\"; }    // 普通函数：常对象叫不了\n};\n\nint main() {                                // 程序入口\n    const Demo o;                           // 常对象\n    o.show();                               // 可以：const 函数\n    // o.test();   // 编译报错：passing 'const Demo' as 'this' discards qualifiers\n    // o.a = 1;    // 编译报错：assignment of member 'a' in read-only object\n    o.c = 100;                              // mutable 成员放行\n    cout << o.c << \"\\n\";   // 100\n}",
      "output": "0 0\n100",
      "errors": [],
      "pitfalls": [
        "<b>const 对象只能调 const 函数</b>：普通成员函数可能改数据，编译器不敢放行。",
        "<b>数据能读不能写</b>：<code>cout &lt;&lt; o.a</code> 可以，<code>o.a = 1</code> 不行。",
        "<b>mutable 是例外</b>：常对象也能改 mutable 成员，这是它唯一的漏洞。",
        "<b>顺带记住</b>：const 引用参数 <code>const Demo&amp;</code> 也有同样限制，所以你的只读函数要记得加 const。"
      ],
      "concl": "常对象只能调用 const 成员函数；成员能读不能改，mutable 除外。",
      "terms": "「常对象（const object）」创建后状态不可改；「const 引用传参」是只读借用的标准写法。",
      "tags": [
        "const",
        "常对象"
      ],
      "board": "",
      "quizIds": [
        "d4s15",
        "d4j04"
      ]
    },
    {
      "id": "d4c42",
      "fn": "friend",
      "num": 42,
      "title": "友元：给信得过的人一把备用钥匙",
      "pain": "<b>没有它会怎样</b>：私有成员藏得太严，有些函数天生就要跨类看数据（比如两个类一起算距离、状态类查角色血量），只能到处加 getter，越写越乱。友元就是<b>给好朋友一把备用钥匙</b>：他能进你卧室，但他不是你家的人（不是成员函数），也没有你的 this。",
      "analogy": "给好朋友一把备用钥匙，他不是家里人",
      "only": "",
      "guess": "先猜：友元函数能访问 private 成员吗？它是这个类的成员函数吗？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;                          // 直接写 cout\n\nclass Person {\n    friend void showId(Person& p);            // 声明：这个函数是朋友\nprivate:                                      // 下面私有\n    int id;                                   // 私有成员\npublic:                                       // 成员外部可见\n    Person(int v) : id(v) {}                  // 构造\n};\n\nvoid showId(Person& p) {                      // 朋友函数，不是成员\n    cout << p.id << \"\\n\";                     // 私有成员也能读\n}\n\nint main() {                                  // 程序入口\n    Person p(42);                             // 造对象\n    showId(p);                                // 42\n}",
      "output": "42",
      "errors": [],
      "pitfalls": [
        "<b>friend 写在被访问的类里</b>：想读 Person 的私有，就在 Person 里写 <code>friend ...</code>，不是写在朋友那边。",
        "<b>友元不是成员</b>：没有 this，想访问谁的数据得把对象传进来。",
        "<b>单向、不传递、不继承</b>：A 把 B 当朋友，不代表 B 把 A 当朋友；朋友的朋友也不是朋友。",
        "<b>还能声明友元类</b>：<code>friend class GameState;</code> 一开，那个类的所有成员函数都能进来。",
        "<b>别滥用</b>：友元是拆封装的，只给确实需要跨类协作的那一两个函数开。"
      ],
      "concl": "friend 在类里声明，朋友就能看私有，但它不是成员、没有 this。",
      "terms": "「友元函数（friend function）」「友元类（friend class）」；它拿到的是「特权访问权」。",
      "tags": [
        "友元",
        "friend"
      ],
      "board": "",
      "quizIds": [
        "d4s16",
        "d4s17"
      ]
    },
    {
      "id": "d4c43",
      "fn": "new[]",
      "num": 43,
      "title": "实战：封装一个会扩容的动态数组类",
      "pain": "<b>没有它会怎样</b>：C 数组长度写死，多存一个就越界；用 <code>int*</code> 裸指针又得自己记长度、自己释放，一拷贝就双重释放。把「指针 + 个数 + 容量」封进类里，<b>满了自动换大房子，拷贝时各建各的</b>，外面只管 add 和 print。",
      "analogy": "住满了自动换大房子，搬家时一家一份钥匙",
      "only": "",
      "guess": "先猜：容量 2 的数组塞第 3 个元素会怎样？<code>MyArray b = a;</code> 之后改 b，a 会变吗？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;                                   // 直接写 cout\n\nclass MyArray {\n    int* arr;                                          // 首元素地址\n    int size;                                          // 现有元素个数\n    int capacity;                                      // 最多能装几个\npublic:                                                 // 对外接口从这里开始\n    MyArray(int cap) : size(0), capacity(cap) {         // 有参构造\n        arr = new int[capacity];                        // 按容量租地\n    }\n    MyArray(const MyArray& o) {                         // 深拷贝\n        size = o.size;                                  // 个数照抄\n        capacity = o.capacity;                          // 容量照抄\n        arr = new int[capacity];                        // 自己再租一块\n        for (int i = 0; i < size; i++) arr[i] = o.arr[i];   // 逐个搬过来\n    }\n    ~MyArray() { delete[] arr; }                        // 退房：把地还掉\n    void add(int v) {                                   // 尾部追加\n        if (size == capacity) {                         // 满了就扩容\n            int* tmp = new int[capacity * 2];           // 租两倍大的地\n            for (int i = 0; i < size; i++) tmp[i] = arr[i];  // 搬过去\n            delete[] arr;                               // 退掉旧地\n            arr = tmp;                                  // 指向新地\n            capacity *= 2;                              // 更新容量\n        }\n        arr[size++] = v;                                // 放进去，个数 +1\n    }\n    void print() {                                      // 打印当前元素\n        for (int i = 0; i < size; i++) {                // 逐个元素遍历\n            cout << arr[i] << (i + 1 < size ? \" \" : \"\\n\");   // 最后一个换行\n        }\n    }\n};\n\nint main() {                                            // 程序入口\n    MyArray a(2);                                       // 容量 2\n    a.add(10);                                          // 第 1 个\n    a.add(20);                                          // 第 2 个，装满\n    a.add(30);                                          // 第 3 个：触发扩容到 4\n    a.print();                                          // 10 20 30\n    MyArray b = a;                                      // 深拷贝：各管各的\n    b.add(40);                                          // 只改 b\n    a.print();                                          // 10 20 30\n    b.print();                                          // 10 20 30 40\n}",
      "output": "10 20 30\n10 20 30\n10 20 30 40",
      "errors": [],
      "pitfalls": [
        "<b>三个数缺一不可</b>：<code>arr</code> 记地址、<code>size</code> 记用了几个、<code>capacity</code> 记能装几个，混用就是越界。",
        "<b>扩容三步</b>：租新地 → 搬数据 → 退旧地，顺序反了就是野指针。",
        "<b>有指针就必须深拷贝</b>：默认拷贝只抄地址，两个对象共用一块，析构两次直接崩。",
        "<b>析构用 delete[]</b>：<code>new[]</code> 配 <code>delete[]</code>，写成 <code>delete</code> 只析构第一个元素。",
        "<b>三法则</b>：拷贝构造、拷贝赋值、析构一起写；这张卡只写了两个，赋值运算符留给你补。"
      ],
      "concl": "指针 + 个数 + 容量封装进类；满了扩容，拷贝时重新租地。",
      "terms": "「动态数组 / 顺序表」；「扩容（capacity growth）」；「深拷贝（deep copy）」和「三法则（Rule of Three）」。",
      "tags": [
        "动态数组",
        "深拷贝",
        "扩容"
      ],
      "board": "",
      "quizIds": [
        "d4s18",
        "d4c01"
      ]
    }
  ],
  "taskTitle": "Day 4 · 今天动手",
  "taskDesc": "两个任务都在本机跑，不用开发板。任务 1 把静态计数器和单例放在一起看；任务 2 亲手给动态数组补上扩容和深拷贝，再故意删掉深拷贝看会发生什么。",
  "tasks": [
    {
      "id": "d4t1",
      "title": "任务 1 · 静态计数器 + 单例地址验证",
      "goal": "<b>目标</b>：先用静态成员数清对象个数，再用 <code>getInstance()</code> 验证两次拿到的是同一个地址。",
      "code": "#include <iostream>\nusing namespace std;                            // 直接写 cout\n\nclass Counter {\npublic:\n    static int n;                               // 全类共用的计数器\n    Counter() { n++; }                          // 造一个 +1\n    Counter(const Counter&) { n++; }            // 拷贝一个 +1\n    ~Counter() { n--; }                         // 销毁一个 -1\n};\nint Counter::n = 0;                             // 类外定义\n\nclass One {\nprivate:\n    One() { cout << \"单例构造\\n\"; }             // 外面造不了\npublic:\n    static One& get() {                         // 唯一入口\n        static One o;                           // 只初始化一次\n        return o;                               // 永远这一个\n    }\n};\n\nint main() {\n    Counter a, b;                               // 2 个\n    Counter c = b;                              // 3 个\n    cout << \"count=\" << Counter::n << endl;     // 3\n    One& x = One::get();                        // 第一次：构造\n    One& y = One::get();                        // 第二次：不再构造\n    cout << (&x == &y) << endl;                 // 1\n}",
      "output": "count=3\n单例构造\n1",
      "tip": "看到 <code>count=3</code> 说明构造和拷贝都算上了；只打印一次「单例构造」，说明静态局部变量真的只初始化一次。"
    },
    {
      "id": "d4t2",
      "title": "任务 2 · 给动态数组补扩容和深拷贝",
      "goal": "<b>目标</b>：把卡 43 的 <code>MyArray</code> 自己敲一遍，先跑通；再把深拷贝那一段注释掉，观察两个对象共用一块内存后输出有什么变化。",
      "code": "#include <iostream>\nusing namespace std;                            // 直接写 cout\n\nclass MyArray {\n    int* arr;\n    int size;\n    int capacity;\npublic:\n    MyArray(int cap) : size(0), capacity(cap) { arr = new int[capacity]; }\n    MyArray(const MyArray& o) {                 // 深拷贝：注释掉它试试\n        size = o.size;\n        capacity = o.capacity;\n        arr = new int[capacity];\n        for (int i = 0; i < size; i++) arr[i] = o.arr[i];\n    }\n    ~MyArray() { delete[] arr; }                // 退房\n    void add(int v) {\n        if (size == capacity) {                 // 满了扩到两倍\n            int* tmp = new int[capacity * 2];\n            for (int i = 0; i < size; i++) tmp[i] = arr[i];\n            delete[] arr;\n            arr = tmp;\n            capacity *= 2;\n        }\n        arr[size++] = v;\n    }\n    void print() {\n        for (int i = 0; i < size; i++) cout << arr[i] << \" \";\n        cout << endl;\n    }\n};\n\nint main() {\n    MyArray a(2);\n    a.add(1); a.add(2); a.add(3);               // 第 3 个触发扩容\n    a.print();                                  // 1 2 3\n    MyArray b = a;                              // 深拷贝\n    b.add(4);                                   // 只影响 b\n    a.print();                                  // 1 2 3\n    b.print();                                  // 1 2 3 4\n}",
      "output": "1 2 3 \n1 2 3 \n1 2 3 4 ",
      "tip": "把深拷贝构造函数注释掉再跑：<code>b.add(4)</code> 会写到 <code>a</code> 的数组里（因为共用一块），而且两个对象析构时会对同一块内存 <code>delete[]</code> 两次，程序大概率直接崩。这个对比就是三法则为什么存在。"
    }
  ],
  "gloss": {
    "title": "今天这 5 个面试题，先用人话过一遍",
    "html": "<h4>今天这 5 个面试题，先用人话过一遍</h4>\n    <p><b>① 什么是浅拷贝和深拷贝？</b>浅拷贝只抄指针地址，两个对象共用一块堆，一个改了另一个也变，析构时还会双重释放；深拷贝重新申请一块内存，把内容搬过去，各管各的。</p>\n    <p><b>② 什么是单例模式？懒汉和饿汉差在哪？</b>保证一个类只有一个实例，并提供统一的访问入口（构造私有 + 静态 getInstance）。饿汉在程序启动时就创建，简单但占资源；懒汉在第一次使用时才创建，省资源但要判空、要处理多线程。</p>\n    <p><b>③ 类的存储结构是怎样的？</b>对象里只放非静态数据成员，还要按对齐规则补填充字节；静态成员放在静态区，成员函数全类只有一份代码，都不占对象空间。所以 <code>sizeof</code> 只看普通成员和填充。</p>\n    <p><b>④ C 的 static 和 C++ 的 static 区别？</b>C 里主要管生命周期和链接属性（函数内的静态变量、文件内的静态函数）；C++ 多了一层「属于类」：静态成员变量全类共享一份，静态成员函数没有 this，可以直接用类名调用。</p>\n    <p><b>⑤ const 有哪些用法？</b>修饰变量表示只读；修饰引用/指针表示不能通过它改；放在成员函数后面表示不改对象状态（mutable 成员除外）；const 对象只能调用 const 成员函数。</p>\n    <p class=\"say\">explicit 和「空类默认有哪些成员函数」上一课已经讲过，忘了就翻回 Day 3 的卡 29 和卡 30。今天先把 static、this、const、友元这四件事串起来，动态数组那道题一定要自己敲一遍。</p>"
  }
};
