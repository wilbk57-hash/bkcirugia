/* choque — módulo completo: Choque hipovolêmico.
   Não apagues esta inicialização. Mantém apenas window.BK_CONTENT['choque'] = { topic, terms }. */
window.BK_CONTENT = window.BK_CONTENT || {};

// MÓDULO COMPLETO A PARTIR DAQUI.

window.BK_CONTENT['choque'] = {
  "topic": {
    "id": "choque",
    "eyebrow": "Módulo de estudo · Reanimação e trauma",
    "title": "Choque hipovolêmico",
    "sub": "Fisiopatologia, classificação, quadro clínico e conduta terapêutica — reunidos e cruzados a partir da bibliografia oficial de cirurgia.",
    "tags": [
      {
        "label": "Cirugía, Tomo I — Cap. 22 “Shock”",
        "cls": "tag-teal"
      },
      {
        "label": "Cirugía, Tomo VI — Cap. 231 “Shock hipovolémico de causa traumática”",
        "cls": "tag-teal"
      },
      {
        "label": "Temas de Cirugía, Tomo 1 — Cap. 4 “Shock”",
        "cls": "tag-teal"
      }
    ],
    "stats": [
      {
        "num": "4",
        "label": "Classes de hemorragia (ATLS)"
      },
      {
        "num": "3",
        "label": "Fases da microcirculação"
      },
      {
        "num": "2:1:1",
        "label": "Hemácias : plasma : plaquetas na transfusão maciça"
      },
      {
        "num": "3 h",
        "label": "Janela de maior benefício do ácido tranexâmico"
      }
    ],
    "references": [
      "Cirugía, Tomo I, Cap. 22 “Shock”",
      "Cirugía, Tomo VI, Cap. 231 “Shock hipovolémico de causa traumática”",
      "Temas de Cirugía, Tomo 1, Cap. 4 “Shock”"
    ],
    "tabs": [
      {
        "id": "inicio",
        "label": "🏠 Início",
        "type": "hero"
      },
      {
        "id": "introducao",
        "label": "📘 Introdução",
        "type": "sections",
        "sections": [
          {
            "h": "Conceito e importância clínica",
            "variant": "blue",
            "label": "Conceito",
            "t": "<p>O choque é definido como a <strong>consequência de um grave transtorno do metabolismo celular</strong>, provocado por uma falha do sistema circulatório em manter perfusão celular adequada — o que compromete o transporte de oxigênio e nutrientes aos tecidos — e/ou pela incapacidade das células de metabolizar esse oxigênio mesmo com perfusão preservada.</p><p>No <strong>choque hipovolêmico</strong>, especificamente, o mecanismo primário é a <strong>redução real do volume sanguíneo circulante</strong> (perda de líquido intravascular), que evolui até provocar uma <strong>hipovolemia efetiva</strong> — repleção insuficiente da aurícula direita durante a diástole. Essa queda do retorno venoso reduz o volume de ejeção e o débito cardíaco, desencadeando hipoperfusão tecidual generalizada.</p>",
            "boxes": [
              {
                "variant": "red",
                "label": "⚠️ Por que isso importa",
                "text": "A hemorragia é a <strong>principal causa de morte evitável na fase aguda do trauma</strong>. A maioria dos pacientes politraumatizados que chega em choque está em choque hipovolêmico de origem hemorrágica — por isso, diante de hipotensão após trauma grave, deve-se assumir hipovolemia por hemorragia <strong>até prova em contrário</strong>."
              }
            ]
          },
          {
            "h": "Definição operacional (critérios clínicos e bioquímicos)",
            "variant": "blue",
            "label": "Definição",
            "t": "<p>Do ponto de vista prático, o diagnóstico de choque se apoia em três pilares:</p><ul><li><strong>Hipotensão arterial sistêmica:</strong> PAS &lt; 90 mmHg ou PAM &lt; 70 mmHg no adulto, ou queda &gt; 30% dos valores basais mantida por pelo menos 30 min, geralmente com taquicardia associada. Pode ser apenas moderada em hipertensos crônicos, e nas fases iniciais pode estar \"falsamente mantida\" pelos mecanismos compensatórios.</li><li><strong>Hipoperfusão tecidual</strong>, evidente nas chamadas \"três janelas\" do corpo: cutânea (pele fria, pegajosa, vasoconstrita, cianótica), renal (diurese &lt; 20 mL/h ou &lt; 0,5 mL/kg/h) e neurológica (desorientação, confusão, agitação).</li><li><strong>Elevação do lactato circulante</strong>, indicando metabolismo energético celular anormal (normal: ≈1 mmol/L; patológico: &gt;1,5 mmol/L).</li></ul>"
          },
          {
            "h": "Perfil epidemiológico nas unidades de terapia intensiva",
            "variant": "blue",
            "label": "Epidemiologia",
            "t": "<p>Em série com 1600 pacientes de UTI polivalentes, a distribuição etiológica do choque foi: <strong>séptico 62%</strong>, <strong>cardiogênico e hipovolêmico 16% cada</strong>, outros distributivos 4% e obstrutivo apenas 2%. Ainda assim, no contexto do trauma, o choque hipovolêmico/hemorrágico é disparadamente o mais frequente.</p>",
            "boxes": [
              {
                "variant": "green",
                "label": "💡 Perspectiva histórica",
                "text": "Dados da Primeira Guerra Mundial (1918) já demonstravam o peso do fator tempo: pacientes reanimados na <strong>primeira hora</strong> após a lesão tiveram mortalidade de <strong>10%</strong>, contra até <strong>70%</strong> nos tratados entre 4 e 8 horas depois. Esse princípio — quanto antes se controla a hemorragia e se repõe volume, melhor o prognóstico — permanece central até hoje."
              }
            ]
          }
        ]
      },
      {
        "id": "fisiopatologia",
        "label": "🫀 Fisiopatologia",
        "type": "sections",
        "sections": [
          {
            "h": "Determinantes críticos da perfusão tecidual",
            "variant": "blue",
            "label": "Perfusão tecidual",
            "t": "<p>A perfusão tecidual depende da integração de quatro grupos de fatores:</p><div style=\"overflow-x:auto\"><table class=\"data\"><tbody><tr><td>Cardíacos</td><td>O débito cardíaco é o produto do volume sistólico pela frequência cardíaca. O volume sistólico, por sua vez, é determinado pela pré-carga, pela pós-carga e pela contratilidade miocárdica.</td></tr><tr><td>Vasculares</td><td>A resistência ao fluxo é inversamente proporcional ao quadrado do raio do vaso — o tônus da musculatura lisa arteriolar é o principal determinante da resistência vascular, regulado por fatores neurais (simpáticos), hormonais (epinefrina/norepinefrina), miogênicos e metabólicos locais.</td></tr><tr><td>Humorais</td><td>Liberação de mediadores circulantes — renina, vasopressina, prostaglandinas, cininas, peptídeo natriurético atrial e catecolaminas — ativados pelo SNC e pelos efeitos celulares da isquemia.</td></tr><tr><td>Microcirculatórios</td><td>Como o choque é, no fundo, um fracasso microcirculatório, a adesão de leucócitos/plaquetas ao endotélio, a ativação da coagulação e a formação de microtrombos comprometem ainda mais a troca capilar de oxigênio.</td></tr></tbody></table></div>"
          },
          {
            "h": "Respostas fisiológicas à perda de volume intravascular",
            "variant": "blue",
            "label": "Três tempos de resposta",
            "t": "<p>O organismo reage à hipovolemia em três tempos sucessivos:</p><p><strong>1. Resposta neural (imediata — minutos)</strong></p><p>A queda do volume sanguíneo reduz as pressões atriais, ativando os barorreceptores de baixa pressão (átrios, grandes veias, artérias pulmonares) e, com a queda adicional do débito cardíaco e da pressão arterial, os receptores de alta pressão do arco aórtico e seio carotídeo. A hipotensão severa (PAM ≤ 50 mmHg) ativa quimiorreceptores carotídeos e aórticos; por volta de 40 mmHg ocorre resposta isquêmica do SNC.</p><p>O centro vasomotor bulbar envia impulsos simpáticos e vagais que aumentam a frequência cardíaca, a contratilidade miocárdica e o tônus arteriolar/venoso periférico — liberando norepinefrina/epinefrina (em proporção 5:1) via glândula suprarrenal. Uma resposta vasovagal paradoxal (bradicardia relativa) pode ocorrer em até 7% dos hipovolêmicos, mascarando a real gravidade hemodinâmica.</p><p><strong>2. Resposta intrínseca ou intermediária (horas)</strong></p><p>A baixa pressão capilar desloca líquido do interstício para o compartimento vascular — até 1 litro na primeira hora. Em seguida, proteínas (principalmente albumina) migram do interstício para o plasma, podendo transferir até <strong>2 litros</strong> de líquido intersticial/intracelular para o intravascular em 24–48h, repondo parte do volume perdido. A hiperglicemia do estresse também contribui, por efeito osmótico.</p><p><strong>3. Resposta humoral ou tardia (dias)</strong></p><p>Ativação do eixo hormônio antidiurético–aldosterona–renina, aumentando a retenção renal de líquido e o volume intravascular. Ocorre também liberação de ACTH (associada a endorfinas/encefalinas) e de vasopressina, promovendo vasoconstrição esplâncnica/periférica e reabsorção de água nos túbulos distais.</p>"
          },
          {
            "h": "Fases da microcirculação (esquema de Chambers e Sweifach modificado)",
            "variant": "blue",
            "label": "Microcirculação",
            "t": "<p>À medida que o choque progride, a microcirculação atravessa três fases características:</p><div style=\"overflow-x:auto\"><table class=\"data\"><thead><tr><th>Fase</th><th>O que ocorre</th></tr></thead><tbody><tr><td style=\"background:rgba(217,119,6,.16);font-weight:600\">Isquêmica</td><td>Vasoconstrição dos vasos periféricos; obstrução do fluxo capilar. As células, sem aporte de oxigênio, passam a metabolismo anaeróbico e geram produtos tóxicos (ácido lático).</td></tr><tr><td style=\"background:rgba(217,119,6,.16);font-weight:600\">Estase (estancamento)</td><td>Os esfíncteres pré-capilares (arteriolares) se abrem, mas os pós-capilares/venulares permanecem fechados — o sangue entra nos capilares sem via de saída adequada, elevando a pressão hidrostática capilar e forçando líquido para o interstício. Ocorre abertura de shunts arteriovenosos.</td></tr><tr><td style=\"background:rgba(185,28,28,.14);font-weight:600\">Colapso</td><td>Os esfíncteres pós-capilares finalmente se abrem, e o líquido — incluindo as toxinas do metabolismo anaeróbico — retorna à circulação, tornando sistêmica a acidose metabólica antes localizada.</td></tr></tbody></table></div>",
            "boxes": [
              {
                "variant": "red",
                "label": "⚠️ Círculo vicioso do choque",
                "text": "Hipotensão → Vasoconstrição → Redução do fluxo sanguíneo tecidual → Hipóxia tecidual → Diminuição do retorno venoso → Diminuição do volume de ejeção cardíaco → Hipotensão arterial <em>(o ciclo se retroalimenta)</em>"
              }
            ]
          },
          {
            "h": "Repercussão sistêmica: disfunção de órgãos",
            "variant": "blue",
            "label": "Órgãos afetados",
            "t": "<p>Se a hipoperfusão não é revertida a tempo, cada órgão desenvolve disfunção característica, culminando em <strong>falência de múltiplos órgãos</strong>:</p><div style=\"overflow-x:auto\"><table class=\"data\"><tbody><tr><td>Coração</td><td>A taquicardia compensatória reduz o tempo de enchimento diastólico e compromete o fluxo coronariano; a isquemia reduz ainda mais a complacência diastólica, criando um ciclo de piora progressiva.</td></tr><tr><td>Pulmão</td><td>Disfunção precoce: queda da complacência, dificuldade de troca gasosa e shunts em áreas mal ventiladas; depressão do surfactante leva a colapso alveolar.</td></tr><tr><td>Rim</td><td>O fluxo é desviado preferencialmente para coração e cérebro; quando a autorregulação aferente falha, a queda do fluxo cortical leva à necrose tubular aguda.</td></tr><tr><td>Fígado e TGI</td><td>Hipoperfusão esplâncnica pode gerar isquemia intestinal, úlceras de estresse, íleo, colecistite alitiásica e pancreatite; no fígado, reduz síntese proteica e detoxificação.</td></tr><tr><td>Sistema hematológico</td><td>Trombocitopenia por hemodiluição, ativação da cascata de coagulação podendo evoluir para CIVD, com consumo de fatores e sangramento em sítios de punção.</td></tr><tr><td>Cérebro</td><td>A autorregulação compensa até certo ponto, mas quando a PAM cai abaixo de 60 mmHg, a hipoperfusão crítica pode causar lesão isquêmica — confusão, agitação e, em estágios terminais, coma.</td></tr></tbody></table></div><p>Fonte: Cirugía, Tomo I, Cap. 22 \"Shock\" (respostas fisiológicas à perda de volume)</p><p>Fonte: Cirugía, Tomo VI, Cap. 231 (fases da microcirculação, esquema de Chambers e Sweifach)</p><p>Fonte: Temas de Cirugía, Tomo 1, Cap. 4 (determinantes da perfusão, repercussão orgânica).</p>"
          }
        ]
      },
      {
        "id": "classificacao",
        "label": "📊 Classificação",
        "type": "sections",
        "sections": [
          {
            "h": "O choque hipovolêmico dentro da classificação geral do choque",
            "variant": "blue",
            "label": "Visão geral",
            "t": "<p>O choque circulatório é didaticamente dividido em quatro grandes mecanismos, não necessariamente excludentes entre si:</p><div style=\"overflow-x:auto\"><table class=\"data\"><thead><tr><th>Tipo</th><th>Principais causas</th></tr></thead><tbody><tr><td style=\"background:rgba(217,119,6,.16);font-weight:600\">Hipovolêmico</td><td>Hemorrágico · perda de líquidos (plasmorrágico / desidratação)</td></tr><tr><td>Cardiogênico</td><td>Miopático (IAM, cardiomiopatia dilatada, depressão miocárdica séptica) · mecânico (regurgitação mitral, defeito septal, aneurisma ventricular) · arritmias</td></tr><tr><td>Obstrutivo</td><td>Tamponamento pericárdico · embolia pulmonar maciça · pneumotórax hipertensivo · hipertensão pulmonar grave</td></tr><tr><td>Distributivo</td><td>Séptico · anafilático · neurogênico · endocrinológico · por tóxicos</td></tr></tbody></table></div>"
          },
          {
            "h": "Tipos de choque hipovolêmico segundo a qualidade do líquido perdido",
            "variant": "blue",
            "label": "Tipos",
            "t": "<ul><li>Hemorrágico — perda de sangue total</li><li>Plasmático — grandes queimados</li><li>Perda de água — desidratação, cólera</li><li>Perdas intraluminais — oclusão intestinal</li><li>Misto — pancreatite grave (plasmorragia + hemorragia + fatores tóxicos)</li></ul><p><strong>Perda de plasma:</strong> ocorre em pancreatite, peritonite, queimaduras, síndrome de esmagamento e anafilaxia (com ou sem perda proteica associada); vômitos, diarreia, aspiração nasogástrica excessiva, fístulas, nefropatia perdedora de sódio e uso de diuréticos costumam associar-se a pouca perda proteica.</p><p><strong>Perda de sangue total:</strong> pode ser evidente (ferida penetrante) ou oculta — em espaços abdominal/torácico (hemotórax, laceração hepática/esplênica/renal, gravidez ectópica, hemorragia digestiva), retroperitônio (ruptura aórtica, coagulopatias) ou nos tecidos ao redor de fraturas ósseas.</p>",
            "boxes": [
              {
                "variant": "amber",
                "label": "📏 Perda sanguínea estimada por fratura (adulto)",
                "text": "Úmero: 500–1000 mL · Tíbia/fíbula: 750–1200 mL · Fêmur: 1000–1500 mL · Pelve: 1500–2500 mL"
              }
            ]
          },
          {
            "h": "Classificação da hemorragia (ATLS) — repercussão hemodinâmica",
            "variant": "blue",
            "label": "Classes ATLS",
            "t": "<p>Em um homem de 70 kg, a redução do volume intravascular é classificada em quatro graus conforme os achados clínicos iniciais:</p><div style=\"overflow-x:auto\"><table class=\"data\" style=\"min-width:560px\"><thead><tr><th>Parâmetro</th><th>Classe I</th><th>Classe II</th><th>Classe III</th><th>Classe IV</th></tr></thead><tbody><tr><td style=\"width:auto;min-width:0\">Perda de sangue (mL)</td><td>Até 750</td><td>750–1500</td><td>1500–2000</td><td style=\"background:rgba(185,28,28,.14);font-weight:600\">&gt;2000</td></tr><tr><td style=\"width:auto;min-width:0\">Perda de sangue (%)</td><td>Até 15%</td><td>15–30%</td><td>30–40%</td><td style=\"background:rgba(185,28,28,.14);font-weight:600\">&gt;40%</td></tr><tr><td style=\"width:auto;min-width:0\">Frequência cardíaca</td><td>&lt;100</td><td>100–120</td><td>120–140</td><td style=\"background:rgba(185,28,28,.14);font-weight:600\">&gt;140</td></tr><tr><td style=\"width:auto;min-width:0\">PA sistólica</td><td>Normal</td><td>Diminuída</td><td>Diminuída</td><td>Diminuída</td></tr><tr><td style=\"width:auto;min-width:0\">Amplitude de pulso</td><td>Normal/aumentada</td><td>Diminuída</td><td>Diminuída</td><td>Diminuída</td></tr><tr><td style=\"width:auto;min-width:0\">Frequência respiratória</td><td>14–20</td><td>20–30</td><td>30–40</td><td style=\"background:rgba(185,28,28,.14);font-weight:600\">&gt;35</td></tr><tr><td style=\"width:auto;min-width:0\">Diurese (mL/h)</td><td>&gt;30</td><td>20–30</td><td>5–15</td><td style=\"background:rgba(185,28,28,.14);font-weight:600\">Mínima</td></tr><tr><td style=\"width:auto;min-width:0\">Estado mental</td><td>Ansiedade leve</td><td>Ansiedade moderada</td><td>Ansioso/confuso</td><td style=\"background:rgba(185,28,28,.14);font-weight:600\">Letárgico</td></tr><tr><td style=\"width:auto;min-width:0\">Reposição inicial</td><td>Cristaloides</td><td>Cristaloides</td><td style=\"background:rgba(217,119,6,.16);font-weight:600\">Cristaloides + sangue</td><td style=\"background:rgba(185,28,28,.14);font-weight:600\">Cristaloides + sangue</td></tr></tbody></table></div>",
            "boxes": [
              {
                "variant": "red",
                "label": "⚠️ Ponto-chave",
                "text": "A <strong>pressão arterial é um sinal tardio e pouco sensível</strong>. Ela só começa a cair quando já se perdeu entre <strong>30 e 40% da volemia</strong> — ou seja, o paciente já está profundamente hipovolêmico quando a PA se altera. Por isso, o tempo de enchimento capilar, a frequência e as características do pulso e a frequência respiratória são indicadores mais sensíveis e precoces de hipovolemia do que a própria pressão arterial."
              }
            ]
          },
          {
            "h": "Gravidade do choque hipovolêmico (comportamento hemodinâmico)",
            "variant": "blue",
            "label": "Gravidade",
            "t": "<div style=\"overflow-x:auto\"><table class=\"data\" style=\"min-width:440px\"><thead><tr><th>Elemento clínico</th><th>Leve</th><th>Moderado</th><th>Grave</th></tr></thead><tbody><tr><td style=\"width:auto;min-width:0\">Perfusão da pele</td><td>Pálida</td><td>Pálida</td><td>Pálida</td></tr><tr><td style=\"width:auto;min-width:0\">Gasto urinário</td><td>Normal</td><td>Baixo</td><td>Baixo</td></tr><tr><td style=\"width:auto;min-width:0\">Tensão arterial</td><td>Normal</td><td>Normal</td><td style=\"background:rgba(185,28,28,.14);font-weight:600\">Baixa</td></tr><tr><td style=\"width:auto;min-width:0\">Estado mental</td><td>Sede</td><td>Inquietude</td><td style=\"background:rgba(185,28,28,.14);font-weight:600\">Obnubilação</td></tr><tr><td style=\"width:auto;min-width:0\">Veias do pescoço</td><td>Planas</td><td>Planas</td><td>Planas</td></tr><tr><td style=\"width:auto;min-width:0\">Débito cardíaco</td><td>Baixo</td><td>Baixo</td><td>Baixo</td></tr><tr><td style=\"width:auto;min-width:0\">Resistência vascular sistêmica</td><td>Alta</td><td>Alta</td><td>Alta</td></tr></tbody></table></div><p><em>Observe que, diferente do choque cardiogênico ou obstrutivo (onde as veias do pescoço ficam distendidas), no choque hipovolêmico as veias jugulares permanecem <strong>planas</strong> em todos os graus — achado útil no diagnóstico diferencial à beira do leito.</em></p><p>Fonte: Cirugía, Tomo I, Cap. 22, Tabela 22.1 (classificação ATLS da hemorragia)</p><p>Fonte: Cirugía, Tomo VI, Cap. 231, Tabela 231.1</p><p>Fonte: Temas de Cirugía, Tomo 1, Cap. 4 (tipos de choque hipovolêmico por qualidade do líquido).</p>"
          }
        ]
      },
      {
        "id": "quadro-clinico",
        "label": "🩺 Quadro clínico",
        "type": "sections",
        "sections": [
          {
            "h": "Manifestações clínicas do choque hipovolêmico",
            "variant": "blue",
            "label": "Manifestações",
            "t": "<p>Expressam alterações hemodinâmicas e metabólicas decorrentes da hipotensão e da hipovolemia súbita: <strong>taquicardia</strong>, <strong>oligúria</strong>, <strong>pele fria e pálida</strong> (reação adrenérgica intensa), <strong>sede</strong> e nível de consciência inicialmente preservado — evoluindo, na fase tardia, para apatia, confusão ou até coma. A perda de consciência costuma surgir apenas nos estágios terminais.</p><p>Outros sinais descritos: fácies hipocrática, sudorese, cianose periférica (ou palidez predominante quando a causa é hemorrágica), taquipneia, ruídos cardíacos débeis, agitação. Durante ventilação espontânea pode surgir pulso paradoxal.</p>",
            "boxes": [
              {
                "variant": "amber",
                "label": "📏 Referências de pulso palpável por nível pressórico",
                "text": "Pulso radial ausente → PAS &lt; 80 mmHg · Pulso femoral ausente → PAS &lt; 70 mmHg · Pulso carotídeo ausente → PAS &lt; 60 mmHg. FC normal no adulto: 60–100 bpm; FC &gt;100 sugere choque; &gt;120–140 indica estado crítico."
              }
            ]
          },
          {
            "h": "Diagnóstico diferencial entre os tipos de choque",
            "variant": "blue",
            "label": "Diagnóstico diferencial",
            "t": "<p>Diante de um paciente em choque, a suspeita inicial de causa hipovolêmica deve ser cruzada com achados que sugiram outra etiologia associada (por exemplo, tamponamento cardíaco ou lesão medular concomitantes a um trauma hemorrágico):</p><div style=\"overflow-x:auto\"><table class=\"data\" style=\"min-width:560px\"><thead><tr><th>Achado</th><th>Hipovolêmico</th><th>Cardiogênico</th><th>Séptico (inicial)</th><th>Neurogênico</th></tr></thead><tbody><tr><td style=\"width:auto;min-width:0\">Pele</td><td>Fria, pálida</td><td>Fria, cianose peribucal</td><td>Rosada, quente</td><td>Quente abaixo da lesão</td></tr><tr><td style=\"width:auto;min-width:0\">Frequência cardíaca</td><td style=\"background:rgba(185,28,28,.14);font-weight:600\">Taquicardia</td><td>Taquicardia</td><td>Taquicardia</td><td style=\"background:rgba(21,128,61,.16);font-weight:600\">Normal ou bradicardia</td></tr><tr><td style=\"width:auto;min-width:0\">Veias do pescoço</td><td>Planas</td><td style=\"background:rgba(217,119,6,.16);font-weight:600\">Distendidas</td><td>Planas</td><td>Planas</td></tr><tr><td style=\"width:auto;min-width:0\">Débito cardíaco</td><td>Baixo</td><td>Baixo</td><td>Alto (fase inicial)</td><td>Variável</td></tr><tr><td style=\"width:auto;min-width:0\">Resistência vascular sistêmica</td><td>Alta</td><td>Alta</td><td>Baixa (fase inicial)</td><td>Baixa</td></tr><tr><td style=\"width:auto;min-width:0\">Pressão de pulso</td><td style=\"background:rgba(217,119,6,.16);font-weight:600\">Estreitada</td><td>Estreitada</td><td>Variável</td><td>Preservada</td></tr></tbody></table></div>",
            "boxes": [
              {
                "variant": "green",
                "label": "💡 Armadilha clínica — choque medular",
                "text": "Tratar um paciente com <strong>choque medular</strong> como se fosse choque hipovolêmico provoca <strong>sobrecarga de volume</strong> e piora as complicações em traumatizados com lesão craniana ou contusão pulmonar associadas. No choque medular a pele permanece quente e rosada abaixo do nível da lesão (perfusão preservada por perda do tônus simpático), e a FC não se eleva — diferente do padrão frio/taquicárdico do hipovolêmico."
              }
            ]
          },
          {
            "h": "Avaliação inicial à beira do leito",
            "variant": "blue",
            "label": "Avaliação inicial",
            "t": "<ul><li><strong>Via aérea, ventilação e oxigenação</strong> — sempre a prioridade inicial (ABC).</li><li><strong>Pulso</strong> (carotídeo/radial): presença, frequência, amplitude e regularidade.</li><li><strong>Tempo de enchimento capilar</strong> &gt; 2 segundos: indicador sensível e precoce de má perfusão.</li><li><strong>Cor e temperatura da pele:</strong> palidez pode indicar vasoconstrição periférica (hipovolemia), anemia ou interrupção focal do suprimento de O₂.</li><li><strong>Diurese horária:</strong> &lt; 25–30 mL/h sugere hipoperfusão renal (não avaliável na fase pré-hospitalar).</li><li><strong>Estado de consciência:</strong> uma resposta verbal coerente já indica via aérea patente e alguma perfusão cerebral.</li></ul>"
          },
          {
            "h": "Exames complementares",
            "variant": "blue",
            "label": "Exames",
            "t": "<div style=\"overflow-x:auto\"><table class=\"data\"><tbody><tr><td>Hemograma</td><td>Pode revelar anemia, hemoconcentração ou leucograma sugestivo de sepse associada.</td></tr><tr><td>Gasometria arterial</td><td>Acidose metabólica é o achado mais frequente; PCO₂ baixa por hiperventilação compensadora ou elevada se há dano pulmonar.</td></tr><tr><td>Lactato arterial</td><td>Elevado; é um dos principais parâmetros prognósticos e guia a resposta ao tratamento.</td></tr><tr><td>Coagulograma</td><td>Avalia coagulopatia de consumo, especialmente relevante em transfusão maciça.</td></tr><tr><td>Grupo sanguíneo e Rh</td><td>Essencial e urgente diante de qualquer suspeita de necessidade transfusional.</td></tr><tr><td>Ecocardiograma / cateterismo direito</td><td>Quando há dúvida etiológica, o cateter de Swan-Ganz ajuda a diferenciar os tipos de choque pelas pressões de enchimento e débito cardíaco.</td></tr></tbody></table></div><p>Fonte: Cirugía, Tomo VI, Cap. 231 (avaliação prehospitalar, parâmetros de pulso)</p><p>Fonte: Temas de Cirugía, Tomo 1, Cap. 4 (diagnóstico diferencial entre tipos de choque, exames complementares)</p><p>Fonte: Cirugía, Tomo I, Cap. 22.</p>"
          }
        ]
      },
      {
        "id": "tratamento",
        "label": "💉 Tratamento",
        "type": "sections",
        "sections": [
          {
            "h": "Objetivos terapêuticos",
            "variant": "blue",
            "label": "🎯 Três objetivos",
            "t": "<p>1) Deter a causa da perda de volume o mais rápido possível (hemostasia). 2) Restaurar a perfusão e a oxigenação tecidual. 3) Prevenir a coagulopatia aguda associada ao trauma. A regra de ouro é manter o aporte de oxigênio apesar da catástrofe hemodinâmica — sem reanimação eficaz que substitua o controle cirúrgico definitivo da hemorragia.</p>"
          },
          {
            "h": "Reposição volêmica: cristaloides x coloides",
            "variant": "blue",
            "label": "Reposição volêmica",
            "t": "<div style=\"overflow-x:auto\"><table class=\"data\" style=\"min-width:440px\"><thead><tr><th></th><th>Cristaloides</th><th>Coloides (albumina, amidos, gelatina, dextranos)</th></tr></thead><tbody><tr><td style=\"width:auto;min-width:0\">Vantagens</td><td>bem tolerados; estimulam diurese; fácil administração rápida.</td><td>maior poder expansor por volume infundido (albumina 5%: expansão de 75% do volume infundido).</td></tr><tr><td style=\"width:auto;min-width:0\">Desvantagens</td><td>pouca permanência intravascular; diluem fatores de coagulação; causam edema intersticial/intracelular.</td><td>maior custo; risco de reações anafilactoides, disfunção renal (amidos) e distúrbios de coagulação; sem superioridade demonstrada sobre solução salina (estudo SAFE).</td></tr></tbody></table></div><p>Solução de escolha para reposição inicial: <strong>Ringer lactato</strong> ou solução salina 0,9%, em infusão rápida, seguidas de transfusão de sangue assim que possível. Regra prática: o reposição inicial com cristaloides não deve exceder <strong>3 mL de cristaloide por mL de sangue perdido</strong> — mas isso não significa restringir Ringer lactato ao hipovolêmico grave, e sim que o sangue deve entrar precocemente na fase de reanimação.</p>",
            "boxes": [
              {
                "variant": "red",
                "label": "⚠️ Guias europeias atuais",
                "text": "Recomendam os <strong>cristaloides como primeira escolha</strong> frente aos coloides, reservando estes últimos apenas para pacientes críticos com instabilidade hemodinâmica refratária, quando não há outra alternativa disponível. Amidos estão formalmente contraindicados em sepse grave, paciente crítico e queimados."
              }
            ]
          },
          {
            "h": "Hemoderivados",
            "variant": "blue",
            "label": "Produtos",
            "t": "<div style=\"overflow-x:auto\"><table class=\"data\" style=\"min-width:440px\"><thead><tr><th>Produto</th><th>Indicação</th><th>Conteúdo</th><th>Efeito/aporte</th></tr></thead><tbody><tr><td style=\"width:auto;min-width:0\">Sangue total (450 mL)</td><td>Hemorragia maciça</td><td>Todos os componentes</td><td>↑ Hematócrito 3–4 vol% por unidade</td></tr><tr><td style=\"width:auto;min-width:0\">Concentrado de hemácias (250 mL)</td><td>Anemia sintomática</td><td>Eritrócitos</td><td>↑ Hematócrito 3–4 vol%/unidade</td></tr><tr><td style=\"width:auto;min-width:0\">Plasma fresco congelado (250 mL)</td><td>Déficit de fatores lábeis/estáveis</td><td>Todos os fatores da coagulação</td><td>Fatores + fibrinogênio (150 mg/un.)</td></tr><tr><td style=\"width:auto;min-width:0\">Crioprecipitado (50 mL)</td><td>Hipofibrinogenemia</td><td>Fatores VIII, vWF, XIII, fibronectina, fibrinogênio</td><td>Fatores selecionados</td></tr><tr><td style=\"width:auto;min-width:0\">Plaquetas (50 mL/un.)</td><td>Trombocitopenia</td><td>Plaquetas</td><td>↑ 5.000–8.000/mL por unidade</td></tr></tbody></table></div>",
            "boxes": [
              {
                "variant": "amber",
                "label": "📏 Proporção de transfusão maciça",
                "text": "Guias de Austrália/Nova Zelândia e da agência francesa AFSSAPS recomendam proporção <strong>concentrado de hemácias : plasma fresco : plaquetas = 2:1:1</strong>. Estudos em vítimas civis apontam superioridade de proporções 2:1 ou 3:1 (hemácias:plasma) frente a 4:1. Plaquetas devem ser administradas quando a contagem cai abaixo de 50.000/mm³ (ou 100.000/mm³ em trauma craniano associado)."
              }
            ]
          },
          {
            "h": "Ácido tranexâmico",
            "variant": "blue",
            "label": "CRASH-2",
            "t": "<p>O estudo <strong>CRASH-2</strong>, com mais de 20.000 pacientes em choque hemorrágico, demonstrou redução de mortalidade com uma carga de 1 g em 10 min seguida de outro 1 g nas 8 horas seguintes, sem aumento de eventos tromboembólicos. O benefício é maior quando administrado nas primeiras <strong>3 horas</strong> do trauma.</p>"
          },
          {
            "h": "Reanimação hipotensiva (\"hipotensão permissiva\")",
            "variant": "green",
            "label": "💡 Conceito",
            "t": "<p>Em choque hemorrágico não controlado, elevar agressivamente a pressão arterial <strong>antes</strong> de o cirurgião conseguir controlar a hemorragia pode aumentar o sangramento (diluição dos fatores de coagulação, hipotermia, deslocamento de coágulos). Por isso, adia-se a reposição volêmica agressiva até o início da hemostasia cirúrgica, mantendo metas pressóricas conservadoras.</p><ul><li>Manter PAS entre <strong>80–100 mmHg</strong> até controlar a hemorragia (guias europeias, sem trauma craniano associado).</li><li>Meta pré-hospitalar mais restritiva: PAS ≈ 70 mmHg e PAM ≈ 40 mmHg, com controle do pulso radial e da resposta verbal/motora da Glasgow.</li><li>Evitar exames e demoras desnecessárias; evitar excesso de cristaloides (hipotermia, coagulopatia dilucional).</li><li><strong>Exceção:</strong> se há dano cerebral traumático associado, a prioridade passa a ser manter a pressão de perfusão cerebral — não se aplica hipotensão permissiva.</li></ul>"
          },
          {
            "h": "Coagulopatia aguda associada ao trauma (CAAT)",
            "variant": "blue",
            "label": "Mecanismos",
            "t": "<p>Mecanismos envolvidos: <strong>perda e diluição</strong> dos fatores de coagulação e plaquetas; <strong>ativação excessiva</strong> da coagulação; <strong>fibrinólise</strong> exagerada; <strong>hipotermia</strong> (disfunção plaquetária); <strong>acidose metabólica</strong> (reduz atividade dos fatores); e <strong>hipocalcemia</strong> (hemodiluição e citrato das transfusões maciças).</p>"
          },
          {
            "h": "Vasopressores",
            "variant": "blue",
            "label": "Vasopressores",
            "t": "<p>Uso restrito a casos com risco iminente de morte, como recurso excepcional — a reposição volêmica é sempre prioritária. A norepinefrina é a droga de escolha quando indicada no choque hemorrágico refratário.</p><div style=\"overflow-x:auto\"><table class=\"data\" style=\"min-width:560px\"><thead><tr><th>Agente</th><th>Dose</th><th>Contratilidade</th><th>Vasoconstrição</th><th>Vasodilatação</th></tr></thead><tbody><tr><td style=\"width:auto;min-width:0\">Dopamina</td><td>1–4 / 4–20 µg/kg/min</td><td>1+ / 2–3+</td><td>0 / 2–3+</td><td>1+ / 0</td></tr><tr><td style=\"width:auto;min-width:0\">Norepinefrina</td><td>2–20 µg/min</td><td>2+</td><td>4+</td><td>0</td></tr><tr><td style=\"width:auto;min-width:0\">Dobutamina</td><td>2,5–15 µg/kg/min</td><td>3–4+</td><td>0</td><td>2+</td></tr><tr><td style=\"width:auto;min-width:0\">Isoproterenol</td><td>1–5 µg/min</td><td>4+</td><td>0</td><td>4+</td></tr><tr><td style=\"width:auto;min-width:0\">Epinefrina</td><td>1–20 µg/min</td><td>4+</td><td>4+</td><td>3+</td></tr><tr><td style=\"width:auto;min-width:0\">Fenilefrina</td><td>20–200 µg/min</td><td>0</td><td>3+</td><td>0</td></tr></tbody></table></div>"
          },
          {
            "h": "Pantalones neumáticos antishock (PNA)",
            "variant": "blue",
            "label": "PNA",
            "t": "<p>Dispositivo histórico (usado desde a Guerra do Vietnã, 1971) com três compartimentos infláveis (0–100 mmHg, uso típico 40–60/80 mmHg, máximo 3h contínuas). Indicações: trauma abdominal com hipovolemia grave durante transporte/reanimação inicial, e imobilização de fraturas pélvicas/femorais com hemorragia ativa e hipotensão. <strong>Contraindicações absolutas:</strong> edema pulmonar, ruptura diafragmática, disfunção do ventrículo esquerdo. O desinflamento deve ser gradual (começando pelo compartimento abdominal), sempre com acesso venoso já estabelecido e monitorização contínua da PA.</p>"
          },
          {
            "h": "Metas de monitorização e tratamento",
            "variant": "blue",
            "label": "Metas",
            "t": "<div style=\"overflow-x:auto\"><table class=\"data\"><thead><tr><th>Anormalidade</th><th>Ação</th><th>Objetivo terapêutico</th></tr></thead><tbody><tr><td style=\"width:auto;min-width:0\">Hipotensão</td><td>Monitorização em UTI, expansão de volume, vasopressores</td><td>PAM &lt; 60 mmHg / PCP 14–18 mmHg</td></tr><tr><td style=\"width:auto;min-width:0\">Hipoperfusão tecidual</td><td>Igual + inotrópicos</td><td>Hb &gt;10 g/dL · SatO₂ &gt;92% · IC &gt;2,2 L/min/m² · lactato normal (0,5–2,2 mmol/L)</td></tr><tr><td style=\"width:auto;min-width:0\">Disfunção orgânica sistêmica</td><td>Igual ao anterior</td><td>Reverter disfunção renal, hepática, pulmonar e do SNC</td></tr></tbody></table></div><p>Fonte: Cirugía, Tomo I, Cap. 22 (cristaloides x coloides, hemoderivados, ácido tranexâmico, hipotensão permissiva, CAAT)</p><p>Fonte: Cirugía, Tomo VI, Cap. 231 (PNA, vias de acesso venoso, soluções de reposição)</p><p>Fonte: Temas de Cirugía, Tomo 1, Cap. 4, Tabelas 4.3 e 4.4 (metas e vasopressores).</p>"
          }
        ]
      },
      {
        "id": "caso",
        "label": "🏥 Caso clínico",
        "type": "case",
        "steps": [
          {
            "tag": "Etapa 1 de 10",
            "title": "Motivo da consulta",
            "body": "<p>Homem, 34 anos, trazido pelo SAMU à sala de emergência após <strong>acidente de motocicleta</strong> há 40 minutos, colisão contra veículo em movimento, com <strong>trauma abdominal fechado</strong>. Equipe de resgate relata que o paciente esteve consciente no local, taquicárdico e pálido durante o transporte.</p>",
            "variant": "blue",
            "label": "Apresentação"
          },
          {
            "tag": "Etapa 2 de 10",
            "title": "História da doença atual",
            "body": "<p>Dor abdominal difusa de início imediato ao trauma, mais intensa em hipocôndrio esquerdo, com irradiação para o ombro esquerdo (sinal de Kehr). Refere tontura e sensação de \"cabeça leve\" durante o transporte. Nega perda de consciência. Nega trauma cranioencefálico ou vertebral evidentes.</p>",
            "variant": "blue",
            "label": "História"
          },
          {
            "tag": "Etapa 3 de 10",
            "title": "Antecedentes",
            "body": "<p>Hígido, sem comorbidades conhecidas. Nega uso de anticoagulantes ou antiagregantes. Última refeição há 3 horas. Não usuário de álcool ou drogas conhecido pela família presente.</p>",
            "variant": "blue",
            "label": "Antecedentes"
          },
          {
            "tag": "Etapa 4 de 10",
            "title": "Exame físico",
            "body": "<p><strong>Via aérea:</strong> pérvia, fala frases completas.<br/>\n<strong>Respiração:</strong> FR 28 irpm, simétrica, sem desvio de traqueia.<br/>\n<strong>Circulação:</strong> PA 92/68 mmHg, FC 128 bpm, pulso radial fino e rápido, <strong>tempo de enchimento capilar de 4 segundos</strong>, pele fria, pálida e sudoreica.<br/>\n<strong>Neurológico:</strong> Glasgow 14 (confuso, abre olhos espontaneamente, obedece comandos), <strong>ansioso e agitado</strong>.<br/>\n<strong>Abdome:</strong> equimose em flanco esquerdo, doloroso difusamente à palpação, defesa muscular em hipocôndrio esquerdo, sem ruídos hidroaéreos audíveis.<br/>\n<strong>Pelve:</strong> estável à compressão. <strong>Membros:</strong> sem deformidades evidentes.</p>",
            "variant": "amber",
            "label": "Exame físico",
            "boxes": [
              {
                "variant": "red",
                "label": "⚠️ Leitura clínica",
                "text": "FC 128, PAS 92, FR 28, TEC 4s e ansiedade/confusão — compatível com <strong>Classe III de hemorragia</strong> (perda estimada de 1500–2000 mL / 30–40% da volemia). A combinação de dor em hipocôndrio esquerdo + irradiação para o ombro (sinal de Kehr) sugere fortemente <strong>lesão esplênica</strong>."
              }
            ]
          },
          {
            "tag": "Etapa 5 de 10",
            "title": "Hipóteses diagnósticas",
            "body": "<ul><li><strong>Choque hipovolêmico hemorrágico Classe III</strong>, secundário a trauma abdominal fechado.</li><li>Ruptura esplênica (hipótese principal, pelo mecanismo e sinal de Kehr).</li><li>Diagnósticos diferenciais a excluir: lesão hepática associada, lesão retroperitoneal, hemotórax oculto, fratura pélvica oculta.</li></ul>",
            "variant": "amber",
            "label": "Hipóteses"
          },
          {
            "tag": "Etapa 6 de 10",
            "title": "Exames complementares",
            "body": "<ul><li><strong>FAST (eco-FAST) à beira do leito:</strong> líquido livre em espaço esplenorrenal e fundo de saco — positivo.</li><li><strong>Hemograma:</strong> Hb 9,8 g/dL (provável hemodiluição inicial, ainda não reflete a perda total), Ht 30%.</li><li><strong>Gasometria arterial:</strong> acidose metabólica leve, lactato 3,8 mmol/L (elevado).</li><li><strong>Coagulograma:</strong> dentro da normalidade neste momento.</li><li><strong>Tipagem sanguínea e prova cruzada:</strong> solicitadas com urgência.</li><li>Paciente segue hemodinamicamente instável apesar da reposição inicial — não é candidato a tomografia (que exige estabilidade); segue direto para decisão cirúrgica.</li></ul>",
            "variant": "blue",
            "label": "Exames"
          },
          {
            "tag": "Etapa 7 de 10",
            "title": "Diagnóstico",
            "body": "<p><strong>Choque hemorrágico Classe III por provável ruptura esplênica</strong> secundária a trauma abdominal fechado, confirmado por FAST positivo e instabilidade hemodinâmica persistente.</p>",
            "variant": "amber",
            "label": "Diagnóstico"
          },
          {
            "tag": "Etapa 8 de 10",
            "title": "Conduta",
            "body": "<ul><li>Dois acessos venosos periféricos calibrosos; início de <strong>Ringer lactato aquecido</strong> em bólus.</li><li>Oxigênio suplementar com alto fluxo (FiO₂ próxima a 100%).</li><li>Manutenção de <strong>hipotensão permissiva</strong> (meta PAS 80–90 mmHg) até controle cirúrgico — sem trauma craniano associado.</li><li>Solicitação imediata de concentrado de hemácias, plasma fresco e plaquetas na proporção <strong>2:1:1</strong>, ativando protocolo de transfusão maciça.</li><li>Administração de <strong>ácido tranexâmico</strong> (1 g em 10 min, seguido de 1 g em 8h).</li><li>Como não houve resposta hemodinâmica sustentada aos cristaloides e o FAST é positivo com instabilidade persistente: <strong>indicação de laparotomia exploradora de urgência</strong> para controle da hemorragia (esplenectomia ou esplenorrafia, conforme achado intraoperatório).</li><li>Manutenção da temperatura corporal (líquidos aquecidos a ~40°C) para evitar a tríade letal (hipotermia, acidose, coagulopatia).</li></ul>",
            "variant": "green",
            "label": "Conduta"
          },
          {
            "tag": "Etapa 9 de 10",
            "title": "Evolução",
            "body": "<p>Em laparotomia, evidenciada <strong>laceração esplênica grau IV</strong> com sangramento ativo; realizada <strong>esplenectomia</strong>. Paciente recebeu 4 unidades de concentrado de hemácias, 4 de plasma fresco e 1 pool de plaquetas no intraoperatório. Estabilização hemodinâmica progressiva (PA 118/76 mmHg, FC 92 bpm ao final do procedimento). Encaminhado à UTI para monitorização pós-operatória, com lactato em queda nas primeiras 6 horas (indicador de reanimação eficaz).</p>",
            "variant": "blue",
            "label": "Evolução"
          },
          {
            "tag": "Etapa 10 de 10",
            "title": "Alta",
            "body": "<p>Evolução favorável em UTI, sem sinais de disfunção orgânica secundária. Transferido para enfermaria no 3º dia pós-operatório. Recebeu esquema vacinal para germes encapsulados (pneumococo, meningococo, Haemophilus influenzae) pela asplenia cirúrgica, com orientação sobre risco de sepse pós-esplenectomia. Alta hospitalar no 7º dia pós-operatório, com seguimento ambulatorial agendado.</p>",
            "variant": "green",
            "label": "Alta"
          }
        ]
      },
      {
        "id": "mapa-mental",
        "label": "🗺️ Mapa mental",
        "type": "checklist",
        "groups": [
          {
            "letter": "1",
            "color": "blue",
            "title": "Conceito",
            "body": "• ↓ Volume intravascular real<br>• ↓ Retorno venoso → ↓ débito cardíaco<br>• Hipoperfusão tecidual + hipóxia celular"
          },
          {
            "letter": "2",
            "color": "amber",
            "title": "Causas",
            "body": "• Hemorrágico (sangue total)<br>• Plasmático (queimaduras)<br>• Perda de água (desidratação)<br>• Misto (pancreatite grave)"
          },
          {
            "letter": "3",
            "color": "violet",
            "title": "Fisiopatologia",
            "body": "• Resposta neural (min) → catecolaminas<br>• Resposta intrínseca (h) → líquido intersticial → vascular<br>• Resposta humoral (dias) → ADH, renina, aldosterona<br>• Fases: isquêmica → estase → colapso"
          },
          {
            "letter": "4",
            "color": "red",
            "title": "Classificação (ATLS)",
            "body": "• Classe I: até 15% — sem sinais<br>• Classe II: 15–30% — hipotensão postural<br>• Classe III: 30–40% — hipotensão + taquicardia<br>• Classe IV: &gt;40% — risco iminente de morte"
          },
          {
            "letter": "5",
            "color": "teal",
            "title": "Quadro clínico",
            "body": "• Taquicardia, pele fria e pálida<br>• TEC &gt; 2s, oligúria<br>• PA: sinal tardio (cai só com 30–40% de perda)<br>• Veias jugulares planas (dif. de cardiogênico)"
          },
          {
            "letter": "6",
            "color": "teal",
            "title": "Tratamento",
            "body": "• Controlar a hemorragia (prioridade máxima)<br>• Cristaloides (Ringer lactato) → sangue precoce<br>• Hemoderivados 2:1:1 (hemácias:plasma:plaquetas)<br>• Ácido tranexâmico nas 3h iniciais<br>• Hipotensão permissiva até hemostasia"
          }
        ]
      },
      {
        "id": "flashcards",
        "label": "🃏 Flashcards",
        "type": "accordion",
        "items": [
          {
            "title": "Como se define o choque hipovolêmico?",
            "body": "Insuficiência circulatória aguda causada pela redução real do volume intravascular, suficiente para reduzir o retorno venoso e o débito cardíaco, comprometendo a perfusão e oxigenação tecidual.",
            "variant": "green",
            "label": "Resposta"
          },
          {
            "title": "Quais os 3 pilares clínicos/bioquímicos que definem o estado de choque?",
            "body": "Hipotensão arterial sistêmica, hipoperfusão tecidual (janelas cutânea, renal e neurológica) e elevação do lactato circulante.",
            "variant": "green",
            "label": "Resposta"
          },
          {
            "title": "Cite os 4 mecanismos básicos de classificação do choque circulatório.",
            "body": "Hipovolêmico, cardiogênico, obstrutivo e distributivo.",
            "variant": "green",
            "label": "Resposta"
          },
          {
            "title": "Quais são os 3 tipos de resposta fisiológica à perda de volume, e seus tempos?",
            "body": "Resposta neural/imediata (minutos), resposta intrínseca/intermediária (horas) e resposta humoral/tardia (dias).",
            "variant": "green",
            "label": "Resposta"
          },
          {
            "title": "Quais são as 3 fases da microcirculação no choque, segundo Chambers e Sweifach?",
            "body": "Fase isquêmica, fase de estase (estancamento) e fase de colapso.",
            "variant": "green",
            "label": "Resposta"
          },
          {
            "title": "Na Classe I de hemorragia (ATLS), qual a perda de sangue estimada e os sinais clínicos?",
            "body": "Até 750 mL (até 15% da volemia); geralmente sem manifestações clínicas significativas.",
            "variant": "green",
            "label": "Resposta"
          },
          {
            "title": "Na Classe III de hemorragia (ATLS), qual a perda estimada e os achados típicos?",
            "body": "1500–2000 mL (30–40% da volemia); hipotensão e taquicardia presentes, mecanismos compensatórios plenamente ativados.",
            "variant": "green",
            "label": "Resposta"
          },
          {
            "title": "Por que a pressão arterial é considerada um sinal tardio de hipovolemia?",
            "body": "Porque só cai depois que já se perdeu entre 30–40% da volemia — os mecanismos compensatórios a mantêm 'falsamente normal' nas fases iniciais.",
            "variant": "green",
            "label": "Resposta"
          },
          {
            "title": "Quais indicadores são mais sensíveis e precoces que a PA para detectar hipovolemia?",
            "body": "Tempo de enchimento capilar, frequência e características do pulso, e frequência respiratória.",
            "variant": "green",
            "label": "Resposta"
          },
          {
            "title": "Como diferenciar choque hipovolêmico de choque cardiogênico à beira do leito, pelas veias do pescoço?",
            "body": "No hipovolêmico as veias jugulares estão planas (colapsadas); no cardiogênico e no obstrutivo, distendidas (ingurgitadas).",
            "variant": "green",
            "label": "Resposta"
          },
          {
            "title": "Qual a diferença de perfusão cutânea entre choque hipovolêmico e choque medular (neurogênico)?",
            "body": "No hipovolêmico a pele é fria e pálida (vasoconstrição); no choque medular, a pele abaixo do nível da lesão permanece quente e rosada (perda do tônus simpático), sem taquicardia reflexa.",
            "variant": "green",
            "label": "Resposta"
          },
          {
            "title": "Qual solução cristaloide é a primeira escolha na reposição volêmica inicial do choque hemorrágico?",
            "body": "Ringer lactato (ou solução salina 0,9%).",
            "variant": "green",
            "label": "Resposta"
          },
          {
            "title": "Qual a regra prática de proporção cristaloide:sangue perdido na reposição inicial?",
            "body": "Até 3 mL de cristaloide por mL de sangue perdido, antes de iniciar a transfusão sanguínea.",
            "variant": "green",
            "label": "Resposta"
          },
          {
            "title": "Qual a proporção recomendada de hemoderivados na transfusão maciça?",
            "body": "Concentrado de hemácias : plasma fresco congelado : plaquetas = 2:1:1.",
            "variant": "green",
            "label": "Resposta"
          },
          {
            "title": "Qual o esquema de administração do ácido tranexâmico segundo o estudo CRASH-2?",
            "body": "1 g em bólus (10 min), seguido de 1 g em infusão nas 8 horas seguintes — idealmente nas primeiras 3 horas do trauma.",
            "variant": "green",
            "label": "Resposta"
          },
          {
            "title": "O que é 'hipotensão permissiva' e qual sua meta pressórica nas guias europeias (sem TCE)?",
            "body": "Estratégia de manter a PA deliberadamente baixa (PAS 80–100 mmHg) até o controle cirúrgico da hemorragia, evitando reposição agressiva que dilua fatores de coagulação e desloque coágulos.",
            "variant": "green",
            "label": "Resposta"
          },
          {
            "title": "Por que a hipotensão permissiva NÃO se aplica quando há trauma cranioencefálico associado?",
            "body": "Porque, nesse caso, é preciso manter a pressão de perfusão cerebral para evitar dano neurológico secundário.",
            "variant": "green",
            "label": "Resposta"
          },
          {
            "title": "Cite os 5 mecanismos da coagulopatia aguda associada ao trauma (CAAT).",
            "body": "Perda e diluição dos fatores, ativação excessiva da coagulação, fibrinólise, hipotermia e hipocalcemia (associada a acidose metabólica e anemia).",
            "variant": "green",
            "label": "Resposta"
          },
          {
            "title": "Quais são as contraindicações absolutas ao uso do pantalón neumático antishock (PNA)?",
            "body": "Edema pulmonar, ruptura diafragmática e disfunção do ventrículo esquerdo.",
            "variant": "green",
            "label": "Resposta"
          },
          {
            "title": "Qual o vasopressor de escolha no choque hemorrágico refratário, quando indicado?",
            "body": "Norepinefrina — mas seu uso é excepcional, reservado a risco iminente de morte, nunca substituindo a reposição volêmica.",
            "variant": "green",
            "label": "Resposta"
          }
        ]
      },
      {
        "id": "quiz",
        "label": "🧠 Quiz",
        "type": "quiz",
        "questions": [
          {
            "q": "Qual é o mecanismo fisiopatológico primário do choque hipovolêmico?",
            "options": [
              "Falha primária da bomba cardíaca",
              "Redução real do volume intravascular",
              "Vasodilatação sistêmica por mediadores inflamatórios",
              "Obstrução mecânica ao enchimento cardíaco"
            ],
            "correct": 1,
            "explain": "O choque hipovolêmico é causado por uma perda real de líquido intravascular, que reduz o retorno venoso e o débito cardíaco."
          },
          {
            "q": "Em um paciente com 35% de perda estimada da volemia, taquicardia de 128 bpm, PAS 88 mmHg e confusão mental, qual a classe de hemorragia (ATLS)?",
            "options": [
              "Classe I",
              "Classe II",
              "Classe III",
              "Classe IV"
            ],
            "correct": 2,
            "explain": "Perda de 30–40% da volemia, com hipotensão, taquicardia e alteração do estado mental corresponde à Classe III."
          },
          {
            "q": "Por que a pressão arterial é considerada um sinal tardio de hipovolemia?",
            "options": [
              "Porque os barorreceptores só atuam após 24h",
              "Porque só cai após perda de 30-40% da volemia, mascarada por mecanismos compensatórios",
              "Porque a PA não se altera no choque hipovolêmico",
              "Porque depende exclusivamente da função renal"
            ],
            "correct": 1,
            "explain": "Os mecanismos compensatórios (vasoconstrição, taquicardia) mantêm a PA 'falsamente normal' até que a perda de volume seja considerável."
          },
          {
            "q": "Qual achado ajuda a diferenciar choque hipovolêmico de choque cardiogênico à beira do leito?",
            "options": [
              "Temperatura corporal",
              "Estado das veias do pescoço (planas x distendidas)",
              "Cor da urina",
              "Presença de febre"
            ],
            "correct": 1,
            "explain": "No hipovolêmico as veias jugulares estão planas; no cardiogênico (e obstrutivo), distendidas por congestão venosa."
          },
          {
            "q": "No choque medular (neurogênico), por que a pele abaixo do nível da lesão permanece quente e rosada?",
            "options": [
              "Por vasoconstrição intensa",
              "Por perda do tônus simpático, com vasodilatação e perfusão preservada",
              "Por infecção secundária",
              "Por hipertermia maligna"
            ],
            "correct": 1,
            "explain": "A interrupção do tônus simpático abaixo do nível da lesão medular causa vasodilatação, mantendo a pele quente — ao contrário do choque hipovolêmico."
          },
          {
            "q": "Qual a solução cristaloide de escolha para reposição volêmica inicial no choque hemorrágico?",
            "options": [
              "Glicose 5%",
              "Ringer lactato",
              "Manitol 20%",
              "Albumina 25%"
            ],
            "correct": 1,
            "explain": "Ringer lactato (ou salina 0,9%) é a solução cristaloide de escolha na reposição inicial rápida."
          },
          {
            "q": "Qual a proporção recomendada de hemocomponentes em protocolo de transfusão maciça?",
            "options": [
              "1 hemácia : 1 plaquetas apenas",
              "4:1 hemácias:plasma",
              "2:1:1 (hemácias:plasma:plaquetas)",
              "Somente concentrado de hemácias"
            ],
            "correct": 2,
            "explain": "As guias recomendam a proporção 2:1:1 entre concentrado de hemácias, plasma fresco congelado e plaquetas."
          },
          {
            "q": "Segundo o estudo CRASH-2, qual o principal benefício do ácido tranexâmico administrado precocemente no choque hemorrágico?",
            "options": [
              "Aumento da pressão arterial imediato",
              "Redução da mortalidade, sem aumento de eventos tromboembólicos",
              "Substituição da necessidade de transfusão",
              "Efeito vasopressor direto"
            ],
            "correct": 1,
            "explain": "O CRASH-2 demonstrou redução de mortalidade com ácido tranexâmico administrado precocemente (idealmente nas 3 primeiras horas), sem aumento de complicações trombóticas."
          },
          {
            "q": "O que caracteriza a estratégia de 'hipotensão permissiva'?",
            "options": [
              "Elevar a PA o mais rápido possível a qualquer custo",
              "Manter uma PA deliberadamente mais baixa até o controle cirúrgico da hemorragia",
              "Usar apenas vasopressores, sem volume",
              "Aplicar exclusivamente em trauma cranioencefálico"
            ],
            "correct": 1,
            "explain": "A hipotensão permissiva evita reposição agressiva de volume antes do controle da hemorragia, prevenindo diluição de fatores de coagulação e deslocamento de coágulos — mas não se aplica quando há TCE associado."
          },
          {
            "q": "Quais são mecanismos da coagulopatia aguda associada ao trauma (CAAT)?",
            "options": [
              "Apenas hipertermia",
              "Perda/diluição de fatores, ativação excessiva da coagulação, fibrinólise, hipotermia e hipocalcemia",
              "Somente hipercalcemia",
              "Exclusivamente infecção"
            ],
            "correct": 1,
            "explain": "A CAAT resulta da combinação de perda/diluição de fatores, hipercoagulabilidade inicial seguida de fibrinólise, hipotermia e hipocalcemia por transfusão maciça."
          },
          {
            "q": "Qual das alternativas é uma contraindicação absoluta ao uso do pantalón neumático antishock (PNA)?",
            "options": [
              "Fratura de fêmur isolada",
              "Edema pulmonar",
              "Hipotensão leve",
              "Trauma de extremidades"
            ],
            "correct": 1,
            "explain": "Edema pulmonar, ruptura diafragmática e disfunção do ventrículo esquerdo são contraindicações absolutas ao PNA."
          },
          {
            "q": "Em qual fase da microcirculação (Chambers-Sweifach) os esfíncteres pré-capilares se abrem mas os pós-capilares permanecem fechados, aumentando a pressão hidrostática capilar?",
            "options": [
              "Fase isquêmica",
              "Fase de estase (estancamento)",
              "Fase de colapso",
              "Fase de reperfusão"
            ],
            "correct": 1,
            "explain": "Na fase de estase, a abertura seletiva dos esfíncteres pré-capilares sem abertura dos pós-capilares aumenta a pressão hidrostática e força líquido para o interstício."
          }
        ]
      }
    ]
  },
  "terms": {}
};
/* choque — cola abaixo apenas o módulo completo deste subtema.
   Não apagues esta inicialização. Ficheiro vazio mantém o conteúdo atual. */
window.BK_CONTENT = window.BK_CONTENT || {};

// COLE O TEU TEMA COMPLETO A PARTIR DAQUI.
