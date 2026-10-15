// ============================================================
//  赫尔格达私人船只居间咨询站 · 共享交互脚本
//  功能：移动端菜单、滚动入场动画、表单校验（仅收集意向，不收款）
// ============================================================
(function () {
  'use strict';

  /* ---------- 移动端导航菜单 ---------- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') links.classList.remove('open');
    });
  }

  /* ---------- 导航栏滚动阴影 ---------- */
  var navbar = document.getElementById('navbar');
  function onScroll() {
    if (!navbar) return;
    navbar.style.boxShadow = window.scrollY > 8 ? '0 6px 24px rgba(36,59,74,.1)' : 'none';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 滚动入场动画 ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('show'); });
  }

  /* ---------- 页脚年份 ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- 咨询表单（仅收集意向，不接入任何支付） ---------- */
  var form = document.getElementById('consultForm');
  var hint = document.getElementById('formHint');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.querySelector('#name');
      var contact = form.querySelector('#contact');
      var boat = form.querySelector('#boat');

      if (!name.value.trim()) {
        hint.textContent = '请填写您的称呼';
        hint.className = 'form-hint err'; name.focus(); return;
      }
      if (!contact.value.trim()) {
        hint.textContent = '请留下手机 / 微信 / 邮箱，方便我们回复报价';
        hint.className = 'form-hint err'; contact.focus(); return;
      }
      if (!boat.value) {
        hint.textContent = '请选择感兴趣的船型';
        hint.className = 'form-hint err'; boat.focus(); return;
      }


      const formData = new FormData(form);
fetch(form.action, {
  method: form.method,
  body: formData,
  headers: {
    'Accept': 'application/json'
  }
})
.then(response => {
  if (response.ok) {
    document.getElementById('formHint').textContent = '✅ 提交成功！顾问将尽快与您联系。如需急定，可联系右侧微信。';
    form.reset();
  } else {
    document.getElementById('formHint').textContent = '❌ 提交失败，请重试';
  }
})
.catch(error => {
  document.getElementById('formHint').textContent = '❌ 网络异常，请稍后再试';
});

    });
  }
})();
