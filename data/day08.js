/* Day 8 · 常用库 day1：STL 与常用容器（卡片） */
window.DAYS = window.DAYS || {};
window.DAYS.day8 = {
  "id": "day8",
  "title": "Day 8 · 常用库 day1",
  "desc": "STL 第一天的内容：先认容器、算法、迭代器三件套，再把 string、vector、deque、stack、queue、list、set、map 依次过一遍。重点是 string、vector、map，示例全部真编译真跑。",
  "cards": [
    {
      "id": "d8c101",
      "num": 101,
      "title": "STL 是什么：容器、算法、迭代器",
      "pain": "每次写数组排序、查找、去重都手写一遍，代码又长又容易错。",
      "analogy": "STL 像一套标准厨房：锅碗（容器）、菜谱（算法）、传菜员（迭代器）都是现成的，你只管搭配。",
      "only": "<b>分量：理解</b> · 能说清容器装数据、算法操作数据、迭代器在中间粘合即可。",
      "guess": "先猜：排序一个 vector，需要自己写循环吗？",
      "codeMin": "vector<int> v = {3, 1, 2};\nsort(v.begin(), v.end());",
      "codeFull": "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    vector<int> v = {3, 1, 2};\n    sort(v.begin(), v.end());          // 算法 + 迭代器\n    for (int x : v) cout << x << endl; // 容器\n}",
      "output": "1\n2\n3",
      "errors": [],
      "pitfalls": [
        "STL 六大组件是容器、算法、迭代器、仿函数、适配器、空间配置器；前三个是日常直接用的。",
        "算法不直接操作容器，而是通过一对迭代器 [begin, end) 操作区间。"
      ],
      "concl": "容器装数据，算法操作数据，迭代器把两者接起来。",
      "terms": "STL / 容器 / 算法 / 迭代器 / 仿函数 / 适配器 / 空间配置器",
      "tags": ["STL", "基础"],
      "board": "",
      "quizIds": ["d8s01"]
    },
    {
      "id": "d8c102",
      "num": 102,
      "title": "三大组件与算法分类",
      "pain": "知道有 sort 和 find，但说不清容器、算法各自负责什么，也不知道算法会不会改数据。",
      "analogy": "容器是仓库，算法是搬运工：有的只清点（非质变），有的会重新摆放（质变）。",
      "only": "<b>分量：理解</b> · 分清序列式/关联式容器、质变/非质变算法即可。",
      "guess": "先猜：find 和 sort，哪个会改动容器里的元素？",
      "codeMin": "auto it = find(v.begin(), v.end(), 20);\nsort(v.begin(), v.end(), greater<int>());",
      "codeFull": "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    vector<int> v = {10, 20, 30};\n    auto it = find(v.begin(), v.end(), 20);   // 非质变：只查找\n    cout << (it - v.begin()) << endl;\n\n    sort(v.begin(), v.end(), greater<int>()); // 质变：会改顺序\n    for (int x : v) cout << x << endl;\n}",
      "output": "1\n30\n20\n10",
      "errors": [],
      "pitfalls": [
        "序列式容器（vector/deque/list）元素有固定位置；关联式容器（set/map）按 key 自动排序。",
        "质变算法会改元素内容（sort/copy/replace），非质变算法不改（find/count/for_each）。"
      ],
      "concl": "容器分序列式和关联式，算法分质变和非质变，先分清再选。",
      "terms": "序列式容器 / 关联式容器 / 质变算法 / 非质变算法",
      "tags": ["STL", "基础"],
      "board": "",
      "quizIds": ["d8s02", "d8s03"]
    },
    {
      "id": "d8c103",
      "num": 103,
      "title": "迭代器的五种类型",
      "pain": "知道 list 不能 it+n，但不知道为什么，也说不清 vector 的迭代器强在哪。",
      "analogy": "五种交通工具：能看不能碰的观光车、只能写不能读的货车、能前进的自行车、能进退的汽车、能随便跳站的动车。",
      "only": "<b>分量：了解</b> · 记住五种名字和「vector 随机、list 双向」就够。",
      "guess": "先猜：vector 的迭代器能不能直接 it + 2？",
      "codeMin": "vector<int>::iterator it = v.begin();\ncout << *(it + 2) << endl;",
      "codeFull": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> v = {10, 20, 30};\n    vector<int>::iterator it = v.begin();\n    cout << *(it + 2) << endl;   // 随机访问：直接跳 2 个\n}",
      "output": "30",
      "errors": [
        "list 迭代器写 <code>it + 2</code>：<code>error: no match for 'operator+' (operand types are 'std::_List_iterator&lt;int&gt;' and 'int')</code>。list 是双向迭代器，只能 <code>++it</code>，要走多步用 <code>advance(it, 2)</code>。"
      ],
      "pitfalls": [
        "输入/输出/前向/双向/随机访问，能力从左到右递增。",
        "vector 是随机访问，list 是双向，stack/queue 根本没有迭代器。"
      ],
      "concl": "vector 迭代器能跳，list 迭代器只能一步一步走。",
      "terms": "输入迭代器 / 输出迭代器 / 前向迭代器 / 双向迭代器 / 随机访问迭代器",
      "tags": ["STL", "迭代器"],
      "board": "",
      "quizIds": ["d8s04"]
    },
    {
      "id": "d8c104",
      "num": 104,
      "title": "string 的构造、赋值与拼接",
      "pain": "C 风格字符数组要自己算长度、自己管内存，拼接还容易越界。",
      "analogy": "string 像会自动长大的收纳袋，往里塞字、拼接口，它自己负责扩容。",
      "only": "<b>分量：必背</b> · 四种构造、+= 和 append 的写法，每天写代码都在用。",
      "guess": "先猜：string s(3, 'A') 得到什么？",
      "codeMin": "string s1;\nstring s2(\"hello\");\nstring s3(s2);\nstring s4(3, 'A');",
      "codeFull": "#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s1;                 // 空串\n    string s2(\"hello\");        // C 字符串\n    string s3(s2);             // 拷贝构造\n    string s4(3, 'A');         // 3 个 'A'\n    cout << s1.size() << endl;\n    cout << s2 << endl;\n    cout << s3 << endl;\n    cout << s4 << endl;\n\n    string s5 = \"C++\";\n    s5 += \" STL\";\n    s5.append(\"!\");\n    cout << s5 << endl;\n}",
      "output": "0\nhello\nhello\nAAA\nC++ STL!",
      "errors": [
        "<code>string s(3);</code>：<code>error: no matching function for call to 'std::__cxx11::basic_string&lt;char&gt;::basic_string(int)'</code>。想造 3 个相同字符要写 <code>string s(3, 'A')</code>。"
      ],
      "pitfalls": [
        "<code>string(3, 'A')</code> 是「3 个字符」，不是「长度为 3 的空串」。",
        "string 自动管理内存，不用 <code>new[]</code>/<code>delete[]</code>。"
      ],
      "concl": "string 是会自动管理内存的字符串类，构造、+=、append 都能直接用。",
      "terms": "string / C 风格字符串 / 拷贝构造 / append",
      "tags": ["string", "必背"],
      "board": "",
      "quizIds": ["d8s05", "d8s06", "d8f01"]
    },
    {
      "id": "d8c105",
      "num": 105,
      "title": "string 查找、替换、子串、插入删除",
      "pain": "想在一段文本里找关键词、截一段、替换掉，只会手写循环。",
      "analogy": "像文本编辑器：查找、定位、替换、剪切、粘贴，都是现成按钮。",
      "only": "<b>分量：必背</b> · find/rfind/substr/replace/insert/erase 是 string 最常用的六个动作。",
      "guess": "先猜：find 找不到时返回什么？",
      "codeMin": "size_t pos = s.find(\"world\");\nif (pos == string::npos) cout << \"没找到\" << endl;",
      "codeFull": "#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s = \"hello world hello\";\n    cout << s.find(\"hello\") << endl;                 // 0\n    cout << s.rfind(\"hello\") << endl;                // 12\n    cout << (s.find(\"xyz\") == string::npos) << endl; // 1\n    cout << s.substr(6, 5) << endl;                  // world\n\n    s.replace(0, 5, \"hi\");\n    cout << s << endl;      // hi world hello\n    s.insert(2, \"!!\");\n    cout << s << endl;      // hi!! world hello\n    s.erase(2, 2);\n    cout << s << endl;      // hi world hello\n}",
      "output": "0\n12\n1\nworld\nhi world hello\nhi!! world hello\nhi world hello",
      "errors": [],
      "pitfalls": [
        "find 找不到返回 <code>string::npos</code>，不要拿它直接当 -1 用，统一和 npos 比。",
        "substr(pos, n) 的 n 是字符个数，不是结束下标。",
        "replace(pos, n, str) 里的 n 是「替换掉几个字符」。"
      ],
      "concl": "查找用 find/rfind，截取用 substr，改动用 replace/insert/erase。",
      "terms": "find / rfind / npos / substr / replace / insert / erase",
      "tags": ["string", "必背"],
      "board": "",
      "quizIds": ["d8s07", "d8s08", "d8s09", "d8f02"]
    },
    {
      "id": "d8c106",
      "num": 106,
      "title": "string 和 C 字符串互转",
      "pain": "老接口只收 const char*，手里却是 string，不知道怎么交出去。",
      "analogy": "string 是精装书，C 接口只认散页；c_str() 就是那张可以递出去的目录页。",
      "only": "<b>分量：理解</b> · 知道 c_str() 返回 const char*、char* 能隐式转 string 即可。",
      "guess": "先猜：能直接把 string 赋给 char* 吗？",
      "codeMin": "const char* p = s.c_str();\nstring t(\"abc\");",
      "codeFull": "#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s = \"abc\";\n    const char* p = s.c_str();\n    cout << p << endl;\n\n    char buf[] = \"xyz\";\n    string t(buf);\n    cout << t << endl;\n\n    cout << s[1] << \" \" << s.at(2) << endl;\n    s[1] = 'B';\n    cout << s << endl;\n\n    try {\n        cout << s.at(9) << endl;\n    } catch (out_of_range& e) {\n        cout << \"越界\" << endl;\n    }\n}",
      "output": "abc\nxyz\nb c\naBc\n越界",
      "errors": [
        "<code>char* p = s.c_str();</code>：<code>error: invalid conversion from 'const char*' to 'char*'</code>。改法：写 <code>const char*</code>，或需要可写副本时自己拷一份。"
      ],
      "pitfalls": [
        "<code>c_str()</code> 返回的是内部缓冲区指针，string 一改动它可能失效，别长期存。",
        "<code>[]</code> 越界不检查，<code>at()</code> 越界抛 <code>out_of_range</code>。"
      ],
      "concl": "string 转 C 字符串用 c_str()，C 字符串转 string 直接构造或赋值。",
      "terms": "c_str / const char* / out_of_range / operator[] / at",
      "tags": ["string", "理解"],
      "board": "",
      "quizIds": ["d8s10", "d8f03"]
    },
    {
      "id": "d8c107",
      "num": 107,
      "title": "vector 基本用法与迭代器遍历",
      "pain": "数组长度写死，元素一多就得重新开数组、搬数据。",
      "analogy": "vector 像会自动加座位的电影院，人来了就往后排加，座位号连续。",
      "only": "<b>分量：必背</b> · push_back、begin/end、front/back、size，是 vector 的日常五件套。",
      "guess": "先猜：v.end() 指向的是最后一个元素还是它后面？",
      "codeMin": "vector<int> v;\nv.push_back(10);\nfor (auto it = v.begin(); it != v.end(); ++it) cout << *it << endl;",
      "codeFull": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> v;\n    v.push_back(20);\n    v.push_back(10);\n    v.push_back(50);\n    v.push_back(30);\n\n    for (vector<int>::iterator it = v.begin(); it != v.end(); ++it) {\n        cout << *it << endl;\n    }\n    cout << v.front() << \" \" << v.back() << endl;\n    cout << v.size() << endl;\n}",
      "output": "20\n10\n50\n30\n20 30\n4",
      "errors": [],
      "pitfalls": [
        "<code>end()</code> 是最后一个元素的下一格，不能解引用。",
        "空 vector 调 <code>front()</code>/<code>back()</code> 是未定义行为，先判 <code>empty()</code>。"
      ],
      "concl": "vector 是会自动扩容的连续数组，用 begin/end 遍历，push_back 尾插。",
      "terms": "vector / push_back / begin / end / front / back / size",
      "tags": ["vector", "必背"],
      "board": "",
      "quizIds": ["d8s11", "d8s12", "d8c01"]
    },
    {
      "id": "d8c108",
      "num": 108,
      "title": "vector 扩容：size 和 capacity",
      "pain": "以为 vector 每加一个元素就扩一格，不知道扩容是整块搬家。",
      "analogy": "书桌放满了要换大桌子：不是加一块板，而是买新桌、把书全搬过去、扔掉旧桌。",
      "only": "<b>分量：必背</b> · size/capacity/reserve 的区别，以及扩容会搬内存，面试必问。",
      "guess": "先猜：reserve(10) 之后 size 是几？",
      "codeMin": "vector<int> v;\ncout << v.size() << \" \" << v.capacity() << endl;\nv.reserve(10);",
      "codeFull": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> v;\n    cout << v.size() << \" \" << v.capacity() << endl; // 0 0\n\n    v.reserve(10);\n    cout << v.capacity() << endl;                    // 10，size 仍是 0\n\n    for (int i = 0; i < 10; i++) v.push_back(i);\n    cout << v.size() << \" \" << v.capacity() << endl; // 10 10\n\n    v.push_back(10);\n    cout << v.size() << \" \" << v.capacity() << endl; // 11 20\n}",
      "output": "0 0\n10\n10 10\n11 20",
      "errors": [],
      "pitfalls": [
        "<code>reserve</code> 只改容量不改大小，预留的位置不能访问。",
        "扩容是「申请新空间→搬数据→释放旧空间」，代价高，能预估就用 reserve。",
        "不同标准库增长因子不同，g++ 通常是 2 倍，别把 20 当成标准答案。"
      ],
      "concl": "size 是元素个数，capacity 是已申请空间；扩容会整块搬家。",
      "terms": "size / capacity / reserve / 扩容 / 增长因子",
      "tags": ["vector", "必背"],
      "board": "",
      "quizIds": ["d8s13", "d8s14", "d8f04", "d8j01"]
    },
    {
      "id": "d8c109",
      "num": 109,
      "title": "vector 迭代器失效",
      "pain": "扩容或删除元素后，之前保存的迭代器还在用，程序时好时坏。",
      "analogy": "旧地址的房子拆了，你还拿着旧钥匙去开门——门牌可能已经换成别人家。",
      "only": "<b>分量：必背</b> · 扩容全失效、erase 后要用返回值，是 vector 最容易踩的坑。",
      "guess": "先猜：push_back 引发扩容后，原来的迭代器还能用吗？",
      "codeMin": "auto it = v.begin();\nv.push_back(4);      // 可能扩容，it 失效\n// *it 不要再用",
      "codeFull": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> v = {1, 2, 3, 4};\n\n    for (auto it = v.begin(); it != v.end(); ) {\n        if (*it % 2 == 0) it = v.erase(it);  // 用返回值接下一个位置\n        else ++it;\n    }\n\n    for (int x : v) cout << x << endl;       // 1 3\n}",
      "output": "1\n3",
      "errors": [
        "扩容后继续解引用旧迭代器：编译器<b>不报错</b>，运行时可能读到已释放内存，结果未定义。改法：扩容后重新 <code>begin()</code>。",
        "<code>v.erase(it); ++it;</code>：erase 后 it 已失效，再 ++ 是未定义行为。改法：<code>it = v.erase(it);</code>。"
      ],
      "pitfalls": [
        "push_back、insert、resize 只要触发扩容，所有迭代器、指针、引用全部失效。",
        "erase 只让被删位置及其后的迭代器失效，返回下一个有效位置。"
      ],
      "concl": "扩容后重新取迭代器，erase 后用返回值继续走。",
      "terms": "迭代器失效 / erase 返回值 / 未定义行为",
      "tags": ["vector", "必背"],
      "board": "",
      "quizIds": ["d8s15", "d8j02"]
    },
    {
      "id": "d8c110",
      "num": 110,
      "title": "vector 增删、swap 收缩容量",
      "pain": "reserve 了一大块空间，后来只用几个，容量却一直占着。",
      "analogy": "订了 100 人的场地只来 5 个人，想退掉多余座位，得换一张 5 人的桌子。",
      "only": "<b>分量：必背</b> · insert/erase/swap 收缩的写法要会，尤其是 swap 那一行。",
      "guess": "先猜：resize(5) 能不能把 capacity 从 100 降到 5？",
      "codeMin": "vector<int>(v).swap(v);   // 用副本交换，收缩到实际大小",
      "codeFull": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> v;\n    v.reserve(100);\n    v.assign(5, 9);\n    cout << v.size() << \" \" << v.capacity() << endl;  // 5 100\n\n    v.insert(v.begin() + 2, 7);\n    cout << v.size() << endl;                          // 6\n\n    v.erase(v.begin() + 2);\n    cout << v.size() << endl;                          // 5\n\n    vector<int>(v).swap(v);                            // 收缩容量\n    cout << v.size() << \" \" << v.capacity() << endl;  // 5 5\n}",
      "output": "5 100\n6\n5\n5 5",
      "errors": [],
      "pitfalls": [
        "<code>resize</code> 改的是 size，不改 capacity；想缩容量用 <code>vector&lt;int&gt;(v).swap(v)</code>。",
        "insert/erase 在中间操作要搬后面的元素，复杂度 O(n)，频繁中间增删别用 vector。"
      ],
      "concl": "中间增删用 insert/erase，缩容量用「临时 vector 交换」。",
      "terms": "insert / erase / assign / swap / 收缩容量",
      "tags": ["vector", "必背"],
      "board": "",
      "quizIds": ["d8s16", "d8c02"]
    },
    {
      "id": "d8c111",
      "num": 111,
      "title": "vector 排序与自定义类型",
      "pain": "vector 里的元素想按自己的规则排，不知道 sort 的第三个参数怎么给。",
      "analogy": "sort 是裁判，默认按身高排队；你递一张「按体重排」的规则卡，它就照你的排。",
      "only": "<b>分量：必背</b> · sort 默认升序、greater 降序、自定义比较函数，三种都要会。",
      "guess": "先猜：sort 默认是从小到大还是从大到小？",
      "codeMin": "sort(v.begin(), v.end());\nsort(v.begin(), v.end(), greater<int>());",
      "codeFull": "#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <functional>\nusing namespace std;\n\nint main() {\n    vector<int> v = {40, 30, 10, 70, 20};\n\n    sort(v.begin(), v.end());\n    for (int x : v) cout << x << endl;\n\n    sort(v.begin(), v.end(), greater<int>());\n    for (int x : v) cout << x << endl;\n}",
      "output": "10\n20\n30\n40\n70\n70\n40\n30\n20\n10",
      "errors": [
        "对自定义类型直接 <code>sort</code> 且没写 <code>operator&lt;</code>：<code>error: no match for 'operator&lt;' (operand types are 'Student' and 'Student')</code>。改法：重载 <code>&lt;</code>，或给 sort 传比较函数。"
      ],
      "pitfalls": [
        "<code>sort</code> 只接受随机访问迭代器，list 不能用它，要用 <code>l.sort()</code>。",
        "比较函数必须满足「严格弱序」，别写 <code>&lt;=</code>。"
      ],
      "concl": "默认升序，greater 降序，自定义类型给比较规则或重载 <。",
      "terms": "sort / greater / 自定义比较 / 严格弱序",
      "tags": ["vector", "算法", "必背"],
      "board": "",
      "quizIds": ["d8s17", "d8c03"]
    },
    {
      "id": "d8c112",
      "num": 112,
      "title": "deque：双端都能进出的队列",
      "pain": "老在 vector 头部插入，每次都搬整个数组，慢得离谱。",
      "analogy": "vector 是只有后门的公交车，deque 是前后门都能上下客的公交车。",
      "only": "<b>分量：理解</b> · 知道 push_front/pop_front 是 O(1)、deque 没有 capacity 即可。",
      "guess": "先猜：deque 有没有 capacity()？",
      "codeMin": "deque<int> d;\nd.push_front(1);\nd.push_back(2);",
      "codeFull": "#include <iostream>\n#include <deque>\nusing namespace std;\n\nint main() {\n    deque<int> d;\n    d.push_back(2);\n    d.push_back(3);\n    d.push_front(1);\n    d.push_front(0);\n\n    for (int x : d) cout << x << endl;\n    d.pop_front();\n    d.pop_back();\n    cout << d.front() << \" \" << d.back() << endl;\n    cout << d.size() << endl;\n}",
      "output": "0\n1\n2\n3\n1 2\n2",
      "errors": [
        "<code>d.capacity()</code>：<code>error: 'class std::deque&lt;int&gt;' has no member named 'capacity'</code>。deque 是分段连续空间，没有容量概念。"
      ],
      "pitfalls": [
        "deque 没有 reserve/capacity，别照 vector 的习惯写。",
        "deque 迭代器比 vector 复杂，随机访问比 vector 慢；能用 vector 就先用 vector。"
      ],
      "concl": "头尾都要频繁增删用 deque，它没有容量概念。",
      "terms": "deque / push_front / pop_front / 分段连续",
      "tags": ["deque", "容器"],
      "board": "",
      "quizIds": ["d8s18", "d8j03"]
    },
    {
      "id": "d8c113",
      "num": 113,
      "title": "stack：后进先出",
      "pain": "想表达「最后发生的先处理」，用数组自己维护下标，容易越界。",
      "analogy": "一摞盘子，只能从最上面拿，最后放上去的最先被拿走。",
      "only": "<b>分量：理解</b> · push/pop/top/empty/size 五个接口，括号匹配和 DFS 都用它。",
      "guess": "先猜：stack 能不能用迭代器遍历？",
      "codeMin": "stack<int> st;\nst.push(1);\ncout << st.top() << endl;",
      "codeFull": "#include <iostream>\n#include <stack>\nusing namespace std;\n\nint main() {\n    stack<int> st;\n    st.push(1);\n    st.push(2);\n    st.push(3);\n\n    cout << st.top() << endl;\n    st.pop();\n    cout << st.top() << endl;\n    cout << st.size() << endl;\n\n    while (!st.empty()) {\n        cout << st.top() << \" \";\n        st.pop();\n    }\n    cout << endl;\n}",
      "output": "3\n2\n2\n2 1 ",
      "errors": [
        "<code>st.begin()</code> 或 <code>st[0]</code>：<code>error: 'class std::stack&lt;int&gt;' has no member named 'begin'</code>。stack 不提供迭代器。"
      ],
      "pitfalls": [
        "<code>pop()</code> 只删除不返回，取栈顶要用 <code>top()</code>。",
        "空栈调 <code>top()</code>/<code>pop()</code> 是未定义行为，先判 empty。"
      ],
      "concl": "stack 只有 push/pop/top，后进先出，不能遍历。",
      "terms": "stack / LIFO / push / pop / top",
      "tags": ["stack", "容器"],
      "board": "",
      "quizIds": ["d8s19", "d8c04"]
    },
    {
      "id": "d8c114",
      "num": 114,
      "title": "queue：先进先出",
      "pain": "想按到达顺序处理任务，用 vector 每次删头部都要搬数据。",
      "analogy": "排队买票：先来的先买，只能从队尾进、队头出。",
      "only": "<b>分量：理解</b> · push/pop/front/back，BFS 和消息队列的基础。",
      "guess": "先猜：queue 的 pop() 删除的是队头还是队尾？",
      "codeMin": "queue<int> q;\nq.push(1);\ncout << q.front() << endl;",
      "codeFull": "#include <iostream>\n#include <queue>\nusing namespace std;\n\nint main() {\n    queue<int> q;\n    q.push(1);\n    q.push(2);\n    q.push(3);\n\n    cout << q.front() << \" \" << q.back() << endl;\n    q.pop();\n    cout << q.front() << endl;\n    cout << q.size() << endl;\n}",
      "output": "1 3\n2\n2",
      "errors": [
        "<code>q.begin()</code>：<code>error: 'class std::queue&lt;int&gt;' has no member named 'begin'</code>。queue 不提供迭代器。"
      ],
      "pitfalls": [
        "<code>pop()</code> 删队头、不返回值；取队头用 <code>front()</code>。",
        "queue 默认底层容器是 deque，属于容器适配器。"
      ],
      "concl": "queue 从队尾进、队头出，先进先出，不能遍历。",
      "terms": "queue / FIFO / front / back / 容器适配器",
      "tags": ["queue", "容器"],
      "board": "",
      "quizIds": ["d8s20", "d8c05"]
    },
    {
      "id": "d8c115",
      "num": 115,
      "title": "list：双向链表",
      "pain": "要在容器中间频繁插入删除，vector 每次都要搬后面所有元素。",
      "analogy": "vector 是一排连座，中间加人要全体挪；list 是手拉手的一队人，插进去只改两只手。",
      "only": "<b>分量：理解</b> · 知道 list 中间增删 O(1)、不支持随机访问即可。",
      "guess": "先猜：list 能不能用 l[2] 取第三个元素？",
      "codeMin": "list<int> l;\nl.push_back(20);\nl.push_front(10);",
      "codeFull": "#include <iostream>\n#include <list>\nusing namespace std;\n\nint main() {\n    list<int> l;\n    l.push_back(20);\n    l.push_back(30);\n    l.push_front(10);\n\n    for (int x : l) cout << x << endl;\n\n    l.remove(20);\n    cout << l.size() << endl;\n    cout << l.front() << \" \" << l.back() << endl;\n}",
      "output": "10\n20\n30\n2\n10 30",
      "errors": [
        "<code>l[0]</code>：<code>error: no match for 'operator[]' (operand types are 'std::__cxx11::list&lt;int&gt;' and 'int')</code>。list 不支持随机访问。"
      ],
      "pitfalls": [
        "list 插入删除不搬元素，但找第 n 个要一个一个走。",
        "list 的迭代器是双向的，只能 ++/--，不能 +n。"
      ],
      "concl": "频繁中间增删用 list，随机访问用 vector。",
      "terms": "list / 双向链表 / remove / 双向迭代器",
      "tags": ["list", "容器"],
      "board": "",
      "quizIds": ["d8s21", "d8j04"]
    },
    {
      "id": "d8c116",
      "num": 116,
      "title": "list 的 advance、sort 和 reverse",
      "pain": "list 迭代器不能 +n，std::sort 也用不了，不知道怎么移动和排序。",
      "analogy": "链表像串珠，只能一颗一颗数过去；排序也要按串珠的方式重新穿线。",
      "only": "<b>分量：了解</b> · 知道 advance 走步、list 自带 sort/reverse 即可。",
      "guess": "先猜：std::sort 能不能排 list？",
      "codeMin": "auto it = l.begin();\nadvance(it, 2);\nl.sort(greater<int>());",
      "codeFull": "#include <iostream>\n#include <list>\n#include <functional>\nusing namespace std;\n\nint main() {\n    list<int> l = {10, 50, 30, 20, 40};\n\n    l.sort(greater<int>());\n    for (int x : l) cout << x << endl;\n\n    l.reverse();\n    for (int x : l) cout << x << endl;\n\n    auto it = l.begin();\n    advance(it, 2);\n    l.insert(it, 99);\n    for (int x : l) cout << x << endl;\n}",
      "output": "50\n40\n30\n20\n10\n10\n20\n30\n40\n50\n10\n20\n99\n30\n40\n50",
      "errors": [
        "<code>sort(l.begin(), l.end())</code>：<code>error: no matching function for call to 'sort(std::_List_iterator&lt;int&gt;, std::_List_iterator&lt;int&gt;)'</code>。std::sort 需要随机访问迭代器，list 只能用成员 <code>l.sort()</code>。"
      ],
      "pitfalls": [
        "<code>advance(it, n)</code> 直接改 it，无返回值。",
        "<code>l.sort()</code> 默认升序，<code>l.sort(greater&lt;int&gt;())</code> 降序。"
      ],
      "concl": "list 用 advance 走步、用成员 sort 排序、用 reverse 反转。",
      "terms": "advance / list::sort / reverse / 随机访问迭代器",
      "tags": ["list", "算法"],
      "board": "",
      "quizIds": ["d8s22", "d8j05", "d8c06"]
    },
    {
      "id": "d8c117",
      "num": 117,
      "title": "set：自动去重 + 排序",
      "pain": "收集一堆 ID，既要自动去重，又要随时按顺序取，手写太麻烦。",
      "analogy": "set 像一个自动整理的卡片盒：同样的卡片只留一张，永远按编号排好。",
      "only": "<b>分量：必背</b> · insert 自动排序去重、find/count 查找、不能改元素，三条必须记住。",
      "guess": "先猜：重复 insert 同一个值会怎样？",
      "codeMin": "set<int> s;\ns.insert(30);\ns.insert(10);\ns.insert(30);   // 重复的会被丢掉",
      "codeFull": "#include <iostream>\n#include <set>\nusing namespace std;\n\nint main() {\n    set<int> s;\n    s.insert(40);\n    s.insert(10);\n    s.insert(70);\n    s.insert(20);\n    s.insert(30);\n    s.insert(30);   // 重复，插入无效\n\n    for (int x : s) cout << x << endl;\n    cout << s.size() << endl;\n    cout << (s.find(30) != s.end()) << endl;\n    cout << s.count(30) << endl;\n\n    s.erase(20);\n    cout << s.size() << endl;\n}",
      "output": "10\n20\n30\n40\n70\n5\n1\n1\n4",
      "errors": [
        "<code>*s.begin() = 5;</code>：<code>error: assignment of read-only location</code>。set 的迭代器是只读的，元素值就是排序键，不能改。",
        "<code>s[0]</code>：<code>error: no match for 'operator[]'</code>。set 没有下标访问，用 find。"
      ],
      "pitfalls": [
        "set 插入重复值不报错，只是不进去；multiset 才允许重复。",
        "要改元素只能先 erase 再 insert。"
      ],
      "concl": "set 自动排序、自动去重，元素只能读不能改。",
      "terms": "set / multiset / 红黑树 / insert / find / count",
      "tags": ["set", "必背"],
      "board": "",
      "quizIds": ["d8s23", "d8f05", "d8j06"]
    },
    {
      "id": "d8c118",
      "num": 118,
      "title": "set 自定义排序：仿函数",
      "pain": "想让 set 从大到小排，不知道第二个模板参数填什么。",
      "analogy": "卡片盒默认按编号升序；给它换一张「从大到小」的整理规则，它就照新规则排。",
      "only": "<b>分量：理解</b> · 会写 operator() 的仿函数、知道要带 const 即可。",
      "guess": "先猜：set 的排序规则在什么时候指定？",
      "codeMin": "struct MyCompare {\n    bool operator()(int a, int b) const { return a > b; }\n};\nset<int, MyCompare> s;",
      "codeFull": "#include <iostream>\n#include <set>\nusing namespace std;\n\nstruct MyCompare {\n    bool operator()(int a, int b) const { return a > b; }\n};\n\nint main() {\n    set<int, MyCompare> s = {40, 10, 70, 20, 30, 30};\n    for (int x : s) cout << x << endl;\n}",
      "output": "70\n40\n30\n20\n10",
      "errors": [
        "仿函数的 <code>operator()</code> 漏写 <code>const</code>：<code>error: passing 'const MyCompare' as 'this' argument discards qualifiers</code>。改法：参数列表后补 const。"
      ],
      "pitfalls": [
        "排序规则只能在定义 set 时通过第二个模板参数指定，运行中不能换。",
        "仿函数里比较规则写反，整个 set 的顺序都会反。"
      ],
      "concl": "set 的第二个模板参数放仿函数，operator() 记得加 const。",
      "terms": "仿函数 / operator() / 模板参数 / 排序规则",
      "tags": ["set", "仿函数"],
      "board": "",
      "quizIds": ["d8s24", "d8f06"]
    },
    {
      "id": "d8c119",
      "num": 119,
      "title": "pair：把两个值绑在一起",
      "pain": "函数想返回两个值，又不想专门定义一个结构体。",
      "analogy": "pair 像一张双联票：左边 first、右边 second，撕不开但能分别看。",
      "only": "<b>分量：了解</b> · 知道 first/second、make_pair 即可，map 的元素就是 pair。",
      "guess": "先猜：pair 的两个成员叫什么？",
      "codeMin": "pair<string, int> p(\"zhangsan\", 30);\ncout << p.first << \" \" << p.second << endl;",
      "codeFull": "#include <iostream>\n#include <string>\n#include <utility>\nusing namespace std;\n\nint main() {\n    pair<string, int> p1;\n    p1.first = \"hello\";\n    p1.second = 100;\n    cout << p1.first << \"--\" << p1.second << endl;\n\n    pair<string, int> p2(\"zhangsan\", 30);\n    cout << p2.first << \"--\" << p2.second << endl;\n\n    pair<string, int> p3 = make_pair(\"lisi\", 20);\n    cout << p3.first << \"--\" << p3.second << endl;\n}",
      "output": "hello--100\nzhangsan--30\nlisi--20",
      "errors": [],
      "pitfalls": [
        "pair 的成员是 <code>first</code> 和 <code>second</code>，不是 key/value。",
        "map 遍历时 <code>*it</code> 就是一个 <code>pair&lt;const Key, Value&gt;</code>。"
      ],
      "concl": "pair 把两个值打包，first/second 分别访问。",
      "terms": "pair / first / second / make_pair",
      "tags": ["pair", "基础"],
      "board": "",
      "quizIds": ["d8s25"]
    },
    {
      "id": "d8c120",
      "num": 120,
      "title": "map：插入与遍历",
      "pain": "要按学号查姓名，用两个 vector 对着下标找，增删一次就乱。",
      "analogy": "map 像一本字典：按拼音（key）排好，翻到词条就能看到解释（value）。",
      "only": "<b>分量：必背</b> · 四种插入方式、按 key 自动排序、operator[] 会覆盖，必须会。",
      "guess": "先猜：m[1001] = \"zs\" 会不会覆盖原来 1001 的值？",
      "codeMin": "map<int, string> m;\nm.insert(make_pair(1001, \"李四\"));\nm[1002] = \"赵六\";",
      "codeFull": "#include <iostream>\n#include <map>\n#include <string>\nusing namespace std;\n\nint main() {\n    map<int, string> m;\n    m.insert(pair<int, string>(1007, \"zhangsan\"));\n    m.insert(make_pair(1001, \"李四\"));\n    m.insert(map<int, string>::value_type(1004, \"wangwu\"));\n    m[1002] = \"赵六\";\n    m[1001] = \"zs\";   // key 已存在：覆盖\n\n    for (auto& p : m) cout << p.first << \" \" << p.second << endl;\n    cout << m.size() << endl;\n}",
      "output": "1001 zs\n1002 赵六\n1004 wangwu\n1007 zhangsan\n4",
      "errors": [],
      "pitfalls": [
        "<code>insert</code> 遇到重复 key 不会覆盖，返回的 <code>pair&lt;iterator,bool&gt;</code> 里 second 是 false。",
        "<code>m[key]</code> 在 key 不存在时会插入一个默认 value，用它查找会让 map 变大。",
        "map 按 key 自动升序，遍历顺序不是插入顺序。"
      ],
      "concl": "map 是按 key 排序的键值对，insert 不覆盖、operator[] 覆盖。",
      "terms": "map / multimap / pair / value_type / operator[]",
      "tags": ["map", "必背"],
      "board": "",
      "quizIds": ["d8s26", "d8s27", "d8f08"]
    },
    {
      "id": "d8c121",
      "num": 121,
      "title": "map 的查找、删除与范围",
      "pain": "查找时随手写 m[key]，结果 map 越查越大，还找不到空值。",
      "analogy": "查字典用目录（find），不要为了查一个词先在字典里加一页空白。",
      "only": "<b>分量：必背</b> · find/count/equal_range 和 erase 的用法，以及别用 [] 查找。",
      "guess": "先猜：m[9] 用来查一个不存在的 key，会发生什么？",
      "codeMin": "auto it = m.find(2);\nif (it != m.end()) cout << it->second << endl;",
      "codeFull": "#include <iostream>\n#include <map>\n#include <string>\nusing namespace std;\n\nint main() {\n    map<int, string> m = {{1, \"a\"}, {2, \"b\"}, {3, \"c\"}};\n\n    auto it = m.find(2);\n    if (it != m.end()) cout << it->second << endl;\n\n    cout << m.count(2) << \" \" << m.count(9) << endl;\n\n    auto r = m.equal_range(2);\n    cout << r.first->first << \" \" << r.second->first << endl;\n\n    m.erase(2);\n    cout << m.size() << endl;\n}",
      "output": "b\n1 0\n2 3\n2",
      "errors": [],
      "pitfalls": [
        "查找用 <code>find</code> 并和 <code>end()</code> 比；用 <code>m[key]</code> 查找会插入默认值。",
        "<code>equal_range</code> 返回一对迭代器：first 是 lower_bound，second 是 upper_bound。",
        "map 的 key 不能通过迭代器修改，value 可以。"
      ],
      "concl": "查找用 find/count，范围用 equal_range，删除用 erase。",
      "terms": "find / count / equal_range / lower_bound / upper_bound / erase",
      "tags": ["map", "必背"],
      "board": "",
      "quizIds": ["d8s28", "d8j07", "d8f07"]
    },
    {
      "id": "d8c122",
      "num": 122,
      "title": "容器怎么选：一张表记牢",
      "pain": "八个容器名字都认识，真到写代码还是随手一个 vector。",
      "analogy": "工具箱按场景拿：拧螺丝用螺丝刀，钉钉子用锤子，别拿扳手硬敲。",
      "only": "<b>分量：理解</b> · 记住默认 vector、头尾 deque、查找 map/set、LIFO/FIFO 用 stack/queue。",
      "guess": "先猜：按 ID 在十万条记录里查人，用 vector 还是 map？",
      "codeMin": "vector：随机访问、尾插\nmap：按 key 查找\ndeque：头尾增删\nstack/queue：限制接口",
      "codeFull": "#include <iostream>\n#include <vector>\n#include <map>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    vector<int> scores = {90, 80, 100};\n    sort(scores.rbegin(), scores.rend());   // 降序\n    for (int x : scores) cout << x << endl;\n\n    map<string, int> idx = {{\"alice\", 1}, {\"bob\", 2}};\n    cout << idx[\"bob\"] << endl;\n}",
      "output": "100\n90\n80\n2",
      "errors": [],
      "pitfalls": [
        "默认选 vector；头尾都频繁增删再考虑 deque。",
        "需要按 key 快速查找、去重、排序，用 map/set。",
        "需要 LIFO/FIFO 语义，用 stack/queue，别用 vector 模拟。"
      ],
      "concl": "默认 vector，查找 map/set，头尾 deque，受限接口 stack/queue。",
      "terms": "容器选择 / 时间复杂度 / 随机访问 / 关联容器",
      "tags": ["容器", "总结"],
      "board": "",
      "quizIds": ["d8j08"]
    }
  ],
  "taskTitle": "Day 8 · 今天动手",
  "taskDesc": "两个作业都改成可离线运行的版本：任务 1 用 vector 存选手和 10 个分数，去掉最高最低取平均；任务 2 用 vector + multimap 完成学生分班。分数和学生数据都写在代码里，复制走就能跑。",
  "tasks": [
    {
      "id": "d8t1",
      "title": "任务 1 · 评委打分（去掉最高最低）",
      "goal": "<b>目标</b>：用 <code>vector&lt;Player&gt;</code> 存 5 名选手，每人 10 个分数；排序后去掉首尾，取中间 8 个的平均分。",
      "code": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nstruct Player {\n    string name;\n    vector<int> scores;\n};\n\nint main() {\n    vector<Player> ps = {\n        {\"A\", {80, 90, 70, 60, 100, 85, 95, 75, 65, 88}},\n        {\"B\", {70, 75, 80, 85, 90, 95, 100, 65, 60, 55}},\n        {\"C\", {90, 90, 90, 90, 90, 90, 90, 90, 90, 90}},\n        {\"D\", {100, 0, 100, 0, 100, 0, 100, 0, 100, 0}},\n        {\"E\", {60, 70, 80, 90, 100, 50, 40, 30, 20, 10}}\n    };\n\n    for (auto& p : ps) {\n        sort(p.scores.begin(), p.scores.end());\n        int sum = 0;\n        for (int i = 1; i < 9; i++) sum += p.scores[i];  // 去掉下标 0 和 9\n        cout << p.name << \" \" << sum / 8.0 << endl;\n    }\n}",
      "output": "A 81\nB 77.5\nC 90\nD 50\nE 55",
      "tip": "先排序，最高分在下标 9、最低分在下标 0，中间 8 个从下标 1 加到 8。把某一组分数改一改，平均分应该跟着变。"
    },
    {
      "id": "d8t2",
      "title": "任务 2 · 学生分班（vector + multimap）",
      "goal": "<b>目标</b>：用 <code>vector&lt;Stu&gt;</code> 存 5 个学生，用 <code>multimap&lt;int, Stu&gt;</code> 按班级分组，再按 1/2/3 班分别展示。",
      "code": "#include <iostream>\n#include <vector>\n#include <map>\n#include <string>\nusing namespace std;\n\nstruct Stu {\n    int id;\n    string name;\n    int cls;\n};\n\nint main() {\n    vector<Stu> v = {\n        {1001, \"张三\", 1},\n        {1002, \"李四\", 2},\n        {1003, \"王五\", 1},\n        {1004, \"赵六\", 3},\n        {1005, \"小七\", 2}\n    };\n\n    multimap<int, Stu> m;\n    for (auto& s : v) m.insert(make_pair(s.cls, s));\n\n    for (int c = 1; c <= 3; c++) {\n        cout << c << \"班:\" << endl;\n        auto range = m.equal_range(c);\n        for (auto it = range.first; it != range.second; ++it) {\n            cout << \"  \" << it->second.id << \" \" << it->second.name << endl;\n        }\n    }\n}",
      "output": "1班:\n  1001 张三\n  1003 王五\n2班:\n  1002 李四\n  1005 小七\n3班:\n  1004 赵六",
      "tip": "<code>multimap</code> 的 key 允许重复，正好表示「一个班多个学生」。用 <code>equal_range(c)</code> 一次取出该班所有学生，first 到 second 之间就是区间。"
    }
  ],
  "gloss": {
    "title": "今天这 10 个面试题，先用人话过一遍",
    "html": "<h4>今天这 10 个面试题，先用人话过一遍</h4>\n    <p><b>① STL 的组件有哪些？</b>容器、算法、迭代器、仿函数、适配器、空间配置器。容器装数据，算法操作数据，迭代器把两者接起来，仿函数给算法提供策略，适配器改接口，配置器管内存。</p>\n    <p><b>② 你了解哪些迭代器？</b>输入、输出、前向、双向、随机访问五种，能力依次增强。vector 是随机访问，list 是双向，stack/queue 没有迭代器。</p>\n    <p><b>③ 说一下你对算法的了解？</b>算法通过迭代器区间工作，分质变（sort/copy/replace，会改元素）和非质变（find/count/for_each，不改元素）。</p>\n    <p><b>④ vector 与 list 的区别？</b>vector 是连续内存、随机访问 O(1)、中间增删 O(n)；list 是双向链表、中间增删 O(1)、不能随机访问，插入删除不使其他迭代器失效。</p>\n    <p><b>⑤ vector 是如何实现的？</b>用三个指针维护一段连续空间：起点、已用终点、容量终点。满了就申请更大的空间、搬数据、释放旧空间。</p>\n    <p><b>⑥ 说一下 vector 的扩容？</b>size 等于 capacity 时触发扩容，g++ 通常翻倍；扩容会重新分配、拷贝、释放，代价高，能预估就 reserve。</p>\n    <p><b>⑦ vector 删除元素，迭代器怎么变？</b>erase 让被删位置及其后的迭代器失效，返回下一个有效位置；扩容则让所有迭代器失效。</p>\n    <p><b>⑧ 有指针为什么还要迭代器？</b>迭代器屏蔽了不同容器的内部结构，算法只认迭代器接口；list 的节点不连续，指针不能通用，迭代器可以。</p>\n    <p><b>⑨ 栈和队列如何遍历？</b>不能遍历，它们没有迭代器。要逐个访问只能一边 top/front 一边 pop，而且会清空容器。</p>\n    <p><b>⑩ map/set 怎么实现的？为什么用红黑树？</b>底层都是红黑树，set 的键就是值，map 的节点是 pair。红黑树插入删除查找都是 O(logN)，且能保持有序，支持范围查找。</p>\n    <p class=\"say\">这天的重心是 string、vector、map 三块：string 的查找替换、vector 的扩容和迭代器失效、map 的插入查找必须能默写；stack/queue/set 会用；deque/list/pair 知道场景就行。</p>"
  }
};
