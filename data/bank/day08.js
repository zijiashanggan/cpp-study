window.BANKS = window.BANKS || {};
window.BANKS.day8 = {
  "single": [
    {
      "id": "d8s01",
      "day": "day8",
      "q": "STL 最核心的三大组件是什么？",
      "options": [
        "容器、算法、迭代器",
        "类、对象、继承",
        "头文件、源文件、链接器",
        "string、vector、map",
      ],
      "ans": 0,
      "why": "容器装数据，算法操作数据，迭代器把两者接起来；仿函数、适配器、空间配置器是另外三个组件。"
    },
    {
      "id": "d8s02",
      "day": "day8",
      "q": "下面哪一组都是序列式容器？",
      "options": [
        "vector、deque、list",
        "set、map、multimap",
        "stack、queue、priority_queue",
        "pair、tuple、array",
      ],
      "ans": 0,
      "why": "序列式容器元素有固定位置；set/map 是关联式容器，stack/queue 是容器适配器。"
    },
    {
      "id": "d8s03",
      "day": "day8",
      "q": "下面哪个属于质变算法？",
      "options": [
        "find",
        "count",
        "sort",
        "for_each（只读遍历）",
      ],
      "ans": 2,
      "why": "质变算法会改区间内元素内容，如 sort/copy/replace；find、count 只读，是非质变算法。"
    },
    {
      "id": "d8s04",
      "day": "day8",
      "q": "vector 的迭代器属于哪一类？",
      "options": [
        "输入迭代器",
        "前向迭代器",
        "双向迭代器",
        "随机访问迭代器",
      ],
      "ans": 3,
      "why": "vector 是连续内存，迭代器支持 +n、-n、[]，属于随机访问迭代器；list 才是双向迭代器。"
    },
    {
      "id": "d8s05",
      "day": "day8",
      "q": "<code>string s(3, 'A');</code> 得到的字符串是？",
      "options": [
        "空串",
        "\"3A\"",
        "\"AAA\"",
        "长度为 3 的空串",
      ],
      "ans": 2,
      "why": "第一个参数是个数，第二个参数是字符，所以是 3 个 'A'。"
    },
    {
      "id": "d8s06",
      "day": "day8",
      "q": "给 string 追加内容，下面哪些写法可用？",
      "options": [
        "s += \"abc\" 和 s.append(\"abc\")",
        "只有 s += \"abc\"",
        "只有 s.append(\"abc\")",
        "只能用 s.push_back(\"abc\")",
      ],
      "ans": 0,
      "why": "<code>+=</code> 和 <code>append</code> 都能拼接字符串；<code>push_back</code> 一次只能加一个字符。"
    },
    {
      "id": "d8s07",
      "day": "day8",
      "q": "<code>string::find</code> 找不到目标时返回什么？",
      "options": [
        "-1",
        "0",
        "<code>string::npos</code>",
        "抛出异常",
      ],
      "ans": 2,
      "why": "find 返回 <code>size_t</code>，找不到时是 <code>string::npos</code>，判断时统一和 npos 比。"
    },
    {
      "id": "d8s08",
      "day": "day8",
      "code": "string s = \"hello world hello\";\ncout << s.substr(6, 5) << endl;",
      "q": "输出是什么？",
      "options": [
        "world",
        "world hello",
        "hello",
        " worl",
      ],
      "ans": 0,
      "why": "从下标 6 开始取 5 个字符：w、o、r、l、d。第二个参数是个数，不是结束下标。"
    },
    {
      "id": "d8s09",
      "day": "day8",
      "code": "string s = \"hello world\";\ns.replace(0, 5, \"hi\");\ncout << s << endl;",
      "q": "输出是什么？",
      "options": [
        "hi world",
        "hiworld",
        "hi hello world",
        "hillo world",
      ],
      "ans": 0,
      "why": "从下标 0 开始替换掉 5 个字符 hello，换成 hi，结果是 hi world。"
    },
    {
      "id": "d8s10",
      "day": "day8",
      "q": "把 string 转成 <code>const char*</code> 用哪个函数？",
      "options": [
        "data()",
        "c_str()",
        "to_char()",
        "str()",
      ],
      "ans": 1,
      "why": "<code>c_str()</code> 返回以 '\\0' 结尾的 <code>const char*</code>；C++17 的 <code>data()</code> 也能返回同样内容，但教材统一用 c_str。"
    },
    {
      "id": "d8s11",
      "day": "day8",
      "q": "vector 的 <code>end()</code> 指向哪里？",
      "options": [
        "最后一个元素",
        "第一个元素",
        "最后一个元素的下一格",
        "容量的末尾",
      ],
      "ans": 2,
      "why": "区间是左闭右开 [begin, end)，end 是最后一个元素的下一个位置，不能解引用。"
    },
    {
      "id": "d8s12",
      "day": "day8",
      "q": "<code>push_back</code> 的作用是？",
      "options": [
        "在头部插入",
        "在尾部插入",
        "删除尾部元素",
        "删除头部元素",
      ],
      "ans": 1,
      "why": "push_back 尾插，pop_back 尾删；vector 头部插入代价很高，要用 insert(begin(), x)。"
    },
    {
      "id": "d8s13",
      "day": "day8",
      "q": "<code>size()</code> 和 <code>capacity()</code> 的区别是？",
      "options": [
        "两者永远相等",
        "size 是元素个数，capacity 是已申请空间能放多少",
        "size 是容量，capacity 是元素个数",
        "capacity 只对 deque 有效",
      ],
      "ans": 1,
      "why": "size 是真正存了几个元素，capacity 是当前申请的空间能放几个；capacity 通常大于等于 size。"
    },
    {
      "id": "d8s14",
      "day": "day8",
      "q": "vector 扩容时内部做了什么？",
      "options": [
        "在原空间后面直接续接",
        "申请更大的新空间，搬数据，释放旧空间",
        "把容量加 1",
        "只修改 size，不分配内存",
      ],
      "ans": 1,
      "why": "内存后面不一定有空位，所以只能整块搬家；这也是扩容后所有迭代器失效的原因。"
    },
    {
      "id": "d8s15",
      "day": "day8",
      "q": "<code>push_back</code> 触发扩容后，之前保存的迭代器会怎样？",
      "options": [
        "全部失效",
        "只有 begin() 失效",
        "完全不受影响",
        "自动指向新位置",
      ],
      "ans": 0,
      "why": "扩容换了整块内存，原来的迭代器、指针、引用全部失效，必须重新 begin()。"
    },
    {
      "id": "d8s16",
      "day": "day8",
      "q": "想立刻把 vector 的容量收缩到实际元素个数，常用写法是？",
      "options": [
        "v.resize(v.size())",
        "v.reserve(v.size())",
        "vector<int>(v).swap(v)",
        "v.clear()",
      ],
      "ans": 2,
      "why": "用实际元素构造一个临时 vector，再和原容器 swap，临时对象析构时释放旧的大空间。resize/reserve 都不改容量到实际大小。"
    },
    {
      "id": "d8s17",
      "day": "day8",
      "q": "<code>sort(v.begin(), v.end())</code> 默认按什么顺序排？",
      "options": [
        "升序（从小到大）",
        "降序（从大到小）",
        "按插入顺序",
        "随机顺序",
      ],
      "ans": 0,
      "why": "默认用 <code>operator&lt;</code>，即升序；降序要传 <code>greater&lt;int&gt;()</code> 或自定义比较函数。"
    },
    {
      "id": "d8s18",
      "day": "day8",
      "q": "deque 相比 vector 的主要优势是？",
      "options": [
        "支持头尾两端 O(1) 插入删除",
        "内存一定连续",
        "有 capacity()",
        "支持随机访问",
      ],
      "ans": 0,
      "why": "deque 是双向开口，push_front/pop_front 都是 O(1)；它没有 capacity，内存是分段连续的。"
    },
    {
      "id": "d8s19",
      "day": "day8",
      "code": "stack<int> st;\nst.push(1); st.push(2); st.push(3);\ncout << st.top() << endl;\nst.pop();\ncout << st.top() << endl;",
      "q": "输出是什么？",
      "options": [
        "1 然后 2",
        "3 然后 2",
        "3 然后 1",
        "1 然后 3",
      ],
      "ans": 1,
      "why": "stack 后进先出：栈顶是 3，pop 掉 3 之后栈顶是 2。"
    },
    {
      "id": "d8s20",
      "day": "day8",
      "q": "queue 的 <code>pop()</code> 删除的是哪一端？",
      "options": [
        "队头",
        "队尾",
        "中间",
        "随机一个",
      ],
      "ans": 0,
      "why": "queue 先进先出：push 从队尾进，pop 从队头出；取队头用 front()，取队尾用 back()。"
    },
    {
      "id": "d8s21",
      "day": "day8",
      "q": "list 的迭代器属于哪一类？",
      "options": [
        "随机访问迭代器",
        "双向迭代器",
        "输入迭代器",
        "没有迭代器",
      ],
      "ans": 1,
      "why": "list 节点不连续，迭代器只能 ++/--，不能 +n 或 []；要走多步用 advance。"
    },
    {
      "id": "d8s22",
      "day": "day8",
      "q": "给 list 排序应该用哪个？",
      "options": [
        "std::sort(l.begin(), l.end())",
        "l.sort()",
        "l.order()",
        "qsort",
      ],
      "ans": 1,
      "why": "std::sort 需要随机访问迭代器，list 只有双向迭代器；list 自带成员函数 sort。"
    },
    {
      "id": "d8s23",
      "day": "day8",
      "q": "向 set 插入一个已经存在的值，会怎样？",
      "options": [
        "编译报错",
        "覆盖旧值",
        "插入无效，set 保持原样",
        "抛异常",
      ],
      "ans": 2,
      "why": "set 自动去重，重复插入不会报错也不会进去；multiset 才允许重复。"
    },
    {
      "id": "d8s24",
      "day": "day8",
      "q": "想让 set 从大到小排序，排序规则写在哪？",
      "options": [
        "set 的第二个模板参数，传一个仿函数",
        "set 的构造函数参数",
        "insert 的第二个参数",
        "set 没有排序规则可改",
      ],
      "ans": 0,
      "why": "写成 <code>set&lt;int, MyCompare&gt;</code>，MyCompare 里重载 <code>operator()</code>；规则必须在定义时确定。"
    },
    {
      "id": "d8s25",
      "day": "day8",
      "q": "pair 的两个成员分别叫什么？",
      "options": [
        "key 和 value",
        "first 和 second",
        "left 和 right",
        "a 和 b",
      ],
      "ans": 1,
      "why": "pair 用 <code>first</code>/<code>second</code> 访问；map 的元素就是 <code>pair&lt;const Key, Value&gt;</code>。"
    },
    {
      "id": "d8s26",
      "day": "day8",
      "q": "map 遍历时，元素的顺序是？",
      "options": [
        "插入顺序",
        "按 key 升序",
        "按 value 升序",
        "随机顺序",
      ],
      "ans": 1,
      "why": "map 底层是红黑树，按 key 自动排序，遍历顺序不是插入顺序。"
    },
    {
      "id": "d8s27",
      "day": "day8",
      "q": "<code>m.insert(make_pair(1001, \"zs\"))</code>，而 1001 已存在，会怎样？",
      "options": [
        "覆盖原来的 value",
        "插入失败，原值不变",
        "删除旧元素再插入",
        "编译报错",
      ],
      "ans": 1,
      "why": "insert 遇到重复 key 不会覆盖，返回的 pair 里 second 为 false；要覆盖得用 <code>m[1001] = \"zs\"</code>。"
    },
    {
      "id": "d8s28",
      "day": "day8",
      "q": "在 map 里查找一个 key，推荐写法是？",
      "options": [
        "m[key] 直接取",
        "m.find(key) 并和 m.end() 比较",
        "m.at(key) 且不判空",
        "遍历整个 map 比较",
      ],
      "ans": 1,
      "why": "<code>m[key]</code> 在 key 不存在时会插入默认值，把 map 越查越大；find 找不到返回 end()。"
    }
  ],
  "fill": [
    {
      "id": "d8f01",
      "day": "day8",
      "code": "string s(3, ____);   // 得到 \"AAA\"",
      "q": "横线上填要重复的字符。",
      "answers": ["'A'", "A", "\"A\""],
      "display": "'A'",
      "why": "<code>string(n, c)</code> 用 n 个字符 c 构造，所以是 3 个 'A'。"
    },
    {
      "id": "d8f02",
      "day": "day8",
      "code": "if (s.find(\"xyz\") == string::____) {\n    cout << \"没找到\" << endl;\n}",
      "q": "横线上填表示「未找到」的常量。",
      "answers": ["npos"],
      "display": "npos",
      "why": "find 找不到返回 <code>string::npos</code>，不要拿 -1 直接比。"
    },
    {
      "id": "d8f03",
      "day": "day8",
      "code": "string s = \"abc\";\nconst char* p = s.____();",
      "q": "横线上填把 string 转成 C 字符串的函数。",
      "answers": ["c_str"],
      "display": "c_str",
      "why": "<code>c_str()</code> 返回以 '\\0' 结尾的 <code>const char*</code>。"
    },
    {
      "id": "d8f04",
      "day": "day8",
      "code": "vector<int> v;\nv.____(100);   // 预留 100 个元素的空间，size 仍为 0",
      "q": "横线上填只改容量、不改大小的函数。",
      "answers": ["reserve"],
      "display": "reserve",
      "why": "<code>reserve</code> 预留容量，<code>resize</code> 改元素个数。"
    },
    {
      "id": "d8f05",
      "day": "day8",
      "code": "set<int> s = {10, 20, 30};\ncout << s.____(30) << endl;   // 输出 1",
      "q": "横线上填返回某值出现个数的函数。",
      "answers": ["count"],
      "display": "count",
      "why": "set 里 count 返回 0 或 1；multiset 里可能大于 1。"
    },
    {
      "id": "d8f06",
      "day": "day8",
      "code": "struct MyCompare {\n    bool operator()(int a, int b) ____ { return a > b; }\n};\nset<int, MyCompare> s;",
      "q": "横线上补上让仿函数能被 const 对象调用的关键字。",
      "answers": ["const"],
      "display": "const",
      "why": "set 内部以 const 方式使用比较器，operator() 必须声明为 const，否则报 discards qualifiers。"
    },
    {
      "id": "d8f07",
      "day": "day8",
      "code": "map<int, string> m;\nauto it = m.find(9);\nif (it == m.____()) cout << \"没找到\" << endl;",
      "q": "横线上填表示查找失败的迭代器。",
      "answers": ["end"],
      "display": "end()",
      "why": "find 找不到返回 <code>end()</code>；不要用 <code>m[9]</code> 判断，它会插入默认值。"
    },
    {
      "id": "d8f08",
      "day": "day8",
      "code": "map<int, string> m;\nm.insert(map<int, string>::____(1004, \"wangwu\"));",
      "q": "横线上填 map 的静态类型别名。",
      "answers": ["value_type"],
      "display": "value_type",
      "why": "map 的 <code>value_type</code> 就是 <code>pair&lt;const Key, Value&gt;</code>，是第三种插入写法。"
    }
  ],
  "judge": [
    {
      "id": "d8j01",
      "day": "day8",
      "q": "<code>v.reserve(10)</code> 之后，<code>v.size()</code> 会变成 10。",
      "ans": 1,
      "why": "错。reserve 只改 capacity，size 仍是 0；预留的位置没有构造元素，不能访问。"
    },
    {
      "id": "d8j02",
      "day": "day8",
      "q": "vector 的 <code>erase(it)</code> 会返回下一个有效位置的迭代器。",
      "ans": 0,
      "why": "对。循环删除时要写 <code>it = v.erase(it)</code>，不能删完直接 ++it。"
    },
    {
      "id": "d8j03",
      "day": "day8",
      "q": "deque 和 vector 一样有 <code>capacity()</code>。",
      "ans": 1,
      "why": "错。deque 是分段连续空间，没有容量概念，也就没有 capacity/reserve。"
    },
    {
      "id": "d8j04",
      "day": "day8",
      "q": "list 可以用 <code>l[0]</code> 取第一个元素。",
      "ans": 1,
      "why": "错。list 是双向链表，不支持随机访问，没有 operator[]；取首尾用 front/back。"
    },
    {
      "id": "d8j05",
      "day": "day8",
      "q": "可以用 <code>std::sort(l.begin(), l.end())</code> 给 list 排序。",
      "ans": 1,
      "why": "错。std::sort 需要随机访问迭代器，list 只有双向迭代器；要用成员 <code>l.sort()</code>。"
    },
    {
      "id": "d8j06",
      "day": "day8",
      "q": "可以通过 set 的迭代器修改元素的值。",
      "ans": 1,
      "why": "错。set 的元素值就是排序键，迭代器是只读的；要改只能 erase 后重新 insert。"
    },
    {
      "id": "d8j07",
      "day": "day8",
      "q": "用 <code>m[key]</code> 查找一个不存在的 key，会往 map 里插入一个默认值。",
      "ans": 0,
      "why": "对。operator[] 在 key 不存在时会插入 value 的默认构造值，所以查找要用 find。"
    },
    {
      "id": "d8j08",
      "day": "day8",
      "q": "vector 适合频繁在中间插入和删除元素。",
      "ans": 1,
      "why": "错。vector 中间增删要搬后面所有元素，复杂度 O(n)；频繁中间增删应该用 list。"
    }
  ],
  "code": [
    {
      "id": "d8c01",
      "day": "day8",
      "q": "读代码，按顺序写出打印的五部分（前四行各一个数，最后一行两个数）。",
      "code": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> v = {5, 2, 8};\n    v.push_back(1);\n    for (auto it = v.begin(); it != v.end(); ++it) {\n        cout << *it << endl;\n    }\n    cout << v.front() << \" \" << v.back() << endl;\n}",
      "answers": ["5\n2\n8\n1\n5 1", "5 2 8 1 5 1"],
      "display": "5 / 2 / 8 / 1 / 5 1",
      "why": "push_back 把 1 加在尾部；begin/end 遍历保持插入顺序；front 是 5，back 是 1。"
    },
    {
      "id": "d8c02",
      "day": "day8",
      "q": "读代码，按顺序写出打印的三行。",
      "code": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> v = {10, 20, 30};\n    v.insert(v.begin() + 1, 15);\n    v.erase(v.begin() + 3);\n    for (int x : v) cout << x << endl;\n}",
      "answers": ["10\n15\n20", "10 15 20"],
      "display": "10 / 15 / 20",
      "why": "插入后是 10,15,20,30；erase 下标 3 删掉 30，剩下 10,15,20。"
    },
    {
      "id": "d8c03",
      "day": "day8",
      "q": "读代码，按顺序写出打印的五行的。",
      "code": "#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <functional>\nusing namespace std;\n\nint main() {\n    vector<int> v = {2, 5, 1, 4, 3};\n    sort(v.begin(), v.end(), greater<int>());\n    for (int x : v) cout << x << endl;\n}",
      "answers": ["5\n4\n3\n2\n1", "5 4 3 2 1"],
      "display": "5 / 4 / 3 / 2 / 1",
      "why": "greater&lt;int&gt; 让 sort 按降序排。"
    },
    {
      "id": "d8c04",
      "day": "day8",
      "q": "读代码，按顺序写出打印的三行。",
      "code": "#include <iostream>\n#include <stack>\nusing namespace std;\n\nint main() {\n    stack<int> st;\n    st.push(10);\n    st.push(20);\n    st.push(30);\n    cout << st.top() << endl;\n    st.pop();\n    cout << st.top() << endl;\n    cout << st.size() << endl;\n}",
      "answers": ["30\n20\n2", "30 20 2"],
      "display": "30 / 20 / 2",
      "why": "后进先出：top 是 30，pop 后 top 是 20，剩下 2 个元素。"
    },
    {
      "id": "d8c05",
      "day": "day8",
      "q": "读代码，按顺序写出打印的三行。",
      "code": "#include <iostream>\n#include <queue>\nusing namespace std;\n\nint main() {\n    queue<int> q;\n    q.push(10);\n    q.push(20);\n    q.push(30);\n    cout << q.front() << \" \" << q.back() << endl;\n    q.pop();\n    cout << q.front() << endl;\n    cout << q.size() << endl;\n}",
      "answers": ["10 30\n20\n2", "10 30 20 2"],
      "display": "10 30 / 20 / 2",
      "why": "先进先出：front 是 10、back 是 30；pop 删队头后 front 变 20，剩 2 个。"
    },
    {
      "id": "d8c06",
      "day": "day8",
      "q": "读代码，按顺序写出打印的三行。",
      "code": "#include <iostream>\n#include <list>\nusing namespace std;\n\nint main() {\n    list<int> l = {3, 1, 2};\n    l.sort();\n    l.reverse();\n    for (int x : l) cout << x << endl;\n}",
      "answers": ["3\n2\n1", "3 2 1"],
      "display": "3 / 2 / 1",
      "why": "list 自带 sort 升序得到 1,2,3，再 reverse 反转得到 3,2,1。"
    }
  ]
};
