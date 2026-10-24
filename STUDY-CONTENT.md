# Como colocar os teus temas em Estudos

## O lugar fixo no GitHub

Abre **`public/temas/`** no GitHub. Cada subtema tem o seu ficheiro: `asepsia.js`, `choque.js`, `pneumotorax.js`, etc. Abre apenas o ficheiro do tema que queres adicionar, clica no lápis e cola o módulo completo abaixo do comentário. Guarda no ramo ligado ao Lovable e pede a verificação antes de publicar.

Mantém a linha `window.BK_CONTENT = window.BK_CONTENT || {};`. Cola **apenas um tema por ficheiro**, com a chave e o `topic.id` iguais ao nome do ficheiro (sem `.js`). Cola apenas JavaScript, sem cercas de código nem tags `<script>`. Asepsia já está completo em `public/temas/asepsia.js`; os restantes ficheiros são espaços vazios que não substituem os conteúdos antigos enquanto não forem preenchidos.

Cada bloco deve ter este formato:

```js
window.BK_CONTENT['asepsia'] = {
  topic: {
    id: 'asepsia',
    eyebrow: 'Tema III · Introdução aos Procedimentos Cirúrgicos',
    title: 'Asepsia, antissepsia e instrumental',
    sub: 'Coloca aqui a introdução que já preparaste.',
    tags: [],
    stats: [],
    tabs: [
      { id: 'inicio', label: 'Início', type: 'hero' },
      {
        id: 'conteudo', label: 'Conteúdo', type: 'sections',
        sections: [{ h: 'Título da secção', t: '<p>Coloca aqui o teu conteúdo completo.</p>' }]
      }
    ]
  },
  terms: {}
};
```

O exemplo mostra apenas o formato; **não substitui o teu módulo completo**. Se o teu código já usa `window.BK_CONTENT['asepsia'] = { topic: ..., terms: ... }`, cola-o tal como está. Não precisas de voltar a editar `app.html`, `TOPICS`, `TERMS` ou o estado do catálogo.

## O que acontece automaticamente

- O `id` liga o conteúdo ao subtema do mesmo nome e torna-o **PRONTO**.
- As abas abrem em Estudos, com os leitores, exercícios e casos já existentes.
- O conteúdo e os termos entram na pesquisa e no glossário.
- Os temas antigos continuam intactos. Um `id` existente substitui apenas esse tema durante o carregamento; usa IDs diferentes para conteúdos diferentes.
- Conteúdo com formato incompleto é ignorado, mantendo os outros temas. Cada ficheiro é carregado separadamente: um erro de sintaxe nele não impede os outros de carregar. A validação não protege contra JavaScript arbitrário que altere outros dados; cola apenas os teus módulos de dados confiáveis.

## Subtemas que já existem no catálogo

Usa exatamente um destes IDs:

`pre-operatorio`, `trans-operatorio`, `pos-operatorio`, `choque`, `pvc`, `abordagem-venoso`, `hidratacao`, `hidroeletrolitico`, `hemorragia-transfusao`, `asepsia`, `paroniquia`, `tce`, `torax-batiente`, `pneumotorax`, `hemotorax`, `tamponamento`, `inflamacao`, `cistos`, `tumores-pele`, `tumores-osseos`, `mama`, `tireoide`, `hernia-inguinal`, `hernia-umbilical`, `hernia-incisional`, `disfagia`, `litiase`, `sangramento-digestivo`, `fissura-hemorroidas`, `abdomen-agudo`, `vascular-periferico`.

Para um subtema novo fora desta lista, cria `public/temas/novo-id.js`, acrescenta `'novo-id'` à lista de `public/temas/lista.js` e acrescenta ao bloco, ao lado de `topic` e `terms`:

```js
catalog: { n: 'III', title: 'Introdução aos Procedimentos Cirúrgicos' }
```

O número liga-o ao grupo existente. Se esse número ainda não existir, cria um grupo com o título fornecido. Usa IDs compostos por letras minúsculas sem acentos, números e hífen. O `topic.id` deve ser igual à chave de `BK_CONTENT`.

## Abas suportadas

## Apresentação e imagens

Todos os temas preservam os quadros, usam textos justificados e tabelas cuidadas. Parágrafos que contêm apenas `Fonte: ...` são reunidos numa única aba Referências do tema, com as secções correspondentes. Também podes acrescentar `references: ['Referência completa']` ao objeto `topic`.

Nas secções de uma lição, usa `image: { src: '/caminho/da-imagem.jpg', alt: 'Descrição acessível', caption: 'Legenda' }` para uma imagem existente. As imagens abrem ampliadas. Os antigos textos em `image` deixam de ser sugestões visíveis: quando existe ilustração adequada, ela aparece; nos restantes casos aparece um diagrama com os dados da própria secção. Uma imagem indisponível não deixa uma caixa vazia no leitor.

## Estrutura das abas

- `hero`: usa o título, introdução, `tags` e `stats` do tópico.
- `sections`: `sections: [{ h, t }]`; tabela opcional `{ title, rows }`.
- `lesson`: `intro: { why, where, importance, applications }`, `objectives`, `sections: [{ title, explanation, example, summary }]`, `exercises`, `review: { mindMap: [{ root, children }], summary, keywords }` e `connection`.
- `quiz`: `questions: [{ q, options, correct, explain }]`.
- `case`: `steps: [{ tag, title, body }]`.
- `checklist`: `groups: [{ letter, color, title, body }]`.
- `accordion`: `items: [{ title, body, extra }]`.

Cada aba precisa de `id` único dentro do tópico, `label` e `type`. Exercícios usam `{ level, q, options, correct, explain }`; `correct` conta a partir de **0**, e `level` usa `facil`, `medio` ou `dificil`. Há no máximo uma aba `case` e uma aba `quiz` por tópico, conforme o leitor atual. Cada termo usa `{ name, defSimple, defAcademic, example }`, com `curiosity` e `related` opcionais.

Este é conteúdo curado por ti no repositório: não coloques código de origem não confiável, pois JavaScript e HTML são executados/apresentados pelo app. A validação verifica compatibilidade, não a exatidão médica nem se o texto está completo.

## Verificação opcional no computador

```sh
node --check public/temas/choque.js
node --test tests/study-topics.test.js tests/study-topic-files.test.js
```

O ficheiro antigo `public/topic-asepsia.js` permanece intocado e não é carregado: está truncado. As partes 1–4 também permanecem intactas. O módulo completo de Asepsia foi transferido sem alterações para `public/temas/asepsia.js`; não é necessário voltar a colá-lo. Já não se usa `public/study-topics.js`.