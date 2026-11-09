# Gestão Financeira — estudo de caso verificável

## Pergunta de negócio

Como comparar **resultado sintético realizado versus orçamento**, identificar meses com desvio relevante e estimar ponto de equilíbrio sob hipóteses explícitas de custos? Como garantir que filtros anuais/mensais/centros não alteram a reconciliação dos números?

## Fontes e escopo

Este projeto utiliza uma **base nova, totalmente sintética e determinística** gerada por [generate_data.py](../../generate_data.py), não pelo Power BI original da captura. O PBIX correspondente **não está disponível**. A interface web é HTML/SVG/JavaScript com regras documentadas em [METODOLOGIA.md](../METODOLOGIA.md). Sem ERP, banco ou fluxo de caixa reais.

Os registros cobrem 2025 e 2026, 3 centros (Comercial, Serviços, Operações), cinco categorias de movimentação e 72 metas mensais por centro. Todos os valores monetários são R$ fictícios.

## Visão geral

| Métrica | 2025 | 2026 |
| --- | ---: | ---: |
| Receita bruta | R$ 22.500.000,00 | R$ 25.650.000,00 |
| Deduções | R$ 2.250.000,00 | R$ 2.565.000,00 |
| Receita líquida | R$ 20.250.000,00 | R$ 23.085.000,00 |
| Custos | R$ 9.450.000,00 | R$ 10.255.500,00 |
| Despesas | R$ 4.050.000,00 | R$ 4.273.120,00 |
| Impostos *sintéticos* | R$ 2.250.000,00 | R$ 2.563.870,00 |
| Despesa total | R$ 15.750.000,00 | R$ 17.092.490,00 |
| Lucro calculado | R$ 4.500.000,00 | R$ 5.992.510,00 |
| Margem | 22,22% | 25,96% |
| Meta de lucro | R$ 5.400.000,03 | R$ 5.670.000,01 |
| Aderência ao lucro orçado | 83,33% | 105,69% |
| Classificação anual | Alto | Controlado |

Esses valores **não representam ganhos reais**, nem demonstram que uma empresa cresceu de 2025 para 2026. Foram gerados deliberadamente com montantes e pesos artificiais.

## Achado analítico — o anual esconde o mensal

No consolidado didático de **2026**, o lucro de R$ 5.992.510,00 excede a meta (aderência 105,69%), por isso o semáforo anual exibe **Controlado**. No entanto, a análise por mês revela:

| Mês de 2026 | Aderência | Classificação |
| --- | ---: | --- |
| Janeiro | 89,05% | Alto |
| Fevereiro | 91,92% | Atenção |
| Março | 103,84% | Controlado |
| Agosto | 78,37% | Alto |
| Setembro | 84,90% | Alto |
| Dezembro | 148,38% | Controlado |

**Interpretação correta:** meses de desempenho relativo diferente podem se compensar no total. Isso é uma característica construída do exercício, não uma evidência de reversão financeira real. Um gestor poderia priorizar a investigação das categorias e centros nos meses abaixo de 90%, preservando hipóteses de sazonalidade e composição.

## Ponto de equilíbrio — hipótese, não previsão

Em 2026:
- Receita bruta: R$ 25.650.000,00.
- Despesas fixas por hipótese: R$ 4.273.120,00.
- Custos variáveis por hipótese: Deduções + Custos + Impostos.
- Taxa de contribuição calculada sobre o bruto; receita bruta de equilíbrio estimada: **R$ 10.676.941,21**.

Esse cálculo só é válido sob a hipótese explícita de proporcionalidade dos componentes e despesas fixas. Sem fonte real dos custos e preços, **não** é estimativa confiável para empresa ou decisão de crédito.

## Bug de risco identificado em teste

Um ensaio com realizado e sem orçamento mostrou que a aplicação classificava o risco como Alto por comparação implícita `null < 0.9`. A revisão adicionou **Sem orçamento** quando a aderência não pode ser calculada, sem alterar o resultado dos recortes com metas. Isso demonstra teste de cenário-limite, correção localizada e preservação de regressões.

## Engenharia comprovada

- 360 movimentos e 72 metas gerados deterministicamente em centavos.
- Filtros por ano/mês/centro e recomposição de totais por 12 meses e três centros.
- 25 testes Node aprovados, incluindo regra de risco sem meta, valores agregados e identidades.
- Reexecução Python **em diretório temporário** que reproduziu byte a byte JSON/CSV versionados e verificou as cópias dos downloads públicos.
- Dashboard web real em [GitHub Pages](https://leandroaugferreira.github.io/dashboards/financeiro/), sem backend ou autenticação.
- [Guia de leitura interativo](https://leandroaugferreira.github.io/financeiro-case.html) com períodos 2025/2026 e alerta de meses em risco.

## Limitações para apresentar

PBIX financeiro ausente; não existe SQL, DAX executado, Power Query atualizado, fluxo de caixa real, recebimentos, contas a pagar, notas, conciliação, forecast ou resultado comercial. Os números são somente uma simulação construída; não houve avaliação econômica de uma companhia.

[15 perguntas](ENTREVISTA_TECNICA.md) · [Roteiro de três minutos](ROTEIRO_DEMO.md) · [Plano de evolução](PLANO_DE_MELHORIAS.md).
