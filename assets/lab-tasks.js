/* 代码练习题目：题型固定为「读 stdin → 按格式打印 stdout」，测试用例在本地服务里逐条比对 */
window.LAB_TASKS = [
  {
    id: 'lab-ref',
    title: '引用：让函数真的改到外面',
    day: 'Day 1',
    cards: ['d1c02', 'd1c01'],
    brief: '补完 <code>swapRef</code>，让 <code>main</code> 里的两个变量真的换过来。只能用引用，不许用指针。',
    io: '输入：一行两个整数，用空格隔开。输出：交换后的两个整数，空格隔开，行尾换行。',
    starter: '#include <iostream>\nusing namespace std;\n\nvoid swapRef(int& a, int& b) {\n    // TODO: 交换 a 和 b\n}\n\nint main() {\n    int x, y;\n    cin >> x >> y;\n    swapRef(x, y);\n    cout << x << " " << y << endl;\n    return 0;\n}',
    answer: '#include <iostream>\nusing namespace std;\n\nvoid swapRef(int& a, int& b) {\n    int t = a;      // 先把 a 存起来\n    a = b;          // a 变成 b\n    b = t;          // b 拿回原来的 a\n}\n\nint main() {\n    int x, y;\n    cin >> x >> y;\n    swapRef(x, y);\n    cout << x << " " << y << endl;\n    return 0;\n}',
    cases: [
      { stdin: '3 8\n', expected: '8 3' },
      { stdin: '-1 5\n', expected: '5 -1' }
    ]
  },
  {
    id: 'lab-new',
    title: 'new / delete：按数量租一排房',
    day: 'Day 2',
    cards: ['d2c07', 'd2c10'],
    brief: '先读 <code>n</code>，再读 <code>n</code> 个整数，用 <code>new[]</code> 存起来，输出它们的和与最大值，最后用 <code>delete[]</code> 还回去。',
    io: '输入：第一行 n，第二行 n 个整数。输出：一行「和 最大值」，空格隔开。',
    starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    int* a = new int[n];   // 按运行时数量租地\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    int sum = 0, mx = a[0];\n    // TODO: 累加求和，并求最大值\n\n    cout << sum << " " << mx << endl;\n    // TODO: 把地还回去\n    return 0;\n}',
    answer: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    int* a = new int[n];\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    int sum = 0, mx = a[0];\n    for (int i = 0; i < n; i++) {\n        sum += a[i];\n        if (a[i] > mx) mx = a[i];\n    }\n    cout << sum << " " << mx << endl;\n\n    delete[] a;            // new[] 必须配 delete[]\n    return 0;\n}',
    cases: [
      { stdin: '5\n1 2 3 4 5\n', expected: '15 5' },
      { stdin: '3\n-2 7 0\n', expected: '5 7' }
    ]
  },
  {
    id: 'lab-ctor',
    title: '构造与析构：谁先出生，谁先退房',
    day: 'Day 3',
    cards: ['d3c22', 'd3c27'],
    brief: '补完 <code>Box</code> 的构造函数和析构函数：构造时打印 <code>ctor 编号</code>，析构时打印 <code>dtor 编号</code>，其余代码不要改，看输出顺序。',
    io: '输入：无。输出：按对象出生 / 退房顺序打印 6 行，编号是构造时传进来的整数。',
    starter: '#include <iostream>\nusing namespace std;\n\nclass Box {\n    int id;\npublic:\n    Box(int i) {\n        // TODO: 记下编号，并打印 ctor 编号\n    }\n    ~Box() {\n        // TODO: 打印 dtor 编号\n    }\n};\n\nint main() {\n    Box a(1);\n    {\n        Box b(2);\n    }\n    Box c(3);\n    return 0;\n}',
    answer: '#include <iostream>\nusing namespace std;\n\nclass Box {\n    int id;\npublic:\n    Box(int i) {\n        id = i;                              // 先记编号\n        cout << "ctor " << id << endl;       // 出生就打印\n    }\n    ~Box() {\n        cout << "dtor " << id << endl;       // 退房前打印\n    }\n};\n\nint main() {\n    Box a(1);\n    {\n        Box b(2);          // 进作用域：出生\n    }                      // 出作用域：先退房\n    Box c(3);\n    return 0;\n}',
    cases: [
      { stdin: '', expected: 'ctor 1\nctor 2\ndtor 2\nctor 3\ndtor 3\ndtor 1' }
    ]
  },
  {
    id: 'lab-copy',
    title: '深拷贝：两个对象各管各的内存',
    day: 'Day 3',
    cards: ['d3c23', 'd3c25'],
    brief: '补完 <code>Box</code> 的拷贝构造函数，让 <code>Box y = x;</code> 之后改 y 不影响 x。指针成员必须重新 <code>new</code> 一块。',
    io: '输入：一行两个整数 a b。输出：改过副本之后，原件和副本的值，空格隔开。',
    starter: '#include <iostream>\nusing namespace std;\n\nclass Box {\n    int* p;\npublic:\n    Box(int v) { p = new int(v); }\n    Box(const Box& o) {\n        // TODO: 深拷贝：自己 new 一块，再把值搬过来\n    }\n    ~Box() { delete p; }\n    void set(int v) { *p = v; }\n    int get() { return *p; }\n};\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    Box x(a);\n    Box y = x;      // 拷贝构造\n    y.set(b);       // 只改副本\n    cout << x.get() << " " << y.get() << endl;\n    return 0;\n}',
    answer: '#include <iostream>\nusing namespace std;\n\nclass Box {\n    int* p;\npublic:\n    Box(int v) { p = new int(v); }\n    Box(const Box& o) {\n        p = new int(*o.p);   // 自己租一块，把对方的值抄进来\n    }\n    ~Box() { delete p; }\n    void set(int v) { *p = v; }\n    int get() { return *p; }\n};\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    Box x(a);\n    Box y = x;\n    y.set(b);\n    cout << x.get() << " " << y.get() << endl;\n    return 0;\n}',
    cases: [
      { stdin: '1 9\n', expected: '1 9' },
      { stdin: '7 7\n', expected: '7 7' }
    ]
  }
];
