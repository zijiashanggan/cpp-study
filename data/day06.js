/* Day 6 · 多态与异常（卡片） */
window.DAYS = window.DAYS || {};
window.DAYS.day6 = {
  "id": "day6",
  "title": "Day 6 · 多态与异常",
  "desc": "今天两条线：先用 virtual 让「父类指针调子类的函数」这件事真正发生，把 vptr / vtable、抽象类、虚析构走一遍；再学 throw / try / catch，搞清严格类型匹配、栈解旋和异常对象怎么接。每张卡的输出都是真跑出来的。",
  "cards": [
    {
      "id": "d6c63",
      "num": 63,
      "title": "多态：同一个调用，不同对象做不同的事",
      "pain": "<b>没有它会怎样</b>：<code>run(car)</code> 只能写死一种行为，想支持 SUV 就得再写一个 <code>runSuv</code>，加一种车就加一个函数。<b>多态</b>就是<b>同一个按钮，装在不同机器上干不同的活</b>：调用方只认「按按钮」这件事，具体怎么动由对象自己决定。",
      "analogy": "同一个按钮，装在不同机器上干不同的活",
      "only": "<b>分量：理解</b> · 能说清「静态多态靠编译器、动态多态靠运行时」就够，概念卡不用背代码。",
      "guess": "先猜：编译时就能定下调用地址的，叫静态多态还是动态多态？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nvoid show(int x)        { cout << \"int \" << x << endl; }   // 重载：参数不同\nvoid show(const char* s){ cout << \"str \" << s << endl; }\n\nint main() {\n    show(1);        // int 1：编译时按实参类型就选定了\n    show(\"a\");      // str a\n}",
      "output": "int 1\nstr a",
      "errors": [],
      "pitfalls": [
        "<b>静态多态靠编译器</b>：函数重载、运算符重载都在编译阶段定好调哪个，叫早绑定。",
        "<b>动态多态靠运行时</b>：虚函数要到运行时看对象真实类型，叫晚绑定。",
        "<b>两者目的相同</b>：都是「一个名字，多种行为」，区别只在什么时候决定。",
        "<b>别指望重载做多态</b>：<code>run(Car*)</code> 传子类指针，重载版本根本不会被选中。"
      ],
      "concl": "多态就是「同一接口、不同实现」；重载是编译时多态（早绑定），虚函数是运行时多态（晚绑定）。",
      "terms": "「多态（polymorphism）」；「早绑定 / 晚绑定（early / late binding）」也叫静态联编 / 动态联编。",
      "tags": [
        "多态",
        "绑定"
      ],
      "board": "",
      "quizIds": [
        "d6s01",
        "d6s02"
      ]
    },
    {
      "id": "d6c64",
      "num": 64,
      "title": "向上类型转换：父类指针指向子类，却调不动子类",
      "pain": "<b>没有它会怎样</b>：<code>Car* p = new SUV;</code> 完全合法，可 <code>p-&gt;drive()</code> 打的却是「汽车行驶」。<b>因为编译器只看指针的静态类型</b>，它只认识 <code>Car::drive</code>——像<b>拿着员工工牌去刷部门门禁，系统只认工牌上的部门</b>。",
      "analogy": "拿员工工牌刷部门门禁，系统只认工牌上的部门",
      "only": "<b>分量：理解</b> · 知道「父类指针调不到子类版本」的原因即可，重点是下一张的 virtual。",
      "guess": "先猜：<code>Car* p = new SUV;</code> 之后 <code>p-&gt;drive()</code> 调的是哪个版本？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nclass Car {\npublic:\n    void drive() { cout << \"汽车行驶\" << endl; }     // 注意：不是 virtual\n};\n\nclass SUV : public Car {\npublic:\n    void drive() { cout << \"SUV行驶\" << endl; }\n};\n\nvoid run(Car* p) { p->drive(); }                    // 参数是父类指针\n\nint main() {\n    SUV s;\n    run(&s);            // 汽车行驶：早绑定，只看 Car*\n    Car* p = &s;\n    p->drive();         // 汽车行驶：一样只看静态类型\n}",
      "output": "汽车行驶\n汽车行驶",
      "errors": [],
      "pitfalls": [
        "<b>合法但不符合预期</b>：向上转换（子类 → 父类）编译器允许，因为「子类是一个父类」。",
        "<b>绑定看静态类型</b>：编译时只有 <code>Car*</code> 的信息，就按 <code>Car::drive</code> 生成调用。",
        "<b>不是覆盖失败</b>：子类只是「同名隐藏」，并没有覆盖父类函数（父类那个不是虚函数）。",
        "<b>解决靠 virtual</b>：在父类函数前加 virtual，绑定才会推迟到运行时。"
      ],
      "concl": "父类指针可以指向子类对象，但普通函数按静态类型早绑定，所以调到的还是父类版本。",
      "terms": "「向上类型转换（upcasting）」；「静态类型 / 动态类型」——指针声明时的类型 / 它实际指向的类型。",
      "tags": [
        "向上转换",
        "多态"
      ],
      "board": "",
      "quizIds": [
        "d6s03",
        "d6s04",
        "d6c04"
      ]
    },
    {
      "id": "d6c65",
      "num": 65,
      "title": "虚函数：加一个 virtual，调用就跟着对象走",
      "pain": "<b>没有它会怎样</b>：上一张卡的代码明明写了子类版本，运行却全是「汽车行驶」。<b>在父类函数前加 virtual</b>，编译器就改成「运行时看对象的真实类型再挑函数」——像<b>快递按收件人实际住址派送，而不是按寄件单上写的城市</b>。",
      "analogy": "快递按收件人实际住址派送，不按寄件单上的城市",
      "only": "<b>分量：必背</b> · virtual 写在哪、重写要满足什么，面试和写代码都要张口就来。",
      "guess": "先猜：父类声明了 virtual，子类重写时还要不要再写一次 virtual？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nclass Car {\npublic:\n    virtual void drive() { cout << \"汽车行驶\" << endl; }   // 只在这里写 virtual\n    virtual ~Car() {}                                    // 多态基类要虚析构\n};\n\nclass SUV : public Car {\npublic:\n    void drive() { cout << \"SUV行驶\" << endl; }             // 自动就是虚函数\n};\n\nclass Jeep : public Car {\npublic:\n    void drive() { cout << \"Jeep行驶\" << endl; }\n};\n\nvoid run(Car* p) { p->drive(); }\n\nint main() {\n    SUV s;\n    Jeep j;\n    run(&s);        // SUV行驶：按真实类型\n    run(&j);        // Jeep行驶\n}",
      "output": "SUV行驶\nJeep行驶",
      "errors": [
        "子类写成 <code>void drive() const</code>，签名差一个 const，加了 <code>override</code> 时 g++ 直接报：<code>error: 'void SUV::drive() const' marked 'override', but does not override</code>。改法：把 const 去掉，和父类一字不差。",
        "父类忘了写 <code>virtual</code>：编译器<b>不报错</b>，运行时照旧调父类版本。改法：只在父类函数前补一个 virtual，子类不用再写。"
      ],
      "pitfalls": [
        "<b>父类写一次就够</b>：基类声明 virtual 后，派生类同名同参函数自动是虚函数，不必再写。",
        "<b>签名必须一致</b>：返回值、名字、参数都要和父类虚函数对得上，否则只是隐藏，不是重写。",
        "<b>构造函数不能是虚函数</b>：对象还没建好，vptr 还没设，没法按动态类型调。",
        "<b>虚函数有成本</b>：每次调用多一次查表，对象里多一个 vptr；不需要动态绑定的函数别乱加。"
      ],
      "concl": "在父类函数前加 virtual，派生类重写后，通过父类指针调用就会按对象真实类型走。",
      "terms": "「虚函数（virtual function）」；子类重定义虚函数叫「重写 / 覆盖（override）」。",
      "tags": [
        "virtual",
        "多态"
      ],
      "board": "",
      "quizIds": [
        "d6s05",
        "d6j01",
        "d6s24",
        "d6f06"
      ]
    },
    {
      "id": "d6c66",
      "num": 66,
      "title": "虚函数的原理：对象里藏了一个 vptr",
      "pain": "<b>没有它会怎样</b>：知道加 virtual 能用，但不知道为什么「对象一多就多 8 字节」，也不知道为什么构造函数里调虚函数不生效。<b>编译器给每个含虚函数的类造一张函数地址表（vtable），再在对象里塞一个指针（vptr）指向它</b>——像<b>每台机器里揣一张自己的操作手册目录</b>。",
      "analogy": "每台机器里揣一张自己的操作手册目录",
      "only": "<b>分量：理解</b> · vptr / vtable 是原理题，能用两句话讲清「对象里多一个指针」就够了。",
      "guess": "先猜：一个只有虚函数、没有数据成员的类，<code>sizeof</code> 是 1 还是 8？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nclass Base {\npublic:\n    virtual void f() { cout << \"Base::f\" << endl; }\n    virtual void g() { cout << \"Base::g\" << endl; }\n};\n\nclass Der : public Base {\npublic:\n    void f() { cout << \"Der::f\" << endl; }      // 只重写 f，g 沿用父类\n};\n\nint main() {\n    Base b;\n    Der d;\n    cout << sizeof(Base) << \" \" << sizeof(Der) << endl;   // 8 8：只有一个 vptr\n    Base* p = &d;\n    p->f();     // Der::f：查表拿到子类地址\n    p->g();     // Base::g：表里这一格还是父类的\n}",
      "output": "8 8\nDer::f\nBase::g",
      "errors": [],
      "pitfalls": [
        "<b>vptr 在构造时设置</b>：先指向父类的表，进子类构造体前才改成子类的表，所以构造函数里调虚函数只会走父类版本。",
        "<b>表是每个类一张，不是每个对象一张</b>：对象里只多一个指针。",
        "<b>64 位下这个指针 8 字节</b>：所以空类 1 字节，带虚函数的空类 8 字节。",
        "<b>性能开销很小</b>：一次间接寻址，真正贵的是它让内联变难。"
      ],
      "concl": "含虚函数的类有一张 vtable，对象里有一个 vptr 指向它；调用虚函数就是「取 vptr → 查表 → 跳转」。",
      "terms": "「虚函数表（vtable）」；「虚表指针（vptr / vfptr）」；这套机制叫「动态绑定」。",
      "tags": [
        "虚函数",
        "vtable"
      ],
      "board": "",
      "quizIds": [
        "d6s06",
        "d6s07"
      ]
    },
    {
      "id": "d6c67",
      "num": 67,
      "title": "重载、重定义、重写：三个词别再混",
      "pain": "<b>没有它会怎样</b>：面试一问「重载和重写什么区别」就卡壳，写代码时把「隐藏」当成「覆盖」，父类那组重载莫名调不到。<b>三者的区别只在两件事：在不在同一个作用域、父类那个函数是不是 virtual</b>——像<b>同一家店的不同窗口 / 隔壁分店的同名窗口</b>。",
      "analogy": "同一家店的不同窗口 vs 隔壁分店的同名窗口",
      "only": "<b>分量：必背</b> · 重载 / 重定义 / 重写是面试第一问，三个定义要能一字不差地说出来。",
      "guess": "先猜：子类写了同名非虚函数，父类那组同名重载还能直接调吗？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nclass A {\npublic:\n    void f()      { cout << \"A::f()\" << endl; }      // 重载：同作用域\n    void f(int)   { cout << \"A::f(int)\" << endl; }\n    virtual void g() { cout << \"A::g\" << endl; }      // 虚函数\n};\n\nclass B : public A {\npublic:\n    void f() { cout << \"B::f()\" << endl; }            // 重定义：隐藏父类全部 f\n    void g() { cout << \"B::g\" << endl; }              // 重写：签名一致\n};\n\nint main() {\n    B b;\n    b.f();          // B::f()\n    b.A::f(1);      // A::f(int)：加作用域才够得着\n    A* p = &b;\n    p->g();         // B::g：虚函数按真实类型\n}",
      "output": "B::f()\nA::f(int)\nB::g",
      "errors": [
        "子类一重定义同名函数，父类那组重载就被遮住，<code>b.f(1)</code> 直接编译失败：<code>error: no matching function for call to 'B::f(int)'</code>，后面提示 <code>candidate 1: 'void B::f()'</code>。改法：写 <code>b.A::f(1)</code>，或在子类里加 <code>using A::f;</code>。"
      ],
      "pitfalls": [
        "<b>重载</b>：同一作用域、同名、参数不同；和返回值无关，<code>const</code> 只有在参数是引用时才算重载条件。",
        "<b>重定义（隐藏）</b>：有继承、同名非虚函数，参数不一样也算；一写就把父类同名的一组全遮住。",
        "<b>重写（覆盖）</b>：有继承、父类是 virtual、签名完全一致，才会动态绑定。",
        "<b>签名差一点就成了隐藏</b>：少写一个 const、参数类型不同，都不算重写，运行时还走父类版本。"
      ],
      "concl": "重载看同作用域参数，重定义看同名非虚，重写要 virtual + 签名一致；只有重写是动态绑定。",
      "terms": "「overload / redefinition(hiding) / override」；C++11 可以用 <code>override</code> 关键字让编译器帮你检查签名。",
      "tags": [
        "重写",
        "重载",
        "重定义"
      ],
      "board": "",
      "quizIds": [
        "d6s08",
        "d6s09",
        "d6j06"
      ]
    },
    {
      "id": "d6c68",
      "num": 68,
      "title": "纯虚函数与抽象类：只给接口，不给实现",
      "pain": "<b>没有它会怎样</b>：基类的 <code>area()</code> 对「形状」本身根本没意义，可只要它有函数体，别人就能 <code>new Shape</code>，得到一个算不出面积的怪东西。<b>写成 <code>= 0</code> 的纯虚函数</b>就让这个类变成抽象类，禁止实例化——像<b>只挂菜单不营业的招牌店，只能按招牌去找具体门店</b>。",
      "analogy": "只挂菜单不营业的招牌店，只能按招牌找具体门店",
      "only": "<b>分量：必背</b> · <code>= 0</code> 的写法、抽象类不能实例化、子类要全实现，这三条必须会。",
      "guess": "先猜：子类只实现了一部分纯虚函数，它能不能创建对象？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nclass Shape {\npublic:\n    virtual double area() const = 0;        // 纯虚：只有声明\n    virtual ~Shape() {}\n};\n\nclass Sq : public Shape {\n    double s;\npublic:\n    Sq(double s) : s(s) {}\n    double area() const { return s * s; }   // 必须实现，否则 Sq 也是抽象类\n};\n\nint main() {\n    // Shape sh;                            // 编译报错：抽象类不能实例化\n    Shape* p = new Sq(3);\n    cout << p->area() << endl;              // 9\n    delete p;\n}",
      "output": "9",
      "errors": [
        "直接创建抽象类对象：<code>error: cannot declare variable 's' to be of abstract type 'Shape'</code>，下面会列出没实现的 <code>virtual double Shape::area() const</code>。改法：不要实例化基类，改用 <code>Shape*</code> 或引用。",
        "子类漏实现纯虚函数：<code>error: cannot declare variable 's' to be of abstract type 'Sq'</code>，同样提示 <code>Sq</code> 里还纯着哪个函数。改法：把漏掉的纯虚函数补实现。"
      ],
      "pitfalls": [
        "<b>抽象类不能建对象</b>：只要类里有一个纯虚函数，它就是抽象类，<code>Shape s;</code> 编译不过。",
        "<b>子类必须全部实现</b>：漏一个，子类自己也是抽象类，同样不能实例化。",
        "<b>抽象类可以有普通成员</b>：数据、普通函数、构造函数都能有，只是不能直接实例化。",
        "<b>纯虚函数也能有函数体</b>：可以在类外定义，供子类用 <code>Shape::area()</code> 调用。"
      ],
      "concl": "纯虚函数用 <code>= 0</code> 声明，含纯虚函数的类成为抽象类，不能实例化，子类必须全部实现。",
      "terms": "「纯虚函数（pure virtual function）」；「抽象类（abstract class）」；纯虚函数的类外实现叫「纯虚定义」。",
      "tags": [
        "纯虚函数",
        "抽象类"
      ],
      "board": "",
      "quizIds": [
        "d6s10",
        "d6f01",
        "d6j07"
      ]
    },
    {
      "id": "d6c69",
      "num": 69,
      "title": "接口类：全是纯虚函数，还能多继承",
      "pain": "<b>没有它会怎样</b>：想让一个类既能开又能飞，单继承只能选一条线。C++ 没有 <code>interface</code> 关键字，但<b>全是纯虚函数、没有数据成员的类就是接口</b>，多继承几个接口不会有二义性——像<b>一个人可以同时考驾照和飞行执照，两张证互不冲突</b>。",
      "analogy": "一个人可以同时考驾照和飞行执照，两张证不冲突",
      "only": "<b>分量：了解</b> · 知道「全是纯虚函数 + 没有数据成员」就是接口，多继承接口是安全的即可。",
      "guess": "先猜：继承两个「只有纯虚函数」的接口，会出现菱形继承那种重复数据吗？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nclass IDrive { public: virtual void drive() = 0; virtual ~IDrive() {} };\nclass IFly   { public: virtual void fly() = 0;   virtual ~IFly() {} };\n\nclass Car : public IDrive {\npublic:\n    void drive() { cout << \"开\" << endl; }\n};\n\nclass Plane : public IDrive, public IFly {   // 同时实现两个接口\npublic:\n    void drive() { cout << \"开\" << endl; }\n    void fly()   { cout << \"飞\" << endl; }\n};\n\nint main() {\n    Plane p;\n    p.drive();      // 开\n    p.fly();        // 飞\n}",
      "output": "开\n飞",
      "errors": [],
      "pitfalls": [
        "<b>接口里不放数据</b>：只有纯虚函数（和虚析构），所以多继承不会带来数据重复。",
        "<b>接口不实现功能</b>：它只声明「要有什么能力」，怎么做得子类自己写。",
        "<b>虚析构别忘了</b>：通过接口指针 delete 对象，接口的析构必须是 virtual。",
        "<b>业务里很常见</b>：回调、插件、依赖倒置基本都靠这层接口。"
      ],
      "concl": "全是纯虚函数、无数据成员的类是接口；多继承接口不会二义，是工程里最安全的多继承用法。",
      "terms": "「接口类（interface class）」；C++ 里没有 interface 关键字，靠纯虚函数模拟。",
      "tags": [
        "接口",
        "多继承"
      ],
      "board": "",
      "quizIds": [
        "d6s11",
        "d6j02"
      ]
    },
    {
      "id": "d6c70",
      "num": 70,
      "title": "模板方法：父类定流程，子类填步骤",
      "pain": "<b>没有它会怎样</b>：泡咖啡和泡茶流程一模一样（烧水 → 冲泡 → 倒杯 → 加料），只有每步细节不同；直接写两遍就有一堆重复。<b>把流程写在父类的普通函数里，把变的那几步写成纯虚函数</b>——像<b>同一张菜谱，只留几个空格让各家填</b>。",
      "analogy": "同一张菜谱，只留几个空格让各家填",
      "only": "<b>分量：了解</b> · 模板方法是设计模式，看懂「父类定流程、子类填步骤」即可，不必默写。",
      "guess": "先猜：<code>makeDrink()</code> 需要是虚函数吗？调用它时靠什么走到子类的步骤？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nclass Drink {\npublic:\n    void make() {                 // 流程固定，不需要虚\n        boil();                   // 每一步都按真实类型走\n        brew();\n        pour();\n    }\nprotected:\n    virtual void boil() = 0;\n    virtual void brew() = 0;\n    virtual void pour() = 0;\n    virtual ~Drink() {}\n};\n\nclass Coffee : public Drink {\nprotected:\n    void boil() { cout << \"煮水\" << endl; }\n    void brew() { cout << \"冲咖啡\" << endl; }\n    void pour() { cout << \"倒进杯子\" << endl; }\n};\n\nint main() {\n    Coffee c;\n    c.make();\n}",
      "output": "煮水\n冲咖啡\n倒进杯子",
      "errors": [],
      "pitfalls": [
        "<b>流程函数不必是虚函数</b>：<code>make()</code> 里调的是虚函数，自然会走到子类实现。",
        "<b>步骤函数是 protected</b>：外部不该直接调单步，只暴露整条流程。",
        "<b>顺序固定在父类</b>：子类只换步骤内容，不能改顺序，这正是模板方法的价值。",
        "<b>和策略模式别混</b>：模板方法用继承定流程，策略模式用组合换算法。"
      ],
      "concl": "模板方法把不变的流程放在父类普通函数里，可变步骤留成纯虚函数，由子类填。",
      "terms": "「模板方法模式（template method pattern）」；父类那个固定流程的函数叫「模板函数」。",
      "tags": [
        "模板方法",
        "多态"
      ],
      "board": "",
      "quizIds": [
        "d6s12",
        "d6c01"
      ]
    },
    {
      "id": "d6c71",
      "num": 71,
      "title": "虚析构：用父类指针 delete 子类，别只析构一半",
      "pain": "<b>没有它会怎样</b>：<code>Car* p = new SUV; delete p;</code> 只跑了 <code>Car</code> 的析构，<code>SUV</code> 里 new 出来的资源全泄漏。<b>父类析构写成 virtual</b> 之后，delete 会先析构子类再析构父类——像<b>退租要先清空自己的柜子，再交钥匙</b>。",
      "analogy": "退租先清空自己的柜子，再交钥匙",
      "only": "<b>分量：必背</b> · 多态基类必须 virtual 析构，写漏就是内存泄漏，要形成条件反射。",
      "guess": "先猜：父类析构不加 virtual，用父类指针 delete 子类对象时，子类析构会被调用吗？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nclass Car {\npublic:\n    virtual ~Car() { cout << \"Car析构\" << endl; }        // 关键这一个 virtual\n};\n\nclass SUV : public Car {\npublic:\n    ~SUV() { cout << \"SUV析构\" << endl; }\n};\n\nint main() {\n    Car* p = new SUV();\n    delete p;        // SUV析构 → Car析构\n}",
      "output": "SUV析构\nCar析构",
      "errors": [
        "不加 virtual 时编译器<b>不报错也不警告</b>，程序正常退出，只是子类析构没执行、资源泄漏——这比编译错误更难查。改法：多态基类一律写 <code>virtual ~Car()</code>。"
      ],
      "pitfalls": [
        "<b>不加 virtual 只析构父类</b>：子类那部分成员不析构，里面 new 的内存直接泄漏。",
        "<b>只有多态基类才需要</b>：类不打算被继承、或不会用父类指针 delete，就不必加。",
        "<b>子类析构自动是虚的</b>：父类析构 virtual，子类析构不用再写 virtual。",
        "<b>顺序</b>：先子类、后父类，和构造相反。"
      ],
      "concl": "只要类会被继承、并可能通过父类指针 delete，父类析构就必须是 virtual。",
      "terms": "「虚析构函数（virtual destructor）」；这套规则常和「多态基类」一起讲。",
      "tags": [
        "虚析构",
        "多态"
      ],
      "board": "",
      "quizIds": [
        "d6s13",
        "d6j03",
        "d6s25",
        "d6f07",
        "d6c05"
      ]
    },
    {
      "id": "d6c72",
      "num": 72,
      "title": "纯虚析构：既当抽象类，又能正常销毁",
      "pain": "<b>没有它会怎样</b>：想让基类变成抽象类（不许实例化），但它只有构造函数、没有别的纯虚函数，怎么办？<b>把析构声明成 <code>= 0</code></b> 就行，但纯虚析构<b>必须给函数体</b>，否则子类销毁时调不到父类析构——像<b>招牌店不营业，但仓库还得留人收货</b>。",
      "analogy": "招牌店不营业，但仓库还得留人收货",
      "only": "<b>分量：了解</b> · 纯虚析构是冷门语法，记住「<code>= 0</code> 也必须给函数体」这一个坑就行。",
      "guess": "先猜：纯虚析构函数能不能有函数体？没有会怎样？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nclass Car {\npublic:\n    virtual ~Car() = 0;          // 纯虚：让 Car 成为抽象类\n};\nCar::~Car() { cout << \"Car析构\" << endl; }   // 但必须实现\n\nclass SUV : public Car {\npublic:\n    ~SUV() { cout << \"SUV析构\" << endl; }\n};\n\nint main() {\n    // Car c;                    // 编译报错：抽象类\n    Car* p = new SUV();\n    delete p;                    // SUV析构 → Car析构\n}",
      "output": "SUV析构\nCar析构",
      "errors": [
        "只写 <code>virtual ~Car() = 0;</code> 却不给函数体，编译能过，链接阶段报：<code>undefined reference to 'Car::~Car()'</code>。改法：在类外补 <code>Car::~Car() { }</code>。"
      ],
      "pitfalls": [
        "<b>必须有函数体</b>：子类析构最后一定会调用父类析构，没有定义就链接失败。",
        "<b>唯一作用是变抽象</b>：和普通虚析构比，区别只是「这个类不能实例化」。",
        "<b>类外定义</b>：<code>= 0</code> 写在类里，函数体写在类外 <code>Car::~Car()</code>。",
        "<b>别为了抽象乱用</b>：有别的纯虚函数时，普通虚析构就够了。"
      ],
      "concl": "纯虚析构 <code>= 0</code> 能让基类成为抽象类，但必须提供函数体，否则子类销毁时链接不到。",
      "terms": "「纯虚析构函数（pure virtual destructor）」；它和纯虚成员函数的区别是必须实现。",
      "tags": [
        "纯虚析构",
        "抽象类"
      ],
      "board": "",
      "quizIds": [
        "d6s14",
        "d6f02"
      ]
    },
    {
      "id": "d6c73",
      "num": 73,
      "title": "为什么需要异常：返回值会被忽略，异常不会",
      "pain": "<b>没有它会怎样</b>：<code>divide(10, 0)</code> 返回 <code>-1</code> 表示出错，可调用方经常忘了判断，接着拿 -1 去乘 100，算出个像模像样的错数。<b>异常</b>让「出错」无法被悄悄忽略——像<b>火警一响全楼都听得见，不用你挨个去问「着了吗」</b>。",
      "analogy": "火警一响全楼都听得见，不用挨个去问",
      "only": "<b>分量：理解</b> · 理解「返回值能被忽略、异常不能」这个动机即可，写法在下一张。",
      "guess": "先猜：<code>throw</code> 之后，<code>throw</code> 后面的语句还会执行吗？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nint divide(int a, int b) {\n    if (b == 0) throw -1;       // 出错就抛，不返回\n    return a / b;\n}\n\nint main() {\n    int r;\n    try {\n        r = divide(10, 0);      // 这里直接跳到 catch\n    } catch (int e) {\n        r = 0;\n        cout << \"捕获异常值 \" << e << endl;\n    }\n    cout << \"结果 \" << r << endl;   // 不会拿脏数据继续算\n}",
      "output": "捕获异常值 -1\n结果 0",
      "errors": [],
      "pitfalls": [
        "<b>throw 处函数立刻结束</b>：后面的 <code>return</code> 不会执行，控制权交给匹配的 catch。",
        "<b>异常不可忽略</b>：没人接就直接 terminate 终止程序，逼你处理。",
        "<b>能跨层传递</b>：底层 throw，上层 catch，中间函数不用层层判返回值。",
        "<b>异常携带信息</b>：可以抛对象，把出错原因、参数都带上去，比 -1 强得多。"
      ],
      "concl": "返回值可能被忽略，异常不会：它中断正常流程、直接跳到能处理的地方，还能带上具体信息。",
      "terms": "「异常（exception）」；「栈展开（stack unwinding）」；catch 不到时调用的终止函数叫 <code>terminate</code>。",
      "tags": [
        "异常",
        "throw"
      ],
      "board": "",
      "quizIds": [
        "d6s15",
        "d6s16"
      ]
    },
    {
      "id": "d6c74",
      "num": 74,
      "title": "throw / try / catch：异常的基本三步",
      "pain": "<b>没有它会怎样</b>：只知道 <code>throw</code> 不知道 <code>catch</code>，程序一出错就整个崩掉，什么提示都没有。<b>三步是配套的</b>：可能出错的代码放进 <code>try</code>，出错处 <code>throw</code>，处理写在 <code>catch</code>——像<b>把危险动作圈进围栏，掉出来有垫子接着</b>。",
      "analogy": "把危险动作圈进围栏，掉出来有垫子接着",
      "only": "<b>分量：必背</b> · try / throw / catch 三件套的写法必须能默写出来。",
      "guess": "先猜：<code>try</code> 里一旦抛异常，<code>try</code> 中剩下的语句还会执行吗？",
      "codeMin": "",
      "codeFull": "#include <iostream>\n#include <string>\nusing namespace std;\n\nint divide(int a, int b) {\n    if (b == 0) throw string(\"除数不能为 0\");   // 抛一个带说明的对象\n    return a / b;\n}\n\nint main() {\n    try {\n        cout << divide(10, 2) << endl;      // 5\n        cout << divide(1, 0) << endl;       // 抛异常，这行后面不执行\n    } catch (string& e) {                   // 引用接，避免多拷贝\n        cout << \"异常：\" << e << endl;\n    }\n    cout << \"继续\" << endl;                  // catch 之后照常往下走\n}",
      "output": "5\n异常：除数不能为 0\n继续",
      "errors": [
        "抛出去没人接：程序直接打印 <code>terminate called after throwing an instance of 'int'</code> 然后 abort。改法：保证调用链上有一层 <code>try/catch</code> 接住它。"
      ],
      "pitfalls": [
        "<b>try 里中断</b>：抛异常后，try 块剩下的语句全部跳过，直接去 catch。",
        "<b>catch 按顺序匹配</b>：从上往下找第一个类型匹配的，所以具体类型写前面、<code>...</code> 写最后。",
        "<b><code>catch(...)</code> 收尾</b>：兜住所有没被前面接住的类型，但拿不到异常值。",
        "<b>catch 参数用引用</b>：<code>catch (T&amp; e)</code> 省一次拷贝，也能接住派生类异常。"
      ],
      "concl": "可能出错的代码放 try，出错处 throw，处理写 catch；catch 之后程序继续正常执行。",
      "terms": "「try 块」「处理程序（handler）」；<code>catch(...)</code> 叫「捕获所有异常」。",
      "tags": [
        "异常",
        "try-catch"
      ],
      "board": "",
      "quizIds": [
        "d6s17",
        "d6f03"
      ]
    },
    {
      "id": "d6c75",
      "num": 75,
      "title": "严格类型匹配：throw 什么，就得 catch 什么",
      "pain": "<b>没有它会怎样</b>：以为 <code>throw 'c'</code> 会被 <code>catch(int)</code> 接住（毕竟 char 能隐式转 int），结果直接漏到 <code>catch(...)</code> 或者让程序崩掉。<b>异常的匹配不做隐式转换</b>——像<b>快递按单号取件，差一位都不给</b>。",
      "analogy": "快递按单号取件，差一位都不给",
      "only": "<b>分量：理解</b> · 记住「异常不做隐式转换」和「catch 从具体到宽泛」，够用了。",
      "guess": "先猜：抛出 <code>'c'</code>，能被 <code>catch(int)</code> 接住吗？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nvoid test(int k) {\n    if (k == 1) throw 1;         // int\n    if (k == 2) throw 'c';       // char\n    throw 3.5;                   // double\n}\n\nint main() {\n    for (int i = 1; i <= 2; i++) {\n        try {\n            test(i);\n        } catch (char c) {\n            cout << \"char: \" << c << endl;\n        } catch (int e) {\n            cout << \"int: \" << e << endl;\n        }\n    }\n}",
      "output": "int: 1\nchar: c",
      "errors": [
        "只写了 <code>catch (int)</code> 却抛 <code>'c'</code>：char 不会被转成 int，程序直接 <code>terminate called after throwing an instance of 'char'</code>。改法：补 <code>catch (char)</code>，或最后用 <code>catch (...)</code> 兜底。"
      ],
      "pitfalls": [
        "<b>只有三种允许的转换</b>：非 const → const、派生类 → 基类（按值或引用）、数组/函数 → 指针；char → int 不在其中。",
        "<b>顺序有影响</b>：派生类异常要写在基类前面，否则会被基类的 catch 先接走。",
        "<b>指针异常要小心</b>：<code>throw &amp;obj</code> 和 <code>catch(Obj*)</code> 是精确匹配，但栈对象出了作用域就悬空。",
        "<b>拿不准就抛对象</b>：抛 <code>std::exception</code> 派生类，用基类引用接，最稳。"
      ],
      "concl": "异常按类型严格匹配，不做 char→int 这类隐式转换；catch 顺序要从具体到宽泛。",
      "terms": "「异常的类型匹配」；标准允许的转换只有 cv 限定、派生到基类、数组/函数到指针。",
      "tags": [
        "异常",
        "类型匹配"
      ],
      "board": "",
      "quizIds": [
        "d6s18",
        "d6j04",
        "d6f08",
        "d6c06"
      ]
    },
    {
      "id": "d6c76",
      "num": 76,
      "title": "栈解旋：抛异常时，局部对象会被自动销毁",
      "pain": "<b>没有它会怎样</b>：以为 <code>throw</code> 一抛，栈上那些已经构造好的对象就没人管了，析构不执行、资源泄漏。<b>实际上从 try 到 throw 之间构造的对象都会被析构</b>，顺序与构造相反——像<b>紧急疏散时，从最外层房间开始逐个锁门</b>。",
      "analogy": "紧急疏散时，从最外层房间开始逐个锁门",
      "only": "<b>分量：理解</b> · 栈解旋的逆序析构要能说出来，这是 RAII 的底子。",
      "guess": "先猜：<code>ob1</code>、<code>ob2</code> 都已经构造，抛异常后它们的析构顺序是 1→2 还是 2→1？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nstruct Demo {\n    int a;\n    Demo(int a) : a(a) { cout << \"构造 \" << a << endl; }\n    ~Demo() { cout << \"析构 \" << a << endl; }\n};\n\nvoid run() {\n    try {\n        Demo x(1);\n        Demo y(2);\n        throw 1;                 // 从这里开始栈解旋\n    } catch (int) {\n        cout << \"catch\" << endl;\n    }\n}\n\nint main() { run(); }",
      "output": "构造 1\n构造 2\n析构 2\n析构 1\ncatch",
      "errors": [],
      "pitfalls": [
        "<b>只解旋已构造的</b>：throw 之后才构造的对象不存在，也就没有析构。",
        "<b>顺序与构造相反</b>：后构造的先析构，和正常离开作用域一样。",
        "<b>这是 RAII 的基础</b>：锁、文件、内存能靠析构自动释放，异常路径上也不会漏。",
        "<b>析构里别再抛</b>：栈解旋过程中再抛异常会直接 terminate。"
      ],
      "concl": "throw 会触发栈解旋：try 到 throw 之间已构造的局部对象按逆序自动析构，然后才进 catch。",
      "terms": "「栈解旋 / 栈展开（stack unwinding）」；配合析构自动释放资源的做法叫 RAII。",
      "tags": [
        "异常",
        "栈解旋",
        "析构"
      ],
      "board": "",
      "quizIds": [
        "d6s19",
        "d6f04"
      ]
    },
    {
      "id": "d6c77",
      "num": 77,
      "title": "异常对象怎么接：值、指针，还是引用",
      "pain": "<b>没有它会怎样</b>：<code>catch (MyException e)</code> 按值接，会多拷贝一份；用 <code>catch (MyException*)</code> 接 <code>throw new ...</code>，忘了 delete 就泄漏。<b>推荐用引用接</b>——像<b>取快递用取件码，不复制一份包裹，也不用自己保管箱子</b>。",
      "analogy": "取快递用取件码，不复制包裹也不用保管箱子",
      "only": "<b>分量：必背</b> · 接异常用 <code>catch (T&amp; e)</code>；按值 / 指针 / 引用各有什么问题，面试常问。",
      "guess": "先猜：按值接异常和按引用接，各会构造 / 拷贝几次？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nclass MyEx {\npublic:\n    MyEx() { cout << \"构造\" << endl; }\n    MyEx(const MyEx&) { cout << \"拷贝\" << endl; }\n    ~MyEx() { cout << \"析构\" << endl; }\n};\n\nvoid byValue() {\n    try { throw MyEx(); } catch (MyEx e) { cout << \"按值接\" << endl; }\n}\n\nvoid byRef() {\n    try { throw MyEx(); } catch (MyEx& e) { cout << \"按引用接\" << endl; }\n}\n\nint main() {\n    byValue();\n    byRef();\n}",
      "output": "构造\n拷贝\n按值接\n析构\n析构\n构造\n按引用接\n析构",
      "errors": [],
      "pitfalls": [
        "<b>按值多一次拷贝</b>：而且如果异常类有派生关系，按值接还会「切片」，丢掉子类信息。",
        "<b>指针要手动 delete</b>：<code>throw new T</code> 只有在 catch 里 delete 才不泄漏。",
        "<b>引用最省事</b>：不拷贝、不用释放，还能配合多态接派生类异常。",
        "<b>throw 的临时对象</b>：异常对象由编译器保管到 catch 结束，所以引用接是安全的。"
      ],
      "concl": "接异常优先用 <code>catch (T&amp; e)</code>：不拷贝、不泄漏、还能接派生类；按值会多拷贝并可能切片。",
      "terms": "「异常对象生命周期」；按值接派生类异常丢失子类部分的现象叫「对象切片（slicing）」。",
      "tags": [
        "异常",
        "引用",
        "拷贝"
      ],
      "board": "",
      "quizIds": [
        "d6s20",
        "d6c02"
      ]
    },
    {
      "id": "d6c78",
      "num": 78,
      "title": "异常的多态：一个 catch 接住一族异常",
      "pain": "<b>没有它会怎样</b>：空指针、下标越界、参数非法各写一个 catch，加一种异常就要改一次 catch 列表。<b>让它们都继承同一个异常基类，catch 写基类引用</b>，就能一处接住整族——像<b>一个总服务台，分机不同但都拨同一个号码</b>。",
      "analogy": "一个总服务台，分机不同但都拨同一个号码",
      "only": "<b>分量：理解</b> · 知道「异常继承体系 + 基类引用 + 虚函数」这套组合即可。",
      "guess": "先猜：<code>catch (Base&amp; e)</code> 接住子类异常后，<code>e.print()</code> 走的是子类实现吗？",
      "codeMin": "",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nclass BaseEx {\npublic:\n    virtual void print() { cout << \"base\" << endl; }\n    virtual ~BaseEx() {}\n};\n\nclass NullEx : public BaseEx {\npublic:\n    void print() { cout << \"null pointer exception!\" << endl; }\n};\n\nclass RangeEx : public BaseEx {\npublic:\n    void print() { cout << \"index out of range!\" << endl; }\n};\n\nvoid run(int k) {\n    try {\n        if (k == 1) throw NullEx();\n        throw RangeEx();\n    } catch (BaseEx& e) {        // 一个 catch 收一族\n        e.print();               // 虚函数，按真实类型走\n    }\n}\n\nint main() {\n    run(1);\n    run(2);\n}",
      "output": "null pointer exception!\nindex out of range!",
      "errors": [],
      "pitfalls": [
        "<b>必须用引用接</b>：<code>catch (BaseEx e)</code> 会切片，虚函数也救不回来。",
        "<b>基类要有虚函数</b>：<code>print()</code> 不是 virtual，<code>e.print()</code> 就只会打 base。",
        "<b>派生类 catch 放前面</b>：先写基类会把所有子类异常都吞掉。",
        "<b>这正是标准库的做法</b>：所有标准异常都派生自 <code>exception</code>。"
      ],
      "concl": "把异常组织成继承体系，用 <code>catch (Base&amp;)</code> + 虚函数，一个 catch 就能处理整族异常。",
      "terms": "「异常多态」；标准异常体系的根类叫 <code>std::exception</code>。",
      "tags": [
        "异常",
        "多态"
      ],
      "board": "",
      "quizIds": [
        "d6s21",
        "d6j05"
      ]
    },
    {
      "id": "d6c79",
      "num": 79,
      "title": "标准异常库：exception 与 what()",
      "pain": "<b>没有它会怎样</b>：每类错误都自己造异常类型，调用方根本不知道要 catch 什么。<b>标准库已经给了 <code>std::exception</code> 这一族</b>：<code>out_of_range</code>、<code>invalid_argument</code> 等都继承自它，统一用 <code>what()</code> 取说明——像<b>所有部门统一用一张报修单，写法不同但格式一致</b>。",
      "analogy": "所有部门统一用一张报修单，格式一致",
      "only": "<b>分量：了解</b> · 会用 <code>catch (exception&amp;)</code> 和 <code>what()</code> 就行，不必背整棵继承树。",
      "guess": "先猜：<code>exception&amp; e</code> 能接住 <code>out_of_range</code> 吗？<code>e.what()</code> 返回什么类型？",
      "codeMin": "",
      "codeFull": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nint main() {\n    try {\n        throw out_of_range(\"年龄不在规定范围内\");\n    } catch (exception& e) {          // 标准异常都继承 exception\n        cout << e.what() << endl;     // 返回 const char*\n    }\n}",
      "output": "年龄不在规定范围内",
      "errors": [
        "忘了 <code>#include &lt;stdexcept&gt;</code>：<code>error: 'out_of_range' was not declared in this scope</code>。改法：补上头文件（<code>exception</code> 本身在 <code>&lt;exception&gt;</code>）。"
      ],
      "pitfalls": [
        "<b>要 include &lt;stdexcept&gt;</b>：<code>out_of_range</code>、<code>invalid_argument</code> 在这里，<code>exception</code> 在 <code>&lt;exception&gt;</code>。",
        "<b>what() 返回 const char*</b>：要转 <code>string</code> 就 <code>string(e.what())</code>。",
        "<b>logic_error 与 runtime_error</b>：前者是「代码写错了」，后者是「运行时才会遇到」，各自还有子类。",
        "<b>catch 用基类引用</b>：一处接住所有标准异常，靠虚函数拿到具体说明。"
      ],
      "concl": "标准异常都派生自 <code>std::exception</code>，用 <code>catch (exception&amp; e)</code> + <code>e.what()</code> 统一取说明。",
      "terms": "「标准异常类体系」；<code>what()</code> 是虚函数，返回 <code>const char*</code>。",
      "tags": [
        "标准异常",
        "exception"
      ],
      "board": "",
      "quizIds": [
        "d6s22",
        "d6f05"
      ]
    },
    {
      "id": "d6c80",
      "num": 80,
      "title": "自定义异常类：继承 exception，重写 what()",
      "pain": "<b>没有它会怎样</b>：标准库的异常只带一个字符串，想附带错误码、行号就得自己造。可如果随便抛一个 <code>int</code>，别人又不知道它是什么。<b>自己的异常类继承 <code>exception</code> 并重写 <code>what()</code></b>——像<b>在统一的报修单上加一栏自己的备注</b>。",
      "analogy": "在统一的报修单上加一栏自己的备注",
      "only": "<b>分量：理解</b> · 会写「继承 exception + string 存消息 + 重写 what()」的骨架即可。",
      "guess": "先猜：重写 <code>what()</code> 时函数签名必须写成什么样？",
      "codeMin": "",
      "codeFull": "#include <iostream>\n#include <string>\n#include <exception>\nusing namespace std;\n\nclass MyRangeEx : public exception {\n    string msg;\npublic:\n    MyRangeEx(const char* m) : msg(m) {}\n    const char* what() const noexcept override {   // 签名必须完全一致\n        return msg.c_str();\n    }\n};\n\nint main() {\n    try {\n        throw MyRangeEx(\"自己定义的异常：年龄不在规定范围内\");\n    } catch (exception& e) {          // 照样能被标准基类接住\n        cout << e.what() << endl;\n    }\n}",
      "output": "自己定义的异常：年龄不在规定范围内",
      "errors": [],
      "pitfalls": [
        "<b>签名不能改</b>：<code>const char* what() const noexcept</code>，少一个 const 就变成隐藏而不是重写。",
        "<b>建议继承 exception</b>：别人一个 <code>catch (exception&amp;)</code> 就能接住你的异常。",
        "<b>成员别用裸指针</b>：用 <code>string</code> 存说明，拷贝构造默认就够，不用自己写三法则。",
        "<b>what() 别抛异常</b>：它标了 noexcept，抛了直接 terminate。"
      ],
      "concl": "自定义异常继承 <code>exception</code>，用 <code>string</code> 存说明，按原签名重写 <code>what() const noexcept</code>。",
      "terms": "「自定义异常类」；<code>override</code> 关键字让编译器帮你检查是否真的重写了虚函数。",
      "tags": [
        "自定义异常",
        "what"
      ],
      "board": "",
      "quizIds": [
        "d6s23",
        "d6c03"
      ]
    }
  ],
  "taskTitle": "Day 6 · 今天动手",
  "taskDesc": "两个任务都在本机跑。任务 1 把「纯虚函数 + 虚函数 + 虚析构」串成一个能多态调用的形状类；任务 2 走一遍「栈解旋 + 自定义异常 + 基类引用接住」。先自己敲，再对预期输出。",
  "tasks": [
    {
      "id": "d6t1",
      "title": "任务 1 · 抽象基类 + 多态调用 + 虚析构",
      "goal": "<b>目标</b>：写一个抽象基类 <code>Shape</code>，两个子类各自实现面积，用父类引用统一调用，最后用父类指针 <code>delete</code>，确认析构被调到。",
      "code": "#include <iostream>\nusing namespace std;\n\nclass Shape {\npublic:\n    virtual double area() const = 0;                  // 纯虚：Shape 是抽象类\n    virtual void name() const { cout << \"shape \"; }\n    virtual ~Shape() { cout << \"~Shape\" << endl; }    // 多态基类必须虚析构\n};\n\nclass Sq : public Shape {\n    double s;\npublic:\n    Sq(double s) : s(s) {}\n    double area() const { return s * s; }\n    void name() const { cout << \"square \"; }\n};\n\nclass Cir : public Shape {\n    double r;\npublic:\n    Cir(double r) : r(r) {}\n    double area() const { return 3.14 * r * r; }\n    void name() const { cout << \"circle \"; }\n};\n\nvoid show(const Shape& p) {        // 父类引用：多态在这里发生\n    p.name();\n    cout << p.area() << endl;\n}\n\nint main() {\n    Sq sq(3);\n    Cir ci(1);\n    show(sq);                      // square 9\n    show(ci);                      // circle 3.14\n    Shape* p = new Sq(2);\n    cout << p->area() << endl;     // 4\n    delete p;                      // 子类没写析构，最后走 ~Shape\n}",
      "output": "square 9\ncircle 3.14\n4\n~Shape\n~Shape\n~Shape",
      "tip": "注意 <code>show()</code> 的参数是 <code>const Shape&amp;</code>：传进去的是子类对象，但 <code>name()</code>、<code>area()</code> 都按真实类型走了。末尾三行 <code>~Shape</code> 分别是：<code>delete p</code> 一次，<code>ci</code>、<code>sq</code> 离开作用域各一次。把基类的 <code>virtual</code> 删掉再跑一次，前两行会变成 <code>shape 9</code> 和 <code>shape 3.14</code>——这就是多态存在的理由。"
    },
    {
      "id": "d6t2",
      "title": "任务 2 · 栈解旋 + 自定义异常 + 基类引用接住",
      "goal": "<b>目标</b>：在 <code>try</code> 里构造两个对象后抛自定义异常，看清析构顺序、<code>what()</code> 输出，以及 catch 之后程序继续执行。",
      "code": "#include <iostream>\n#include <string>\n#include <exception>\nusing namespace std;\n\nclass Demo {\npublic:\n    int a;\n    Demo(int a) : a(a) { cout << \"构造 \" << a << endl; }\n    ~Demo() { cout << \"析构 \" << a << endl; }\n};\n\nclass RangeEx : public exception {\n    string msg;\npublic:\n    RangeEx(const char* m) : msg(m) {}\n    const char* what() const noexcept override { return msg.c_str(); }\n};\n\nint main() {\n    try {\n        Demo x(1);\n        Demo y(2);\n        throw RangeEx(\"年龄不在规定范围内\");\n    } catch (exception& e) {\n        cout << e.what() << endl;\n    }\n    cout << \"继续\" << endl;\n}",
      "output": "构造 1\n构造 2\n析构 2\n析构 1\n年龄不在规定范围内\n继续",
      "tip": "两个析构发生在 <code>catch</code> 打印之前，而且顺序是 2 → 1，这就是栈解旋。自定义异常继承 <code>exception</code>，所以 <code>catch (exception&amp;)</code> 能接住它，<code>what()</code> 也由子类重写生效。"
    }
  ],
  "gloss": {
    "title": "今天这 8 个面试题，先用人话过一遍",
    "html": "<h4>今天这 8 个面试题，先用人话过一遍</h4>\n    <p><b>① 重写、重载、重定义怎么区分？</b>重载是同一作用域、同名、参数不同；重定义（隐藏）是有继承、同名非虚函数，参数不同也算，一写就把父类同名那组全遮住；重写（覆盖）必须有继承、父类 <code>virtual</code>、签名完全一致，才会动态绑定。</p>\n    <p><b>② C++ 怎么实现动态绑定？</b>在基类函数前加 <code>virtual</code>，编译器给类建一张虚函数表，对象里放一个 vptr 指向它；调用时顺着 vptr 找到真实类型的函数地址。绑定从编译期推迟到运行期。</p>\n    <p><b>③ 虚函数的原理？</b>vtable 每个类一张，vptr 每个对象一个；构造时 vptr 先指向父类表，进子类构造体前才改成子类表，所以构造函数里调虚函数走的是父类版本。</p>\n    <p><b>④ 什么是抽象基类？有什么特点？</b>含纯虚函数（<code>= 0</code>）的类是抽象类，不能实例化；子类必须实现全部纯虚函数，否则子类自己也是抽象类；抽象类可以有数据成员和普通函数。</p>\n    <p><b>⑤ 虚析构和纯虚析构的区别？</b>虚析构让父类指针 <code>delete</code> 子类对象时能先析构子类；纯虚析构除了这一点，还让基类变成抽象类，但必须在类外提供函数体，否则链接失败。</p>\n    <p><b>⑥ 异常比返回错误码好在哪？</b>返回值可以被忽略，异常不会（没人接就 terminate）；异常能带类型和上下文信息；还能跨多层直接跳到 catch，不用每层判返回值。</p>\n    <p><b>⑦ 异常的类型匹配和栈解旋是什么？</b>匹配是严格的，char 不会转成 int，catch 从上到下选第一个匹配的，所以具体类型写前面；栈解旋是从 try 到 throw 之间构造的局部对象按逆序自动析构。</p>\n    <p><b>⑧ 自定义异常类怎么写？</b>继承 <code>std::exception</code>，用 <code>string</code> 存说明，按原签名重写 <code>const char* what() const noexcept</code>，这样别人用 <code>catch (exception&amp;)</code> 也能接住。</p>\n    <p class=\"say\">这天的重心在多态那一半：virtual、重写、抽象类、虚析构要能默写；异常部分记住 try / throw / catch 和「用引用接」。下一课进模板。</p>"
  }
};
