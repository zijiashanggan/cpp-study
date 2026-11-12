/* 代码练习题目：题型固定为「读 stdin → 按格式打印 stdout」，测试用例在本地服务里逐条比对 */
window.LAB_TASKS = [
  {
    id: 'lab-ref',
    title: '引用：让函数真的改到外面',
    day: 'Day 1',
    level: '入门',
    cards: ['d1c02', 'd1c01'],
    brief: '补完 <code>swapRef</code>，让 <code>main</code> 里的两个变量真的换过来。只能用引用，不许用指针。',
    io: '输入：一行两个整数，用空格隔开。输出：交换后的两个整数，空格隔开，行尾换行。',
    starter: `#include <iostream>
using namespace std;

void swapRef(int& a, int& b) {
    // TODO: 交换 a 和 b
    // 本例：调用时 a = 3、b = 8；交换后应是 a = 8、b = 3
}

int main() {
    int x, y;
    cin >> x >> y;          // 示例输入：3 8
    swapRef(x, y);
    cout << x << " " << y << endl;
    return 0;
}`,
    answer: `#include <iostream>
using namespace std;

void swapRef(int& a, int& b) {
    int t = a;      // 先把 a 存起来
    a = b;          // a 变成 b
    b = t;          // b 拿回原来的 a
}

int main() {
    int x, y;
    cin >> x >> y;
    swapRef(x, y);
    cout << x << " " << y << endl;
    return 0;
}`,
    cases: [
      { stdin: '3 8\n', expected: '8 3' },
      { stdin: '-1 5\n', expected: '5 -1' }
    ]
  },
  {
    id: 'lab-swap3',
    title: '三种 swap：抄一份 / 递门牌号 / 递原件',
    day: 'Day 1',
    level: '入门',
    cards: ['d1c02', 'd1c01'],
    brief: '同一个交换，用三种写法各写一遍：值传递（改不到外面）、指针版、引用版。补完 <code>swapPtr</code> 和 <code>swapRef</code>，看三行输出差在哪。',
    io: '输入：一行两个整数。输出：三行，分别是值传递、指针版、引用版之后的 x y。',
    starter: `#include <iostream>
using namespace std;

// 值传递：函数里改的是副本
void swapVal(int a, int b) {
    int t = a; a = b; b = t;
}

/* 本例：main 里 x = 3、y = 8（cin 读到 3 8）
   期望三行：3 8（值传递没换成）→ 8 3（指针版换了）→ 3 8（引用版又换回来） */

// 指针版：递门牌号
void swapPtr(int* a, int* b) {
    // TODO: 交换 *a 和 *b；本例 *a = 3、*b = 8，换完应是 8 和 3
}

// 引用版：递原件
void swapRef(int& a, int& b) {
    // TODO: 交换 a 和 b
}

int main() {
    int x, y;
    cin >> x >> y;
    swapVal(x, y);
    cout << x << " " << y << endl;
    swapPtr(&x, &y);
    cout << x << " " << y << endl;
    swapRef(x, y);
    cout << x << " " << y << endl;
    return 0;
}`,
    answer: `#include <iostream>
using namespace std;

void swapVal(int a, int b) {
    int t = a; a = b; b = t;      // 只换了副本，外面没变
}

void swapPtr(int* a, int* b) {
    int t = *a;                   // 顺着地址取到原件
    *a = *b;
    *b = t;
}

void swapRef(int& a, int& b) {
    int t = a;                    // a、b 本身就是原件
    a = b;
    b = t;
}

int main() {
    int x, y;
    cin >> x >> y;
    swapVal(x, y);
    cout << x << " " << y << endl;   // 原样
    swapPtr(&x, &y);
    cout << x << " " << y << endl;   // 换了
    swapRef(x, y);
    cout << x << " " << y << endl;   // 又换回来
    return 0;
}`,
    cases: [
      { stdin: '3 8\n', expected: '3 8\n8 3\n3 8' },
      { stdin: '-1 5\n', expected: '-1 5\n5 -1\n-1 5' }
    ]
  },
  {
    id: 'lab-constref',
    title: 'const 引用：借看，但不许改',
    day: 'Day 1',
    level: '入门',
    cards: ['d1c03', 'd1c01'],
    brief: '补完 <code>len</code> 和 <code>first</code>。参数是 <code>const string&amp;</code>：不拷贝整串、也不许在函数里改它。空串是边界情况，首字符返回 <code>-</code>。',
    io: '输入：一行字符串（可能为空行）。输出：长度 首字符，空格隔开。',
    starter: `#include <iostream>
#include <string>
using namespace std;

// const 引用：能读、不能改，也不会拷贝一份
/* 本例：main 里 getline 读到 s = "hello"
   len(s) 应返回 5，first(s) 应返回 'h'；空串时是 0 和 '-' */

int len(const string& s) {
    // TODO: 返回长度
    return 0;
}

char first(const string& s) {
    // TODO: 空串返回 '-'，否则返回第一个字符
    return '?';
}

int main() {
    string s;
    getline(cin, s);        // 示例输入：hello
    cout << len(s) << " " << first(s) << endl;
    return 0;
}`,
    answer: `#include <iostream>
#include <string>
using namespace std;

int len(const string& s) {
    return (int)s.size();       // 只读，不会拷一份
}

char first(const string& s) {
    if (s.empty()) return '-';  // 空串是边界
    return s[0];
}

int main() {
    string s;
    getline(cin, s);        // 示例输入：hello
    cout << len(s) << " " << first(s) << endl;
    return 0;
}`,
    cases: [
      { stdin: 'hello\n', expected: '5 h' },
      { stdin: '\n', expected: '0 -' }
    ]
  },
  {
    id: 'lab-new',
    title: 'new / delete：按数量租一排房',
    day: 'Day 2',
    level: '入门',
    cards: ['d2c07', 'd2c10'],
    brief: '先读 <code>n</code>，再读 <code>n</code> 个整数，用 <code>new[]</code> 存起来，输出它们的和与最大值，最后用 <code>delete[]</code> 还回去。',
    io: '输入：第一行 n，第二行 n 个整数。输出：一行「和 最大值」，空格隔开。',
    starter: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;              // 示例输入：5，接着读 1 2 3 4 5
    int* a = new int[n];   // 按运行时数量租地
    for (int i = 0; i < n; i++) cin >> a[i];

    int sum = 0, mx = a[0];
    // TODO: 累加求和，并求最大值
    // 本例 n = 5、数组 1 2 3 4 5：sum = 15、mx = 5，输出 15 5

    cout << sum << " " << mx << endl;
    // TODO: 把地还回去
    return 0;
}`,
    answer: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int* a = new int[n];
    for (int i = 0; i < n; i++) cin >> a[i];

    int sum = 0, mx = a[0];
    for (int i = 0; i < n; i++) {
        sum += a[i];
        if (a[i] > mx) mx = a[i];
    }
    cout << sum << " " << mx << endl;

    delete[] a;            // new[] 必须配 delete[]
    return 0;
}`,
    cases: [
      { stdin: '5\n1 2 3 4 5\n', expected: '15 5' },
      { stdin: '3\n-2 7 0\n', expected: '5 7' }
    ]
  },
  {
    id: 'lab-decay',
    title: '数组退化：进函数就不是数组了',
    day: 'Day 2',
    level: '进阶',
    cards: ['d2c09', 'd2c10'],
    brief: '数组名一进函数就退化成指针，<code>sizeof(a)</code> 变成指针大小。补完 <code>kind</code>：判断 <code>sizeof(a)</code> 是否等于 <code>sizeof(int*)</code>，相等返回 <code>decay</code>；再补完 <code>sum</code>，靠额外传的 n 来遍历。',
    io: '输入：第一行 n，第二行 n 个整数。输出：一行「decay 和」，空格隔开。',
    starter: `#include <iostream>
using namespace std;

/* 本例：n = 5，数组是 1 2 3 4 5
   kind(a) 应返回 "decay"，sum(a, 5) 应得 15 → 输出 decay 15 */

// 数组一进函数就退化成指针
const char* kind(int a[]) {
    // TODO: sizeof(a) 和 sizeof(int*) 相等就返回 "decay"
    return "?";
}

int sum(int a[], int n) {
    int s = 0;
    // TODO: 用 n 当边界累加
    return s;
}

int main() {
    int a[100];
    int n;
    cin >> n;               // 示例输入：5，接着读 1 2 3 4 5
    for (int i = 0; i < n; i++) cin >> a[i];
    cout << kind(a) << " " << sum(a, n) << endl;
    return 0;
}`,
    answer: `#include <iostream>
using namespace std;

const char* kind(int a[]) {
    // 函数参数里的 a 已经是指针，和 int* 一样大
    return sizeof(a) == sizeof(int*) ? "decay" : "array";
}

int sum(int a[], int n) {
    int s = 0;
    for (int i = 0; i < n; i++) s += a[i];   // 只能靠 n 当边界
    return s;
}

int main() {
    int a[100];
    int n;
    cin >> n;               // 示例输入：5，接着读 1 2 3 4 5
    for (int i = 0; i < n; i++) cin >> a[i];
    cout << kind(a) << " " << sum(a, n) << endl;
    return 0;
}`,
    cases: [
      { stdin: '5\n1 2 3 4 5\n', expected: 'decay 15' },
      { stdin: '1\n7\n', expected: 'decay 7' }
    ]
  },
  {
    id: 'lab-ctor',
    title: '构造与析构：谁先出生，谁先退房',
    day: 'Day 3',
    level: '入门',
    cards: ['d3c22', 'd3c27'],
    brief: '补完 <code>Box</code> 的构造函数和析构函数：构造时打印 <code>ctor 编号</code>，析构时打印 <code>dtor 编号</code>，其余代码不要改，看输出顺序。',
    io: '输入：无。输出：按对象出生 / 退房顺序打印 6 行，编号是构造时传进来的整数。',
    starter: `#include <iostream>
using namespace std;

/* 本例：main 里依次构造编号 1、2、3 的三个对象
   期望输出 ctor 1 → ctor 2 → dtor 2 → ctor 3 → dtor 3 → dtor 1 */

class Box {
    int id;
public:
    Box(int i) {
        // TODO: 记下编号，并打印 ctor 编号
    }
    ~Box() {
        // TODO: 打印 dtor 编号
    }
};

int main() {
    Box a(1);
    {
        Box b(2);
    }
    Box c(3);
    return 0;
}`,
    answer: `#include <iostream>
using namespace std;

class Box {
    int id;
public:
    Box(int i) {
        id = i;                              // 先记编号
        cout << "ctor " << id << endl;       // 出生就打印
    }
    ~Box() {
        cout << "dtor " << id << endl;       // 退房前打印
    }
};

int main() {
    Box a(1);
    {
        Box b(2);          // 进作用域：出生
    }                      // 出作用域：先退房
    Box c(3);
    return 0;
}`,
    cases: [
      { stdin: '', expected: 'ctor 1\nctor 2\ndtor 2\nctor 3\ndtor 3\ndtor 1' }
    ]
  },
  {
    id: 'lab-copyctor',
    title: '拷贝构造：被拷贝了几次，心里要有数',
    day: 'Day 3',
    level: '进阶',
    cards: ['d3c23', 'd3c24'],
    brief: '补完拷贝构造函数：每发生一次拷贝就把静态计数器 <code>copies</code> 加一。普通构造不计数，别写错地方。',
    io: '输入：一行两个整数 a b。输出：拷贝次数、两个副本的值，空格隔开。',
    starter: `#include <iostream>
using namespace std;

class Track {
    int v;
public:
    static int copies;          // 拷贝发生了几次
    Track(int x) : v(x) {}      // 普通构造，不计数
    Track(const Track& o) : v(o.v) {
        // TODO: 拷贝次数 +1
    }
    /* 本例 a = 5、b = 9：x 拷给 y、z 拷给 w，一共 2 次拷贝
       输出「2 5 9」——拷贝次数、y 的值、w 的值 */
    int val() const { return v; }
};
int Track::copies = 0;

int main() {
    int a, b;
    cin >> a >> b;          // 示例输入：5 9
    Track x(a);
    Track y = x;      // 拷贝构造一次
    Track z(b);
    Track w = z;      // 再一次
    cout << Track::copies << " " << y.val() << " " << w.val() << endl;
    return 0;
}`,
    answer: `#include <iostream>
using namespace std;

class Track {
    int v;
public:
    static int copies;
    Track(int x) : v(x) {}
    Track(const Track& o) : v(o.v) {
        copies++;            // 只有拷贝构造会走到这里
    }
    int val() const { return v; }
};
int Track::copies = 0;

int main() {
    int a, b;
    cin >> a >> b;          // 示例输入：5 9
    Track x(a);
    Track y = x;
    Track z(b);
    Track w = z;
    cout << Track::copies << " " << y.val() << " " << w.val() << endl;
    return 0;
}`,
    cases: [
      { stdin: '5 9\n', expected: '2 5 9' },
      { stdin: '-3 0\n', expected: '2 -3 0' }
    ]
  },
  {
    id: 'lab-copy',
    title: '深拷贝：两个对象各管各的内存',
    day: 'Day 3',
    level: '进阶',
    cards: ['d3c23', 'd3c25'],
    brief: '补完 <code>Box</code> 的拷贝构造函数，让 <code>Box y = x;</code> 之后改 y 不影响 x。指针成员必须重新 <code>new</code> 一块。',
    io: '输入：一行两个整数 a b。输出：改过副本之后，原件和副本的值，空格隔开。',
    starter: `#include <iostream>
using namespace std;

class Box {
    int* p;
public:
    Box(int v) { p = new int(v); }
    Box(const Box& o) {
        // TODO: 深拷贝：自己 new 一块，再把值搬过来
    }
    /* 本例 a = 1、b = 9：x 里存的是 1，y 拷一份后改成 9
       输出「1 9」——x 没被 y 改动 */
    ~Box() { delete p; }
    void set(int v) { *p = v; }
    int get() { return *p; }
};

int main() {
    int a, b;
    cin >> a >> b;          // 示例输入：1 9
    Box x(a);
    Box y = x;      // 拷贝构造
    y.set(b);       // 只改副本
    cout << x.get() << " " << y.get() << endl;
    return 0;
}`,
    answer: `#include <iostream>
using namespace std;

class Box {
    int* p;
public:
    Box(int v) { p = new int(v); }
    Box(const Box& o) {
        p = new int(*o.p);   // 自己租一块，把对方的值抄进来
    }
    ~Box() { delete p; }
    void set(int v) { *p = v; }
    int get() { return *p; }
};

int main() {
    int a, b;
    cin >> a >> b;
    Box x(a);
    Box y = x;
    y.set(b);
    cout << x.get() << " " << y.get() << endl;
    return 0;
}`,
    cases: [
      { stdin: '1 9\n', expected: '1 9' },
      { stdin: '7 7\n', expected: '7 7' }
    ]
  },
  {
    id: 'lab-static',
    title: '静态成员：全班共用一块白板',
    day: 'Day 4',
    level: '入门',
    cards: ['d4c31', 'd4c32'],
    brief: '补完构造和析构：每造一个对象 <code>made</code> 和 <code>alive</code> 都加一，每析构一个 <code>alive</code> 减一。两个静态成员全类共用一份。',
    io: '输入：一个整数 n。输出：一共造过几个、现在还剩几个，空格隔开。',
    starter: `#include <iostream>
using namespace std;

class Counter {
public:
    static int made;    // 一共造过几个
    static int alive;   // 现在活着的
    Counter() {
        // TODO: 两个计数都 +1
    }
    ~Counter() {
        // TODO: 活着的 -1
    }
    /* 本例 n = 3：keep 加 3 个 tmp，一共造 4 个、最后只剩 keep 活着
       输出「4 1」 */
};
int Counter::made = 0;
int Counter::alive = 0;

int main() {
    int n;
    cin >> n;               // 示例输入：3
    Counter keep;              // 一个长期活着的
    for (int i = 0; i < n; i++) {
        Counter tmp;           // 每轮造一个，出作用域就析构
    }
    cout << Counter::made << " " << Counter::alive << endl;
    return 0;
}`,
    answer: `#include <iostream>
using namespace std;

class Counter {
public:
    static int made;
    static int alive;
    Counter() {
        made++;             // 全类共用，不是每个对象一份
        alive++;
    }
    ~Counter() {
        alive--;
    }
};
int Counter::made = 0;
int Counter::alive = 0;

int main() {
    int n;
    cin >> n;
    Counter keep;
    for (int i = 0; i < n; i++) {
        Counter tmp;
    }
    cout << Counter::made << " " << Counter::alive << endl;
    return 0;
}`,
    cases: [
      { stdin: '3\n', expected: '4 1' },
      { stdin: '0\n', expected: '1 1' }
    ]
  },
  {
    id: 'lab-singleton',
    title: '单例：怎么要都是同一个',
    day: 'Day 4',
    level: '进阶',
    cards: ['d4c36', 'd4c34'],
    brief: '补完 <code>Config::inst()</code>：用函数内静态局部变量，保证只造一次、每次返回同一个对象。两次取到的东西地址必须相同。',
    io: '输入：一行两个整数 a b。输出：地址是否相同（same/diff）、最后一次设置的值。',
    starter: `#include <iostream>
using namespace std;

class Config {
    int v;
    Config() : v(0) {}          // 构造私有：外面造不出来
public:
    static Config& inst() {
        // TODO: 用静态局部变量，只造一次
        // 本例 a = 1、b = 9：p 和 q 必须是同一个对象，b 会盖掉 a
        // 期望输出 same 9
        static Config* p = nullptr;
        return *p;
    }
    void set(int x) { v = x; }
    int get() const { return v; }
};

int main() {
    int a, b;
    cin >> a >> b;          // 示例输入：1 9
    Config& p = Config::inst();
    p.set(a);
    Config& q = Config::inst();
    q.set(b);
    cout << (&p == &q ? "same" : "diff") << " " << p.get() << endl;
    return 0;
}`,
    answer: `#include <iostream>
using namespace std;

class Config {
    int v;
    Config() : v(0) {}
public:
    static Config& inst() {
        static Config s;        // 第一次进到这里才造，之后都是它
        return s;
    }
    void set(int x) { v = x; }
    int get() const { return v; }
};

int main() {
    int a, b;
    cin >> a >> b;          // 示例输入：1 9
    Config& p = Config::inst();
    p.set(a);
    Config& q = Config::inst();
    q.set(b);
    cout << (&p == &q ? "same" : "diff") << " " << p.get() << endl;
    return 0;
}`,
    cases: [
      { stdin: '1 9\n', expected: 'same 9' },
      { stdin: '0 0\n', expected: 'same 0' }
    ]
  },
  {
    id: 'lab-sizeof',
    title: 'sizeof 与对齐：结构体为什么会变大',
    day: 'Day 4',
    level: '进阶',
    cards: ['d4c37'],
    brief: '成员之间有内存对齐填充。补完输出：<code>sizeof(Node)</code> 和一个数组占的总字节数。别手写 8，用 <code>sizeof</code> 让编译器算。',
    io: '输入：一个整数 n。输出：单个 Node 的字节数、n 个 Node 的总字节数，空格隔开。',
    starter: `#include <iostream>
using namespace std;

struct Node {
    char c;     // 1 字节
    int i;      // 4 字节，前面要补 3 字节才能对齐
};

int main() {
    int n;
    cin >> n;               // 示例输入：3
    // TODO: 输出 sizeof(Node) 和 n 个 Node 的总字节
    // 本例 n = 3：char 1 + int 4 + 补齐 3 = 8 字节，3 个共 24，输出 8 24
    cout << 0 << " " << 0 << endl;
    return 0;
}`,
    answer: `#include <iostream>
using namespace std;

struct Node {
    char c;
    int i;
};

int main() {
    int n;
    cin >> n;
    cout << sizeof(Node) << " " << (long long)n * sizeof(Node) << endl;
    return 0;
}`,
    cases: [
      { stdin: '3\n', expected: '8 24' },
      { stdin: '0\n', expected: '8 0' }
    ]
  },
  {
    id: 'lab-grow',
    title: '动态数组扩容：满了就翻倍',
    day: 'Day 4',
    level: '进阶',
    cards: ['d4c43', 'd2c07'],
    brief: '补完 <code>push</code> 的最后一步：把新值放进 <code>p[n]</code>，再把 <code>n</code> 加一。前面的扩容逻辑已经给好了，重点看容量怎么翻倍。',
    io: '输入：第一行 n，第二行 n 个整数。输出：最终容量、按顺序的所有元素，各占一行。',
    starter: `#include <iostream>
using namespace std;

class Dyn {
    int* p;
    int n;
    int cap;
public:
    Dyn() : n(0), cap(1) { p = new int[1]; }
    ~Dyn() { delete[] p; }
    void push(int v) {
        if (n == cap) {                 // 满了：容量翻倍
            int nc = cap * 2;
            int* q = new int[nc];
            for (int i = 0; i < n; i++) q[i] = p[i];
            delete[] p;
            p = q;
            cap = nc;
        }
        // TODO: 把 v 放进 p[n]，n 加一
        // 本例依次 push 1 2 3 4 5：容量 1 → 2 → 4 → 8
        // 输出第一行 8，第二行 1 2 3 4 5
    }
    int size() const { return n; }
    int capacity() const { return cap; }
    int at(int i) const { return p[i]; }
};

int main() {
    int n;
    cin >> n;               // 示例输入：5，接着读 1 2 3 4 5
    Dyn d;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        d.push(x);
    }
    cout << d.capacity() << endl;
    for (int i = 0; i < d.size(); i++) cout << d.at(i) << (i + 1 == d.size() ? "" : " ");
    cout << endl;
    return 0;
}`,
    answer: `#include <iostream>
using namespace std;

class Dyn {
    int* p;
    int n;
    int cap;
public:
    Dyn() : n(0), cap(1) { p = new int[1]; }
    ~Dyn() { delete[] p; }
    void push(int v) {
        if (n == cap) {
            int nc = cap * 2;
            int* q = new int[nc];
            for (int i = 0; i < n; i++) q[i] = p[i];
            delete[] p;
            p = q;
            cap = nc;
        }
        p[n] = v;           // 先放进去
        n++;                // 再挪一下"已用"标记
    }
    int size() const { return n; }
    int capacity() const { return cap; }
    int at(int i) const { return p[i]; }
};

int main() {
    int n;
    cin >> n;               // 示例输入：5，接着读 1 2 3 4 5
    Dyn d;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        d.push(x);
    }
    cout << d.capacity() << endl;
    for (int i = 0; i < d.size(); i++) cout << d.at(i) << (i + 1 == d.size() ? "" : " ");
    cout << endl;
    return 0;
}`,
    cases: [
      { stdin: '5\n1 2 3 4 5\n', expected: '8\n1 2 3 4 5' },
      { stdin: '0\n', expected: '1' }
    ]
  },
  {
    id: 'lab-refreturn',
    title: '返回引用：把函数调用写在等号左边',
    day: 'Day 1',
    level: '进阶',
    cards: ['d1c06', 'd1c02'],
    brief: '补完 <code>val()</code>，让它返回成员 <code>v</code> 的引用（<code>int&amp;</code>，不是 <code>int</code>）。只有返回引用，<code>x.val() = b</code> 才会真的写进对象里。',
    io: '输入：一行两个整数 a b。输出：把 b 写进去之后，对象里的值。',
    starter: `#include <iostream>
using namespace std;

class Box {
    int v;
public:
    Box(int x) : v(x) {}
    int& val() {
        // TODO: 返回成员 v 的引用，别返回局部变量
        // 本例 a = 3、b = 8：x.val() = b 把 8 写进对象，输出 8
        static int tmp = 0;
        return tmp;
    }
};

int main() {
    int a, b;
    cin >> a >> b;          // 示例输入：3 8
    Box x(a);
    x.val() = b;        // 调用在等号左边
    cout << x.val() << endl;
    return 0;
}`,
    answer: `#include <iostream>
using namespace std;

class Box {
    int v;
public:
    Box(int x) : v(x) {}
    int& val() {
        return v;       // 返回的是成员本身，不是副本
    }
};

int main() {
    int a, b;
    cin >> a >> b;
    Box x(a);
    x.val() = b;        // 等价于改 x.v
    cout << x.val() << endl;
    return 0;
}`,
    cases: [
      { stdin: '3 8\n', expected: '8' },
      { stdin: '-1 0\n', expected: '0' }
    ]
  },
  {
    id: 'lab-nullptr',
    title: 'nullptr：先看有没有门牌号，再进门',
    day: 'Day 2',
    level: '入门',
    cards: ['d2c08'],
    brief: '补完 <code>safeGet</code>：指针为空时返回 0，不为空才解引用。输入 0 时故意不分配内存，用来验证空指针分支。',
    io: '输入：一个整数 n。输出：n 不为 0 时输出 n，为 0 时输出 0。',
    starter: `#include <iostream>
using namespace std;

/* 本例 n = 5：会 new 一个装着 5 的指针，输出 5
   n = 0 时故意不分配，指针为空，应走判空分支输出 0 */

int safeGet(int* p) {
    // TODO: p 为空返回 0，否则返回 *p
    return 0;
}

int main() {
    int n;
    cin >> n;               // 示例输入：5
    int* p = nullptr;
    if (n != 0) p = new int(n);
    cout << safeGet(p) << endl;
    delete p;
    return 0;
}`,
    answer: `#include <iostream>
using namespace std;

int safeGet(int* p) {
    if (p == nullptr) return 0;   // 先看门牌号在不在
    return *p;
}

int main() {
    int n;
    cin >> n;               // 示例输入：5
    int* p = nullptr;
    if (n != 0) p = new int(n);
    cout << safeGet(p) << endl;
    delete p;                    // delete nullptr 是安全的
    return 0;
}`,
    cases: [
      { stdin: '5\n', expected: '5' },
      { stdin: '0\n', expected: '0' }
    ]
  },
  {
    id: 'lab-stackheap',
    title: '栈与堆：一个自动退房，一个要你亲手退',
    day: 'Day 2',
    level: '进阶',
    cards: ['d2c10', 'd2c07'],
    brief: '栈上的对象出作用域自动析构；堆上的对象必须自己 <code>delete</code>。补上缺的那句 <code>delete h;</code>，让两边的析构顺序对上。',
    io: '输入：一个整数 n。输出：构造 / 析构打印的 4 行，编号依次是 n、n+1。',
    starter: `#include <iostream>
using namespace std;

class Item {
    int id;
public:
    Item(int i) : id(i) { cout << "+" << id << endl; }
    ~Item() { cout << "-" << id << endl; }
};

int main() {
    int n;
    cin >> n;               // 示例输入：5
    {
        Item s(n);                    // 栈：出作用域自动析构
        Item* h = new Item(n + 1);    // 堆：不 delete 就不析构
        // TODO: 手动把 h 退房
        // 本例 n = 5：栈对象编号 5、堆对象编号 6
        // 期望顺序 +5 → +6 → -6 → -5（堆的先退，栈的后退）
    }
    return 0;
}`,
    answer: `#include <iostream>
using namespace std;

class Item {
    int id;
public:
    Item(int i) : id(i) { cout << "+" << id << endl; }
    ~Item() { cout << "-" << id << endl; }
};

int main() {
    int n;
    cin >> n;               // 示例输入：5
    {
        Item s(n);                    // 栈：出作用域自动析构
        Item* h = new Item(n + 1);    // 堆：要自己管
        delete h;                     // 手动退房，先于栈对象
    }                                 // 栈对象 s 到这里才析构
    return 0;
}`,
    cases: [
      { stdin: '5\n', expected: '+5\n+6\n-6\n-5' },
      { stdin: '0\n', expected: '+0\n+1\n-1\n-0' }
    ]
  },
  {
    id: 'lab-overload',
    title: '函数重载：同名不同参数，别看返回值',
    day: 'Day 2',
    level: '进阶',
    cards: ['d2c15'],
    brief: '同一个 <code>area</code> 写两个版本：一个参数算正方形，两个参数算长方形。补完两个函数体。',
    io: '输入：一行三个整数 a b c。输出：a 的正方形面积、b×c 的长方形面积，空格隔开。',
    starter: `#include <iostream>
using namespace std;

/* 本例 a = 5、b = 3、c = 4：
   area(5) 走一个参数的版本得 25，area(3, 4) 走两个参数的版本得 12 */

// 一个参数：正方形
int area(int s) {
    // TODO
    return 0;
}

// 两个参数：长方形
int area(int w, int h) {
    // TODO
    return 0;
}

int main() {
    int a, b, c;
    cin >> a >> b >> c;     // 示例输入：5 3 4
    cout << area(a) << " " << area(b, c) << endl;
    return 0;
}`,
    answer: `#include <iostream>
using namespace std;

int area(int s) {
    return s * s;
}

int area(int w, int h) {
    return w * h;
}

int main() {
    int a, b, c;
    cin >> a >> b >> c;     // 示例输入：5 3 4
    cout << area(a) << " " << area(b, c) << endl;
    return 0;
}`,
    cases: [
      { stdin: '5 3 4\n', expected: '25 12' },
      { stdin: '0 7 0\n', expected: '0 0' }
    ]
  },
  {
    id: 'lab-defaultarg',
    title: '默认参数：不传就用默认值',
    day: 'Day 2',
    level: '入门',
    cards: ['d2c14'],
    brief: '补完 <code>power</code>，第二个参数默认是 2。调用 <code>power(n)</code> 算平方，<code>power(n, 3)</code> 算立方。',
    io: '输入：一个整数 n。输出：n 的平方和立方，空格隔开。',
    starter: `#include <iostream>
using namespace std;

/* 本例 n = 3：power(3) 用默认 exp = 2 得 9
   power(3, 3) 显式传 3 得 27 → 输出 9 27 */

int power(int base, int exp = 2) {
    // TODO: 用循环把 base 乘 exp 次
    return 0;
}

int main() {
    int n;
    cin >> n;               // 示例输入：3
    cout << power(n) << " " << power(n, 3) << endl;
    return 0;
}`,
    answer: `#include <iostream>
using namespace std;

int power(int base, int exp = 2) {
    int r = 1;
    for (int i = 0; i < exp; i++) r *= base;
    return r;
}

int main() {
    int n;
    cin >> n;               // 示例输入：3
    cout << power(n) << " " << power(n, 3) << endl;
    return 0;
}`,
    cases: [
      { stdin: '3\n', expected: '9 27' },
      { stdin: '0\n', expected: '0 0' }
    ]
  },
  {
    id: 'lab-constmethod',
    title: 'const 成员函数：常对象只认这道门',
    day: 'Day 4',
    level: '进阶',
    cards: ['d4c40', 'd4c41'],
    brief: '常对象 <code>const Rect r</code> 只能调用 const 成员函数。补完 <code>area() const</code> 的函数体，顺便体会这个 <code>const</code> 不能删。',
    io: '输入：一行两个整数 w h。输出：面积。',
    starter: `#include <iostream>
using namespace std;

class Rect {
    int w, h;
public:
    Rect(int a, int b) : w(a), h(b) {}
    int area() const {      // 这个 const 不能删：常对象只能调它
        // TODO: 返回 w * h
        // 本例 w = 5、h = 3，面积 15
        return 0;
    }
};

int main() {
    int w, h;
    cin >> w >> h;          // 示例输入：5 3
    const Rect r(w, h);
    cout << r.area() << endl;
    return 0;
}`,
    answer: `#include <iostream>
using namespace std;

class Rect {
    int w, h;
public:
    Rect(int a, int b) : w(a), h(b) {}
    int area() const {      // 承诺不改成员，所以常对象也能调
        return w * h;
    }
};

int main() {
    int w, h;
    cin >> w >> h;          // 示例输入：5 3
    const Rect r(w, h);
    cout << r.area() << endl;
    return 0;
}`,
    cases: [
      { stdin: '5 3\n', expected: '15' },
      { stdin: '0 9\n', expected: '0' }
    ]
  },
  {
    id: 'lab-thischain',
    title: 'return *this：一路点下去',
    day: 'Day 4',
    level: '进阶',
    cards: ['d4c39', 'd4c38'],
    brief: '<code>add</code> 现在返回值而不是引用，链式调用改的是副本。把它改成返回 <code>Acc&amp;</code>，让 <code>acc.add(a).add(b).add(c)</code> 都落在同一个对象上。',
    io: '输入：一行三个整数。输出：累加结果。',
    starter: `#include <iostream>
using namespace std;

class Acc {
    int v;
public:
    Acc() : v(0) {}
    // TODO: 返回类型要改成引用，才能一路点下去
    // 本例 1 2 3：acc.add(1).add(2).add(3) 都落在同一个对象上，输出 6
    Acc add(int x) {
        v += x;
        return *this;
    }
    int get() const { return v; }
};

int main() {
    int a, b, c;
    cin >> a >> b >> c;     // 示例输入：1 2 3
    Acc acc;
    acc.add(a).add(b).add(c);
    cout << acc.get() << endl;
    return 0;
}`,
    answer: `#include <iostream>
using namespace std;

class Acc {
    int v;
public:
    Acc() : v(0) {}
    Acc& add(int x) {     // 返回 *this 的引用
        v += x;
        return *this;
    }
    int get() const { return v; }
};

int main() {
    int a, b, c;
    cin >> a >> b >> c;     // 示例输入：1 2 3
    Acc acc;
    acc.add(a).add(b).add(c);
    cout << acc.get() << endl;
    return 0;
}`,
    cases: [
      { stdin: '1 2 3\n', expected: '6' },
      { stdin: '0 0 0\n', expected: '0' }
    ]
  },
  {
    id: 'lab-assign',
    title: 'operator=：先退旧房，再租新房',
    day: 'Day 3',
    level: '进阶',
    cards: ['d3c26', 'd3c25'],
    brief: '补完拷贝赋值：把自己原来的内存删掉、按对方的值重新 <code>new</code> 一块，并返回 <code>*this</code>。别忘了自赋值保护。',
    io: '输入：一行两个整数 a b。输出：赋值之后 x 和 y 的值，空格隔开。',
    starter: `#include <iostream>
using namespace std;

class Box {
    int* p;
public:
    Box(int v) { p = new int(v); }
    ~Box() { delete p; }
    Box& operator=(const Box& o) {
        // TODO: 自赋值保护 + 深拷贝赋值 + 返回 *this
        // 本例 a = 4、b = 9：y = x 之后 y 也变成 4，输出 4 4
        return *this;
    }
    void set(int v) { *p = v; }
    int get() const { return *p; }
};

int main() {
    int a, b;
    cin >> a >> b;          // 示例输入：4 9
    Box x(a), y(b);
    y = x;          // 拷贝赋值
    cout << x.get() << " " << y.get() << endl;
    return 0;
}`,
    answer: `#include <iostream>
using namespace std;

class Box {
    int* p;
public:
    Box(int v) { p = new int(v); }
    ~Box() { delete p; }
    Box& operator=(const Box& o) {
        if (this == &o) return *this;   // 自己给自己赋值，直接走
        delete p;                        // 先退旧房
        p = new int(*o.p);               // 再按对方的值租新房
        return *this;                    // 支持 a = b = c
    }
    void set(int v) { *p = v; }
    int get() const { return *p; }
};

int main() {
    int a, b;
    cin >> a >> b;          // 示例输入：4 9
    Box x(a), y(b);
    y = x;
    cout << x.get() << " " << y.get() << endl;
    return 0;
}`,
    cases: [
      { stdin: '4 9\n', expected: '4 4' },
      { stdin: '0 0\n', expected: '0 0' }
    ]
  }
];
