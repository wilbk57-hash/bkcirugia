# Relatório (só leitura) — como o leitor de Estudos desenha cada aba

Nenhuma alteração será feita. Código real de `public/app.html`.

## 1. type:'sections' ({ h, t })

```js
function renderSections(tab) {
  let html = tab.sections.map(s => {
    const v = s.variant || guessVariant(s.h + ' ' + s.t);
    return `
    <div class="card accent-teal">
      <h3>${s.h}</h3>
      ${infoBox(v, s.label || variantLabel(v), s.t)}
      ${renderInfoBoxes(s.boxes || s.box)}
    </div>`;
  }).join('');
  if (tab.table) {
    html += `
    <div class="card">
      <h3>${tab.table.title}</h3>
      <div style="overflow-x:auto;max-width:100%"><table class="data">
        ${tab.table.rows.map(r => `<tr><td style="font-weight:600;color:var(--text);white-space:nowrap;">${r[0]}</td><td>${r[1]}</td></tr>`).join('')}
      </table></div>
    </div>`;
  }
  return html;
}

const INFO_BOX_VARIANTS = ['amber', 'red', 'blue', 'green', 'purple'];
function infoBox(variant, label, html, extraStyle) {
  const v = INFO_BOX_VARIANTS.includes(variant) ? variant : 'blue';
  return `<div class="info-box ${v}"${extraStyle ? ` style="${extraStyle}"` : ''}>` +
    (label ? `<div class="label">${label}</div>` : '') +
    `<div class="info-box-text">${html}</div></div>`;
}
function renderInfoBoxes(boxes) {
  if (!boxes) return '';
  return (Array.isArray(boxes) ? boxes : [boxes])
    .map(b => infoBox(b.variant || b.type, b.label || '', b.text || b.body || ''))
    .join('');
}
```

- Cada secção já fica dentro de um `info-box`; `variant` e `label` da secção são opcionais (sem eles, `guessVariant` escolhe pela palavra-chave).
- (a) Destaque dentro de `t`: `<div class="info-box amber|red|blue|green|purple"><div class="label">Título</div><div class="info-box-text">…</div></div>`. Fora de `t`, usar `boxes: [{ variant, label, text }]`.
- (b) Tabela: `<table class="data">` com `<thead><tr><th>…</th></tr></thead><tbody>…</tbody>`; `th` tem estilo próprio em `study-reading.css` (fundo `--panel2`, negrito). Envolver em `<div style="overflow-x:auto">`. Ou `tab.table = { title, rows: [[a,b],…] }` (só 2 colunas, sem cabeçalho).
- (c) Listas: `<ul>/<ol><li>` normais.
- Sanitizador: não existe. `t` é inserido tal como está (template string → innerHTML); `style` inline, `<details>`, `<table>` são preservados. Único pós-processamento: `study-reading.js` remove parágrafos `Fonte:`/`Referência(s):` e notas `(T-I, Cap…)` para a aba Referências.

## 2. type:'case'

```js
const v = s.variant || guessVariant(s.title + ' ' + s.body);
return `
<div class="caso-step ${i===0?'active':''}" id="caso-${i}">
  <span class="caso-tag">${s.tag}</span>
  <div class="caso-title">${s.title}</div>
  <div class="caso-body">${infoBox(v, s.label || variantLabel(v), s.body)}${renderInfoBoxes(s.boxes || s.box)}</div>
</div>`;
```
Sim, `variant` e `label` são usados. Campos: `tag, title, body, variant?, label?, boxes?`. Barra de pontos + botões Anterior/Próxima.

## 3. accordion e checklist

```js
<div class="acc-item" id="acc-${i}">
  <div class="acc-head" onclick="toggleAcc(${i})"><span>${it.title}</span><span class="acc-chev">▾</span></div>
  <div class="acc-panel">
    ${infoBox(v, it.label || variantLabel(v), it.body)}
    ${renderInfoBoxes(it.boxes || it.box)}
    ${it.extra ? infoBox('blue', t('ib.clinical'), `<span style="white-space:pre-line;">${it.extra}</span>`) : ''}
  </div>
</div>
```
(accordion também aceita `variant`, `label`, `boxes`.)

```js
<div class="check-group">
  <div class="check-head">
    <div class="check-letter" style="background:${bg};color:${fg};">${g.letter}</div>
    <div>${g.title}</div>
  </div>
  <div class="check-body"><p>${g.body}</p></div>
</div>
```
`color` aceite: `teal`, `amber`, `red`, `violet`, `blue` (outro valor → teal). Nota: `body` vai dentro de `<p>`, por isso evitar `<div>`/`<table>` nele.

## 4. type:'lesson'

```js
${renderInfoBoxes(s.boxes || s.box)}
${infoBox('blue', t('ib.example'), s.example)}
${s.note ? infoBox(s.note.type === 'warn' ? 'red' : 'green', t(s.note.type === 'warn' ? 'ib.attention' : 'ib.tip'), s.note.text) : ''}
${infoBox('amber', t('ib.keyconcept') + ' · ' + t('ib.summary'), s.summary)}
```
- `boxes`/`box`: sim, variantes `amber, red, blue, green, purple` (outra → blue).
- `note`: só `warn` (vermelho, "Atenção"); qualquer outro valor, incluindo `tip`, → verde "Dica".
- Também: `table {title, rows}` e `image` (ilustração/diagrama).

## 5. Flashcards / mapa mental

- Não há flashcards (nem virar carta) nem mapa mental fora de `lesson.review.mindMap`.
- Melhor opção atual: `type:'accordion'` — `title` = frente, `body` = verso (abre ao tocar).
