/* 错题本数据层：独立 localStorage 键，和卡片进度 / 练习进度互不影响。
   规则：答错进队列；连续答对 2 次才出队；中途答错，连对计数清零。 */
(function () {
  'use strict';

  var KEY = 'cpp_wrong_v1';   /* 与 cpp_card_levels_v2 等进度键分开 */

  function read() {
    try {
      var o = JSON.parse(localStorage.getItem(KEY) || '{}');
      return (o && typeof o === 'object') ? o : {};
    } catch (e) { return {}; }
  }

  function write(obj) {
    try { localStorage.setItem(KEY, JSON.stringify(obj)); } catch (e) {}
    try { document.dispatchEvent(new CustomEvent('wrongbook:change')); } catch (e) {}
  }

  window.WrongBook = {
    key: KEY,
    all: read,

    /* 练习时每答一题调一次：correct 为本次是否答对 */
    record: function (id, correct) {
      if (!id) return null;
      var db = read(), e = db[id];
      if (correct) {
        if (!e) return null;                       /* 本来就不在队列里，答对不记 */
        e.streak = (e.streak || 0) + 1;
        e.lastAt = Date.now();
        if (e.streak >= 2) { delete db[id]; }      /* 连对两次，出队 */
        write(db);
        return e.streak >= 2 ? 'out' : 'progress';
      }
      e = e || { wrong: 0, streak: 0 };
      e.wrong = (e.wrong || 0) + 1;
      e.streak = 0;                                /* 又错了，连对清零 */
      e.lastAt = Date.now();
      e.lastDay = e.lastDay || '';
      db[id] = e;
      write(db);
      return 'wrong';
    },

    get: function (id) { return read()[id] || null; },
    count: function () { return Object.keys(read()).length; },
    remove: function (id) { var db = read(); delete db[id]; write(db); }
  };

  /* 页面里任何带 data-wb-count 的地方都显示待清数量 */
  function paintBadges() {
    var n = Object.keys(read()).length;
    Array.prototype.forEach.call(document.querySelectorAll('[data-wb-count]'), function (el) {
      el.textContent = n ? n + ' 道待清' : '暂无错题';
    });
  }
  document.addEventListener('DOMContentLoaded', paintBadges);
  document.addEventListener('wrongbook:change', paintBadges);
})();
