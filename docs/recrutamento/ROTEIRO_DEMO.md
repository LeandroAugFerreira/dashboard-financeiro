# Gestão Financeira — roteiro de apresentação de 3 minutos

**Premissa:** a base é 100% sintética, não representa uma empresa, e o dashboard web não foi gerado a partir do PBIX financeiro da captura (PBIX original não localizado).

## 00:00–00:25 — Pergunta de negócio

Abra [Gestão Financeira](https://leandroaugferreira.github.io/financeiro.html).

Fala: “Construí um caso sintético para demonstrar como acompanhar receita, resultado, margem e aderência ao orçamento por centro e mês. Não é um sistema de fluxo de caixa com pagamentos reais.”

## 00:25–00:55 — Engenharia e dados

Abra [arquitetura](ARQUITETURA.md) e o [gerador](../../generate_data.py).

Fala: “O gerador Python produz 360 lançamentos e 72 metas mensais por centro. Os valores são em centavos inteiros, alocados de modo determinístico; o teste de CI reproduz JSON/CSV byte a byte em pasta temporária.”

## 00:55–01:25 — Indicadores do ano

Abra [guia do case](https://leandroaugferreira.github.io/financeiro-case.html) e selecione 2026.

Fala: “A receita líquida é R$ 23.085.000,00 e o lucro sintético é R$ 5.992.510,00. Aderência mede lucro dividido por meta: 105,69%. Margem é outra taxa: 25,96%.”

## 01:25–01:55 — Ano esconde meses

Use a comparação mensal do guia e explique o consolidado versus janeiro, agosto e setembro.

Fala: “Embora o ano feche acima da meta, janeiro, agosto e setembro estão abaixo de 90% de aderência. Por isso não basta olhar o indicador anual sem decompor os períodos.”

## 01:55–02:25 — Ponto de equilíbrio e correção

Abra [finance-model.mjs](../../web/finance-model.mjs) e [teste](../../tests/recrutamento.test.mjs).

Fala: “O ponto de equilíbrio pressupõe despesas fixas e demais componentes proporcionais à receita bruta. Corrigi também uma classificação sem orçamento: antes, JavaScript convertia `null` implicitamente em zero e classificava Alto; agora informa ‘Sem orçamento’.”

## 02:25–03:00 — Prova e limites

Abra [GitHub Actions #42543050313](https://github.com/LeandroAugFerreira/dashboard-financeiro/actions/runs/42543050313).

Fala: “Os 25 testes Node passaram e o script Python reproduziu os arquivos. O PBIX original desta captura não estava disponível e não testei DAX nem dados empresariais. Não houve resultado comercial medido.”

## Se questionarem

- “É Power BI original?” — A captura anterior é referência; a web sintética **não é extração verificada do PBIX**.
- “Isso é fluxo de caixa?” — Não; não contém entradas/saídas liquidadas, data de pagamento ou saldo de contas.
- “Lucro de R$ 5,99 milhões foi real?” — Não, foi criado como dado sintético de demonstração.
- “Por que ‘Controlado’ no anual e ‘Alto’ em alguns meses?” — Porque agrega resultados e metas; as taxas mudam por período.
- “Qual prova de qualidade?” — Testes, geração isolada e comparação de hashes, não uma certificação contábil.

[Entrevista](ENTREVISTA_TECNICA.md) · [Evidências](EVIDENCIAS.md).
