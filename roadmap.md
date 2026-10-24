# Conteúdos de estudo
- [ ] Repor quadros anteriores, justificar textos e aperfeiçoar tabelas sem alterar conteúdos, imagens ou referências.
- [x] Uniformizar leitura dos temas atuais e futuros, reunir fontes no fim e trocar sugestões por ilustrações educativas e diagramas baseados no texto; imagens, referências, exercício e abertura de tema antigo verificados com administrador em 1280 e 400 px, sem erros; dez testes passaram. Sem publicar.
- [x] Preparar public/study-topics.js como lugar fixo, integrar catálogo/glossário/pesquisa e documentar em STUDY-CONTENT.md; sete testes passaram e abertura de Asepsia, lição e quiz verificada com sessão administrativa usando conteúdo temporário apenas no navegador, sem alterar os conteúdos existentes.

# Segurança dos perfis
- [x] Limitar detail de auditoria a 16384 bytes sem alterar RLS; acrescentar aviso da chave pessoal em pt/en/es e verificar regressões.
- [x] Verificar os ajustes de ecrã e fluidez pedidos: sessão autenticada em 1280, 360 e 320 px, ambas as barras visíveis após deslocação, pesquisa com atraso de 150 ms e sem erros no navegador.
- [x] Aplicar privilégios por coluna, função administrativa e metadados seguros no registo.
- [x] Ajustar registo, suspensão e aviso de exclusão no app.
- [x] Bloquear contas suspensas no Tutor e pesquisa; verificar regressões.

# Instalação PWA
- [x] Configurar cache offline controlada preservando lembretes push.
- [x] Verificar manifesto, ícones, pedido de instalação e instruções iOS no navegador.
- [ ] Validar instalação nativa e abertura offline após publicação em dispositivos reais — depende da publicação e de teste num dispositivo.

# Tutor
- [x] Corrigir e verificar geração, recuperação e conclusão de casos clínicos na conta de administrador autenticada.
- [x] Retirar a quota de utilização do Tutor sem alterar os outros limites ou o acesso pago.
- [x] Guardar memória e conversas por aluno; limpar apenas a conversa visível.
- [x] Perguntar e guardar o nome preferido ao iniciar o app.
- [x] Verificar conversa, limpeza e recuperação após recarregar.

# Biblioteca e Tutor
- [x] Otimizar pesquisa intermitente e verificar resposta real do Tutor.
- [x] Confirmar número de contas de administrador e duplicação do e-mail.
- [x] Preparar automaticamente livros e mostrar progresso e erros.
- [x] Pesquisar toda a biblioteca nas perguntas do Tutor com fontes e explicações estruturadas.
- [x] Acrescentar índice interativo e ampliação no leitor.
- [x] Verificar preparação, resposta com fontes e navegação/ampliação.
# Assinatura no servidor
- [x] has_access nas regras de livros, trechos e ficheiros; 402 no Tutor e na pesquisa; bloqueio no app; CORS Android.

# Respostas progressivas do Tutor
- [x] Implementar streaming opcional no servidor e apresentação progressiva no app, preservando fontes e memória.
- [x] Verificar falhas, CORS e compatibilidade JSON; testar perguntas com administrador autenticado (30 atualizações com livros, 3 na pergunta simples; JSON 200 sem stream).

# Scripts externos com SRI
- [x] Fixar cliente externo na versão instalada e aplicar hashes SHA-384 reais aos quatro scripts.
- [x] Acrescentar aviso de falha de carregamento e preservar cache da dependência com URL fixa.
- [x] Verificar arranque sem erros, sessão administrativa após recarregar, PDF oficial de 299 páginas, EPUB local no leitor e aviso com CDN bloqueado; oito testes passaram. Pré-visualização sem worker nem cache; HTML publicado usa NetworkFirst, sem pré-cache.
- [ ] Verificar EPUB oficial — a biblioteca contém apenas seis PDFs; EPUB local verificado sem gravação no backend.
