# Gestão Financeira — 15 perguntas técnicas para entrevista de Dados/BI

Respostas baseadas no código, dados e CI; preparar-se para explicar decisões e contribuição pessoal. O conjunto é totalmente fictício. **PBIX original não localizado**; nunca alegar equivalência a DAX desse relatório.

## 1. Que problema o projeto resolve?
Permite explorar resultado financeiro **simulado** e comparar valores gerados com metas de orçamento por ano, mês e centro. Não é fluxo de caixa nem contabilidade de empresa.

## 2. Qual stack foi usada?
Python 3 (geração CSV/JSON com biblioteca padrão), JavaScript ES Modules para cálculos, HTML/CSS/SVG para visualização, Node 22 para testes e GitHub Pages. Uma captura prévia Power BI foi preservada, mas não originou os números do gerador.

## 3. Como são geradas as 360 movimentações?
Dois anos × 12 meses × 3 centros × cinco categorias, com valores anuais pré-definidos alocados por pesos mensais/centros e arredondamento com `Decimal` para centavos. [generate_data.py](../../generate_data.py).

## 4. O que representam as 72 metas?
Um registro por ano, mês e centro, com receita líquida orçada e lucro-meta. São fictícias, incluindo meta de margem de 25%.

## 5. Como se calcula a receita líquida?
`Receita Bruta − Deduções`. Em 2026, R$ 25.650.000 − R$ 2.565.000 = R$ 23.085.000. Não confundir com caixa recebido.

## 6. O que integra o resultado?
`Lucro = Receita líquida − (Custos + Despesas + Impostos)`. Em 2026: 23.085.000 − 17.092.490 = R$ 5.992.510. Não é lucro contábil auditado.

## 7. Margem e aderência são a mesma coisa?
Não. Margem usa `lucro / receita líquida`. Aderência usa `lucro / meta de lucro`; 2026 tem ~25,96% de margem e ~105,69% de aderência. [Modelo](../../web/finance-model.mjs).

## 8. Por que o ano controlado pode ter meses de risco alto?
O total 2026 supera o lucro-meta, mas janeiro/agosto/setembro ficam abaixo de 90%, fevereiro de 90% a 100%. O total agregado pode ocultar volatilidade mensal. [Estudo de caso](ESTUDO_DE_CASO.md).

## 9. Como funciona o ponto de equilíbrio?
Receita bruta de equilíbrio = despesas operacionais fixas / (1 − taxa variável de deduções, custos e impostos). Pressupõe proporcionalidade e positividade da contribuição; não é previsão validada com dados reais.

## 10. Por que não se somam percentuais dos centros?
São razões com denominadores diferentes. É preciso agregar os numeradores e denominadores e então calcular margem/aderência, não somar ou tirar média simples dos percentuais.

## 11. O que ocorre quando o filtro seleciona um ano ausente?
A API local de cálculo retorna zero para montantes (soma vazia) e `null` para margem/aderência/ponto de equilíbrio; risco `Sem dados`. Sem fabricá-los como 0%.

## 12. Qual defeito foi descoberto?
Se existia resultado sem orçamento, a expressão JavaScript `null < .9` classificava incorretamente como Alto. Adicionamos checagem explícita e status `Sem orçamento`, preservando os períodos que possuem metas. [Regressão](../../tests/recrutamento.test.mjs).

## 13. Como provou a reprodução dos dados?
O CI copiou `generate_data.py` para diretório temporário, gerou JSON/CSV e comparou hashes SHA-256 contra arquivos versionados; os downloads CSV no site também coincidiram. [Teste Python](../../scripts/verify_generator.py).

## 14. O que significam os 25 testes?
Seis anteriores + 19 novos de esquema, identidade, partições por mês/centro, orçamento, risco, equilíbrio e ausência de meta. Também há um script Python isolado, mas ele **não** é contado como um dos 25 testes Node. [Evidências](EVIDENCIAS.md).

## 15. O que falta para tornar o projeto mais forte?
Teste browser/a11y, dicionário de métricas, validação de orçamento incompleto e metas negativas, inclusão eventual de SQL para dados sintéticos e comparação com Power BI somente se o PBIX original for recuperado. Para um fluxo de caixa, seria necessário dados de recebimentos/pagamentos com datas e saldos.

---

## Exercício oral

Explique o caminho `gerador Python → centavos CSV/JSON → calculate() → dashboard SVG`. Mostre a conciliação de 2026, o cálculo de aderência do lucro, três meses abaixo da meta e por que `Sem orçamento` evita falso alarme. Separe indicadores gerenciais construídos dos dados contábeis não existentes.

Não declarar clientes, lucro, receita, economia, caixa, ERP ou Power BI Desktop reais.
