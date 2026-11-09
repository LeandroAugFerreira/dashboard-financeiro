# Gestão Financeira — auditoria técnica para recrutamento

**Base analisada:** `main` em 08/11/2026, commit `28ff06da64f1bdcd676e653a3992b39d05fbf608`. Revisão em branch separada, com cálculos, regressões e reprodução de dados. **Não é auditoria contábil, fiscal ou de empresas reais.**

## Parecer profissional

O Dashboard Financeiro é um **protótipo didático de análise financeira** com dados integralmente sintéticos e determinísticos em 2025–2026. A versão funcional usa HTML/CSS, módulos JavaScript e SVG para exibir indicadores filtráveis por ano, mês e centro, com orçado versus realizado, semáforo e ponto de equilíbrio. O gerador está em Python, e a reconciliação é verificada por Node Test Runner.

**Limitação estrutural fundamental:** o PBIX original correspondente ao dashboard da captura **não foi localizado**. A captura de Power BI já existente é referência visual, e os valores e fórmulas da web foram definidos especificamente para esta demonstração. **Não atribuir DAX, medidas Power BI originais, atualização Power Query ou uso de Power BI Desktop à versão sintética atual.** O dashboard web não executa DAX.

## Código efetivamente inspecionado

- [generate_data.py](../../generate_data.py): produção determinística de 360 movimentações e 72 orçamentos, alocação por mês/centro, arredondamento em centavos.
- [web/data.json](../../web/data.json), [dados/movimentacoes.csv](../../dados/movimentacoes.csv) e [dados/orcamento.csv](../../dados/orcamento.csv): fontes da demonstração, com indicador `synthetic=true`.
- [finance-model.mjs](../../web/finance-model.mjs): receita bruta, deduções, custos, despesas, impostos, resultado, metas, taxas e equilíbrio.
- [finance.mjs](../../web/finance.mjs), [finance.css](../../web/finance.css), [index.html](../../web/index.html): filtros e gráficos HTML/SVG.
- [METODOLOGIA.md](../METODOLOGIA.md), [VALIDACAO.md](../VALIDACAO.md), [finance.test.mjs](../../tests/finance.test.mjs).
- [recrutamento.test.mjs](../../tests/recrutamento.test.mjs) e [verify_generator.py](../../scripts/verify_generator.py): testes novos.
- [GitHub Actions](../../.github/workflows/tests.yml), [captura de referência anterior](../capturas/powerbi-referencia.png).

**Não executado:** Power BI Desktop, pipeline empresarial de ETL, ERP, gateway de pagamento, banco SQL ou análises de transações reais.

## Dados e granularidade

| Entidade | Quantidade | Regra |
| --- | ---: | --- |
| Movimentações | 360 | 2 anos × 12 meses × 3 centros × 5 categorias |
| Orçamentos | 72 | 2 anos × 12 meses × 3 centros |
| Centros | 3 | Comercial, Serviços, Operações |
| Categorias | 5 | Receita Bruta, Deduções, Custos, Despesas, Impostos |
| Período | 2025–2026 | 24 meses artificiais completos |
| Origem | 100% SINTETICO | Sem pessoas ou empresas reais |

Valores monetários são **R$**, conforme a metodologia do gerador. Não representam receita, lucro, caixa ou despesas efetivas de empresa.

## Definições das medidas

| Indicador | Regra implementada |
| --- | --- |
| Receita líquida | Receita Bruta − Deduções |
| Despesa total | Custos + Despesas + Impostos |
| Lucro sintético | Receita líquida − Despesa total |
| Margem realizada | Lucro / Receita líquida, `null` sem denominador |
| Margem orçada | Lucro-meta / Receita líquida-meta |
| Aderência | Lucro realizado / Lucro-meta; **não** margem |
| Ponto de equilíbrio (bruto) | Despesas fixas / (1 − (Deduções + Custos + Impostos) / Receita Bruta) |
| Risco | Alto com margem negativa ou aderência abaixo de 90%; Atenção entre 90% e 100%; Controlado a partir de 100% |
| Sem dados / Sem orçamento | Ausência de receita-base ou ausência de orçamento comparável |

A fórmula do ponto de equilíbrio considera deduções/custos/impostos **proporcionais ao faturamento bruto** e despesas operacionais como **fixas no recorte**. É um cenário didático de custo-volume-lucro, não prova de estrutura real de custos.

## Resultados efetivamente derivados da base

| Período | Receita bruta | Receita líquida | Despesa total | Lucro | Margem | Aderência |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 2025 | R$ 22.500.000,00 | R$ 20.250.000,00 | R$ 15.750.000,00 | R$ 4.500.000,00 | 22,22% | 83,33% |
| 2026 | R$ 25.650.000,00 | R$ 23.085.000,00 | R$ 17.092.490,00 | R$ 5.992.510,00 | 25,96% | 105,69% |
| Conjunto | R$ 48.150.000,00 | R$ 43.335.000,00 | R$ 32.842.490,00 | R$ 10.492.510,00 | 24,21% | 94,78% |

Os valores de 2025/2026 são **cálculos internos sintéticos**. Em 2026, embora o consolidado apareça como `Controlado`, janeiro, agosto e setembro estão classificados `Alto`, e fevereiro `Atenção`. Um total anual esconde desvios mensais.

## Defeito detectado e correção mínima

Originalmente, com resultado realizado e orçamento ausente, `adherence=null` era comparado a `0.9` em JavaScript. A conversão implícita de `null` para zero fazia o semáforo informar **Alto** mesmo sem meta para avaliação. O novo tratamento explícito retorna **“Sem orçamento”**; a interface exibe aviso adequado. As 360 movimentações, 72 metas, fórmulas com orçamento e classificação dos recortes do dataset permaneceram inalteradas. Regressão incluída nos testes novos.

## Riscos e limitações

- **Não há fluxo de caixa:** nenhum campo de vencimento/pagamento/recebimento, contas bancárias ou conciliação foi encontrado. Os rótulos genéricos de “fluxo de caixa” no portfólio devem ser descritos como **resultado gerencial demonstrativo**, não caixa.
- **Aderência pode ficar acima de 100% com lucro maior que meta** mesmo que a margem seja menor, pois os denominadores diferem.
- **Não somar taxas** de centros ou meses: recomputar a partir dos valores agregados; meses possuem pesos distintos.
- **Ausência de orçamento não implica risco Alto**: correção aplicada.
- O modelo atribui categorias proporcionais/fixas conforme regra sintética. Ponto de equilíbrio não é previsão validada nem lucro garantido.
- Nenhuma aplicação de normas fiscais, contábeis, imposto real ou ROI foi validada.
- Bases 2025–2026 não se atualizam; o relatório não é produção e não contém dados de clientes.
- A captura de Power BI não comprova que o modelo financeiro web reproduz o DAX original.

## Testes executados

[GitHub Actions #42543050313](https://github.com/LeandroAugFerreira/dashboard-financeiro/actions/runs/42543050313): **25 testes aprovados**, 6 originais e 19 novos. Script Python em diretório temporário reproduziu byte a byte o `web/data.json` e os dois CSV de origem e confirmou os dois CSV publicados em `web/dados`. Sem sobrescrever arquivos do repositório e sem usar arquivos particulares.

## Como usar na entrevista

“Desenvolvi/preparei um dashboard financeiro sintético que explica resultado, margem, orçamento e ponto de equilíbrio por ano, mês e centro. Reproduzi o gerador Python, reconciliei identidades e corrigi um caso de risco sem meta. Mostro por que 2026 consolida acima do plano, mas três meses ficaram abaixo de 90%.” **Não** alegar resultados comerciais, criação do PBIX ausente, DAX original ou fluxo de caixa real.

[Estudo de caso](ESTUDO_DE_CASO.md) · [Arquitetura](ARQUITETURA.md) · [Evidências](EVIDENCIAS.md).
