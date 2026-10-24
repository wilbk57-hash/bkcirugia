/* BK-CIRURGIA — ficheiro exclusivo do tema Asepsia.
   Consulte STUDY-CONTENT.md na raiz do projeto para o formato e exemplos.
   Mantenha apenas window.BK_CONTENT['asepsia'] = { topic, terms }.
   Não cole as tags <script> nem apague a inicialização seguinte. */
window.BK_CONTENT = window.BK_CONTENT || {};

// COLE OS TEUS TEMAS COMPLETOS A PARTIR DAQUI.

/* Asepsia — conteúdo completo das quatro partes, sem alterações aos dados. */
window.BK_CONTENT['asepsia'] = {
  "topic": {
    "id": "asepsia",
    "eyebrow": "Tema III · Introdução aos Procedimentos Cirúrgicos",
    "title": "Asepsia, antissepsia e instrumental",
    "sub": "Como evitar a infecção no centro cirúrgico: da lavagem das mãos à esterilização do instrumental — conceitos, história, técnicas, antissépticos e desinfetantes, a partir do texto-base cubano “Asepsia y antisepsia”.",
    "tags": [
      {
        "label": "Assepsia: meios físicos",
        "cls": "tag-teal"
      },
      {
        "label": "Antissepsia: tecido vivo",
        "cls": "tag-amber"
      },
      {
        "label": "Esterilização: nenhum agente vivo",
        "cls": "tag-red"
      }
    ],
    "stats": [
      {
        "num": "6",
        "label": "Termos que não se confundem"
      },
      {
        "num": "3",
        "label": "Níveis de desinfecção"
      },
      {
        "num": "3",
        "label": "Categorias de Spaulding"
      },
      {
        "num": "20",
        "label": "Trocas de ar/h no centro cirúrgico (mínimo)"
      }
    ],
    "tabs": [
      {
        "id": "inicio",
        "label": "🏠 Início",
        "type": "hero"
      },
      {
        "id": "conceitos",
        "label": "📘 Conceitos",
        "type": "lesson",
        "intro": {
          "why": "Antissepsia, assepsia, desinfecção e esterilização parecem sinônimos — e confundi-los é um dos erros mais comuns em provas e na prática. Cada termo tem alvo, agente e nível de ação próprios.",
          "where": "No centro cirúrgico, na central de esterilização e em qualquer procedimento em que a pele, as mãos ou o instrumental precisam ser preparados.",
          "importance": "Decidir entre limpar, desinfetar ou esterilizar depende de como o material entra em contato com o paciente. Preparar para menos do que o necessário expõe o paciente à infecção.",
          "applications": "Toda a equipe cirúrgica e de enfermagem usa essa classificação ao decidir como preparar instrumental, aparelhos, superfícies e a própria pele."
        },
        "objectives": [
          "Definir antissepsia, assepsia, descontaminação, limpeza, desinfecção e esterilização sem confundir os termos",
          "Distinguir os três níveis de desinfecção (alto, intermediário e baixo) e citar um exemplo de cada",
          "Classificar um artigo como crítico, semicrítico ou não crítico (Spaulding) e dizer o que cada categoria exige",
          "Explicar por que a desinfecção de alto nível não substitui a esterilização"
        ],
        "sections": [
          {
            "title": "Seis termos que se confundem",
            "explanation": "<p>Seis palavras aparecem o tempo todo no centro cirúrgico, e cada uma descreve uma ação diferente. Comece pelas três que tratam de <strong>combater ou reduzir</strong> os germes:</p><ul><li><strong><span class='term' data-term='antissepsia'>Antissepsia</span></strong>: método para combater a infecção com substâncias químicas aplicadas ao tecido vivo, que previnem o crescimento de micro-organismos ou inibem sua atividade.</li><li><strong><span class='term' data-term='assepsia'>Assepsia</span></strong>: destruição de todos os germes capazes de produzir infecção, geralmente por meios físicos (calor, filtros de asbesto, fluxo laminar, ultrassom, radiações). Os métodos assépticos vêm substituindo os de antissepsia.</li><li><strong><span class='term' data-term='descontaminacao'>Descontaminação</span></strong>: procedimento para diminuir a carga bacteriana de objetos supostamente contaminados, garantindo seu manejo seguro, com substâncias de efeito biocida reconhecido.</li></ul><p><em>Fonte: T-I, Cap. 28, pp. 421–422.</em></p>",
            "example": "Passar solução antisséptica na pele do paciente antes da incisão é antissepsia (químico em tecido vivo). Levar a pinça à autoclave é um método asséptico por meio físico (calor).",
            "summary": "Antissepsia usa químicos em tecido vivo; assepsia elimina germes, geralmente por meios físicos; descontaminação reduz a carga bacteriana para que o objeto possa ser manejado com segurança.",
            "image": "Duas cenas lado a lado: mão aplicando antisséptico na pele (antissepsia) e bandeja de instrumentos entrando na autoclave (assepsia)"
          },
          {
            "title": "Limpeza, desinfecção e esterilização",
            "explanation": "<p>As outras três palavras formam uma <strong>escada de intensidade</strong> — da remoção da sujeira até a ausência total de agentes vivos:</p><ul><li><strong><span class='term' data-term='limpeza'>Limpeza</span></strong>: eliminação de material estranho (pó, terra, restos orgânicos) da superfície inerte ou viva; água, sabão ou detergente e secagem são a base do processo.</li><li><strong><span class='term' data-term='desinfeccao'>Desinfecção</span></strong>: ação letal sobre micro-organismos, em três níveis (veja a próxima seção).</li><li><strong><span class='term' data-term='esterilizacao'>Esterilização</span></strong>: processo que não admite a presença de agentes biológicos vivos capazes de se reproduzir; atividade bactericida aplicada ao instrumental usado em manobra crítica sobre tecido estéril.</li></ul><p><em>Fonte: T-I, Cap. 28, pp. 421–422.</em></p>",
            "example": "Um instrumental sujo de sangue chega à central: primeiro a limpeza com água e detergente; só depois a desinfecção ou a esterilização, conforme o uso do instrumento.",
            "summary": "Limpar remove a sujeira; desinfetar mata micro-organismos em três níveis; esterilizar não deixa nenhum agente vivo capaz de se reproduzir.",
            "note": {
              "type": "tip",
              "text": "Sempre que o material estiver sujo, a primeira palavra é <strong>limpeza</strong>: nenhuma desinfecção funciona bem sobre sangue ou restos orgânicos."
            }
          },
          {
            "title": "Os três níveis de desinfecção",
            "explanation": "<p>A desinfecção é uma ação letal sobre micro-organismos, mas não é uma coisa só: ela tem <strong>três níveis</strong>, conforme o que consegue eliminar.</p><p>Quanto mais alto o nível, mais tipos de micro-organismo a solução alcança — mas só a esterilização elimina <em>todos</em> os agentes vivos.</p><p><em>Fonte: T-I, Cap. 28, pp. 421–422.</em></p>",
            "example": "O álcool etílico a 70% e o hipoclorito de sódio são exemplos de nível intermediário; o glutaraldeído a 2% é o exemplo de alto nível.",
            "summary": "Alto nível (ex.: glutaraldeído 2%), intermediário (hipoclorito de sódio, álcool 70%) e baixo (amônio quaternário). Nenhum deles equivale à esterilização.",
            "table": {
              "title": "Níveis de desinfecção",
              "rows": [
                [
                  "Alto nível",
                  "Atua sobre bactérias, fungos e algumas esporas. Exemplo: glutaraldeído a 2%."
                ],
                [
                  "Nível intermediário",
                  "Atua sobre formas vegetativas, exceto esporos. Exemplos: hipoclorito de sódio, álcool etílico a 70%."
                ],
                [
                  "Baixo nível",
                  "Atua sobre bactérias vegetativas e alguns vírus. Exemplo: amônio quaternário a 0,1–0,2%."
                ]
              ]
            },
            "boxes": [
              {
                "variant": "red",
                "label": "⚠️ Armadilha",
                "text": "A desinfecção de alto nível <strong>não substitui a esterilização</strong>: mata quase tudo, mas “quase” não é “nada” — e “nada” é o que a esterilização exige."
              }
            ]
          },
          {
            "title": "Classificação de Spaulding",
            "explanation": "<p>A classificação de <span class='term' data-term='spaulding'>Spaulding</span> organiza os artigos hospitalares pelo <strong>risco de infecção conforme o contato com o paciente</strong>, e diz o que cada categoria exige.</p><p>Diante de qualquer material, a pergunta-guia é: <em>onde ele vai tocar o paciente?</em></p><p><em>Fonte: T-I, Cap. 28, p. 421.</em></p>",
            "example": "Um cistoscópio flexível (semicrítico) não pode ir à autoclave por causa das fibras ópticas; como a esterilização não é viável, aplica-se a desinfecção de alto nível.",
            "summary": "Crítico = sempre estéril; semicrítico = livre de formas vegetativas, de preferência estéril (senão, desinfecção de alto nível); não crítico = limpeza e secagem, às vezes desinfecção de baixo nível.",
            "image": "Três círculos concêntricos: crítico (dentro do corpo), semicrítico (mucosas) e não crítico (pele íntegra)",
            "table": {
              "title": "Artigos por uso no paciente",
              "rows": [
                [
                  "Críticos",
                  "Acessam cavidades normalmente estéreis do organismo. Exigência: sempre estéreis."
                ],
                [
                  "Semicríticos",
                  "Entram em contato com pele não íntegra ou mucosas. Exigência: livres de formas vegetativas; de preferência estéreis; se não for viável, desinfecção de alto nível."
                ],
                [
                  "Não críticos",
                  "Contato com pele íntegra ou sem contato com o paciente. Exigência: limpeza e secagem; às vezes, desinfecção de baixo nível."
                ]
              ]
            }
          }
        ],
        "exercises": [
          {
            "level": "facil",
            "q": "Segundo a classificação de Spaulding, qual categoria de artigos deve ser sempre estéril?",
            "options": [
              "Não críticos",
              "Semicríticos",
              "Críticos",
              "Nenhuma: todos admitem apenas limpeza"
            ],
            "correct": 2,
            "explain": "Artigos críticos acessam cavidades normalmente estéreis do organismo e devem ser sempre estéreis. Semicríticos podem receber desinfecção de alto nível se a esterilização não for viável; não críticos exigem limpeza e secagem (às vezes, desinfecção de baixo nível)."
          },
          {
            "level": "medio",
            "q": "Qual dos exemplos abaixo corresponde à desinfecção de alto nível?",
            "options": [
              "Glutaraldeído a 2%",
              "Álcool etílico a 70%",
              "Amônio quaternário a 0,1–0,2%",
              "Água e sabão"
            ],
            "correct": 0,
            "explain": "O glutaraldeído a 2% é o exemplo de alto nível. O álcool etílico a 70% está no nível intermediário; o amônio quaternário a 0,1–0,2%, no baixo nível; água e sabão fazem limpeza, não desinfecção."
          },
          {
            "level": "dificil",
            "q": "Qual termo descreve o procedimento que diminui a carga bacteriana de objetos supostamente contaminados, para que possam ser manejados com segurança?",
            "options": [
              "Esterilização",
              "Antissepsia",
              "Limpeza",
              "Descontaminação"
            ],
            "correct": 3,
            "explain": "Descontaminação: diminui a carga bacteriana de objetos supostamente contaminados, garantindo seu manejo seguro, com substâncias de efeito biocida reconhecido. A esterilização elimina todos os agentes vivos; a antissepsia atua em tecido vivo; a limpeza remove material estranho."
          }
        ],
        "review": {
          "mindMap": [
            {
              "root": "Combater e reduzir germes",
              "children": [
                "Antissepsia: químicos aplicados a tecido vivo",
                "Assepsia: eliminação de germes, geralmente por meios físicos",
                "Descontaminação: reduz a carga bacteriana para manejo seguro"
              ]
            },
            {
              "root": "Escada de intensidade",
              "children": [
                "Limpeza: tira a sujeira (água, sabão ou detergente, secagem)",
                "Desinfecção: ação letal em três níveis (alto, intermediário, baixo)",
                "Esterilização: nenhum agente vivo capaz de se reproduzir"
              ]
            },
            {
              "root": "Spaulding",
              "children": [
                "Críticos: sempre estéreis",
                "Semicríticos: estéreis ou desinfecção de alto nível",
                "Não críticos: limpeza e secagem"
              ]
            }
          ],
          "summary": "Seis termos, seis ações: antissepsia (químicos em tecido vivo), assepsia (germes eliminados, em geral por meios físicos), descontaminação, limpeza, desinfecção (três níveis) e esterilização. A classificação de Spaulding decide o preparo pelo contato do artigo com o paciente — e a desinfecção de alto nível nunca substitui a esterilização.",
          "keywords": [
            "Antissepsia",
            "Assepsia",
            "Descontaminação",
            "Limpeza",
            "Desinfecção",
            "Esterilização",
            "Spaulding"
          ]
        },
        "connection": "Você já distingue os termos e sabe classificar os artigos. A próxima aba conta como a cirurgia chegou a essas ideias — de Semmelweis a Halsted."
      },
      {
        "id": "historico",
        "label": "🏛️ Histórico",
        "type": "lesson",
        "intro": {
          "why": "A antissepsia e a assepsia nasceram de observações simples — lavar as mãos, ferver instrumentos — que levaram décadas para serem aceitas. Conhecer a sequência explica por que cada rotina do centro cirúrgico existe.",
          "where": "Na compreensão dos princípios do centro cirúrgico e nas questões de prova sobre o tema.",
          "importance": "Cinco nomes resolvem a maior parte das questões: Semmelweis (lavagem das mãos), Pasteur (teoria dos germes), Lister (antissepsia com ácido fênico), Von Bergman (assepsia pelo vapor) e Halsted (luvas de borracha). Fixar a ordem cronológica evita trocar quem fez o quê.",
          "applications": "Lavar as mãos, esterilizar o instrumental, usar luvas e máscara: cada rotina atual tem uma origem histórica identificável."
        },
        "objectives": [
          "Explicar como Semmelweis, Pasteur, Lister e Von Bergman mudaram a história da cirurgia",
          "Ordenar cronologicamente os marcos da antissepsia e da assepsia",
          "Associar cada personagem à sua contribuição (água clorada, teoria dos germes, ácido fênico, esterilização a vapor, luvas de borracha)",
          "Reconhecer os personagens citados no contexto cubano: Sklifosovski, Varela e Núñez Palomino"
        ],
        "sections": [
          {
            "title": "Da Antiguidade à anestesia",
            "explanation": "<p>Desde a Antiguidade há sinais de cuidados que hoje chamamos de assépticos. Mas foi a chegada da <strong>anestesia</strong>, em 1846, que mudou o jogo: cirurgias mais longas e elaboradas e, sem antissepsia, muito mais infecção.</p><p><em>Fonte: T-I, Cap. 28, pp. 419–422.</em></p>",
            "example": "Ferver instrumentos (Galeno) e separar os pacientes sépticos dos demais (Pirogov) são ideias antigas que reaparecem na esterilização e no isolamento de hoje.",
            "summary": "Hipócrates, Galeno e Pirogov já aplicavam ideias de assepsia; a anestesia (Morton, 1846) permitiu cirurgias maiores — e mais infecções onde faltava antissepsia.",
            "image": "Linha do tempo horizontal: Hipócrates → Galeno → Pirogov → Morton (anestesia, 1846)",
            "table": {
              "title": "Primeiros passos",
              "rows": [
                [
                  "460–377 a.C. · Hipócrates de Cós",
                  "“Previu” a assepsia ao recomendar vinho ou água fervida para lavar feridas."
                ],
                [
                  "131–200 d.C. · Galeno",
                  "Fervia os instrumentos usados para atender gladiadores feridos."
                ],
                [
                  "1841 · Nicolás Pirogov",
                  "Cirurgião russo; criou em sua clínica de Petersburgo uma seção especial para pacientes sépticos, para prevenir infecção intra-hospitalar; usava tintura de iodo e soluções de cloreto de cálcio e nitrato de prata."
                ],
                [
                  "1846 · William Morton",
                  "Início do uso da anestesia — permitiu cirurgias mais elaboradas (e mais infecções, na ausência de antissepsia)."
                ]
              ]
            }
          },
          {
            "title": "Semmelweis e Pasteur: de onde vem a infecção",
            "explanation": "<p>Dois passos mudaram a pergunta de “por que a ferida infecciona?” para “que germe a infectou?”. Semmelweis percebeu o padrão na prática; Pasteur forneceu a teoria que o explicaria.</p><p><em>Fonte: T-I, Cap. 28, pp. 419–422.</em></p>",
            "example": "Médicos que saíam da necrópsia e atendiam partos tinham contato com as parturientes; a água clorada nas mãos interrompia esse caminho e fez a mortalidade cair cerca de 1/3.",
            "summary": "Semmelweis (1847–1851) ligou a mortalidade puerperal às necrópsias e impôs a lavagem das mãos com água clorada; Pasteur mostrou que germes causam fermentação e putrefação e derrubou o “pus louvável”.",
            "table": {
              "title": "Marcos",
              "rows": [
                [
                  "1847–1851 · Ignaz Semmelweis",
                  "No Allgemein Krankenhaus de Viena, associou a alta mortalidade puerperal ao contato dos médicos com necrópsias; instituiu a lavagem das mãos com água clorada e reduziu a mortalidade em cerca de 1/3. Foi rejeitado pela comunidade médica da época."
                ],
                [
                  "Séc. XIX · Louis Pasteur",
                  "Demonstrou que fermentação e putrefação vêm de germes que se multiplicam — não de geração espontânea. Derrubou a ideia do “pus louvável” como parte normal da cura."
                ]
              ]
            },
            "note": {
              "type": "tip",
              "text": "Semmelweis foi rejeitado na época. A ideia certa nem sempre é aceita de imediato — e a evidência precisa ser sustentada."
            }
          },
          {
            "title": "Lister e Koch: antissepsia e prova",
            "explanation": "<p>Estimulado por Pasteur, Lister levou a teoria dos germes à sala de cirurgia com <strong>antissépticos químicos</strong>. Koch, por sua vez, ligou micro-organismos específicos a doenças específicas.</p><p><em>Fonte: T-I, Cap. 28, pp. 419–422.</em></p>",
            "example": "O “listerismo”: ácido fênico (carbólico) nos curativos e pulverização do ar do centro cirúrgico com solução antisséptica.",
            "summary": "Lister (1867) = antissepsia com ácido fênico; Koch (1876–1881) = postulados e esterilização a vapor de utensílios de laboratório.",
            "table": {
              "title": "Marcos",
              "rows": [
                [
                  "1867 · Joseph Lister",
                  "Estimulado por Pasteur, usou ácido fênico (carbólico) em curativos e pulverizou o ar do centro cirúrgico com solução antisséptica (“listerismo”). Reduziu infecções de 90% para 10%. Publicou “Princípios antissépticos na prática cirúrgica”."
                ],
                [
                  "1876–1881 · Robert Koch",
                  "Cultivou o Bacillus anthracis e formulou os 4 postulados que relacionam micro-organismo e doença específica; aplicou a esterilização a vapor a utensílios de laboratório desde 1881."
                ]
              ]
            },
            "boxes": [
              {
                "variant": "blue",
                "label": "🔢 Números que marcaram época",
                "text": "Antes da teoria dos germes: 80–90% dos operados desenvolviam infecção. Após Semmelweis (1851) e Lister (1867): a sepse pós-cirúrgica cai para 30–35%. Com autoclave a vapor, avental, gorro e luvas de borracha (Halsted): a taxa cai ainda mais."
              }
            ]
          },
          {
            "title": "Assepsia: Von Bergman, Halsted e Fleming",
            "explanation": "<p>Se Lister combatia os germes com químicos, Von Bergman passou a <strong>impedir que eles chegassem</strong>: esterilizar tudo com vapor. É daí que vem o conceito de assepsia.</p><p>Halsted completou o quadro com luvas e máscara, e Fleming trouxe o primeiro antibacteriano eficaz.</p><p><em>Fonte: T-I, Cap. 28, pp. 419–422.</em></p>",
            "example": "Esterilizar o instrumental e vestir avental, gorro, máscara e luvas: rotinas que vêm de Von Bergman e de Halsted.",
            "summary": "Von Bergman (1886) = esterilização a vapor e conceito de assepsia; Heidenreich e Redar = vapor sob pressão e autoclave; Halsted (1890) = luvas de borracha e máscara de gaze; Fleming = penicilina.",
            "table": {
              "title": "Marcos",
              "rows": [
                [
                  "1878–1886 · Ernest Von Bergman",
                  "Professor em Würzburg; introduziu em 1886 a esterilização a vapor de todo o instrumental e material cirúrgico — nasce o conceito de assepsia (eliminar germes por esse processo). Também introduziu o uso de roupa branca e limpa nas operações."
                ],
                [
                  "1884–1886 · Heidenreich e Redar",
                  "Heidenreich demonstrou (1884) que o vapor sob pressão esteriliza melhor; o cirurgião francês Redar propôs (1886) o uso da autoclave."
                ],
                [
                  "1890 · William Halsted",
                  "Cirurgião norte-americano; valorizou a manipulação delicada dos tecidos e a hemostasia cuidadosa; introduziu as luvas de borracha em cirurgia e o uso da máscara de gaze."
                ],
                [
                  "Séc. XX · Alexander Fleming",
                  "Observou uma zona de inibição de Staphylococcus numa placa e nomeou a substância ativa penicilina — primeiro antibacteriano eficaz."
                ]
              ]
            },
            "note": {
              "type": "tip",
              "text": "Para fixar a ordem: Semmelweis (1847) → Lister (1867) → Von Bergman (1886) → Halsted (1890)."
            }
          },
          {
            "title": "Personagens do contexto cubano",
            "explanation": "<p>O texto-base cubano cita três personagens ligados à antissepsia e à epidemiologia hospitalar:</p><ul><li><strong>Nikolai Sklifosovski (1836–1904)</strong>: cirurgião russo que introduziu a assepsia e a antissepsia em seu país e contribuiu para a cirurgia abdominal e militar.</li><li><strong>Félix Varela</strong>: precursor cubano da epidemiologia hospitalar; propôs um aparelho para purificar o ar de salas e corredores de hospitais.</li><li><strong>Enrique Núñez Palomino</strong>: coronel de saúde do exército libertador cubano; desinfetava feridas com iodofórmio ou aristol e as cobria com gaze antisséptica.</li></ul><p><em>Fonte: T-I, Cap. 28, pp. 419–422.</em></p>",
            "example": "A preocupação de Varela com o ar das salas hospitalares reaparece hoje no controle do ar do centro cirúrgico (pressão positiva e trocas de ar por hora).",
            "summary": "Sklifosovski levou a assepsia e a antissepsia à Rússia; Varela propôs purificar o ar hospitalar; Núñez Palomino desinfetava feridas com iodofórmio ou aristol."
          }
        ],
        "exercises": [
          {
            "level": "facil",
            "q": "O que William Halsted introduziu em cirurgia, em 1890?",
            "options": [
              "Ácido fênico nos curativos",
              "Luvas de borracha e máscara de gaze",
              "A esterilização a vapor do instrumental",
              "A água clorada para lavar as mãos"
            ],
            "correct": 1,
            "explain": "Halsted introduziu as luvas de borracha e o uso da máscara de gaze. O ácido fênico é de Lister; a esterilização a vapor, de Von Bergman; a água clorada, de Semmelweis."
          },
          {
            "level": "medio",
            "q": "O que Joseph Lister fez em 1867?",
            "options": [
              "Iniciou o uso da anestesia e permitiu cirurgias mais elaboradas",
              "Propôs o uso da autoclave para esterilizar o instrumental",
              "Usou ácido fênico nos curativos e pulverizou o ar da sala com antisséptico",
              "Formulou os 4 postulados que relacionam micro-organismo e doença"
            ],
            "correct": 2,
            "explain": "Lister, estimulado por Pasteur, usou ácido fênico (carbólico) em curativos e pulverizou o ar do centro cirúrgico (“listerismo”). A anestesia é de Morton (1846); a autoclave foi proposta por Redar; os postulados são de Koch."
          },
          {
            "level": "dificil",
            "q": "Qual é a ordem cronológica correta destes marcos?",
            "options": [
              "Lavagem das mãos com água clorada → teoria dos germes → esterilização a vapor → luvas de borracha",
              "Esterilização a vapor → lavagem das mãos com água clorada → luvas de borracha → teoria dos germes",
              "Luvas de borracha → lavagem das mãos com água clorada → teoria dos germes → esterilização a vapor",
              "Teoria dos germes → luvas de borracha → lavagem das mãos com água clorada → esterilização a vapor"
            ],
            "correct": 0,
            "explain": "Semmelweis (1847–1851, água clorada) → Pasteur (teoria dos germes) → Von Bergman (1886, esterilização a vapor) → Halsted (1890, luvas de borracha)."
          }
        ],
        "review": {
          "mindMap": [
            {
              "root": "Primeiras ideias",
              "children": [
                "Hipócrates: vinho ou água fervida nas feridas",
                "Galeno: instrumentos fervidos",
                "Pirogov: seção para pacientes sépticos"
              ]
            },
            {
              "root": "Teoria dos germes e antissepsia",
              "children": [
                "Semmelweis (1847): água clorada e mortalidade puerperal",
                "Pasteur: fim do “pus louvável”",
                "Lister (1867): ácido fênico",
                "Koch: 4 postulados"
              ]
            },
            {
              "root": "Assepsia",
              "children": [
                "Von Bergman (1886): esterilização a vapor",
                "Heidenreich e Redar: autoclave",
                "Halsted (1890): luvas de borracha e máscara de gaze"
              ]
            }
          ],
          "summary": "A anestesia (1846) expôs o problema da infecção. Semmelweis (água clorada) e Pasteur (teoria dos germes) mostraram de onde ela vem; Lister combateu os germes com ácido fênico; Von Bergman passou a impedi-los com a esterilização a vapor; Halsted acrescentou luvas e máscara.",
          "keywords": [
            "Semmelweis",
            "Pasteur",
            "Lister",
            "Koch",
            "Von Bergman",
            "Halsted",
            "Fleming"
          ]
        },
        "connection": "Você já sabe de onde vêm as ideias. A próxima aba mostra de onde vêm os germes: as fontes de infecção e as defesas do hospedeiro."
      },
      {
        "id": "fontes",
        "label": "🦠 Fontes de infecção",
        "type": "lesson",
        "intro": {
          "why": "A pele é a maior barreira física do corpo. As infecções do sítio cirúrgico são a forma mais comum de infecção hospitalar em pacientes operados: atrasam a cicatrização, aumentam a permanência hospitalar e o uso de antibióticos.",
          "where": "No preparo do paciente e da equipe e em tudo o que entra em contato com o campo operatório.",
          "importance": "Saber de onde vêm as bactérias mostra onde agir: cada fonte de contaminação pede uma medida de assepsia ou de antissepsia.",
          "applications": "Orienta o preparo da pele, a técnica das mãos, a roupa cirúrgica, o controle do ar e o cuidado com instrumentos e suturas."
        },
        "objectives": [
          "Listar as principais fontes de contaminação da ferida operatória",
          "Relacionar a flora normal de cada região do corpo ao risco de contaminação",
          "Explicar de que dependem o desfecho de uma contaminação",
          "Citar os três pilares da profilaxia da infecção e a conduta atual sobre a tricotomia"
        ],
        "sections": [
          {
            "title": "De onde vêm as bactérias",
            "explanation": "<p>A infecção do sítio cirúrgico quase sempre começa com a <strong>contaminação da ferida</strong>. Seis fontes concentram o risco:</p><ul><li>Pele do paciente</li><li>Pele e mãos do cirurgião</li><li>Nariz e garganta da equipe</li><li>Roupa cirúrgica</li><li>Fatores ambientais: ar e ambiente</li><li>Instrumentos cirúrgicos e material de sutura</li></ul><p><em>Fonte: T-I, Cap. 28, p. 423.</em></p>",
            "example": "Um instrumento mal esterilizado e um cirurgião que fala sem máscara são fontes diferentes: a primeira vem do material; a segunda, do nariz e da garganta da equipe.",
            "summary": "Seis fontes de contaminação: pele do paciente, pele e mãos do cirurgião, nariz e garganta da equipe, roupa cirúrgica, ar e ambiente, instrumentos e material de sutura.",
            "image": "Esquema do campo operatório com setas apontando as seis fontes de contaminação"
          },
          {
            "title": "Flora normal por região",
            "explanation": "<p>O corpo já abriga micro-organismos em cada região: a <strong>flora normal</strong>. A flora de cada área é a fonte provável de contaminação quando a cirurgia atravessa ou abre aquela região.</p><p>A pele da região infraumbilical, por exemplo, tem estafilococos e estreptococos gram-positivos, mas também <em>Corynebacterium</em>, <em>E. coli</em>, <em>Enterococcus faecalis</em> e <em>Candida albicans</em>.</p><p><em>Fonte: T-I, Cap. 28, p. 423.</em></p>",
            "example": "No cólon distal os anaeróbios superam os aeróbios em cerca de 100:1; no estômago há poucos micro-organismos, porque o ambiente é muito ácido.",
            "summary": "A flora varia por região: pele (gram-positivos e outros), boca e orofaringe (maior concentração do trato digestivo alto), estômago (poucos, pelo ácido) e cólon distal (anaeróbios 100:1 sobre aeróbios).",
            "table": {
              "title": "Flora predominante por região",
              "rows": [
                [
                  "Pele (região infraumbilical)",
                  "Staphylococcus e estreptococos gram-positivos; Corynebacterium, E. coli, Enterococcus faecalis, Candida albicans"
                ],
                [
                  "Vias respiratórias altas",
                  "O muco retém partículas grandes; as vias baixas são mantidas estéreis por macrófagos alveolares"
                ],
                [
                  "Boca e orofaringe",
                  "Maior concentração microbiana do trato digestivo alto"
                ],
                [
                  "Estômago",
                  "Poucos micro-organismos (ambiente muito ácido)"
                ],
                [
                  "Cólon (porção distal)",
                  "Anaeróbios superam aeróbios em cerca de 100:1"
                ]
              ]
            }
          },
          {
            "title": "Defesas do hospedeiro e desfecho da contaminação",
            "explanation": "<p>Quando micro-organismos penetram um compartimento do corpo, atuam <strong>macrófagos, proteínas do complemento e imunoglobulinas</strong>, levando à opsonização, à fagocitose e à destruição microbiana.</p><p>O resultado final depende de quatro fatores: o <strong>número inicial</strong> de micro-organismos, o <strong>índice de proliferação</strong> bacteriana, a <strong>virulência</strong> microbiana e a <strong>potência das defesas</strong> do hospedeiro.</p><p><em>Fonte: T-I, Cap. 28, p. 423.</em></p>",
            "example": "Duas feridas com a mesma contaminação podem evoluir de forma diferente: com defesas fortes, a fagocitose domina; com defesas fracas e bactérias virulentas, a infecção se instala.",
            "summary": "Macrófagos, complemento e imunoglobulinas destroem os micro-organismos; o desfecho depende do número inicial, da proliferação, da virulência e das defesas do hospedeiro.",
            "boxes": [
              {
                "variant": "amber",
                "label": "🩺 Quatro fatores",
                "text": "Número inicial de micro-organismos · índice de proliferação · virulência · potência das defesas do hospedeiro."
              }
            ]
          },
          {
            "title": "Três pilares da profilaxia e a tricotomia",
            "explanation": "<p>A prevenção da infecção se apoia em <strong>três pilares</strong>:</p><ul><li>manter a resistência do hospedeiro;</li><li>minimizar a contaminação;</li><li>usar de forma apropriada as medidas assépticas, antissépticas e a antibioticoterapia.</li></ul><p>Um cuidado prático entra no preparo da pele: a retirada dos pelos.</p><p><em>Fonte: T-I, Cap. 28, p. 423.</em></p>",
            "example": "No dia da cirurgia, aparar os pelos da região com tesoura, em vez de raspar com lâmina, evita pequenos cortes onde as bactérias proliferam.",
            "summary": "Três pilares: resistência do hospedeiro, menor contaminação e medidas corretas. Na tricotomia, cortar o pelo com tesoura é preferível a raspar com lâmina no mesmo dia da cirurgia.",
            "boxes": [
              {
                "variant": "red",
                "label": "⚠️ Tricotomia (rasurar pelos)",
                "text": "Estudos atuais sugerem <strong>cortar o pelo com tesoura</strong> em vez de raspar com lâmina no mesmo dia da cirurgia — a lâmina promove crescimento excessivo de micro-organismos em pequenos cortes na pele."
              }
            ]
          }
        ],
        "exercises": [
          {
            "level": "facil",
            "q": "Em qual região os anaeróbios superam os aeróbios em cerca de 100:1?",
            "options": [
              "Estômago",
              "Pele da região infraumbilical",
              "Boca e orofaringe",
              "Cólon (porção distal)"
            ],
            "correct": 3,
            "explain": "No cólon distal os anaeróbios superam os aeróbios em cerca de 100:1. O estômago tem poucos micro-organismos (ambiente muito ácido); boca e orofaringe têm a maior concentração do trato digestivo alto."
          },
          {
            "level": "medio",
            "q": "Segundo as evidências citadas no texto, qual é a melhor conduta para os pelos da região operatória no dia da cirurgia?",
            "options": [
              "Raspar com lâmina no mesmo dia da cirurgia",
              "Cortar o pelo com tesoura",
              "Qualquer método, pois não muda o risco de infecção",
              "Raspar com lâmina e aplicar antisséptico em seguida"
            ],
            "correct": 1,
            "explain": "A lâmina promove crescimento excessivo de micro-organismos em pequenos cortes na pele; por isso, as evidências atuais sugerem cortar o pelo com tesoura."
          },
          {
            "level": "dificil",
            "q": "Quais fatores determinam o desfecho de uma contaminação bacteriana?",
            "options": [
              "Número inicial de micro-organismos, virulência e antibiótico escolhido; as defesas do hospedeiro não interferem",
              "Apenas a potência das defesas do hospedeiro",
              "Número inicial de micro-organismos, índice de proliferação, virulência e potência das defesas do hospedeiro",
              "Índice de proliferação e duração da cirurgia, independentemente da virulência"
            ],
            "correct": 2,
            "explain": "O resultado depende de quatro fatores: o número inicial de micro-organismos, o índice de proliferação bacteriana, a virulência microbiana e a potência das defesas do hospedeiro."
          }
        ],
        "review": {
          "mindMap": [
            {
              "root": "Fontes de contaminação",
              "children": [
                "Pele do paciente",
                "Pele e mãos do cirurgião",
                "Nariz e garganta da equipe",
                "Roupa cirúrgica",
                "Ar e ambiente",
                "Instrumentos e material de sutura"
              ]
            },
            {
              "root": "Flora por região",
              "children": [
                "Pele: estafilococos e estreptococos gram-positivos",
                "Boca: maior concentração do trato digestivo alto",
                "Estômago: poucos micro-organismos (ácido)",
                "Cólon distal: anaeróbios 100:1 sobre aeróbios"
              ]
            },
            {
              "root": "Defesa e profilaxia",
              "children": [
                "Macrófagos, complemento e imunoglobulinas",
                "Desfecho: número inicial, proliferação, virulência e defesas",
                "Três pilares: resistência, menos contaminação, medidas corretas",
                "Tricotomia: tesoura, não lâmina"
              ]
            }
          ],
          "summary": "As fontes de contaminação são pele (do paciente e da equipe), nariz e garganta, roupa, ar e instrumentos. A flora varia por região, e o desfecho depende de número, proliferação, virulência e defesas. A profilaxia se apoia em três pilares; na tricotomia, tesoura em vez de lâmina.",
          "keywords": [
            "Infecção do sítio cirúrgico",
            "Flora normal",
            "Cólon distal",
            "Opsonização",
            "Fagocitose",
            "Virulência",
            "Tricotomia"
          ]
        },
        "connection": "Agora você sabe de onde vêm os germes. A próxima aba mostra a primeira barreira contra eles: a higiene das mãos, do lavado social ao cirúrgico."
      },
      {
        "id": "maos",
        "label": "🧼 Higiene das mãos",
        "type": "lesson",
        "intro": {
          "why": "Existem três níveis de lavagem — social, higiênico e cirúrgico — cada um com indicação, técnica e tempo próprios. Usar o nível errado é subestimar (ou exagerar) o risco do procedimento.",
          "where": "Antes e depois do contato com pacientes e, no centro cirúrgico, antes de toda manobra crítica.",
          "importance": "As mãos da equipe estão entre as principais fontes de contaminação; a lavagem correta é a primeira barreira.",
          "applications": "Escolher o nível de lavagem conforme o procedimento e executar o lavado cirúrgico com a técnica e a sequência corretas."
        },
        "objectives": [
          "Distinguir os três níveis de lavagem (social, higiênico e cirúrgico) e escolher o adequado para cada situação",
          "Descrever a técnica do lavado cirúrgico, do sabão à aplicação do antisséptico",
          "Reproduzir a sequência de fricção das 6 posições",
          "Diferenciar as soluções antissépticas aquosas, alcoólicas e alcoólicas com ingrediente ativo adicional"
        ],
        "sections": [
          {
            "title": "Três níveis de lavagem",
            "explanation": "<p>O nível de lavagem depende do risco do procedimento: <strong>quanto mais invasivo, mais completo o lavado</strong>.</p><p><em>Fonte: T-I, Cap. 28, pp. 423–424.</em></p>",
            "example": "Uma enfermeira vai medir a pressão arterial, sem procedimento invasivo: basta o lavado social (10–20 s). Antes de uma manobra cirúrgica, é preciso o lavado cirúrgico.",
            "summary": "Social (10–20 s): contato sem risco. Higiênico (~2 min): manobras críticas como procedimentos invasivos. Cirúrgico: manobras críticas cirúrgicas, com escovação até 2 polegadas acima do cotovelo.",
            "table": {
              "title": "Os três níveis",
              "rows": [
                [
                  "Lavado social",
                  "Quando: antes e depois do contato com o paciente em procedimentos não invasivos e sem risco. Técnica: água e sabão, removendo a sujidade visível; secar com pano ou papel limpo; 10–20 segundos."
                ],
                [
                  "Lavado higiênico",
                  "Quando: antes de manobras críticas, como procedimentos invasivos. Técnica: água e sabão, fricção enérgica e enxágue por 1 min; repetir estendendo aos antebraços; secar com panos estéreis; cerca de 2 min + antisséptico com 2 min de contato."
                ],
                [
                  "Lavado cirúrgico",
                  "Quando: antes de manobras críticas cirúrgicas. Técnica: lavagem mecânica com água, sabão e escova até 2 polegadas acima do cotovelo; tradição cubana de 10 min de escovação."
                ]
              ]
            },
            "boxes": [
              {
                "variant": "purple",
                "label": "🔀 Tempos e protocolos",
                "text": "Os tempos acima seguem o texto-base cubano (lavado cirúrgico tradicional de 10 minutos). Outros protocolos podem usar tempos diferentes: siga o protocolo da sua instituição."
              }
            ]
          },
          {
            "title": "Técnica do lavado cirúrgico, passo a passo",
            "explanation": "<p>O lavado cirúrgico segue uma ordem: <strong>sabão, escovação, enxágue, secagem e antisséptico</strong>.</p><ol><li>Lavar primeiro com sabão para arrastar a matéria orgânica.</li><li>Escovar dedos, mãos e punhos, esfregando vigorosamente palma, dorso e espaços interdigitais da mão esquerda com a palma direita; repetir trocando de lado.</li><li>Insistir nos espaços interdigitais, nas pontas dos dedos e nas unhas (inclusive o sulco subungueal, onde se acumulam germes); limpar as unhas antes com limpa-unhas.</li><li>Dividir o tempo em duas partes: os primeiros ~6 min na sequência descrita; trocar a ensaboadura e repetir até completar 10 min.</li><li>Enxaguar sem deixar resíduos de sabão, sempre com as mãos elevadas, para que a água escorra em direção ao cotovelo.</li><li>Secar com pano ou papel absorvente estéril, pressionando sem esfregar; começar pelas mãos e terminar no cotovelo, sem voltar às mãos.</li><li>Aplicar antisséptico em solução alcoólica com emoliente (5–10 mL), esfregando pontas dos dedos, espaços interdigitais e mãos; deixar escorrer até o cotovelo; 3–5 min no total.</li></ol><p><em>Fonte: T-I, Cap. 28, pp. 423–424.</em></p>",
            "example": "Depois de enxaguar, a residente mantém as mãos elevadas para a água escorrer em direção ao cotovelo, seca das mãos ao cotovelo sem voltar às mãos e só então aplica o antisséptico.",
            "summary": "Sabão → escovação (insistir nos espaços interdigitais e no sulco subungueal) → enxágue com as mãos elevadas → secagem das mãos ao cotovelo → antisséptico (3–5 min).",
            "image": "Sequência de 7 quadros do lavado cirúrgico, com as mãos sempre acima dos cotovelos",
            "note": {
              "type": "warn",
              "text": "Depois da lavagem, o cirurgião <strong>nunca deve baixar as mãos abaixo dos cotovelos</strong>."
            }
          },
          {
            "title": "Sequência de fricção: as 6 posições",
            "explanation": "<p>A fricção das mãos segue <strong>seis posições</strong>, sempre na mesma ordem, para que nenhuma área fique sem cobertura:</p><ol><li>Palma com palma.</li><li>Palma direita sobre o dorso da mão esquerda e vice-versa.</li><li>Palma com palma, entrelaçando os dedos.</li><li>Dorso dos dedos flexionados de cada mão.</li><li>Polegar direito com a mão esquerda e vice-versa.</li><li>Fricção das pontas dos dedos sobre as palmas.</li></ol><p><em>Fonte: T-I, Cap. 28, p. 424.</em></p>",
            "example": "Entrelaçar os dedos (3ª posição) alcança os espaços interdigitais; friccionar as pontas dos dedos sobre a palma (6ª posição) alcança as pontas dos dedos e as unhas.",
            "summary": "Seis posições, em ordem: palma com palma; palma sobre dorso (dos dois lados); palma com palma entrelaçando os dedos; dorso dos dedos flexionados; polegares; pontas dos dedos sobre as palmas.",
            "image": "Seis quadros numerados das posições de fricção das mãos"
          },
          {
            "title": "Soluções para antissepsia das mãos",
            "explanation": "<p>Há três tipos de solução para a antissepsia das mãos. A diferença está no que cada uma combina:</p><p><em>Fonte: T-I, Cap. 28, pp. 424–425.</em></p>",
            "example": "Álcool + gluconato de clorexidina (Hibitane) junta o efeito bactericida rápido do álcool com a atividade química persistente da clorexidina.",
            "summary": "Aquosas (clorexidina ou povidona iodada em água) são as mais usadas na prática tradicional; as alcoólicas têm ação rápida; a associação álcool + clorexidina soma ação rápida e persistente.",
            "table": {
              "title": "Tipos de solução",
              "rows": [
                [
                  "Aquosas",
                  "Gluconato de clorexidina ou povidona iodada em água. As mais usadas na prática tradicional."
                ],
                [
                  "Alcoólicas",
                  "Etanol, isopropanol ou n-propanol, a 60–90%. O CDC recomenda o álcool como método preferido para a higiene das mãos."
                ],
                [
                  "Alcoólicas com ingrediente ativo adicional",
                  "Álcool + gluconato de clorexidina (Hibitane). Combina o efeito bactericida rápido do álcool com a atividade química persistente da clorexidina."
                ]
              ]
            },
            "boxes": [
              {
                "variant": "red",
                "label": "⚠️ Armadilha",
                "text": "Luvas estéreis sozinhas <strong>não eliminam o risco</strong>: podem sofrer perfurações despercebidas. O lavado cirúrgico (mecânico + antisséptico) não deve ser substituído apenas pelo uso de luvas."
              }
            ]
          }
        ],
        "exercises": [
          {
            "level": "facil",
            "q": "Quantas são as posições da sequência de fricção das mãos?",
            "options": [
              "6",
              "5",
              "4",
              "8"
            ],
            "correct": 0,
            "explain": "São seis posições, sempre na mesma ordem: palma com palma; palma sobre dorso (dos dois lados); palma com palma entrelaçando os dedos; dorso dos dedos flexionados; polegares; pontas dos dedos sobre as palmas."
          },
          {
            "level": "medio",
            "q": "Depois de enxaguar as mãos no lavado cirúrgico, qual é a conduta correta?",
            "options": [
              "Deixar as mãos secarem sozinhas, abaixo dos cotovelos",
              "Baixar as mãos para escorrer a água e secar do cotovelo às mãos",
              "Secar esfregando com força com um pano limpo, voltando às mãos ao final",
              "Manter as mãos elevadas e secar das mãos ao cotovelo, sem voltar às mãos"
            ],
            "correct": 3,
            "explain": "O enxágue é feito com as mãos elevadas, para a água escorrer em direção ao cotovelo. A secagem usa pano ou papel estéril, pressionando sem esfregar, das mãos ao cotovelo, sem voltar às mãos. Após a lavagem, as mãos nunca ficam abaixo dos cotovelos."
          },
          {
            "level": "dificil",
            "q": "Por que o lavado cirúrgico não pode ser substituído apenas pelo uso de luvas estéreis?",
            "options": [
              "Porque as luvas estéreis precisam ser trocadas a cada 10 minutos de cirurgia",
              "Porque as luvas podem ter perfurações despercebidas e o lavado reduz a flora residente",
              "Porque o lavado cirúrgico é exigido apenas por tradição, sem efeito sobre os germes",
              "Porque as luvas estéreis só funcionam quando as mãos continuam molhadas"
            ],
            "correct": 1,
            "explain": "Luvas estéreis sozinhas não eliminam o risco: podem sofrer perfurações despercebidas. O lavado cirúrgico (mecânico + antisséptico) elimina a flora transitória e reduz a residente a níveis mínimos."
          }
        ],
        "review": {
          "mindMap": [
            {
              "root": "Três níveis de lavagem",
              "children": [
                "Social: 10–20 s, contato sem risco",
                "Higiênico: ~2 min + antisséptico, manobras críticas",
                "Cirúrgico: escovação até 2 polegadas acima do cotovelo (tradição cubana: 10 min)"
              ]
            },
            {
              "root": "Técnica do lavado cirúrgico",
              "children": [
                "Sabão e escovação (interdigitais, unhas, sulco subungueal)",
                "Enxágue com as mãos elevadas",
                "Secagem das mãos ao cotovelo, sem voltar às mãos",
                "Antisséptico, 3–5 min"
              ]
            },
            {
              "root": "Fricção e soluções",
              "children": [
                "6 posições, sempre na mesma ordem",
                "Aquosas, alcoólicas e alcoólicas com clorexidina",
                "Luvas estéreis não substituem o lavado"
              ]
            }
          ],
          "summary": "O nível de lavagem acompanha o risco: social, higiênico ou cirúrgico. O lavado cirúrgico segue uma ordem (sabão, escovação, enxágue com mãos elevadas, secagem das mãos ao cotovelo, antisséptico), e a fricção tem 6 posições. As luvas estéreis nunca substituem o lavado.",
          "keywords": [
            "Lavado social",
            "Lavado higiênico",
            "Lavado cirúrgico",
            "Sulco subungueal",
            "Fricção",
            "Clorexidina",
            "Solução alcoólica"
          ]
        },
        "connection": "As mãos estão prontas. A próxima aba cuida de outra superfície crítica: a pele do paciente e o ambiente do centro cirúrgico."
      },
      {
        "id": "ambiente",
        "label": "🏥 Paciente e centro cirúrgico",
        "type": "lesson",
        "intro": {
          "why": "Cerca de 80% dos germes achados em feridas infectadas já estavam antes no ar e no ambiente do centro cirúrgico. Preparar a pele do paciente e controlar o ambiente fecha duas das principais portas de entrada da infecção.",
          "where": "No preparo do paciente antes da incisão e na estrutura, na roupa e na limpeza do centro cirúrgico.",
          "importance": "Pele, roupa, ar e superfícies são fontes de contaminação que se controlam com medidas simples e bem definidas.",
          "applications": "Aplicar o antisséptico na pele do paciente de forma correta e conhecer as regras de roupa, ar e limpeza do salão cirúrgico."
        },
        "objectives": [
          "Descrever a sequência de antissepsia da pele do paciente e justificar o uso da povidona iodada",
          "Listar as regras da roupa cirúrgica e explicar por que existem",
          "Citar os parâmetros do ar do centro cirúrgico: fluxo laminar, pressão positiva, trocas de ar, temperatura e umidade",
          "Descrever a limpeza e a desinfecção do salão após a operação"
        ],
        "sections": [
          {
            "title": "Antissepsia da pele do paciente",
            "explanation": "<p>A pele do doente se limpa <strong>primeiro com água e sabão, depois com antisséptico</strong>. O iodo a 2% é histórico; a povidona iodada a 10% é o produto mais usado hoje, por causar menos irritação.</p><ul><li><strong>Iodo a 2%</strong>: usado há décadas pela ação bactericida rápida; costuma-se aplicar álcool depois, para evitar irritação da pele.</li><li><strong><span class='term' data-term='povidona-iodada'>Povidona iodada</span> a 10%</strong>: combinação de iodo com polivinilpirrolidona — menos irritante e com maior disponibilidade do produto ao longo do tempo. É a forma iodada mais empregada atualmente.</li><li><strong>Outros produtos usados</strong>: clorexidina e triclosan.</li></ul><p><em>Fonte: T-I, Cap. 28, p. 423.</em></p>",
            "example": "O iodo isolado irrita a pele; ao ser combinado com a polivinilpirrolidona (povidona), irrita menos e fica disponível por mais tempo.",
            "summary": "Água e sabão primeiro, antisséptico depois. A povidona iodada a 10% é a forma iodada mais usada hoje. O antisséptico cobre todo o campo operatório e vai além dos seus limites, secando antes da colocação dos campos.",
            "image": "Desenho do campo operatório com a área de aplicação do antisséptico ultrapassando os limites da incisão",
            "boxes": [
              {
                "variant": "green",
                "label": "✅ Aplicação correta",
                "text": "O antisséptico deve <strong>cobrir todo o campo operatório e se estender além de seus limites</strong>, secando completamente antes da colocação dos campos."
              }
            ]
          },
          {
            "title": "Roupa cirúrgica",
            "explanation": "<p>A roupa cirúrgica é uma barreira entre a equipe e o campo operatório. Quatro regras resumem o que se exige:</p><ul><li>Todos que entram no centro cirúrgico usam <strong>botas, gorro e máscara</strong>.</li><li>A máscara deve cobrir bem boca e nariz: a orofaringe é fonte natural de flora contaminante.</li><li>O cabelo deve ficar totalmente coberto: a pele descama biopartículas com bactérias continuamente.</li><li>Preferir materiais impermeáveis, para que as bactérias não atravessem o tecido por capilaridade.</li></ul><p><em>Fonte: T-I, Cap. 28, pp. 424–425.</em></p>",
            "example": "Uma máscara que deixa o nariz de fora anula parte da barreira: nariz e garganta são fontes naturais de bactérias.",
            "summary": "Botas, gorro e máscara para todos; máscara cobrindo boca e nariz; cabelo totalmente coberto; tecidos impermeáveis.",
            "note": {
              "type": "tip",
              "text": "Cada regra tem uma fonte de contaminação correspondente: máscara → orofaringe; gorro → biopartículas da pele; tecido impermeável → capilaridade."
            }
          },
          {
            "title": "Ar e ambiente",
            "explanation": "<p>O ar também é fonte de contaminação. As ferramentas para controlá-lo são o <span class='term' data-term='fluxo-laminar'>fluxo laminar</span>, a <span class='term' data-term='pressao-positiva'>pressão positiva</span> e as trocas de ar por hora.</p><ul><li>Sistemas de fluxo unidirecional (laminar) com filtragem eficiente: o ar entra em coluna, em baixa velocidade, arrasta partículas e evita turbulência.</li><li>O centro cirúrgico deve ter pressão positiva, para que o ar flua da zona asséptica para as áreas adjacentes.</li><li>Evitar movimentos bruscos (sacudir panos, abrir e fechar portas) que levantem poeira.</li></ul><p><em>Fonte: T-I, Cap. 28, pp. 424–425.</em></p>",
            "example": "Com pressão positiva, ao abrir a porta o ar sai do centro cirúrgico para o corredor, e não o contrário.",
            "summary": "Fluxo laminar com filtragem eficiente, pressão positiva, mínimo de 20 trocas de ar por hora (ao menos 4 com ar fresco), 18–23 °C e umidade de 50–55%.",
            "table": {
              "title": "Parâmetros do ar do centro cirúrgico",
              "rows": [
                [
                  "Fluxo",
                  "Unidirecional (laminar), com filtragem eficiente"
                ],
                [
                  "Pressão",
                  "Positiva: o ar flui da zona asséptica para as áreas adjacentes"
                ],
                [
                  "Trocas de ar",
                  "Mínimo de 20 por hora, das quais ao menos 4 com ar fresco"
                ],
                [
                  "Temperatura",
                  "Entre 18 e 23 °C"
                ],
                [
                  "Umidade relativa",
                  "Entre 50 e 55%"
                ]
              ]
            },
            "boxes": [
              {
                "variant": "blue",
                "label": "🔢 Valor de referência",
                "text": "Mínimo recomendado: <strong>20 trocas de ar por hora</strong>, das quais ao menos 4 com ar fresco."
              }
            ]
          },
          {
            "title": "Superfícies e desinfecção do salão",
            "explanation": "<p>Depois da operação, o salão passa por <strong>limpeza e desinfecção</strong>, nessa ordem.</p><ul><li>As superfícies devem ser duras e pouco porosas (poliésteres, resinas epóxi, vinil rígido), para resistir à proliferação bacteriana e facilitar a limpeza.</li><li>Após a operação: limpeza mecânica com água e detergente; depois, um desinfetante (por exemplo, fenol em solução aquosa) deixado secar espontaneamente.</li><li>Métodos complementares descritos no texto-base: propilenoglicol vaporizado ou formolização (local fechado por cerca de 24 h).</li><li>Luz ultravioleta: usada há anos para controlar a contaminação do ar; exige proteção da equipe contra a radiação.</li></ul><p><em>Fonte: T-I, Cap. 28, pp. 424–425.</em></p>",
            "example": "Depois de uma cirurgia: primeiro a limpeza com água e detergente; só depois o desinfetante, deixado secar espontaneamente.",
            "summary": "Superfícies duras e pouco porosas; limpeza mecânica antes do desinfetante; métodos complementares: propilenoglicol, formolização, luz ultravioleta (com proteção da equipe).",
            "boxes": [
              {
                "variant": "blue",
                "label": "🔢 Tecnologia recente: AsepticSure",
                "text": "Sistema que vaporiza uma mistura de ozônio (80 ppm) e peróxido de hidrogênio (1%) em ambientes de 82–93 m³, expostos de 30 a 90 min: elimina 99,9999% dos germes testados (S. aureus resistente à meticilina, enterococo resistente à vancomicina, E. coli, Pseudomonas aeruginosa, C. difficile e Bacillus)."
              }
            ]
          }
        ],
        "exercises": [
          {
            "level": "facil",
            "q": "Como se prepara a pele do paciente antes da incisão?",
            "options": [
              "Com antisséptico apenas, sem lavar antes a pele do paciente",
              "Com antisséptico, colocando os campos logo em seguida sem esperar secar",
              "Com água e sabão e depois antisséptico, cobrindo todo o campo e além",
              "Com álcool apenas nas bordas da incisão, sem cobrir todo o campo"
            ],
            "correct": 2,
            "explain": "A pele se limpa primeiro com água e sabão e depois recebe o antisséptico, que deve cobrir todo o campo operatório e se estender além de seus limites, secando completamente antes da colocação dos campos."
          },
          {
            "level": "medio",
            "q": "Quais são a temperatura e a umidade relativa recomendadas no centro cirúrgico?",
            "options": [
              "Entre 18 e 23 °C e umidade de 50 a 55%",
              "Entre 28 e 33 °C e umidade de 80 a 90%",
              "Entre 10 e 15 °C e umidade de 20 a 30%",
              "Entre 24 e 28 °C e umidade de 30 a 40%"
            ],
            "correct": 0,
            "explain": "O centro cirúrgico deve ter temperatura entre 18 e 23 °C e umidade relativa entre 50 e 55%."
          },
          {
            "level": "dificil",
            "q": "Por que o centro cirúrgico deve ter pressão positiva?",
            "options": [
              "Para que o ar das áreas adjacentes entre no centro cirúrgico e o resfrie",
              "Para elevar a umidade relativa acima de 55%",
              "Para dispensar o uso de máscara pela equipe",
              "Para que o ar flua da zona asséptica para as áreas adjacentes, e não o contrário"
            ],
            "correct": 3,
            "explain": "Com pressão positiva, o ar flui da zona asséptica (o centro cirúrgico) para as áreas adjacentes, impedindo que o ar contaminado entre. Temperatura e umidade são parâmetros à parte (18–23 °C; 50–55%), e a máscara continua sendo obrigatória."
          }
        ],
        "review": {
          "mindMap": [
            {
              "root": "Pele do paciente",
              "children": [
                "Água e sabão primeiro, antisséptico depois",
                "Povidona iodada a 10%: a forma iodada mais usada",
                "Cobrir todo o campo e além; secar antes dos campos"
              ]
            },
            {
              "root": "Roupa cirúrgica",
              "children": [
                "Botas, gorro e máscara para todos",
                "Máscara cobrindo boca e nariz",
                "Cabelo coberto; tecido impermeável"
              ]
            },
            {
              "root": "Ar e ambiente",
              "children": [
                "Fluxo laminar e pressão positiva",
                "20 trocas de ar/hora (≥ 4 com ar fresco)",
                "18–23 °C; umidade 50–55%"
              ]
            },
            {
              "root": "Salão após a operação",
              "children": [
                "Superfícies duras e pouco porosas",
                "Limpeza mecânica, depois desinfetante",
                "Complementares: propilenoglicol, formolização, luz ultravioleta"
              ]
            }
          ],
          "summary": "A pele do paciente recebe água e sabão e depois antisséptico (povidona iodada a 10% é a forma iodada mais usada). A roupa cirúrgica barra as fontes da equipe; o ar é controlado por fluxo laminar, pressão positiva e 20 trocas por hora; o salão é limpo e desinfetado após cada operação.",
          "keywords": [
            "Povidona iodada",
            "Campo operatório",
            "Biopartículas",
            "Fluxo laminar",
            "Pressão positiva",
            "Trocas de ar",
            "AsepticSure"
          ]
        },
        "connection": "Paciente e ambiente estão preparados. A próxima aba trata do que toca o campo operatório: como esterilizar o instrumental."
      },
      {
        "id": "esterilizacao",
        "label": "♨️ Esterilização",
        "type": "lesson",
        "intro": {
          "why": "Esterilizar é eliminar todos os agentes vivos capazes de se reproduzir — e cada tipo de material suporta métodos diferentes. Escolher o método errado destrói o material ou deixa de esterilizá-lo.",
          "where": "Na central de esterilização e em todo o preparo do instrumental, dos campos e das suturas.",
          "importance": "A autoclave é o padrão-ouro para instrumental e tecidos, o óxido de etileno atende o plástico e o cobalto-60, segundo o texto-base, é o método mais confiável.",
          "applications": "Indicar o método de esterilização para cada tipo de material e saber como confirmar que o processo funcionou."
        },
        "objectives": [
          "Classificar os agentes esterilizantes em físicos e químicos e citar o princípio de cada um",
          "Citar os parâmetros da autoclave e os cuidados com o material de borracha",
          "Indicar o método adequado para cada tipo de material",
          "Explicar o controle de qualidade da esterilização e o papel do cobalto-60"
        ],
        "sections": [
          {
            "title": "Métodos físicos e químicos",
            "explanation": "<p>A <span class='term' data-term='esterilizacao'>esterilização</span> pode ser <strong>física</strong> (calor, filtração, radiação) ou <strong>química</strong> (gases e líquidos). A autoclave, que usa calor úmido, é o padrão-ouro para instrumental e tecidos.</p><p><em>Fonte: T-I, Cap. 28, p. 422.</em></p>",
            "example": "A autoclave age por calor úmido (desnaturação irreversível de enzimas e proteínas); o óxido de etileno age como gás, a temperaturas bem menores.",
            "summary": "Físicos: calor úmido, calor seco, filtração por membranas, radiações. Químicos: gases (óxido de etileno, formaldeído) e líquidos em solução (glutaraldeído ativado, peróxido de hidrogênio).",
            "table": {
              "title": "Agentes esterilizantes",
              "rows": [
                [
                  "Físico · calor úmido (autoclave)",
                  "Desnaturação irreversível de enzimas e proteínas estruturais."
                ],
                [
                  "Físico · calor seco",
                  "Oxidação dos componentes celulares."
                ],
                [
                  "Físico · filtração por membranas",
                  "Método físico; o texto-base não detalha o princípio."
                ],
                [
                  "Físico · radiações",
                  "Ionização de moléculas de DNA, causando mutações; fonte de radioisótopos (cobalto-60) ou feixes eletrônicos."
                ],
                [
                  "Químico · gases (óxido de etileno, formaldeído)",
                  "Esterilização a frio: temperaturas bem menores que as do calor seco ou do vapor."
                ],
                [
                  "Químico · líquidos (glutaraldeído ativado, peróxido de hidrogênio)",
                  "Agentes em solução."
                ]
              ]
            },
            "boxes": [
              {
                "variant": "red",
                "label": "⚠️ Armadilha",
                "text": "Radiação e óxido de etileno são chamados de “esterilização a frio” porque ocorrem em temperatura ambiente ou bem mais baixa que o calor seco ou o vapor — <strong>não confundir com refrigeração</strong>."
              }
            ]
          },
          {
            "title": "Autoclave: os números que caem em prova",
            "explanation": "<p>A <span class='term' data-term='autoclave'>autoclave</span> esteriliza com <strong>vapor sob pressão</strong>. O texto-base traz dois padrões de referência e dois cuidados importantes:</p><ul><li>Padrão clássico: acima de 2 atmosferas e temperatura acima de 140 °C.</li><li>Variante por libras: 20 libras a 121 °C durante 30 min.</li><li>Material de borracha: tempo de exposição menor, pelo risco de deterioração.</li><li>Confirmação final: o material só é completamente estéril depois de seco dentro do próprio equipamento.</li></ul><p><em>Fonte: T-I, Cap. 28, pp. 425–426.</em></p>",
            "example": "Uma luva de borracha e uma pinça metálica não ficam o mesmo tempo na autoclave: a borracha se deteriora com o calor prolongado.",
            "summary": "Autoclave: > 2 atm e > 140 °C, ou 20 libras a 121 °C por 30 min; menos tempo para borracha; só é estéril depois de seco no próprio equipamento.",
            "table": {
              "title": "Parâmetros da autoclave",
              "rows": [
                [
                  "Pressão (padrão clássico)",
                  "Acima de 2 atmosferas, temperatura > 140 °C"
                ],
                [
                  "Pressão (variante por libras)",
                  "20 libras a 121 °C durante 30 min"
                ],
                [
                  "Material de borracha",
                  "Tempo de exposição menor, pelo risco de deterioração"
                ],
                [
                  "Confirmação final",
                  "Completamente estéril só depois de seco dentro do próprio equipamento"
                ]
              ]
            },
            "note": {
              "type": "warn",
              "text": "Os valores de pressão, temperatura e tempo seguem o texto-base cubano. Em dúvida, siga o protocolo e o manual do equipamento da sua instituição."
            }
          },
          {
            "title": "Qual método para qual material",
            "explanation": "<p>A escolha do método depende do material: <strong>o que o calor úmido destrói exige outro método</strong>.</p><p><em>Fonte: T-I, Cap. 28, pp. 425–426.</em></p>",
            "example": "Uma sonda de plástico não vai à autoclave: o calor e a pressão a danificariam. Usa-se o <span class='term' data-term='oxido-de-etileno'>óxido de etileno</span>, que esteriliza a temperaturas bem mais baixas.",
            "summary": "Autoclave: instrumental metálico, tecidos e campos. Óxido de etileno: plásticos, sondas e cateteres. Cobalto-60 ou óxido de etileno: suturas. Forno elétrico: vidro e materiais frágeis.",
            "image": "Mapa de decisão: tipo de material → método de esterilização",
            "table": {
              "title": "Material e método indicado",
              "rows": [
                [
                  "Instrumental metálico, tecidos, campos",
                  "Autoclave (calor úmido)"
                ],
                [
                  "Material cortante (bisturis, tesouras)",
                  "Evitar autoclave — se deteriora; preferir outros métodos"
                ],
                [
                  "Sondas, cateteres, equipos de plástico",
                  "Óxido de etileno"
                ],
                [
                  "Suturas (ex.: Ethicon)",
                  "Radiação de cobalto-60 ou gás óxido de etileno"
                ],
                [
                  "Objetos de vidro e materiais frágeis",
                  "Fornos elétricos (calor seco)"
                ],
                [
                  "Camas, aspiradores, ventiladores, incubadoras",
                  "Equipamento “Aseptor”, à base de fenol, automático"
                ]
              ]
            }
          },
          {
            "title": "Controle de qualidade e cobalto-60",
            "explanation": "<p>Todo processo de esterilização precisa de <strong>verificação</strong>. O texto-base descreve duas formas simples de confirmar que o processo foi atingido:</p><ul><li>tiras de papel especial que mudam de cor quando a esterilização é atingida;</li><li>tubos-testemunha que variam de cor quando se obtém a assepsia.</li></ul><p>Entre os métodos, o <strong>cobalto-60</strong> é descrito como o mais confiável de todos.</p><p><em>Fonte: T-I, Cap. 28, pp. 425–426.</em></p>",
            "example": "Ao abrir o pacote, a tira-testemunha que mudou de cor indica que o ciclo atingiu a esterilização.",
            "summary": "Verificar sempre (tiras e tubos-testemunha). O cobalto-60 é descrito como o método mais confiável, o único que pode dispensar testes de rotina e quarentena.",
            "boxes": [
              {
                "variant": "green",
                "label": "✅ Controle de qualidade",
                "text": "Tiras de papel especial ou tubos-testemunha mudam de cor quando a esterilização é atingida."
              },
              {
                "variant": "blue",
                "label": "🔢 Cobalto-60: o mais confiável",
                "text": "Segundo o texto-base, é o único processo de esterilização que pode ser dispensado de testes de rotina de esterilidade e quarentena, por oferecer níveis de segurança muito maiores que outros métodos."
              }
            ]
          }
        ],
        "exercises": [
          {
            "level": "facil",
            "q": "Como se confirma que o processo de esterilização foi atingido?",
            "options": [
              "Pelo cheiro do material ao abrir o pacote esterilizado",
              "Por tiras de papel especial ou tubos que mudam de cor",
              "Pela temperatura da sala da central de esterilização",
              "Não se confirma quando o equipamento usado é a autoclave"
            ],
            "correct": 1,
            "explain": "Todo processo precisa de verificação: tiras de papel especial que mudam de cor quando a esterilização é atingida, ou tubos-testemunha que variam de cor quando se obtém a assepsia."
          },
          {
            "level": "medio",
            "q": "Quais são os parâmetros clássicos da autoclave citados no texto-base?",
            "options": [
              "Cerca de 1 atmosfera e 60 °C, por 10 min de exposição",
              "Acima de 10 atm e 300 °C, por apenas 5 min de exposição",
              "Acima de 2 atm e > 140 °C, ou 20 libras a 121 °C por 30 min",
              "20 libras a 121 °C, mantidas por 12 horas de exposição"
            ],
            "correct": 2,
            "explain": "Os padrões são: acima de 2 atmosferas e temperatura > 140 °C, ou a variante de 20 libras a 121 °C durante 30 min."
          },
          {
            "level": "dificil",
            "q": "Por que sondas e cateteres de plástico não vão à autoclave, e o que se usa no lugar?",
            "options": [
              "O calor e a pressão danificariam o plástico; usa-se o óxido de etileno",
              "O plástico bloqueia o vapor; usa-se apenas o cobalto-60",
              "O plástico já vem estéril de fábrica e dispensa método",
              "O vapor deixa resíduos tóxicos; usa-se o calor seco em forno elétrico"
            ],
            "correct": 0,
            "explain": "O calor e a pressão da autoclave danificariam o plástico. Sondas, cateteres e equipos de plástico recebem óxido de etileno, que esteriliza a temperaturas bem mais baixas (esterilização a frio)."
          }
        ],
        "review": {
          "mindMap": [
            {
              "root": "Agentes esterilizantes",
              "children": [
                "Físicos: calor úmido, calor seco, filtração, radiações",
                "Químicos: gases (óxido de etileno, formaldeído) e líquidos em solução",
                "Esterilização a frio ≠ refrigeração"
              ]
            },
            {
              "root": "Autoclave",
              "children": [
                "> 2 atm e > 140 °C, ou 20 lb a 121 °C por 30 min",
                "Borracha: menos tempo",
                "Estéril só depois de seco no próprio equipamento"
              ]
            },
            {
              "root": "Material e método",
              "children": [
                "Metal, tecidos e campos: autoclave",
                "Plásticos, sondas e cateteres: óxido de etileno",
                "Suturas: cobalto-60 ou óxido de etileno",
                "Vidro e materiais frágeis: forno elétrico"
              ]
            },
            {
              "root": "Controle",
              "children": [
                "Tiras e tubos-testemunha",
                "Cobalto-60: o mais confiável de todos"
              ]
            }
          ],
          "summary": "Esterilização é física (calor, filtração, radiação) ou química (gases e líquidos). A autoclave é o padrão para instrumental e tecidos (com tempo menor para borracha); o óxido de etileno atende o plástico; o cobalto-60 é o mais confiável. O processo é sempre conferido por tiras ou tubos-testemunha.",
          "keywords": [
            "Calor úmido",
            "Autoclave",
            "Calor seco",
            "Óxido de etileno",
            "Cobalto-60",
            "Esterilização a frio",
            "Tubo-testemunha"
          ]
        },
        "connection": "O instrumental está estéril. A próxima aba trata do que se aplica sobre a pele e as mãos: os antissépticos."
      },
      {
        "id": "antisepticos",
        "label": "🧪 Antissépticos",
        "type": "lesson",
        "intro": {
          "why": "Um bom antisséptico precisa agir rápido, durar e ser seguro. Quatro monografias caem sempre: clorexidina, povidona iodada, timerosal e benzalconio — cada uma com indicações e cautelas próprias.",
          "where": "No preparo das mãos e da pele do paciente, em feridas, queimaduras e mucosas.",
          "importance": "Escolher o antisséptico certo e conhecer suas contraindicações evita eventos adversos, como a absorção de iodo em recém-nascidos.",
          "applications": "Selecionar o antisséptico adequado para cada situação clínica e reconhecer suas precauções."
        },
        "objectives": [
          "Listar as qualidades de um bom antisséptico",
          "Descrever indicações e posologia da clorexidina",
          "Reconhecer as contraindicações e precauções da povidona iodada",
          "Distinguir timerosal e benzalconio quanto a indicações, reações adversas e posologia"
        ],
        "sections": [
          {
            "title": "O que se espera de um bom antisséptico",
            "explanation": "<p>Os <span class='term' data-term='antissepsia'>antissépticos</span> são usados em <strong>tecido vivo</strong>. Um bom antisséptico reúne cinco qualidades:</p><ul><li><strong>ação rápida</strong>;</li><li><strong>ação persistente</strong> (efetiva por horas);</li><li><strong>ação cumulativa</strong> (a exposição repetida inibe o crescimento por dias);</li><li><strong>amplo espectro</strong>;</li><li><strong>uso seguro</strong>.</li></ul><p><em>Fonte: T-I, Cap. 28, pp. 425–427.</em></p>",
            "example": "A associação álcool + gluconato de clorexidina soma a ação rápida do álcool à atividade química persistente da clorexidina.",
            "summary": "Rápido, persistente, cumulativo, de amplo espectro e seguro. Quatro monografias caem sempre: clorexidina, povidona iodada, timerosal e benzalconio.",
            "boxes": [
              {
                "variant": "amber",
                "label": "🩺 Antisséptico × desinfetante",
                "text": "Antissépticos agem em <strong>tecido vivo</strong>; desinfetantes agem em <strong>material inanimado</strong>. Não troque um pelo outro."
              }
            ]
          },
          {
            "title": "Clorexidina (Hibitane, Hibiscrub)",
            "explanation": "<p>A <span class='term' data-term='clorexidina'>clorexidina</span> é o antisséptico de referência na lavagem das mãos do cirurgião.</p><ul><li><strong>Indicações</strong>: desinfecção pré-cirúrgica das mãos, preparo pré-operatório do paciente, antisséptico geral, feridas, desinfecção de material e instrumentação, gengivite e candidíase oral.</li><li><strong>Posologia (lavagem das mãos)</strong>: 5 mL de gluconato de clorexidina a 4% por 1 min, seguido de novo lavado com 5 mL por 2 min.</li><li><strong>Interações</strong>: incompatível com alginato de sódio, sabões comuns, etilmetilcelulose e carboximetilcelulose de sódio na mesma solução.</li></ul><p><em>Fonte: T-I, Cap. 28, pp. 425–427.</em></p>",
            "example": "Ao lavar as mãos com clorexidina, não se usa o sabão comum junto na mesma solução: a clorexidina é incompatível com sabões comuns.",
            "summary": "Clorexidina: preparo das mãos e da pele; 5 mL a 4% por 1 min + 5 mL por 2 min nas mãos; incompatível com sabões comuns, alginato de sódio e celuloses.",
            "boxes": [
              {
                "variant": "blue",
                "label": "🔢 Valor de referência",
                "text": "Lavagem das mãos: <strong>5 mL de gluconato de clorexidina a 4% por 1 min</strong>, seguido de novo lavado com <strong>5 mL por 2 min</strong>."
              }
            ]
          },
          {
            "title": "Povidona iodada a 10%",
            "explanation": "<p>A <span class='term' data-term='povidona-iodada'>povidona iodada</span> é o antisséptico de pele mais usado hoje, mas tem uma lista de cautelas que precisa ser conhecida.</p><ul><li><strong>Indicações</strong>: microbicida geral tópico para feridas contaminadas, lacerações, abrasões, queimaduras de 2º e 3º grau, preparo pré-operatório de mãos e campo cirúrgico, infecções bacterianas e micóticas da pele.</li><li><strong>Contraindicações</strong>: bócio nodular não tóxico e hipersensibilidade ao iodo; evitar em queimaduras extensas (> 20% da superfície corporal) pelo risco de absorção sistêmica.</li><li><strong>Precauções</strong>: gravidez (categoria C), hipotireoidismo congênito, recém-nascidos e prematuros (absorção de iodo), insuficiência renal (acidose metabólica) e hepática (hepatotóxico).</li></ul><p><em>Fonte: T-I, Cap. 28, pp. 425–427.</em></p>",
            "example": "Num recém-nascido que precisa de antissepsia de pele, a povidona iodada exige cautela especial, por causa da absorção de iodo.",
            "summary": "Povidona iodada a 10%: ampla indicação tópica; contraindicada no bócio nodular não tóxico e na hipersensibilidade ao iodo; cuidado em queimaduras extensas, recém-nascidos, prematuros e insuficiência renal ou hepática.",
            "boxes": [
              {
                "variant": "red",
                "label": "⚠️ Cautela redobrada",
                "text": "Recém-nascidos e prematuros (absorção de iodo), insuficiência renal (acidose metabólica), insuficiência hepática (hepatotóxico) e queimaduras extensas (> 20% da superfície corporal)."
              }
            ]
          },
          {
            "title": "Timerosal e benzalconio",
            "explanation": "<p>Duas monografias menores, mas que aparecem em prova:</p><ul><li><strong>Timerosal</strong> — indicações: desinfecção pré-operatória da pele e antisséptico em feridas abertas e infectadas, útil sobretudo em feridas superficiais e escoriações. Reações adversas: erupções eritematosas, vesiculares e papulares (hipersensibilidade); relatos de ototoxicidade e conjuntivite alérgica. Precaução: não usar quando o alumínio puder entrar em contato com a pele.</li><li><strong>Benzalconio</strong> — ação bactericida contra gram-positivos e, em altas concentrações, gram-negativos. Indicações: desinfecção de pele, feridas, queimaduras e mucosas; irrigação de feridas profundas, uretra e bexiga; xampu para dermatite seborreica. Posologia: limpeza de pele, mucosa e feridas a 0,01–0,1%; irrigação de feridas profundas a 0,005%.</li></ul><p><em>Fonte: T-I, Cap. 28, pp. 425–427.</em></p>",
            "example": "O timerosal é útil em feridas superficiais e escoriações; o benzalconio, em concentração de 0,005%, é usado na irrigação de feridas profundas.",
            "summary": "Timerosal: feridas superficiais; hipersensibilidade e ototoxicidade; não usar com contato com alumínio. Benzalconio: gram-positivos (e gram-negativos em altas concentrações); 0,01–0,1% na limpeza e 0,005% na irrigação profunda.",
            "table": {
              "title": "Resumo das quatro monografias",
              "rows": [
                [
                  "Clorexidina",
                  "Padrão para a lavagem cirúrgica das mãos; incompatível com sabões comuns."
                ],
                [
                  "Povidona iodada 10%",
                  "Antisséptico de pele mais usado; cautela em recém-nascidos, renais, hepáticos e queimaduras extensas."
                ],
                [
                  "Timerosal",
                  "Feridas superficiais; risco de hipersensibilidade e ototoxicidade; evitar contato com alumínio."
                ],
                [
                  "Benzalconio",
                  "Gram-positivos (e gram-negativos em altas concentrações); 0,01–0,1% na limpeza, 0,005% na irrigação profunda."
                ]
              ]
            }
          }
        ],
        "exercises": [
          {
            "level": "facil",
            "q": "Qual conjunto descreve as qualidades esperadas de um bom antisséptico?",
            "options": [
              "Ação lenta, para reduzir a irritação da pele",
              "Ação restrita aos gram-positivos, para poupar a flora",
              "Ação sobre material inanimado, com uso seguro apenas em instrumental",
              "Ação rápida, persistente, cumulativa, de amplo espectro e uso seguro"
            ],
            "correct": 3,
            "explain": "O bom antisséptico age rápido, tem ação persistente (efetiva por horas) e cumulativa (inibe o crescimento por dias), é de amplo espectro e de uso seguro. Agir sobre material inanimado é característica dos desinfetantes."
          },
          {
            "level": "medio",
            "q": "Em qual situação a povidona iodada exige cautela especial?",
            "options": [
              "Quando o alumínio puder entrar em contato com a pele",
              "Em recém-nascidos e prematuros, pela absorção de iodo",
              "Quando for usada junto com sabão comum na mesma solução",
              "Na irrigação de feridas profundas, uretra e bexiga"
            ],
            "correct": 1,
            "explain": "Recém-nascidos e prematuros absorvem iodo, e a povidona iodada exige cautela especial neles (além de insuficiência renal e hepática e queimaduras extensas). O alumínio é cuidado do timerosal; a incompatibilidade com sabão comum é da clorexidina; a irrigação profunda é indicação do benzalconio."
          },
          {
            "level": "dificil",
            "q": "Qual associação entre antisséptico e precaução está correta?",
            "options": [
              "Clorexidina — contraindicada no bócio nodular não tóxico",
              "Povidona iodada — incompatível com sabões comuns",
              "Timerosal — não usar quando o alumínio puder entrar em contato com a pele",
              "Benzalconio — risco de acidose metabólica na insuficiência renal"
            ],
            "correct": 2,
            "explain": "O alumínio é a precaução do timerosal. O bócio nodular não tóxico é contraindicação da povidona iodada; a incompatibilidade com sabões comuns é da clorexidina; a acidose metabólica na insuficiência renal é precaução da povidona iodada."
          }
        ],
        "review": {
          "mindMap": [
            {
              "root": "Qualidades",
              "children": [
                "Rápido e persistente (horas)",
                "Cumulativo (dias)",
                "Amplo espectro e uso seguro"
              ]
            },
            {
              "root": "Clorexidina",
              "children": [
                "Padrão para lavagem cirúrgica das mãos",
                "5 mL a 4% por 1 min + 5 mL por 2 min",
                "Incompatível com sabões comuns"
              ]
            },
            {
              "root": "Povidona iodada 10%",
              "children": [
                "Preparo de pele e de mãos",
                "Contraindicada: bócio nodular não tóxico, hipersensibilidade ao iodo",
                "Cautela: recém-nascidos, renal, hepático, queimaduras > 20%"
              ]
            },
            {
              "root": "Timerosal e benzalconio",
              "children": [
                "Timerosal: feridas superficiais; ototoxicidade; sem contato com alumínio",
                "Benzalconio: gram-positivos; 0,01–0,1% e 0,005%"
              ]
            }
          ],
          "summary": "Antissépticos agem em tecido vivo e devem ser rápidos, persistentes, cumulativos, de amplo espectro e seguros. A clorexidina é o padrão para as mãos; a povidona iodada a 10% é a mais usada na pele, com cautelas em recém-nascidos, insuficiência renal e hepática e queimaduras extensas; timerosal e benzalconio completam as quatro monografias.",
          "keywords": [
            "Clorexidina",
            "Povidona iodada",
            "Timerosal",
            "Benzalconio",
            "Ação persistente",
            "Ação cumulativa",
            "Amplo espectro"
          ]
        },
        "connection": "Antissépticos agem em tecido vivo. A próxima aba trata das soluções que desinfetam material inanimado — e de como decidir entre antissepsia, desinfecção e esterilização."
      },
      {
        "id": "desinfetantes",
        "label": "🫧 Desinfetantes e decisão",
        "type": "lesson",
        "intro": {
          "why": "Diferente dos antissépticos, as soluções desinfetantes tratam material inanimado. O glutaraldeído e o hipoclorito de sódio são os mais cobrados — cada um com uma pegadinha própria.",
          "where": "Na central de esterilização e na desinfecção de materiais que não toleram calor, como endoscópios, e de superfícies.",
          "importance": "Saber o tempo de exposição e as limitações de cada solução evita desinfetar de menos — ou estragar o material.",
          "applications": "Escolher a solução e o tempo certos e percorrer o fluxo de decisão entre antissepsia, desinfecção e esterilização."
        },
        "objectives": [
          "Citar as principais soluções desinfetantes e suas concentrações de uso",
          "Relacionar o tempo de exposição do glutaraldeído ao nível de desinfecção obtido",
          "Reconhecer as limitações do hipoclorito de sódio",
          "Explicar por que se limpa antes de desinfetar e percorrer o fluxo de decisão"
        ],
        "sections": [
          {
            "title": "Soluções desinfetantes e concentrações de uso",
            "explanation": "<p>Diferente dos antissépticos (usados em tecido vivo), estas soluções <span class='term' data-term='desinfeccao'>desinfetam</span> <strong>material inanimado</strong>. A tabela traz a concentração de uso de cada uma.</p><p><em>Fonte: T-I, Cap. 28, p. 426.</em></p>",
            "example": "O glutaraldeído a 2% e o hipoclorito de sódio a 1% são as duas soluções mais cobradas: a primeira, pelos tempos de exposição; a segunda, pelas limitações de uso.",
            "summary": "Glutaraldeído 2,0%, formaldeído aquoso 4,0%, peróxido de hidrogênio 7,0%, ácido acético 2,0%, hipoclorito de sódio 1,0%, fenol 2,0%, cetrimida aquosa 1:1000 e propilenoglicol 4,0%.",
            "table": {
              "title": "Concentração de uso",
              "rows": [
                [
                  "Glutaraldeído",
                  "2,0%"
                ],
                [
                  "Formaldeído aquoso",
                  "4,0%"
                ],
                [
                  "Peróxido de hidrogênio",
                  "7,0%"
                ],
                [
                  "Ácido acético",
                  "2,0%"
                ],
                [
                  "Hipoclorito de sódio",
                  "1,0%"
                ],
                [
                  "Fenol",
                  "2,0%"
                ],
                [
                  "Cetrimida aquosa",
                  "1:1000"
                ],
                [
                  "Formalina alcoólica (solução de Bush)",
                  "Sem concentração informada no texto-base"
                ],
                [
                  "Propilenoglicol",
                  "4,0%"
                ]
              ]
            }
          },
          {
            "title": "Glutaraldeído: o “camaleão” dos tempos de exposição",
            "explanation": "<p>O <span class='term' data-term='glutaraldeido'>glutaraldeído</span> tem amplo espectro, é ativo mesmo com matéria orgânica presente e não é corrosivo. O <strong>grau de desinfecção depende do tempo de exposição</strong>:</p><ul><li>Indicado para materiais que não toleram alta temperatura (endoscópios com fibra óptica, peças de borracha).</li><li>É tóxico: o instrumental precisa ser enxaguado depois de usado.</li><li>Perde eficácia 2 semanas após o preparo, ou se diluído (por exemplo, ao mergulhar instrumentos molhados sem secá-los).</li></ul><p><em>Fonte: T-I, Cap. 28, p. 426.</em></p>",
            "example": "Um endoscópio flexível com fibra óptica precisa de desinfecção de alto nível: o glutaraldeído a 2%, por 30 minutos, atende essa necessidade.",
            "summary": "Glutaraldeído a 2%: 12 h = esterilização; 30 min = desinfecção de alto nível; 10 min = desinfecção de baixo nível. Tóxico (enxaguar) e perde eficácia em 2 semanas ou se diluído.",
            "table": {
              "title": "Tempo de exposição e resultado",
              "rows": [
                [
                  "12 horas",
                  "Esterilização"
                ],
                [
                  "30 minutos",
                  "Desinfecção de alto nível"
                ],
                [
                  "10 minutos",
                  "Desinfecção de baixo nível"
                ]
              ]
            },
            "note": {
              "type": "warn",
              "text": "Os tempos de exposição seguem o texto-base cubano. Confira a bula e o protocolo da sua instituição antes de aplicá-los."
            }
          },
          {
            "title": "Hipoclorito de sódio a 1% e cresol",
            "explanation": "<p><strong>Hipoclorito de sódio a 1%</strong>: descrito como desinfetante de alto nível, mas de <strong>uso clínico mais limitado</strong>: o pH alcalino reduz sua atividade, o mesmo ocorrendo na presença de matéria orgânica. Além disso, corrói material metálico.</p><p><strong>Cresol</strong>: ação semelhante à do fenol. Foi substituído por antissépticos modernos mais potentes e menos irritantes, mas seu uso persiste pelo custo reduzido. Usado como desinfetante de objetos inanimados e de excrementos, em desinfecção doméstica e hospitalar.</p><p><em>Fonte: T-I, Cap. 28, p. 426.</em></p>",
            "example": "Para desinfetar instrumentos metálicos, o hipoclorito de sódio é uma escolha ruim: além de perder atividade com matéria orgânica, corrói o metal.",
            "summary": "Hipoclorito de sódio 1%: atividade reduzida por pH alcalino e matéria orgânica; corrói metal. Cresol: parecido com o fenol; mantido pelo baixo custo, para objetos inanimados e excrementos.",
            "boxes": [
              {
                "variant": "purple",
                "label": "🔀 Divergência no texto-base",
                "text": "O texto descreve o hipoclorito como desinfetante de <strong>alto nível</strong> nesta seção, mas o cita no nível <strong>intermediário</strong> na lista de níveis de desinfecção (aula “Conceitos”). Confirme a classificação com o protocolo da sua instituição."
              }
            ]
          },
          {
            "title": "Armadilha clássica: limpar antes de desinfetar",
            "explanation": "<p>Se o material estiver sujo de sangue, pus ou matéria orgânica, o poder de <strong>qualquer</strong> desinfetante cai: a matéria orgânica age como uma barreira física entre o produto e a superfície.</p><p>Por isso a ordem é sempre a mesma: <strong>limpeza mecânica com água e detergente, depois o desinfetante</strong>.</p><p><em>Fonte: T-I, Cap. 28, p. 426.</em></p>",
            "example": "Um instrumental chega coberto de sangue e restos de tecido: primeiro a limpeza mecânica com água e detergente; só depois, o glutaraldeído por 30 minutos para desinfecção de alto nível.",
            "summary": "Matéria orgânica reduz a eficácia de qualquer desinfetante: sempre limpar antes de desinfetar. Aumentar a concentração ou o tempo não compensa a sujeira.",
            "boxes": [
              {
                "variant": "red",
                "label": "⚠️ Armadilha clássica",
                "text": "Sempre <strong>limpar antes de desinfetar</strong>. A matéria orgânica (sangue, pus) é uma barreira física entre o desinfetante e a superfície."
              }
            ]
          },
          {
            "title": "Fluxo de decisão: antissepsia, desinfecção ou esterilização",
            "explanation": "<p>Diante de qualquer objeto ou área a tratar, percorra as perguntas na ordem. Isso define se você precisa de antissepsia, desinfecção ou esterilização:</p><ol><li>É <strong>tecido vivo</strong> ou <strong>material inerte</strong> (fômite)?</li><li><strong>Tecido vivo</strong> (mãos e pele): antissepsia, com lavado + antisséptico.</li><li><strong>Material inerte</strong>: classifique por Spaulding. <strong>Crítico</strong> → esterilização (autoclave, óxido de etileno, radiação); <strong>semicrítico</strong> → estéril ou desinfecção de alto nível; <strong>não crítico</strong> → limpeza ± desinfecção de baixo nível.</li><li><strong>Ambiente e superfícies</strong>: limpeza + desinfetante adequado.</li><li>Antes de qualquer desinfecção, há matéria orgânica visível? <strong>Limpar primeiro</strong>.</li></ol><p><em>Fonte: T-I, Cap. 28, pp. 421–426.</em></p>",
            "example": "Um endoscópio flexível é semicrítico e não tolera calor e umidade: não vai à autoclave; recebe desinfecção de alto nível com glutaraldeído (ou um método a frio equivalente).",
            "summary": "Primeiro: vivo ou inerte? Se inerte, classificar por Spaulding (crítico: esterilizar; semicrítico: estéril ou alto nível; não crítico: limpar) e sempre limpar antes de desinfetar.",
            "image": "Fluxograma: tecido vivo × material inerte → classificação de Spaulding → método indicado",
            "note": {
              "type": "tip",
              "text": "A pergunta “o material tolera calor e umidade?” entra nos ramos crítico e semicrítico: se tolera, autoclave; se não, óxido de etileno, radiação ou desinfecção de alto nível."
            }
          }
        ],
        "exercises": [
          {
            "level": "facil",
            "q": "Que tempo de exposição ao glutaraldeído a 2% produz esterilização?",
            "options": [
              "12 horas",
              "30 minutos",
              "1 hora",
              "10 minutos"
            ],
            "correct": 0,
            "explain": "Com 12 horas, o glutaraldeído a 2% produz esterilização. Com 30 minutos, desinfecção de alto nível; com 10 minutos, desinfecção de baixo nível."
          },
          {
            "level": "medio",
            "q": "Que cuidado é necessário depois de usar o glutaraldeído no instrumental?",
            "options": [
              "Nenhum cuidado, pois o glutaraldeído não é tóxico",
              "Reaplicar o produto de imediato por mais 10 minutos",
              "Secar sem enxaguar, para manter o efeito do produto",
              "Enxaguar o instrumental, pois o glutaraldeído é tóxico"
            ],
            "correct": 3,
            "explain": "O glutaraldeído é tóxico: o instrumental precisa ser enxaguado depois de usado. Ele também perde eficácia 2 semanas após o preparo ou se diluído (por exemplo, ao mergulhar instrumentos molhados sem secá-los)."
          },
          {
            "level": "dificil",
            "q": "Qual afirmação descreve corretamente o hipoclorito de sódio a 1%, segundo o texto-base?",
            "options": [
              "É não corrosivo e continua ativo mesmo com matéria orgânica presente",
              "Perde atividade com pH alcalino e matéria orgânica, e corrói metal",
              "É o antisséptico de escolha para a pele do paciente cirúrgico",
              "Produz esterilização após 12 horas de exposição ao produto"
            ],
            "correct": 1,
            "explain": "O pH alcalino e a matéria orgânica reduzem a atividade do hipoclorito de sódio, e ele corrói material metálico. Ser não corrosivo e ativo com matéria orgânica, e os tempos de 12 h, 30 min e 10 min, são características do glutaraldeído."
          }
        ],
        "review": {
          "mindMap": [
            {
              "root": "Soluções e concentrações",
              "children": [
                "Glutaraldeído 2%; hipoclorito de sódio 1%; fenol 2%",
                "Peróxido de hidrogênio 7%; formaldeído aquoso 4%",
                "Cetrimida 1:1000; propilenoglicol 4%"
              ]
            },
            {
              "root": "Glutaraldeído",
              "children": [
                "12 h = esterilização",
                "30 min = alto nível",
                "10 min = baixo nível",
                "Tóxico (enxaguar); perde eficácia em 2 semanas ou se diluído"
              ]
            },
            {
              "root": "Limitações",
              "children": [
                "Hipoclorito: pH alcalino e matéria orgânica reduzem a atividade; corrói metal",
                "Cresol: parecido com o fenol; mantido pelo custo"
              ]
            },
            {
              "root": "Decisão",
              "children": [
                "Vivo ou inerte?",
                "Inerte: Spaulding",
                "Limpar antes de desinfetar"
              ]
            }
          ],
          "summary": "Desinfetantes tratam material inanimado. O glutaraldeído a 2% depende do tempo (12 h esteriliza, 30 min dá alto nível, 10 min dá baixo nível); o hipoclorito tem uso limitado. Matéria orgânica reduz qualquer desinfetante: limpar antes. O fluxo de decisão parte de vivo × inerte e de Spaulding.",
          "keywords": [
            "Glutaraldeído",
            "Hipoclorito de sódio",
            "Cresol",
            "Matéria orgânica",
            "Fômite",
            "Spaulding",
            "Fluxo de decisão"
          ]
        },
        "connection": "Você já escolhe entre antissepsia, desinfecção e esterilização. A última aba reúne a revisão dos pontos críticos, as fontes comparadas e as conexões com outros temas."
      },
      {
        "id": "revisao",
        "label": "📚 Revisão e fontes",
        "type": "lesson",
        "intro": {
          "why": "Esta aba junta o que mais cai em prova, mostra de onde vem o conteúdo e como ele se conecta com os outros temas. É o melhor lugar para fechar o estudo do módulo.",
          "where": "Na revisão final do módulo e na ligação com outros temas do Tomo I e do Tomo II.",
          "importance": "Dez pontos críticos concentram o essencial. Conhecer as fontes ajuda a saber o quanto confiar em cada afirmação — e quando conferir o protocolo da sua instituição.",
          "applications": "Revisar antes de provas e plantões, e saber para onde seguir o estudo."
        },
        "objectives": [
          "Revisar os dez pontos críticos do módulo",
          "Saber de onde vem o conteúdo e como as fontes se comparam",
          "Relacionar asepsia e antissepsia a outros temas da cirurgia"
        ],
        "sections": [
          {
            "title": "Dez pontos críticos",
            "explanation": "<p>Se você só tiver alguns minutos, revise estes dez pontos:</p><ol><li>Antissepsia = químicos em tecido vivo. Assepsia = eliminação de germes, geralmente por meios físicos.</li><li>Desinfecção tem 3 níveis (alto, intermediário e baixo); esterilização não admite nenhum agente vivo.</li><li>Spaulding: artigos críticos (sempre estéreis), semicríticos (estéreis ou desinfecção de alto nível) e não críticos (limpeza).</li><li>Semmelweis (lavagem das mãos, 1847) → Pasteur (teoria dos germes) → Lister (antissepsia, 1867) → Von Bergman (assepsia a vapor, 1886) → Halsted (luvas de borracha, 1890).</li><li>Antes da era asséptica: 80–90% de infecção. Depois de Semmelweis e Lister: 30–35%.</li><li>Lavado social (10–20 s) → higiênico (~2 min) → cirúrgico (10 min de escovação, tradição cubana).</li><li>Autoclave: > 2 atm e > 140 °C, ou 20 libras a 121 °C por 30 min. Cobalto-60 é descrito como o método mais confiável de todos.</li><li>Glutaraldeído: 12 h = esteriliza; 30 min = alto nível; 10 min = baixo nível.</li><li>Povidona iodada a 10% é o antisséptico de pele mais usado hoje; clorexidina é o padrão para a lavagem cirúrgica das mãos.</li><li>Matéria orgânica reduz a eficácia de qualquer desinfetante: sempre limpar antes de desinfetar.</li></ol><p><em>Fonte: T-I, Cap. 28, pp. 419–427.</em></p>",
            "example": "Ao ler “glutaraldeído por 30 minutos”, lembre: é desinfecção de alto nível, e não esterilização (que exige 12 horas).",
            "summary": "Termos e níveis; Spaulding; linha do tempo; lavagem das mãos; esterilização e seus parâmetros; glutaraldeído; antissépticos; e a regra de limpar antes de desinfetar."
          },
          {
            "title": "Fontes comparadas",
            "explanation": "<p>A base do módulo é o <strong>Tomo I, Cap. 28, “Asepsia y antisepsia”</strong> (Ecimed, 2018). Para comparar, usou-se a edição anterior de <em>Cirugía</em> (García Gutiérrez e Vázquez Montpellier), de mesmo título, e o caderno de respostas de autoavaliação dela. Nenhuma fonte externa ao acervo foi usada.</p>",
            "example": "Se a edição de 2018 e o caderno de respostas coincidem sobre a origem do conceito de assepsia (Bergmann, 1886), a informação pode ser tratada como confirmada nas duas fontes.",
            "summary": "As duas fontes concordam no essencial; a diferença é de profundidade (a edição de 2018 é muito mais detalhada).",
            "table": {
              "title": "Edição de 2018 (base) × edição comparada",
              "rows": [
                [
                  "Origem do conceito de assepsia",
                  "Atribuída a Von Bergman (1886), pela esterilização a vapor. O caderno de respostas confirma: o conceito de assepsia se deve a Bergmann, ao introduzir em 1886 a esterilização por vapor."
                ],
                [
                  "Fatores que reduzem a resistência do hospedeiro",
                  "Discutidos de forma dispersa (imunidade, doenças crônicas). A edição comparada traz uma lista objetiva: imunodeprimidos, obesos, diabéticos e traumatizados têm resistência diminuída."
                ],
                [
                  "Papel do timerosal",
                  "Monografia completa (indicações, reações adversas, precauções). A edição comparada traz um resumo direto: útil em feridas superficiais e escoriações, como antisséptico. Sem contradição."
                ],
                [
                  "Antissépticos e lavagem das mãos",
                  "Detalha várias soluções e técnicas. A edição comparada reforça o princípio central: não se deve prescindir da lavagem das mãos, mesmo usando antissépticos."
                ]
              ]
            },
            "boxes": [
              {
                "variant": "green",
                "label": "🔀 Como decidir",
                "text": "As duas fontes concordam integralmente no essencial deste tema: não há divergência real, apenas diferença de profundidade. Use a edição de 2018 como texto principal."
              },
              {
                "variant": "purple",
                "label": "⚠️ Atenção ao estudar",
                "text": "Este módulo reproduz o texto-base cubano. Tempos, pressões e concentrações podem diferir de outros protocolos; na prática clínica, siga o protocolo da sua instituição."
              }
            ]
          },
          {
            "title": "Conexões com outros temas",
            "explanation": "<p>Asepsia e antissepsia atravessam muitos capítulos da cirurgia. Depois deste módulo, vale seguir para:</p><ul><li>Cicatrização (T-I)</li><li>Infecções cirúrgicas (T-I)</li><li>Antibióticos e cirurgia (T-I)</li><li>Instrumental e materiais de sutura (T-I)</li><li>Abdome agudo — síndrome peritoneal (T-II)</li></ul><p><em>Fonte: T-I, Cap. 28, pp. 419–427; edição comparada de Cirugía e seu caderno de autoavaliação.</em></p>",
            "example": "Entender a esterilização do instrumental ajuda a estudar “Instrumental e materiais de sutura”; entender as fontes de infecção ajuda a estudar “Infecções cirúrgicas”.",
            "summary": "Cicatrização, infecções cirúrgicas, antibióticos, instrumental e suturas e abdome agudo são os próximos passos naturais."
          }
        ],
        "exercises": [
          {
            "level": "facil",
            "q": "Em ordem crescente de intensidade, qual alternativa organiza corretamente limpeza, desinfecção e esterilização?",
            "options": [
              "Esterilização → limpeza → desinfecção",
              "Desinfecção → esterilização → limpeza",
              "Limpeza → desinfecção → esterilização",
              "Limpeza → esterilização → desinfecção"
            ],
            "correct": 2,
            "explain": "A escada de intensidade vai da limpeza (remove a sujeira), passa pela desinfecção (ação letal em três níveis) e chega à esterilização (nenhum agente vivo capaz de se reproduzir)."
          },
          {
            "level": "medio",
            "q": "Um lote chega à central com pinças metálicas, um endoscópio flexível com fibra óptica e sondas de plástico. Qual associação está correta?",
            "options": [
              "Pinças: autoclave; endoscópio: glutaraldeído; sondas: óxido de etileno",
              "Todos na autoclave, pelo mesmo tempo, por serem do mesmo lote",
              "Pinças: glutaraldeído por 10 min; endoscópio: autoclave; sondas: calor seco",
              "Pinças: óxido de etileno; endoscópio: autoclave; sondas: autoclave"
            ],
            "correct": 0,
            "explain": "Instrumental metálico tolera calor e umidade: autoclave. O endoscópio com fibras ópticas não tolera altas temperaturas: desinfecção de alto nível com glutaraldeído (30 min) ou método a frio. Sondas de plástico: óxido de etileno."
          },
          {
            "level": "dificil",
            "q": "Qual das afirmações a seguir é verdadeira?",
            "options": [
              "A desinfecção de alto nível substitui a esterilização",
              "Lister introduziu a esterilização a vapor, em 1886",
              "A pressão positiva faz o ar fluir das áreas adjacentes para o centro cirúrgico",
              "A matéria orgânica reduz a eficácia de qualquer desinfetante; por isso se limpa antes"
            ],
            "correct": 3,
            "explain": "A matéria orgânica age como barreira física e reduz a ação de qualquer desinfetante. A desinfecção de alto nível não substitui a esterilização; a esterilização a vapor é de Von Bergman (1886); e, com pressão positiva, o ar flui da zona asséptica para as áreas adjacentes."
          }
        ],
        "review": {
          "mindMap": [
            {
              "root": "Termos e classificação",
              "children": [
                "Antissepsia, assepsia, descontaminação, limpeza, desinfecção, esterilização",
                "Spaulding: críticos, semicríticos e não críticos"
              ]
            },
            {
              "root": "História",
              "children": [
                "Semmelweis → Pasteur → Lister → Von Bergman → Halsted"
              ]
            },
            {
              "root": "Técnica",
              "children": [
                "Mãos: social, higiênico e cirúrgico",
                "Ambiente: fluxo laminar, pressão positiva, 20 trocas/h",
                "Esterilização: autoclave, óxido de etileno, cobalto-60"
              ]
            },
            {
              "root": "Soluções",
              "children": [
                "Antissépticos: clorexidina, povidona iodada, timerosal, benzalconio",
                "Desinfetantes: glutaraldeído e hipoclorito",
                "Limpar antes de desinfetar"
              ]
            }
          ],
          "summary": "O módulo vai dos conceitos (seis termos e Spaulding) à história (Semmelweis a Halsted), passando por mãos, pele, ambiente, esterilização, antissépticos e desinfetantes. A regra que atravessa tudo: limpar antes de desinfetar, e nunca tratar a desinfecção de alto nível como esterilização.",
          "keywords": [
            "Dez pontos críticos",
            "Fontes comparadas",
            "Spaulding",
            "Limpar antes de desinfetar",
            "Cobalto-60",
            "Glutaraldeído",
            "Clorexidina"
          ]
        },
        "connection": "Módulo concluído. Faça o caso clínico e o quiz para consolidar o que estudou."
      },
      {
        "id": "caso",
        "label": "🏥 Casos clínicos",
        "type": "case",
        "steps": [
          {
            "tag": "Caso A · Etapa 1/5 · Apresentação",
            "title": "Caso A: lavagem cirúrgica das mãos",
            "body": "<p>Cirurgiã residente vai realizar sua primeira apendicectomia como cirurgiã principal. Precisa fazer a lavagem cirúrgica das mãos.</p>",
            "variant": "blue",
            "label": "Apresentação"
          },
          {
            "tag": "Caso A · Etapa 2/5 · Início do lavado",
            "title": "Sabão, escova e atenção aos detalhes",
            "body": "<p>Ela lava as mãos com sabão comum e escova, até 2 polegadas acima do cotovelo, insistindo nos espaços interdigitais e no sulco subungueal.</p>",
            "variant": "blue",
            "label": "Situação"
          },
          {
            "tag": "Caso A · Etapa 3/5 · Decisão",
            "title": "Quanto tempo de escovação?",
            "body": "<p><strong>Pergunta:</strong> Qual é a duração tradicional da escovação descrita para o lavado cirúrgico?</p><ol type='A'><li>1 minuto</li><li>10 minutos</li><li>30 minutos</li></ol><details><summary><strong>Ver a resposta</strong></summary><p><strong>Resposta: B) 10 minutos</strong></p><p>A tradição cubana de escovação para o lavado cirúrgico é de 10 minutos, dividida em duas partes de cerca de 6 min e depois até completar o total (T-I, Cap. 28, p. 423). Outros protocolos podem usar tempos diferentes: siga o da sua instituição.</p></details>",
            "variant": "amber",
            "label": "Decisão"
          },
          {
            "tag": "Caso A · Etapa 4/5 · Decisão",
            "title": "Secagem e antisséptico",
            "body": "<p>Ela seca as mãos com pano estéril, das mãos ao cotovelo, sem voltar às mãos, e aplica antisséptico.</p><p><strong>Pergunta:</strong> Qual a sequência correta de aplicação do antisséptico e o tempo total?</p><ol type='A'><li>Do cotovelo para os dedos; 10 min</li><li>Das pontas dos dedos até o cotovelo; 3–5 min</li><li>Só nas palmas; 30 s</li></ol><details><summary><strong>Ver a resposta</strong></summary><p><strong>Resposta: B) Das pontas dos dedos até o cotovelo; 3–5 min</strong></p><p>Aplica-se da ponta dos dedos até o cotovelo, deixando escorrer, com tempo total de 3 a 5 minutos (p. 424).</p></details>",
            "variant": "amber",
            "label": "Decisão"
          },
          {
            "tag": "Caso A · Etapa 5/5 · Evolução",
            "title": "Ponto para levar",
            "body": "<p>O lavado cirúrgico completo — mecânico + antisséptico — busca eliminar a flora transitória e reduzir a residente a níveis mínimos, e <strong>não deve ser substituído apenas pelo uso de luvas estéreis</strong>.</p>",
            "variant": "green",
            "label": "Evolução"
          },
          {
            "tag": "Caso B · Etapa 1/5 · Apresentação",
            "title": "Caso B: o lote misto da central de material",
            "body": "<p>A central de material esterilizado (CME) recebe um lote misto: pinças metálicas, um endoscópio flexível com fibra óptica e sondas de plástico.</p>",
            "variant": "blue",
            "label": "Apresentação"
          },
          {
            "tag": "Caso B · Etapa 2/5 · Decisão 1",
            "title": "Pinças metálicas",
            "body": "<p><strong>Pergunta:</strong> Qual método é mais indicado para as pinças metálicas?</p><ol type='A'><li>Óxido de etileno</li><li>Autoclave (calor úmido)</li><li>Fenol em spray</li></ol><details><summary><strong>Ver a resposta</strong></summary><p><strong>Resposta: B) Autoclave (calor úmido)</strong></p><p>Instrumental metálico tolera calor e umidade: a autoclave é o método padrão, com esterilização completa confirmada após secagem dentro do próprio equipamento (T-I, Cap. 28, pp. 425–426).</p></details>",
            "variant": "amber",
            "label": "Decisão"
          },
          {
            "tag": "Caso B · Etapa 3/5 · Decisão 2",
            "title": "Endoscópio flexível",
            "body": "<p><strong>Pergunta:</strong> E para o endoscópio flexível, com fibras ópticas delicadas?</p><ol type='A'><li>Autoclave, sem restrição</li><li>Fervura por 5 minutos</li><li>Glutaraldeído (desinfecção de alto nível) ou método a frio equivalente</li></ol><details><summary><strong>Ver a resposta</strong></summary><p><strong>Resposta: C) Glutaraldeído (desinfecção de alto nível) ou método a frio equivalente</strong></p><p>Materiais que não toleram altas temperaturas usam desinfecção de alto nível com glutaraldeído (30 min) ou métodos “a frio”, como óxido de etileno ou radiação (pp. 422 e 426).</p></details>",
            "variant": "amber",
            "label": "Decisão"
          },
          {
            "tag": "Caso B · Etapa 4/5 · Decisão 3",
            "title": "Sondas e cateteres de plástico",
            "body": "<p><strong>Pergunta:</strong> E para as sondas e cateteres de plástico?</p><ol type='A'><li>Calor seco em forno elétrico a 180 °C</li><li>Álcool puro por 1 minuto</li><li>Óxido de etileno</li></ol><details><summary><strong>Ver a resposta</strong></summary><p><strong>Resposta: C) Óxido de etileno</strong></p><p>Sondas, cateteres e equipos de plástico são esterilizados por óxido de etileno, que atua em temperaturas bem mais baixas que o calor seco ou o vapor (p. 425).</p></details>",
            "variant": "amber",
            "label": "Decisão"
          },
          {
            "tag": "Caso B · Etapa 5/5 · Evolução",
            "title": "Ponto para levar",
            "body": "<p>A escolha do método de esterilização depende do material — <strong>não existe “um método para tudo”</strong>. Confundir isso danifica equipamentos ou deixa material mal esterilizado.</p>",
            "variant": "green",
            "label": "Evolução"
          },
          {
            "tag": "Caso C · Etapa 1/4 · Apresentação",
            "title": "Caso C: instrumental coberto de sangue",
            "body": "<p>Um instrumental foi usado em uma cirurgia contaminada e chega à central de material coberto de sangue e restos de tecido, sem limpeza prévia.</p>",
            "variant": "blue",
            "label": "Apresentação"
          },
          {
            "tag": "Caso C · Etapa 2/4 · Decisão 1",
            "title": "O primeiro passo",
            "body": "<p><strong>Pergunta:</strong> Antes de aplicar qualquer desinfetante, qual é o passo obrigatório?</p><ol type='A'><li>Nenhum, o desinfetante já resolve tudo</li><li>Aumentar a concentração do desinfetante para compensar</li><li>Limpeza mecânica com água e detergente para remover a matéria orgânica</li></ol><details><summary><strong>Ver a resposta</strong></summary><p><strong>Resposta: C) Limpeza mecânica com água e detergente para remover a matéria orgânica</strong></p><p>Matéria orgânica (sangue, pus) atua como barreira física entre o desinfetante e a superfície, reduzindo drasticamente sua eficácia — por isso a limpeza sempre vem antes da desinfecção (T-I, Cap. 28, p. 426).</p></details>",
            "variant": "amber",
            "label": "Decisão"
          },
          {
            "tag": "Caso C · Etapa 3/4 · Decisão 2",
            "title": "Escolha do desinfetante",
            "body": "<p>Depois de limpo, o instrumental precisa de desinfecção de alto nível em cerca de 30 minutos.</p><p><strong>Pergunta:</strong> Qual solução e tempo de exposição batem com essa necessidade?</p><ol type='A'><li>Hipoclorito de sódio por 5 minutos</li><li>Glutaraldeído por 30 minutos</li><li>Álcool a 40% por 1 hora</li></ol><details><summary><strong>Ver a resposta</strong></summary><p><strong>Resposta: B) Glutaraldeído por 30 minutos</strong></p><p>O glutaraldeído a 2% atinge desinfecção de alto nível em 30 minutos de exposição (10 min = baixo nível; 12 h = esterilização) (p. 426).</p></details>",
            "variant": "amber",
            "label": "Decisão"
          },
          {
            "tag": "Caso C · Etapa 4/4 · Evolução",
            "title": "Ponto para levar",
            "body": "<p>“Limpar antes de desinfetar” não é só boa prática: é o que garante que o desinfetante realmente alcance e mate os micro-organismos na superfície do material.</p>",
            "variant": "green",
            "label": "Evolução"
          }
        ]
      },
      {
        "id": "quiz",
        "label": "🧠 Quiz",
        "type": "quiz",
        "questions": [
          {
            "q": "A antissepsia se diferencia da assepsia porque:",
            "options": [
              "Usa apenas meios físicos, como calor e filtros",
              "Só se aplica a objetos e superfícies inanimadas",
              "Aplica substâncias químicas ao tecido vivo",
              "É um sinônimo de esterilização do instrumental"
            ],
            "correct": 2,
            "explain": "A antissepsia aplica substâncias químicas ao tecido vivo. Os meios físicos são típicos da assepsia; aplicar-se apenas a material inanimado é característica da desinfecção e da esterilização; e antissepsia e esterilização são conceitos distintos."
          },
          {
            "q": "A desinfecção de alto nível pode substituir a esterilização quando não há autoclave disponível?",
            "options": [
              "Não: não elimina todos os agentes vivos capazes de se reproduzir",
              "Sim: neste caso o efeito é o mesmo da esterilização",
              "Sim, desde que a exposição dure ao menos 10 minutos",
              "Sim, para qualquer artigo crítico, semicrítico ou não crítico"
            ],
            "correct": 0,
            "explain": "A desinfecção de alto nível atua sobre bactérias, fungos e algumas esporas, mas não elimina todos os agentes vivos; por isso não substitui a esterilização."
          },
          {
            "q": "Um artigo que entra em contato apenas com pele íntegra é classificado, segundo Spaulding, como:",
            "options": [
              "Crítico",
              "Não crítico",
              "Semicrítico",
              "Nenhuma das anteriores"
            ],
            "correct": 1,
            "explain": "Não crítico: contato com pele íntegra ou sem contato com o paciente (exige limpeza e secagem). Crítico acessa cavidades normalmente estéreis; semicrítico contata pele não íntegra ou mucosas."
          },
          {
            "q": "A quem se atribui a introdução da lavagem das mãos com água clorada para reduzir a mortalidade puerperal?",
            "options": [
              "Joseph Lister",
              "Robert Koch",
              "William Halsted",
              "Ignaz Semmelweis"
            ],
            "correct": 3,
            "explain": "Semmelweis associou a mortalidade puerperal ao contato dos médicos com necrópsias e instituiu a lavagem das mãos com água clorada. Lister trabalhou com antissepsia química mais tarde; Koch, com postulados microbiológicos; Halsted introduziu as luvas de borracha."
          },
          {
            "q": "O conceito de “asepsia” está historicamente associado a:",
            "options": [
              "Von Bergman e a esterilização a vapor (1886)",
              "Fleming e a descoberta da penicilina",
              "Pasteur e a teoria dos germes (fermentação)",
              "Halsted e as luvas de borracha (1890)"
            ],
            "correct": 0,
            "explain": "Von Bergman introduziu em 1886 a esterilização a vapor de todo o instrumental e material cirúrgico: nasce o conceito de assepsia. Pasteur embasou a teoria dos germes; Halsted introduziu as luvas; Fleming descobriu a penicilina."
          },
          {
            "q": "Uma enfermeira vai medir a pressão arterial de um paciente, sem procedimento invasivo. Qual lavagem das mãos é suficiente?",
            "options": [
              "Lavado cirúrgico (10 min)",
              "Lavado higiênico (cerca de 2 min)",
              "Lavado social (10–20 s)",
              "Nenhuma lavagem é necessária"
            ],
            "correct": 2,
            "explain": "O lavado social (água e sabão, 10–20 s) basta para contato sem risco e sem procedimento invasivo. O higiênico é para manobras críticas, como procedimentos invasivos; o cirúrgico, para manobras cirúrgicas. Sempre se lavam as mãos."
          },
          {
            "q": "O mínimo recomendado de trocas de ar por hora no centro cirúrgico é de:",
            "options": [
              "5 trocas, todas com ar fresco",
              "10 trocas, com ao menos 2 de ar fresco",
              "50 trocas, sem ar fresco",
              "20 trocas, com ao menos 4 de ar fresco"
            ],
            "correct": 3,
            "explain": "O mínimo recomendado é de 20 trocas de ar por hora, das quais ao menos 4 com ar fresco. Os valores de 5 e 10 ficam abaixo do mínimo, e 50 está muito acima do que o texto-base recomenda."
          },
          {
            "q": "Qual método é considerado o mais confiável entre todos os processos de esterilização?",
            "options": [
              "Calor seco em forno elétrico",
              "Radiação com cobalto-60",
              "Fenol em spray",
              "Álcool a 70%"
            ],
            "correct": 1,
            "explain": "O cobalto-60 é descrito como o mais confiável de todos. O álcool a 70% é desinfetante de nível intermediário; o fenol é desinfetante de superfícies, não esterilizante confiável de instrumental."
          },
          {
            "q": "Materiais de borracha podem ficar na autoclave pelo mesmo tempo que o instrumental metálico, sem risco de dano?",
            "options": [
              "Não: o tempo de exposição é menor, pelo risco de deterioração da borracha",
              "Sim: a borracha suporta o mesmo tempo de exposição do metal",
              "Sim, desde que o material seja seco fora do equipamento depois",
              "Não: a borracha só pode ser esterilizada por radiação gama"
            ],
            "correct": 0,
            "explain": "Para o material de borracha, o tempo de exposição na autoclave é menor, pelo risco de deterioração. A confirmação de que o material está completamente estéril só vem depois de seco dentro do próprio equipamento."
          },
          {
            "q": "O antisséptico mais usado atualmente no preparo da pele, por causar menos irritação que o iodo isolado, é:",
            "options": [
              "Timerosal",
              "Benzalconio",
              "Povidona iodada a 10%",
              "Cresol"
            ],
            "correct": 2,
            "explain": "A povidona iodada a 10% combina iodo com polivinilpirrolidona: é menos irritante e tem maior disponibilidade do produto ao longo do tempo. Timerosal e benzalconio são outras monografias de antissépticos; o cresol é desinfetante de objetos inanimados."
          },
          {
            "q": "O glutaraldeído a 2%, com exposição de 30 minutos, produz:",
            "options": [
              "Esterilização completa",
              "Desinfecção de alto nível",
              "Desinfecção de baixo nível",
              "Nenhum efeito"
            ],
            "correct": 1,
            "explain": "Com 30 minutos, o glutaraldeído a 2% produz desinfecção de alto nível. Esterilização exige 12 horas; a desinfecção de baixo nível corresponde a 10 minutos."
          },
          {
            "q": "Um instrumental chega à central coberto de sangue. Antes de aplicar o desinfetante, o que se deve fazer?",
            "options": [
              "Aumentar a concentração do desinfetante",
              "Aplicar o desinfetante diretamente, por mais tempo",
              "Descartar o desinfetante e usar apenas álcool puro",
              "Realizar limpeza mecânica prévia com água e detergente"
            ],
            "correct": 3,
            "explain": "A matéria orgânica (sangue, pus) age como barreira física e reduz a eficácia de qualquer desinfetante. Por isso a limpeza mecânica com água e detergente vem sempre antes."
          }
        ]
      }
    ]
  },
  "terms": {
    "antissepsia": {
      "name": "Antissepsia",
      "defSimple": "Usar substâncias químicas na pele ou nas mucosas para combater a infecção.",
      "defAcademic": "Método para combater a infecção mediante substâncias químicas aplicadas ao tecido vivo, que previnem o crescimento de micro-organismos ou inibem sua atividade.",
      "example": "Passar uma solução antisséptica na pele do paciente antes da incisão.",
      "curiosity": "Foi a ideia central de Lister (1867), que usou ácido fênico em curativos e no ar do centro cirúrgico.",
      "related": [
        "assepsia",
        "listerismo",
        "povidona-iodada",
        "clorexidina"
      ]
    },
    "assepsia": {
      "name": "Assepsia",
      "defSimple": "Impedir que os germes cheguem, quase sempre por meios físicos como o calor.",
      "defAcademic": "Destruição de todos os germes capazes de produzir infecção, geralmente por meios físicos (calor, filtros de asbesto, fluxo laminar, ultrassom, radiações).",
      "example": "Levar o instrumental à autoclave e usar fluxo laminar na sala de cirurgia.",
      "curiosity": "O conceito se deve a Von Bergman, que introduziu em 1886 a esterilização a vapor de todo o instrumental. Os métodos assépticos vêm substituindo os de antissepsia.",
      "related": [
        "antissepsia",
        "esterilizacao",
        "autoclave",
        "fluxo-laminar"
      ]
    },
    "descontaminacao": {
      "name": "Descontaminação",
      "defSimple": "Reduzir os germes de um objeto sujo para poder manuseá-lo com segurança.",
      "defAcademic": "Procedimento para diminuir a carga bacteriana de objetos supostamente contaminados, garantindo seu manejo seguro, com substâncias de efeito biocida reconhecido.",
      "example": "Tratar com uma solução biocida um instrumental usado, antes de manipulá-lo.",
      "curiosity": "Não é o mesmo que esterilizar: apenas reduz a carga bacteriana para que o objeto possa ser manejado.",
      "related": [
        "limpeza",
        "desinfeccao",
        "esterilizacao"
      ]
    },
    "limpeza": {
      "name": "Limpeza",
      "defSimple": "Tirar a sujeira de superfícies com água e sabão ou detergente.",
      "defAcademic": "Eliminação de material estranho (pó, terra, restos orgânicos) da superfície inerte ou viva; água, sabão ou detergente e secagem são a base do processo.",
      "example": "Lavar com água e detergente o instrumental sujo de sangue antes de desinfetá-lo.",
      "curiosity": "A limpeza vem sempre antes da desinfecção: a matéria orgânica é uma barreira física e reduz a ação de qualquer desinfetante.",
      "related": [
        "desinfeccao",
        "descontaminacao"
      ]
    },
    "desinfeccao": {
      "name": "Desinfecção",
      "defSimple": "Matar micro-organismos em material inanimado, em níveis diferentes de intensidade.",
      "defAcademic": "Ação letal sobre micro-organismos, em três níveis: alto (bactérias, fungos e algumas esporas; ex.: glutaraldeído a 2%), intermediário (formas vegetativas, exceto esporos; ex.: hipoclorito de sódio, álcool etílico a 70%) e baixo (bactérias vegetativas e alguns vírus; ex.: amônio quaternário a 0,1–0,2%).",
      "example": "Mergulhar um endoscópio no glutaraldeído a 2% por 30 minutos (alto nível).",
      "curiosity": "A desinfecção de alto nível mata quase tudo, mas não substitui a esterilização.",
      "related": [
        "esterilizacao",
        "spaulding",
        "glutaraldeido",
        "hipoclorito-de-sodio",
        "limpeza"
      ]
    },
    "esterilizacao": {
      "name": "Esterilização",
      "defSimple": "Eliminar todos os agentes vivos capazes de se reproduzir.",
      "defAcademic": "Processo que não admite a presença de agentes biológicos vivos capazes de se reproduzir; atividade bactericida aplicada ao instrumental usado em manobra crítica sobre tecido estéril.",
      "example": "Colocar o instrumental metálico na autoclave.",
      "curiosity": "Entre os métodos, o cobalto-60 é descrito no texto-base como o mais confiável de todos.",
      "related": [
        "autoclave",
        "oxido-de-etileno",
        "cobalto-60",
        "desinfeccao",
        "spaulding"
      ]
    },
    "spaulding": {
      "name": "Classificação de Spaulding",
      "defSimple": "Um jeito de decidir como preparar um artigo conforme o lugar onde ele toca o paciente.",
      "defAcademic": "Classificação dos artigos hospitalares em críticos (acessam cavidades normalmente estéreis; sempre estéreis), semicríticos (pele não íntegra ou mucosas; estéreis ou desinfecção de alto nível) e não críticos (pele íntegra ou sem contato; limpeza e, às vezes, desinfecção de baixo nível).",
      "example": "Um cistoscópio flexível é semicrítico: como não vai à autoclave, recebe desinfecção de alto nível.",
      "curiosity": "A pergunta-guia é: onde esse material vai tocar o paciente?",
      "related": [
        "artigo-critico",
        "artigo-semicritico",
        "desinfeccao",
        "esterilizacao"
      ]
    },
    "artigo-critico": {
      "name": "Artigo crítico",
      "defSimple": "Material que entra em cavidades do corpo que normalmente são estéreis.",
      "defAcademic": "Artigo que acessa cavidades normalmente estéreis do organismo; deve ser sempre estéril.",
      "example": "O instrumental usado numa manobra cirúrgica.",
      "curiosity": "Para esses artigos, a desinfecção de alto nível não basta: a exigência é a esterilização.",
      "related": [
        "spaulding",
        "esterilizacao"
      ]
    },
    "artigo-semicritico": {
      "name": "Artigo semicrítico",
      "defSimple": "Material que toca mucosas ou pele não íntegra.",
      "defAcademic": "Artigo que entra em contato com pele não íntegra ou mucosas; deve estar livre de formas vegetativas e, de preferência, estéril; se não for viável, desinfecção de alto nível.",
      "example": "Um cistoscópio flexível.",
      "curiosity": "Quando a esterilização não é viável (por causa das fibras ópticas, por exemplo), recorre-se à desinfecção de alto nível.",
      "related": [
        "spaulding",
        "desinfeccao",
        "glutaraldeido"
      ]
    },
    "listerismo": {
      "name": "Listerismo",
      "defSimple": "O método de Lister de combater germes com ácido fênico, inclusive no ar da sala.",
      "defAcademic": "Método de Joseph Lister (1867): uso de ácido fênico (carbólico) em curativos e pulverização do ar do centro cirúrgico com solução antisséptica.",
      "example": "Pulverizar solução antisséptica no ar da sala antes da cirurgia (prática histórica).",
      "curiosity": "Segundo o texto-base, Lister reduziu as infecções de 90% para 10%.",
      "related": [
        "antissepsia",
        "pus-louvavel"
      ]
    },
    "pus-louvavel": {
      "name": "Pus louvável",
      "defSimple": "A antiga crença de que o pus era parte normal e boa da cicatrização.",
      "defAcademic": "Crença pré-Pasteur de que a formação de pus era parte normal e desejável da cicatrização.",
      "example": "Antes da teoria dos germes, o pus numa ferida cirúrgica era visto como sinal de boa cicatrização.",
      "curiosity": "Pasteur, ao demonstrar que a putrefação vem de germes que se multiplicam, derrubou essa ideia.",
      "related": [
        "listerismo",
        "antissepsia"
      ]
    },
    "autoclave": {
      "name": "Autoclave",
      "defSimple": "Equipamento que esteriliza com vapor sob pressão.",
      "defAcademic": "Equipamento de esterilização por calor úmido (vapor sob pressão). Parâmetros do texto-base: acima de 2 atmosferas e > 140 °C, ou 20 libras a 121 °C durante 30 min.",
      "example": "Instrumental metálico, tecidos e campos vão à autoclave.",
      "curiosity": "O uso da autoclave foi proposto por Redar em 1886; Heidenreich havia demonstrado, em 1884, que o vapor sob pressão esteriliza melhor.",
      "related": [
        "esterilizacao",
        "oxido-de-etileno",
        "assepsia"
      ]
    },
    "oxido-de-etileno": {
      "name": "Óxido de etileno",
      "defSimple": "Gás que esteriliza materiais sensíveis ao calor, como o plástico.",
      "defAcademic": "Gás usado para esterilização a frio de plásticos, sondas e cateteres, a temperaturas bem menores que o calor seco ou o vapor.",
      "example": "Sondas, cateteres e equipos de plástico.",
      "curiosity": "“A frio” não significa refrigeração: é esterilização em temperatura ambiente ou bem mais baixa que a do vapor.",
      "related": [
        "esterilizacao",
        "autoclave",
        "cobalto-60"
      ]
    },
    "cobalto-60": {
      "name": "Cobalto-60",
      "defSimple": "Radiação usada para esterilizar, descrita como o método mais confiável.",
      "defAcademic": "Radioisótopo usado como fonte de radiação gama na esterilização. O texto-base o descreve como o mais confiável entre os métodos: o único que pode dispensar testes de rotina de esterilidade e quarentena.",
      "example": "Esterilização de suturas (cobalto-60 ou óxido de etileno).",
      "curiosity": "A radiação age ionizando moléculas de DNA e causando mutações nos micro-organismos.",
      "related": [
        "esterilizacao",
        "oxido-de-etileno"
      ]
    },
    "fluxo-laminar": {
      "name": "Fluxo laminar",
      "defSimple": "Ar que entra na sala em uma coluna única e lenta, levando as partículas embora.",
      "defAcademic": "Sistema de ar unidirecional, em baixa velocidade, com filtragem eficiente, que arrasta partículas sem gerar turbulência.",
      "example": "O ar do centro cirúrgico entra em coluna e arrasta as partículas, em vez de girar pela sala.",
      "curiosity": "Junto com a pressão positiva e as trocas de ar por hora, é uma das ferramentas para controlar o ar do centro cirúrgico.",
      "related": [
        "pressao-positiva",
        "assepsia"
      ]
    },
    "pressao-positiva": {
      "name": "Pressão positiva",
      "defSimple": "Pressão do ar mais alta dentro da sala, para o ar sair e não entrar.",
      "defAcademic": "Condição do centro cirúrgico em que o ar flui da zona asséptica para as áreas adjacentes, e não o contrário.",
      "example": "Ao abrir a porta, o ar sai do centro cirúrgico para o corredor.",
      "curiosity": "O mínimo recomendado é de 20 trocas de ar por hora, das quais ao menos 4 com ar fresco.",
      "related": [
        "fluxo-laminar"
      ]
    },
    "clorexidina": {
      "name": "Clorexidina",
      "defSimple": "Antisséptico muito usado para lavar as mãos do cirurgião.",
      "defAcademic": "Antisséptico de amplo espectro contra gram-positivos e gram-negativos; padrão na lavagem cirúrgica das mãos (Hibitane, Hibiscrub). Gluconato de clorexidina a 4%: 5 mL por 1 min e novo lavado com 5 mL por 2 min.",
      "example": "Lavagem cirúrgica das mãos com gluconato de clorexidina a 4%.",
      "curiosity": "É incompatível com sabões comuns e com alginato de sódio na mesma solução.",
      "related": [
        "antissepsia",
        "povidona-iodada",
        "lavado-cirurgico"
      ]
    },
    "povidona-iodada": {
      "name": "Povidona iodada",
      "defSimple": "Iodo combinado com um polímero, que irrita menos a pele.",
      "defAcademic": "Combinação de iodo com polivinilpirrolidona; antisséptico de pele mais usado atualmente (10%); menos irritante e com maior disponibilidade do produto ao longo do tempo.",
      "example": "Preparo da pele do campo operatório antes da incisão.",
      "curiosity": "Exige cautela em recém-nascidos e prematuros (absorção de iodo), na insuficiência renal e hepática e em queimaduras extensas.",
      "related": [
        "antissepsia",
        "clorexidina"
      ]
    },
    "glutaraldeido": {
      "name": "Glutaraldeído",
      "defSimple": "Desinfetante cujo efeito depende de quanto tempo o material fica mergulhado.",
      "defAcademic": "Desinfetante de amplo espectro, ativo mesmo com matéria orgânica e não corrosivo; a 2%: 12 h = esterilização, 30 min = desinfecção de alto nível, 10 min = desinfecção de baixo nível.",
      "example": "Desinfecção de alto nível de um endoscópio com fibra óptica, por 30 minutos.",
      "curiosity": "É tóxico: o instrumental precisa ser enxaguado depois. Perde eficácia 2 semanas após o preparo ou se diluído.",
      "related": [
        "desinfeccao",
        "spaulding"
      ]
    },
    "hipoclorito-de-sodio": {
      "name": "Hipoclorito de sódio",
      "defSimple": "Desinfetante barato, mas que perde força com sujeira e corrói metais.",
      "defAcademic": "Desinfetante a 1% descrito como de nível intermediário ou alto; o pH alcalino e a matéria orgânica reduzem sua atividade, e corrói material metálico.",
      "example": "Citado como desinfetante de nível intermediário na lista de níveis de desinfecção.",
      "curiosity": "O texto-base o classifica ora como intermediário, ora como de alto nível: confirme com o protocolo da sua instituição.",
      "related": [
        "desinfeccao",
        "glutaraldeido"
      ]
    },
    "lavado-social": {
      "name": "Lavado social",
      "defSimple": "Lavar as mãos com água e sabão por 10 a 20 segundos.",
      "defAcademic": "Lavagem simples das mãos com água e sabão, removendo a sujidade visível, por 10 a 20 segundos, antes e depois do contato com o paciente em procedimentos não invasivos e sem risco.",
      "example": "Antes e depois de medir a pressão arterial.",
      "curiosity": "É o mais simples dos três níveis de lavagem (social, higiênico e cirúrgico).",
      "related": [
        "lavado-cirurgico"
      ]
    },
    "lavado-cirurgico": {
      "name": "Lavado cirúrgico",
      "defSimple": "A lavagem completa das mãos antes de uma cirurgia, com escovação.",
      "defAcademic": "Escovação mecânica das mãos e antebraços até 2 polegadas acima do cotovelo antes de manobras críticas cirúrgicas (tradição cubana de cerca de 10 minutos), seguida de antisséptico.",
      "example": "A cirurgiã residente antes da primeira apendicectomia como cirurgiã principal.",
      "curiosity": "Depois da lavagem, o cirurgião nunca deve baixar as mãos abaixo dos cotovelos.",
      "related": [
        "lavado-social",
        "clorexidina"
      ]
    },
    "tricotomia": {
      "name": "Tricotomia",
      "defSimple": "Retirar os pelos da região da cirurgia.",
      "defAcademic": "Remoção de pelos da área cirúrgica; estudos atuais sugerem cortar com tesoura em vez de raspar com lâmina no mesmo dia da cirurgia.",
      "example": "Aparar com tesoura os pelos da região no dia da cirurgia.",
      "curiosity": "A lâmina promove crescimento excessivo de micro-organismos em pequenos cortes na pele.",
      "related": [
        "antissepsia"
      ]
    }
  }
};
