# Metodologia financeira sintética

Esta metodologia foi criada para a demonstração web por autorização do autor; não representa engenharia reversa do DAX do relatório financeiro original.

- Receita líquida = receita bruta − deduções.
- Despesa total = custos + despesas operacionais + impostos.
- Lucro = receita líquida − despesa total.
- Margem = lucro / receita líquida.
- Aderência = lucro realizado / lucro orçado. Meta = 100%; não confundir com a margem.
- Margem orçada = lucro orçado / receita líquida orçada.
- Ponto de equilíbrio em receita bruta = despesas operacionais / (1 − taxa de deduções − taxa de custos − taxa de impostos), considerando os componentes proporcionais à receita e as despesas operacionais fixas no recorte. Sem margem de contribuição positiva, o equilíbrio fica indisponível.
- Risco: Alto se margem negativa ou aderência <90%; Atenção entre 90% e 100%; Controlado a partir de 100%; Sem dados quando faltam bases para cálculo.

O gerador distribui montantes anuais por pesos mensais e centros, com arredondamento em centavos e ajuste do resíduo na última parcela. Não usa aleatoriedade, contas reais ou dados pessoais. Os filtros usam o mesmo período/centro para realizado e orçamento. Valores monetários são BRL; taxas e ausência de dados não são convertidas em zero.

Em 2026: receita bruta 25.650.000,00; receita líquida 23.085.000,00; despesa total 17.092.490,00; lucro 5.992.510,00. São números fictícios desta demonstração, não resultados reais de uma empresa.


## Complemento de definições e QA — 08/11/2026

O resultado anual sintetizado para 2026 tem aderência ao **lucro-meta** de aproximadamente 105,69% (`lucro / lucro_meta`), que não deve ser confundida com margem (`lucro / receita_liquida`). A mesma base produz classificações de risco **Alto** em janeiro, agosto e setembro de 2026, apesar do consolidado Controlado. O risco é comparativo e baseado em regras didáticas, não em fatos empresariais.

Os testes adicionais detectaram e corrigiram um caso sem orçamento: `adherence=null` não é mais convertido implicitamente em zero no semáforo. Se não há base de lucro-meta e a margem é não negativa, o status é `Sem orçamento`; se a margem é negativa, o risco permanece `Alto`. O dataset congelado atual mantém todas as metas.

O gerador Python foi reexecutado **em diretório temporário** por um script novo e o conteúdo de `web/data.json` e os CSV foi comparado byte a byte aos originais com SHA-256. Não se executou o gerador na pasta do projeto e não houve atualização de dados. [Testes](../tests/recrutamento.test.mjs) · [Evidências](recrutamento/EVIDENCIAS.md).

**Nomenclatura:** o modelo não registra eventos de pagamento, recebimento nem saldos bancários. Receitas e despesas são rubricas sintéticas; portanto, não constituem fluxo de caixa real. O PBIX da captura não está disponível, e não se deve atribuir essas métricas a DAX desse relatório.
