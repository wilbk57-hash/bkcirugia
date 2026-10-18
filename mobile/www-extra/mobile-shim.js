/* Camada de compatibilidade do app Android (Capacitor).
   Carregada no <head>, antes de qualquer script do app.
   window.BK_API_BASE e window.BK_WEB_URL são definidos pelo script de build. */
(function () {
  var cap = window.Capacitor;
  var native = !!(cap && cap.isNativePlatform && cap.isNativePlatform()) ||
    (location.hostname === 'localhost' && location.protocol === 'https:');
  window.BK_NATIVE = native;
  if (!native) return;

  var base = String(window.BK_API_BASE || '').replace(/\/+$/, '');

  // 1. Chamadas /api/... vão ao servidor publicado (no APK não existe servidor local).
  var nativeFetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    if (typeof input === 'string' && input.indexOf('/api/') === 0) input = base + input;
    return nativeFetch(input, init);
  };

  // 2. Links externos abrem no navegador do sistema.
  var nativeOpen = window.open ? window.open.bind(window) : null;
  window.open = function (url, target, features) {
    var plugins = window.Capacitor && window.Capacitor.Plugins;
    if (url && /^https?:\/\//i.test(String(url)) && plugins && plugins.Browser) {
      plugins.Browser.open({ url: String(url) });
      return null;
    }
    return nativeOpen ? nativeOpen(url, target, features) : null;
  };

  // 3. Login social ainda não existe no app (depende de deep link). E-mail e senha funcionam.
  window.BK_NATIVE_OAUTH = function () {
    var msg = 'Login com Google, Apple ou Microsoft ainda não está disponível no app Android. Entre com e-mail e senha.';
    if (typeof showToast === 'function') showToast(msg); else alert(msg);
  };

  // 4. Botão voltar do Android: fecha o leitor; senão volta; senão sai.
  document.addEventListener('DOMContentLoaded', function () {
    var plugins = window.Capacitor && window.Capacitor.Plugins;
    var App = plugins && plugins.App;
    if (!App || !App.addListener) return;
    App.addListener('backButton', function () {
      try { if (typeof bkReader !== 'undefined' && bkReader) { bkReaderClose(); return; } } catch (e) {}
      if (history.length > 1) history.back(); else if (App.exitApp) App.exitApp();
    });
  });
})();