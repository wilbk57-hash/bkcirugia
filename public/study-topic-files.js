/* Parser-blocking local scripts: one syntax error never stops the next file.
   Loaded before the app's synchronous catalog/search bootstrap; no eval. */
(function () {
  'use strict';
  window.BK_CONTENT = window.BK_CONTENT || {};
  const ids = [...new Set(window.BK_TOPIC_FILES || [])];
  for (const id of ids) {
    if (typeof id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) continue;
    document.write('<script src="/temas/' + id + '.js"><\/script>');
  }
})();