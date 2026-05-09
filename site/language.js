(function () {
  var STORAGE_KEY = 'goc.locale';
  var DESC_EN =
    'Rebuild attribution across Meta, Google, TikTok and all paid channels with one platform-neutral standard. Start free trial.';
  var DESC_ZH =
    '跨 Meta、Google、TikTok 等全付费渠道重建归因，单一不偏向任一平台的标准衡量。即刻免费试用。';

  function setLocale(locale) {
    var isZh = locale === 'zh';
    document.documentElement.lang = isZh ? 'zh-Hans' : 'en';
    document.body.classList.remove('locale-en', 'locale-zh');
    document.body.classList.add(isZh ? 'locale-zh' : 'locale-en');

    document.querySelectorAll('[data-set-locale]').forEach(function (btn) {
      var active = btn.getAttribute('data-set-locale') === locale;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    document.title =
      locale === 'zh'
        ? 'GOC AI Dashboard — 统一跨平台广告归因'
        : 'GOC AI Dashboard — Unified Cross-Platform Ad Attribution';

    var meta = document.getElementById('meta-desc');
    if (meta) {
      meta.setAttribute('content', isZh ? DESC_ZH : DESC_EN);
      meta.setAttribute('lang', isZh ? 'zh-Hans' : 'en');
    }

    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch (e) {
      /* ignore */
    }
  }

  document.querySelectorAll('[data-set-locale]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLocale(btn.getAttribute('data-set-locale'));
    });
  });

  var initial = 'en';
  try {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'zh' || stored === 'en') initial = stored;
  } catch (e) {
    /* ignore */
  }
  setLocale(initial);
})();
