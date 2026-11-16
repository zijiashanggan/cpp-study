window.BANKS = window.BANKS || {};
window.BANKS.day6 = {
  "single": [
    {
      "id": "d6s01",
      "day": "day6",
      "q": "静态多态和动态多态，根本区别在哪？",
      "options": [
        "一个用类实现，一个不用类",
        "函数地址是编译期定好，还是运行期才定",
        "一个运行快，一个运行慢",
        "一个能继承，一个不能继承",
      ],
      "ans": 1,
      "why": "静态多态（函数重载、运算符重载）在编译阶段就把调用地址定下来，叫早绑定；动态多态（虚函数）要到运行时看对象的真实类型，叫晚绑定。"
    },
    {
      "id": "d6s02",
      "day": "day6",
      "q": "下面哪一项属于编译时多态？",
      "options": [
        "函数重载",
        "父类指针调用子类重写的虚函数",
        "用基类引用接住派生类异常",
        "通过 <code>catch (Base&amp;)</code> 处理一族异常",
      ],
      "ans": 0,
      "why": "重载在编译阶段按实参类型就能选定版本，是典型的早绑定；后三项都要等运行时看对象真实类型，属于动态多态。"
    },
    {
      "id": "d6s03",
      "day": "day6",
      "code": "class Car {\npublic:\n    void drive() { cout &lt;&lt; \"汽车行驶\" &lt;&lt; endl; }\n};\nclass SUV : public Car {\npublic:\n    void drive() { cout &lt;&lt; \"SUV行驶\" &lt;&lt; endl; }\n};\nint main() {\n    Car* p = new SUV();\n    p-&gt;drive();\n}",
      "q": "这段代码打印什么？",
      "options": [
        "汽车行驶",
        "SUV行驶",
        "两行都打印",
        "编译报错",
      ],
      "ans": 0,
      "why": "<code>drive</code> 不是虚函数，编译器只按 <code>Car*</code> 这个静态类型生成调用，直接早绑定到 <code>Car::drive</code>。"
    },
    {
      "id": "d6s04",
      "day": "day6",
      "q": "<code>Car* p = new SUV;</code> 明明指向 SUV 对象，为什么调到的还是父类版本？",
      "options": [
        "因为 new 出来的一定是父类对象",
        "因为编译器只看指针的静态类型，早绑定",
        "因为向上转换会丢掉子类函数",
        "因为没有写 override",
      ],
      "ans": 1,
      "why": "编译时只有 <code>Car*</code> 的信息，函数不是 virtual 就直接按 <code>Car::drive</code> 生成调用；对象的真实类型要到运行时才知道，早绑定不等它。"
    },
    {
      "id": "d6s05",
      "day": "day6",
      "q": "基类已经把函数声明成 <code>virtual</code>，派生类重写时还要不要再写一次 <code>virtual</code>？",
      "options": [
        "必须再写，否则不生效",
        "不用，自动就是虚函数，写不写都行",
        "必须写 <code>override</code> 才是虚函数",
        "必须改成纯虚函数",
      ],
      "ans": 1,
      "why": "只要基类声明了 virtual，派生类同名同签名的函数自动是虚函数；再写一次是冗余，推荐写 <code>override</code> 让编译器检查签名。"
    },
    {
      "id": "d6s06",
      "day": "day6",
      "q": "64 位 g++ 下，一个只有两个虚函数、没有任何数据成员的类，<code>sizeof</code> 是多少？",
      "options": [
        "1",
        "4",
        "8",
        "16",
      ],
      "ans": 2,
      "why": "空类本来是 1 字节，但含虚函数后对象里要放一个 vptr 指向虚函数表；64 位下一个指针 8 字节。"
    },
    {
      "id": "d6s07",
      "day": "day6",
      "q": "在基类构造函数里调用一个虚函数，实际走哪个版本？",
      "options": [
        "派生类重写后的版本",
        "基类自己的版本",
        "编译报错",
        "运行时崩溃",
      ],
      "ans": 1,
      "why": "构造基类时 vptr 还指向基类的表，进派生类构造体前才会改成派生类的表，所以这时只能调到基类版本。"
    },
    {
      "id": "d6s08",
      "day": "day6",
      "q": "子类写了一个与父类同名的非虚函数，父类那组同名重载会怎样？",
      "options": [
        "继续可用，按参数自动选",
        "被整体隐藏，只能加作用域或 <code>using</code> 才能调到",
        "只隐藏参数个数相同的那个",
        "自动全部变成虚函数",
      ],
      "ans": 1,
      "why": "重定义（隐藏）不看参数是否一致，子类一写同名函数，父类所有同名版本都被遮住；要调父类版本得写 <code>子对象.父类名::f(...)</code>。"
    },
    {
      "id": "d6s09",
      "day": "day6",
      "q": "构成「重写（覆盖）」必须同时满足什么？",
      "options": [
        "函数同名即可",
        "有继承 + 父类是 virtual + 返回值、名字、参数完全一致",
        "只要参数不同就算重写",
        "只要返回值不同就算重写",
      ],
      "ans": 1,
      "why": "重写三个条件缺一不可；少一个 const、参数类型差一点，都不算重写，运行时还会走父类版本。"
    },
    {
      "id": "d6s10",
      "day": "day6",
      "q": "一个类里只要有一个纯虚函数，这个类就：",
      "options": [
        "不能有构造函数",
        "是抽象类，不能实例化",
        "所有成员函数都变成纯虚",
        "不能被继承",
      ],
      "ans": 1,
      "why": "纯虚函数让类成为抽象类，只禁止创建对象；它照样可以有数据成员、普通函数和构造函数，也可以被继承。"
    },
    {
      "id": "d6s11",
      "day": "day6",
      "q": "C++ 里用来模拟「接口」的类，特征是什么？",
      "options": [
        "全是纯虚函数、没有数据成员",
        "全是普通成员函数",
        "只能有一个子类",
        "必须带静态成员",
      ],
      "ans": 0,
      "why": "接口类只有函数声明、没有数据，因此多继承多个接口不会产生数据重复或二义性，是工程里最安全的多继承用法。"
    },
    {
      "id": "d6s12",
      "day": "day6",
      "q": "模板方法模式里，那个固定流程的函数（比如 <code>make()</code>）通常写成什么？",
      "options": [
        "纯虚函数",
        "普通函数，里面按顺序调用虚的步骤函数",
        "必须是 virtual 函数",
        "必须是 static 函数",
      ],
      "ans": 1,
      "why": "流程固定，不需要多态；它内部调用的步骤函数是虚的，所以会按真实类型走到子类实现。子类只能换步骤内容，改不了顺序。"
    },
    {
      "id": "d6s13",
      "day": "day6",
      "q": "父类析构不是虚函数，执行 <code>Car* p = new SUV; delete p;</code> 会：",
      "options": [
        "先析构 SUV 再析构 Car",
        "只析构 Car 那部分，SUV 部分不析构",
        "编译报错",
        "把对象析构两次",
      ],
      "ans": 1,
      "why": "析构不是虚函数就按静态类型走，只调 <code>Car::~Car</code>；SUV 里的成员和它 new 出来的资源都不会释放。"
    },
    {
      "id": "d6s14",
      "day": "day6",
      "q": "纯虚析构函数和普通纯虚函数相比，特殊在哪？",
      "options": [
        "不能有函数体",
        "必须有函数体（类外定义）",
        "不能被继承",
        "只能用在接口类里",
      ],
      "ans": 1,
      "why": "子类销毁时一定会调用父类析构，所以纯虚析构虽然写成 <code>= 0</code>，仍必须在类外给出函数体，否则链接失败。"
    },
    {
      "id": "d6s15",
      "day": "day6",
      "q": "异常相比返回错误码，最核心的优势是什么？",
      "options": [
        "运行速度更快",
        "不能被悄悄忽略，还能跨多层直接跳到处理处",
        "不需要写类型",
        "能自动把错误修好",
      ],
      "ans": 1,
      "why": "返回值可以不管，异常没人接就 terminate；而且底层 throw、上层 catch，中间函数不用层层判断返回值。"
    },
    {
      "id": "d6s16",
      "day": "day6",
      "q": "一个函数执行了 <code>throw</code> 之后，它后面的语句会：",
      "options": [
        "继续执行",
        "不再执行，控制权交给匹配的 catch",
        "执行完再抛出",
        "只跳过 <code>return</code>",
      ],
      "ans": 1,
      "why": "<code>throw</code> 处函数立刻结束，后面的语句全部跳过，直接开始栈解旋并寻找匹配的 catch。"
    },
    {
      "id": "d6s17",
      "day": "day6",
      "q": "<code>try</code> 块中某条语句抛出异常后，<code>try</code> 里剩下的语句会怎样？",
      "options": [
        "继续执行完",
        "全部跳过，跳到匹配的 catch",
        "直接退出程序",
        "重新执行一遍 try",
      ],
      "ans": 1,
      "why": "异常一旦抛出，<code>try</code> 块立即中止；已构造的局部对象按逆序析构（栈解旋），然后进入匹配的 catch。"
    },
    {
      "id": "d6s18",
      "day": "day6",
      "q": "<code>throw 'c';</code> 能被 <code>catch (int e)</code> 接住吗？",
      "options": [
        "能，char 会隐式转成 int",
        "不能，异常是严格类型匹配",
        "能，但值会变成 99",
        "要看编译器",
      ],
      "ans": 1,
      "why": "异常捕获不做 char→int 这种隐式转换；只会漏到 <code>catch (char)</code> 或 <code>catch (...)</code>，都没有就 terminate。"
    },
    {
      "id": "d6s19",
      "day": "day6",
      "q": "栈解旋时，已经构造的局部对象按什么顺序析构？",
      "options": [
        "与构造顺序相同",
        "与构造顺序相反",
        "按变量名字母序",
        "顺序不确定",
      ],
      "ans": 1,
      "why": "后构造的先析构，和正常离开作用域一样；后进的先出，所以是逆序。"
    },
    {
      "id": "d6s20",
      "day": "day6",
      "q": "接异常时推荐的写法是哪种？",
      "options": [
        "<code>catch (T e)</code> 按值接",
        "<code>catch (T* e)</code> 接 <code>throw new T</code>",
        "<code>catch (T&amp; e)</code> 按引用接",
        "一律 <code>catch (...)</code> 兜住",
      ],
      "ans": 2,
      "why": "按引用不拷贝、不用手动释放，还能通过基类引用接派生类异常；按值多一次拷贝，接派生类时还会切片。"
    },
    {
      "id": "d6s21",
      "day": "day6",
      "q": "想用一个 catch 接住一整族异常，需要什么？",
      "options": [
        "把所有异常都抛成 int",
        "异常有共同基类 + 用基类引用接 + 基类里是虚函数",
        "只写 <code>catch (...)</code>",
        "给每个异常类加 static",
      ],
      "ans": 1,
      "why": "这就是异常的多态：<code>catch (Base&amp; e)</code> 接住子类对象，<code>e.print()</code> 按真实类型走虚函数。按值接会切片，虚函数也救不回来。"
    },
    {
      "id": "d6s22",
      "day": "day6",
      "q": "标准异常类的 <code>what()</code> 返回什么类型？",
      "options": [
        "<code>string</code>",
        "<code>const char*</code>",
        "<code>char</code>",
        "<code>void</code>",
      ],
      "ans": 1,
      "why": "<code>what()</code> 是虚函数，返回 C 风格字符串 <code>const char*</code>；要转成 <code>string</code> 就写 <code>string(e.what())</code>。"
    },
    {
      "id": "d6s23",
      "day": "day6",
      "q": "自定义异常类重写 <code>what()</code>，签名应该写成什么样？",
      "options": [
        "<code>const char* what()</code>",
        "<code>const char* what() const</code>",
        "<code>const char* what() const noexcept</code>",
        "<code>string what() const</code>",
      ],
      "ans": 2,
      "why": "签名必须和 <code>exception::what()</code> 完全一致，包括 <code>const</code> 和 <code>noexcept</code>，少一个就变成隐藏而不是重写。"
    },
    {
      "id": "d6s24",
      "day": "day6",
      "q": "下面哪个函数<b>不能</b>声明成虚函数？",
      "options": [
        "析构函数",
        "构造函数",
        "普通成员函数",
        "<code>const</code> 成员函数",
      ],
      "ans": 1,
      "why": "构造对象时 vptr 还没设好，没法按动态类型调用；析构函数反而经常要写成 virtual。"
    },
    {
      "id": "d6s25",
      "day": "day6",
      "q": "哪一类基类需要把析构函数写成 <code>virtual</code>？",
      "options": [
        "所有类都要写",
        "会被继承、并且可能通过父类指针 delete 的多态基类",
        "只有抽象类",
        "只有带静态成员的类",
      ],
      "ans": 1,
      "why": "只有当「父类指针指向子类对象、还要 delete 它」时才必须虚析构；不打算多态删除的类加 virtual 只是多一个 vptr 开销。"
    }
  ],
  "fill": [
    {
      "id": "d6f01",
      "day": "day6",
      "code": "class Shape {\npublic:\n    virtual double area() const ____;   // 纯虚函数\n};",
      "q": "横线上填让这个函数成为纯虚函数的写法。",
      "answers": ["= 0", "=0"],
      "display": "= 0　（纯虚函数，Shape 因此成为抽象类）",
      "why": "纯虚函数用 <code>= 0</code> 声明，表示虚函数表里这一格先不放地址；含纯虚函数的类不能实例化。"
    },
    {
      "id": "d6f02",
      "day": "day6",
      "code": "class Car {\npublic:\n    virtual ~Car() = 0;   // 纯虚析构\n};\n____ { cout &lt;&lt; \"Car析构\" &lt;&lt; endl; }   // 类外必须补上",
      "q": "横线上填这个纯虚析构在类外的定义（写到函数名和括号即可）。",
      "answers": ["Car::~Car()"],
      "display": "Car::~Car()　（后面再写函数体 { ... }）",
      "why": "纯虚析构 <code>= 0</code> 只表示「让 Car 变成抽象类」，子类销毁时仍会调它，所以类外必须有函数体，否则链接报 undefined reference。"
    },
    {
      "id": "d6f03",
      "day": "day6",
      "code": "____ (string&amp; e) { cout &lt;&lt; e &lt;&lt; endl; }   // 接住 throw 出来的 string",
      "q": "横线上填捕获异常的关键字。",
      "answers": ["catch"],
      "display": "catch",
      "why": "可能出错的代码放 <code>try</code>，出错处 <code>throw</code>，处理写在 <code>catch</code>；catch 从上到下匹配第一个类型相符的。"
    },
    {
      "id": "d6f04",
      "day": "day6",
      "code": "try {\n    Demo x(1);\n    Demo y(2);\n    throw 1;      // 栈解旋\n} catch (int) { }",
      "q": "栈解旋时，局部对象的析构顺序与构造顺序____（填两个字）。",
      "answers": ["相反", "逆序"],
      "display": "相反　（后构造的先析构，即 2 → 1）",
      "why": "栈解旋和正常离开作用域一样，后构造的先析构；两个对象都在 catch 之前析构完。"
    },
    {
      "id": "d6f05",
      "day": "day6",
      "code": "} ____ (exception&amp; e) {\n    cout &lt;&lt; e.what() &lt;&lt; endl;\n}",
      "q": "横线上填能接住所有标准异常的基类名。",
      "answers": ["exception", "std::exception"],
      "display": "exception　（标准异常都派生自 std::exception）",
      "why": "<code>out_of_range</code>、<code>invalid_argument</code> 等都继承 <code>exception</code>，用基类引用一处接住，再靠虚函数 <code>what()</code> 拿说明。"
    },
    {
      "id": "d6f06",
      "day": "day6",
      "code": "class Car {\npublic:\n    ____ void drive() { cout &lt;&lt; \"汽车行驶\" &lt;&lt; endl; }\n};",
      "q": "横线上填让 <code>drive</code> 能动态绑定的关键字。",
      "answers": ["virtual"],
      "display": "virtual　（只在基类写一次）",
      "why": "基类函数前加 <code>virtual</code>，派生类重写后，通过父类指针或引用调用就会按对象真实类型走。"
    },
    {
      "id": "d6f07",
      "day": "day6",
      "code": "class Car {\npublic:\n    ____ ~Car() { cout &lt;&lt; \"Car析构\" &lt;&lt; endl; }\n};",
      "q": "用父类指针 delete 子类对象时，父类析构前必须加的关键字是？",
      "answers": ["virtual"],
      "display": "virtual　（虚析构）",
      "why": "不加 virtual 只会析构父类那部分，子类成员和它申请的资源都漏掉，而且编译器不会报错。"
    },
    {
      "id": "d6f08",
      "day": "day6",
      "code": "try {\n    throw 'c';\n} catch (int) {\n} ____ {\n    cout &lt;&lt; \"兜底\" &lt;&lt; endl;\n}",
      "q": "横线上填接住所有漏网异常的写法。",
      "answers": ["catch (...)", "catch(...)"],
      "display": "catch (...)　（拿不到异常值，只做兜底）",
      "why": "char 不会被 <code>catch (int)</code> 接住，最后要有 <code>catch (...)</code> 兜底；它放在最后，前面先写具体类型。"
    }
  ],
  "judge": [
    {
      "id": "d6j01",
      "day": "day6",
      "q": "构造函数可以声明成虚函数。",
      "ans": 1,
      "why": "错。构造对象时对象还没建好、vptr 还没设，没法按动态类型调用；虚函数只能修饰普通成员函数和析构函数。"
    },
    {
      "id": "d6j02",
      "day": "day6",
      "q": "多继承多个「全是纯虚函数、没有数据成员」的接口，会像菱形继承一样带来数据重复和二义性。",
      "ans": 1,
      "why": "错。接口里没有数据，也就没有重复的数据子对象；多继承接口是 C++ 里最安全的多继承用法。"
    },
    {
      "id": "d6j03",
      "day": "day6",
      "q": "父类析构写成 <code>virtual</code> 之后，子类析构不用再写一次 <code>virtual</code>。",
      "ans": 0,
      "why": "对。父类析构是虚函数，子类析构自动就是虚函数；再写一次只是冗余。"
    },
    {
      "id": "d6j04",
      "day": "day6",
      "q": "异常匹配允许 char 隐式转换成 int，所以 <code>throw 'c'</code> 能被 <code>catch (int)</code> 接住。",
      "ans": 1,
      "why": "错。异常捕获是严格类型匹配，不做 char→int 这类隐式转换；接不住就继续往下找，最后没有就 terminate。"
    },
    {
      "id": "d6j05",
      "day": "day6",
      "q": "用 <code>catch (BaseEx e)</code> 按值接派生类异常，靠虚函数也能调到子类重写的 <code>print()</code>。",
      "ans": 1,
      "why": "错。按值接会发生对象切片，<code>e</code> 只是一个 BaseEx 对象，虚函数也只能调到基类版本；必须用 <code>catch (BaseEx&amp; e)</code>。"
    },
    {
      "id": "d6j06",
      "day": "day6",
      "q": "子类重写虚函数时，参数列表可以不同，只要函数名一样就算重写。",
      "ans": 1,
      "why": "错。参数不同就不是重写而是重定义（隐藏）；重写要求返回值、名字、参数完全一致，建议加 <code>override</code> 让编译器检查。"
    },
    {
      "id": "d6j07",
      "day": "day6",
      "q": "抽象类的子类只实现了一部分纯虚函数，也可以正常创建对象。",
      "ans": 1,
      "why": "错。漏实现的子类自己仍是抽象类，创建对象会报 <code>cannot declare variable ... to be of abstract type</code>。"
    }
  ],
  "code": [
    {
      "id": "d6c01",
      "day": "day6",
      "q": "读代码，按顺序写出打印的三行。",
      "code": "class Drink {\npublic:\n    void make() { boil(); brew(); pour(); }\nprotected:\n    virtual void boil() = 0;\n    virtual void brew() = 0;\n    virtual void pour() = 0;\n    virtual ~Drink() {}\n};\nclass Tea : public Drink {\nprotected:\n    void boil() { cout &lt;&lt; \"煮水\" &lt;&lt; endl; }\n    void brew() { cout &lt;&lt; \"泡茶\" &lt;&lt; endl; }\n    void pour() { cout &lt;&lt; \"倒杯\" &lt;&lt; endl; }\n};\nint main() { Tea t; t.make(); }",
      "answers": ["煮水\n泡茶\n倒杯", "煮水 泡茶 倒杯"],
      "display": "煮水 / 泡茶 / 倒杯",
      "why": "<code>make()</code> 是父类的普通函数，里面调的三个步骤都是纯虚函数，会按真实类型走到 Tea 的实现；顺序由父类固定。"
    },
    {
      "id": "d6c02",
      "day": "day6",
      "q": "读代码，按顺序写出打印的八行。",
      "code": "class E {\npublic:\n    E() { cout &lt;&lt; \"构造\" &lt;&lt; endl; }\n    E(const E&amp;) { cout &lt;&lt; \"拷贝\" &lt;&lt; endl; }\n    ~E() { cout &lt;&lt; \"析构\" &lt;&lt; endl; }\n};\nvoid byValue() { try { throw E(); } catch (E e) { cout &lt;&lt; \"按值\" &lt;&lt; endl; } }\nvoid byRef()   { try { throw E(); } catch (E&amp; e) { cout &lt;&lt; \"按引用\" &lt;&lt; endl; } }\nint main() { byValue(); byRef(); }",
      "answers": ["构造\n拷贝\n按值\n析构\n析构\n构造\n按引用\n析构", "构造 拷贝 按值 析构 析构 构造 按引用 析构"],
      "display": "构造 / 拷贝 / 按值 / 析构 / 析构 / 构造 / 按引用 / 析构",
      "why": "按值接要多一次拷贝，catch 结束和异常对象各析构一次；按引用接只有一次构造、一次析构。这就是推荐 <code>catch (T&amp; e)</code> 的原因。"
    },
    {
      "id": "d6c03",
      "day": "day6",
      "q": "读代码，写出 <code>what()</code> 打印的内容。",
      "code": "class MyRangeEx : public exception {\n    string msg;\npublic:\n    MyRangeEx(const char* m) : msg(m) {}\n    const char* what() const noexcept override { return msg.c_str(); }\n};\nint main() {\n    try {\n        throw MyRangeEx(\"自己定义的异常：年龄不在规定范围内\");\n    } catch (exception&amp; e) {\n        cout &lt;&lt; e.what() &lt;&lt; endl;\n    }\n}",
      "answers": ["自己定义的异常：年龄不在规定范围内"],
      "display": "自己定义的异常：年龄不在规定范围内",
      "why": "自定义异常继承 <code>exception</code> 并重写 <code>what()</code>，所以能用 <code>catch (exception&amp;)</code> 接住，虚函数调用返回子类的说明。"
    },
    {
      "id": "d6c04",
      "day": "day6",
      "q": "读代码，按顺序写出打印的三行。",
      "code": "class Car {\npublic:\n    virtual void drive() { cout &lt;&lt; \"Car\" &lt;&lt; endl; }\n    virtual ~Car() {}\n};\nclass SUV : public Car {\npublic:\n    void drive() { cout &lt;&lt; \"SUV\" &lt;&lt; endl; }\n};\nclass Jeep : public Car {\npublic:\n    void drive() { cout &lt;&lt; \"Jeep\" &lt;&lt; endl; }\n};\nvoid run(Car* p) { p-&gt;drive(); }\nint main() {\n    SUV s;\n    Jeep j;\n    run(&amp;s);\n    run(&amp;j);\n    Car c;\n    c.drive();\n}",
      "answers": ["SUV\nJeep\nCar", "SUV Jeep Car"],
      "display": "SUV / Jeep / Car",
      "why": "前两次通过父类指针调用，drive 是虚函数，按真实类型走；最后 <code>c</code> 本身就是 Car 对象，调的是 Car 版本。"
    },
    {
      "id": "d6c05",
      "day": "day6",
      "q": "读代码，按顺序写出打印的两行。",
      "code": "class Car {\npublic:\n    virtual ~Car() { cout &lt;&lt; \"Car析构\" &lt;&lt; endl; }\n};\nclass SUV : public Car {\npublic:\n    ~SUV() { cout &lt;&lt; \"SUV析构\" &lt;&lt; endl; }\n};\nint main() {\n    Car* p = new SUV();\n    delete p;\n}",
      "answers": ["SUV析构\nCar析构", "SUV析构 Car析构"],
      "display": "SUV析构 / Car析构",
      "why": "父类析构是虚函数，<code>delete p</code> 先析构子类再析构父类；如果去掉 virtual，只会打印 Car析构。"
    },
    {
      "id": "d6c06",
      "day": "day6",
      "q": "读代码，写出最后打印的那一行。",
      "code": "int main() {\n    try {\n        throw 'c';\n    } catch (int) {\n        cout &lt;&lt; \"int\" &lt;&lt; endl;\n    } catch (char) {\n        cout &lt;&lt; \"char\" &lt;&lt; endl;\n    } catch (...) {\n        cout &lt;&lt; \"...\" &lt;&lt; endl;\n    }\n}",
      "answers": ["char"],
      "display": "char",
      "why": "异常严格类型匹配，char 不会被当成 int；catch 从上往下找到 <code>catch (char)</code> 就停，<code>catch (...)</code> 不会执行。"
    }
  ]
};
