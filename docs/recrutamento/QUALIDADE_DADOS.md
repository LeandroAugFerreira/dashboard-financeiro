# Gestão Financeira — qualidade de dados e governança do protótipo

**Base:** 360 movimentações e 72 metas, 2025–2026. Todos os registros são fictícios, com marca `SINTETICO`, valor em centavos inteiros e datas de primeiro dia de cada mês. A geração é determinística, não é amostra de contas reais.

## Resultado da reconciliação

| Dimensão | Esperado | Confirmado por testes |
| --- | --- | --- |
| Anos | 2025 e 2026 | 2 anos completos da base |
| Meses | 12 por ano | 24 períodos |
| Centros | Comercial, Serviços, Operações | 3 |
| Categorias | Receita Bruta, Deduções, Custos, Despesas, Impostos | 5 |
| Movimentos | 2 × 12 × 3 × 5 | **360**, chave composta única |
| Orçamentos | 2 × 12 × 3 | **72**, chave composta única |
| Origem | SINTETICO | Todas as linhas |
| Valores | Inteiros em centavos, sem montantes negativos | Testado |
| Arquivos regenerados | JSON + CSV de origem | Comparados via SHA-256 em diretório temporário |
| Cópias de CSV para o site | web/dados/ | Iguais byte a byte às fontes dados/ |

## Semântica de indicadores

- Receita líquida = bruto − deduções, **não** recebimentos de caixa.
- Lucro = líquido − (custos + despesas + impostos). Não é lucro líquido de empresa auditada.
- Adesão/aderência = lucro realizado ÷ lucro orçado; metas financeiras são inventadas para este exercício.
- A meta de margem de 25% é declarada em cada orçamento. A validação por ano indica margem orçada próxima de 25%, sujeita a arredondamento de centavos.
- Ponto de equilíbrio pressupõe despesas como fixas e custos/deduções/impostos como proporcionais ao bruto. Pode falhar como estimativa se a realidade não seguir essas hipóteses.

## Risco do período agregado

A classificação anual de **2026** é `Controlado` (aderência aproximada de 105,69%), mas os meses de janeiro, agosto e setembro tiveram aderência inferior a 90% e sinal `Alto` na base fictícia. Fevereiro fica em `Atenção`. Não substituir a análise mensal pelo total anual; tampouco declarar que houve intervenção real de recuperação.

## Falha de fronteira identificada e corrigida

Em um caso **sintético criado só em teste** (realizado presente e `orcamento=[]`), a margem era válida mas a aderência `null`. A comparação JavaScript `null < .9` retornava `true` e disparava `Alto` sem que houvesse meta. A revisão definiu `Sem orçamento` nesse caso. A interface informa a ausência de referência; a linha de risco fica neutra. As faixas `Alto/Atenção/Controlado` do conjunto completo não sofreram alteração.

## Limites

- Os testes conferem esquema e identidades **desta versão congelada**, não dados externos.
- Não se verificou governança contábil, conciliação de caixa, balanço, passivo, estoque, inadimplência, tributos legais, forecast, séries históricas de clientes ou auditoria de controles internos.
- Não há datas de pagamento/recebimento nem informação bancária: **não chamar este cálculo de fluxo de caixa efetivo**.
- A captura de Power BI existente não é fonte do snapshot nem comprova equivalência com seu modelo DAX.
- Nenhum dado particular foi usado para os novos testes ou o guia.

## Evolução sem falsificar históricos

1. Preservar arquivos de origem e hashes antes de qualquer atualização.
2. Testar períodos faltantes, centros novos e categorias desconhecidas com políticas de ausência.
3. Distinguir no texto **resultado sintético realizado** de **meta sintética**; não atribuir dados a empresas.
4. Validar propriedades de orçamento como denominador estritamente positivo; não converter `null` em zero.
5. Se um dia houver fonte real, separar ambientes e permissões, criar ETL auditável, usar dados autorizados e redigir novo caso com resultados reais verificáveis.

[Auditoria](AUDITORIA.md) · [Evidências](EVIDENCIAS.md) · [Plano](PLANO_DE_MELHORIAS.md).
