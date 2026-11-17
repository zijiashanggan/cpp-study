/* Day 7 · 模板与类型转换（卡片） */
window.DAYS = window.DAYS || {};
window.DAYS.day7 = {
  "id": "day7",
  "title": "Day 7 · 模板与类型转换",
  "desc": "今天两条线：模板把类型参数化，函数模板、类模板、类外实现、头源分离是主干；最后把 C++ 的四种类型转换一次分清。示例全部真编译真跑，输出与卡面一致。",
  "cards": [
    {
      "id": "d7c81",
      "num": 81,
      "title": "模板：把类型当成参数",
      "pain": "同一套加法逻辑，int、float、double 各写一个函数；逻辑一改，所有版本都得跟着改。",
      "analogy": "模板像一个月饼模具：花纹只刻一次，灌进去的是豆沙还是莲蓉，出来就是什么馅的月饼。",
      "only": "<b>分量：理解</b> · 能说清「模板在编译期按类型生成代码」就够，写法在下一张。",
      "guess": "先猜：模板版只写一次加法，int 和 float 调用会不会各生成一份？",
      "codeMin": "int add(int a, int b) { return a + b; }\nfloat add(float a, float b) { return a + b; }",
      "codeFull": "#include <iostream>\nusing namespace std;\n\ntemplate <typename T>\nT add(T a, T b) {\n    return a + b;\n}\n\nint main() {\n    cout << add(1, 2) << endl;\n    cout << add(1.1f, 2.1f) << endl;\n}",
      "output": "3\n3.2",
      "errors": [],
      "pitfalls": [
        "模板不是「一个函数在运行时处理所有类型」，而是编译器按你用的类型各生成一份。",
        "模板声明只对紧邻的一个函数或类生效，第二个函数要重新写一遍。"
      ],
      "concl": "模板就是把类型参数化：逻辑写一次，类型交给编译器填。",
      "terms": "函数模板 / 类型参数化 / 泛型编程 / 实例化",
      "tags": ["模板", "基础"],
      "board": "",
      "quizIds": ["d7s01"]
    },
    {
      "id": "d7c82",
      "num": 82,
      "title": "函数模板怎么写、怎么调",
      "pain": "知道有模板，但不知道 typename 写哪、调用时要不要写 <int>。",
      "analogy": "点菜时说「随便」让厨师按食材配（自动推导），也可以直接报「微辣」（显式指定）。",
      "only": "<b>分量：必背</b> · template 行、T 的两种写法、自动推导和显式指定，必须能默写。",
      "guess": "先猜：add(1.1f, 2.1f) 会推导成 double 还是 float？",
      "codeMin": "template <typename T>\nT add(T a, T b) { return a + b; }",
      "codeFull": "#include <iostream>\nusing namespace std;\n\ntemplate <typename T>\nT add(T a, T b) { return a + b; }\n\nint main() {\n    cout << add(10, 20) << endl;              // 自动推导 T = int\n    cout << add(1.1f, 2.1f) << endl;          // 自动推导 T = float\n    cout << add<int>(10, 20) << endl;         // 显式指定\n    cout << add<double>(2.5, 3.5) << endl;    // 显式指定\n}",
      "output": "30\n3.2\n30\n6",
      "errors": [
        "在模板函数外面写 <code>T a;</code>：<code>error: 'T' does not name a type</code>。模板声明只对紧邻的那个函数生效，改法是把声明写在每个模板函数前面。"
      ],
      "pitfalls": [
        "<code>template &lt;typename T&gt;</code> 只管下面一个函数，第二个函数要重新写。",
        "<code>typename</code> 和 <code>class</code> 在这里等价，项目里统一一种即可。"
      ],
      "concl": "推导靠实参，指定靠 <code>&lt;类型&gt;</code>，两种都能用。",
      "terms": "typename / class / 模板形参 / 模板实参 / 自动推导",
      "tags": ["模板", "函数模板"],
      "board": "",
      "quizIds": ["d7s02", "d7s03", "d7f04", "d7c03"]
    },
    {
      "id": "d7c83",
      "num": 83,
      "title": "模板的两次编译，以及它不肯隐式转换",
      "pain": "以为模板像普通函数一样能把 char 自动转成 int，结果编译不过。",
      "analogy": "普通函数是「来料加工，尺寸差点也能凑」，模板是「按图纸开模，图纸写 10 就只能 10」。",
      "only": "<b>分量：理解</b> · 知道「模板按实参定类型、不做隐式转换」即可，报错原文看一眼。",
      "guess": "先猜：printer(a, b) 里 a 是 int、b 是 char，模板能推出来吗？",
      "codeMin": "template <typename T>\nvoid printer(T a, T b) { }",
      "codeFull": "#include <iostream>\nusing namespace std;\n\ntemplate <typename T>\nvoid printer(T a, T b) { cout << a << \" \" << b << endl; }\n\nint main() {\n    int a = 10;\n    char b = 'A';\n    printer<int>(a, b);   // 指定 T = int，char 才会转成 int\n}",
      "output": "10 65",
      "errors": [
        "不指定类型直接 <code>printer(a, b)</code>：<code>error: no matching function for call to 'printer(int&amp;, char&amp;)'</code>。因为 T 同时被推成 int 和 char，冲突。改法：写 <code>printer&lt;int&gt;(a, b)</code>。"
      ],
      "pitfalls": [
        "模板不做隐式类型转换，两个实参类型不一致就推不出来。",
        "显式写 <code>printer&lt;int&gt;</code> 之后，char 才按普通函数规则转成 int（'A' 是 65）。"
      ],
      "concl": "模板先按实参定死类型，定不下来就报错；要转换就显式指定。",
      "terms": "两次编译 / 模板实例化 / 隐式类型转换 / 推导冲突",
      "tags": ["模板", "编译期"],
      "board": "",
      "quizIds": ["d7s04", "d7j01"]
    },
    {
      "id": "d7c84",
      "num": 84,
      "title": "模板和普通函数同名，先选谁",
      "pain": "写了一个模板又写了一个普通函数，调用时到底走哪个说不清。",
      "analogy": "同一道菜，家常版和通用版都在菜单上，店家先上家常版；想吃通用版得特别点名。",
      "only": "<b>分量：理解</b> · 记住「都匹配先普通、&lt;&gt; 强制模板」这两条就够。",
      "guess": "先猜：printer(a, b)（两个 int）会打印「普通函数」还是「函数模板」？",
      "codeMin": "void printer(int a, int b) { }\ntemplate <typename T>\nvoid printer(T a, T b) { }",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nvoid printer(int a, int b) { cout << \"普通函数\" << endl; }\n\ntemplate <typename T>\nvoid printer(T a, T b) { cout << \"函数模板\" << endl; }\n\nint main() {\n    int a = 10, b = 20;\n    printer(a, b);          // 普通函数优先\n    printer('A', 'B');      // 模板匹配更好\n    printer<>(a, b);        // 空模板实参列表，强制走模板\n    printer<int>(a, b);     // 指定类型，走模板\n}",
      "output": "普通函数\n函数模板\n函数模板\n函数模板",
      "errors": [],
      "pitfalls": [
        "两者都能匹配时普通函数优先，因为普通函数只编译一次。",
        "<code>printer&lt;&gt;</code> 是「强制走模板」的写法，不是空参数。"
      ],
      "concl": "都匹配先普通；模板匹配更精确时用模板；<code>&lt;&gt;</code> 强制模板。",
      "terms": "重载决议 / 空模板实参列表 / 精确匹配",
      "tags": ["模板", "重载"],
      "board": "",
      "quizIds": ["d7s05", "d7j02"]
    },
    {
      "id": "d7c85",
      "num": 85,
      "title": "函数模板也能重载",
      "pain": "想要一个参数的版本和两个参数的版本，不知道模板能不能重载。",
      "analogy": "同一个模具厂，既能出单格模具，也能出双格模具，各开各的。",
      "only": "<b>分量：了解</b> · 知道模板可以重载、每个都要单独声明模板即可。",
      "guess": "先猜：两个同名模板，编译器靠什么区分？",
      "codeMin": "template <typename T>\nvoid printer(T a, T b) { }\ntemplate <typename T>\nvoid printer(T a) { }",
      "codeFull": "#include <iostream>\nusing namespace std;\n\ntemplate <typename T>\nvoid printer(T a, T b) { cout << \"2个参数\" << endl; }\n\ntemplate <typename T>\nvoid printer(T a) { cout << \"1个参数\" << endl; }\n\nint main() {\n    printer(10);\n    printer(10, 20);\n}",
      "output": "1个参数\n2个参数",
      "errors": [],
      "pitfalls": [
        "每个重载模板都要单独写 <code>template &lt;typename T&gt;</code>。"
      ],
      "concl": "模板重载看参数个数/类型，每次都要重新声明模板。",
      "terms": "模板重载 / 参数列表",
      "tags": ["模板", "重载"],
      "board": "",
      "quizIds": ["d7s06", "d7j03"]
    },
    {
      "id": "d7c86",
      "num": 86,
      "title": "模板的局限与具体化",
      "pain": "模板里写了 cout << t，结果传进来一个自定义类就编译炸了。",
      "analogy": "通用模具能压所有软料，遇到石头就得单独开一套专用模具。",
      "only": "<b>分量：理解</b> · 知道模板不是万能的、特殊类型要重载或具体化即可。",
      "guess": "先猜：test01(emp) 传一个没有重载 << 的类，会打印什么？",
      "codeMin": "template <typename T>\nvoid test01(T t) { cout << \"t=\" << t << endl; }",
      "codeFull": "#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Emp {\n    friend ostream& operator<<(ostream& os, const Emp& e);\n    int id; string name;\npublic:\n    Emp(int id, string name) : id(id), name(name) {}\n};\n\nostream& operator<<(ostream& os, const Emp& e) {\n    return os << \"员工编号:\" << e.id << \"  员工姓名:\" << e.name;\n}\n\ntemplate <typename T>\nvoid test01(T t) { cout << \"t=\" << t << endl; }\n\nint main() {\n    test01(10);\n    test01(Emp(1001, \"张三\"));\n}",
      "output": "t=10\nt=员工编号:1001  员工姓名:张三",
      "errors": [
        "不重载 <code>&lt;&lt;</code>：<code>error: no match for 'operator&lt;&lt;' (operand types are 'std::basic_ostream&lt;char&gt;' and 'Emp')</code>。改法：重载 <code>operator&lt;&lt;</code>，或给 Emp 写一个 <code>template&lt;&gt;</code> 具体化版本。"
      ],
      "pitfalls": [
        "具体化写法是 <code>template&lt;&gt; void test01&lt;Emp&gt;(Emp e)</code>，<code>template&lt;&gt;</code> 不能省。",
        "结构体直接 <code>a &gt; b</code>、数组名比较的是地址，也是模板局限。"
      ],
      "concl": "模板只管通用逻辑，特殊情况用重载或具体化补。",
      "terms": "模板局限性 / 具体化 / template<> / 运算符重载",
      "tags": ["模板", "具体化"],
      "board": "",
      "quizIds": ["d7s07"]
    },
    {
      "id": "d7c87",
      "num": 87,
      "title": "类模板：实例化必须给类型",
      "pain": "函数模板能自动推，类模板却经常要在类名后面写一长串 <int, char>。",
      "analogy": "函数模板像现做的面，报口味就行；类模板像定做家具，尺寸不报厂家不开工。",
      "only": "<b>分量：必背</b> · <code>Demo&lt;int, int&gt;</code> 这个完整类名必须会写，CTAD 知道就行。",
      "guess": "先猜：Demo ob(10, 20) 在 C++17 下能不能过？",
      "codeMin": "template <class T1, class T2>\nclass Demo { public: T1 a; T2 b; };",
      "codeFull": "#include <iostream>\nusing namespace std;\n\ntemplate <class T1, class T2>\nclass Demo {\npublic:\n    T1 a; T2 b;\n    Demo(T1 a, T2 b) : a(a), b(b) {}\n    void print() { cout << a << \" \" << b << endl; }\n};\n\nint main() {\n    Demo<int, int> ob(10, 20);   // 完整类名：Demo<int, int>\n    ob.print();\n    Demo ob2(1.5, 'A');          // C++17 起可自动推导（CTAD）\n    ob2.print();\n}",
      "output": "10 20\n1.5 A",
      "errors": [
        "用 C++14 及更早：<code>error: missing template arguments before 'ob'</code>。改法：写全 <code>Demo&lt;int, int&gt; ob(10, 20);</code>。"
      ],
      "pitfalls": [
        "C++17 有 CTAD 能省模板参数，但项目和面试通常要求写全，别把「能省」当规范。",
        "<code>Demo&lt;int, int&gt;</code> 才是完整的类名，<code>Demo</code> 只是模板名。"
      ],
      "concl": "类模板要实例化成 <code>Demo&lt;类型, 类型&gt;</code> 才能建对象。",
      "terms": "类模板 / 实例化 / CTAD / 模板参数列表",
      "tags": ["模板", "类模板"],
      "board": "",
      "quizIds": ["d7s08", "d7s09", "d7f01", "d7j04", "d7c04"]
    },
    {
      "id": "d7c88",
      "num": 88,
      "title": "类模板成员函数写在类外",
      "pain": "类里声明、类外定义，一编译就报一堆 T1 不认识的错。",
      "analogy": "每间分店都要单独贴一张「本店适用」的授权书，少一张就不认。",
      "only": "<b>分量：必背</b> · 「一行模板声明 + 类名&lt;T1,T2&gt;::」这个格式必须能默写。",
      "guess": "先猜：类外实现时，每一行前面都要写什么？",
      "codeMin": "template <class T1, class T2>\nDemo<T1, T2>::Demo(T1 a, T2 b) { }",
      "codeFull": "#include <iostream>\nusing namespace std;\n\ntemplate <class T1, class T2>\nclass Demo {\npublic:\n    T1 a; T2 b;\n    Demo(T1 a, T2 b);\n    void print();\n};\n\ntemplate <class T1, class T2>\nDemo<T1, T2>::Demo(T1 a, T2 b) : a(a), b(b) { cout << \"构造函数\" << endl; }\n\ntemplate <class T1, class T2>\nvoid Demo<T1, T2>::print() { cout << \"a=\" << a << \"  b=\" << b << endl; }\n\nint main() {\n    Demo<int, char> d(10, 'B');\n    d.print();\n}",
      "output": "构造函数\na=10  b=B",
      "errors": [
        "漏写 <code>template &lt;class T1, class T2&gt;</code>：<code>error: 'T1' does not name a type</code>（T2 同理）。",
        "漏写 <code>&lt;T1, T2&gt;</code>：<code>error: invalid use of template-name 'Demo' without an argument list</code>。"
      ],
      "pitfalls": [
        "构造函数、普通成员函数，每一个类外定义前都要重新写模板声明。",
        "参数列表里的 <code>&lt;T1, T2&gt;</code> 不能省。"
      ],
      "concl": "类外实现 = 一行模板声明 + <code>类名&lt;T1,T2&gt;::函数名</code>，一个都不能少。",
      "terms": "类外定义 / 作用域解析 / 模板声明",
      "tags": ["模板", "类模板"],
      "board": "",
      "quizIds": ["d7s10", "d7s11", "d7f02", "d7c05"]
    },
    {
      "id": "d7c89",
      "num": 89,
      "title": "类模板对象当函数参数",
      "pain": "写了个 void f(Demo d)，编译器不知道 Demo 是哪个具体类。",
      "analogy": "快递单上只写「家具」不行，得写清「1.8 米床」才能发货。",
      "only": "<b>分量：理解</b> · 知道参数可以写死具体类型，也可以继续用模板泛型即可。",
      "guess": "先猜：参数写 Demo<string, int>& 和写模板泛型，输出一样吗？",
      "codeMin": "void show(Demo<string, int>& d) { }\ntemplate <class T1, class T2>\nvoid showT(Demo<T1, T2> d) { }",
      "codeFull": "#include <iostream>\n#include <string>\nusing namespace std;\n\ntemplate <class T1, class T2>\nclass Demo {\npublic:\n    T1 a; T2 b;\n    Demo(T1 a, T2 b) : a(a), b(b) {}\n};\n\nvoid show(Demo<string, int>& d) {\n    cout << \"具体类型: \" << d.a << \" \" << d.b << endl;\n}\n\ntemplate <class T1, class T2>\nvoid showT(Demo<T1, T2> d) {\n    cout << \"泛型参数: \" << d.a << \" \" << d.b << endl;\n}\n\nint main() {\n    Demo<string, int> ob(\"zhangsan\", 20);\n    show(ob);\n    showT(ob);\n}",
      "output": "具体类型: zhangsan 20\n泛型参数: zhangsan 20",
      "errors": [
        "写成 <code>void f(Demo d)</code>：<code>error: use of class template 'Demo' requires template arguments</code>。"
      ],
      "pitfalls": [
        "泛型版本按值传会拷贝整个对象，大对象建议写 <code>const Demo&lt;T1,T2&gt;&amp;</code>。"
      ],
      "concl": "参数可以是具体实例 <code>Demo&lt;string,int&gt;</code>，也可以是模板泛型 <code>Demo&lt;T1,T2&gt;</code>。",
      "terms": "模板实参 / 函数模板 / 按值传参",
      "tags": ["模板", "类模板"],
      "board": "",
      "quizIds": ["d7s12"]
    },
    {
      "id": "d7c90",
      "num": 90,
      "title": "类模板派生出普通类",
      "pain": "从模板类继承，子类不知道父类到底是哪个类型、占多大空间。",
      "analogy": "连锁店加盟必须写明「按哪套标准装修」，不能只写「按总部标准」。",
      "only": "<b>分量：了解</b> · 知道继承模板父类要写死类型即可，实际项目用得少。",
      "guess": "先猜：class Son : public Parent 能不能过？",
      "codeMin": "class Son : public Parent<int, char> { };",
      "codeFull": "#include <iostream>\nusing namespace std;\n\ntemplate <class T1, class T2>\nclass Parent {\npublic:\n    T1 a; T2 b;\n    Parent(T1 a, T2 b) : a(a), b(b) {}\n};\n\nclass Son : public Parent<int, char> {   // 必须写明父类类型\npublic:\n    int c;\n    Son(int a, char b, int c) : Parent<int, char>(a, b), c(c) {}\n};\n\nint main() {\n    Son s(10, 'B', 20);\n    cout << s.a << \" \" << s.b << \" \" << s.c << endl;\n}",
      "output": "10 B 20",
      "errors": [
        "<code>class Son : public Parent</code>：<code>error: use of class template 'Parent' requires template arguments</code>。"
      ],
      "pitfalls": [
        "父类类型写在哪，初始化列表里也要写同一套 <code>&lt;int, char&gt;</code>。"
      ],
      "concl": "普通子类继承模板父类，必须在冒号后写死父类的类型。",
      "terms": "类模板派生 / 模板实参 / 基类初始化",
      "tags": ["模板", "继承"],
      "board": "",
      "quizIds": ["d7s13"]
    },
    {
      "id": "d7c91",
      "num": 91,
      "title": "类模板派生出类模板",
      "pain": "子类自己也是模板，父类的类型又来自子类的模板参数，写法容易乱。",
      "analogy": "父子店都用同一套可换尺寸的模具，子店多一个自己的尺寸档。",
      "only": "<b>分量：理解</b> · 看懂父类类型从子类模板参数继续传下去即可。",
      "guess": "先猜：子类模板要几个类型参数？",
      "codeMin": "template <class T1, class T2, class T3>\nclass Son : public Parent<T1, T2> { };",
      "codeFull": "#include <iostream>\nusing namespace std;\n\ntemplate <class T1, class T2>\nclass Parent {\npublic:\n    T1 a; T2 b;\n    Parent(T1 a, T2 b) : a(a), b(b) {}\n};\n\ntemplate <class T1, class T2, class T3>\nclass Son : public Parent<T1, T2> {\npublic:\n    T3 c;\n    Son(T1 a, T2 b, T3 c) : Parent<T1, T2>(a, b), c(c) {}\n};\n\nint main() {\n    Son<int, char, int> s(10, 'B', 20);\n    cout << s.a << \" \" << s.b << \" \" << s.c << endl;\n}",
      "output": "10 B 20",
      "errors": [],
      "pitfalls": [
        "初始化列表里写 <code>Parent&lt;T1,T2&gt;(a,b)</code>，不能只写 <code>Parent(a,b)</code>。"
      ],
      "concl": "子类模板要把父类需要的类型继续传下去。",
      "terms": "类模板继承 / 模板参数传递",
      "tags": ["模板", "继承"],
      "board": "",
      "quizIds": ["d7s14"]
    },
    {
      "id": "d7c92",
      "num": 92,
      "title": "类模板的头文件和源文件为什么不能分",
      "pain": "按普通类的习惯把成员函数写进 .cpp，编译过了，链接却报 undefined reference。",
      "analogy": "模板是现场按图纸浇筑，图纸（定义）不在工地，工人没法施工。",
      "only": "<b>分量：必背</b> · 这是面试高频题：为什么模板定义要放头文件、怎么解决。",
      "guess": "先猜：只在 .h 里声明、.cpp 里定义，main 里实例化，会卡在哪一步？",
      "codeMin": "// Demo.h 只有声明\ntemplate<class T1, class T2>\nclass Demo { public: void print(); };",
      "codeFull": "// Demo.hpp：声明和定义写在同一个文件里\n#pragma once\n#include <iostream>\nusing namespace std;\n\ntemplate<class T1, class T2>\nclass Demo {\npublic:\n    T1 a; T2 b;\n    Demo(T1 a, T2 b) : a(a), b(b) {}\n    void print();\n};\n\ntemplate<class T1, class T2>\nvoid Demo<T1, T2>::print() { cout << a << \" \" << b << endl; }\n\nint main() {\n    Demo<int, int> d(10, 20);\n    d.print();\n}",
      "output": "10 20",
      "errors": [
        "头里只声明、.cpp 里定义：编译能过，链接报 <code>undefined reference to 'Demo&lt;int, int&gt;::print()'</code>。改法：把定义放进头文件（习惯叫 .hpp），使用方 include 它。"
      ],
      "pitfalls": [
        "模板在调用处才实例化，编译器必须能看到完整定义，所以定义要和声明在一起。",
        "不要 <code>#include \"Demo.cpp\"</code>，工程上直接把声明和定义写进 .hpp。"
      ],
      "concl": "类模板的声明和定义放同一个头文件（习惯叫 .hpp）。",
      "terms": "翻译单元 / 实例化 / undefined reference / .hpp",
      "tags": ["模板", "工程"],
      "board": "",
      "quizIds": ["d7s15", "d7s16", "d7f03", "d7j05"]
    },
    {
      "id": "d7c93",
      "num": 93,
      "title": "类模板的友元",
      "pain": "想给模板类写 operator<< 或访问私有成员的全局函数，friend 写在类里却编译不过。",
      "analogy": "门禁名单要写清「哪一户的哪个人」，只写「朋友」保安不放行。",
      "only": "<b>分量：了解</b> · 知道友元要写模板或写死实例类型即可，细节用到再查。",
      "guess": "先猜：普通全局函数做模板类的友元，要指定具体类型吗？",
      "codeMin": "template <class T1, class T2>\nclass Demo { friend void show(Demo<int, int> d); };",
      "codeFull": "#include <iostream>\nusing namespace std;\n\ntemplate <class T1, class T2>\nclass Demo {\n    friend void show(Demo<int, int> d);   // 只给这一个实例开权限\n    T1 a; T2 b;\npublic:\n    Demo(T1 a, T2 b) : a(a), b(b) {}\n};\n\nvoid show(Demo<int, int> d) {\n    cout << d.a << \" \" << d.b << endl;\n}\n\nint main() {\n    Demo<int, int> d(1001, 20);\n    show(d);\n}",
      "output": "1001 20",
      "errors": [],
      "pitfalls": [
        "全局函数模板做友元要写 <code>template &lt;class T3, class T4&gt; friend void f(Demo&lt;T3,T4&gt; obj);</code>。",
        "具体化友元只对写死的那组类型有效。"
      ],
      "concl": "友元要么写成模板友元，要么写死某一组实例类型。",
      "terms": "友元函数 / 友元模板 / 实例",
      "tags": ["模板", "友元"],
      "board": "",
      "quizIds": ["d7s17"]
    },
    {
      "id": "d7c94",
      "num": 94,
      "title": "用类模板写一个动态数组",
      "pain": "int 数组、double 数组、自定义类型数组各写一遍，扩容和深拷贝代码重复。",
      "analogy": "一个可伸缩的收纳箱，里面装书、装鞋、装零件都行，箱子规则不变。",
      "only": "<b>分量：理解</b> · 看懂「T* + capacity + size + 扩容/深拷贝」这套骨架即可。",
      "guess": "先猜：容量 2 的数组连续 add 5 个元素，会扩容几次？",
      "codeMin": "template <typename T>\nclass MyArray { T* arr; int cap; int len; };",
      "codeFull": "#include <iostream>\nusing namespace std;\n\ntemplate <typename T>\nclass MyArray {\n    T* arr; int cap; int len;\npublic:\n    MyArray(int c = 2) : cap(c), len(0) { arr = new T[cap]; }\n    ~MyArray() { delete[] arr; }\n    void add(const T& v) {\n        if (len == cap) grow();\n        arr[len++] = v;\n    }\n    T& at(int i) { return arr[i]; }\n    int size() const { return len; }\nprivate:\n    void grow() {\n        cap *= 2;\n        T* tmp = new T[cap];\n        for (int i = 0; i < len; i++) tmp[i] = arr[i];\n        delete[] arr;\n        arr = tmp;\n    }\n};\n\nint main() {\n    MyArray<int> a;                 // 容量 2\n    for (int i = 1; i <= 5; i++) a.add(i * 10);\n    cout << a.size() << endl;\n    for (int i = 0; i < a.size(); i++) cout << (i ? \" \" : \"\") << a.at(i);\n    cout << endl;\n}",
      "output": "5\n10 20 30 40 50",
      "errors": [],
      "pitfalls": [
        "扩容后要 <code>delete[]</code> 旧数组，否则每次翻倍都漏一块。",
        "拷贝构造和 <code>operator=</code> 要深拷贝，否则两个对象共用一块内存，析构时 double free。"
      ],
      "concl": "类模板把元素类型抽走，容量、扩容、深拷贝的逻辑只写一遍。",
      "terms": "类模板 / 动态数组 / 扩容 / 深拷贝 / RAII",
      "tags": ["模板", "综合"],
      "board": "",
      "quizIds": ["d7s18", "d7c01"]
    },
    {
      "id": "d7c95",
      "num": 95,
      "title": "为什么 C++ 还要四种转换",
      "pain": "C 风格 (int)a 看不出是想转数值、转指针还是去掉 const，出错也查不出。",
      "analogy": "瑞士军刀什么都能撬，但医生说「这是手术刀、这是剪刀」，出事才知道用了哪把。",
      "only": "<b>分量：理解</b> · 知道四种转换是为了「让意图可见、让编译器能检查」即可。",
      "guess": "先猜：(int)p 把指针转整数，和 reinterpret_cast<int>(p) 哪个更能说明意图？",
      "codeMin": "int a = (int)3.14f;                 // C 风格\nint b = static_cast<int>(3.14f);   // C++ 风格",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nint main() {\n    float f = 3.14f;\n    int a = (int)f;\n    int b = static_cast<int>(f);\n    cout << a << \" \" << b << endl;\n}",
      "output": "3 3",
      "errors": [],
      "pitfalls": [
        "C 风格转换连 const 都能一起转掉，编译器不会提醒。"
      ],
      "concl": "四种转换各管一类事，代码里一眼能看出意图，也方便搜索。",
      "terms": "C 风格转换 / 显式转换 / 类型安全",
      "tags": ["类型转换", "基础"],
      "board": "",
      "quizIds": ["d7s19"]
    },
    {
      "id": "d7c96",
      "num": 96,
      "title": "static_cast：最常用的那一个",
      "pain": "数值转换、父子类指针转换都用一个写法，不知道哪个安全哪个不安全。",
      "analogy": "走正规闸机：有票就放行，但它不核对你是不是本人（下行不检查真实类型）。",
      "only": "<b>分量：必背</b> · 数值转换和上行转换每天在用，必须知道下行不做检查。",
      "guess": "先猜：父类指针 static_cast 成子类指针后调用子类函数，一定安全吗？",
      "codeMin": "float f = 3.14f;\nint a = static_cast<int>(f);\nPerson* p = static_cast<Person*>(new Son);",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nclass Person {\npublic:\n    virtual void test() { cout << \"父类\" << endl; }\n    virtual ~Person() {}\n};\nclass Son : public Person {\npublic:\n    void test() { cout << \"子类\" << endl; }\n};\n\nint main() {\n    float f = 3.14f;\n    cout << static_cast<int>(f) << endl;        // 基本类型\n    Person* p = static_cast<Person*>(new Son);  // 上行：安全\n    p->test();\n    delete p;\n}",
      "output": "3\n子类",
      "errors": [
        "转没有关系的类指针：<code>error: invalid 'static_cast' from type 'Demo*' to type 'Person*'</code>。改法：确认两个类有继承关系，或改用 <code>reinterpret_cast</code>（仍不安全）。"
      ],
      "pitfalls": [
        "上行（子→父）安全；下行（父→子）不做运行时检查，对象真实类型不对就是未定义行为。",
        "不能用来去掉 const，那是 <code>const_cast</code> 的活。"
      ],
      "concl": "static_cast 管数值和父子类指针，上行安全，下行要自己保证。",
      "terms": "上行转换 / 下行转换 / 静态转换",
      "tags": ["类型转换", "static_cast"],
      "board": "",
      "quizIds": ["d7s20", "d7s21", "d7f05", "d7c06"]
    },
    {
      "id": "d7c97",
      "num": 97,
      "title": "dynamic_cast：下行转换的安全版",
      "pain": "父类指针到底指不指向子类，static_cast 不知道，转错了照样调用。",
      "analogy": "安检门会真的查证件，不是子类就拦下（返回空），不会放你进错门。",
      "only": "<b>分量：必背</b> · 多态下行转换的标准答案，面试必问「失败返回什么」。",
      "guess": "先猜：dynamic_cast<Son*>(new Person) 返回什么？",
      "codeMin": "Person* p = new Person;\nSon* s = dynamic_cast<Son*>(p);   // 失败返回 nullptr",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nclass Person {\npublic:\n    virtual void test() { cout << \"父类\" << endl; }\n    virtual ~Person() {}\n};\nclass Son : public Person {\npublic:\n    void test() { cout << \"子类\" << endl; }\n};\n\nint main() {\n    Person* p1 = new Person;\n    Son* s1 = dynamic_cast<Son*>(p1);      // 实际不是 Son\n    cout << (s1 == nullptr ? \"转换失败\" : \"转换成功\") << endl;\n\n    Person* p2 = new Son;\n    Son* s2 = dynamic_cast<Son*>(p2);      // 实际是 Son\n    if (s2) s2->test();\n\n    delete p1;\n    delete p2;\n}",
      "output": "转换失败\n子类",
      "errors": [
        "基类没有虚函数：<code>error: cannot 'dynamic_cast' 'p' (of type 'class Person*') to type 'class Son*' (source type is not polymorphic)</code>。改法：给基类加一个虚函数（通常是虚析构）。"
      ],
      "pitfalls": [
        "基类必须至少有一个虚函数，否则 dynamic_cast 编译不过。",
        "指针转换失败返回 <code>nullptr</code>，引用转换失败抛 <code>bad_cast</code>。"
      ],
      "concl": "下行转换用 dynamic_cast，它会真的检查，失败给 nullptr。",
      "terms": "运行时类型检查 / 多态类型 / bad_cast / nullptr",
      "tags": ["类型转换", "dynamic_cast"],
      "board": "",
      "quizIds": ["d7s22", "d7s23", "d7f06", "d7j06"]
    },
    {
      "id": "d7c98",
      "num": 98,
      "title": "const_cast：只动 const",
      "pain": "拿到一个 const 指针，底层函数却要非 const，不知道怎么安全地交出去。",
      "analogy": "给复印件盖「仅限内部」的章，也能再盖一个「可外传」把它撤掉，但原件本身没变。",
      "only": "<b>分量：必背</b> · 只对指针/引用生效、别改真正常量，这两条必须记住。",
      "guess": "先猜：const_cast<int>(a) 能不能把 const int 变量转成 int？",
      "codeMin": "const int* p = new int(3);\nint* q = const_cast<int*>(p);",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nint main() {\n    const int* p = new int(3);\n    int* q = const_cast<int*>(p);\n    *q = 5;\n    cout << *p << endl;      // 5，p、q 指向同一块内存\n\n    int x = 20;\n    const int& r = x;\n    int& r2 = const_cast<int&>(r);\n    r2 = 30;\n    cout << x << endl;       // 30\n\n    delete p;\n}",
      "output": "5\n30",
      "errors": [
        "<code>const_cast&lt;int&gt;(a)</code>：<code>error: invalid use of 'const_cast' with type 'int', which is not a pointer, reference, nor a pointer-to-data-member type</code>。改法：只对指针或引用使用。"
      ],
      "pitfalls": [
        "只能转指针/引用，不能直接转一个 const 变量。",
        "如果对象本身真是 const（比如字符串常量），通过它改值是未定义行为。"
      ],
      "concl": "const_cast 只加减 const，别拿它改真正常量。",
      "terms": "const 指针 / const 引用 / 未定义行为",
      "tags": ["类型转换", "const_cast"],
      "board": "",
      "quizIds": ["d7s24", "d7f07", "d7j07"]
    },
    {
      "id": "d7c99",
      "num": 99,
      "title": "reinterpret_cast：最后手段",
      "pain": "嵌入式里要把寄存器地址当指针用，或者把指针打印成整数。",
      "analogy": "把一把钥匙直接当螺丝刀用——能拧，但随时可能崩。",
      "only": "<b>分量：理解</b> · 知道它只重解释位模式、平台相关、平时别用即可。",
      "guess": "先猜：reinterpret_cast<int>(p) 在 64 位下会不会丢地址？",
      "codeMin": "long long addr = reinterpret_cast<long long>(p);   // 指针 → 整数",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int x = 65;\n    int* p = &x;\n    long long addr = reinterpret_cast<long long>(p);   // 指针转整数\n    int* q = reinterpret_cast<int*>(addr);   // 再转回来\n    cout << *q << endl;\n\n    char* c = reinterpret_cast<char*>(p);    // 按字节看同一块内存\n    cout << (int)c[0] << endl;\n}",
      "output": "65\n65",
      "errors": [],
      "pitfalls": [
        "指针和整数互转依赖平台位宽，64 位别用 <code>int</code> 装地址，用 <code>long long</code> 或 <code>uintptr_t</code>。",
        "转完类型系统不再保护你，读写都可能越界。"
      ],
      "concl": "只在和硬件/二进制打交道时用，用前想清楚位宽和生命周期。",
      "terms": "指针转整数 / 位宽 / 未定义行为 / uintptr_t",
      "tags": ["类型转换", "reinterpret_cast"],
      "board": "",
      "quizIds": ["d7s25"]
    },
    {
      "id": "d7c100",
      "num": 100,
      "title": "四种转换怎么选",
      "pain": "四个名字都认识，真到写代码还是随手一个 C 风格括号。",
      "analogy": "工具箱里四把工具：常规螺丝刀、验货员、标签机、撬棍，按场景拿。",
      "only": "<b>分量：必背</b> · 面试常问「四种转换的区别和场景」，要能一口气说清。",
      "guess": "先猜：去掉 const 用哪个？多态下行用哪个？",
      "codeMin": "static_cast / dynamic_cast / const_cast / reinterpret_cast",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nclass Base { public: virtual ~Base() {} };\nclass Der : public Base { public: void hi() { cout << \"hi\" << endl; } };\n\nint main() {\n    double d = 3.9;\n    cout << static_cast<int>(d) << endl;          // 数值：截断\n\n    Base* b = new Der;\n    if (Der* p = dynamic_cast<Der*>(b)) p->hi();  // 多态下行：会检查\n\n    int x = 7;\n    const int* cp = &x;\n    *const_cast<int*>(cp) = 8;                    // 只去 const\n    cout << x << endl;\n\n    cout << (reinterpret_cast<long long>(b) != 0) << endl;  // 底层位模式\n    delete b;\n}",
      "output": "3\nhi\n8\n1",
      "errors": [],
      "pitfalls": [
        "能用 <code>static_cast</code> 就别上 <code>reinterpret_cast</code>。",
        "<code>dynamic_cast</code> 只对多态类型有效。"
      ],
      "concl": "数值/上行 static，多态下行 dynamic，const 用 const，底层才 reinterpret。",
      "terms": "四种转换 / 类型安全 / 多态类型",
      "tags": ["类型转换", "总结"],
      "board": "",
      "quizIds": ["d7s26", "d7s27", "d7f08", "d7c02"]
    }
  ],
  "taskTitle": "Day 7 · 今天动手",
  "taskDesc": "两个任务都在本机跑。任务 1 用函数模板写交换和排序，验证「一套逻辑吃多种类型」；任务 2 把四种转换各用一次，看清每种转换的边界。",
  "tasks": [
    {
      "id": "d7t1",
      "title": "任务 1 · 函数模板版交换 + 排序",
      "goal": "<b>目标</b>：写一个 <code>swapT</code> 和一个 <code>sortArr</code> 函数模板，用 int、double 各跑一遍，确认逻辑只写了一份。",
      "code": "#include <iostream>\nusing namespace std;\n\ntemplate <typename T>\nvoid swapT(T& a, T& b) { T t = a; a = b; b = t; }\n\ntemplate <typename T>\nvoid sortArr(T arr[], int n) {\n    for (int i = 0; i < n - 1; i++)\n        for (int j = 0; j < n - 1 - i; j++)\n            if (arr[j] > arr[j + 1]) swapT(arr[j], arr[j + 1]);\n}\n\nint main() {\n    int a = 1, b = 2;\n    swapT(a, b);\n    cout << a << \" \" << b << endl;\n\n    double d[5] = {3.2, 1.1, 4.5, 2.0, 5.5};\n    sortArr(d, 5);\n    for (int i = 0; i < 5; i++) cout << (i ? \" \" : \"\") << d[i];\n    cout << endl;\n}",
      "output": "2 1\n1.1 2 3.2 4.5 5.5",
      "tip": "<code>swapT</code> 和 <code>sortArr</code> 各有一行 <code>template &lt;typename T&gt;</code>，只作用于紧邻的那个函数。把 double 数组换成 int 数组再跑一次，排序逻辑一个字都不用改。"
    },
    {
      "id": "d7t2",
      "title": "任务 2 · 四种转换各用一次",
      "goal": "<b>目标</b>：用 <code>static_cast</code> 转数值、<code>dynamic_cast</code> 做多态下行、<code>const_cast</code> 去 const、<code>reinterpret_cast</code> 取地址位模式，各看一次输出。",
      "code": "#include <iostream>\nusing namespace std;\n\nclass Base { public: virtual ~Base() {} };\nclass Der : public Base { public: void hi() { cout << \"hi\" << endl; } };\n\nint main() {\n    double d = 42.9;\n    int i = static_cast<int>(d);\n    cout << i << endl;                         // 42\n\n    Base* b = new Der;\n    Der* p = dynamic_cast<Der*>(b);\n    cout << (p ? \"下行成功\" : \"下行失败\") << endl;\n    p->hi();\n\n    const int* cp = &i;\n    *const_cast<int*>(cp) = 7;\n    cout << i << endl;                         // 7\n\n    cout << (reinterpret_cast<long long>(b) != 0) << endl;  // 1\n    delete b;\n}",
      "output": "42\n下行成功\nhi\n7\n1",
      "tip": "把 <code>dynamic_cast</code> 换成 <code>static_cast</code> 也能编过，但对象真实类型不对时不会拦你；<code>const_cast</code> 改的 <code>i</code> 本身不是 const，所以是合法的。"
    }
  ],
  "gloss": {
    "title": "今天这 7 个面试题，先用人话过一遍",
    "html": "<h4>今天这 7 个面试题，先用人话过一遍</h4>\n    <p><b>① 模板有什么用？</b>把类型参数化，让逻辑相同、类型不同的代码只写一份；编译器按实际用到的类型生成对应版本，减少重复、方便维护。</p>\n    <p><b>② 模板是怎么编译的？</b>编译两次：先在声明处检查模板本身；再在调用处用实参类型替换 T，生成具体函数/类。所以模板的定义必须让调用方看得见。</p>\n    <p><b>③ 用模板遇到过什么问题？</b>类型推导冲突（int 和 char 一起传推不出 T）、自定义类型不能直接 <code>cout</code> 或比较、模板写进 .cpp 链接报 undefined reference。</p>\n    <p><b>④ 类模板的源文件和头文件分离有什么问题？怎么解决？</b>模板在实例化时才生成代码，编译器必须看到完整定义；只留声明在 .h 会链接失败。解决：声明和定义都写进 .hpp，由使用方 include。</p>\n    <p><b>⑤ C++ 的四种类型转换？</b><code>static_cast</code> 管数值和父子类指针；<code>dynamic_cast</code> 做多态类型的安全下行；<code>const_cast</code> 只加减 const；<code>reinterpret_cast</code> 重解释位模式，最不安全。</p>\n    <p><b>⑥ 为什么要用 C++ 异常？</b>返回值可能被忽略，异常不会；还能带类型和信息跨层跳到 catch，不用每层判错误码。</p>\n    <p><b>⑦ 自己写过异常类吗？怎么写？</b>继承 <code>std::exception</code>，用 <code>string</code> 存消息，按原签名重写 <code>const char* what() const noexcept</code>，外层用 <code>catch (exception&amp;)</code> 接。</p>\n    <p class=\"say\">这天的重心在模板主干：函数模板、类模板、类外实现、头源分离要能默写；四种转换里 static / dynamic / const 必须分清，reinterpret 知道是最后手段就行。</p>"
  }
};
