/* Shared presentation only: original topic data, exercises and answers stay intact. */
(function () {
  'use strict';
  const escape = value => String(value || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const plain = value => String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const assets = {
    asepsis: '/__l5e/assets-v1/307b065f-d395-4d2d-af48-80a26d128c70/study-asepsis.jpg',
    hands: '/__l5e/assets-v1/12bf121e-2892-4143-83c2-f03cb4273ef0/study-hands.jpg'
  };
  function image(section) {
    if (!section.image) return '';
    const specified = typeof section.image === 'object' ? section.image : null;
    const url = specified?.src;
    const description = plain(section.image);
    const hands = /lavado cirúrgico|fricção das mãos|fricção: as 6/i.test(section.title);
    const asepsis = /antissepsia da pele|seis termos|assepsia.*antissepsia/i.test(section.title + ' ' + description);
    const src = url && /^(https:\/\/|\/(?!\/))/.test(url) ? url : hands ? assets.hands : asepsis ? assets.asepsis : null;
    if (src) {
      const caption = specified?.caption || (hands ? 'Higiene das mãos e antebraços e fricção das mãos.' : asepsis ? 'Antissepsia da pele, instrumental e campo operatório.' : section.title);
      return `<figure class="study-figure"><a href="${escape(src)}" target="_blank" rel="noopener" aria-label="${escape('Ampliar: ' + caption)}"><img src="${escape(src)}" alt="${escape(specified?.alt || caption)}" width="1536" height="1024" loading="lazy"></a><figcaption>${escape(caption)}${!specified ? ' · Ilustração educativa' : ''}</figcaption></figure>`;
    }
    // Real diagrams use the section's curated facts, not an unfulfilled image brief.
    const facts = [];
    const listItems = String(section.explanation || '').match(/<li\b[^>]*>[\s\S]*?<\/li>/gi) || [];
    for (const item of listItems) { const fact = plain(item); if (fact) facts.push(fact); }
    if (!facts.length && section.table?.rows) for (const row of section.table.rows) facts.push(row.map(plain).join(' — '));
    if (!facts.length) {
      const paragraphs = String(section.explanation || '').match(/<p\b[^>]*>[\s\S]*?<\/p>/gi) || [];
      for (const p of paragraphs) { const fact = plain(p); if (fact && !/^Fonte[s]?:/i.test(fact)) facts.push(fact); }
    }
    if (!facts.length) return '';
    return `<figure class="study-diagram"><figcaption>${escape(section.title)}</figcaption><ol>${facts.map(f => `<li>${escape(f)}</li>`).join('')}</ol></figure>`;
  }
  function prepareTopic(topic, label = 'Referências') {
    let referenceTabId = 'referencias';
    while (topic.tabs.some(tab => tab.id === referenceTabId)) referenceTabId += '-fontes';
    return { ...topic, referenceTabId, tabs: [...topic.tabs, { id: referenceTabId, label, type: 'sections', sections: [] }] };
  }
  function collect(host, topic) {
    const sources = new Map();
    const add = (citation, section) => {
      const text = plain(citation).replace(/^Fontes?\s*:\s*/i, '').trim();
      if (!text) return;
      if (!sources.has(text)) sources.set(text, new Set());
      if (section) sources.get(text).add(section);
    };
    for (const pane of host.querySelectorAll('.pane')) {
      for (const p of pane.querySelectorAll('p')) {
        if (/^(Fontes?|Referências?(?: bibliográficas)?)\s*:/i.test(p.textContent.trim())) {
          add(p.innerHTML, p.closest('.lesson-section, .card')?.querySelector('.lesson-section-title, h3')?.textContent);
          p.remove();
        }
      }
      // Only bibliographic parentheticals, never clinical parentheses or answers.
      const walker = document.createTreeWalker(pane, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      for (const node of nodes) {
        if (node.parentElement?.closest('.lesson-exercise, .quiz-q, .quiz-options, button')) continue;
        node.textContent = node.textContent.replace(/\((T-[IVX]+,\s*Cap\.\s*\d+[^)]*)\)/g, (_, ref) => { add(ref, node.parentElement?.closest('.lesson-section')?.querySelector('.lesson-section-title')?.textContent); return ''; });
      }
    }
    for (const ref of topic.references || []) add(typeof ref === 'string' ? ref : ref.text || ref.title);
    const existing = host.querySelector(':scope > .study-references');
    existing?.remove();
    const referencePane = topic.referenceTabId ? document.getElementById('pane-' + topic.referenceTabId) : null;
    if (referencePane && host.contains(referencePane)) referencePane.innerHTML = `<section class="study-references" aria-label="Referências bibliográficas"><h2>${escape(topic.tabs.find(tab => tab.id === topic.referenceTabId)?.label)}</h2><ol>${[...sources].map(([ref, sections]) => `<li><p>${escape(ref)}</p>${sections.size ? `<small>${escape([...sections].join(' · '))}</small>` : ''}</li>`).join('')}</ol></section>`;
    host.querySelectorAll('.study-figure img').forEach(img => img.addEventListener('error', () => img.closest('figure')?.remove(), { once: true }));
  }
  window.BKStudyReading = { image, collect, prepareTopic };
})();