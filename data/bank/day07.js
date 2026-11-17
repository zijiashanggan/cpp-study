window.BANKS = window.BANKS || {};
window.BANKS.day7 = {
  "single": [
    {
      "id": "d7s01",
      "day": "day7",
      "q": "模板真正解决的问题是什么？",
      "options": [
        "让程序运行得更快",
        "把类型参数化，让逻辑相同、类型不同的代码只写一份",
        "让一个函数在运行时处理所有类型",
        "自动帮程序员修复类型错误",
      ],
      "ans": 1,
      "why": "模板是编译期的类型参数化：逻辑写一次，编译器按你实际用到的类型各生成一份代码。它不是运行时万能函数。"
    },
    {
      "id": "d7s02",
      "day": "day7",
      "q": "<code>template &lt;typename T&gt;</code> 里的 <code>T</code> 是什么？",
      "options": [
        "一个全局变量",
        "一个类型参数，调用时被具体类型替换",
        "一个函数指针",
        "一个宏",
      ],
      "ans": 1,
      "why": "T 是类型占位符，调用 <code>add(1, 2)</code> 时被推成 int，调用 <code>add(1.1f, 2.1f)</code> 时被推成 float。"
    },
    {
      "id": "d7s03",
      "day": "day7",
      "q": "函数模板调用时，模板参数怎么确定？",
      "options": [
        "只能靠实参自动推导",
        "只能显式写 <code>&lt;int&gt;</code>",
        "可以由实参自动推导，也可以显式指定",
        "由返回值类型决定",
      ],
      "ans": 2,
      "why": "<code>add(10, 20)</code> 自动推导 T = int；<code>add&lt;double&gt;(2.5, 3.5)</code> 显式指定 T = double。两种都行。"
    },
    {
      "id": "d7s04",
      "day": "day7",
      "code": "template <typename T>\nvoid printer(T a, T b) { }\nint main() {\n    int a = 10;\n    char b = 'A';\n    printer(a, b);\n}",
      "q": "这段代码能编译过吗？",
      "options": [
        "能，char 自动转 int",
        "不能，T 同时被推成 int 和 char，推导冲突",
        "能，但运行时崩溃",
        "能，只会打印警告",
      ],
      "ans": 1,
      "why": "模板不做隐式类型转换，两个实参类型不一致就推不出唯一的 T；写 <code>printer&lt;int&gt;(a, b)</code> 才能过。"
    },
    {
      "id": "d7s05",
      "day": "day7",
      "q": "普通函数和函数模板同名、且都能匹配时，编译器优先选谁？",
      "options": [
        "普通函数",
        "函数模板",
        "随机选一个",
        "直接报二义性错误",
      ],
      "ans": 0,
      "why": "普通函数优先，因为它只编译一次、不需要实例化；要强制走模板可以写 <code>printer&lt;&gt;(a, b)</code>。"
    },
    {
      "id": "d7s06",
      "day": "day7",
      "q": "一条 <code>template &lt;typename T&gt;</code> 声明的作用范围是？",
      "options": [
        "从它开始到文件结束",
        "只对它紧邻的下一个函数或类生效",
        "对整个命名空间生效",
        "对它后面的所有函数都生效",
      ],
      "ans": 1,
      "why": "模板声明只作用于紧邻的那一个函数/类；第二个模板函数要在前面再写一遍 <code>template &lt;typename T&gt;</code>。"
    },
    {
      "id": "d7s07",
      "day": "day7",
      "q": "模板函数里 <code>cout &lt;&lt; t</code> 遇到自定义类 Emp 编译失败，最直接的两种解决办法是？",
      "options": [
        "把 T 改成 int",
        "给 Emp 重载 <code>operator&lt;&lt;</code>，或为 Emp 提供模板具体化",
        "把模板改成普通函数",
        "加 <code>#include &lt;string&gt;</code>",
      ],
      "ans": 1,
      "why": "模板本身没错，是 Emp 不支持输出。重载 <code>&lt;&lt;</code> 或写 <code>template&lt;&gt; void test01&lt;Emp&gt;(...)</code> 都能解决。"
    },
    {
      "id": "d7s08",
      "day": "day7",
      "q": "有两个类型参数的类模板 <code>Demo</code>，正确创建对象的方式是？",
      "options": [
        "Demo ob(10, 20);",
        "Demo&lt;int, int&gt; ob(10, 20);",
        "Demo(int, int) ob;",
        "Demo ob&lt;int, int&gt;(10, 20);",
      ],
      "ans": 1,
      "why": "<code>Demo&lt;int, int&gt;</code> 才是完整的类名；C++17 起 CTAD 可以省，但教材和面试默认要求写全。"
    },
    {
      "id": "d7s09",
      "day": "day7",
      "q": "关于 C++17 的 CTAD（类模板实参推导），哪句是对的？",
      "options": [
        "C++17 之前也能用",
        "构造函数实参可以推导类模板参数，但不是所有项目都允许省",
        "CTAD 会改变模板的两次编译规则",
        "CTAD 只能用于函数模板",
      ],
      "ans": 1,
      "why": "C++17 起 <code>Demo ob(10, 20)</code> 能推出 <code>Demo&lt;int,int&gt;</code>，但团队规范通常仍要求写全，面试也按「必须指明」答。"
    },
    {
      "id": "d7s10",
      "day": "day7",
      "q": "类模板的成员函数在类外定义，每个函数前必须补什么？",
      "options": [
        "什么都不用补",
        "只补 <code>&lt;T1, T2&gt;</code>",
        "补 <code>template &lt;class T1, class T2&gt;</code>，函数名再写 <code>Demo&lt;T1,T2&gt;::</code>",
        "补 <code>inline</code> 就够了",
      ],
      "ans": 2,
      "why": "两个都要：模板声明让 T1/T2 有定义，<code>Demo&lt;T1,T2&gt;::</code> 指明属于哪个实例化类。"
    },
    {
      "id": "d7s11",
      "day": "day7",
      "q": "类外实现时漏写 <code>template &lt;class T1, class T2&gt;</code>，通常会报什么？",
      "options": [
        "<code>'T1' does not name a type</code>",
        "<code>undefined reference</code>",
        "什么错都不报",
        "<code>segmentation fault</code>",
      ],
      "ans": 0,
      "why": "T1/T2 只在模板声明的作用域里有效，漏了声明编译器就不认识它们。"
    },
    {
      "id": "d7s12",
      "day": "day7",
      "q": "把类模板对象当函数参数，下面哪种写法成立？",
      "options": [
        "void f(Demo d)",
        "void f(Demo&lt;string, int&gt;&amp; d) 或模板泛型 <code>Demo&lt;T1,T2&gt;</code>",
        "void f(class Demo d)",
        "void f(template Demo d)",
      ],
      "ans": 1,
      "why": "要么写死具体实例类型，要么继续用模板参数；只写 <code>Demo</code> 会报 requires template arguments。"
    },
    {
      "id": "d7s13",
      "day": "day7",
      "q": "类模板 <code>Parent&lt;T1,T2&gt;</code> 派生出一个普通类，继承列表应该怎么写？",
      "options": [
        "class Son : public Parent",
        "class Son : public Parent&lt;int, char&gt;",
        "class Son : public Parent&lt;&gt;",
        "class Son : template Parent",
      ],
      "ans": 1,
      "why": "普通子类必须先确定父类的具体类型，编译器才知道给子类对象分配多大空间。"
    },
    {
      "id": "d7s14",
      "day": "day7",
      "q": "类模板派生出类模板时，父类的类型参数一般从哪来？",
      "options": [
        "固定写死",
        "从子类自己的模板参数继续传下去",
        "由编译器随机选",
        "不能继承类模板",
      ],
      "ans": 1,
      "why": "例如 <code>template&lt;class T1,class T2,class T3&gt; class Son : public Parent&lt;T1,T2&gt;</code>，父类类型由子类参数提供。"
    },
    {
      "id": "d7s15",
      "day": "day7",
      "q": "类模板的成员函数定义为什么必须让使用方看得见？",
      "options": [
        "因为模板是宏",
        "因为模板要到调用处才实例化，编译器需要完整定义才能生成代码",
        "因为 .h 文件不能放函数",
        "因为链接器不支持模板",
      ],
      "ans": 1,
      "why": "模板不是预先编译好的函数，而是在每个使用它的翻译单元里按类型现场实例化，所以定义要跟声明放在一起。"
    },
    {
      "id": "d7s16",
      "day": "day7",
      "q": "类模板声明放 .h、成员函数定义放 .cpp，main 里实例化，通常会在哪一步出错？",
      "options": [
        "预处理",
        "编译 main.cpp 时",
        "链接时，报 undefined reference",
        "运行时崩溃",
      ],
      "ans": 2,
      "why": "main.cpp 只看得到声明，编译器不会为它生成实例代码；链接器找不到定义就报 <code>undefined reference to 'Demo&lt;int, int&gt;::print()'</code>。"
    },
    {
      "id": "d7s17",
      "day": "day7",
      "q": "用普通全局函数做类模板的友元，friend 声明应该怎么写？",
      "options": [
        "friend void show();",
        "friend void show(Demo&lt;int, int&gt; d);",
        "friend template void show();",
        "friend auto show;",
      ],
      "ans": 1,
      "why": "普通函数只能对某一组具体实例开权限，所以要写死 <code>Demo&lt;int,int&gt;</code>；想对所有实例生效就写模板友元。"
    },
    {
      "id": "d7s18",
      "day": "day7",
      "q": "动态数组模板扩容时，把元素搬到更大的新数组后，还必须做什么？",
      "options": [
        "把旧数组置空就行",
        "delete[] 旧数组，否则每次扩容都泄漏一块内存",
        "把新数组也 delete 掉",
        "不用管，程序结束会回收",
      ],
      "ans": 1,
      "why": "<code>new[]</code> 出来的旧数组必须 <code>delete[]</code>；只把指针指向新数组，旧内存就再也找不回来了。"
    },
    {
      "id": "d7s19",
      "day": "day7",
      "q": "C++ 为什么还要提供四种命名转换，而不继续用 C 风格 <code>(int)a</code>？",
      "options": [
        "因为 C 风格写法运行更慢",
        "因为命名转换能表明意图、限制转换范围，也方便搜索和审查",
        "因为 C 风格转换在 C++ 里被删除了",
        "因为命名转换不需要类型",
      ],
      "ans": 1,
      "why": "四种转换各管一类事，看到名字就知道在干什么；C 风格一个括号什么都能转，连 const 都悄悄转掉。"
    },
    {
      "id": "d7s20",
      "day": "day7",
      "q": "<code>static_cast</code> 做父类指针到子类指针的下行转换，安全性如何？",
      "options": [
        "有运行时检查，失败返回空",
        "不做运行时检查，对象真实类型不对就是未定义行为",
        "编译一定报错",
        "会自动调用子类构造函数",
      ],
      "ans": 1,
      "why": "static_cast 只在编译期按继承关系放行，不查对象真实类型；要检查就用 <code>dynamic_cast</code>。"
    },
    {
      "id": "d7s21",
      "day": "day7",
      "q": "下面哪件事 <code>static_cast</code> 做不了？",
      "options": [
        "float 转 int",
        "子类指针转父类指针",
        "去掉指针的 const",
        "父类指针转子类指针",
      ],
      "ans": 2,
      "why": "去 const 是 <code>const_cast</code> 的职责；static_cast 不能改变 const/volatile 属性。"
    },
    {
      "id": "d7s22",
      "day": "day7",
      "q": "<code>dynamic_cast</code> 做指针转换失败时返回什么？",
      "options": [
        "nullptr",
        "原指针",
        "抛出 bad_cast",
        "随机地址",
      ],
      "ans": 0,
      "why": "指针失败返回 <code>nullptr</code>；引用失败才抛 <code>std::bad_cast</code>。"
    },
    {
      "id": "d7s23",
      "day": "day7",
      "q": "<code>dynamic_cast</code> 对基类有什么硬性要求？",
      "options": [
        "基类必须是 abstract",
        "基类至少有一个虚函数（是多态类型）",
        "基类不能有数据成员",
        "基类必须是 struct",
      ],
      "ans": 1,
      "why": "dynamic_cast 靠运行时类型信息查真实类型，而 RTTI 挂在虚函数表上，所以基类必须有虚函数。"
    },
    {
      "id": "d7s24",
      "day": "day7",
      "q": "<code>const_cast</code> 能作用于下面哪一项？",
      "options": [
        "const int 变量本身",
        "const 指针或 const 引用",
        "任意类对象",
        "只能作用于数组",
      ],
      "ans": 1,
      "why": "const_cast 只调整指针/引用的 const 属性；直接对 <code>const int</code> 用会报 not a pointer, reference。"
    },
    {
      "id": "d7s25",
      "day": "day7",
      "q": "<code>reinterpret_cast</code> 最典型的用途是？",
      "options": [
        "数值精度转换",
        "指针与整数、或无关指针类型之间重解释位模式",
        "去掉 const",
        "父子类安全下行",
      ],
      "ans": 1,
      "why": "它只按位重新解释，不做任何检查；嵌入式里把寄存器地址当地址用是常见场景，平时应尽量避开。"
    },
    {
      "id": "d7s26",
      "day": "day7",
      "q": "多态类型的安全下行转换，应该选哪个？",
      "options": [
        "static_cast",
        "dynamic_cast",
        "const_cast",
        "reinterpret_cast",
      ],
      "ans": 1,
      "why": "dynamic_cast 会在运行时检查对象真实类型，失败返回 nullptr；其余三个都不做这种检查。"
    },
    {
      "id": "d7s27",
      "day": "day7",
      "q": "把 <code>double</code> 转成 <code>int</code>（截断小数），应该用哪个？",
      "options": [
        "static_cast",
        "dynamic_cast",
        "const_cast",
        "reinterpret_cast",
      ],
      "ans": 0,
      "why": "基本数据类型之间的转换归 static_cast 管，它会把 3.9 截成 3。"
    }
  ],
  "fill": [
    {
      "id": "d7f01",
      "day": "day7",
      "code": "Demo<____> ob(10, 20);   // 两个成员都是 int",
      "q": "横线上填完整的模板参数列表。",
      "answers": ["int, int", "int,int"],
      "display": "int, int",
      "why": "<code>Demo&lt;int, int&gt;</code> 才是完整类名，两个类型参数都要给。"
    },
    {
      "id": "d7f02",
      "day": "day7",
      "code": "____\nvoid Demo<T1, T2>::print() { cout << a << \" \" << b << endl; }",
      "q": "横线上填类外实现成员函数前必须写的模板声明。",
      "answers": ["template<class T1, class T2>", "template <class T1, class T2>", "template<typename T1, typename T2>", "template <typename T1, typename T2>"],
      "display": "template <class T1, class T2>",
      "why": "每个类外定义的成员函数都要重新声明模板参数，否则 T1/T2 不在作用域里。"
    },
    {
      "id": "d7f03",
      "day": "day7",
      "code": "// Demo.hpp\n#pragma once\ntemplate<class T1, class T2>\nclass Demo { ... };   // 声明和定义都放这里",
      "q": "类模板的声明和定义应放在同一个以 ____ 结尾的文件里（填扩展名）。",
      "answers": [".hpp", "hpp"],
      "display": ".hpp",
      "why": "模板要在使用处实例化，定义必须可见；工程上把声明和定义合在一个 .hpp 里，避免链接时报 undefined reference。"
    },
    {
      "id": "d7f04",
      "day": "day7",
      "code": "template <____ T>\nT add(T a, T b) { return a + b; }",
      "q": "横线上填声明类型参数的关键字（写一个即可）。",
      "answers": ["typename", "class"],
      "display": "typename（或 class）",
      "why": "<code>typename</code> 和 <code>class</code> 在模板类型参数这里完全等价，项目里统一一种写法即可。"
    },
    {
      "id": "d7f05",
      "day": "day7",
      "code": "float f = 3.14f;\nint a = ____<int>(f);",
      "q": "横线上填用于基本数据类型转换的 C++ 转换名。",
      "answers": ["static_cast"],
      "display": "static_cast",
      "why": "数值类型之间的显式转换归 <code>static_cast</code> 管，结果是 3（截断小数）。"
    },
    {
      "id": "d7f06",
      "day": "day7",
      "code": "Person* p = new Person;\nSon* s = ____<Son*>(p);   // 失败时 s 为 nullptr",
      "q": "横线上填带运行时检查的下行转换。",
      "answers": ["dynamic_cast"],
      "display": "dynamic_cast",
      "why": "基类必须是多态类型（有虚函数）；转换失败指针返回 <code>nullptr</code>。"
    },
    {
      "id": "d7f07",
      "day": "day7",
      "code": "const int* p = new int(3);\nint* q = ____<int*>(p);",
      "q": "横线上填只修改 const 属性的转换。",
      "answers": ["const_cast"],
      "display": "const_cast",
      "why": "<code>const_cast</code> 只能作用于指针或引用，用来加/去 const。"
    },
    {
      "id": "d7f08",
      "day": "day7",
      "code": "long addr = ____<long>(p);   // 指针 → 整数",
      "q": "横线上填重解释位模式的转换。",
      "answers": ["reinterpret_cast"],
      "display": "reinterpret_cast",
      "why": "指针和整数互转只有 <code>reinterpret_cast</code> 能做，结果依赖平台位宽，属于最后手段。"
    }
  ],
  "judge": [
    {
      "id": "d7j01",
      "day": "day7",
      "q": "函数模板和普通函数一样，会对实参做隐式类型转换。",
      "ans": 1,
      "why": "错。模板先按实参推导 T，不做隐式转换；int 和 char 一起传会推导冲突。显式写 <code>printer&lt;int&gt;</code> 后才按普通规则转换。"
    },
    {
      "id": "d7j02",
      "day": "day7",
      "q": "同名模板和普通函数都能匹配时，编译器优先选模板。",
      "ans": 1,
      "why": "错。两者都能匹配时普通函数优先；要强制模板得写 <code>printer&lt;&gt;</code> 或 <code>printer&lt;int&gt;</code>。"
    },
    {
      "id": "d7j03",
      "day": "day7",
      "q": "一条 <code>template &lt;typename T&gt;</code> 声明会对它后面的所有函数都生效。",
      "ans": 1,
      "why": "错。只对紧邻的下一个函数/类生效，第二个函数必须重新写模板声明。"
    },
    {
      "id": "d7j04",
      "day": "day7",
      "q": "C++17 起，类模板可以用构造函数实参自动推导类型（CTAD），<code>Demo ob(10,20)</code> 能编译。",
      "ans": 0,
      "why": "对。C++17 支持 CTAD；但教材和多数项目仍要求显式写 <code>Demo&lt;int,int&gt;</code>。"
    },
    {
      "id": "d7j05",
      "day": "day7",
      "q": "类模板成员函数的定义放在 .cpp、只在 .h 留声明，使用处实例化时会报 undefined reference。",
      "ans": 0,
      "why": "对。模板在调用处才实例化，编译器看不到定义就生成不了代码，链接阶段报未定义引用。"
    },
    {
      "id": "d7j06",
      "day": "day7",
      "q": "<code>dynamic_cast</code> 要求基类至少有一个虚函数。",
      "ans": 0,
      "why": "对。只有多态类型才有运行时类型信息；基类没虚函数会报 source type is not polymorphic。"
    },
    {
      "id": "d7j07",
      "day": "day7",
      "q": "<code>const_cast</code> 可以直接把 <code>const int</code> 变量转成 <code>int</code>。",
      "ans": 1,
      "why": "错。它只能作用于指针或引用；直接转变量会报 not a pointer, reference, nor a pointer-to-data-member type。"
    }
  ],
  "code": [
    {
      "id": "d7c01",
      "day": "day7",
      "q": "读代码，按顺序写出打印的两行。",
      "code": "#include <iostream>\nusing namespace std;\n\ntemplate <typename T>\nclass MyArray {\n    T* arr; int cap; int len;\npublic:\n    MyArray(int c = 2) : cap(c), len(0) { arr = new T[cap]; }\n    ~MyArray() { delete[] arr; }\n    void add(const T& v) {\n        if (len == cap) grow();\n        arr[len++] = v;\n    }\n    T& at(int i) { return arr[i]; }\n    int size() const { return len; }\nprivate:\n    void grow() {\n        cap *= 2;\n        T* tmp = new T[cap];\n        for (int i = 0; i < len; i++) tmp[i] = arr[i];\n        delete[] arr;\n        arr = tmp;\n    }\n};\n\nint main() {\n    MyArray<int> a;\n    for (int i = 1; i <= 5; i++) a.add(i * 10);\n    cout << a.size() << endl;\n    for (int i = 0; i < a.size(); i++) cout << (i ? \" \" : \"\") << a.at(i);\n    cout << endl;\n}",
      "answers": ["5\n10 20 30 40 50", "5 10 20 30 40 50"],
      "display": "5 / 10 20 30 40 50",
      "why": "容量 2 装 5 个元素会扩容两次（2→4→8）；<code>grow</code> 里先搬元素再 <code>delete[]</code> 旧数组。"
    },
    {
      "id": "d7c02",
      "day": "day7",
      "q": "读代码，按顺序写出打印的四行。",
      "code": "#include <iostream>\nusing namespace std;\n\nclass Base { public: virtual ~Base() {} };\nclass Der : public Base { public: void hi() { cout << \"hi\" << endl; } };\n\nint main() {\n    double d = 3.9;\n    cout << static_cast<int>(d) << endl;\n    Base* b = new Der;\n    if (Der* p = dynamic_cast<Der*>(b)) p->hi();\n    int x = 7;\n    const int* cp = &x;\n    *const_cast<int*>(cp) = 8;\n    cout << x << endl;\n    cout << (reinterpret_cast<long long>(b) != 0) << endl;\n    delete b;\n}",
      "answers": ["3\nhi\n8\n1", "3 hi 8 1"],
      "display": "3 / hi / 8 / 1",
      "why": "static_cast 截断成 3；dynamic_cast 检查通过调用 hi；const_cast 改的是非 const 的 x；reinterpret_cast 只取位模式，非 0。"
    },
    {
      "id": "d7c03",
      "day": "day7",
      "q": "读代码，按顺序写出打印的四行。",
      "code": "#include <iostream>\nusing namespace std;\n\ntemplate <typename T>\nT add(T a, T b) { return a + b; }\n\nint main() {\n    cout << add(10, 20) << endl;\n    cout << add(1.1f, 2.1f) << endl;\n    cout << add<int>(10, 20) << endl;\n    cout << add<double>(2.5, 3.5) << endl;\n}",
      "answers": ["30\n3.2\n30\n6", "30 3.2 30 6"],
      "display": "30 / 3.2 / 30 / 6",
      "why": "前两次自动推导 T，后两次显式指定；float 相加得 3.2，double 相加得 6。"
    },
    {
      "id": "d7c04",
      "day": "day7",
      "q": "读代码，按顺序写出打印的两行。",
      "code": "#include <iostream>\nusing namespace std;\n\ntemplate <class T1, class T2>\nclass Demo {\npublic:\n    T1 a; T2 b;\n    Demo(T1 a, T2 b) : a(a), b(b) {}\n    void print() { cout << a << \" \" << b << endl; }\n};\n\nint main() {\n    Demo<int, int> ob(10, 20);\n    ob.print();\n    Demo ob2(1.5, 'A');\n    ob2.print();\n}",
      "answers": ["10 20\n1.5 A", "10 20 1.5 A"],
      "display": "10 20 / 1.5 A",
      "why": "第一个显式写 <code>Demo&lt;int,int&gt;</code>；第二个用 C++17 的 CTAD 推导成 <code>Demo&lt;double,char&gt;</code>。"
    },
    {
      "id": "d7c05",
      "day": "day7",
      "q": "读代码，按顺序写出打印的两行。",
      "code": "#include <iostream>\nusing namespace std;\n\ntemplate <class T1, class T2>\nclass Demo {\npublic:\n    T1 a; T2 b;\n    Demo(T1 a, T2 b);\n    void print();\n};\n\ntemplate <class T1, class T2>\nDemo<T1, T2>::Demo(T1 a, T2 b) : a(a), b(b) { cout << \"构造函数\" << endl; }\n\ntemplate <class T1, class T2>\nvoid Demo<T1, T2>::print() { cout << \"a=\" << a << \"  b=\" << b << endl; }\n\nint main() {\n    Demo<int, char> d(10, 'B');\n    d.print();\n}",
      "answers": ["构造函数\na=10  b=B", "构造函数 a=10 b=B"],
      "display": "构造函数 / a=10  b=B",
      "why": "构造、print 都在类外定义，各自前面有模板声明，函数名用 <code>Demo&lt;T1,T2&gt;::</code>。"
    },
    {
      "id": "d7c06",
      "day": "day7",
      "q": "读代码，按顺序写出打印的两行。",
      "code": "#include <iostream>\nusing namespace std;\n\nclass Person {\npublic:\n    virtual void test() { cout << \"父类\" << endl; }\n    virtual ~Person() {}\n};\nclass Son : public Person {\npublic:\n    void test() { cout << \"子类\" << endl; }\n};\n\nint main() {\n    float f = 3.14f;\n    cout << static_cast<int>(f) << endl;\n    Person* p = static_cast<Person*>(new Son);\n    p->test();\n    delete p;\n}",
      "answers": ["3\n子类", "3 子类"],
      "display": "3 / 子类",
      "why": "<code>static_cast&lt;int&gt;(3.14f)</code> 截断成 3；上行转换后用父类指针调虚函数，按真实类型走子类版本。"
    }
  ]
};
