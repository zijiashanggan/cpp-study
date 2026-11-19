/* Day 9 · 常用库 day2：仿函数、适配器、算法与 lambda（卡片） */
window.DAYS = window.DAYS || {};
window.DAYS.day9 = {
  "id": "day9",
  "title": "Day 9 · 常用库 day2",
  "desc": "常用库第二天：先认仿函数和谓词，再用适配器把接口改成算法要的样子，然后把 STL 常用算法过一遍，最后用 lambda 把这些规则就地写出来。示例全部真编译真跑。",
  "cards": [
    {
      "id": "d9c123",
      "num": 123,
      "title": "仿函数：让对象像函数一样调用",
      "pain": "想给算法传一个「做什么」的规则，可只会写普通函数，状态带不进去。",
      "analogy": "仿函数像一个会干活的机器人：外形是对象，按一下按钮（operator()）就开始干活。",
      "only": "<b>分量：理解</b> · 说清「类 + 重载 () + 对象可调用」这三件事即可。",
      "guess": "先猜：Demo()(\"hi\") 这种匿名对象直接调用，能不能编译？",
      "codeMin": "class Demo { public: void operator()(string s) { cout << s << endl; } };\nDemo ob;\nob(\"hello\");",
      "codeFull": "#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Demo {\npublic:\n    void operator()(string s) { cout << s << endl; }\n};\n\nint main() {\n    Demo ob;\n    ob(\"hello\");        // 对象像函数一样调用\n    Demo()(\"world\");    // 匿名对象也能直接调\n}",
      "output": "hello\nworld",
      "errors": [
        "类里写了 <code>operator()(string)</code>，却写 <code>Demo d; d();</code>：<code>error: no match for call to '(Demo) ()'</code>。参数要按签名传。"
      ],
      "pitfalls": [
        "仿函数是<b>类</b>，不是函数；判断一个东西是不是仿函数，看它有没有重载 <code>operator()</code>。",
        "传给算法时要传<b>对象</b>（<code>Demo()</code>），不能只写类名 <code>Demo</code>。",
        "按参数个数分一元、二元、多元仿函数，和谓词的分类是同一套说法。"
      ],
      "concl": "仿函数 = 重载了 () 的类；它的对象能像函数一样被调用。",
      "terms": "函数对象 / 仿函数 / operator() / 一元仿函数 / 二元仿函数",
      "tags": ["仿函数", "基础"],
      "board": "",
      "quizIds": ["d9s01"]
    },
    {
      "id": "d9c124",
      "num": 124,
      "title": "仿函数比普通函数强在哪",
      "pain": "普通函数存不住状态，想累计次数只能加全局变量，多个调用互相污染。",
      "analogy": "普通函数像走廊里的公共计数器，谁都能改；仿函数像每个人手里的计数器，各记各的。",
      "only": "<b>分量：必背</b> · 有状态、可内联、STL 偏爱，面试高频。",
      "guess": "先猜：同一个仿函数类造出两个对象，各自的计数会互相影响吗？",
      "codeMin": "Counter c1, c2;\nc1(); c1();\nc2();",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nclass Counter {\n    int n = 0;\npublic:\n    void operator()() { cout << ++n << endl; }\n};\n\nvoid plain() {\n    static int n = 0;\n    cout << ++n << endl;\n}\n\nint main() {\n    Counter c1, c2;\n    c1(); c1();\n    c2();\n    plain(); plain();\n}",
      "output": "1\n2\n1\n1\n2",
      "errors": [],
      "pitfalls": [
        "仿函数用自己的成员保存状态，每个对象一份；普通函数要有状态只能用 static 或全局变量。",
        "STL 算法按<b>值</b>接收仿函数，算法内部改的是副本，想把状态拿回来要接返回值。",
        "函数对象容易被内联，普通函数通过函数指针调用几乎不可能内联。"
      ],
      "concl": "仿函数能带状态、容易内联、能配模板，所以 STL 偏爱它。",
      "terms": "状态 / 内联 / 函数指针 / 可调用对象 / STL 偏好",
      "tags": ["仿函数", "必背"],
      "board": "",
      "quizIds": ["d9s02", "d9s03"]
    },
    {
      "id": "d9c125",
      "num": 125,
      "title": "一元谓词：只回答是或否",
      "pain": "find_if 要一个判断条件，不知道该传函数名、函数指针还是对象。",
      "analogy": "谓词像安检门：每个人过去只回答「是/否」，不负责改行李。",
      "only": "<b>分量：必背</b> · 一元谓词的定义、find_if 用法、普通函数与仿函数两种写法。",
      "guess": "先猜：find_if 第三个参数写 isTen 还是 isTen()？",
      "codeMin": "bool isTen(int v) { return v == 10; }\nauto it = find_if(v.begin(), v.end(), isTen);",
      "codeFull": "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nbool isTen(int v) { return v == 10; }\n\nint main() {\n    vector<int> v = {10, 20, 30, 40, 50};\n    auto it = find_if(v.begin(), v.end(), isTen);\n    cout << (it != v.end() ? *it : -1) << endl;\n}",
      "output": "10",
      "errors": [
        "写成 <code>find_if(v.begin(), v.end(), isTen())</code>：<code>error: too few arguments to function 'bool isTen(int)'</code>。普通函数作谓词传函数名，不要加括号调用。",
        "仿函数写成 <code>IfExistTen</code>（类名）而不是 <code>IfExistTen()</code>（对象）：<code>no matching function for call to 'find_if(...)'</code>。"
      ],
      "pitfalls": [
        "谓词返回 <code>bool</code>，只做判断，不修改元素。",
        "普通函数传函数名；仿函数传对象，所以要加 <code>()</code>。",
        "谓词最好无副作用，STL 不知道你的业务规则，规则全靠谓词提供。"
      ],
      "concl": "一元谓词 = 收一个参数、返回 bool 的可调用对象；find_if 拿它做筛选。",
      "terms": "谓词 / 一元谓词 / find_if / 回调 / 仿函数",
      "tags": ["谓词", "必背"],
      "board": "",
      "quizIds": ["d9s04", "d9s05", "d9f01"]
    },
    {
      "id": "d9c126",
      "num": 126,
      "title": "二元谓词：给 sort 定排序规则",
      "pain": "sort 默认升序，想降序只会先排完再 reverse，遇到结构体更不会比。",
      "analogy": "裁判规则：拿到两个人，判断谁该排前面，返回 true 就按你说的排。",
      "only": "<b>分量：必背</b> · sort 第三个参数、二元谓词、仿函数写降序/自定义规则。",
      "guess": "先猜：比较函数返回 true，表示「a 排在 b 前面」还是「要交换」？",
      "codeMin": "struct Cmp { bool operator()(int a, int b) const { return a > b; } };\nsort(v.begin(), v.end(), Cmp());",
      "codeFull": "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nstruct Cmp {\n    bool operator()(int a, int b) const { return a > b; }\n};\n\nint main() {\n    vector<int> v = {30, 70, 10, 90, 80};\n    sort(v.begin(), v.end(), Cmp());   // 传对象，不是类名\n    for (int x : v) cout << x << \" \";\n    cout << endl;\n}",
      "output": "90 80 70 30 10",
      "errors": [
        "写成 <code>sort(v.begin(), v.end(), Cmp)</code>：<code>error: expected primary-expression before ')' token</code>。要传对象 <code>Cmp()</code>。",
        "比较函数写成 <code>return a &gt;= b;</code>：相等时也返回 true，不满足严格弱序，sort 可能越界或结果错乱。"
      ],
      "pitfalls": [
        "返回 true 表示 a 应该排在 b 前面，不是「交换」。",
        "必须满足严格弱序：相等必须返回 false。",
        "结构体排序就按「先比哪个字段、再比哪个字段」写清楚；参数用 <code>const T&amp;</code> 更通用。"
      ],
      "concl": "二元谓词决定「谁在前」，sort 的第三个参数就是它。",
      "terms": "二元谓词 / 比较函数 / 严格弱序 / sort",
      "tags": ["谓词", "排序", "必背"],
      "board": "",
      "quizIds": ["d9s06", "d9s07", "d9c02"]
    },
    {
      "id": "d9c127",
      "num": 127,
      "title": "内建函数对象：标准库已经写好了",
      "pain": "每次排序都自己写 greater 仿函数，其实标准库早给了现成的。",
      "analogy": "工具箱里现成的螺丝刀，不用每次自己磨一把。",
      "only": "<b>分量：理解</b> · 算数、关系、逻辑三类，会用 greater / less / plus 就够。",
      "guess": "先猜：greater&lt;int&gt;() 后面这对括号，是在调用函数吗？",
      "codeMin": "sort(v.begin(), v.end(), greater<int>());\ncout << plus<int>()(1, 2) << endl;",
      "codeFull": "#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <functional>\nusing namespace std;\n\nint main() {\n    cout << minus<float>()(3.14, 1.1) << endl;\n    cout << negate<int>()(5) << endl;\n\n    vector<int> v = {20, 10, 70, 90, 80};\n    sort(v.begin(), v.end(), greater<int>());\n    for (int x : v) cout << x << \" \";\n    cout << endl;\n}",
      "output": "2.04\n-5\n90 80 70 20 10",
      "errors": [
        "不 include <code>&lt;functional&gt;</code> 就用 greater：<code>error: 'greater' was not declared in this scope</code>。"
      ],
      "pitfalls": [
        "算数 6 个：plus / minus / multiplies / divides / modulus / negate（negate 是一元）。",
        "关系 6 个：equal_to / not_equal_to / greater / greater_equal / less / less_equal。",
        "<code>greater&lt;int&gt;()</code> 是造一个匿名对象，不是调用函数。"
      ],
      "concl": "内建函数对象就是标准库写好的仿函数，include &lt;functional&gt; 直接用。",
      "terms": "内建函数对象 / functional / greater / less / plus / negate",
      "tags": ["仿函数", "functional"],
      "board": "",
      "quizIds": ["d9s08", "d9s09"]
    },
    {
      "id": "d9c128",
      "num": 128,
      "title": "适配器 bind：把两个参数改成一个",
      "pain": "find_if 只要一元谓词，可 equal_to 要两个参数，接口对不上。",
      "analogy": "转换插头：把两脚插头改成三脚，电器本身不用换。",
      "only": "<b>分量：必背</b> · bind 固定一个参数、placeholders::_1 留一个位置。",
      "guess": "先猜：bind(equal_to&lt;int&gt;(), 10, placeholders::_1) 调用时还要传几个参数？",
      "codeMin": "auto f = bind(equal_to<int>(), 10, placeholders::_1);\nf(10);",
      "codeFull": "#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <functional>\nusing namespace std;\n\nint main() {\n    vector<int> v = {20, 10, 70, 90, 80};\n    auto res = bind(equal_to<int>(), 10, placeholders::_1);\n    auto it = find_if(v.begin(), v.end(), res);\n    cout << (it != v.end() ? \"found\" : \"no\") << endl;\n}",
      "output": "found",
      "errors": [
        "写成 <code>bind(equal_to&lt;int&gt;(), 10, _1)</code>：<code>error: '_1' was not declared in this scope</code>。占位符要写全 <code>placeholders::_1</code>。"
      ],
      "pitfalls": [
        "<code>_1</code> 表示「调用时传进来的第一个参数」，不是固定值。",
        "bind 返回的是一个新的可调用对象，不是计算结果；要调用它才执行。",
        "把 10 和 _1 换个位置，比较方向就反了，这是 bind 最灵活的用法。"
      ],
      "concl": "bind 把一部分参数先固定，剩下的用 _1/_2 占位，接口就匹配了。",
      "terms": "适配器 / bind / placeholders / _1 / 可调用对象",
      "tags": ["适配器", "bind", "必背"],
      "board": "",
      "quizIds": ["d9s10", "d9s11", "d9f02", "d9c04"]
    },
    {
      "id": "d9c129",
      "num": 129,
      "title": "bind 接普通函数：固定第二个参数",
      "pain": "for_each 每次只喂一个元素，可我的函数要两个参数。",
      "analogy": "把固定好的第二个参数提前写死，剩下那个口留给 for_each 喂。",
      "only": "<b>分量：理解</b> · bind(函数名, _1, 固定值) 的写法；重载函数要显式指定版本。",
      "guess": "先猜：函数重载过以后，bind 里只写函数名会发生什么？",
      "codeMin": "auto f = bind(mul, placeholders::_1, 3);\nfor_each(v.begin(), v.end(), f);",
      "codeFull": "#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <functional>\nusing namespace std;\n\nvoid mul(int v, int n) { cout << v * n << \" \"; }\n\nint main() {\n    vector<int> v = {10, 20, 15};\n    auto f = bind(mul, placeholders::_1, 3);\n    for_each(v.begin(), v.end(), f);\n    cout << endl;\n}",
      "output": "30 60 45 ",
      "errors": [
        "重载函数直接 bind：<code>error: no matching function for call to 'bind(&lt;unresolved overloaded function type&gt;, ...)'</code>。先用函数指针指定版本。"
      ],
      "pitfalls": [
        "函数没有重载时，bind 里直接写函数名。",
        "有重载时写 <code>void (*p)(int,int) = &amp;mul;</code>，再 bind 指针。",
        "函数指针适配器和仿函数适配器的写法一样，区别只在第一个参数是函数名还是对象。"
      ],
      "concl": "bind 也能接普通函数，把多出来的参数提前绑死即可。",
      "terms": "函数指针适配器 / bind / 重载 / for_each",
      "tags": ["适配器", "bind"],
      "board": "",
      "quizIds": ["d9s12"]
    },
    {
      "id": "d9c130",
      "num": 130,
      "title": "成员函数适配器：mem_fn 与 bind",
      "pain": "容器里存的是对象，for_each 想调成员函数，直接写 &Demo::print 调不了。",
      "analogy": "遥控器：mem_fn 把「按对象上的按钮」变成「把对象递过来就自动按」。",
      "only": "<b>分量：了解</b> · 知道 mem_fn 和 bind 两种写法、各自适合什么场景即可。",
      "guess": "先猜：for_each 把每个元素传给 mem_fn(&Demo::print) 时，元素是怎么变成 this 的？",
      "codeMin": "for_each(v.begin(), v.end(), mem_fn(&Demo::print));\nfor_each(v.begin(), v.end(), bind(&Demo::printN, placeholders::_1, 300));",
      "codeFull": "#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <functional>\nusing namespace std;\n\nclass Demo {\n    int a;\npublic:\n    Demo(int x) : a(x) {}\n    void print() { cout << a << \" \"; }\n    void printN(int n) { cout << a << \"-\" << n << \" \"; }\n};\n\nint main() {\n    vector<Demo> v = {Demo(10), Demo(30), Demo(50)};\n    for_each(v.begin(), v.end(), mem_fn(&Demo::print));\n    cout << endl;\n    for_each(v.begin(), v.end(), bind(&Demo::printN, placeholders::_1, 300));\n    cout << endl;\n}",
      "output": "10 30 50 \n10-300 30-300 50-300",
      "errors": [
        "直接传 <code>&amp;Demo::print</code>：<code>error: must use '.*' or '-&gt;*' to call pointer-to-member function</code>。成员函数有隐含 this，要先用 mem_fn 或 bind 包一层。"
      ],
      "pitfalls": [
        "成员函数不能当普通函数直接传给算法，因为多一个隐含的 this。",
        "无参成员函数用 <code>mem_fn</code> 最省事；要带额外参数用 <code>bind</code>，_1 留给对象。",
        "bind 成员函数时，第一个参数是对象位置，后面才是成员函数自己的参数。"
      ],
      "concl": "成员函数要先适配：无参 mem_fn，有参 bind。",
      "terms": "成员函数适配器 / mem_fn / bind / this",
      "tags": ["适配器", "成员函数"],
      "board": "",
      "quizIds": ["d9s13", "d9j01"]
    },
    {
      "id": "d9c131",
      "num": 131,
      "title": "取反适配器 not1 / not2",
      "pain": "想找「不满足条件」的元素，只能再写一个完全相反的谓词。",
      "analogy": "给判断加一个「非」开关，条件本身不用重写。",
      "only": "<b>分量：了解</b> · not1 反一元、not2 反二元；C++17 起已 deprecated，知道即可。",
      "guess": "先猜：not1(f)(30) 就是对 f(30) 取反吗？",
      "codeMin": "function<bool(int)> f = bind(greater<int>(), placeholders::_1, 50);\nauto g = not1(f);",
      "codeFull": "#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <functional>\nusing namespace std;\n\nint main() {\n    vector<int> v = {10, 80, 20, 90};\n    function<bool(int)> f = bind(greater<int>(), placeholders::_1, 50);\n    auto it = find_if(v.begin(), v.end(), not1(f));\n    cout << *it << endl;\n    cout << not1(f)(30) << endl;\n}",
      "output": "10\n1",
      "errors": [
        "把裸函数名直接交给 not1：C++17 下模板推导失败，<code>no matching function for call to 'not1(&lt;unresolved overloaded function type&gt;)'</code>。先用 <code>function</code> 包一层。"
      ],
      "pitfalls": [
        "not1 只接受一元谓词，not2 只接受二元谓词。",
        "C++17 起 not1 / not2 被标记 deprecated，新代码直接写 lambda 更清楚。",
        "原文也把取反适配器标成「了解」：场景少、写法绕，知道概念即可。"
      ],
      "concl": "not1 / not2 给谓词加「非」，但新代码优先用 lambda。",
      "terms": "not1 / not2 / 取反适配器 / deprecated",
      "tags": ["适配器", "了解"],
      "board": "",
      "quizIds": ["d9s14", "d9s15"]
    },
    {
      "id": "d9c132",
      "num": 132,
      "title": "算法铁律：算法不操作容器",
      "pain": "总想写 v.sort()，或者以为算法能直接改整个容器。",
      "analogy": "算法是外派工人，只认「从哪到哪」的区间，不认整个仓库。",
      "only": "<b>分量：必背</b> · 算法不操作容器、只通过迭代器访问、并非所有容器都支持 sort。",
      "guess": "先猜：list 能不能直接用 std::sort？",
      "codeMin": "sort(v.begin(), v.end());\n// v.sort() 不存在",
      "codeFull": "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    vector<int> v = {30, 10, 20};\n    auto it = find(v.begin(), v.end(), 20);\n    cout << (it - v.begin()) << endl;\n\n    sort(v.begin(), v.end());\n    for (int x : v) cout << x << \" \";\n    cout << endl;\n}",
      "output": "2\n10 20 30",
      "errors": [
        "<code>v.sort()</code>：<code>error: 'class std::vector&lt;int&gt;' has no member named 'sort'</code>。算法是全局函数模板，不是容器成员。",
        "对 list 用 <code>std::sort</code>：<code>error: static assertion failed: std::sort requires random access iterators</code>。list 用自带的 <code>list::sort()</code>。"
      ],
      "pitfalls": [
        "算法收的是一对迭代器 <code>[begin, end)</code>，不是容器本身。",
        "改元素要写 <code>*it = value</code>，不能写 <code>it = value</code>。",
        "vector / deque 支持 std::sort；list 用 list::sort；set / map 自动有序，不需要排序算法。"
      ],
      "concl": "算法不碰容器，只走迭代器区间；容器能力决定能用哪些算法。",
      "terms": "算法 / 迭代器区间 / 成员函数 / 随机访问迭代器",
      "tags": ["算法", "必背"],
      "board": "",
      "quizIds": ["d9s16", "d9s17", "d9j02"]
    },
    {
      "id": "d9c133",
      "num": 133,
      "title": "for_each：遍历并带回状态",
      "pain": "遍历时想顺便累加、统计，循环里写一堆，还容易越界。",
      "analogy": "挨个把元素递给你，你只管对每个元素做同一件事。",
      "only": "<b>分量：必背</b> · 第三个参数传可调用对象，返回值能拿回内部状态。",
      "guess": "先猜：for_each 遍历完，会不会把函数对象改过的状态带回来？",
      "codeMin": "Add a = for_each(v.begin(), v.end(), Add());\ncout << a.sum << endl;",
      "codeFull": "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nstruct Add {\n    int sum = 0;\n    void operator()(int x) { sum += x; }\n};\n\nint main() {\n    vector<int> v = {10, 20, 30};\n    Add a = for_each(v.begin(), v.end(), Add());\n    cout << a.sum << endl;\n}",
      "output": "60",
      "errors": [
        "传类名 <code>Add</code>：<code>error: expected primary-expression before ')' token</code>。要传对象 <code>Add()</code>。"
      ],
      "pitfalls": [
        "for_each 按值接收函数对象，内部改的是副本；想要结果就接返回值。",
        "不想接返回值，可以用 lambda 引用捕获外部变量。",
        "for_each 不改变元素顺序，也不会帮你删除元素。"
      ],
      "concl": "for_each 负责遍历，做什么由你传的可调用对象决定，状态靠返回值带回。",
      "terms": "for_each / 回调 / 函数对象 / 返回值",
      "tags": ["算法", "遍历", "必背"],
      "board": "",
      "quizIds": ["d9s18", "d9f03", "d9c03"]
    },
    {
      "id": "d9c134",
      "num": 134,
      "title": "transform：搬运并加工到另一个容器",
      "pain": "想把一个容器的元素加工后放进另一个容器，循环写得长还容易漏分配。",
      "analogy": "流水线：这头进原料，那头出成品，成品筐必须先准备好。",
      "only": "<b>分量：必背</b> · 目标容器必须先 resize，返回目标区间末尾迭代器。",
      "guess": "先猜：目标容器只 reserve 不 resize，transform 能不能写进去？",
      "codeMin": "v2.resize(v1.size());\ntransform(v1.begin(), v1.end(), v2.begin(), Sqr());",
      "codeFull": "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nstruct Sqr {\n    int operator()(int x) const { return x * x; }\n};\n\nint main() {\n    vector<int> v = {1, 2, 3};\n    vector<int> r(v.size());\n    transform(v.begin(), v.end(), r.begin(), Sqr());\n    for (int x : r) cout << x << \" \";\n    cout << endl;\n}",
      "output": "1 4 9",
      "errors": [
        "目标 vector 只 <code>reserve</code> 没 <code>resize</code> 就 transform：能编译，但写入的是没有元素的位置，运行期崩溃或未定义行为。",
        "目标 vector 完全没分配：<code>r.begin()</code> 等于 <code>r.end()</code>，同样越界写。"
      ],
      "pitfalls": [
        "transform 不负责给目标容器分配内存，必须先 <code>resize</code>。",
        "<code>resize</code> 改 size，<code>reserve</code> 只改 capacity，两者不能混。",
        "源和目标可以是同一个区间，做原地变换。"
      ],
      "concl": "transform 只搬不管分配：目标先 resize，再传 begin()。",
      "terms": "transform / resize / reserve / 目标区间",
      "tags": ["算法", "transform", "必背"],
      "board": "",
      "quizIds": ["d9s19", "d9s20", "d9j03"]
    },
    {
      "id": "d9c135",
      "num": 135,
      "title": "find 与 find_if：找值和找条件",
      "pain": "查找时拿到结果就以为完事，换一个容器就不知道位置怎么表示。",
      "analogy": "在一排箱子里找东西：find 找「长这样的」，find_if 找「符合你条件的」。",
      "only": "<b>分量：必背</b> · 返回迭代器，找不到返回 end()，用 != end() 判断。",
      "guess": "先猜：find 找不到时返回什么？是 -1 吗？",
      "codeMin": "auto it = find(v.begin(), v.end(), 20);\nif (it != v.end()) cout << *it << endl;",
      "codeFull": "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nstruct GT {\n    int t;\n    bool operator()(int x) const { return x > t; }\n};\n\nint main() {\n    vector<int> v = {10, 20, 30};\n    auto it = find_if(v.begin(), v.end(), GT{25});\n    cout << *it << endl;\n\n    auto it2 = find(v.begin(), v.end(), 99);\n    cout << (it2 == v.end()) << endl;\n}",
      "output": "30\n1",
      "errors": [
        "用 <code>it != nullptr</code> 判断：迭代器和指针不是一种东西，编译报类型不匹配。统一和 <code>v.end()</code> 比。",
        "对 list 的 find 结果做 <code>it - v.begin()</code>：双向迭代器不支持相减，<code>error: no match for 'operator-'</code>。"
      ],
      "pitfalls": [
        "find 比的是值相等，find_if 比的是谓词为真。",
        "找不到返回 <code>end()</code>，不是 -1、不是 nullptr。",
        "只有随机访问迭代器（vector/deque）能相减求下标。"
      ],
      "concl": "find 找值、find_if 找条件，结果都是迭代器，和 end() 比。",
      "terms": "find / find_if / 迭代器 / end()",
      "tags": ["算法", "查找", "必背"],
      "board": "",
      "quizIds": ["d9s21", "d9s22", "d9f04"]
    },
    {
      "id": "d9c136",
      "num": 136,
      "title": "adjacent_find 与 binary_search",
      "pain": "想找相邻重复、想快速判断存不存在，只会手写两层循环。",
      "analogy": "adjacent_find 看队伍里有没有肩并肩穿一样衣服的；binary_search 像翻字典先翻中间。",
      "only": "<b>分量：理解</b> · adjacent_find 找相邻重复，binary_search 必须先有序。",
      "guess": "先猜：没排序的 vector 直接 binary_search，结果可信吗？",
      "codeMin": "auto it = adjacent_find(v.begin(), v.end());\nbool ok = binary_search(v.begin(), v.end(), 30);",
      "codeFull": "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    vector<int> v = {10, 10, 30, 40};\n    auto it = adjacent_find(v.begin(), v.end());\n    cout << *it << endl;\n    cout << binary_search(v.begin(), v.end(), 30) << endl;\n    cout << binary_search(v.begin(), v.end(), 35) << endl;\n}",
      "output": "10\n1\n0",
      "errors": [
        "对无序容器 binary_search：编译能过，结果不可信。它不是运行时报错，是最难查的逻辑错误。"
      ],
      "pitfalls": [
        "binary_search 只回答「在不在」，要位置用 lower_bound / upper_bound。",
        "binary_search 的前提是区间已按同一规则有序。",
        "adjacent_find 不带谓词时比较相等，带谓词时按谓词找相邻满足条件的。"
      ],
      "concl": "adjacent_find 找相邻重复，binary_search 在有序区间里判存在。",
      "terms": "adjacent_find / binary_search / lower_bound / 有序",
      "tags": ["算法", "查找"],
      "board": "",
      "quizIds": ["d9s23", "d9f05"]
    },
    {
      "id": "d9c137",
      "num": 137,
      "title": "count 与 count_if：数个数",
      "pain": "统计出现次数、统计满足条件的个数，还在手写计数器。",
      "analogy": "数人头：count 数「长这样的」，count_if 数「符合条件的」。",
      "only": "<b>分量：理解</b> · 两个函数的第三个参数不同，返回值类型也要注意。",
      "guess": "先猜：count 和 count_if 的第三个参数分别是什么？",
      "codeMin": "cout << count(v.begin(), v.end(), 10) << endl;\ncout << count_if(v.begin(), v.end(), Big()) << endl;",
      "codeFull": "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nstruct Big {\n    bool operator()(int x) const { return x > 15; }\n};\n\nint main() {\n    vector<int> v = {10, 10, 30, 10};\n    cout << count(v.begin(), v.end(), 10) << endl;\n    cout << count_if(v.begin(), v.end(), Big()) << endl;\n}",
      "output": "3\n1",
      "errors": [
        "count_if 第三个参数传值 <code>15</code>：<code>no matching function for call to 'count_if(...)'</code>，它要的是谓词，不是阈值。"
      ],
      "pitfalls": [
        "count 按值统计，count_if 按条件统计。",
        "返回值是 <code>ptrdiff_t</code>，和 <code>size()</code> 的 <code>size_t</code> 混比可能有符号警告。",
        "统计「大于某值」这种阈值条件，用 lambda 写最直接。"
      ],
      "concl": "count 数等值，count_if 数满足谓词的个数。",
      "terms": "count / count_if / 谓词 / 统计",
      "tags": ["算法", "统计"],
      "board": "",
      "quizIds": ["d9j04", "d9f06"]
    },
    {
      "id": "d9c138",
      "num": 138,
      "title": "merge 与 reverse：归并与反转",
      "pain": "合并两个有序数组还要自己写双指针，反转还要手动 swap。",
      "analogy": "merge 像把两摞已经排好的牌并成一摞；reverse 像把整摞牌翻个面。",
      "only": "<b>分量：理解</b> · merge 要求两段都有序、目标先 resize；reverse 原地反转。",
      "guess": "先猜：merge 两个无序 vector，结果一定有序吗？",
      "codeMin": "v3.resize(v1.size() + v2.size());\nmerge(v1.begin(), v1.end(), v2.begin(), v2.end(), v3.begin());",
      "codeFull": "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    vector<int> a = {20, 40, 50}, b = {10, 30, 60};\n    vector<int> c(a.size() + b.size());\n    merge(a.begin(), a.end(), b.begin(), b.end(), c.begin());\n    for (int x : c) cout << x << \" \";\n    cout << endl;\n\n    reverse(a.begin(), a.end());\n    for (int x : a) cout << x << \" \";\n    cout << endl;\n}",
      "output": "10 20 30 40 50 60 \n50 40 20",
      "errors": [
        "merge 目标容器没 resize：写入越界，运行期崩溃或未定义行为。",
        "merge 的两个源没排序：结果不是有序，但不会报错，属于逻辑错误。"
      ],
      "pitfalls": [
        "merge 不排序，只做归并；两个源必须按同一规则有序。",
        "目标容器大小要至少等于两段之和，先 <code>resize</code>。",
        "reverse 原地改原容器，返回 void；想反向遍历也可以用 rbegin/rend。"
      ],
      "concl": "merge 合并两段有序区间，reverse 原地反转。",
      "terms": "merge / reverse / 归并 / 有序",
      "tags": ["算法", "排序"],
      "board": "",
      "quizIds": ["d9s24", "d9j05"]
    },
    {
      "id": "d9c139",
      "num": 139,
      "title": "copy、replace 与 replace_if",
      "pain": "拷贝、替换元素还在写循环，条件替换更麻烦。",
      "analogy": "copy 是复印机，replace 是「把这种字改成那种字」，replace_if 是「符合条件的都改」。",
      "only": "<b>分量：理解</b> · 三个函数的参数顺序，以及 replace_if 的谓词在第三位。",
      "guess": "先猜：replace_if 的第三个参数是旧值还是谓词？",
      "codeMin": "replace(v.begin(), v.end(), 60, 600);\nreplace_if(v.begin(), v.end(), LT(), 0);",
      "codeFull": "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nstruct LT {\n    bool operator()(int x) const { return x < 50; }\n};\n\nint main() {\n    vector<int> v = {10, 60, 20, 80};\n    replace(v.begin(), v.end(), 60, 600);\n    replace_if(v.begin(), v.end(), LT(), 0);\n\n    vector<int> d(v.size());\n    copy(v.begin(), v.end(), d.begin());\n    for (int x : d) cout << x << \" \";\n    cout << endl;\n}",
      "output": "0 600 0 80",
      "errors": [
        "copy 目标没 resize：越界写，运行期崩溃或未定义行为。",
        "<code>replace_if(v.begin(), v.end(), 60, 0)</code>：第三个参数要谓词，传 int 编译不过。"
      ],
      "pitfalls": [
        "copy 不分配内存，目标容器要先有足够元素。",
        "replace 找的是「等于旧值」，replace_if 找的是「谓词为真」。",
        "replace_if 的参数顺序是：区间、谓词、新值。"
      ],
      "concl": "copy 搬运，replace 按值换，replace_if 按条件换。",
      "terms": "copy / replace / replace_if / 谓词",
      "tags": ["算法", "修改"],
      "board": "",
      "quizIds": ["d9s25", "d9j06"]
    },
    {
      "id": "d9c140",
      "num": 140,
      "title": "accumulate 与 fill",
      "pain": "求和还写循环，初始化数组还写 for。",
      "analogy": "accumulate 是收银机一路加；fill 是把整排格子一次刷成同一个颜色。",
      "only": "<b>分量：理解</b> · accumulate 在 &lt;numeric&gt;，第三个参数是初始值；fill 覆盖整个区间。",
      "guess": "先猜：accumulate 的初始值写 0 和写 0.0，结果类型一样吗？",
      "codeMin": "int s = accumulate(v.begin(), v.end(), 0);\nfill(v.begin(), v.end(), 7);",
      "codeFull": "#include <iostream>\n#include <vector>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    vector<int> v = {10, 20, 30};\n    cout << accumulate(v.begin(), v.end(), 0) << endl;\n\n    fill(v.begin(), v.end(), 7);\n    for (int x : v) cout << x << \" \";\n    cout << endl;\n}",
      "output": "60\n7 7 7",
      "errors": [
        "只 include &lt;algorithm&gt; 就用 accumulate：<code>error: 'accumulate' was not declared in this scope</code>。它在 <code>&lt;numeric&gt;</code>。"
      ],
      "pitfalls": [
        "accumulate 的第三个参数是初始值，它的类型决定累加结果的类型。",
        "求平均值要写 <code>0.0</code> 作初始值，否则整数除法会把小数丢掉。",
        "fill 是覆盖，不是追加；区间写错会改到不该改的元素。"
      ],
      "concl": "accumulate 求和、fill 填充；前者在 numeric，后者在 algorithm。",
      "terms": "accumulate / fill / numeric / 初始值",
      "tags": ["算法", "数值"],
      "board": "",
      "quizIds": ["d9s26", "d9f07"]
    },
    {
      "id": "d9c141",
      "num": 141,
      "title": "集合算法：交、并、差",
      "pain": "求交集并集差集，自己写循环又慢又容易错。",
      "analogy": "两堆名单做比对：交集是都有的，并集是合起来去重，差集是只在第一堆的。",
      "only": "<b>分量：了解</b> · 三个函数都要求两段有序、目标容器先开够空间。",
      "guess": "先猜：求交集前需不需要先把两个 vector 排序？",
      "codeMin": "auto e = set_intersection(a.begin(), a.end(), b.begin(), b.end(), c.begin());\ne = set_difference(a.begin(), a.end(), b.begin(), b.end(), c.begin());",
      "codeFull": "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    vector<int> a = {10, 20, 40, 50, 110};\n    vector<int> b = {10, 30, 40, 70, 110};\n    vector<int> c(10);\n\n    auto e = set_intersection(a.begin(), a.end(), b.begin(), b.end(), c.begin());\n    for (auto it = c.begin(); it != e; ++it) cout << *it << \" \";\n    cout << endl;\n\n    e = set_difference(a.begin(), a.end(), b.begin(), b.end(), c.begin());\n    for (auto it = c.begin(); it != e; ++it) cout << *it << \" \";\n    cout << endl;\n}",
      "output": "10 40 110 \n20 50",
      "errors": [
        "没排序直接 set_intersection：结果不对但不报错，属于逻辑错误。",
        "目标容器容量不够：越界写，运行期崩溃或未定义行为。"
      ],
      "pitfalls": [
        "三个集合算法都要求两个区间有序。",
        "差集有方向：a-b 和 b-a 结果不同。",
        "返回的是目标区间末尾迭代器，遍历时以它为终点，不要用 c.end()。"
      ],
      "concl": "交并差都按有序区间做，目标先开够空间，用返回值当终点。",
      "terms": "set_intersection / set_union / set_difference / 有序",
      "tags": ["算法", "集合"],
      "board": "",
      "quizIds": ["d9s27", "d9j07"]
    },
    {
      "id": "d9c142",
      "num": 142,
      "title": "lambda 基础：捕获列表怎么写",
      "pain": "为了给算法传一个小条件，专门写一个类或全局函数，太啰嗦。",
      "analogy": "便利贴：用到哪贴到哪，写完就能扔，不用建档案。",
      "only": "<b>分量：必背</b> · []、[=]、[&]、混合捕获、[this]，以及值捕获默认只读。",
      "guess": "先猜：[=] 捕获进来的变量，在 lambda 里能修改吗？",
      "codeMin": "auto add = [](int x, int y) { return x + y; };\nauto f = [=] { return a + b; };",
      "codeFull": "#include <iostream>\nusing namespace std;\n\nint main() {\n    auto add = [](int x, int y) { return x + y; };\n    cout << add(10, 20) << endl;\n\n    int a = 10, b = 20;\n    auto f = [=] { return a + b; };\n    cout << f() << endl;\n\n    int c = 1, d = 2;\n    auto g = [c, &d] { d = 100; return c + d; };\n    cout << c << \" \" << g() << \" \" << d << endl;\n}",
      "output": "30\n30\n1 101 100",
      "errors": [
        "在 <code>[=]</code> 的 lambda 里改 a：<code>error: assignment of read-only variable 'a'</code>。要改就换 <code>[&amp;]</code>，或者加 mutable（改的仍是副本）。"
      ],
      "pitfalls": [
        "lambda 本质是编译器生成的匿名函数对象，捕获的变量就是它的成员。",
        "<code>[=]</code> 值捕获：副本只读；<code>[&amp;]</code> 引用捕获：能改原变量。",
        "引用捕获要保证变量活得比 lambda 长，否则会悬空。"
      ],
      "concl": "捕获列表决定 lambda 能看见谁、按值还是按引用；值捕获默认只读。",
      "terms": "lambda / 捕获列表 / 值捕获 / 引用捕获 / mutable",
      "tags": ["lambda", "必背"],
      "board": "",
      "quizIds": ["d9s28", "d9f08", "d9j08", "d9c01"]
    },
    {
      "id": "d9c143",
      "num": 143,
      "title": "lambda 操作容器：和算法直接搭",
      "pain": "for_each / transform 每换一个条件就要新写一个仿函数类。",
      "analogy": "现场写规则，直接塞给算法，不用提前准备模具。",
      "only": "<b>分量：必背</b> · for_each 配 lambda、transform 配 lambda、引用捕获累加。",
      "guess": "先猜：[&amp;sum] 和 [sum] 用来累加，结果差在哪？",
      "codeMin": "for_each(v.begin(), v.end(), [&sum](int x) { sum += x; });",
      "codeFull": "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    vector<int> v = {10, 20, 30};\n    vector<int> r(v.size());\n    transform(v.begin(), v.end(), r.begin(), [](int x) { return x * x; });\n    for (int x : r) cout << x << \" \";\n    cout << endl;\n\n    int s = 0;\n    for_each(v.begin(), v.end(), [&s](int x) { s += x; });\n    cout << s << endl;\n}",
      "output": "100 400 900 \n60",
      "errors": [
        "累加时写 <code>[s](int x) { s += x; }</code>：<code>error: assignment of read-only variable 's'</code>。要引用捕获。",
        "写了 <code>[s]</code> 再加 mutable：能编译，但改的是副本，外面的 s 还是 0。"
      ],
      "pitfalls": [
        "要改外部变量必须引用捕获 <code>[&amp;sum]</code>。",
        "transform 的目标容器仍要先 resize。",
        "lambda 捕获的是定义位置能看见的名字，不是运行时再去找。"
      ],
      "concl": "lambda 让 for_each / transform 少写一个类，规则就地表达。",
      "terms": "lambda / for_each / transform / 引用捕获",
      "tags": ["lambda", "算法", "必背"],
      "board": "",
      "quizIds": ["d9c05"]
    },
    {
      "id": "d9c144",
      "num": 144,
      "title": "lambda 与仿函数是什么关系",
      "pain": "面试问「lambda 底层是什么」答不上来，也不知道能不能存进容器。",
      "analogy": "手写仿函数是定制模具，lambda 是现场捏一个一模一样的，编译器替你生成类。",
      "only": "<b>分量：理解</b> · lambda 就是编译器生成的仿函数，都能装进 std::function。",
      "guess": "先猜：两个代码完全一样的 lambda，类型是不是同一个？",
      "codeMin": "function<int(int)> f = [](int x) { return x + 1; };\nvector<function<int(int)>> fs;",
      "codeFull": "#include <iostream>\n#include <vector>\n#include <functional>\nusing namespace std;\n\nint main() {\n    function<int(int)> f = [](int x) { return x + 1; };\n    cout << f(10) << endl;\n\n    vector<function<int(int)>> fs;\n    int base = 5;\n    fs.push_back([base](int x) { return base + x; });\n    fs.push_back([](int x) { return x * x; });\n    for (auto& fn : fs) cout << fn(10) << \" \";\n    cout << endl;\n}",
      "output": "11\n15 100",
      "errors": [
        "把 lambda 直接放进 <code>vector&lt;decltype(lambda)&gt;</code>：每个 lambda 类型都不同，第二个就塞不进去。统一用 <code>std::function</code> 包装。"
      ],
      "pitfalls": [
        "每个 lambda 都有自己唯一的匿名类型，代码一样也不是同一类型。",
        "要存进容器、当回调保存，用 <code>std::function</code> 包一层。",
        "捕获越多，生成的对象越大；不捕获的 lambda 可以转成普通函数指针。"
      ],
      "concl": "lambda = 编译器生成的仿函数对象；要统一存放就用 std::function。",
      "terms": "lambda / 仿函数 / std::function / 匿名类型",
      "tags": ["lambda", "仿函数"],
      "board": "",
      "quizIds": ["d9c06"]
    }
  ],
  "taskTitle": "Day 9 · 今天动手",
  "taskDesc": "两个任务都在本机跑：任务 1 用仿函数和谓词做成绩排序、统计及格、找第一个不及格；任务 2 用 lambda 配 transform / accumulate / set_difference 做一轮综合处理。数据写在代码里，复制走就能跑。",
  "tasks": [
    {
      "id": "d9t1",
      "title": "任务 1 · 仿函数 + 谓词处理成绩",
      "goal": "<b>目标</b>：用 <code>vector&lt;int&gt;</code> 存 8 个成绩，自定义降序仿函数排序，用 <code>count_if</code> 统计及格人数，用 <code>find_if</code> 找第一个不及格分数。",
      "code": "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nstruct Desc {\n    bool operator()(int a, int b) const { return a > b; }\n};\nstruct Pass {\n    bool operator()(int x) const { return x >= 60; }\n};\nstruct Fail {\n    bool operator()(int x) const { return x < 60; }\n};\n\nint main() {\n    vector<int> s = {65, 90, 78, 55, 88, 92, 47, 70};\n\n    sort(s.begin(), s.end(), Desc());\n    for (int x : s) cout << x << \" \";\n    cout << endl;\n\n    cout << count_if(s.begin(), s.end(), Pass()) << endl;\n\n    auto it = find_if(s.begin(), s.end(), Fail());\n    cout << (it != s.end() ? *it : -1) << endl;\n}",
      "output": "92 90 88 78 70 65 55 47 \n6\n55",
      "tip": "三个仿函数各管一件事：Desc 管排序，Pass 和 Fail 是两个相反的谓词。把某个分数改成 100 或 30，再跑一遍，三个输出都会跟着变。"
    },
    {
      "id": "d9t2",
      "title": "任务 2 · lambda + 算法综合",
      "goal": "<b>目标</b>：用 <code>transform</code> 把 <code>{10,20,30,40,50}</code> 平方到新容器，用 <code>accumulate</code> 求和，用 <code>set_difference</code> 去掉 <code>{20,40}</code>，最后用 <code>count_if</code> 数大于 25 的个数。",
      "code": "#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    vector<int> v1 = {10, 20, 30, 40, 50};\n    vector<int> v2(v1.size());\n    transform(v1.begin(), v1.end(), v2.begin(), [](int x) { return x * x; });\n    for (int x : v2) cout << x << \" \";\n    cout << endl;\n\n    cout << accumulate(v2.begin(), v2.end(), 0) << endl;\n\n    vector<int> v3 = {20, 40};\n    vector<int> v4(v1.size());\n    auto e = set_difference(v1.begin(), v1.end(), v3.begin(), v3.end(), v4.begin());\n    for (auto it = v4.begin(); it != e; ++it) cout << *it << \" \";\n    cout << endl;\n\n    cout << count_if(v1.begin(), v1.end(), [](int x) { return x > 25; }) << endl;\n}",
      "output": "100 400 900 1600 2500 \n5500\n10 30 50 \n3",
      "tip": "注意 <code>v2</code> 和 <code>v4</code> 都是先按源容器大小开好空间；<code>set_difference</code> 的终点要接返回值，不能写 <code>v4.end()</code>。"
    }
  ],
  "gloss": {
    "title": "今天这 10 个面试题，先用人话过一遍",
    "html": "<h4>今天这 10 个面试题，先用人话过一遍</h4>\n    <p><b>① 什么是函数对象？</b>重载了 <code>operator()</code> 的类的对象，能像函数一样调用，也叫仿函数。它本质是对象，可以带成员状态，所以 STL 偏爱它。</p>\n    <p><b>② 仿函数和普通函数的区别？</b>仿函数有状态、容易被内联、能配模板；普通函数没有状态（除非用 static/全局），通过函数指针调用很难内联。</p>\n    <p><b>③ 什么是谓词？</b>返回 bool、只做判断的可调用对象，普通函数和仿函数都算。收一个参数叫一元谓词，收两个叫二元谓词。</p>\n    <p><b>④ 一元/二元谓词分别用在哪？</b>一元谓词给 find_if、count_if、remove_if 这类单元素判断；二元谓词给 sort、merge 这类需要比较两个元素的算法。</p>\n    <p><b>⑤ 适配器是什么？bind 怎么用？</b>适配器把现有接口改成算法需要的样子。bind 先固定一部分参数，剩下的用 placeholders::_1 占位，返回一个新的可调用对象。</p>\n    <p><b>⑥ 为什么说算法不操作容器？</b>算法收的是一对迭代器区间，只通过迭代器读写元素，不知道容器类型；所以 vector/deque 能用 std::sort，list 要用自己的 list::sort。</p>\n    <p><b>⑦ for_each 和 transform 的区别？</b>for_each 原地遍历、对每个元素做事，返回函数对象；transform 把结果写到另一个区间，目标容器必须先 resize。</p>\n    <p><b>⑧ find 和 find_if 的区别？</b>find 按值相等查找；find_if 按谓词查找。两个都返回迭代器，找不到返回 end()。</p>\n    <p><b>⑨ lambda 的捕获列表有哪几种？</b>[] 不捕获、[=] 按值捕获全部、[&amp;] 按引用捕获全部、[a, &amp;b] 混合捕获、[this] 捕获当前对象指针。值捕获默认只读。</p>\n    <p><b>⑩ lambda 和仿函数是什么关系？</b>lambda 就是编译器生成的匿名仿函数类，捕获的变量是它的成员。每个 lambda 类型唯一，要统一存放就用 std::function。</p>\n    <p class=\"say\">这天的重心是「把规则传给算法」：仿函数/谓词是规则，bind 是改接口，for_each/transform/find_if 是执行，lambda 是最省事的写法。必背卡先把这四件事串起来，集合算法和 not1/not2 知道有就行。</p>"
  }
};
