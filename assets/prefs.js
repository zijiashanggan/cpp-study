/* 护眼模式 + 字号三档：两个独立 localStorage 键，五个页面共用。
   护眼：cpp_eye_v1 = 'on' | 'off'
   字号：cpp_fs_v1  = 'sm' | 'md' | 'lg'（小 / 标准 / 大）
   不碰 cpp_card_levels_v2 / cpp_task_done_v1 / cpp_lab_v1 / cpp_wrong_v1。 */
(function () {
  'use strict';

  var EK = 'cpp_eye_v1', FK = 'cpp_fs_v1';
  var LEVELS = ['sm', 'md', 'lg'];
  var LABEL = { sm: '小', md: '标准', lg: '大' };

  function read(k, d) { try { return localStorage.getItem(k) || d; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  var eye = read(EK, 'off');
  var fs = read(FK, 'md');
  if (LEVELS.indexOf(fs) < 0) fs = 'md';

  var root = document.documentElement;

  /* 先落属性，保证首屏就是对的，不闪白 */
  function apply() {
    root.setAttribute('data-eye', eye === 'on' ? '1' : '0');
    root.setAttribute('data-fs', fs);

    var b = document.getElementById('uiEye');
    if (b) {
      b.className = 'ui-btn ui-eye' + (eye === 'on' ? ' on' : '');
      b.setAttribute('aria-pressed', eye === 'on' ? 'true' : 'false');
    }
    var v = document.getElementById('uiFsVal');
    if (v) v.textContent = LABEL[fs];
    var mi = document.getElementById('uiMinus');
    if (mi) mi.disabled = (fs === 'sm');
    var pl = document.getElementById('uiPlus');
    if (pl) pl.disabled = (fs === 'lg');
  }
  apply();

  function build() {
    var right = document.querySelector('.tn-right');
    if (!right || document.getElementById('uiPrefs')) return;
    var box = document.createElement('div');
    box.className = 'uiprefs';
    box.id = 'uiPrefs';
    box.innerHTML =
      '<button type="button" class="ui-btn ui-eye" id="uiEye" aria-pressed="false" title="护眼模式：米黄底">护眼</button>' +
      '<span class="ui-fs" role="group" aria-label="字号">' +
        '<button type="button" class="ui-btn" id="uiMinus" title="字号小一档" aria-label="字号小一档">A-</button>' +
        '<b id="uiFsVal" aria-live="polite">标准</b>' +
        '<button type="button" class="ui-btn" id="uiPlus" title="字号大一档" aria-label="字号大一档">A+</button>' +
      '</span>';
    right.insertBefore(box, right.firstChild);

    document.getElementById('uiEye').addEventListener('click', function () {
      eye = (eye === 'on') ? 'off' : 'on';
      save(EK, eye);
      apply();
    });
    document.getElementById('uiMinus').addEventListener('click', function () {
      var i = LEVELS.indexOf(fs);
      if (i > 0) { fs = LEVELS[i - 1]; save(FK, fs); apply(); }
    });
    document.getElementById('uiPlus').addEventListener('click', function () {
      var i = LEVELS.indexOf(fs);
      if (i < LEVELS.length - 1) { fs = LEVELS[i + 1]; save(FK, fs); apply(); }
    });
    apply();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
