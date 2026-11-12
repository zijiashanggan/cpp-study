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
}

int main() {
    int x, y;
    cin >> x >> y;
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

// 指针版：递门牌号
void swapPtr(int* a, int* b) {
    // TODO: 交换 *a 和 *b
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
    getline(cin, s);
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
    getline(cin, s);
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
    cin >> n;
    int* a = new int[n];   // 按运行时数量租地
    for (int i = 0; i < n; i++) cin >> a[i];

    int sum = 0, mx = a[0];
    // TODO: 累加求和，并求最大值

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
    cin >> n;
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
    cin >> n;
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
    int val() const { return v; }
};
int Track::copies = 0;

int main() {
    int a, b;
    cin >> a >> b;
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
    cin >> a >> b;
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
    ~Box() { delete p; }
    void set(int v) { *p = v; }
    int get() { return *p; }
};

int main() {
    int a, b;
    cin >> a >> b;
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
};
int Counter::made = 0;
int Counter::alive = 0;

int main() {
    int n;
    cin >> n;
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
        static Config* p = nullptr;
        return *p;
    }
    void set(int x) { v = x; }
    int get() const { return v; }
};

int main() {
    int a, b;
    cin >> a >> b;
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
    cin >> a >> b;
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
    cin >> n;
    // TODO: 输出 sizeof(Node) 和 n 个 Node 的总字节
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
    }
    int size() const { return n; }
    int capacity() const { return cap; }
    int at(int i) const { return p[i]; }
};

int main() {
    int n;
    cin >> n;
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
    cin >> n;
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
  }
];
