# Geração de temas dentro do BK-CIRURGIA

## Objetivo
Permitir que **só o administrador** gere temas dentro do app segundo o documento «PROMPT MESTRE — BK-CIRURGIA 3.0», sem preparar código fora do app e sem substituir os conteúdos existentes.

## Experiência do administrador
1. Na administração, abrir **Gerar tema**, indicar o assunto e, opcionalmente, livros ou edição prioritários.
2. Consultar um inventário da Biblioteca Oficial: livros preparados, livros incompletos e limitações de acesso.
3. Iniciar a pesquisa e acompanhar as etapas: fontes, matriz de cobertura, plano de abas, redação e verificações. Guardar o progresso para continuar depois de uma interrupção, sem apresentar texto cortado como tema concluído.
4. Abrir o rascunho no leitor, rever as fontes, lacunas e divergências e corrigir o conteúdo antes de o disponibilizar aos alunos.
5. Disponibilizar o tema apenas por uma ação explícita do administrador. Os alunos veem os temas disponibilizados em Estudos; os rascunhos ficam restritos à administração.

## Aplicação do documento
- Manter o documento integral como regra de geração no servidor, adaptando o formato de saída ao app sem eliminar os seus campos semânticos.
- Usar exclusivamente informações clínicas recuperadas da Biblioteca Oficial. Não completar lacunas com conhecimento genérico da IA.
- Pesquisar o assunto e os termos relacionados por livro, recuperar o contexto necessário e registar a origem dos trechos utilizados.
- Produzir matriz de cobertura e plano pedagógico antes da redação; gerar por etapas para não tentar encaixar um módulo inteiro numa única resposta.
- Incluir abertura e aviso educacional, desenvolvimento, tabelas pertinentes, caso fictício de nove etapas, mapa mental, flashcards e quiz com explicações de todas as alternativas.
- Registar pendências e limitações reais. Uma validação estrutural não equivale a revisão médica nem prova que todo o livro foi consultado.
- **Compatibilidade com a tua preferência anterior:** reunir as listas de fontes numa única aba Referências, organizadas por aba de origem. As afirmações clínicas mantêm ligações à respetiva referência, sem repetir listas bibliográficas no fim de cada aula.

## Leitura e cópia
- Preservar quadros, textos justificados, tamanho de letra escolhido nas definições e deslocação de tabelas sem mudar de aba.
- Acrescentar apresentações próprias para flashcards, mapa mental e rastreabilidade, sem alterar os temas antigos.
- Disponibilizar cópia da aba, módulo, flashcards e quiz em Markdown, com alternativa selecionável se o navegador impedir a cópia.
- Permitir exportação de JSON e Markdown coerentes com o conteúdo apresentado.
- Não apresentar sugestões de imagem como imagens existentes; mostrar apenas imagens disponíveis e verificadas ou diagramas fundamentados no conteúdo.

## Segurança e preservação
- Confirmar a sessão e a autorização administrativa no servidor em cada operação de geração e alteração; não confiar no botão visível nem em dados guardados no navegador.
- Guardar rascunhos e versões no Lovable Cloud, com acesso dos alunos apenas a temas disponibilizados e respeitando a assinatura existente.
- Não modificar login, pagamentos, regras administrativas atuais, conteúdos curados já existentes nem o funcionamento geral do Tutor e dos casos clínicos.
- Não publicar o app nesta implementação.

## Detalhes técnicos
- Acrescentar armazenamento de módulos, fontes recuperadas e progresso de geração, com privilégios explícitos e políticas de acesso. Manter a verificação administrativa existente, sem alterar `is_platform_admin()`.
- Criar operações autenticadas próprias para pesquisa, geração por etapa, validação, gravação e disponibilização; reutilizar o acesso à biblioteca sob as permissões do utilizador.
- Guardar estados e limites de trabalho por etapa, impedir execução simultânea sobre o mesmo rascunho e pausar em erros de créditos, autorização ou resposta interrompida. Não repetir automaticamente pedidos recusados.
- Validar o contrato JSON e as ligações entre abas, referências, quiz e matriz. Renderizar conteúdo gerado de forma segura, sem executar JavaScript ou HTML arbitrário produzido pela IA.
- Integrar os módulos disponibilizados no catálogo e na pesquisa de Estudos, mantendo os ficheiros de temas existentes como origem independente. Os temas antigos não serão regenerados automaticamente.
- A ligação dos novos temas à memória do Tutor ou ao gerador independente de casos clínicos não faz parte desta alteração: ambos continuam a consultar a Biblioteca Oficial como antes.

## Verificações
- Testar que um aluno não consegue gerar, editar ou ler rascunhos; o administrador consegue retomar e disponibilizar temas.
- Testar ausência de fontes, livros incompletos, referências inexistentes, interrupções, cancelamento e falhas da IA.
- Testar concretamente as nove etapas do caso, a indexação de respostas do quiz, coerência das referências e integridade da cópia.
- Verificar com sessão administrativa um tema real: pesquisa, rascunho, leitura e recuperação após recarregar; verificar o acesso de um aluno a um tema disponibilizado.
- Verificar apresentação em telemóvel e computador e atualizar o roadmap com resultados e limitações.

## Limitação importante
O app pode exigir referências, conferir a existência das localizações recuperadas e mostrar verificações pendentes. Não pode garantir automaticamente que todas as afirmações médicas estão corretas nem declarar leitura integral com base em poucos trechos de pesquisa. A revisão do administrador permanece necessária antes de disponibilizar um tema.