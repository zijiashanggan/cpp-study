window.DAYS = window.DAYS || {};
window.DAYS.day2 = {
  "id": "day2",
  "title": "Day 2 · 内存、类型与函数规则",
  "desc": "还是箱子那套比喻。Day 2 多了一个新东西：门牌号能自己申请、自己归还（new / delete）。每张卡同样按「动机 → 比方 → 例子和输出 → 常错 → 结论」走。",
  "cards": [
    {
      "id": "d2c07",
      "num": 7,
      "title": "new / delete：租房子和退房子必须对上",
      "pain": "<b>没有它会怎样</b>：栈上数组的大小必须编译时定死，数据一多就爆栈；想按运行时的数量申请，只能找堆。<code>new</code> 是<b>租一间房、拿到门牌号</b>，<code>delete</code> 是退租；<b>怎么租的就怎么退</b>，这是唯一死规矩。",
      "analogy": "怎么租的就怎么退",
      "only": "",
      "guess": "",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int* p = new int;        // 租一间房\n    *p = 42;\n    cout << *p << \"\\n\";      // 42\n    delete p;                // 退一间\n    p = nullptr;\n\n    int* arr = new int[10];  // 租一排十间\n    arr[0] = 1;\n    cout << arr[0] << \"\\n\";  // 1\n    delete[] arr;            // 退一排必须带 []\n    arr = nullptr;\n\n    // int* q = new int;\n    // free(q);              // 错：new 的房不能找 free 退\n}",
      "output": "",
      "errors": [],
      "pitfalls": [
        "<b>配对表只有两行</b>：<code>new</code> ↔ <code>delete</code>，<code>new[]</code> ↔ <code>delete[]</code>。拿错钥匙属于未定义行为，常见表现是当场崩溃。",
        "<b>退完不置空 = 悬垂指针</b>：号码还捏在手里，再照着找过去就是开一扇已经不属于你的门。",
        "<b>delete nullptr 是安全的</b>：什么都不做，所以置空后重复退也不会出事。"
      ],
      "concl": "谁 new 的谁 delete，怎么借的怎么还，退完立刻把号码划掉。",
      "terms": "这叫「动态内存分配与释放」，退完不置空再用叫「悬垂指针（dangling pointer）」，同一块退两次叫「double free」。",
      "tags": [],
      "board": "",
      "quizIds": []
    },
    {
      "id": "d2c08",
      "num": 8,
      "title": "nullptr：一张写着\"没有门牌号\"的卡片",
      "pain": "<b>没有它会怎样</b>：C 里 <code>NULL</code> 本质就是数字 0，遇到重载或模板，编译器分不清你要\"整数 0\"还是\"空指针\"。<code>nullptr</code> 是<b>一张写着\"没有门牌号\"的专用卡片</b>，只认指针，不认整数。",
      "analogy": "一张写着\"没有门牌号\"的专用卡片",
      "only": "",
      "guess": "",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int* p = nullptr;\n    cout << (p == nullptr) << \"\\n\";   // 1\n\n    int* q = new int(7);\n    delete q;\n    q = nullptr;                      // 退完立刻划掉号码\n\n    // int x = nullptr;               // 编译报错：cannot convert 'std::nullptr_t' to 'int'\n    // void f(int); void f(char*);\n    // f(NULL);                       // 二义性：两个版本都能匹配\n}",
      "output": "",
      "errors": [],
      "pitfalls": [
        "<b>是啥</b>：C++11 引入的空指针字面量，类型是 <code>std::nullptr_t</code>，能隐式转成任何指针类型。",
        "<b>干嘛用</b>：初始化、判空、<code>delete</code> 之后立刻置空防野指针。",
        "<b>和 NULL 的本质区别</b>：<code>NULL</code> 是 0 的宏，模板还会把它推导成 <code>int</code>；<code>nullptr</code> 能转任意指针，但<b>不能转成整数</b>（上面那条报错就是证据）。",
        "<b>最容易踩的坑</b>：<code>nullptr</code> 是 C++ 的东西，<b>.c 文件里没有</b>（那里只能写 <code>NULL</code> 或 <code>0</code>）。以后用 Keil 时，.c/.cpp 混着写最容易在这报错。",
        "<b>电脑上解引用空指针会怎样</b>：进程当场崩溃，Windows 报 <code>0xC0000005</code>（访问冲突），Linux 报 <code>Segmentation fault</code>。<b>以后有板子再看</b>：STM32 上等于读地址 0，直接进 HardFault；HAL 库里到处写 <code>if (p == NULL) return HAL_ERROR;</code> 就是这个原因。"
      ],
      "concl": ".cpp 里判空一律写 nullptr，.c 里只能写 NULL 或 0。",
      "terms": "<code>nullptr</code>（空指针字面量）、<code>NULL</code>（C 里的 0 宏）、<code>std::nullptr_t</code>（它的类型）、野指针（dangling pointer）。",
      "tags": [],
      "board": "",
      "quizIds": []
    },
    {
      "id": "d2c09",
      "num": 9,
      "title": "struct 加强：箱子自己也会干活了",
      "pain": "<b>没有它会怎样</b>：C 里数据和函数分家，函数只能叫 <code>Point_sum(&amp;p)</code>，点一多就分不清谁管谁。C++ 的 struct 能把函数装进去，<code>p.sum()</code> 一眼看出这是 p 的事——这就是通往\"类\"的那级台阶。",
      "analogy": "",
      "only": "",
      "guess": "",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nstruct Point {\n    int x, y;\n    int sum() { return x + y; }   // 函数直接用自己的 x、y\n};\n\nint main() {\n    Point p;              // 不用写 struct Point p;\n    p.x = 3;\n    p.y = 4;\n    cout << p.sum() << \"\\n\";   // 7\n}",
      "output": "",
      "errors": [],
      "pitfalls": [
        "<code>p.sum()</code> 读作\"让 p 这口箱子干 sum 这件事\"：点左边是箱子，右边是动作。",
        "写 <code>struct Point p;</code> 也能编译，那是 C 的习惯；C++ 里直接把 <code>Point</code> 当类型名用。",
        "struct 和 class 只差默认权限；struct 默认公开，正好接上 Day 3 卡 19。"
      ],
      "concl": "C++ 的 struct 是\"带动作的箱子\"，定义变量不用再带 struct。",
      "terms": "结构体里的函数叫「成员函数（member function）」，<code>p.sum()</code> 这种写法叫「成员访问」，把数据和操作它的函数放进同一个盒子叫「封装」。",
      "tags": [],
      "board": "",
      "quizIds": []
    },
    {
      "id": "d2c10",
      "num": 10,
      "title": "bool：只有\"是\"和\"否\"两个格子",
      "pain": "<b>没有它会怎样</b>：C 里用 <code>int</code> 装真假，0、1、-1 混着用，读代码先得猜\"这个 1 是数量还是真\"。<code>bool</code> 只有 <code>true</code>/<code>false</code>，意图一眼看懂，占 <b>1 个字节</b>。",
      "analogy": "1 个字节",
      "only": "",
      "guess": "",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nint main() {\n    bool ok = true, err = false;\n    cout << ok << \"\\n\";     // 1\n    cout << err << \"\\n\";    // 0\n\n    int n = true;\n    cout << n << \"\\n\";      // 1\n    // bool flag = 5;       // 只给警告，非 0 都算 true —— 别这么写\n}",
      "output": "",
      "errors": [],
      "pitfalls": [
        "它是 1 <b>字节</b>，不是 1 位。8 个 bool 就是 8 字节，别指望靠它省 RAM；真要按位省，得自己用位操作（Day 2 卡 16）。",
        "数字变 bool 只认\"是不是 0\"：0 是 false，非 0 都是 true。",
        "写 <code>if (ok)</code> 就够了；<code>if (ok == true)</code> 是废话，还容易手滑写成赋值。"
      ],
      "concl": "bool 是\"是/否\"两个格子，true 当数字用等于 1，false 等于 0。",
      "terms": "正式叫「布尔类型（bool）」，<code>true</code>/<code>false</code> 叫「布尔字面量」，bool 变 int 这一步叫「整型提升」。",
      "tags": [],
      "board": "",
      "quizIds": []
    },
    {
      "id": "d2c11",
      "num": 11,
      "title": "const：贴了封条就不许改",
      "pain": "<b>没有它会怎样</b>：100 这种\"魔法数字\"散落在十个文件里，改需求时漏一处就是一个 bug。<code>const</code> 给数字起名、加类型、上封条，改错地方编译器当场拦。",
      "analogy": "",
      "only": "",
      "guess": "",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nconst int MAX = 100;\nconst int table[] = {1, 2, 3};\n\nint main() {\n    cout << MAX << \"\\n\";        // 100\n    cout << table[2] << \"\\n\";   // 3\n    // MAX = 200;               // 编译报错：assignment of read-only variable 'MAX'\n}",
      "output": "",
      "errors": [],
      "pitfalls": [
        "const 变量必须当场给值：<code>const int a;</code> 单独一句编译不过。",
        "编译器通常把全局 const 放进只读数据段，程序运行时改不了它。<b>以后有板子再看</b>：在单片机上这块数据一般放在 flash 里，不占 RAM；把 const 去掉，它才会被搬进 RAM。",
        "<code>#define</code> 出错时报错会指向替换后的怪代码；const 是真变量，报错直接指到名字。"
      ],
      "concl": "不想被改就贴封条；只读的大参数写 const T&；配置表加 const，既防误改也方便编译器优化。",
      "terms": "const 修饰的变量叫「常量」，<code>const T&amp;</code> 形参叫「常量引用」；只读数据段在板子上通常对应放在 flash（以后再看）。",
      "tags": [],
      "board": "",
      "quizIds": []
    },
    {
      "id": "d2c12",
      "num": 12,
      "title": "默认参数：只能从右往左连续给",
      "pain": "<b>没有它会怎样</b>：按固定宽度打印数字时，绝大多数调用都是\"宽度 8、左边补 0\"，每次把这些参数全写一遍又长又容易写错。默认参数让常用配置直接省略，只写和默认不一样的那几个。像<b>点外卖默认不加香菜</b>：没特别交代就按默认来，想换才开口。",
      "analogy": "点外卖默认不加香菜",
      "only": "",
      "guess": "",
      "codeMin": "",
      "codeFull": "#include <iostream>\n#include <iomanip>\nusing namespace std;\n\nvoid printNum(int value, int width = 8, char fill = '0') {\n    cout << setw(width) << setfill(fill) << value << \"\\n\";\n}\n\nint main() {\n    printNum(42);          // 00000042\n    printNum(42, 4);       // 0042\n    printNum(7, 3, '.');   // ..7\n\n    // printNum(42, , 2);  // 错：中间不能空着跳过去\n    // 默认值写两处会报：default argument given for parameter ...\n}",
      "output": "",
      "errors": [],
      "pitfalls": [
        "<b>为什么必须从右往左</b>：实参按位置填，中间空着编译器不知道给谁。",
        "<b>只写一处</b>：声明和定义都写会报\"重定义默认参数\"，习惯写在声明（头文件）里。",
        "和重载混着用最容易撞车，见下一张卡片。"
      ],
      "concl": "默认值从右边开始连着给，只写一处，中间不许跳。",
      "terms": "正式叫「默认参数（default argument）」，两个候选都能匹配的情况叫「二义性（ambiguous）」。",
      "tags": [],
      "board": "",
      "quizIds": []
    },
    {
      "id": "d2c13",
      "num": 13,
      "title": "函数重载：同名不同参数，别看返回值",
      "pain": "<b>没有它会怎样</b>：C 里同一件事、不同类型得起 <code>abs_i</code>、<code>abs_f</code> 一堆名字，调用时还得记住用哪套。重载让同名函数按<b>参数</b>自动挑，返回值不参与挑。像<b>同一个窗口办不同业务</b>：递身份证办身份证、递驾照办驾照，窗口名字一样，看你递什么。",
      "analogy": "同一个窗口办不同业务",
      "only": "",
      "guess": "",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nvoid f(int x)    { cout << \"int\\n\"; }\nvoid f(double x) { cout << \"double\\n\"; }\n\nvoid g(int x) {}\nvoid g(int x, int y = 0) {}\n\nint main() {\n    f(1);      // int\n    f(1.0);    // double\n    // g(1);   // 二义性：两个版本都能匹配\n\n    // int f(int x);   // 编译报错：只改返回值不算重载\n}",
      "output": "",
      "errors": [],
      "pitfalls": [
        "参数个数、类型、顺序，只要有一处不同就算重载；返回值不参与挑选，因为调用处看不见返回值。",
        "<code>f(1.0f)</code> 会让编译器在 <code>f(int)</code> 和 <code>f(double)</code> 之间替你挑（float→double 是提升，转 int 是截断），不报错但你要知道它在挑。",
        "真撞上二义性，最省事的办法是改名字，别跟编译器较劲。"
      ],
      "concl": "重载看参数不看返回值；两个都能匹配就报二义性，改名字最省事。",
      "terms": "正式叫「函数重载（overload）」，两个候选都匹配叫「二义性调用（ambiguous call）」。",
      "tags": [],
      "board": "",
      "quizIds": []
    },
    {
      "id": "d2c14",
      "num": 14,
      "title": "volatile：告诉编译器\"这个值会自己变\"（电脑版）",
      "pain": "<b>没有它会怎样</b>：另一个线程把 flag 改成 1，编译器却不知道有人在外面改，把 <code>while (!flag)</code> 优化成死循环——程序\"卡死\"，而且<b>一个错都不报</b>。volatile 就是在说：这个值会自己变，每次都必须真去内存读。像<b>有人在你背后偷偷改白板上的数字</b>，你不每眼都去看，就永远读到旧的。",
      "analogy": "有人在你背后偷偷改白板上的数字",
      "only": "这不是硬件代码，只是同一个原理的电脑版：用另一个线程代替\"中断里改标志\"。",
      "guess": "",
      "codeMin": "",
      "codeFull": "#include <iostream>\n#include <thread>\n#include <chrono>\nusing namespace std;\n\nvolatile int flag = 0;   // 另一个线程会改它\n\nint main() {\n    thread t([] {\n        this_thread::sleep_for(chrono::milliseconds(100));\n        flag = 1;        // 相当于\"中断来了\"\n    });\n\n    cout << \"等信号...\\n\";\n    while (!flag) { }    // 加了 volatile：每次都真去内存读，能退出\n    cout << \"收到 \" << flag << \"，退出\\n\";\n    t.join();\n}\n// 本机 g++ -O2 实测输出：\n// 等信号...\n// 收到 1，退出\n// 把 volatile 删掉再 -O2：循环被优化，读到旧值 0，打印\"收到 0，退出\"",
      "output": "",
      "errors": [],
      "pitfalls": [
        "<b>先跑这个电脑版</b>：加 volatile 时本机实测输出 <code>等信号... / 收到 1，退出</code>；删掉 volatile 再用 <code>-O2</code> 编译，本机实测输出 <code>收到 0，退出</code>（有的编译器会直接卡死）。",
        "<b>以后有板子再看</b>：外设寄存器指针、中断与主循环共享的变量、DMA 收发的缓冲区，这三种场景必须加 volatile——差别只是\"改它的人\"从中断换成了线程。",
        "<b>它只管\"别优化\"</b>，不管\"安不安全\"。<code>volatile int n; n++;</code> 仍不是原子操作，两个线程同时改会丢数据；真并发要用 <code>std::atomic</code> 或加锁。",
        "<b>可以跟 const 一起用</b>：只读的状态寄存器就是 <code>volatile const</code>（以后有板子再看）；普通局部变量别乱加，只会变慢。"
      ],
      "concl": "会被\"别人\"改的变量必须加 volatile；它挡的是编译器优化，不是并发。",
      "terms": "正式叫「volatile 限定符」，读作\"易变的\"；中断和主循环共用的变量叫「共享变量」，电脑上对应「多线程共享变量」。",
      "tags": [],
      "board": "",
      "quizIds": []
    },
    {
      "id": "d2c15",
      "num": 15,
      "title": "static：函数里的\"记忆\"，文件里的\"私事\"",
      "pain": "<b>没有它会怎样</b>：想让函数记住\"上次调到哪一步\"，C 里只能用全局变量，结果全工程都能改它。函数里的 <code>static</code> 是<b>只有这个函数能碰的\"记忆\"</b>：只初始化一次，函数退出也不销毁。",
      "analogy": "只有这个函数能碰的\"记忆\"",
      "only": "",
      "guess": "",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nstatic void helper() { cout << \"helper\\n\"; }   // 只在本文件可见\n\nvoid tick() {\n    static int count = 0;   // 只初始化一次\n    count++;\n    cout << count << \"\\n\";\n}\n\nint main() {\n    tick(); tick(); tick();   // 1 2 3\n    helper();                 // helper\n}",
      "output": "",
      "errors": [],
      "pitfalls": [
        "<b>函数内 static</b>：适合计数器、状态机的上一步状态，不用把变量暴露成全局。",
        "<b>文件作用域 static</b>：嵌入式里常用来做\"模块私有函数\"，多个 .c 里同名也不冲突。",
        "<b>初始化时机</b>：比 main 还早；程序运行期间一直占着这块内存，不随函数退出释放。",
        "<b>别写进头文件</b>：每个包含它的 .c 都会各自复制一份，看着像同一个其实不是——这种错不报，最难查。"
      ],
      "concl": "static 在函数里是\"记性\"，在文件里是\"私事\"。",
      "terms": "这种\"程序一直活着\"的存储叫「静态存储期」；只在本文件可见叫「内部链接」，模块自己用的函数叫「模块私有函数」。",
      "tags": [],
      "board": "",
      "quizIds": []
    },
    {
      "id": "d2c16",
      "num": 16,
      "title": "位操作：只动那一位，别把别的位冲掉",
      "pain": "<b>没有它会怎样</b>：直接写 <code>leds = 8</code> 会把其他灯的状态一起覆盖掉。改一位只动目标位：<b>置位 <code>|=</code>、清零 <code>&amp;= ~</code>、翻转 <code>^=</code></b>，判断用 <code>&amp;</code>。<b>一个整数就像一排并排的开关</b>，只能拨你要的那一个，别把总闸拉下来。",
      "analogy": "一个整数就像一排并排的开关",
      "only": "",
      "guess": "",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;\n\n#define BIT(n) (1u << (n))\n\nint main() {\n    unsigned int leds = 0;    // 用低 8 位模拟 8 个灯的状态\n    leds |=  BIT(3);          // 点亮 3 号灯\n    cout << leds << \"\\n\";     // 8\n    leds &= ~BIT(3);          // 熄灭 3 号灯\n    cout << leds << \"\\n\";     // 0\n    leds ^=  BIT(3);          // 翻转 3 号灯\n    cout << leds << \"\\n\";     // 8\n\n    cout << ((leds & BIT(3)) ? \"亮\" : \"灭\") << \"\\n\";   // 亮\n}",
      "output": "",
      "errors": [],
      "pitfalls": [
        "<b><code>1 &lt;&lt; 31</code> 的坑</b>：有符号 int 左移到最高位是未定义行为，写 <code>1u &lt;&lt; 31</code> 才稳。",
        "<b>读-改-写不是原子的</b>：两个线程同时改同一个变量，可能互相覆盖；需要时用 <code>std::atomic</code> 或加锁。<b>以后有板子再看</b>：主循环和中断同时改同一个寄存器，要么关中断，要么用硬件的置位/清除寄存器。",
        "<b>别用魔法数字</b>：位号用宏或常量定义，换芯片只改一处。",
        "<b>位域（bit-field）</b> 每个编译器排布可能不同，通信协议里别用，改位优先用宏。"
      ],
      "concl": "改一位用 |= 和 &= ~，别直接赋值，否则会把旁边的位一起冲掉。",
      "terms": "那串用来挑位的 0/1 叫「位掩码（mask）」，<code>|=</code> 叫「置位」，<code>&amp;= ~</code> 叫「清零」，读一遍再写回去叫「读-改-写」。",
      "tags": [],
      "board": "",
      "quizIds": []
    }
  ],
  "taskTitle": "Day 2 · 今天动手",
  "taskDesc": "两个小任务，全部在本机跑。任务 2 是很多人栽过的坑：在函数里改指针，外面为什么没反应。",
  "tasks": [
    {
      "id": "d2t1",
      "title": "任务 1 · 按运行时数量租一排房",
      "goal": "<b>目标</b>：用 <code>new[]</code> 申请 8 个 <code>int</code>，填平方数、求和，最后用 <code>delete[]</code> 归还。",
      "code": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int n = 8;\n    int* a = new int[n];              // 运行时才决定租几间\n    for (int i = 0; i < n; i++) a[i] = i * i;\n    int sum = 0;\n    for (int i = 0; i < n; i++) sum += a[i];\n    cout << \"和 = \" << sum << \"\\n\";   // 140\n    delete[] a;                       // 一排房必须用 delete[]\n    a = nullptr;\n}",
      "output": "和 = 140",
      "tip": ""
    },
    {
      "id": "d2t2",
      "title": "任务 2 · 在函数里换指针，外面为什么没变",
      "goal": "<b>目标</b>：先看 <code>wrong</code> 改不到外面的指针，再用 <code>int*&amp;</code> 把指针本人递进去，看第二次为什么成功。",
      "code": "#include <iostream>\nusing namespace std;\n\nvoid wrong(int* p) { p = new int(99); }   // 只改了复印件，外面没动\nvoid right(int*& p) { p = new int(99); }  // 递的是指针本人的引用\n\nint main() {\n    int x = 1;\n    int* p = &x;\n    wrong(p);\n    cout << *p << \"\\n\";    // 1：外面还是指着 x\n    right(p);\n    cout << *p << \"\\n\";    // 99：这次真的换了指向\n    delete p;              // right 里 new 的那间房\n}",
      "output": "1\n99",
      "tip": ""
    }
  ],
  "gloss": {
    "title": "今天这 5 个面试题，先用人话过一遍",
    "html": "<h4>今天这 5 个面试题，先用人话过一遍</h4>\n    <p><b>① 面向过程和面向对象有什么区别？</b>过程式按步骤拆，性能高、开发慢；OOP 按对象和责任拆，开发快、好扩展，代价是一点间接开销。</p>\n    <p><b>② 三大特征是什么？</b>封装（数据和操作捆一起、上权限）、继承（复用父类）、多态（同一个接口，不同对象有不同实现）。今天只要求把封装讲清楚。</p>\n    <p><b>③ 构造函数和析构函数干什么？</b>构造：对象出生时自动初始化成员；析构：对象退房前自动清理，尤其是把 new 出来的内存还掉。</p>\n    <p><b>④ public / protected / private 区别？</b>public 外面能用；private 只有类自己能用；protected 类和子类能用，没继承时等同 private。</p>\n    <p><b>⑤ 浅拷贝和深拷贝？</b>浅拷贝只抄指针地址，两个对象共用一块堆，容易双重释放；深拷贝重新申请一块，各管各的。</p>\n    <p class=\"say\">今天先把「封装 + 构造 + 析构 + 深拷贝」这四件事写熟，继承和多态等下一课再展开，现在碰只会混。</p>"
  }
};
