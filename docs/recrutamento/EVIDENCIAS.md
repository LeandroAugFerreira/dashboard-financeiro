# Gestão Financeira — inventário de evidências

**CI efetivamente executado:** [GitHub Actions #42543050313](https://github.com/LeandroAugFerreira/dashboard-financeiro/actions/runs/42543050313), commit `71e6575ac4dd316505534c555a3611a95b083b6b`.

## Testes executados

- **25 testes Node.js aprovados e zero falhas**, sendo seis originais e **19 novos** em [tests/recrutamento.test.mjs](../../tests/recrutamento.test.mjs).
- **Reprodução Python aprovada** em [scripts/verify_generator.py](../../scripts/verify_generator.py), separada dos testes Node: copiou `generate_data.py` para diretório temporário, executou Python e comparou SHA-256 dos novos arquivos com `web/data.json`, `dados/movimentacoes.csv` e `dados/orcamento.csv`.
- O script também comparou as versões `web/dados/*.csv` com as fontes `dados/*.csv`; ambos downloads publicados correspondem byte a byte aos arquivos canônicos do repositório.
- Nenhuma geração foi executada dentro da pasta de trabalho principal, nenhuma fonte original foi alterada pelo script, nenhum serviço externo/credencial/dado privado foi usado.

## Casos verificados nos 19 novos testes

1. Esquema sintético, 360 movimentações, 72 metas e três centros.
2. Grade completa única de anos × meses × centros × cinco categorias.
3. Orçamento com uma chave única por ano/mês/centro.
4. IDs, marca SINTETICO, centavos inteiros e datas com estrutura controlada.
5. Receita bruta 2025/2026 e total combinado.
6. Valores de 2025, margem e aderência 83,33%.
7. Componentes da receita líquida/despesas e lucro de 2026.
8. 2026 anual controlado versus janeiro/agosto/setembro altos, fevereiro atenção.
9. Conjunto 2025+2026 como atenção: não mascara período 2025 alto.
10. Partições por 12 meses para os componentes e metas.
11. Partições por três centros para realizado e orçamento.
12. Soma independente de centavos para lucro/receita.
13. Margem orçada em torno de 25%, respeitando arredondamento.
14. Aderência distinta de margem e de atingimento de receita.
15. Identidade matemática do ponto de equilíbrio e taxa de contribuição por ano.
16. Filtro mensal e três centros sem misturar registros.
17. Ano ausente retorna zero apenas para montantes e `null` para taxas/ponto de equilíbrio.
18. **Sem orçamento** não recebe classificação de alto risco sem meta; regressão da correção.
19. Consistência de categorias, centros e calendário nos dois anos.

## Erro encontrado durante o trabalho

O primeiro ensaio de branch [#42542930444](https://github.com/LeandroAugFerreira/dashboard-financeiro/actions/runs/42542930444) falhou **em um teste novo** por uma suposição inicialmente incorreta sobre a coerção JavaScript de `null`; mostrou que `null < 0.9` resulta verdadeiro. A análise levou à correção localizada em `finance-model.mjs`/interface e à troca da expectativa do teste para `Sem orçamento`. O [run #42543050313](https://github.com/LeandroAugFerreira/dashboard-financeiro/actions/runs/42543050313) ficou **inteiramente verde** após a correção. Não ocultar essa sequência em entrevista: demonstra depuração baseada em evidência.

## Resultados de referência

| Recorte sintético | Lucro | Meta de lucro | Aderência | Risco |
| --- | ---: | ---: | ---: | --- |
| 2025 | R$ 4.500.000,00 | R$ 5.400.000,03 | 83,33% | Alto |
| 2026 | R$ 5.992.510,00 | R$ 5.670.000,01 | 105,69% | Controlado |
| Total | R$ 10.492.510,00 | R$ 11.070.000,04 | 94,78% | Atenção |

## Evidência histórica separada

[docs/VALIDACAO.md](../VALIDACAO.md): seis testes originais e inspeção visual local em revisão anterior. A [captura Power BI](../capturas/powerbi-referencia.png) é referência do dashboard anterior, **não** screenshot do novo gerador sintético.

## O que não foi testado agora

- Motor DAX, Power BI Desktop, PBIX original financeiro ou Power Query do relatório da captura.
- SQL, base de dados empresarial, caixa, recebimentos, pagamentos ou conciliação.
- Browser real/Playwright/visual pixel a pixel, responsividade em dispositivos físicos ou testes completos de acessibilidade.
- Crescimento, economia, margem, redução de custo ou resultado de uma empresa real.

## Acesso ao case

[Dashboard funcional](https://leandroaugferreira.github.io/dashboards/financeiro/) · [Guia de leitura](https://leandroaugferreira.github.io/financeiro-case.html) · [Código testado](../../web/finance-model.mjs) · [Testes](../../tests/recrutamento.test.mjs).

[Auditoria](AUDITORIA.md) · [Roteiro](ROTEIRO_DEMO.md).
