/* 概念地图：122 张卡按主依赖连线；桌面散点图 + 手机按天树状列表。
   点节点先出说明（桌面浮层 / 手机底部抽屉），浮层里点「进入卡片」才跳转。 */
(function () {
  'use strict';

  /* 短标题与说明只给地图用，内容以学习页卡片为准 */
  var CARDS = [
    { n: 1, id: 'd1c01', t: '引用', day: 1, dep: 0, d: '引用是给已有变量起别名，改引用就是改原变量，省掉拷贝、也让函数能改到外面。它必须初始化、绑定后不能改绑，是后面 const 引用、返回引用、拷贝构造的语法基础。' },
    { n: 2, id: 'd1c02', t: '三种 swap', day: 1, dep: 1, d: '同一个交换用值传递、指针、引用三种写法各实现一遍，差别在于函数拿到的是副本、地址还是原件。它把「形参怎么传」摆在一起对比，是理解传参方式最直观的例子。' },
    { n: 3, id: 'd1c03', t: 'const T&', day: 1, dep: 1, d: 'const 引用既能免去拷贝，又承诺函数里不修改实参，传大对象时最常用。它建立在引用之上，也是拷贝构造参数必须写成 const T& 的原因。' },
    { n: 4, id: 'd1c04', t: 'cout 与 ::', day: 1, dep: 1, d: 'cout 是标准库里的输出对象，:: 是作用域限定符，表示去哪个作用域里找名字。读懂 cout 和 std:: 的写法，才能看懂后面命名空间与类内成员的访问。' },
    { n: 5, id: 'd1c05', t: '命名空间', day: 1, dep: 4, d: '命名空间把名字装进不同抽屉，避免同名函数或类型互相打架；using namespace std 就是把这些名字一次性摊开。它解释了 std:: 前缀到底在做什么。' },
    { n: 6, id: 'd1c06', t: '返回引用', day: 1, dep: 1, d: '函数可以返回引用，交出去的是对象本身而不是副本，所以调用能出现在等号左边被赋值。前提是返回的东西在函数结束后仍然活着，不能返回局部变量。' },
    { n: 7, id: 'd2c07', t: 'new / delete', day: 2, dep: 2, d: 'new 在堆上按需申请内存并返回指针，delete 负责归还，new[] 必须配 delete[]。它让程序能按运行时才知道的数量申请内存，是动态数组、深拷贝、析构函数的前提。' },
    { n: 8, id: 'd2c08', t: 'nullptr', day: 2, dep: 7, d: 'nullptr 是空指针字面量，表示没有指向任何对象。解引用前先判空能避免程序直接崩掉，而 delete nullptr 是安全的。' },
    { n: 9, id: 'd2c09', t: '指针与数组', day: 2, dep: 7, d: '数组名在多数场合会退化成指向首元素的指针，所以函数参数里的 int a[] 其实是指针。知道这一点才不会在函数里用 sizeof 去算数组长度。' },
    { n: 10, id: 'd2c10', t: '栈与堆', day: 2, dep: 7, d: '栈上的对象随作用域自动创建销毁，堆上的对象由 new / delete 手动管理。生命周期不同，决定了析构函数什么时候被调用，也是内存泄漏与重复释放的根源。' },
    { n: 11, id: 'd2c11', t: 'struct 加强', day: 2, dep: 2, d: 'C++ 的 struct 除了装数据，还能带成员函数、构造函数和访问控制。它是从「一堆字段」走向「类」的过渡，和 class 只差默认访问权限。' },
    { n: 12, id: 'd2c12', t: 'bool', day: 2, dep: 4, d: 'bool 只有 true / false 两个值，条件判断的结果就是 bool。它让真假成为独立类型，判断语句和位操作都靠它表达。' },
    { n: 13, id: 'd2c13', t: 'const', day: 2, dep: 3, d: 'const 表示只读，修饰变量、参数、返回值都意味着这里不许改。它是 const 引用、常对象、const 成员函数这条线的起点。' },
    { n: 14, id: 'd2c14', t: '默认参数', day: 2, dep: 2, d: '函数参数可以给默认值，调用时不传就用默认的，但默认值必须从右往左连续给。它省掉一部分重复的重载写法。' },
    { n: 15, id: 'd2c15', t: '函数重载', day: 2, dep: 14, d: '同名函数只要参数个数或类型不同就能共存，编译器按调用时的实参挑选版本。它和默认参数解决的是同一类问题：让调用端少记几个名字。' },
    { n: 16, id: 'd2c16', t: 'volatile', day: 2, dep: 10, d: 'volatile 告诉编译器这个变量可能被外部改变，每次都要真去内存读，不能优化进寄存器。嵌入式里读写硬件寄存器常用它，和 const 是两件不同的事。' },
    { n: 17, id: 'd2c17', t: 'static', day: 2, dep: 10, d: '在函数里 static 让局部变量只初始化一次、活到程序结束；在文件或全局层面它限制名字只在本文件可见。它是 Day 4 静态成员的前置概念。' },
    { n: 18, id: 'd2c18', t: '位操作', day: 2, dep: 12, d: '用 & | ^ ~ << >> 直接操作二进制位，可以压缩标志、读写寄存器。嵌入式里配置硬件位域几乎离不开它。' },
    { n: 19, id: 'd3c19', t: '过程 vs 对象', day: 3, dep: 11, d: '面向过程按步骤组织代码，面向对象把数据和操作数据的方法捆在一起。理解这个转变，才能明白类到底解决了什么问题。' },
    { n: 20, id: 'd3c20', t: '封装', day: 3, dep: 19, d: '封装是把数据藏进 private、只留 public 接口给外面用，外部改不了内部状态。它让「谁能改、怎么改」有明确边界，是类存在的核心理由。' },
    { n: 21, id: 'd3c21', t: 'class 与 struct', day: 3, dep: 20, d: 'class 默认成员私有，struct 默认公有，其余能力完全一样。选哪个更多是表达意图：要封装用 class，纯数据聚合用 struct。' },
    { n: 22, id: 'd3c22', t: '构造函数', day: 3, dep: 21, d: '构造函数在对象创建时自动执行，负责把成员初始化到合法状态，名字与类相同、没有返回值。有了它，对象一出生就是可用的。' },
    { n: 23, id: 'd3c23', t: '拷贝构造', day: 3, dep: 3, d: '用同类型对象初始化新对象时调用拷贝构造，参数固定写成 const T&。它建立在 const 引用之上，是浅拷贝、深拷贝、三法则这条线的入口。' },
    { n: 24, id: 'd3c24', t: '浅拷贝', day: 3, dep: 7, d: '编译器默认生成的拷贝只逐成员复制，指针成员复制的是地址而不是内容，两个对象会指向同一块内存。它是理解深拷贝必要性的反面教材。' },
    { n: 25, id: 'd3c25', t: '深拷贝', day: 3, dep: 23, x: '还涉及：卡 24 浅拷贝', d: '深拷贝在拷贝构造里重新申请一块内存，再把内容搬过去，两个对象各管各的。它解决浅拷贝带来的重复释放问题，需要 new / delete 与拷贝构造两样基础。' },
    { n: 26, id: 'd3c26', t: 'operator=', day: 3, dep: 25, x: '还涉及：卡 23 拷贝构造', d: '拷贝赋值发生在两个已存在的对象之间，要处理自赋值、先释放旧资源再深拷贝，并返回 *this 支持连续赋值。它和拷贝构造时机不同：一个是出生，一个是覆盖。' },
    { n: 27, id: 'd3c27', t: '析构函数', day: 3, dep: 7, x: '还涉及：卡 22 构造函数', d: '析构函数在对象销毁前自动执行，用来释放 new 出来的资源，顺序与构造相反。没有它，深拷贝和动态数组都会漏内存。' },
    { n: 28, id: 'd3c28', t: '初始化列表', day: 3, dep: 22, d: '成员可以在构造函数的初始化列表里直接构造，比进函数体再赋值少一次默认构造。const 成员和引用成员必须走初始化列表。' },
    { n: 29, id: 'd3c29', t: 'explicit', day: 3, dep: 22, d: 'explicit 禁止单参数构造函数被隐式转换调用，避免 Box b = 10 这种悄悄发生的构造。它是对构造函数的一道收紧。' },
    { n: 30, id: 'd3c30', t: '三法则', day: 3, dep: 26, d: '只要自己写了析构、拷贝构造、拷贝赋值中的任何一个，另外两个通常也要写。它把前面几关串成一条规则，是资源管理类的最低要求。' },
    { n: 31, id: 'd4c31', t: '静态成员变量', day: 4, dep: 22, d: 'static 成员属于类而不属于对象，所有对象共用同一份，类内声明、类外定义。它用来表达「全类共享的状态」，比如总数、配置。' },
    { n: 32, id: 'd4c32', t: '静态计数器', day: 4, dep: 31, d: '把静态成员放进构造函数加一、析构函数减一，就得到全类的对象计数。它是静态成员最典型的用法，也顺便验证了构造与析构的时机。' },
    { n: 33, id: 'd4c33', t: '静态成员函数', day: 4, dep: 32, d: '静态成员函数没有 this，因此只能访问静态成员，用 类名:: 调用。它是访问静态数据的窗口，也是单例 getInstance 必须写成静态的原因。' },
    { n: 34, id: 'd4c34', t: '单例 · 饿汉', day: 4, dep: 33, d: '饿汉式在程序启动时就创建唯一实例：构造私有，再用静态成员和静态 getInstance 交出去。它简单、没有线程竞争，代价是无论用不用都先构造。' },
    { n: 35, id: 'd4c35', t: '单例 · 懒汉', day: 4, dep: 34, d: '懒汉式第一次调用 getInstance 时才创建实例，判空那一句就是它的命门。它省掉不必要的构造，但多线程下需要额外同步。' },
    { n: 36, id: 'd4c36', t: '单例 · 静态局部', day: 4, dep: 35, d: '把实例写成函数内的 static 局部变量，第一次调用时构造，之后都返回同一个对象。C++11 保证这种写法线程安全，是目前最推荐的懒汉实现。' },
    { n: 37, id: 'd4c37', t: '类的存储结构', day: 4, dep: 21, d: '对象的大小只由非静态数据成员决定，还要按对齐规则补齐；静态成员和成员函数都不占对象空间。它解释了 sizeof 为什么常常比成员相加更大。' },
    { n: 38, id: 'd4c38', t: 'this 同名形参', day: 4, dep: 37, d: '每个非静态成员函数都隐含一个 this 指针，指向当前对象。形参和成员同名时，用 this-> 指明左边那个是成员。' },
    { n: 39, id: 'd4c39', t: 'return *this', day: 4, dep: 38, d: '*this 就是当前对象本身，返回它的引用就能连续调用成员函数。链式调用的关键是返回类型写成 类名&，而不是返回值。' },
    { n: 40, id: 'd4c40', t: 'const 成员函数', day: 4, dep: 37, d: '在成员函数参数表后加 const，表示这个函数不修改对象状态。常对象只能调用这类函数，它是「只读承诺」的语法体现。' },
    { n: 41, id: 'd4c41', t: '常对象', day: 4, dep: 40, d: '用 const 修饰的对象只能调用 const 成员函数，成员能读不能改，mutable 成员是唯一例外。它把 const 成员函数的约束落实到具体对象上。' },
    { n: 42, id: 'd4c42', t: '友元', day: 4, dep: 40, d: 'friend 声明的函数或类可以访问私有成员，相当于发一把备用钥匙。它绕过封装但不是成员、没有 this，也不被继承。' },
    { n: 43, id: 'd4c43', t: '动态数组实战', day: 4, dep: 26, d: '把指针、个数、容量封装进类，满了就申请更大的内存、搬过去、释放旧的；拷贝时重新租地做深拷贝。它把 new / delete、构造析构、拷贝赋值、扩容串成一个能用的容器。' },
    { n: 44, id: 'd5c44', t: '运算符重载', day: 5, dep: 0, d: '运算符重载就是给 +、<< 这些符号绑一个函数：成员函数少写一个参数，全局函数写全两个。它不改变优先级和参数个数，只是让对象用起来像内置类型。' },
    { n: 45, id: 'd5c45', t: '<< 与 >>', day: 5, dep: 44, d: '<< 的左操作数是流对象，所以只能写成全局函数，并在类里声明成友元；返回 ostream& 才能连续输出。>> 同理，第二个参数必须是非 const 引用，才能把读到的值写回对象。' },
    { n: 46, id: 'd5c46', t: '重载红线', day: 5, dep: 44, d: '不能新增运算符、不能改优先级和参数个数、不能改内置类型；:: . ?: sizeof 不可重载。&& 和 || 更不要重载——重载后所有实参都要先求值，短路直接失效。' },
    { n: 47, id: 'd5c47', t: '前置/后置 ++', day: 5, dep: 44, d: '前置 ++c 返回加完的自己（引用），后置 c++ 靠一个不用的 int 占位参数区分，返回旧值的副本。能写前置就别写后置，后置多一次拷贝。' },
    { n: 48, id: 'd5c48', t: 'operator+', day: 5, dep: 44, d: '相加产生第三个新对象，所以返回类型写值不写引用，参数用 const T& 保证不改右操作数。返回引用会指向函数里的临时对象，函数一结束就悬空。' },
    { n: 49, id: 'd5c49', t: 'operator=', day: 5, dep: 26, d: '赋值只在两个已存在的对象之间调用，要挡自赋值、先释放旧资源再深拷贝，并返回 *this 的引用才能连续赋值。它和拷贝构造的区别是「覆盖」与「出生」。' },
    { n: 50, id: 'd5c50', t: '== 与 !=', day: 5, dep: 44, d: '比较哪些字段由你定，返回 bool、参数 const T&、函数尾加 const。!= 直接拿 == 取反，规则只维护一处；C 字符串比内容要用 strcmp，不能直接 ==。' },
    { n: 51, id: 'd5c51', t: 'operator() 仿函数', day: 5, dep: 44, d: '重载 () 之后对象能像函数一样被调用，还能带着成员状态，这类对象叫仿函数。标准库的排序、for_each 都吃这种「能调的对象」。' },
    { n: 52, id: 'd5c52', t: '智能指针原理', day: 5, dep: 48, d: '把裸指针包进类、析构里 delete，再重载 * 和 ->，用起来还像指针——这就是智能指针。-> 必须返回真正的指针，因为编译器会自动再接一次 ->。' },
    { n: 53, id: 'd5c53', t: '重载硬规定', day: 5, dep: 44, d: '= [] () -> 必须是成员函数；<< >> 必须是全局函数加友元； + - == < 两种写法都行但要统一。这些不是风格，是语法写死的。' },
    { n: 54, id: 'd5c54', t: 'MyString ①', day: 5, dep: 25, d: '成员里有 new 出来的 char*，就必须自己写析构、拷贝构造和拷贝赋值（三法则）。默认拷贝只抄地址，两个对象共用一块内存，析构时会释放两次。' },
    { n: 55, id: 'd5c55', t: 'MyString ②', day: 5, dep: 54, d: '把 + 返回新对象、[] 返回 char&、= 先释放后深拷、== 用 strcmp 这几件接上，类才真的像字符串。[] 返回 char 只能读不能改。' },
    { n: 56, id: 'd5c56', t: '继承基础', day: 5, dep: 21, d: '子类自动拥有父类的成员和函数，只补自己新增的部分；父类构造要写在初始化列表里。只有「是一个」的关系才用继承，「有一个」应该用成员对象。' },
    { n: 57, id: 'd5c57', t: '继承访问控制', day: 5, dep: 56, d: 'public 继承不改父类成员的权限：public 照旧、protected 子类可用、private 谁都不能直接碰。protected / private 继承会把权限往下压，工程里很少用。' },
    { n: 58, id: 'd5c58', t: '构造析构顺序', day: 5, dep: 56, d: '构造顺序是父类 → 成员对象 → 子类构造体，析构完全相反。用父类指针 delete 子类对象时，父类析构必须是 virtual，否则子类资源漏掉。' },
    { n: 59, id: 'd5c59', t: '同名成员', day: 5, dep: 56, d: '同名成员默认就近用子类那份，要父类的就加 类名::。函数同名更狠：子类一重定义，父类那组同名重载会被整体遮蔽。' },
    { n: 60, id: 'd5c60', t: '不继承的三样', day: 5, dep: 56, d: '构造函数、析构函数、operator= 都不会继承，编译器给子类各生成一份；静态成员则相反，父子共享同一块内存，在谁那里改都是改同一份。' },
    { n: 61, id: 'd5c61', t: '多继承', day: 5, dep: 56, d: '一个子类可以继承多个父类，但两个父类有同名成员时 x.a 会有歧义，必须写 x.A::a。构造顺序按继承列表来，工程里应尽量少用多继承。' },
    { n: 62, id: 'd5c62', t: '菱形与虚继承', day: 5, dep: 61, d: '马和驴都继承动物、骡又继承马和驴时，动物会被继承两份。让中间层 virtual 继承，公共祖先只留一份；代价是对象里多一个 vbptr 指向虚基类表。' },
    { n: 63, id: 'd6c63', t: '多态', day: 6, dep: 56, d: '同一个调用在不同对象上做出不同行为。重载、运算符重载是编译时多态（早绑定），虚函数是运行时多态（晚绑定），区别只在函数地址什么时候定下来。' },
    { n: 64, id: 'd6c64', t: '向上转换', day: 6, dep: 63, d: '父类指针或引用可以指向子类对象，但普通函数按指针的静态类型早绑定，所以 p->drive() 调到的还是父类版本。它解释了为什么需要 virtual。' },
    { n: 65, id: 'd6c65', t: '虚函数', day: 6, dep: 64, d: '在基类函数前加 virtual，派生类重写后，通过父类指针调用就会按对象真实类型走。派生类不用再写 virtual，签名必须和基类完全一致。' },
    { n: 66, id: 'd6c66', t: 'vptr / vtable', day: 6, dep: 65, d: '每个含虚函数的类有一张虚函数表，每个对象里放一个 vptr 指向它；调用虚函数就是取 vptr、查表、跳转。64 位下这个指针让对象多 8 字节。' },
    { n: 67, id: 'd6c67', t: '重载重定义重写', day: 6, dep: 65, d: '重载看同一作用域、参数不同；重定义（隐藏）是有继承、同名非虚函数，一写就遮住父类全部同名版本；重写要父类 virtual + 签名一致，才会动态绑定。' },
    { n: 68, id: 'd6c68', t: '纯虚与抽象类', day: 6, dep: 65, d: '写成 = 0 的函数是纯虚函数，含纯虚函数的类成为抽象类，不能实例化；子类必须实现全部纯虚函数，否则自己也是抽象类。' },
    { n: 69, id: 'd6c69', t: '接口类', day: 6, dep: 68, d: '全是纯虚函数、没有数据成员的类就是接口。多继承多个接口不会带来数据重复或二义性，是 C++ 里最安全的多继承用法。' },
    { n: 70, id: 'd6c70', t: '模板方法', day: 6, dep: 68, d: '父类把不变的流程写在普通函数里，把可变的步骤留成纯虚函数，子类只填步骤、改不了顺序。这是设计模式里最常用的继承用法之一。' },
    { n: 71, id: 'd6c71', t: '虚析构', day: 6, dep: 65, d: '用父类指针 delete 子类对象时，父类析构必须是 virtual，否则只析构父类那部分，子类资源泄漏，而且编译器不会报错。' },
    { n: 72, id: 'd6c72', t: '纯虚析构', day: 6, dep: 68, d: '把析构写成 = 0 能让基类变成抽象类，但必须在类外提供函数体，否则子类销毁时链接不到，报 undefined reference。' },
    { n: 73, id: 'd6c73', t: '为什么用异常', day: 6, dep: 0, d: '返回值可能被调用方忽略，异常不会：没人接就 terminate。它还能把出错原因和参数一起带上去，并跨多层直接跳到能处理的地方。' },
    { n: 74, id: 'd6c74', t: 'throw / try / catch', day: 6, dep: 73, d: '可能出错的代码放 try，出错处 throw，处理写 catch；抛出后 try 里剩余语句全部跳过，catch 处理完程序继续往下走。' },
    { n: 75, id: 'd6c75', t: '严格类型匹配', day: 6, dep: 74, d: '异常捕获不做 char→int 这类隐式转换，catch 从上到下选第一个类型匹配的，所以具体类型写前面、catch(...) 放最后。' },
    { n: 76, id: 'd6c76', t: '栈解旋', day: 6, dep: 74, d: '从 try 到 throw 之间构造的局部对象会按逆序自动析构，然后才进 catch。这是 RAII 能在异常路径上不漏资源的基础。' },
    { n: 77, id: 'd6c77', t: '异常怎么接', day: 6, dep: 74, d: '按值接会多一次拷贝、接派生类还会切片；按指针接要手动 delete；推荐 catch (T& e)，不拷贝、不泄漏，还能配合多态接子类异常。' },
    { n: 78, id: 'd6c78', t: '异常多态', day: 6, dep: 77, d: '让异常类继承同一个基类，用 catch (Base& e) + 虚函数，就能一个 catch 处理一整族异常。派生类的 catch 必须写在基类前面。' },
    { n: 79, id: 'd6c79', t: '标准异常库', day: 6, dep: 78, d: 'out_of_range、invalid_argument 等都继承 std::exception，用 catch (exception& e) + e.what() 一处接住，what() 返回 const char*。' },
    { n: 80, id: 'd6c80', t: '自定义异常', day: 6, dep: 79, d: '自己的异常类继承 exception，用 string 存说明，按原签名重写 const char* what() const noexcept；这样别人用 catch (exception&) 也能接住。' },
    { n: 81, id: 'd7c81', t: '模板是什么', day: 7, dep: 0, d: '把类型参数化：同一套逻辑只写一次，编译器按你实际用到的类型各生成一份。它不是运行时万能函数，而是编译期的代码生成。' },
    { n: 82, id: 'd7c82', t: '函数模板', day: 7, dep: 81, d: 'template <typename T> 后面跟函数，T 是类型占位符。调用时可由实参自动推导，也可以写 add<int>(...) 显式指定；推导和指定两条路都要会。' },
    { n: 83, id: 'd7c83', t: '两次编译与隐式转换', day: 7, dep: 82, d: '模板先在声明处检查自身，再在调用处按 T 生成具体函数。它不做隐式类型转换，int 和 char 一起传会推导冲突，只能显式指定类型。' },
    { n: 84, id: 'd7c84', t: '模板与普通函数同名', day: 7, dep: 82, d: '两者都能匹配时普通函数优先；printer<> 强制走模板，printer<int> 指定类型；模板匹配更精确时也会选模板。' },
    { n: 85, id: 'd7c85', t: '函数模板重载', day: 7, dep: 82, d: '模板也能按参数个数/类型重载，但每个重载函数前面都要重新写一条 template 声明，声明只对紧邻的下一个函数生效。' },
    { n: 86, id: 'd7c86', t: '模板局限与具体化', day: 7, dep: 82, d: '模板里直接 cout 自定义类、或对结构体做 > 比较都会失败。解决办法：给类型重载运算符，或写 template<> 具体化版本单独处理。' },
    { n: 87, id: 'd7c87', t: '类模板', day: 7, dep: 81, d: '类模板用 Demo<T1,T2> 描述一族类，创建对象要写完整类名 Demo<int,int>。C++17 起 CTAD 能自动推导，但项目和面试通常仍要求写全。' },
    { n: 88, id: 'd7c88', t: '类模板类外实现', day: 7, dep: 87, d: '每个类外成员函数前都要写 template<class T1,class T2>，函数名写成 Demo<T1,T2>::f；两样少一个都编译不过。' },
    { n: 89, id: 'd7c89', t: '类模板作参数', day: 7, dep: 87, d: '函数参数可以写死具体实例 Demo<string,int>&，也可以继续用模板泛型 Demo<T1,T2>；只写 Demo 会报 requires template arguments。' },
    { n: 90, id: 'd7c90', t: '模板派普通类', day: 7, dep: 87, d: '普通子类继承类模板时，必须在继承列表里写死父类类型，例如 public Parent<int,char>，否则编译器不知道对象要多大。' },
    { n: 91, id: 'd7c91', t: '模板派模板', day: 7, dep: 90, d: '子类自己也是模板时，把父类需要的类型从子类参数继续传下去，初始化列表里写 Parent<T1,T2>(a,b)。' },
    { n: 92, id: 'd7c92', t: '头源分离', day: 7, dep: 88, d: '模板在调用处才实例化，编译器必须看到完整定义。只把声明放 .h、定义放 .cpp，会在链接时报 undefined reference；解决是把声明和定义都写进 .hpp。' },
    { n: 93, id: 'd7c93', t: '类模板友元', day: 7, dep: 87, d: '全局函数做友元要么写成模板友元，要么写死某一组实例类型 Demo<int,int>；只写 friend void f() 对模板类不生效。' },
    { n: 94, id: 'd7c94', t: '动态数组模板', day: 7, dep: 88, d: '用 T* + capacity + size 写一个通用动态数组：add 满了就翻倍扩容，扩容后 delete[] 旧数组，拷贝构造和赋值要深拷贝。' },
    { n: 95, id: 'd7c95', t: '为什么用四种转换', day: 7, dep: 0, d: 'C 风格 (int)a 看不出意图，连 const 都能悄悄转掉。四种命名转换各管一类事，让意图可见、让编译器能检查，也方便搜索和审查。' },
    { n: 96, id: 'd7c96', t: 'static_cast', day: 7, dep: 95, d: '管基本类型转换和父子类指针转换。上行（子→父）安全，下行（父→子）不做运行时检查；不能去 const，也不能转无关类指针。' },
    { n: 97, id: 'd7c97', t: 'dynamic_cast', day: 7, dep: 96, d: '多态类型的安全下行转换，基类必须有虚函数。指针失败返回 nullptr，引用失败抛 bad_cast；上行时和 static_cast 效果一样。' },
    { n: 98, id: 'd7c98', t: 'const_cast', day: 7, dep: 95, d: '只对指针/引用加减 const，不能直接转 const 变量。如果对象本身真是常量，通过它改值是未定义行为。' },
    { n: 99, id: 'd7c99', t: 'reinterpret_cast', day: 7, dep: 95, d: '只按位重新解释，指针和整数、无关指针类型都能转，但平台相关、完全没有类型检查，是最后手段。' },
    { n: 100, id: 'd7c100', t: '四种转换怎么选', day: 7, dep: 99, d: '数值和上行用 static_cast，多态下行用 dynamic_cast，只改 const 用 const_cast，底层位模式才用 reinterpret_cast；C 风格不再用。' },
    { n: 101, id: 'd8c101', t: 'STL 是什么', day: 8, dep: 100, d: 'STL 是标准库里的容器、算法、迭代器三件套：容器装数据，算法按迭代器区间操作数据，迭代器在中间粘合。它是后面所有容器与算法的总纲。' },
    { n: 102, id: 'd8c102', t: '组件与算法分类', day: 8, dep: 101, d: '容器分序列式和关联式；算法分质变（会改元素）和非质变（只读）。分清这两组词，才知道 find 和 sort 的差别在哪。' },
    { n: 103, id: 'd8c103', t: '迭代器五种', day: 8, dep: 102, d: '输入、输出、前向、双向、随机访问五种迭代器能力逐级增强。vector 是随机访问，list 是双向，能力决定哪些算法能用在哪个容器上。' },
    { n: 104, id: 'd8c104', t: 'string 构造与拼接', day: 8, dep: 101, d: 'string 是自带长度、能自动扩容的字符容器：构造、赋值、+= 拼接、append 都比 C 字符串省心，不用再自己算 \0 和容量。' },
    { n: 105, id: 'd8c105', t: 'string 查找替换', day: 8, dep: 104, d: 'find 找不到返回 npos（不是 -1），substr 截子串，replace 换内容。判空要用 == string::npos，这是 string 最容易踩的一处。' },
    { n: 106, id: 'd8c106', t: 'string 与 C 串', day: 8, dep: 104, d: 'string 用 c_str() 交出只读的 const char*，C 字符串可以直接赋给 string。交给老接口用 c_str，接完不要再持有那个指针。' },
    { n: 107, id: 'd8c107', t: 'vector 基本用法', day: 8, dep: 101, d: 'vector 是会自己扩容的动态数组：push_back 尾插、[] 随机访问、size 取个数、迭代器遍历。日常存一串同类数据首选它。' },
    { n: 108, id: 'd8c108', t: 'vector 扩容', day: 8, dep: 107, d: 'size 是现有元素数，capacity 是已申请容量；满了再插会按倍数重新申请、搬过去、释放旧的。提前 reserve 能少搬几次。' },
    { n: 109, id: 'd8c109', t: 'vector 迭代器失效', day: 8, dep: 108, d: '扩容后旧迭代器、指针、引用全部失效；erase 之后被删位置及之后的迭代器失效。循环里删元素必须用 it = v.erase(it)，不能 it++ 再删。' },
    { n: 110, id: 'd8c110', t: 'vector 增删与收缩', day: 8, dep: 107, d: 'insert / erase 在中间动数据要整体搬移，代价高；swap 一个空 vector 能把 capacity 真正收回去。尾插尾删才是 vector 的强项。' },
    { n: 111, id: 'd8c111', t: 'vector 排序', day: 8, dep: 107, d: 'sort 默认升序，传 greater<int>() 变降序，传自定义比较函数按自己的规则排。排的是迭代器区间，升序降序只差第三个参数。' },
    { n: 112, id: 'd8c112', t: 'deque', day: 8, dep: 107, d: 'deque 是双端队列，头尾都能 O(1) 插入删除，也支持 [] 随机访问。需要两头都动就用它，只尾部动 vector 更省。' },
    { n: 113, id: 'd8c113', t: 'stack', day: 8, dep: 112, d: 'stack 是后进先出的适配器：push 压栈、top 看栈顶、pop 弹出（不返回值）。它默认用 deque 当底层容器，不能遍历。' },
    { n: 114, id: 'd8c114', t: 'queue', day: 8, dep: 112, d: 'queue 是先进先出：push 进队尾、front 看队头、pop 出队。同样不给迭代器，要遍历就得换 deque。' },
    { n: 115, id: 'd8c115', t: 'list', day: 8, dep: 107, d: 'list 是双向链表，任意位置插入删除 O(1)，但不支持 [] 随机访问，只能靠迭代器一步步走。频繁中间增删才选它。' },
    { n: 116, id: 'd8c116', t: 'list 进阶', day: 8, dep: 115, d: 'list 的迭代器是双向的，只能 ++ / --，不能 +n，要用 advance 移动；它自带 sort / reverse 成员函数，因为标准 sort 要求随机访问迭代器。' },
    { n: 117, id: 'd8c117', t: 'set', day: 8, dep: 111, d: 'set 自动去重并排好序，insert 时就把位置放对，find / count 是 O(log n)。它不给 []，元素也不能直接改，改要删了再插。' },
    { n: 118, id: 'd8c118', t: 'set 仿函数', day: 8, dep: 117, d: 'set 的第二个模板参数决定排序规则：默认 less<T> 升序，写 greater<T> 变降序，也可以传自定义仿函数。规则变了，去重口径也跟着变。' },
    { n: 119, id: 'd8c119', t: 'pair', day: 8, dep: 101, d: 'pair 把两个值捆成一个整体，用 first / second 访问，make_pair 最省事。它是 map 里 key-value 的基本单位。' },
    { n: 120, id: 'd8c120', t: 'map 插入遍历', day: 8, dep: 119, d: 'map 存 key-value，key 自动去重并排序；插入用 insert 或 m[key]，遍历拿到的是 pair。注意 m[key] 找不到会顺手插一个默认值。' },
    { n: 121, id: 'd8c121', t: 'map 查找删除', day: 8, dep: 120, d: 'find 返回迭代器，找不到返回 end()；count 只能告诉你 0 或 1；erase 可以按 key 或迭代器删。查之前别用 []，否则会污染容器。' },
    { n: 122, id: 'd8c122', t: '容器怎么选', day: 8, dep: 121, d: '默认 vector；要两头动 deque；要栈/队列用适配器；频繁中间增删 list；要去重排序 set；要按 key 查 map。先按操作特征选，再谈性能。' }
  ];
  var DAYNAME = { 1: 'Day 1 · 引用与传参', 2: 'Day 2 · 指针与内存', 3: 'Day 3 · 类与对象', 4: 'Day 4 · 静态与 this', 5: 'Day 5 · 重载与继承', 6: 'Day 6 · 多态与异常', 7: 'Day 7 · 模板与转换', 8: 'Day 8 · STL 与容器' };

  var BY = {};
  CARDS.forEach(function (c) { BY[c.n] = c; });

  /* ---------- 三关进度（与学习页共用同一份 localStorage） ---------- */
  var LV_KEY = 'cpp_card_levels_v2';
  var LV = {};
  try { LV = JSON.parse(localStorage.getItem(LV_KEY) || '{}') || {}; } catch (e) { LV = {}; }

  function lvCount(id) {
    var o = LV[id] || {};
    return (o.read ? 1 : 0) + (o.do ? 1 : 0) + (o.quiz ? 1 : 0);
  }
  function passed(id) { return lvCount(id) === 3; }

  var passedN = 0;
  CARDS.forEach(function (c) { if (passed(c.id)) passedN++; });
  document.getElementById('mProg').textContent = '已过 ' + passedN + '/' + CARDS.length;

  /* ---------- 桌面散点图 ---------- */
  var NW = 168, NH = 72, GAP = 26, PADX = 16, ROW0 = 34, ROWSTEP = 96, BANDGAP = 14;
  var ROWS = { 1: 1, 2: 2, 3: 2, 4: 3, 5: 4, 6: 3, 7: 4, 8: 4 };
  var FIRST = {}, CNT = {};
  var acc = 0;
  for (var d0 = 1; d0 <= 8; d0++) {
    FIRST[d0] = acc;
    CNT[d0] = CARDS.filter(function (c) { return c.day === d0; }).length;
    acc += CNT[d0];
  }
  var BANDTOP = {}, BANDH = {}, H = 0;
  for (var d1 = 1; d1 <= 8; d1++) {
    BANDTOP[d1] = H;
    BANDH[d1] = ROW0 + (ROWS[d1] - 1) * ROWSTEP + NH + 18;
    H += BANDH[d1] + BANDGAP;
  }
  H -= BANDGAP;
  var W = 1170;

  function posOf(c) {
    var i = c.n - 1 - FIRST[c.day];
    var row = Math.floor(i / 6), col = i % 6;
    return {
      x: PADX + col * (NW + GAP),
      y: BANDTOP[c.day] + ROW0 + row * ROWSTEP
    };
  }

  var stage = document.getElementById('mapStage');
  stage.style.width = W + 'px';
  stage.style.height = H + 'px';

  var html = [];
  for (var d = 1; d <= 8; d++) {
    html.push('<div class="band" style="top:' + BANDTOP[d] + 'px;height:' + BANDH[d] + 'px"></div>');
    html.push('<span class="bandname" style="top:' + (BANDTOP[d] + 10) + 'px">' + DAYNAME[d] + '</span>');
  }

  var svg = [];
  CARDS.forEach(function (c) {
    var p = posOf(c), n = lvCount(c.id);
    var st = n === 3 ? '✓' : n + '/3';
    html.push('<button class="node d' + c.day + '" type="button" ' +
      'style="left:' + p.x + 'px;top:' + p.y + 'px" data-n="' + c.n + '" ' +
      'aria-label="第 ' + c.n + ' 张 ' + c.t + '，三关 ' + (n === 3 ? '已通过' : n + ' 关已完成') + '">' +
      '<span class="nrow"><span class="nnum">' + (c.n < 10 ? '0' + c.n : c.n) + '</span>' +
      '<span class="nst' + (n === 3 ? ' ok' : '') + '">' + st + '</span></span>' +
      '<span class="nt">' + c.t + '</span>' +
      (c.x ? '<span class="nx">' + c.x + '</span>' : '') +
      '</button>');

    if (c.dep) {
      var pp = posOf(BY[c.dep]);
      var sameRow = Math.abs(pp.y - p.y) < 2;
      var path;
      if (sameRow) {
        var x1 = pp.x + NW, y1 = pp.y + NH / 2, x2 = p.x, y2 = p.y + NH / 2;
        path = 'M' + x1 + ' ' + y1 + ' C' + (x1 + 24) + ' ' + (y1 - 22) + ',' + (x2 - 24) + ' ' + (y2 - 22) + ',' + x2 + ' ' + y2;
      } else {
        var cx1 = pp.x + NW / 2, cy1 = pp.y + NH, cx2 = p.x + NW / 2, cy2 = p.y;
        path = 'M' + cx1 + ' ' + cy1 + ' C' + cx1 + ' ' + (cy1 + 34) + ',' + cx2 + ' ' + (cy2 - 34) + ',' + cx2 + ' ' + cy2;
      }
      svg.push('<path d="' + path + '" fill="none" stroke="#9AA3C0" stroke-width="1.6" stroke-dasharray="5 5" opacity=".7"/>');
    }
  });

  stage.insertAdjacentHTML('beforeend', html.join(''));
  var svgEl = document.getElementById('mapLines');
  svgEl.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  svgEl.setAttribute('width', W);
  svgEl.setAttribute('height', H);
  svgEl.innerHTML = svg.join('');

  /* ---------- 说明浮层 / 底部抽屉 ---------- */
  var tip = null, tipTimer = 0, tipPinned = false, cur = null;

  function isMobile() { return window.matchMedia('(max-width: 900px)').matches; }
  function numHtml(n) { return '<span class="tipnum d' + BY[n].day + '">' + (n < 10 ? '0' + n : n) + '</span>'; }
  function bodyHtml(c) {
    var dep = c.dep ? BY[c.dep] : null, n = lvCount(c.id);
    return '<div class="tiphead">' + numHtml(c.n) + '<span class="tipt">' + c.t + '</span></div>' +
      '<p class="tipdesc">' + c.d + '</p>' +
      '<div class="tipmeta"><span>前置：' + (dep ? '第 ' + dep.n + ' 张 ' + dep.t : '起点') + '</span>' +
      '<span>三关：' + (n === 3 ? '✓ 已过' : n + '/3') + '</span></div>' +
      '<button type="button" class="btn-main tipgo">进入卡片</button>';
  }

  function ensureTip() {
    if (tip) return;
    tip = document.createElement('div');
    tip.className = 'tipcard';
    tip.hidden = true;
    document.body.appendChild(tip);
    tip.addEventListener('mouseenter', function () { clearTimeout(tipTimer); });
    tip.addEventListener('mouseleave', function () { if (!tipPinned) tipTimer = setTimeout(hideTip, 220); });
    tip.addEventListener('click', function (e) {
      if (e.target.closest('.tipgo')) go(cur);
    });
  }

  function hideTip() {
    if (!tip) return;
    tip.hidden = true;
    tipPinned = false;
    cur = null;
  }

  function openTip(c, el, pin) {
    ensureTip();
    cur = c;
    tipPinned = !!pin;
    tip.innerHTML = bodyHtml(c);
    tip.style.left = '0px';
    tip.style.top = '0px';
    tip.hidden = false;
    var r = el.getBoundingClientRect();
    var tw = tip.offsetWidth, th = tip.offsetHeight;
    var left = r.right + 12;
    if (left + tw > window.innerWidth - 8) left = r.left - tw - 12;
    if (left < 8) left = 8;
    var top = r.top - 6;
    if (top + th > window.innerHeight - 8) top = window.innerHeight - th - 8;
    if (top < 8) top = 8;
    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
  }

  var mask = null, sheet = null;
  function ensureSheet() {
    if (mask) return;
    mask = document.createElement('div');
    mask.className = 'sheetmask';
    mask.hidden = true;
    sheet = document.createElement('div');
    sheet.className = 'sheet';
    mask.appendChild(sheet);
    document.body.appendChild(mask);
    mask.addEventListener('click', function (e) { if (e.target === mask) closeSheet(); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('.tipgo')) go(cur); });
  }
  function closeSheet() {
    if (!mask) return;
    mask.hidden = true;
    document.body.style.overflow = '';
    cur = null;
  }
  function openSheet(c) {
    ensureSheet();
    cur = c;
    sheet.innerHTML = '<span class="sheetbar"></span>' + bodyHtml(c);
    mask.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function go(c) {
    if (!c) return;
    location.href = 'index.html#' + c.id;
  }

  stage.addEventListener('click', function (e) {
    var b = e.target.closest('.node');
    if (!b) return;
    e.preventDefault();
    openTip(BY[+b.getAttribute('data-n')], b, true);
  });
  stage.addEventListener('mouseover', function (e) {
    if (isMobile() || tipPinned) return;
    var b = e.target.closest('.node');
    if (!b) return;
    clearTimeout(tipTimer);
    openTip(BY[+b.getAttribute('data-n')], b, false);
  });
  stage.addEventListener('mouseout', function (e) {
    var b = e.target.closest('.node');
    if (!b || tipPinned) return;
    tipTimer = setTimeout(hideTip, 240);
  });

  /* ---------- 手机树状列表 ---------- */
  function depthOf(c) {
    var d = 0, cur2 = c;
    while (cur2 && cur2.dep) { d++; cur2 = BY[cur2.dep]; if (d > 40) break; }
    return d;
  }

  var list = document.getElementById('mapList');
  var lh = [];
  for (var dd = 1; dd <= 8; dd++) {
    lh.push('<div class="mgroup"><p class="mgh"><i class="i' + dd + '" style="background:' +
      (dd === 1 ? 'var(--d1-ink)' : dd === 2 ? 'var(--d2-ink)' : dd === 3 ? 'var(--d3-ink)' : dd === 4 ? 'var(--d4-ink)' : dd === 5 ? 'var(--d5-ink)' : dd === 6 ? 'var(--d6-ink)' : dd === 7 ? 'var(--d7-ink)' : 'var(--d8-ink)') + '"></i>' + DAYNAME[dd] + '</p>');
    CARDS.filter(function (c) { return c.day === dd; }).forEach(function (c) {
      var n = lvCount(c.id), dep = c.dep ? BY[c.dep] : null;
      lh.push('<button class="mrow d' + c.day + '" type="button" data-n="' + c.n + '" ' +
        'style="padding-left:' + (12 + depthOf(c) * 14) + 'px" ' +
        'aria-label="第 ' + c.n + ' 张 ' + c.t + '">' +
        '<span class="mid">' + (c.n < 10 ? '0' + c.n : c.n) + '</span>' +
        '<span class="mtt">' + c.t +
        (dep ? '<em>前置：第 ' + dep.n + ' 张 ' + dep.t + '</em>' : '<em>起点</em>') +
        '</span>' +
        '<span class="mst' + (n === 3 ? ' ok' : '') + '">' + (n === 3 ? '✓' : n + '/3') + '</span>' +
        '</button>');
    });
    lh.push('</div>');
  }
  list.innerHTML = lh.join('');

  list.addEventListener('click', function (e) {
    var b = e.target.closest('.mrow');
    if (!b) return;
    e.preventDefault();
    openSheet(BY[+b.getAttribute('data-n')]);
  });

  document.addEventListener('click', function (e) {
    if (tip && !tip.hidden && !e.target.closest('.node') && !e.target.closest('.tipcard')) hideTip();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    hideTip();
    closeSheet();
  });
})();
