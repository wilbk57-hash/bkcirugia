/* Shared PDF/EPUB reader: lazy page rendering, real zoom and chapter navigation. */
let bkReader = null;
function bkReaderButton(label, text, action) {
  const button = document.createElement('button');
  button.className = 'icon-btn'; button.title = label; button.setAttribute('aria-label', label);
  button.textContent = text; button.onclick = action; return button;
}
function bkReaderClose() {
  if (!bkReader) return;
  const state = bkReader; bkReader = null;
  state.observer?.disconnect(); state.pdf?.destroy(); state.rendition?.destroy(); state.epub?.destroy();
  state.overlay.remove();
}
async function bkReaderOpen(book, initialPage) {
  bkReaderClose();
  const state = { book, page: Number(initialPage) || 1, zoom: 100, contents: [], generation: 0 };
  bkReader = state;
  const overlay = document.createElement('div'); state.overlay = overlay;
  overlay.id = 'myLibReaderOverlay'; overlay.className = 'bk-reader';
  overlay.setAttribute('role', 'dialog'); overlay.setAttribute('aria-modal', 'true'); overlay.setAttribute('aria-label', book.title);
  const toolbar = document.createElement('div'); toolbar.className = 'bk-reader-toolbar';
  const heading = document.createElement('strong'); heading.className = 'bk-reader-title'; heading.textContent = book.title;
  toolbar.append(heading);
  const contentsButton = bkReaderButton(myLibT('Índice','Contents','Índice'), '☰', () => { state.aside.hidden = !state.aside.hidden; });
  toolbar.append(contentsButton);
  state.zoomLabel = document.createElement('output'); state.zoomLabel.textContent = '100%';
  toolbar.append(bkReaderButton(myLibT('Reduzir','Zoom out','Reducir'), '−', () => bkReaderZoom(-25)), state.zoomLabel,
    bkReaderButton(myLibT('Ampliar','Zoom in','Ampliar'), '+', () => bkReaderZoom(25)),
    bkReaderButton(myLibT('Fechar','Close','Cerrar'), '✕', bkReaderClose));
  const navigation = document.createElement('div'); navigation.className = 'bk-reader-navigation';
  state.pageInput = document.createElement('input'); state.pageInput.type = 'number'; state.pageInput.min = '1'; state.pageInput.value = String(state.page);
  state.pageInput.setAttribute('aria-label', myLibT('Página','Page','Página'));
  state.pageInput.onchange = () => bkReaderGo(Number(state.pageInput.value));
  state.pageTotal = document.createElement('span');
  navigation.append(bkReaderButton(myLibT('Anterior','Previous','Anterior'), '‹', () => state.rendition ? state.rendition.prev() : bkReaderGo(state.page - 1)),
    state.pageInput, state.pageTotal,
    bkReaderButton(myLibT('Seguinte','Next','Siguiente'), '›', () => state.rendition ? state.rendition.next() : bkReaderGo(state.page + 1)));
  const layout = document.createElement('div'); layout.className = 'bk-reader-layout';
  state.aside = document.createElement('aside'); state.aside.className = 'bk-reader-contents'; state.aside.hidden = true;
  state.body = document.createElement('div'); state.body.className = 'bk-reader-body'; state.body.id = 'myLibReaderBody';
  state.body.textContent = myLibT('A carregar…','Loading…','Cargando…');
  layout.append(state.aside, state.body); overlay.append(toolbar, navigation, layout); document.body.append(overlay);
  try {
    const url = await myLibSignedUrl(book); if (!url) throw new Error('download');
    const response = await fetch(url); if (!response.ok) throw new Error('download');
    const bytes = await response.arrayBuffer(); if (bkReader !== state) return;
    if ((book.mime_type || '').includes('epub') || /\.epub$/i.test(book.file_path)) {
      await myLibLoadScript('https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js');
      await myLibLoadScript('https://cdn.jsdelivr.net/npm/epubjs@0.3.93/dist/epub.min.js');
      if (bkReader !== state) return;
      state.body.innerHTML = '<div id="bkEpubHost" class="bk-epub-host"></div>';
      state.epub = ePub(bytes); state.rendition = state.epub.renderTo('bkEpubHost', { width: '100%', height: '100%', flow: 'scrolled-doc' });
      const nav = await state.epub.loaded.navigation;
      const walk = (items, level = 0) => items.forEach(item => { state.contents.push({ title: item.label.trim(), href: item.href, level }); walk(item.subitems || [], level + 1); });
      walk(nav.toc || []);
      if (!state.contents.length) { await state.epub.ready; state.epub.spine.spineItems.forEach((item, index) => state.contents.push({ title: myLibT('Secção','Section','Sección') + ' ' + (index + 1), href: item.href, level: 0 })); }
      state.pageInput.hidden = true; state.pageTotal.textContent = 'EPUB';
      await state.rendition.display();
    } else {
      await myLibLoadScript('https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js');
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
      if (bkReader !== state) return;
      state.pdf = await window.pdfjsLib.getDocument({ data: bytes }).promise;
      state.pageInput.max = String(state.pdf.numPages); state.pageTotal.textContent = '/ ' + state.pdf.numPages;
      const outline = await state.pdf.getOutline();
      const walk = async (items, level = 0) => { for (const item of items) {
        try {
          const dest = typeof item.dest === 'string' ? await state.pdf.getDestination(item.dest) : item.dest;
          if (dest?.[0] != null) { const page = typeof dest[0] === 'number' ? dest[0] + 1 : (await state.pdf.getPageIndex(dest[0])) + 1; state.contents.push({ title: item.title, page, level }); }
        } catch (error) { /* malformed bookmark: keep reading */ }
        await walk(item.items || [], level + 1);
      } };
      await walk(outline || []);
      if (!state.contents.length && Array.isArray(book.contents)) state.contents = book.contents.filter(item => item.page && item.title);
      if (!state.contents.length) {
        // Inspect headings only when a PDF has no bookmarks or saved index.
        for (let pageNumber = 1; pageNumber <= state.pdf.numPages; pageNumber++) {
          if (bkReader !== state) return;
          const page = await state.pdf.getPage(pageNumber); const content = await page.getTextContent();
          const lines = []; let line = '';
          content.items.forEach(item => { line += (item.str || '') + ' '; if (item.hasEOL) { lines.push(line.trim()); line = ''; } });
          if (line) lines.push(line.trim());
          const title = lines.slice(0, 14).find(text => text.length < 160 && /^(cap[ií]tulo|chapter|parte|part|se[cç][aã]o|section|unidad|unidade)\s+[\dIVXLCDM]+\b/i.test(text));
          if (title && !state.contents.some(item => item.title === title)) state.contents.push({ title, page: pageNumber, level: 0 });
        }
      }
      if (!state.contents.length) for (let page = 1; page <= state.pdf.numPages; page += 10) state.contents.push({ title: myLibT('Páginas','Pages','Páginas') + ' ' + page + '–' + Math.min(page + 9, state.pdf.numPages), page, level: 0 });
      await bkReaderRenderPdf(state);
      bkReaderGo(state.page);
    }
    if (bkReader !== state) return;
    bkReaderContents(state);
    if (myLibIsAdmin() && state.contents.length) {
      const { error } = await supabaseClient.from('user_books').update({ contents: state.contents }).eq('id', book.id);
      if (!error) book.contents = state.contents;
    }
  } catch (error) { if (bkReader === state) state.body.textContent = myLibT('Não foi possível abrir este livro. Fecha e tenta novamente.','Could not open this book. Close and try again.','No se pudo abrir este libro. Cierra e inténtalo de nuevo.'); }
}
function bkReaderContents(state) {
  state.aside.innerHTML = '';
  const search = document.createElement('input'); search.type = 'search'; search.placeholder = myLibT('Pesquisar no índice','Search contents','Buscar en el índice'); search.setAttribute('aria-label', search.placeholder);
  const list = document.createElement('div');
  const render = () => { list.innerHTML = ''; state.contents.filter(item => normalizeMyLibSearch(item.title).includes(normalizeMyLibSearch(search.value))).forEach(item => {
    const button = document.createElement('button'); button.className = 'bk-reader-chapter'; button.textContent = item.title + (item.page ? ' · ' + item.page : '');
    button.style.setProperty('--chapter-level', Math.min(item.level || 0, 4));
    button.onclick = () => { if (item.href && state.rendition) state.rendition.display(item.href); else bkReaderGo(item.page); state.aside.hidden = true; };
    list.append(button);
  }); };
  search.oninput = render; state.aside.append(search, list); render();
}
async function bkReaderRenderPdf(state) {
  if (bkReader !== state) return;
  state.observer?.disconnect(); const generation = ++state.generation;
  state.body.innerHTML = ''; state.pages = [];
  const first = await state.pdf.getPage(1); const base = first.getViewport({ scale: 1 });
  const fit = Math.min(1.5, Math.max(0.2, (state.body.clientWidth - 24) / base.width));
  const scale = fit * state.zoom / 100;
  state.observer = new IntersectionObserver(entries => entries.forEach(async entry => {
    if (!entry.isIntersecting || bkReader !== state || generation !== state.generation) return;
    const host = entry.target; if (host.dataset.rendered) return; host.dataset.rendered = 'true';
    try {
      const page = await state.pdf.getPage(Number(host.dataset.page)); const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas'); const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(viewport.width * ratio); canvas.height = Math.round(viewport.height * ratio);
      canvas.style.width = viewport.width + 'px'; canvas.style.height = viewport.height + 'px';
      if (generation !== state.generation || bkReader !== state) return;
      host.style.width = viewport.width + 'px'; host.style.height = viewport.height + 'px'; host.replaceChildren(canvas);
      await page.render({ canvasContext: canvas.getContext('2d'), viewport, transform: [ratio, 0, 0, ratio, 0, 0] }).promise;
    } catch (error) { host.textContent = myLibT('Página indisponível','Page unavailable','Página no disponible'); }
  }), { root: state.body, rootMargin: '700px' });
  for (let page = 1; page <= state.pdf.numPages; page++) {
    const host = document.createElement('div'); host.className = 'bk-reader-page'; host.dataset.page = String(page);
    host.style.width = base.width * scale + 'px'; host.style.height = base.height * scale + 'px';
    host.textContent = myLibT('Página','Page','Página') + ' ' + page; state.body.append(host); state.pages.push(host); state.observer.observe(host);
  }
  state.body.onscroll = () => {
    const top = state.body.getBoundingClientRect().top;
    const visible = state.pages.find(host => host.getBoundingClientRect().bottom > top + 24);
    if (visible) { state.page = Number(visible.dataset.page); state.pageInput.value = String(state.page); }
  };
}
function bkReaderGo(page) {
  const state = bkReader; if (!state?.pdf) return;
  state.page = Math.max(1, Math.min(state.pdf.numPages, Number(page) || 1)); state.pageInput.value = String(state.page);
  const host = state.pages?.[state.page - 1]; if (host) state.body.scrollTop = host.offsetTop - state.body.offsetTop;
}
async function bkReaderZoom(delta) {
  const state = bkReader; if (!state) return;
  const page = state.page; state.zoom = Math.min(300, Math.max(50, state.zoom + delta)); state.zoomLabel.textContent = state.zoom + '%';
  if (state.rendition) state.rendition.themes.fontSize(state.zoom + '%');
  else if (state.pdf) { await bkReaderRenderPdf(state); bkReaderGo(page); }
}