/* Day 9 · 常用库 day2：仿函数、适配器、算法与 lambda（题库） */
window.BANKS = window.BANKS || {};
window.BANKS.day9 = {
  "single": [
    {
      "id": "d9s01",
      "day": "day9",
      "q": "下面哪个东西是「函数对象（仿函数）」？",
      "options": [
        "返回 bool 的普通函数",
        "重载了 operator() 的类的对象",
        "函数指针",
        "带默认参数的普通函数",
      ],
      "ans": 1,
      "why": "仿函数本质是<b>类</b>：类里重载 <code>operator()</code>，它的对象就能像函数一样调用。"
    },
    {
      "id": "d9s02",
      "day": "day9",
      "q": "相比普通函数，仿函数最直接的优势是？",
      "options": [
        "语法更短",
        "可以保存自己的状态",
        "不需要头文件",
        "一定比普通函数快",
      ],
      "ans": 1,
      "why": "仿函数是对象，可以用成员变量保存状态；普通函数要有状态只能靠 static 或全局变量。"
    },
    {
      "id": "d9s03",
      "day": "day9",
      "q": "同一个仿函数类造出两个对象，各自的成员变量会怎样？",
      "options": [
        "共用一份",
        "各有一份，互不影响",
        "第二个会覆盖第一个",
        "编译报错",
      ],
      "ans": 1,
      "why": "成员变量属于每个对象，两个仿函数对象各保存各的状态；static 成员才是全类共用。"
    },
    {
      "id": "d9s04",
      "day": "day9",
      "q": "一元谓词是指？",
      "options": [
        "返回 int、收一个参数的函数",
        "返回 bool、收一个参数的可调用对象",
        "收两个参数、返回 bool 的仿函数",
        "只能由普通函数充当",
      ],
      "ans": 1,
      "why": "谓词就是「返回 bool 做判断」的可调用对象；收一个参数叫一元谓词，收两个叫二元谓词。"
    },
    {
      "id": "d9s05",
      "day": "day9",
      "q": "用普通函数 isTen 作 find_if 的谓词，正确写法是？",
      "options": [
        "find_if(v.begin(), v.end(), isTen)",
        "find_if(v.begin(), v.end(), isTen())",
        "find_if(v.begin(), v.end(), &isTen())",
        "find_if(v.begin(), v.end(), bool isTen)",
      ],
      "ans": 0,
      "why": "普通函数传函数名，不要加括号调用；仿函数才需要写 <code>IfExistTen()</code> 造对象。"
    },
    {
      "id": "d9s06",
      "day": "day9",
      "q": "要让 sort 按降序排，第三个参数可以写？",
      "options": [
        "sort(v.begin(), v.end(), greater<int>())",
        "sort(v.begin(), v.end(), greater<int>)",
        "sort(v.begin(), v.end(), descending)",
        "sort(v.begin(), v.end(), true)",
      ],
      "ans": 0,
      "why": "<code>greater&lt;int&gt;()</code> 是一个函数对象；只写 <code>greater&lt;int&gt;</code> 是类型，编译不过。"
    },
    {
      "id": "d9s07",
      "day": "day9",
      "q": "sort 的比较函数返回 true，表示？",
      "options": [
        "a 应该排在 b 前面",
        "a 和 b 要交换",
        "a 比 b 大",
        "排序结束",
      ],
      "ans": 0,
      "why": "比较函数表达的是「谁该在前」；返回 true 表示第一个参数排在第二个参数前面。"
    },
    {
      "id": "d9s08",
      "day": "day9",
      "q": "使用 greater、less、plus 这些内建函数对象要 include？",
      "options": [
        "<algorithm>",
        "<functional>",
        "<numeric>",
        "<iterator>",
      ],
      "ans": 1,
      "why": "内建函数对象定义在 <code>&lt;functional&gt;</code>；<code>&lt;numeric&gt;</code> 是 accumulate 用的。"
    },
    {
      "id": "d9s09",
      "day": "day9",
      "q": "greater<int>() 中的这对括号表示？",
      "options": [
        "调用 greater 函数",
        "构造一个匿名函数对象",
        "声明模板参数",
        "类型转换",
      ],
      "ans": 1,
      "why": "greater&lt;int&gt; 是类型，<code>greater&lt;int&gt;()</code> 是构造一个临时对象，交给 sort 当比较规则。"
    },
    {
      "id": "d9s10",
      "day": "day9",
      "q": "bind 适配器的主要作用是？",
      "options": [
        "给容器扩容",
        "固定一部分参数，把可调用对象的接口改成算法需要的样子",
        "把函数编译成内联",
        "删除容器元素",
      ],
      "ans": 1,
      "why": "bind 先绑死部分参数，剩下的用 placeholders 占位，返回一个新的可调用对象。"
    },
    {
      "id": "d9s11",
      "day": "day9",
      "q": "placeholders::_1 表示？",
      "options": [
        "固定的值 1",
        "调用时传入的第一个参数",
        "容器的第一个元素",
        "第一个模板参数",
      ],
      "ans": 1,
      "why": "<code>_1</code> 是占位符：bind 返回的对象被调用时，第一个实参填到这个位置。"
    },
    {
      "id": "d9s12",
      "day": "day9",
      "q": "要 bind 的函数有多个重载版本，应该怎么做？",
      "options": [
        "直接写函数名",
        "先用函数指针显式指定版本，再 bind 指针",
        "把函数改成模板",
        "加 using namespace std",
      ],
      "ans": 1,
      "why": "重载函数名无法唯一确定版本，编译器推不出参数类型；先用函数指针（或 static_cast）指明要哪一个。"
    },
    {
      "id": "d9s13",
      "day": "day9",
      "q": "mem_fn(&Demo::print) 适合什么场景？",
      "options": [
        "带多个参数的成员函数",
        "无参成员函数交给 for_each",
        "普通全局函数",
        "静态成员函数",
      ],
      "ans": 1,
      "why": "<code>mem_fn</code> 把无参成员函数适配成可调用对象；要额外传参数用 bind 更灵活。"
    },
    {
      "id": "d9s14",
      "day": "day9",
      "q": "not1 的作用是？",
      "options": [
        "给一元谓词取反",
        "给二元谓词取反",
        "删除第一个元素",
        "把返回值转成 int",
      ],
      "ans": 0,
      "why": "not1 接收一元谓词，返回取反后的谓词；二元取反用 not2。"
    },
    {
      "id": "d9s15",
      "day": "day9",
      "q": "关于 not1 / not2，下面说法正确的是？",
      "options": [
        "C++17 起已标记 deprecated，新代码更推荐 lambda",
        "C++17 起被彻底删除，完全不能用",
        "只能用于 set",
        "必须配合 bind 才能编译",
      ],
      "ans": 0,
      "why": "C++17 把它们标记为 deprecated（不推荐使用），新代码直接写 lambda 更清楚。"
    },
    {
      "id": "d9s16",
      "day": "day9",
      "q": "STL 算法访问容器数据的方式是？",
      "options": [
        "直接访问容器的私有成员",
        "通过一对迭代器表示的区间",
        "通过容器下标",
        "通过反射",
      ],
      "ans": 1,
      "why": "算法只认迭代器区间 <code>[begin, end)</code>，不知道具体容器类型。"
    },
    {
      "id": "d9s17",
      "day": "day9",
      "q": "下面哪个容器不能直接用 std::sort？",
      "options": [
        "vector",
        "deque",
        "list",
        "array",
      ],
      "ans": 2,
      "why": "std::sort 要求随机访问迭代器，list 是双向迭代器；list 要用自己的 <code>list::sort()</code>。"
    },
    {
      "id": "d9s18",
      "day": "day9",
      "q": "for_each 的返回值是？",
      "options": [
        "void",
        "传入的函数对象（按值返回）",
        "容器最后一个元素",
        "元素个数",
      ],
      "ans": 1,
      "why": "for_each 返回传入的可调用对象，所以可以用它把仿函数内部累计的状态带回来。"
    },
    {
      "id": "d9s19",
      "day": "day9",
      "q": "用 transform 前，目标容器必须？",
      "options": [
        "reserve 一下即可",
        "resize 到足够元素个数",
        "清空",
        "先排序",
      ],
      "ans": 1,
      "why": "transform 不会为目标容器分配内存，必须先用 <code>resize</code> 让目标区间真的有元素。"
    },
    {
      "id": "d9s20",
      "day": "day9",
      "q": "resize 和 reserve 的区别是？",
      "options": [
        "都改 size",
        "resize 改元素个数，reserve 只改容量",
        "reserve 会构造元素",
        "没有区别",
      ],
      "ans": 1,
      "why": "<code>resize</code> 改变 size 并构造/销毁元素；<code>reserve</code> 只预留 capacity，size 不变。"
    },
    {
      "id": "d9s21",
      "day": "day9",
      "q": "find 找不到元素时返回？",
      "options": [
        "-1",
        "nullptr",
        "区间的 end() 迭代器",
        "第一个元素",
      ],
      "ans": 2,
      "why": "find 返回迭代器，找不到就是 <code>end()</code>；判断要写 <code>it != v.end()</code>。"
    },
    {
      "id": "d9s22",
      "day": "day9",
      "q": "find_if 的第三个参数应该是？",
      "options": [
        "要查找的值",
        "返回 bool 的谓词",
        "目标容器",
        "元素个数",
      ],
      "ans": 1,
      "why": "find 按值找，find_if 按条件找，第三个参数是谓词。"
    },
    {
      "id": "d9s23",
      "day": "day9",
      "q": "binary_search 的前提是？",
      "options": [
        "容器必须为空",
        "区间必须已经有序",
        "必须是 list",
        "元素必须是字符串",
      ],
      "ans": 1,
      "why": "二分查找要求区间按同一规则有序；无序时结果不可信，但编译器不会报错。"
    },
    {
      "id": "d9s24",
      "day": "day9",
      "q": "merge 合并两个区间的前提是？",
      "options": [
        "两个区间都为空",
        "两个区间都按同一规则有序",
        "两个容器类型必须相同",
        "必须都是 set",
      ],
      "ans": 1,
      "why": "merge 是归并，不会重新排序；两个源区间必须已经有序，目标容器要提前开够空间。"
    },
    {
      "id": "d9s25",
      "day": "day9",
      "q": "replace_if 的第三个参数是？",
      "options": [
        "旧值",
        "新值",
        "谓词",
        "目标迭代器",
      ],
      "ans": 2,
      "why": "replace_if 的参数顺序是：区间、谓词、新值；按值替换才用 replace。"
    },
    {
      "id": "d9s26",
      "day": "day9",
      "q": "accumulate 定义在哪个头文件？",
      "options": [
        "<algorithm>",
        "<numeric>",
        "<functional>",
        "<vector>",
      ],
      "ans": 1,
      "why": "accumulate 在 <code>&lt;numeric&gt;</code> 里，只 include algorithm 会报未声明。"
    },
    {
      "id": "d9s27",
      "day": "day9",
      "q": "set_intersection / set_union / set_difference 的共同前提是？",
      "options": [
        "两个区间都必须有序",
        "两个区间都必须无序",
        "必须是 set 容器",
        "目标容器必须为空",
      ],
      "ans": 0,
      "why": "三个集合算法都按有序区间做归并式比较；容器类型不限，但源区间必须有序。"
    },
    {
      "id": "d9s28",
      "day": "day9",
      "q": "lambda 用 [=] 捕获外部变量后，在函数体里？",
      "options": [
        "可以随意修改这些变量",
        "默认只能读，不能改",
        "变量会变成全局变量",
        "必须加 const",
      ],
      "ans": 1,
      "why": "值捕获得到的是只读副本；要改原变量用 <code>[&amp;]</code>，或者加 mutable（改的仍是副本）。"
    }
  ],
  "fill": [
    {
      "id": "d9f01",
      "day": "day9",
      "code": "auto it = ____(v.begin(), v.end(), isTen);   // 按条件查找",
      "q": "横线上填按谓词查找的算法名。",
      "answers": ["find_if"],
      "display": "find_if",
      "why": "find 按值查，find_if 按谓词查。"
    },
    {
      "id": "d9f02",
      "day": "day9",
      "code": "auto f = bind(equal_to<int>(), 10, placeholders::____);",
      "q": "横线上填保留参数位置的占位符。",
      "answers": ["_1"],
      "display": "_1",
      "why": "<code>_1</code> 表示调用时传入的第一个参数填在这里。"
    },
    {
      "id": "d9f03",
      "day": "day9",
      "code": "Add a = ____(v.begin(), v.end(), Add());\ncout << a.sum << endl;",
      "q": "横线上填遍历算法名。",
      "answers": ["for_each"],
      "display": "for_each",
      "why": "for_each 返回传入的函数对象，可以接住它读取累计的状态。"
    },
    {
      "id": "d9f04",
      "day": "day9",
      "code": "auto it = find(v.begin(), v.end(), 20);\nif (it != v.____()) { cout << *it << endl; }",
      "q": "横线上填表示区间末尾的函数。",
      "answers": ["end"],
      "display": "end",
      "why": "find 找不到返回 <code>end()</code>，判断写 <code>it != v.end()</code>。"
    },
    {
      "id": "d9f05",
      "day": "day9",
      "code": "auto it = ____(v.begin(), v.end());   // 找相邻重复元素",
      "q": "横线上填算法名。",
      "answers": ["adjacent_find"],
      "display": "adjacent_find",
      "why": "<code>adjacent_find</code> 找第一对相邻且满足条件的元素，默认比相等。"
    },
    {
      "id": "d9f06",
      "day": "day9",
      "code": "cout << ____(v.begin(), v.end(), Big()) << endl;   // 统计满足条件的个数",
      "q": "横线上填按条件统计的算法名。",
      "answers": ["count_if"],
      "display": "count_if",
      "why": "count 数等值，count_if 数谓词为真的个数。"
    },
    {
      "id": "d9f07",
      "day": "day9",
      "code": "double avg = accumulate(v.begin(), v.end(), 0.____) / v.size();",
      "q": "横线上填让初始值成为 double 的小数部分。",
      "answers": ["0", "0.0"],
      "display": "0",
      "why": "初始值写 <code>0.0</code> 才会按 double 累加，否则整数除法会丢小数。"
    },
    {
      "id": "d9f08",
      "day": "day9",
      "code": "auto f = [____] { return this->a; };   // 在成员函数里捕获当前对象",
      "q": "横线上填捕获 this 的写法。",
      "answers": ["this"],
      "display": "this",
      "why": "<code>[this]</code> 让 lambda 捕获当前对象指针，可以访问成员。"
    }
  ],
  "judge": [
    {
      "id": "d9j01",
      "day": "day9",
      "q": "mem_fn 可以把无参成员函数适配成 for_each 能用的可调用对象。",
      "ans": 0,
      "why": "正确。<code>mem_fn(&amp;Demo::print)</code> 会自动把元素当作 this。"
    },
    {
      "id": "d9j02",
      "day": "day9",
      "q": "STL 算法可以直接操作容器，比如写 v.sort()。",
      "ans": 1,
      "why": "错误。算法是全局函数模板，收迭代器区间；vector 没有 sort 成员。"
    },
    {
      "id": "d9j03",
      "day": "day9",
      "q": "transform 会自动为目标容器分配足够的空间。",
      "ans": 1,
      "why": "错误。transform 不分配内存，目标容器必须先 <code>resize</code>。"
    },
    {
      "id": "d9j04",
      "day": "day9",
      "q": "count 和 count_if 的用法完全一样，只是名字不同。",
      "ans": 1,
      "why": "错误。count 按值统计，count_if 按谓词统计。"
    },
    {
      "id": "d9j05",
      "day": "day9",
      "q": "reverse 会返回一个反转后的新容器。",
      "ans": 1,
      "why": "错误。reverse 原地反转，返回 void，原容器被修改。"
    },
    {
      "id": "d9j06",
      "day": "day9",
      "q": "copy 发现目标容器空间不够时会自动扩容。",
      "ans": 1,
      "why": "错误。copy 不分配内存，目标区间必须提前准备好。"
    },
    {
      "id": "d9j07",
      "day": "day9",
      "q": "set_intersection 对无序的两个 vector 也能得到正确结果。",
      "ans": 1,
      "why": "错误。集合算法要求两个区间都有序，否则结果不对但不报错。"
    },
    {
      "id": "d9j08",
      "day": "day9",
      "q": "lambda 的 [=] 捕获方式下，可以直接修改捕获进来的变量。",
      "ans": 1,
      "why": "错误。值捕获默认只读；要改原变量用 <code>[&amp;]</code>。"
    }
  ],
  "code": [
    {
      "id": "d9c01",
      "day": "day9",
      "q": "写出下面程序的输出。",
      "code": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int a = 5;\n    auto f = [a](int x) { return a * x; };\n    a = 100;\n    cout << f(3) << endl;\n    cout << a << endl;\n}",
      "answers": ["15\n100"],
      "display": "15\n100",
      "why": "<code>[a]</code> 是值捕获：lambda 里存的是调用定义时的副本 5，外面把 a 改成 100 不影响它。"
    },
    {
      "id": "d9c02",
      "day": "day9",
      "q": "写出下面程序的输出。",
      "code": "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nstruct Cmp {\n    bool operator()(int a, int b) const { return a > b; }\n};\n\nint main() {\n    vector<int> v = {3, 1, 4, 2};\n    sort(v.begin(), v.end(), Cmp());\n    for (int x : v) cout << x << endl;\n}",
      "answers": ["4\n3\n2\n1"],
      "display": "4\n3\n2\n1",
      "why": "二元谓词 <code>a &gt; b</code> 表示大的排前面，所以降序。"
    },
    {
      "id": "d9c03",
      "day": "day9",
      "q": "写出下面程序的输出。",
      "code": "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    vector<int> v = {1, 2, 3};\n    vector<int> r(v.size());\n    transform(v.begin(), v.end(), r.begin(), [](int x) { return x + 10; });\n    for_each(r.begin(), r.end(), [](int x) { cout << x << endl; });\n}",
      "answers": ["11\n12\n13"],
      "display": "11\n12\n13",
      "why": "transform 把每个元素加 10 写进 r，for_each 再逐个打印。"
    },
    {
      "id": "d9c04",
      "day": "day9",
      "q": "写出下面程序的输出。",
      "code": "#include <iostream>\n#include <functional>\nusing namespace std;\n\nint main() {\n    auto f = bind(plus<int>(), 100, placeholders::_1);\n    cout << f(23) << endl;\n    auto g = bind(equal_to<int>(), placeholders::_1, 7);\n    cout << g(7) << endl;\n}",
      "answers": ["123\n1"],
      "display": "123\n1",
      "why": "<code>f(23)</code> 把 23 填到 _1，得到 100+23；<code>g(7)</code> 判断 7==7，输出 1。"
    },
    {
      "id": "d9c05",
      "day": "day9",
      "q": "写出下面程序的输出。",
      "code": "#include <iostream>\n#include <vector>\n#include <numeric>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    vector<int> v = {5, 10, 15, 20};\n    cout << accumulate(v.begin(), v.end(), 0) << endl;\n    cout << count_if(v.begin(), v.end(), [](int x) { return x % 10 == 0; }) << endl;\n}",
      "answers": ["50\n2"],
      "display": "50\n2",
      "why": "总和 5+10+15+20=50；能被 10 整除的是 10 和 20，共 2 个。"
    },
    {
      "id": "d9c06",
      "day": "day9",
      "q": "写出下面程序的输出。",
      "code": "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    vector<int> a = {1, 3, 5, 7}, b = {3, 5, 9};\n    vector<int> c(10);\n    auto e = set_intersection(a.begin(), a.end(), b.begin(), b.end(), c.begin());\n    for (auto it = c.begin(); it != e; ++it) cout << *it << endl;\n}",
      "answers": ["3\n5"],
      "display": "3\n5",
      "why": "两个有序区间的交集是 3 和 5；遍历终点用返回的 e，不是 c.end()。"
    }
  ]
};
