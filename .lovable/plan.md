# Fase 4 do RAG — PDFs digitalizados (OCR)

## Respostas às tuas perguntas

**1. Que opções existem sem custo extra?**

- **Serviço externo pago (Google Vision, AWS Textract, OCR.space):** não é necessário. Não vou implementar nada disto, nem pedir chaves novas.
- **Tesseract.js no servidor:** inviável. O backend deste projeto corre num runtime tipo Cloudflare Worker: o Tesseract.js precisa de web workers com ficheiros WASM e dados de idioma resolvidos em runtime, e além disso seria preciso **rasterizar** as páginas do PDF em imagem — isso exige `canvas` nativo, que não existe neste runtime. Duas paredes.
- **Modelo de visão do gateway do Lovable:** viável e é o caminho certo. O mesmo `google/gemini-3.1-flash-lite` que o tutor já usa aceita imagem como entrada e lê texto de páginas digitalizadas com boa qualidade. Usa a credencial que já existe no projeto (`LOVABLE_API_KEY`) — **nenhuma chave nova tua**.
- **Onde rasterizar as páginas:** no browser do aluno, com o `pdf.js` que a app **já carrega** para o leitor integrado. Renderiza cada página para `<canvas>`, converte para JPEG e envia ao servidor. Zero dependências novas, zero infraestrutura.

**2. Custo.** Não há chave nem subscrição nova. Há consumo dos **créditos de IA do projeto**, tal como os embeddings já consomem hoje: cada página digitalizada é uma chamada de visão. O Flash Lite é o modelo mais barato do gateway, mas 200 páginas são 200 chamadas — por isso o OCR fica **manual**, nunca automático no upload (ver limites abaixo).

**3. Fluxo proposto**

```text
livro fica com index_status = 'no_text'
        v
 aparece botao "Ler texto das imagens (OCR)" na Minha Biblioteca
        v            (o aluno decide; nunca automatico)
 browser: pdf.js renderiza a pagina N -> canvas -> JPEG (~1400px, qualidade 0.75)
        v
 POST /api/books/ocr  { bookId, page, imageBase64 }   (token verificado no servidor)
        v
 servidor: gateway Lovable, modelo de visao -> texto da pagina
        v
 servidor: chunk + embedding + insert em book_chunks (mesmo pipeline de hoje)
        v
 barra de progresso "pagina N de M"; ao fim -> index_status = 'ready'
```

O aluno pode fechar e voltar: cada página guardada fica registada, e o processo retoma onde ficou.

**Isolamento por aluno:** inalterado. O `user_id` vem do token verificado no servidor, e o RLS de `book_chunks` continua a ser a segunda barreira.

**4. Viabilidade e limitações**

- **Tempo:** ~2 a 4 segundos por página (render + visão + embedding), com 2 páginas em paralelo. Um livro de 50 páginas: ~1 a 2 minutos com o separador aberto.
- **Precisão:** muito boa em digitalizações limpas de texto impresso; razoável em fotocópias tortas ou com ruído; fraca em manuscrito. Tabelas e figuras vêm descritas, não reproduzidas.
- **Limite proposto:** **150 páginas por livro** nesta fase (o limite de texto normal continua em 400), com aviso claro do número de páginas antes de começar e possibilidade de cancelar a meio.
- **Restrição real:** o OCR só corre com a app aberta, porque a rasterização acontece no browser. Se o aluno fechar o separador, o progresso fica guardado e o botão passa a "Continuar OCR".

## Detalhes técnicos

- Migração: em `user_books`, colunas `ocr_pages_done int default 0` e `ocr_total_pages int`; permitir `index_status = 'ocr'`.
- Nova rota `src/routes/api/books/ocr.ts`: valida token (mesmo `clientForRequest` das rotas RAG), aceita `{ bookId, page, image }`, chama o gateway com bloco `image_url` (data URL), reaproveita `chunkPages`/`embedTexts` de `src/lib/rag.server.ts` e faz upsert em `book_chunks` com `chunk_index` derivado da página. Trata 402/429 do gateway conforme o contrato do gateway (para e informa, sem repetir em loop).
- `public/app.html`: botão de OCR na etiqueta "Sem texto pesquisável", loop de páginas com `pdf.js` (já carregado), progresso e cancelamento. Sem alterações de design nem de CSS novo além de reutilizar os estilos das etiquetas existentes.
- Sem dependências novas.

## A confirmar

1. Avanço com este caminho (visão do gateway + rasterização no browser, sem chaves novas)?
2. Concordas com o OCR **manual por livro** (botão), em vez de automático no upload, para controlar gastos de créditos?
3. O limite de 150 páginas por livro serve?
