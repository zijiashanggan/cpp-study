window.SYLLABUS = [
  {
    "id": "day1",
    "title": "Day 1 · 引用这条主线",
    "nav": "Day 1 · 引用",
    "cards": 6,
    "desc": "每张卡都是「为什么需要它 → 生活比方 → 能跑的短例子 → 新手常错 → 一句话结论」。先看结论，再读代码，不要背。",
    "taskTitle": "Day 1 · 今天动手",
    "taskDesc": "两个小任务，不需要开发板，复制到 VS 或 g++ 里直接编译。先自己写，再对下面的预期输出；勾选状态会存在本机浏览器里。",
    "data": "data/day01.js",
    "bank": "data/bank/day01.js"
  },
  {
    "id": "day2",
    "title": "Day 2 · 内存、类型与函数规则",
    "nav": "Day 2 · 内存 / 类型",
    "cards": 12,
    "desc": "还是箱子那套比喻。Day 2 多了一个新东西：门牌号能自己申请、自己归还（new / delete）。每张卡同样按「动机 → 比方 → 例子和输出 → 常错 → 结论」走。",
    "taskTitle": "Day 2 · 今天动手",
    "taskDesc": "两个小任务，全部在本机跑。任务 2 是很多人栽过的坑：在函数里改指针，外面为什么没反应。",
    "data": "data/day02.js",
    "bank": "data/bank/day02.js"
  },
  {
    "id": "day3",
    "title": "Day 3 · 类、构造与析构",
    "nav": "Day 3 · 类与对象",
    "cards": 12,
    "desc": "今天的主线：把「数据」和「操作」捆成一个对象，再搞清楚对象出生（构造）和退房（析构）时自动发生什么。每张卡都会打出真实输出，照着顺序看。",
    "taskTitle": "Day 3 · 今天动手",
    "taskDesc": "今天两个任务是一组对照实验：先故意不写深拷贝，亲眼看到崩溃；再补上深拷贝，看同样的代码为什么就安全了。都在本机跑，不用开发板。",
    "data": "data/day03.js",
    "bank": "data/bank/day03.js"
  },
  {
    "id": "day4",
    "title": "Day 4 · 静态成员、this 与 const",
    "nav": "Day 4 · 静态 / this / const",
    "cards": 13,
    "desc": "今天把「全类共用一份（static）」和「每个对象自己的 this」分清楚，再用 const、友元把封装补完整，最后写一个真正会扩容的动态数组类。每张卡照样先给真实输出，先猜再看。",
    "taskTitle": "Day 4 · 今天动手",
    "taskDesc": "两个任务都在本机跑，不用开发板。任务 1 把静态计数器和单例放在一起看；任务 2 亲手给动态数组补上扩容和深拷贝，再故意删掉深拷贝看会发生什么。",
    "data": "data/day04.js",
    "bank": "data/bank/day04.js"
  },
  {
    "id": "day5",
    "title": "Day 5 · 运算符重载与继承",
    "nav": "Day 5 · 重载 / 继承",
    "cards": 19,
    "desc": "今天两件事：先让对象像内置类型一样用运算符（+、<<、++、==、()、* 和 ->），再把继承这条线走通，最后搞明白菱形继承为什么要 virtual。每张卡的输出都是真跑出来的，先猜再看。",
    "taskTitle": "Day 5 · 今天动手",
    "taskDesc": "两个任务都在本机跑。任务 1 把一套运算符接到同一个类上；任务 2 打印构造析构顺序，再用 sizeof 验证虚继承多出了什么。",
    "data": "data/day05.js",
    "bank": "data/bank/day05.js"
  },
  {
    "id": "day6",
    "title": "Day 6 · 多态与异常",
    "nav": "Day 6 · 多态 / 异常",
    "cards": 18,
    "desc": "今天的重心在多态：virtual 让父类指针按真实类型调用，接着是 vptr / vtable、重载重定义重写、抽象类、虚析构。后半段进异常，从 throw / try / catch 到严格类型匹配、栈解旋、引用接异常和自定义异常类。每张卡的输出都是真跑出来的。",
    "taskTitle": "Day 6 · 今天动手",
    "taskDesc": "两个任务都在本机跑。任务 1 把「纯虚函数 + 虚函数 + 虚析构」串成一个能多态调用的形状类；任务 2 走一遍「栈解旋 + 自定义异常 + 基类引用接住」。",
    "data": "data/day06.js",
    "bank": "data/bank/day06.js"
  },
  {
    "id": "day7",
    "title": "Day 7 · 模板与类型转换",
    "nav": "Day 7 · 模板 / 转换",
    "cards": 20,
    "desc": "今天两条线：模板把类型参数化，函数模板、类模板、类外实现、头源分离是主干；最后把 C++ 的四种类型转换一次分清。示例全部真编译真跑。",
    "taskTitle": "Day 7 · 今天动手",
    "taskDesc": "两个任务：用函数模板写交换和排序；把四种转换各用一次，看清每种转换的边界。",
    "data": "data/day07.js",
    "bank": "data/bank/day07.js"
  }
];
