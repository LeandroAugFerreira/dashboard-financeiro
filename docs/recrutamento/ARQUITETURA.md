# Gestão Financeira — arquitetura do código efetivamente auditado

## Pipeline sintético e web

~~~mermaid
flowchart LR
  INPUT[Parâmetros sintéticos fixos / Python stdlib] --> GEN[generate_data.py]
  GEN --> CSV[dados/*.csv - fontes geradas]
  GEN --> JSON[web/data.json - snapshot]
  CSV --> COPY[web/dados/*.csv - downloads]
  JSON --> MODEL[finance-model.mjs - cálculo financeiro]
  MODEL --> VIEW[finance.mjs + HTML/CSS/SVG]
  VIEW --> WEB[GitHub Pages - dashboard estático]
  JSON --> QA[Node Test Runner - 25 casos]
  GEN --> REPRO[Teste em diretório temporário]
  CSV --> REPRO
  JSON --> REPRO
  REPRO --> CI[GitHub Actions]
  QA --> CI
  PB[Captura antiga de Power BI] -.-> REF[Referência visual, não origem dos cálculos]
~~~

**Não existe conexão comprovada entre o PBIX da captura e os dados sintéticos atuais.** Nenhum backend ou serviço de negócio é executado no site.

## Cálculo sobre as linhas

~~~mermaid
flowchart TD
  MOV[360 lançamentos sintéticos] --> FILTER[Filtro ano/mês/centro]
  METAS[72 metas por mês/centro] --> FILTER
  FILTER --> GROUP[Somar categorias em centavos / 100]
  GROUP --> NET[Receita líquida = bruto - deduções]
  GROUP --> COSTS[Despesa total = custos + despesas + impostos]
  NET --> PROFIT[Lucro = receita líquida - despesa total]
  COSTS --> PROFIT
  PROFIT --> MARGIN[Margem = lucro / líquido]
  METAS --> ADHERENCE[Aderência = lucro / meta de lucro]
  PROFIT --> ADHERENCE
  GROUP --> BREAK[Ponto de equilíbrio: despesas fixas / taxa de contribuição]
  MARGIN --> RISK[Semáforo de risco]
  ADHERENCE --> RISK
  RISK --> UI[Indicadores e gráfico]
~~~

Os blocos representam regras de software, **não** um plano de contas oficial. Aderência é uma divisão com meta de lucro e é distinta da margem.

## Escopo e segurança

- [Gerador](../../generate_data.py): Python 3 com `decimal.Decimal`, CSV e JSON; sem redes, dependências extras ou dados privados.
- [Modelo](../../web/finance-model.mjs): `calculate(data,{year,month,center})`; retorna categorias, realizado e orçamento, margem, ponto de equilíbrio e risco.
- [Interface](../../web/finance.mjs): `fetch` local de `data.json` e `config.json`, SVG com DOM seguro, filtros; sem envio de eventos ao servidor.
- [Testes](../../tests/recrutamento.test.mjs): tabelas, recomposição, ano/mês/centro, orçamento, semáforo e casos sem dados.
- [Reprodutibilidade](../../scripts/verify_generator.py): copia o gerador para pasta temporária, gera arquivos e confere SHA-256 do JSON e CSV sem gravar fontes originais.

## Alteração de regra justificada

Quando existem receitas/despesas mas **não orçamento**, `adherence` é `null` e JavaScript o tratava como zero na comparação numérica, disparando risco Alto. O teste de regressão exige agora **Sem orçamento**. Isso não altera os limiares de risco com orçamento válido e não modifica `web/data.json`.

[Auditoria](AUDITORIA.md) · [Evidências](EVIDENCIAS.md).
