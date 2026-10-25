/* Data-only generated modules: no eval, no model HTML. */
(function () {
  'use strict';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const paragraph = value => '<p>' + escape(value).replace(/\n/g, '<br>') + '</p>';
  let context, drafts = [], history = [], controller = null, owner = '', revisionIds = [];
  const label = (pt, en, es) => context?.translate ? context.translate(pt, en, es) : pt;
  const phaseLabel = { queries:'Termos de pesquisa', research:'Pesquisa bibliográfica', plan:'Matriz e plano de abas', tabs:'Redação das abas', extras:'Caso, mapa, flashcards e quiz', verify:'Verificação contra as fontes', review:'Revisão do administrador' };

  async function request(data, signal) {
    const session = await context.session();
    if (!session?.access_token) throw new Error(label('Inicia sessão novamente.', 'Sign in again.', 'Inicia sesión de nuevo.'));
    const user = session.user.id;
    const response = await fetch('/api/study-modules', { method:'POST', headers:{ 'Content-Type':'application/json', Authorization:'Bearer ' + session.access_token }, body:JSON.stringify(data), signal });
    const current = await context.session();
    if (current?.user?.id !== user) throw new Error('A conta mudou. A operação foi interrompida.');
    if (!response.ok) { const error = await response.json().catch(() => ({})); throw new Error(error.message || 'Operação indisponível.'); }
    if (!response.headers.get('Content-Type')?.includes('ndjson')) return response.json();
    const reader = response.body.getReader(); const decoder = new TextDecoder(); let pending = '', result;
    while (true) {
      const part = await reader.read(); pending += decoder.decode(part.value, { stream:!part.done });
      const lines = pending.split('\n'); pending = lines.pop() || '';
      for (const line of lines) {
        if (!line.trim()) continue; const value = JSON.parse(line);
        if (value.error) throw new Error(value.message);
        if (value.progress) status(label('A processar: ', 'Processing: ', 'Procesando: ') + (phaseLabel[value.progress] || value.progress));
        if (value.draft) result = value;
      }
      if (part.done) break;
    }
    if (!result) throw new Error('Resposta interrompida. Recarrega para consultar o progresso guardado.');
    const finalSession = await context.session();
    if (finalSession?.user?.id !== user) throw new Error('A conta mudou; recarrega.');
    return result;
  }
  function status(text, error) { const node = document.getElementById('sg-status'); if (node) { node.textContent = text; node.setAttribute('role', error ? 'alert' : 'status'); } }

  function sources(module, ids) {
    return (ids || []).map(id => {
      const source = module.fontes.find(s => s.id === id);
      return source ? `<a class="sg-source" href="#sg-source-${escape(id)}">${escape(source.title)} · ${escape(source.locator)}</a>` : '';
    }).join(' ');
  }
  function blocks(module, content) {
    const allowed = { conceito:'blue', atencao:'amber', complicacao:'red', referencia:'green', conduta:'purple', nota:'blue', lacuna:'amber' };
    return content.map(b => `<section class="info-box ${allowed[b.tipo_visual] || 'blue'}"><h3>${escape(b.titulo)}</h3>${paragraph(b.texto)}${b.itens?.length ? '<ul>' + b.itens.map(x => '<li>' + escape(x) + '</li>').join('') + '</ul>' : ''}${b.tabela ? `<div class="sg-table"><table class="data"><thead><tr>${b.tabela.cabecalhos.map(h => '<th scope="col">' + escape(h) + '</th>').join('')}</tr></thead><tbody>${b.tabela.linhas.map(r => '<tr>' + r.map(c => '<td>' + escape(c) + '</td>').join('') + '</tr>').join('')}</tbody></table></div>` : ''}${sources(module, b.fontes)}</section>`).join('');
  }
  function views(module) {
    const intro = '<h1>' + escape(module.tema) + '</h1>' + paragraph(module.aviso_educacional) + `<div class="sg-meta">${module.abas.length} abas · ${escape(module.tempo_estimado_minutos)} min · ${module.fontes_base.length} livros</div><h2>Objetivos</h2><ul>` + module.objetivos_aprendizagem.map(o => '<li>' + escape(o) + '</li>').join('') + '</ul>' + paragraph('Bibliografia editorial e revisão médica não confirmadas automaticamente.') + module.rastreabilidade.limitacoes_declaradas.map(paragraph).join('');
    const tabViews = module.abas.map(tab => ({ id:tab.id, label:tab.titulo, html:'<h2>' + escape(tab.titulo) + '</h2>' + blocks(module, tab.conteudo) + tab.limitacoes.map(paragraph).join(''), markdown:tab.texto_copiavel_markdown }));
    const cases = Object.entries(module.caso_clinico.etapas).map(([id, step]) => `<details class="sg-detail" open><summary>${escape(id.replace(/_/g,' '))}</summary>${paragraph(step.texto)}${step.limitacao ? paragraph('Limitação: ' + step.limitacao) : ''}${sources(module, step.fontes)}</details>`).join('');
    const map = module.mapa_mental.nos;
    const tree = parent => '<ul>' + map.filter(n => n.pai === parent).map(n => `<li><details open><summary>${escape(n.label)}</summary>${sources(module,n.fontes)}${tree(n.id)}</details></li>`).join('') + '</ul>';
    const flashes = module.flashcards.map(f => `<details class="sg-detail"><summary>${escape(f.pergunta)}</summary>${paragraph(f.resposta)}${sources(module,f.fontes)}</details>`).join('');
    const quiz = module.quiz.map((q, i) => `<section class="sg-question"><h3>${i+1}. ${escape(q.pergunta)}</h3><fieldset aria-label="${escape(q.pergunta)}">${q.alternativas.map((a,j) => `<label class="sg-option"><input type="radio" name="sg-q-${i}" value="${j}"> ${String.fromCharCode(65+j)}. ${escape(a)}</label>`).join('')}</fieldset><details><summary>Gabarito e justificações</summary>${q.justificativas.map((j,k) => paragraph(String.fromCharCode(65+k) + (k === q.correta ? ' ✓ — ' : ' — ') + j)).join('')}${sources(module,q.fontes)}</details></section>`).join('');
    const trace = `<div class="sg-table"><table class="data"><thead><tr><th>Subtema</th><th>Estado</th><th>Informação</th><th>Fonte</th></tr></thead><tbody>${module.rastreabilidade.matriz_cobertura.map(m => `<tr><td>${escape(m.subtema)}</td><td>${escape(m.status)}</td><td>${escape(m.informacao_extraida)}</td><td>${sources(module,m.fonte ? [m.fonte] : [])}</td></tr>`).join('')}</tbody></table></div>` + [...module.rastreabilidade.divergencias,...module.rastreabilidade.lacunas,...module.rastreabilidade.limitacoes_declaradas].map(paragraph).join('') + '<h3>Verificações</h3>' + Object.entries(module.checklist_final).filter(([k]) => k !== 'pendencias').map(([k,v]) => paragraph(k.replace(/_/g,' ') + ': ' + (v ? 'verificado' : 'não confirmado'))).join('');
    const references = module.fontes.map(s => `<section id="sg-source-${escape(s.id)}" class="sg-reference"><h3>${escape(s.title)}</h3>${paragraph('Edição: ' + (s.edition || 'não verificada') + ' · Ano: não verificado · ' + s.locator)}${paragraph('Trecho: ' + s.id)}</section>`).join('') + module.abas.map(a => '<h3>' + escape(a.titulo) + '</h3>' + sources(module,a.fontes_consultadas)).join('');
    return [{ id:'inicio', label:'Início', html:intro, markdown:'# ' + module.tema + '\n\n' + module.aviso_educacional + '\n\n' + module.objetivos_aprendizagem.map(o => '- ' + o).join('\n') },...tabViews,
      {id:'caso',label:'Caso clínico',html:paragraph(module.caso_clinico.aviso)+cases,markdown:module.caso_clinico.texto_copiavel_markdown},
      {id:'mapa',label:'Mapa mental',html:tree(null),markdown:module.mapa_mental.texto_copiavel_markdown},
      {id:'flashcards',label:'Flashcards',html:flashes,markdown:module.flashcards_texto_copiavel},
      {id:'quiz',label:'Quiz',html:quiz,markdown:module.quiz_texto_copiavel},
      {id:'rastreabilidade',label:'Rastreabilidade',html:trace,markdown:module.rastreabilidade.texto_copiavel_markdown},
      {id:'referencias',label:'Referências',html:references,markdown:module.referencias_texto_copiavel}];
  }
  function download(name, text, mime) {
    const url = URL.createObjectURL(new Blob([text], {type:mime})); const a = document.createElement('a'); a.href=url; a.download=name; a.click(); URL.revokeObjectURL(url);
  }
  async function copy(text, feedback) {
    try { await navigator.clipboard.writeText(text); feedback.textContent='Copiado!'; setTimeout(() => { feedback.textContent=''; },2000); }
    catch {
      const dialog = document.createElement('dialog'); dialog.className='sg-copy-dialog';
      dialog.innerHTML='<h2>Copiar conteúdo</h2><p>Seleciona o texto e usa a opção Copiar do teu dispositivo.</p><textarea aria-label="Conteúdo integral para copiar" class="sb-input"></textarea><div class="sg-actions"><button class="btn primary" type="button">Selecionar tudo</button><button class="btn" type="button">Fechar</button></div>';
      dialog.querySelector('textarea').value=text; const buttons=dialog.querySelectorAll('button'); buttons[0].onclick=() => { dialog.querySelector('textarea').focus(); dialog.querySelector('textarea').select(); }; buttons[1].onclick=() => dialog.close(); dialog.onclose=() => dialog.remove(); document.body.append(dialog); dialog.showModal();
    }
  }
  function reader(host, module) {
    const tabs = views(module); let selected=0;
    host.innerHTML='<div class="sg-actions"><button class="btn" data-copy="tab">⧉ Copiar esta aba</button><button class="btn" data-copy="all">⧉ Copiar módulo completo</button><button class="btn" data-copy="flash">⧉ Copiar flashcards</button><button class="btn" data-copy="quiz">⧉ Copiar quiz</button><button class="btn" data-export="json">↓ JSON</button><button class="btn" data-export="md">↓ Markdown</button><span role="status" data-feedback></span></div><label class="sg-search-label">Pesquisar neste módulo<input type="search" class="sb-input" data-search></label><div class="sg-search-results"></div><div role="tablist" class="sg-tabs" aria-label="Abas do tema"></div><article class="sg-panel" role="tabpanel"></article>';
    const nav=host.querySelector('.sg-tabs'), panel=host.querySelector('.sg-panel');
    const show=i => { selected=i; nav.querySelectorAll('button').forEach((b,k) => { b.setAttribute('aria-selected',String(k===i)); b.tabIndex=k===i?0:-1; }); panel.id='sg-panel-'+tabs[i].id; panel.setAttribute('aria-labelledby','sg-tab-'+tabs[i].id); panel.innerHTML=tabs[i].html; };
    tabs.forEach((tab,i) => { const b=document.createElement('button'); b.className='tab-btn'; b.type='button'; b.id='sg-tab-'+tab.id; b.setAttribute('role','tab'); b.setAttribute('aria-controls','sg-panel-'+tab.id); b.textContent=tab.label; b.onclick=() => show(i); b.onkeydown=event => { const next=event.key==='ArrowRight'?(i+1)%tabs.length:event.key==='ArrowLeft'?(i+tabs.length-1)%tabs.length:event.key==='Home'?0:event.key==='End'?tabs.length-1:null; if(next!==null){event.preventDefault();show(next);nav.children[next].focus();} }; nav.append(b); });
    host.querySelectorAll('[data-copy]').forEach(b => b.onclick=() => copy(b.dataset.copy==='all'?module.modulo_completo_texto_copiavel:b.dataset.copy==='flash'?module.flashcards_texto_copiavel:b.dataset.copy==='quiz'?module.quiz_texto_copiavel:tabs[selected].markdown,host.querySelector('[data-feedback]')));
    host.querySelectorAll('[data-export]').forEach(b => b.onclick=() => download('bk-cirurgia-tema.'+(b.dataset.export==='json'?'json':'md'),b.dataset.export==='json'?JSON.stringify(module,null,2):module.modulo_completo_texto_copiavel,b.dataset.export==='json'?'application/json':'text/markdown'));
    host.querySelector('[data-search]').oninput=event => { const q=event.target.value.trim().toLocaleLowerCase(); const target=host.querySelector('.sg-search-results'); target.replaceChildren(); if(q.length<2)return; tabs.forEach((t,i) => { if(!t.markdown.toLocaleLowerCase().includes(q))return; const b=document.createElement('button');b.className='btn';b.textContent=t.label;b.onclick=() => show(i);target.append(b); }); };
    panel.addEventListener('click',event => { const a=event.target.closest('.sg-source'); if(!a)return;event.preventDefault(); const id=a.getAttribute('href').slice(1); show(tabs.length-1); panel.querySelector('#'+CSS.escape(id))?.scrollIntoView({block:'center'}); });
    show(0);
  }
  async function refresh() {
    const session=await context.session(); const user=session?.user?.id;
    if(!user){reset();return;}
    if(owner && owner!==user) reset(); owner=user;
    const result=await request({action:'list'});
    context.remove(revisionIds); revisionIds=[];
    for(const r of result.revisions){ const id='generated-'+r.module_id; context.install(id,r.title,r.catalog_n,r.catalog_title,r.payload); revisionIds.push(id); }
    context.changed(); drafts=result.drafts||[];history=result.history||[];
  }
  function reset() { controller?.abort();controller=null;drafts=[];history=[]; if(context){context.remove(revisionIds);context.changed();} revisionIds=[];owner='';document.getElementById('sg-workspace')?.remove(); }

  async function workspace() {
    if(!context.admin())return;
    const host=document.getElementById('adminView');
    document.getElementById('sg-workspace')?.remove(); const section=document.createElement('section');section.id='sg-workspace';section.className='sg-workspace';
    section.innerHTML=`<h2>${label('Gerar tema','Generate topic','Generar tema')}</h2><form id="sg-form"><div class="sg-form-grid"><label>Tema<input class="sb-input" name="title" required minlength="3" maxlength="250"></label><label>Livros prioritários (opcional)<input class="sb-input" name="priorities" maxlength="2000"></label><label>Edição preferida (opcional)<input class="sb-input" name="edition" maxlength="500"></label><label>Grupo do catálogo<select class="sb-input" name="catalog_n"></select></label></div><div class="sg-actions"><button type="submit" class="btn primary">✦ Criar rascunho</button><button type="button" class="btn" id="sg-refresh">↻ Atualizar</button></div></form><p id="sg-status" role="status"></p><div id="sg-inventory"></div><div id="sg-drafts"></div><div id="sg-editor"></div>`;
    host.prepend(section); const select=section.querySelector('select');
    [{n:'GERADOS',title:'Temas da Biblioteca Oficial'},...context.catalog()].forEach(g => {const o=document.createElement('option');o.value=g.n;o.textContent=g.n+' · '+g.title;select.append(o);});
    section.querySelector('#sg-refresh').onclick=async()=>{try{await refresh();renderDrafts();status('Atualizado.');}catch(e){status(e.message,true);}};
    section.querySelector('form').onsubmit=async event=>{event.preventDefault();const button=event.submitter;button.disabled=true;try{const form=new FormData(event.target);const result=await request({action:'create',title:form.get('title'),priorities:form.get('priorities'),edition:form.get('edition'),catalog_n:form.get('catalog_n'),catalog_title:select.selectedOptions[0].textContent.split(' · ').slice(1).join(' · ')});await refresh();renderDrafts();await edit(result.draft.id);status('Rascunho criado. Inicia a pesquisa quando estiveres pronto.');}catch(e){status(e.message,true);}finally{button.disabled=false;}};
    try{await refresh();renderDrafts(); const result=await request({action:'inventory'});section.querySelector('#sg-inventory').innerHTML='<h3>Biblioteca Oficial</h3><ul>'+result.books.map(b=>'<li>'+escape(b.title)+' · '+(b.ready?'preparado':'incompleto — não pesquisável integralmente')+' · edição '+escape(b.edition||'não verificada')+'</li>').join('')+'</ul>';}catch(e){status(e.message,true);}
    section.scrollIntoView({block:'start'});
  }
  function renderDrafts(){const host=document.getElementById('sg-drafts');if(!host)return;host.innerHTML='<h3>Rascunhos</h3>';if(!drafts.length)host.append(document.createTextNode('Ainda não existem rascunhos.'));drafts.forEach(d=>{const row=document.createElement('div');row.className='sg-draft-row';row.innerHTML='<div><strong>'+escape(d.title)+'</strong><p>'+escape(phaseLabel[d.phase]||d.phase)+' · '+(d.paused?'Pausado':'Etapa '+(d.step+1))+'</p></div>';const b=document.createElement('button');b.className='btn';b.textContent='Abrir';b.onclick=()=>edit(d.id);row.append(b);host.append(row);});}
  async function edit(id,payload){
    const draft=drafts.find(d=>d.id===id);if(!draft)return;const host=document.getElementById('sg-editor');if(!host)return;
    host.innerHTML='<hr><h2>'+escape(draft.title)+'</h2><p>'+escape(phaseLabel[draft.phase]||draft.phase)+'</p><div class="sg-actions"></div><p class="sg-error">'+escape(draft.error_message||'')+'</p><div class="sg-preview"></div><div class="sg-review"></div>';
    const actions=host.querySelector('.sg-actions'); const button=(name,run)=>{const b=document.createElement('button');b.className='btn';b.textContent=name;b.onclick=run;actions.append(b);return b;};
    if(draft.phase!=='review'){
      button(draft.paused?'Retomar geração':'Gerar até à revisão',async()=>{
        if(controller)return;controller=new AbortController();actions.querySelectorAll('button').forEach(b=>b.disabled=true);stop.disabled=false;
        try{let current=draft;if(current.paused){const r=await request({action:'resume',id,version:current.version});current=r.draft;}let result;for(let budget=0;budget<100 && current.phase!=='review';budget++){result=await request({action:'step',id,version:current.version},controller.signal);current=result.draft;status('Etapa guardada: '+(phaseLabel[current.phase]||current.phase)+' · '+(current.step+1));if(current.phase!=='review')await new Promise(resolve=>setTimeout(resolve,500));}await refresh();renderDrafts();await edit(id,result?.payload);status(current.phase==='review'?'Rascunho pronto para revisão.':'Progresso guardado. Continua para concluir as etapas restantes.');}
        catch(e){status(e.name==='AbortError'?'Interrompido. O progresso anterior permanece guardado.':e.message,true);await refresh().catch(()=>{});renderDrafts();await edit(id);}
        finally{controller=null;}
      });
      const stop=button('■ Parar',()=>controller?.abort());stop.disabled=true;
      if(draft.data_json.research_log?.length)host.querySelector('.sg-preview').innerHTML='<h3>Pesquisa realizada</h3><ul>'+draft.data_json.research_log.map(r=>'<li>'+escape(draft.data_json.inventory.find(b=>b.id===r.book_id)?.title)+' · '+escape(r.query)+' · '+r.matches+' resultados</li>').join('')+'</ul><h3>Trechos recuperados</h3>'+draft.data_json.evidence.map(s=>'<details class="sg-detail"><summary>'+escape(s.title)+' · '+escape(s.locator)+'</summary>'+paragraph(s.content)+'</details>').join('');
      return;
    }
    if(!payload){const response=await request({action:'preview',id,version:draft.version});return edit(id,response.payload);}
    reader(host.querySelector('.sg-preview'),payload);
    const review=host.querySelector('.sg-review');review.innerHTML='<h3>Revisão</h3>'+payload.rastreabilidade.limitacoes_declaradas.map(paragraph).join('')+'<label class="sg-review-check"><input type="checkbox" id="sg-reviewed"> Revi o conteúdo e as fontes; compreendo as limitações declaradas.</label><details><summary>Editar conteúdo estruturado</summary><textarea class="sb-input sg-json" aria-label="Rascunho estruturado"></textarea><button class="btn" id="sg-save">✓ Guardar alterações</button></details><h3>Versões anteriores</h3><div class="sg-history"></div>';
    const editable={plan:draft.data_json.plan,tabs:draft.data_json.tabs,extras:draft.data_json.extras,review:draft.data_json.review};review.querySelector('textarea').value=JSON.stringify(editable,null,2);
    review.querySelector('#sg-save').onclick=async()=>{try{const result=await request({action:'save',id,version:draft.version,state:JSON.parse(review.querySelector('textarea').value)});await refresh();renderDrafts();await edit(id,result.payload);status('Alterações guardadas.');}catch(e){status(e.message,true);}};
    button('✓ Disponibilizar aos alunos',async()=>{try{await request({action:'publish',id,version:draft.version,reviewed:review.querySelector('#sg-reviewed').checked});await refresh();renderDrafts();status('Tema disponível em Estudos.');await edit(id);}catch(e){status(e.message,true);}});
    history.filter(r=>r.module_id===id).forEach(r=>{const b=document.createElement('button');b.className='btn';b.textContent='Versão '+r.version+(r.published?' · atual':' · restaurar');b.disabled=r.published;b.onclick=async()=>{try{await request({action:'restore',id:r.id});await refresh();status('Versão restaurada.');await edit(id);}catch(e){status(e.message,true);}};review.querySelector('.sg-history').append(b);});
  }
  window.BKGeneratedStudy={init(options){context=options;},refresh,reset,workspace,reader,views,escape};
})();